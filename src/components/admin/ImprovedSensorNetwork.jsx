import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Radio,
  Activity,
  Zap,
  Gauge,
  Search,
  Filter,
  Wifi,
  Battery,
  Settings,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
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
import { mockSensorData, getRiskColor } from '../../mockData';

const ImprovedSensorNetwork = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState(null);

  // Enhanced sensor details with historical data
  const sensorDetails = [
    {
      id: 'TILT_001',
      type: 'tiltmeter',
      sector: 'A-1',
      location: 'North Wall',
      status: 'active',
      battery: 89,
      signal: 92,
      lastReading: '12.9°',
      threshold: '25°',
      calibrationDate: '2025-01-15',
      manufacturer: 'GeoTech Pro',
      model: 'GT-3000X',
      historicalData: [
        { time: '00:00', value: 10.2 },
        { time: '04:00', value: 11.1 },
        { time: '08:00', value: 11.8 },
        { time: '12:00', value: 12.3 },
        { time: '16:00', value: 12.9 },
        { time: '20:00', value: 13.1 },
        { time: '24:00', value: 13.4 }
      ],
      ...mockSensorData.tiltmeter
    },
    {
      id: 'PIEZO_002',
      type: 'piezometer',
      sector: 'B-12',
      location: 'Central Pit',
      status: 'active',
      battery: 76,
      signal: 88,
      lastReading: '8.5 kPa',
      threshold: '20 kPa',
      calibrationDate: '2025-01-12',
      manufacturer: 'HydroPressure',
      model: 'HP-200',
      historicalData: [
        { time: '00:00', value: 6.8 },
        { time: '04:00', value: 7.2 },
        { time: '08:00', value: 7.8 },
        { time: '12:00', value: 8.1 },
        { time: '16:00', value: 8.5 },
        { time: '20:00', value: 8.7 },
        { time: '24:00', value: 8.9 }
      ],
      ...mockSensorData.piezometer
    },
    {
      id: 'VIB_003',
      type: 'vibration',
      sector: 'B-12',
      location: 'Equipment Zone',
      status: 'warning',
      battery: 94,
      signal: 95,
      lastReading: '19.8 Hz',
      threshold: '25 Hz',
      calibrationDate: '2025-01-10',
      manufacturer: 'SeismicSense',
      model: 'SS-V500',
      historicalData: [
        { time: '00:00', value: 15.2 },
        { time: '04:00', value: 16.8 },
        { time: '08:00', value: 17.5 },
        { time: '12:00', value: 18.9 },
        { time: '16:00', value: 19.8 },
        { time: '20:00', value: 20.2 },
        { time: '24:00', value: 20.8 }
      ],
      ...mockSensorData.vibration
    },
    {
      id: 'CRACK_004',
      type: 'crackmeter',
      sector: 'A-5',
      location: 'South Slope',
      status: 'active',
      battery: 67,
      signal: 79,
      lastReading: '11.0 mm',
      threshold: '25 mm',
      calibrationDate: '2025-01-18',
      manufacturer: 'CrackWatch',
      model: 'CW-Digital-Pro',
      historicalData: [
        { time: '00:00', value: 9.2 },
        { time: '04:00', value: 9.8 },
        { time: '08:00', value: 10.1 },
        { time: '12:00', value: 10.6 },
        { time: '16:00', value: 11.0 },
        { time: '20:00', value: 11.2 },
        { time: '24:00', value: 11.4 }
      ],
      ...mockSensorData.crackmeter
    },
    {
      id: 'LIDAR_005',
      type: 'lidar',
      sector: 'B-15',
      location: 'West Face',
      status: 'active',
      battery: 91,
      signal: 97,
      lastReading: '2.3 cm',
      threshold: '5.0 cm',
      calibrationDate: '2025-01-20',
      manufacturer: 'LaserScan',
      model: 'LS-3D-Ultra',
      historicalData: [
        { time: '00:00', value: 1.8 },
        { time: '04:00', value: 1.9 },
        { time: '08:00', value: 2.0 },
        { time: '12:00', value: 2.1 },
        { time: '16:00', value: 2.3 },
        { time: '20:00', value: 2.4 },
        { time: '24:00', value: 2.5 }
      ]
    },
    {
      id: 'STRAIN_006',
      type: 'strain_gauge',
      sector: 'C-1',
      location: 'Support Beam 7',
      status: 'active',
      battery: 83,
      signal: 85,
      lastReading: '450 μstrain',
      threshold: '1000 μstrain',
      calibrationDate: '2025-01-14',
      manufacturer: 'StrainTech',
      model: 'ST-Wireless-200',
      historicalData: [
        { time: '00:00', value: 320 },
        { time: '04:00', value: 350 },
        { time: '08:00', value: 380 },
        { time: '12:00', value: 420 },
        { time: '16:00', value: 450 },
        { time: '20:00', value: 460 },
        { time: '24:00', value: 470 }
      ]
    }
  ];

  const getSensorIcon = (type) => {
    switch (type) {
      case 'tiltmeter': return <Gauge className="h-5 w-5" />;
      case 'piezometer': return <Activity className="h-5 w-5" />;
      case 'vibration': return <Radio className="h-5 w-5" />;
      case 'crackmeter': return <Zap className="h-5 w-5" />;
      case 'lidar': return <BarChart3 className="h-5 w-5" />;
      case 'strain_gauge': return <TrendingUp className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'warning': case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (data) => {
    if (!data || data.length < 2) return null;
    const trend = data[data.length - 1].value - data[data.length - 2].value;
    return trend > 0 ? 
      <TrendingUp className="h-3 w-3 text-red-500" /> : 
      <TrendingDown className="h-3 w-3 text-green-500" />;
  };

  const filteredSensors = sensorDetails.filter(sensor => {
    const matchesSearch = sensor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sensor.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sensor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || sensor.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform hover:scale-[1.01] transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Sensor Network
            </h1>
            <p className="text-gray-600 mt-1">Monitor and manage all sensor systems with real-time data</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="transform hover:scale-110 transition-all duration-200">
                <Badge className="bg-green-100 text-green-800 px-4 py-2">
                  {sensorDetails.filter(s => s.status === 'active').length} Active
                </Badge>
              </div>
              <div className="transform hover:scale-110 transition-all duration-200">
                <Badge className="bg-amber-100 text-amber-800 px-4 py-2">
                  {sensorDetails.filter(s => s.status === 'warning').length} Warning
                </Badge>
              </div>
              <div className="transform hover:scale-110 transition-all duration-200">
                <Badge className="bg-gray-100 text-gray-800 px-4 py-2">
                  {sensorDetails.filter(s => s.status === 'maintenance').length} Maintenance
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="transform hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sensors by ID, type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Sectors</option>
                {Array.from(new Set(sensorDetails.map(s => s.sector))).map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid-view" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid-view">Grid View</TabsTrigger>
          <TabsTrigger value="detailed-view">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="grid-view" className="space-y-6">
          {/* Enhanced Sensor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSensors.map((sensor, index) => (
              <Card 
                key={sensor.id} 
                className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedSensor(sensor)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                        {getSensorIcon(sensor.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{sensor.id}</CardTitle>
                        <CardDescription className="capitalize">{sensor.type.replace('_', ' ')}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(sensor.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(sensor.status)}
                        <span>{sensor.status}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location & Current Reading */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Sector</p>
                      <p className="font-semibold">{sensor.sector}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-semibold">{sensor.location}</p>
                    </div>
                  </div>

                  {/* Current Reading with Trend */}
                  {sensor.status !== 'maintenance' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Current Reading</span>
                        <div className="flex items-center space-x-1">
                          <span className="font-bold">{sensor.lastReading}</span>
                          {getTrendIcon(sensor.historicalData)}
                        </div>
                      </div>
                      {sensor.percentage && (
                        <Progress value={sensor.percentage} className="h-2" />
                      )}
                      <div className="text-xs text-gray-600">
                        Threshold: {sensor.threshold} ({sensor.percentage || 'N/A'}%)
                      </div>
                    </div>
                  )}

                  {/* Mini Chart */}
                  {sensor.historicalData && (
                    <div className="h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sensor.historicalData}>
                          <defs>
                            <linearGradient id={`gradient-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={sensor.status === 'warning' ? '#f59e0b' : '#3b82f6'} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={sensor.status === 'warning' ? '#f59e0b' : '#3b82f6'} stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={sensor.status === 'warning' ? '#f59e0b' : '#3b82f6'}
                            fill={`url(#gradient-${sensor.id})`}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Device Health */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Battery className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Battery</span>
                          <span>{sensor.battery}%</span>
                        </div>
                        <Progress value={sensor.battery} className="h-1" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Signal</span>
                          <span>{sensor.signal}%</span>
                        </div>
                        <Progress value={sensor.signal} className="h-1" />
                      </div>
                    </div>
                  </div>

                  {/* Device Info */}
                  <div className="text-xs text-gray-500 pt-2 border-t space-y-1">
                    <div>Model: {sensor.manufacturer} {sensor.model}</div>
                    <div>Calibrated: {sensor.calibrationDate}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 transform hover:scale-105 transition-all duration-200">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 transform hover:scale-105 transition-all duration-200">
                      View Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed-view" className="space-y-6">
          {selectedSensor ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Detailed Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getSensorIcon(selectedSensor.type)}
                    <span className="ml-2">{selectedSensor.id} - 24h Trend Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Detailed sensor readings with predictive analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedSensor.historicalData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={selectedSensor.status === 'warning' ? '#f59e0b' : '#3b82f6'}
                          strokeWidth={3}
                          dot={{ fill: selectedSensor.status === 'warning' ? '#f59e0b' : '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Sensor</h3>
                <p className="text-gray-600">Click on any sensor from the grid view to see detailed analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Network Health Summary */}
      <Card className="animate-slideInUp">
        <CardHeader>
          <CardTitle>Network Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-green-700">
                {sensorDetails.filter(s => s.status === 'active').length}
              </div>
              <div className="text-sm text-green-600">Active Sensors</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-amber-700">
                {Math.round(sensorDetails.reduce((acc, s) => acc + (s.battery || 0), 0) / sensorDetails.length)}%
              </div>
              <div className="text-sm text-amber-600">Avg Battery</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-blue-700">
                {Math.round(sensorDetails.reduce((acc, s) => acc + (s.signal || 0), 0) / sensorDetails.length)}%
              </div>
              <div className="text-sm text-blue-600">Avg Signal</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-purple-700">
                98.5%
              </div>
              <div className="text-sm text-purple-600">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovedSensorNetwork;