import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../PageHeader';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Users,
  Activity,
  Eye,
  Settings
} from 'lucide-react';
import * as THREE from 'three';

const OpenPitMine3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const mineRef = useRef(null);
  const animationIdRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [cameraHeight, setCameraHeight] = useState([80]);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [showPersonnel, setShowPersonnel] = useState(true);
  const [showEquipment, setShowEquipment] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  // Mock data for visualization
  const mockData = {
    personnel: [
      { x: -15, y: -8, z: -20, count: 4, risk: 'low' },
      { x: 20, y: -16, z: -25, count: 6, risk: 'medium' },
      { x: -10, y: -24, z: -15, count: 3, risk: 'high' },
      { x: 15, y: -32, z: -20, count: 2, risk: 'critical' }
    ],
    equipment: [
      { x: -25, y: -8, z: -15, type: 'excavator', status: 'active' },
      { x: 30, y: -16, z: -20, type: 'truck', status: 'active' },
      { x: 10, y: -24, z: -25, type: 'drill', status: 'maintenance' }
    ]
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xFFFFFF, 300, 800); // Clean white fog
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(80, 60, 80);
    camera.lookAt(0, -30, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0xFFFFFF, 1); // Clean white background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -150;
    directionalLight.shadow.camera.right = 150;
    directionalLight.shadow.camera.top = 150;
    directionalLight.shadow.camera.bottom = -150;
    scene.add(directionalLight);

    // FIXED MINE CREATION - NO GREEN GROUND SLAB
    const createOpenPitMine = () => {
      const mineGroup = new THREE.Group();

      // Mine parameters
      const levels = 8;
      const benchHeight = 8;
      const topRadius = 60;
      const bottomRadius = 8;

      // REMOVED THE GREEN GROUND SURFACE COMPLETELY
      // No ground slab - pit starts directly at surface level

      // Create each level as SOLID GEOMETRY
      for (let level = 0; level < levels; level++) {
        const y = -level * benchHeight;
        const levelProgress = level / (levels - 1);

        // Calculate radii for this level
        const currentRadius = topRadius - (topRadius - bottomRadius) * levelProgress;
        const nextRadius = level < levels - 1
          ? topRadius - (topRadius - bottomRadius) * ((level + 1) / (levels - 1))
          : bottomRadius;

        // CREATE SOLID BENCH SURFACE using ExtrudeGeometry
        const ringShape = new THREE.Shape();
        ringShape.absarc(0, 0, currentRadius, 0, Math.PI * 2, false);
        const ringHole = new THREE.Shape();
        ringHole.absarc(0, 0, nextRadius, 0, Math.PI * 2, true);
        ringShape.holes.push(ringHole);

        const ringGeometry = new THREE.ExtrudeGeometry(ringShape, {
          depth: 2,
          bevelEnabled: false
        });

        const benchMaterial = new THREE.MeshLambertMaterial({
          color: new THREE.Color(0.6, 0.45, 0.3)
        });

        const benchRing = new THREE.Mesh(ringGeometry, benchMaterial);
        benchRing.rotation.x = -Math.PI / 2;
        benchRing.position.y = y - 1;
        benchRing.receiveShadow = true;
        benchRing.castShadow = true;
        mineGroup.add(benchRing);

        // CREATE VERTICAL BENCH FACE
        if (level < levels - 1) {
          const faceGeometry = new THREE.CylinderGeometry(
            nextRadius + 0.1,
            nextRadius + 0.1,
            benchHeight * 0.8,
            32,
            1,
            true
          );

          let faceColor;
          if (level < 2) {
            faceColor = new THREE.Color(0.7, 0.5, 0.35);
          } else if (level < 4) {
            faceColor = new THREE.Color(0.6, 0.4, 0.3);
          } else if (level < 6) {
            faceColor = new THREE.Color(0.5, 0.35, 0.25);
          } else {
            faceColor = new THREE.Color(0.4, 0.3, 0.2);
          }

          const faceMaterial = new THREE.MeshLambertMaterial({
            color: faceColor,
            side: THREE.DoubleSide
          });

          const face = new THREE.Mesh(faceGeometry, faceMaterial);
          face.position.y = y - benchHeight * 0.6;
          face.castShadow = true;
          face.receiveShadow = true;
          mineGroup.add(face);
        }

        // Add haul roads as visible box geometry
        if (level % 2 === 0 && level < levels - 1) {
          const roadGeometry = new THREE.BoxGeometry(12, 1, 40);
          const roadMaterial = new THREE.MeshLambertMaterial({
            color: new THREE.Color(0.3, 0.25, 0.2)
          });
          const road = new THREE.Mesh(roadGeometry, roadMaterial);
          road.position.set(currentRadius - 6, y - 0.5, 0);
          road.rotation.y = level * Math.PI / 4;
          road.castShadow = true;
          road.receiveShadow = true;
          mineGroup.add(road);
        }
      }

      // Keep only the pit bottom (not a slab on top)
      const bottomGeometry = new THREE.CylinderGeometry(bottomRadius, bottomRadius, 1, 16);
      const bottomMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0.3, 0.25, 0.2)
      });
      const pitBottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
      pitBottom.position.y = -levels * benchHeight - 0.5;
      pitBottom.receiveShadow = true;
      mineGroup.add(pitBottom);

      console.log('Mine group created with', mineGroup.children.length, 'objects - NO GROUND SLAB');
      return mineGroup;
    };

    // Add personnel indicators
    const addPersonnel = () => {
      const personnelGroup = new THREE.Group();
      personnelGroup.name = 'personnel';

      mockData.personnel.forEach((person) => {
        const geometry = new THREE.ConeGeometry(1.5, 4, 8);
        let color;
        switch (person.risk) {
          case 'critical': color = new THREE.Color(0.9, 0.1, 0.1); break;
          case 'high': color = new THREE.Color(0.95, 0.5, 0.1); break;
          case 'medium': color = new THREE.Color(0.95, 0.8, 0.1); break;
          default: color = new THREE.Color(0.1, 0.8, 0.3);
        }

        const material = new THREE.MeshLambertMaterial({ color });
        const cone = new THREE.Mesh(geometry, material);
        cone.position.set(person.x, person.y + 2, person.z);
        cone.castShadow = true;

        // Add count label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 64;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 64, 64);
        context.fillStyle = '#000000';
        context.font = 'bold 32px Arial';
        context.textAlign = 'center';
        context.fillText(person.count.toString(), 32, 42);

        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const label = new THREE.Sprite(labelMaterial);
        label.position.set(person.x, person.y + 6, person.z);
        label.scale.set(4, 4, 1);

        personnelGroup.add(cone);
        personnelGroup.add(label);
      });

      return personnelGroup;
    };

    // Add equipment indicators
    const addEquipment = () => {
      const equipmentGroup = new THREE.Group();
      equipmentGroup.name = 'equipment';

      mockData.equipment.forEach((equip) => {
        let geometry, material;

        switch (equip.type) {
          case 'excavator':
            geometry = new THREE.BoxGeometry(6, 3, 4);
            material = new THREE.MeshLambertMaterial({
              color: equip.status === 'active' ? new THREE.Color(0.95, 0.75, 0.1) : new THREE.Color(0.5, 0.5, 0.5)
            });
            break;
          case 'truck':
            geometry = new THREE.BoxGeometry(5, 2.5, 8);
            material = new THREE.MeshLambertMaterial({
              color: equip.status === 'active' ? new THREE.Color(0.2, 0.5, 0.9) : new THREE.Color(0.5, 0.5, 0.5)
            });
            break;
          case 'drill':
            geometry = new THREE.CylinderGeometry(1.5, 1.5, 6);
            material = new THREE.MeshLambertMaterial({
              color: equip.status === 'active' ? new THREE.Color(0.9, 0.3, 0.1) : new THREE.Color(0.5, 0.5, 0.5)
            });
            break;
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(equip.x, equip.y, equip.z);
        mesh.castShadow = true;
        equipmentGroup.add(mesh);
      });

      return equipmentGroup;
    };

    // Build the scene
    const mine = createOpenPitMine();
    const personnel = addPersonnel();
    const equipment = addEquipment();

    mineRef.current = mine;
    scene.add(mine);
    scene.add(personnel);
    scene.add(equipment);

    // Mouse controls
    const handleMouseMove = (event) => {
      if (!isDragging || !mine) return;

      const deltaX = event.clientX - lastMousePosition.x;
      const deltaY = event.clientY - lastMousePosition.y;

      const rotationSpeed = 0.005;
      mine.rotation.y += deltaX * rotationSpeed;
      mine.rotation.x += deltaY * rotationSpeed;

      mine.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, mine.rotation.x));

      setLastMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseDown = (event) => {
      setIsDragging(true);
      setLastMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (event) => {
      event.preventDefault();
      const zoom = event.deltaY * 0.05;
      const distance = Math.sqrt(camera.position.x * camera.position.x + camera.position.z * camera.position.z);
      const newDistance = Math.max(40, Math.min(200, distance + zoom));
      const angle = Math.atan2(camera.position.z, camera.position.x);
      camera.position.x = Math.cos(angle) * newDistance;
      camera.position.z = Math.sin(angle) * newDistance;
      camera.lookAt(0, -30, 0);
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      if (autoRotate && mine) {
        mine.rotation.y += 0.005;
      }

      if (cameraRef.current) {
        cameraRef.current.position.y = cameraHeight[0];
        cameraRef.current.lookAt(0, -30, 0);
      }

      if (personnel) personnel.visible = showPersonnel;
      if (equipment) equipment.visible = showEquipment;

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.removeEventListener('mousemove', handleMouseMove);
        rendererRef.current.domElement.removeEventListener('mousedown', handleMouseDown);
        rendererRef.current.domElement.removeEventListener('mouseup', handleMouseUp);
        rendererRef.current.domElement.removeEventListener('wheel', handleWheel);
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [isDragging, cameraHeight, showPersonnel, showEquipment, autoRotate]);

  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(80, 60, 80);
      cameraRef.current.lookAt(0, -30, 0);
      setCameraHeight([60]);
    }
    if (mineRef.current) {
      mineRef.current.rotation.set(0, 0, 0);
    }
  };

  const zoomIn = () => {
    if (cameraRef.current) {
      const distance = Math.sqrt(
        cameraRef.current.position.x * cameraRef.current.position.x +
        cameraRef.current.position.z * cameraRef.current.position.z
      );
      const newDistance = Math.max(30, distance - 15);
      const angle = Math.atan2(cameraRef.current.position.z, cameraRef.current.position.x);
      cameraRef.current.position.x = Math.cos(angle) * newDistance;
      cameraRef.current.position.z = Math.sin(angle) * newDistance;
      cameraRef.current.lookAt(0, -30, 0);
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      const distance = Math.sqrt(
        cameraRef.current.position.x * cameraRef.current.position.x +
        cameraRef.current.position.z * cameraRef.current.position.z
      );
      const newDistance = Math.min(200, distance + 15);
      const angle = Math.atan2(cameraRef.current.position.z, cameraRef.current.position.x);
      cameraRef.current.position.x = Math.cos(angle) * newDistance;
      cameraRef.current.position.z = Math.sin(angle) * newDistance;
      cameraRef.current.lookAt(0, -30, 0);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader
        title="3D Mine View"
        description="Interactive 3D visualization of mine structure and operations"
      >
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-700 dark:text-green-400 border-green-300 dark:border-green-600">
            <Activity className="w-3 h-3 mr-1" />
            Interactive 3D
          </Badge>
        </div>
      </PageHeader>

      {/* Main 3D View and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Visualization */}
        <Card className="lg:col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900 dark:text-gray-100">
              <span className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Interactive Mine Visualization
              </span>
              <div className="flex space-x-2">
                <Button
                  variant={autoRotate ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoRotate(!autoRotate)}
                >
                  {autoRotate ? 'Auto-Rotating' : 'Auto-Rotate'}
                </Button>
                <Button variant="outline" size="sm" onClick={resetView}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset View
                </Button>
                <Button variant="outline" size="sm" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4 mr-1" />
                  Zoom In
                </Button>
                <Button variant="outline" size="sm" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4 mr-1" />
                  Zoom Out
                </Button>
              </div>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Interactive 3D visualization with real-time data overlay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={mountRef}
              className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden cursor-grab active:cursor-grabbing shadow-inner"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            />
          </CardContent>
        </Card>

        {/* Controls Panel */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                <Settings className="mr-2 h-4 w-4" />
                View Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Camera Height: {cameraHeight[0]}m
                </label>
                <Slider
                  value={cameraHeight}
                  onValueChange={setCameraHeight}
                  max={120}
                  min={20}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Options</label>
                <div className="space-y-1">
                  <Button
                    variant={showPersonnel ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPersonnel(!showPersonnel)}
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Personnel {showPersonnel ? "ON" : "OFF"}
                  </Button>
                  <Button
                    variant={showEquipment ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowEquipment(!showEquipment)}
                    className="w-full justify-start"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Equipment {showEquipment ? "ON" : "OFF"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm text-gray-900 dark:text-gray-100">Mine Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>✅ Real-time data</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Personnel tracking</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Equipment status</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Safety zones</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Risk assessment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OpenPitMine3D;
