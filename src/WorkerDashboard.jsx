import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { useTheme } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import * as d3 from 'd3';
import {
  Shield,
  AlertTriangle,
  MapPin,
  Phone,
  Camera,
  Navigation,
  LogOut,
  Wifi,
  Clock,
  Users,
  Thermometer,
  Eye,
  Zap,
  Activity,
  User,
  HardHat,
  Wind,
  Droplets,
  Battery,
  Signal,
  Wrench,
  Flag,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { mockPersonnel, mockSectors, mockAlerts, mockEvacuationRoutes, getRiskColor, mockWeatherData } from './mockData';
import { useMine } from './contexts/MineContext';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [currentSector] = useState('B-12');
  const [gasLevels, setGasLevels] = useState({ co: 12, ch4: 5, o2: 20.8 });
  const [equipmentStatus, setEquipmentStatus] = useState({
    helmet: 'operational',
    vest: 'operational',
    boots: 'operational',
    respirator: 'warning'
  });

  const { currentMine } = useMine();

  // Find current sector data
  const sectorData = mockSectors.find(s => s.id === currentSector) || mockSectors[0];
  const criticalAlerts = mockAlerts.filter(alert => alert.priority === 'critical').length;

  // Generate heatmap data based on current mine
  const heatmapData = useMemo(() => {
    const width = 500;
    const height = 400;
    const data = [];

    // Create a grid for the heatmap
    for (let x = 0; x < width; x += 12) {
      for (let y = 0; y < height; y += 12) {
        // Normalize coordinates
        const nx = (x - width / 2) / (width / 2);
        const ny = (y - height / 2) / (height / 2);

        // Create irregular pit shape (not circular)
        const pitShape = Math.pow(nx, 2) * 1.2 + Math.pow(ny, 2) * 0.8 +
          0.3 * Math.sin(nx * 3) * Math.cos(ny * 2) +
          0.2 * Math.cos(nx * 4) * Math.sin(ny * 3);

        if (pitShape < 1.2) { // Inside mine area
          // Calculate risk based on position and depth
          const centerDistance = Math.sqrt(nx * nx + ny * ny);
          const baseRisk = 0.2 + centerDistance * 0.6; // Higher risk near edges

          // Use mine-specific hotspots
          let riskValue = baseRisk;
          if (currentMine.heatmapData && currentMine.heatmapData.hotspots) {
            currentMine.heatmapData.hotspots.forEach(hotspot => {
              const distance = Math.sqrt((x - hotspot.x) ** 2 + (y - hotspot.y) ** 2);
              const influence = hotspot.intensity * Math.exp(-distance / 50);
              riskValue += influence;
            });
          }

          riskValue = Math.max(0, Math.min(1, riskValue));

          data.push({
            x: x,
            y: y,
            value: riskValue,
            risk: Math.round(riskValue * 100)
          });
        }
      }
    }

    return data;
  }, [currentMine]);

  // D3 Heatmap Component for worker dashboard
  const D3Heatmap = React.memo(({ data, width = 500, height = 400 }) => {
    const svgRef = React.useRef();

    React.useEffect(() => {
      if (!data || data.length === 0) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      // Create simplified grid for better performance
      const gridSize = 12;
      const rows = Math.ceil(height / gridSize);
      const cols = Math.ceil(width / gridSize);

      // Create a grid of rectangles instead of contours for better performance
      const riskGrid = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * gridSize;
          const y = row * gridSize;

          // Find closest data point
          let closestRisk = 0;
          let minDistance = Infinity;

          data.forEach(d => {
            const distance = Math.sqrt((d.x - x) ** 2 + (d.y - y) ** 2);
            if (distance < minDistance) {
              minDistance = distance;
              closestRisk = d.value;
            }
          });

          riskGrid.push({ x, y, risk: closestRisk });
        }
      }

      // Draw risk grid with mine pit colors
      svg.selectAll('.risk-cell')
        .data(riskGrid)
        .enter()
        .append('rect')
        .attr('class', 'risk-cell')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('width', gridSize)
        .attr('height', gridSize)
        .attr('fill', d => {
          // Enhanced mine pit color mapping
          if (d.risk < 0.2) return '#4ade80'; // Green for very low risk
          if (d.risk < 0.4) return '#a3e635'; // Light green for low risk  
          if (d.risk < 0.6) return '#fbbf24'; // Yellow for medium risk
          if (d.risk < 0.8) return '#f97316'; // Orange for high risk
          return '#ef4444'; // Red for critical risk
        })
        .attr('opacity', 0.8)
        .attr('stroke', 'none');

      // Add mine boundary with improved styling
      svg.append('path')
        .attr('d', `M 50,80 Q 80,60 120,70 Q 180,50 240,80 Q 300,60 350,90 Q 380,130 370,180 Q 360,230 330,260 Q 280,290 220,280 Q 160,285 110,260 Q 70,230 60,180 Q 55,130 50,80 Z`)
        .attr('fill', 'none')
        .attr('stroke', '#654321')
        .attr('stroke-width', 3)
        .attr('opacity', 0.9)
        .attr('stroke-dasharray', '5,3');

      // Add critical risk indicators
      const criticalPoints = data.filter(d => d.value > 0.8);
      svg.selectAll('.critical-point')
        .data(criticalPoints)
        .enter()
        .append('circle')
        .attr('class', 'critical-point')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 5)
        .attr('fill', '#DC143C')
        .attr('opacity', 0.9)
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1.5);

      // Add sector labels with better styling
      const sectors = [
        { x: 100, y: 100, label: 'North', risk: 'Medium' },
        { x: 300, y: 120, label: 'East', risk: 'High' },
        { x: 250, y: 250, label: 'South', risk: 'Low' },
        { x: 80, y: 200, label: 'West', risk: 'Critical' }
      ];

      sectors.forEach(sector => {
        // Add background for labels
        svg.append('rect')
          .attr('x', sector.x - 25)
          .attr('y', sector.y - 15)
          .attr('width', 50)
          .attr('height', 20)
          .attr('fill', 'rgba(255, 255, 255, 0.9)')
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .attr('rx', 3);

        svg.append('text')
          .attr('x', sector.x)
          .attr('y', sector.y - 2)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .attr('fill', '#333')
          .text(sector.label);
      });

      // Add current worker position indicator
      svg.append('circle')
        .attr('cx', 200)
        .attr('cy', 150)
        .attr('r', 8)
        .attr('fill', '#3b82f6')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 2);

      svg.append('text')
        .attr('x', 200)
        .attr('y', 154)
        .attr('text-anchor', 'middle')
        .attr('font-size', '8px')
        .attr('font-weight', 'bold')
        .attr('fill', '#FFFFFF')
        .text('YOU');

      // Only re-run when data string changes, not on every render
    }, [JSON.stringify(data)]); // Use JSON.stringify to properly compare array contents

    return (
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-inner"
      />
    );
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEmergency = () => {
    // In real app, this would trigger immediate emergency protocols
    alert('Emergency alert sent to control center!');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const getRiskStatusColor = (level) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-amber-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskStatusText = (level) => {
    switch (level) {
      case 'low': return 'SAFE';
      case 'medium': return 'CAUTION';
      case 'high': return 'DANGER';
      default: return 'UNKNOWN';
    }
  };

  const getEquipmentStatusIcon = (status) => {
    if (status === 'operational') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'warning') return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getEquipmentStatusColor = (status) => {
    if (status === 'operational') return 'text-green-700 dark:text-green-300';
    if (status === 'warning') return 'text-amber-700 dark:text-amber-300';
    return 'text-red-700 dark:text-red-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-2 shadow-lg">
                <HardHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{mockPersonnel.currentUser.name}</h1>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3 w-3 mr-1" />
                  Sector {currentSector} • {currentMine.name}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Live Data</span>
              </div>
              <ThemeToggle />
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Status Bar - Compact and Informational */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Current Risk Status */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Current Risk</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-bold mt-1 ${getRiskStatusColor(sectorData.riskLevel)}`}>
                    {getRiskStatusText(sectorData.riskLevel)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sector</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{currentSector}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personnel Count */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Workers</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{currentMine.personnel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Online</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">{Math.round(currentMine.personnel * 0.9)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Alerts</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{currentMine.alerts} Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Button - Compact but Visible */}
          <Card className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white shadow-lg">
            <CardContent className="p-4">
              <Button
                onClick={handleEmergency}
                className="w-full h-12 bg-transparent hover:bg-red-700/20 text-white font-bold border-0 shadow-none flex items-center justify-center text-sm"
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                EMERGENCY
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Heatmap Section - Full Width */}
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Zap className="mr-2 h-5 w-5 text-orange-600 dark:text-orange-400" />
              Sector Risk Heatmap
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Real-time risk visualization for your current sector. You are indicated by the blue marker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative w-full h-[450px] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl overflow-hidden border-2 border-amber-200 dark:border-amber-700 flex items-center justify-center">
                  <D3Heatmap data={heatmapData} width={500} height={400} />

                  {/* Risk Legend */}
                  <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-300 dark:border-gray-600 shadow-lg">
                    <div className="text-gray-800 dark:text-gray-200 text-xs font-semibold mb-2">Risk Level</div>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#4ade80' }}></div>
                        <span className="text-gray-700 dark:text-gray-300 text-xs">Very Low</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#a3e635' }}></div>
                        <span className="text-gray-700 dark:text-gray-300 text-xs">Low</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
                        <span className="text-gray-700 dark:text-gray-300 text-xs">Medium</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }}></div>
                        <span className="text-gray-700 dark:text-gray-300 text-xs">High</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                        <span className="text-gray-700 dark:text-gray-300 text-xs">Critical</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Mine Info */}
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 border border-gray-300 dark:border-gray-600 shadow-lg">
                    <div className="text-gray-800 dark:text-gray-200 text-sm font-semibold flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${currentMine.riskLevel === 'Critical' ? 'bg-red-500 animate-pulse' :
                        currentMine.riskLevel === 'High' ? 'bg-orange-500' :
                          currentMine.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                      <MapPin className="h-4 w-4 mr-1 text-red-500" />
                      {currentMine.name}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-xs mt-2 space-y-1">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1 text-blue-500" />
                        <span className="font-medium">Sector {currentSector}</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="h-3 w-3 mr-1 text-green-500" />
                        <span className={`font-medium ${currentMine.status === 'Critical' ? 'text-red-600 dark:text-red-400' :
                          currentMine.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                          }`}>{currentMine.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="space-y-5">
                  {/* Risk Information Card */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-gray-900 dark:text-gray-100 text-lg">Risk Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Overall Risk</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{currentMine.riskLevel}</span>
                          </div>
                          <div className={`w-full h-2.5 rounded-full overflow-hidden ${currentMine.riskLevel === 'Critical' ? 'bg-red-200' :
                            currentMine.riskLevel === 'High' ? 'bg-orange-200' :
                              currentMine.riskLevel === 'Medium' ? 'bg-yellow-200' : 'bg-green-200'}`}>
                            <div className={`h-full ${currentMine.riskLevel === 'Critical' ? 'bg-red-500' :
                              currentMine.riskLevel === 'High' ? 'bg-orange-500' :
                                currentMine.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{
                                width: `${currentMine.riskLevel === 'Critical' ? '95%' :
                                  currentMine.riskLevel === 'High' ? '80%' :
                                    currentMine.riskLevel === 'Medium' ? '65%' : '30%'}`
                              }}></div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Risk Zones</h4>
                          <div className="space-y-3">
                            {currentMine.heatmapData?.riskZones?.map((zone, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">{zone.split(':')[0]}</span>
                                <Badge variant={zone.includes('Critical') ? 'destructive' :
                                  zone.includes('High') ? 'destructive' :
                                    zone.includes('Medium') ? 'secondary' : 'default'}
                                  className="text-xs">
                                  {zone.split(':')[1]}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gas Levels Card */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                        <Droplets className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Gas Levels
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Oxygen (O₂)</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{gasLevels.o2}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${gasLevels.o2}%` }}></div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Normal: 20.9%</div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Carbon Monoxide (CO)</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{gasLevels.co} ppm</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, gasLevels.co * 2)}%` }}></div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Safe: &lt;35 ppm</div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Methane (CH₄)</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{gasLevels.ch4}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: `${gasLevels.ch4 * 10}%` }}></div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Explosive: &gt;5%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Worker-Centric Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment Status */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                <Wrench className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                Equipment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(equipmentStatus).map(([item, status]) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {getEquipmentStatusIcon(status)}
                      </div>
                      <span className="capitalize font-medium text-gray-900 dark:text-gray-100">{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                    <Badge variant={status === 'operational' ? 'default' : status === 'warning' ? 'destructive' : 'secondary'} className="text-xs">
                      {status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Communication Status */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                <Signal className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center">
                    <Battery className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Device Battery</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600 dark:text-green-400">87%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Good</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center">
                    <Signal className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Signal Strength</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600 dark:text-green-400">Strong</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">4/4 bars</div>
                  </div>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200">Maintenance Due</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Your respirator requires calibration in 3 days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-md">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-16 flex-col border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm">
                  <Camera className="h-5 w-5 mb-1" />
                  <span className="text-xs">Report Hazard</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm">
                  <Flag className="h-5 w-5 mb-1" />
                  <span className="text-xs">Flag Issue</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm">
                  <Navigation className="h-5 w-5 mb-1" />
                  <span className="text-xs">Evacuation</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm">
                  <Phone className="h-5 w-5 mb-1" />
                  <span className="text-xs">Contact</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evacuation Routes & Safety Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evacuation Routes */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                <Navigation className="mr-2 h-5 w-5" />
                Evacuation Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockEvacuationRoutes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{route.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Status: {route.status}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={route.status === 'clear' ? 'default' : 'destructive'}>
                        {route.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Information */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                <Shield className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                Safety Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Safety Protocols</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Always wear your safety equipment and follow designated pathways.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Reporting Issues</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Report any hazards immediately to your supervisor or through the app.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Emergency Procedures</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    In case of emergency, follow evacuation routes and assemble at designated points.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: {currentTime.toLocaleTimeString()}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {mockPersonnel.online} workers online
              </div>
            </div>
            <div className="flex items-center">
              <Wifi className={`h-4 w-4 mr-1 ${connectionStatus === 'connected' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`} />
              {connectionStatus === 'connected' ? 'Connected' : 'Offline'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;