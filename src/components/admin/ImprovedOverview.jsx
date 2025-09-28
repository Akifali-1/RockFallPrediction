import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as d3 from 'd3';
import { contours } from 'd3-contour';
import 'leaflet.heat';
import './leaflet-map.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Zap,
  Thermometer,
  Droplets,
  Wind,
  Shield,
  Brain,
  Eye,
  Clock,
  MapPin,
  Search,
  ChevronDown,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useMine } from '../../contexts/MineContext';
import { useTheme } from '../../contexts/ThemeContext';
import MineSelector from '../MineSelector';
import ThemeToggle from '../ThemeToggle';
import PageHeader from '../PageHeader';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  mockSensorData,
  mockPersonnel,
  mockAlerts,
  mockSectors,
  mockSystemStatus,
  mockWeatherData,
  getRiskColor
} from '../../mockData';

const ImprovedOverview = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Use global mine context
  const { selectedMine, currentMine, criticalMines, handleMineSelection } = useMine();

  // Generate dynamic heatmap data based on selected mine
  const heatmapData = useMemo(() => {
    const width = 400;
    const height = 300;
    const data = [];

    // Reduced step size for better performance
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
  }, [selectedMine, currentMine]); // Re-generate when mine changes

  // Handle emergency evacuation function
  const handleEmergencyEvacuation = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Emergency evacuation protocol initiated!');
    }, 2000);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fix for Leaflet default markers
  useEffect(() => {
    // Delete existing default icon to avoid conflicts
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Create custom marker icons for different risk levels
  const createCustomIcon = (color, risk) => {
    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 10px;
        color: white;
        position: relative;
      ">
        ${risk >= 80 ? '!' : risk >= 60 ? '⚠' : '✓'}
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid ${color};
        "></div>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [25, 33],
      iconAnchor: [12, 33],
      popupAnchor: [1, -30]
    });
  };

  // Get marker color based on risk level
  const getMarkerColor = (risk) => {
    if (risk >= 80) return '#DC2626'; // Red
    if (risk >= 60) return '#F59E0B'; // Orange
    return '#16A34A'; // Green
  };

  // Mining site locations with real coordinates
  const miningSites = [
    {
      id: 1,
      name: "Karimnagar Coal Mine",
      state: "Telangana",
      coordinates: [18.4386, 79.1288], // Real Karimnagar coordinates
      status: "Active",
      workers: 150,
      risk: 65,
      statusColor: "red"
    },
    {
      id: 2,
      name: "Jharia Coalfield",
      state: "Jharkhand",
      coordinates: [23.7337, 86.4156], // Real Jharia coordinates
      status: "Warning",
      workers: 89,
      risk: 78,
      statusColor: "orange"
    },
    {
      id: 3,
      name: "Raipur Iron Mine",
      state: "Chhattisgarh",
      coordinates: [21.2514, 81.6296], // Real Raipur coordinates
      status: "Critical",
      workers: 45,
      risk: 92,
      statusColor: "red"
    },
    {
      id: 4,
      name: "Kolar Gold Fields",
      state: "Karnataka",
      coordinates: [12.9698, 78.1386], // Real Kolar coordinates
      status: "Operational",
      workers: 120,
      risk: 35,
      statusColor: "green"
    }
  ];

  // Use mine-specific risk prediction data
  const riskPredictionData = currentMine.timelineData || [];

  // D3 Heatmap Component (optimized and improved)
  const D3Heatmap = React.memo(({ data, width = 400, height = 300 }) => {
    const svgRef = useRef();

    useEffect(() => {
      if (!data || data.length === 0) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      // Create mine pit color scale with lighter, earthier tones
      const colorScale = d3.scaleSequential()
        .domain([0, 1]) // Normal scale (low to high risk)
        .interpolator(d3.interpolateRgb("#f5f5dc", "#8b4513")); // Beige to saddle brown for mine pit look

      // Create simplified grid for better performance
      const gridSize = 10;
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
          if (d.risk < 0.2) return '#f5f5dc'; // Beige for very low risk
          if (d.risk < 0.4) return '#deb887'; // Burlywood for low risk  
          if (d.risk < 0.6) return '#cd853f'; // Peru for medium risk
          if (d.risk < 0.8) return '#a0522d'; // Sienna for high risk
          return '#8b4513'; // Saddle brown for critical risk
        })
        .attr('opacity', 0.8)
        .attr('stroke', 'none');

      // Add mine boundary with improved styling
      svg.append('path')
        .attr('d', `M 50,80 Q 80,60 120,70 Q 180,50 240,80 Q 300,60 350,90 Q 380,130 370,180 Q 360,230 330,260 Q 280,290 220,280 Q 160,285 110,260 Q 70,230 60,180 Q 55,130 50,80 Z`)
        .attr('fill', 'none')
        .attr('stroke', '#654321')
        .attr('stroke-width', 4)
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
        .attr('r', 4)
        .attr('fill', '#DC143C')
        .attr('opacity', 0.9)
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1);

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

    }, [data, width, height]);

    return (
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border-2 border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner"
      />
    );
  });

  const criticalAlerts = mockAlerts.filter(alert => alert.priority === 'critical').length;

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900">
      {/* Header */}
      <PageHeader
        title={`System Overview - ${currentMine.name}`}
        description="Real-time mine safety monitoring dashboard"
        icon={BarChart3}
        showMineSelector={true}
        showThemeToggle={true}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live Data</span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
          <p className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">{currentTime.toLocaleTimeString()}</p>
        </div>
        <Button
          onClick={handleEmergencyEvacuation}
          disabled={isLoading}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 transform hover:scale-105 transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Initiating...
            </div>
          ) : (
            <>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Emergency Evacuation
            </>
          )}
        </Button>
      </PageHeader>

      {/* Critical Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Risk */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Overall Risk</p>
                <div className="flex items-center mt-2">
                  <div className={`bg-gradient-to-r text-white px-3 py-1 rounded-full text-lg font-bold ${currentMine.riskLevel === 'Critical' ? 'from-red-500 to-red-700' :
                    currentMine.riskLevel === 'High' ? 'from-orange-500 to-red-500' :
                      currentMine.riskLevel === 'Medium' ? 'from-yellow-500 to-orange-500' : 'from-green-500 to-green-700'
                    }`}>
                    {currentMine.riskLevel.toUpperCase()}
                  </div>
                </div>
              </div>
              <Shield className={`h-8 w-8 ${currentMine.riskLevel === 'Critical' ? 'text-red-500' :
                currentMine.riskLevel === 'High' ? 'text-orange-500' :
                  currentMine.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                }`} />
            </div>
            <div className="mt-4">
              <Progress value={
                currentMine.riskLevel === 'Critical' ? 95 :
                  currentMine.riskLevel === 'High' ? 80 :
                    currentMine.riskLevel === 'Medium' ? 65 : 30
              } className="h-2" />
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Risk Level: {
                currentMine.riskLevel === 'Critical' ? '95%' :
                  currentMine.riskLevel === 'High' ? '80%' :
                    currentMine.riskLevel === 'Medium' ? '65%' : '30%'
              }</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Sensors */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Sensors</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-green-700 dark:text-green-300">{currentMine.sensors.active}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/{currentMine.sensors.total}</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <Progress value={Math.round((currentMine.sensors.active / currentMine.sensors.total) * 100)} className="h-2" />
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">{Math.round((currentMine.sensors.active / currentMine.sensors.total) * 100)}% Operational</p>
            </div>
          </CardContent>
        </Card>

        {/* Personnel */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Personnel Online</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{Math.round(currentMine.personnel * 0.9)}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/{currentMine.personnel}</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <Progress value={90} className="h-2" />
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">90% Present</p>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Critical Alerts</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-red-700 dark:text-red-300">{currentMine.alerts}</span>
                  <TrendingUp className="h-4 w-4 text-red-500 ml-2" />
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-4">
              <Badge variant="destructive" className="text-xs">
                {currentMine.alerts > 5 ? 'High Priority' : 'Requires Attention'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Mines Alert Section */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700 dark:text-red-400">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Critical Mines Requiring Attention
          </CardTitle>
          <CardDescription className="dark:text-gray-400">Mines with high risk levels that need immediate monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {criticalMines.map((mine) => (
              <div
                key={mine.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedMine === mine.id
                  ? 'border-red-500 bg-red-100 dark:bg-red-900/30'
                  : 'border-red-200 dark:border-red-700 bg-white dark:bg-gray-800 hover:border-red-300 dark:hover:border-red-600'
                  }`}
                onClick={() => handleMineSelection(mine.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${mine.riskLevel === 'Critical' ? 'bg-red-500 animate-pulse' :
                      mine.riskLevel === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}></div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{mine.name}</h3>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {mine.riskLevel}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {mine.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {mine.personnel} Personnel
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {mine.alerts} Active Alerts
                  </div>
                </div>
                {selectedMine === mine.id && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                    Currently Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Prediction Over Time */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <TrendingUp className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Risk Prediction Timeline - Next 24 Hours
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            AI-powered risk predictions across all categories with real-time analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskPredictionData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="overall"
                  stroke="#1f2937"
                  fill="url(#overallGradient)"
                  strokeWidth={3}
                  name="Overall Risk"
                />
                <Area
                  type="monotone"
                  dataKey="crack"
                  stroke="#ef4444"
                  fill="url(#crackGradient)"
                  strokeWidth={2}
                  name="Crack Risk"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="displacement"
                  stroke="#f97316"
                  fill="url(#displacementGradient)"
                  strokeWidth={2}
                  name="Displacement"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="weather"
                  stroke="#3b82f6"
                  fill="url(#weatherGradient)"
                  strokeWidth={2}
                  name="Weather Impact"
                  fillOpacity={0.3}
                />
                <defs>
                  <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f2937" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1f2937" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="crackGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="displacementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="weatherGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Grid - Map 70% and Card 30% */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Interactive India Mining Sites Map - 70% */}
        <Card className="lg:col-span-7 overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Activity className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              Mining Sites Across India
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Interactive map showing our active mining operations with real-time status</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full h-[700px] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
              <MapContainer
                center={[20.5937, 78.9629]} // Center of India
                zoom={5.5}
                style={{ height: '100%', width: '100%', borderRadius: '0 0 12px 12px' }}
                zoomControl={true}
                minZoom={5}
                maxZoom={8}
                maxBounds={[[6, 68], [37, 97]]} // India bounds only
                maxBoundsViscosity={1.0}
                className="z-10 leaflet-container-focused"
                bounceAtZoomLimits={true}
                wheelPxPerZoomLevel={60}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  bounds={[[6, 68], [37, 97]]} // Restrict tiles to India
                />

                {miningSites.map((site) => {
                  const markerColor = getMarkerColor(site.risk);
                  const customIcon = createCustomIcon(markerColor, site.risk);

                  return (
                    <Marker
                      key={site.id}
                      position={site.coordinates}
                      icon={customIcon}
                    >
                      <Popup className="custom-popup">
                        <div className="p-3 min-w-[220px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{site.name}</h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${site.risk >= 80 ? 'bg-red-100 text-red-800' :
                              site.risk >= 60 ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                              {site.risk >= 80 ? 'CRITICAL' :
                                site.risk >= 60 ? 'WARNING' : 'NORMAL'}
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center text-gray-600 dark:text-gray-400">
                                <span className="mr-2">📍</span> State:
                              </span>
                              <span className="font-medium text-gray-800 dark:text-gray-200">{site.state}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="flex items-center text-gray-600 dark:text-gray-400">
                                <span className="mr-2">⚡</span> Status:
                              </span>
                              <span className={`font-medium ${site.statusColor === 'red' ? 'text-red-600' :
                                site.statusColor === 'orange' ? 'text-orange-600' :
                                  'text-green-600'
                                }`}>{site.status}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="flex items-center text-gray-600 dark:text-gray-400">
                                <span className="mr-2">👥</span> Workers:
                              </span>
                              <span className="font-medium text-gray-800 dark:text-gray-200">{site.workers}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="flex items-center text-gray-600 dark:text-gray-400">
                                <span className="mr-2">🚨</span> Risk Level:
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className={`font-bold ${site.risk >= 80 ? 'text-red-600' :
                                  site.risk >= 60 ? 'text-orange-600' :
                                    'text-green-600'
                                  }`}>{site.risk}%</span>
                                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-300 ${site.risk >= 80 ? 'bg-red-500' :
                                      site.risk >= 60 ? 'bg-orange-500' :
                                        'bg-green-500'
                                      }`}
                                    style={{ width: `${site.risk}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <span className="mr-1">📊</span>
                              Last updated: {currentTime.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Operations Summary Panel - 30% */}
        <Card className="lg:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Activity className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              Operations Summary
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Real-time mining operations overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{miningSites.length}</div>
                <div className="text-sm text-blue-600 dark:text-blue-300">Total Sites</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{miningSites.reduce((sum, site) => sum + site.workers, 0)}</div>
                <div className="text-sm text-green-600 dark:text-green-300">Total Workers</div>
              </div>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-600 dark:text-orange-300">Average Risk Level:</span>
                <span className="text-xl font-bold text-orange-700 dark:text-orange-400">
                  {Math.round(miningSites.reduce((sum, site) => sum + site.risk, 0) / miningSites.length)}%
                </span>
              </div>
            </div>

            {/* Status Legend */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Status Legend</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Critical</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">80%+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Warning</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">60-80%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Normal</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Low Risk</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">System Health</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 dark:text-green-300">Active Sensors:</span>
                  <span className="font-semibold text-green-800 dark:text-green-200">{mockSystemStatus.activeSensors}/{mockSystemStatus.totalSensors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 dark:text-green-300">Personnel Online:</span>
                  <span className="font-semibold text-green-800 dark:text-green-200">{mockPersonnel.online}/{mockPersonnel.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 dark:text-green-300">Critical Alerts:</span>
                  <span className="font-semibold text-red-700 dark:text-red-400">{criticalAlerts}</span>
                </div>
              </div>
            </div>

            {/* Emergency Button */}
            <Button
              onClick={handleEmergencyEvacuation}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Initiating...
                </div>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Emergency Evacuation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Section Below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open Pit Mine Risk Heatmap */}
        <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Activity className="mr-2 h-5 w-5" />
              Open Pit Mine Risk Heatmap
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Real-time risk visualization for {currentMine.name} mining operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[500px] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl overflow-hidden border-2 border-amber-200 dark:border-amber-700 flex items-center justify-center">

              {/* D3 Heatmap - Centered */}
              <div className="flex items-center justify-center w-full h-full">
                <D3Heatmap key="static-heatmap" data={heatmapData} width={500} height={400} />
              </div>

              {/* Risk Legend */}
              <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-2 border border-gray-300 dark:border-gray-600">
                <div className="text-gray-800 dark:text-gray-200 text-xs font-semibold mb-1">Risk Level</div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 rounded" style={{ backgroundColor: '#f5f5dc' }}></div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">Very Low</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 rounded" style={{ backgroundColor: '#deb887' }}></div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">Low</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 rounded" style={{ backgroundColor: '#cd853f' }}></div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 rounded" style={{ backgroundColor: '#a0522d' }}></div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">High</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 rounded" style={{ backgroundColor: '#8b4513' }}></div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">Critical</span>
                  </div>
                </div>
              </div>

              {/* Mine Information */}
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
                    <MapPin className="h-3 w-3 mr-1 text-red-500" />
                    <span className="font-medium">{currentMine.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1 text-green-500" />
                    <span className={`font-medium ${currentMine.status === 'Critical' ? 'text-red-600 dark:text-red-400' :
                      currentMine.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                      }`}>{currentMine.status}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="font-medium">{currentMine.personnel} Workers</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1 text-orange-500" />
                    <span className={`font-medium ${currentMine.alerts > 5 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                      }`}>{currentMine.alerts} Alerts</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Predictions & Weather */}
        <div className="space-y-6">
          {/* AI Predictions */}
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
                <Brain className="mr-2 h-5 w-5" />
                AI Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Risk Trend</span>
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">+12%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Next 4 hours</div>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Anomaly Detection</span>
                  <Eye className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">2</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Sectors flagged</div>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Confidence</span>
                  <Shield className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">94%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Model accuracy</div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Impact */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                <Droplets className="mr-2 h-5 w-5" />
                Weather Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="font-bold text-blue-700 dark:text-blue-400">{mockWeatherData.rainfall}mm</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Rainfall</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Thermometer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <div className="font-bold text-orange-700 dark:text-orange-400">{mockWeatherData.temperature}°C</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">Temperature</div>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Wind className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Wind</span>
                </div>
                <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                  {mockWeatherData.windSpeed} km/h {mockWeatherData.windDirection}
                </div>
              </div>

              <Alert className="border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  High rainfall detected. Increased monitoring recommended.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sensor Status Grid */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <Zap className="mr-2 h-5 w-5" />
            Live Sensor Network Status
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Real-time monitoring of all sensor systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(mockSensorData).map(([sensor, data]) => (
              <div
                key={sensor}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold capitalize text-gray-800 dark:text-gray-200">{sensor}</div>
                  <Badge className={getRiskColor(data.status)}>
                    {data.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Current</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{data.current}/{data.max}</span>
                  </div>
                  <Progress value={data.percentage} className="h-3" />
                  <div className="text-xs text-gray-600 dark:text-gray-400">{data.percentage}% of threshold</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovedOverview;