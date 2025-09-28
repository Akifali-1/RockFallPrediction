import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Users,
  MapPin,
  Search,
  Filter,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Phone,
  Radio,
  Wifi,
  Battery,
  User,
  Activity
} from 'lucide-react';

const ImprovedPersonnelTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced personnel data with precise grid positions
  const personnelData = [
    {
      id: 'P001',
      name: 'Sarah Chen',
      role: 'Safety Inspector',
      sector: 'B-12',
      status: 'active',
      lastUpdate: '1 min ago',
      batteryLevel: 85,
      signalStrength: 92,
      emergencyDevice: true,
      gridPosition: { row: 0, col: 3 }, // B-12 position
      coordinates: { x: 125.4, y: 67.8 },
      shiftStart: '06:00',
      checkInTime: '05:58',
      heartRate: 78,
      temperature: 36.2
    },
    {
      id: 'P002',
      name: 'Mike Rodriguez',
      role: 'Equipment Operator',
      sector: 'A-5',
      status: 'active',
      lastUpdate: '2 min ago',
      batteryLevel: 67,
      signalStrength: 88,
      emergencyDevice: true,
      gridPosition: { row: 0, col: 2 }, // A-5 position
      coordinates: { x: 89.2, y: 45.3 },
      shiftStart: '06:00',
      checkInTime: '06:02',
      heartRate: 82,
      temperature: 36.8
    },
    {
      id: 'P003',
      name: 'Emily Watson',
      role: 'Geologist',
      sector: 'C-1',
      status: 'active',
      lastUpdate: '30 sec ago',
      batteryLevel: 94,
      signalStrength: 95,
      emergencyDevice: true,
      gridPosition: { row: 0, col: 5 }, // C-1 position
      coordinates: { x: 203.7, y: 78.9 },
      shiftStart: '07:00',
      checkInTime: '06:55',
      heartRate: 72,
      temperature: 36.1
    },
    {
      id: 'P004',
      name: 'James Thompson',
      role: 'Maintenance Tech',
      sector: 'B-12',
      status: 'warning',
      lastUpdate: '8 min ago',
      batteryLevel: 23,
      signalStrength: 45,
      emergencyDevice: true,
      gridPosition: { row: 0, col: 3 }, // B-12 position
      coordinates: { x: 132.1, y: 71.2 },
      shiftStart: '06:00',
      checkInTime: '06:10',
      heartRate: 95,
      temperature: 37.2
    },
    {
      id: 'P005',
      name: 'Lisa Park',
      role: 'Environmental Monitor',
      sector: 'A-1',
      status: 'active',
      lastUpdate: '3 min ago',
      batteryLevel: 78,
      signalStrength: 91,
      emergencyDevice: true,
      gridPosition: { row: 0, col: 0 }, // A-1 position
      coordinates: { x: 34.5, y: 23.7 },
      shiftStart: '06:30',
      checkInTime: '06:28',
      heartRate: 75,
      temperature: 36.3
    },
    {
      id: 'P006',
      name: 'David Kim',
      role: 'Security Officer',
      sector: 'A-2',
      status: 'break',
      lastUpdate: '15 min ago',
      batteryLevel: 56,
      signalStrength: 0,
      emergencyDevice: true,
      gridPosition: { row: 0, col: 1 }, // A-2 position
      coordinates: { x: 65.8, y: 28.4 },
      shiftStart: '06:00',
      checkInTime: '05:45',
      heartRate: 68,
      temperature: 36.0
    }
  ];

  // Mine sectors grid layout (6x3 grid)
  const sectorGrid = [
    ['A-1', 'A-2', 'A-5', 'B-12', 'B-15', 'C-1'],
    ['A-6', 'A-7', 'A-8', 'B-13', 'B-16', 'C-2'],
    ['A-9', 'A-10', 'A-11', 'B-14', 'B-17', 'C-3']
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'break': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'break': return <Clock className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRiskLevel = (sectorId) => {
    const riskMap = {
      'A-1': 'low', 'A-2': 'low', 'A-5': 'medium', 'A-6': 'low', 'A-7': 'low', 'A-8': 'low', 'A-9': 'low', 'A-10': 'low', 'A-11': 'low',
      'B-12': 'high', 'B-13': 'medium', 'B-14': 'medium', 'B-15': 'medium', 'B-16': 'low', 'B-17': 'low',
      'C-1': 'low', 'C-2': 'low', 'C-3': 'low'
    };
    return riskMap[sectorId] || 'low';
  };

  const getSectorColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-200 border-red-400';
      case 'medium': return 'bg-amber-200 border-amber-400';
      case 'low': return 'bg-green-200 border-green-400';
      default: return 'bg-gray-200 border-gray-400';
    }
  };

  const getPersonnelInSector = (sectorId) => {
    return personnelData.filter(person => person.sector === sectorId);
  };

  const getPersonnelDotColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'break': return 'bg-blue-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredPersonnel = personnelData.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || person.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform hover:scale-[1.01] transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Personnel Tracking
            </h1>
            <p className="text-gray-600 mt-1">Real-time location and safety monitoring of all personnel</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="transform hover:scale-110 transition-all duration-200">
                <div className="text-2xl font-bold text-green-600">
                  {personnelData.filter(p => p.status === 'active').length}
                </div>
                <div className="text-xs text-gray-600">Active</div>
              </div>
              <div className="transform hover:scale-110 transition-all duration-200">
                <div className="text-2xl font-bold text-amber-600">
                  {personnelData.filter(p => p.status === 'warning').length}
                </div>
                <div className="text-xs text-gray-600">Warning</div>
              </div>
              <div className="transform hover:scale-110 transition-all duration-200">
                <div className="text-2xl font-bold text-blue-600">
                  {personnelData.filter(p => p.status === 'break').length}
                </div>
                <div className="text-xs text-gray-600">Break</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="map" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Live Personnel Map</TabsTrigger>
          <TabsTrigger value="list">Personnel Details</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          {/* Enhanced Mine Map Grid */}
          <Card className="transform hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Live Personnel Positioning System
              </CardTitle>
              <CardDescription>
                Real-time personnel positions with health monitoring across mine sectors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl">
                <div className="grid grid-cols-6 gap-4 mb-8">
                  {sectorGrid.map((row, rowIndex) => 
                    row.map((sectorId, colIndex) => {
                      const riskLevel = getRiskLevel(sectorId);
                      const personnel = getPersonnelInSector(sectorId);
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`relative aspect-square border-2 rounded-2xl p-4 transition-all duration-500 hover:scale-105 cursor-pointer ${
                            getSectorColor(riskLevel)
                          } shadow-lg transform hover:-translate-y-1`}
                          style={{ animationDelay: `${(rowIndex * 6 + colIndex) * 50}ms` }}
                          onClick={() => setSelectedPersonnel(personnel[0] || null)}
                        >
                          <div className="text-center h-full flex flex-col justify-between">
                            <div>
                              <div className="font-bold text-lg">{sectorId}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                Risk: {riskLevel.toUpperCase()}
                              </div>
                            </div>
                            
                            {/* Personnel positioning dots - positioned more realistically */}
                            <div className="absolute inset-0 p-2">
                              {personnel.map((person, index) => {
                                // Calculate position based on coordinates within sector
                                const xPos = 20 + (index * 15) + Math.random() * 20;
                                const yPos = 30 + (index * 10) + Math.random() * 20;
                                
                                return (
                                  <div
                                    key={person.id}
                                    className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse ${
                                      getPersonnelDotColor(person.status)
                                    } cursor-pointer transform hover:scale-150 transition-all duration-200`}
                                    style={{ 
                                      left: `${xPos}%`, 
                                      top: `${yPos}%`,
                                      animationDelay: `${index * 500}ms`
                                    }}
                                    title={`${person.name} - ${person.role} (${person.status.toUpperCase()})`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPersonnel(person);
                                    }}
                                  >
                                    {/* Health indicator */}
                                    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                                      person.heartRate > 90 ? 'bg-red-400' :
                                      person.heartRate > 80 ? 'bg-yellow-400' :
                                      'bg-green-400'
                                    } animate-ping`} />
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Personnel count badge */}
                            {personnel.length > 0 && (
                              <div className="absolute -top-2 -right-2 bg-white border-2 border-gray-300 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg animate-bounce">
                                {personnel.length}
                              </div>
                            )}
                            
                            {/* Temperature indicator for high-risk zones */}
                            {riskLevel === 'high' && (
                              <div className="absolute top-1 left-1 text-red-500 animate-pulse">
                                <Activity className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Enhanced Legend */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Personnel Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm">Active ({personnelData.filter(p => p.status === 'active').length})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse"></div>
                          <span className="text-sm">Warning ({personnelData.filter(p => p.status === 'warning').length})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm">Break ({personnelData.filter(p => p.status === 'break').length})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Risk Zones</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-400 rounded"></div>
                          <span className="text-sm">Low Risk</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-amber-400 rounded"></div>
                          <span className="text-sm">Medium Risk</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-400 rounded"></div>
                          <span className="text-sm">High Risk</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Health Indicators</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                          <span className="text-sm">Normal HR</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                          <span className="text-sm">Elevated HR</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                          <span className="text-sm">High HR</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Last Update</h4>
                      <div className="text-sm text-gray-600">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {currentTime.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Personnel Details */}
          {selectedPersonnel && (
            <Card className="border-blue-200 bg-blue-50 animate-slideInUp">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Selected Personnel: {selectedPersonnel.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Basic Info</h4>
                    <div className="space-y-1 text-sm">
                      <div>Role: {selectedPersonnel.role}</div>
                      <div>Sector: {selectedPersonnel.sector}</div>
                      <div>Status: <Badge className={getStatusColor(selectedPersonnel.status)}>{selectedPersonnel.status}</Badge></div>
                      <div>Shift: {selectedPersonnel.shiftStart}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Device Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Battery:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={selectedPersonnel.batteryLevel} className="w-16 h-2" />
                          <span className="text-sm font-semibold">{selectedPersonnel.batteryLevel}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Signal:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={selectedPersonnel.signalStrength} className="w-16 h-2" />
                          <span className="text-sm font-semibold">{selectedPersonnel.signalStrength}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Health Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div>Heart Rate: <span className={`font-semibold ${
                        selectedPersonnel.heartRate > 90 ? 'text-red-600' :
                        selectedPersonnel.heartRate > 80 ? 'text-amber-600' :
                        'text-green-600'
                      }`}>{selectedPersonnel.heartRate} BPM</span></div>
                      <div>Temperature: {selectedPersonnel.temperature}°C</div>
                      <div>Last Update: {selectedPersonnel.lastUpdate}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search personnel by name, role, or ID..."
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
                    {Array.from(new Set(personnelData.map(p => p.sector))).map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personnel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersonnel.map((person, index) => (
              <Card 
                key={person.id} 
                className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        person.status === 'active' ? 'bg-green-100' :
                        person.status === 'warning' ? 'bg-amber-100' :
                        person.status === 'break' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <Users className={`h-6 w-6 ${
                          person.status === 'active' ? 'text-green-600' :
                          person.status === 'warning' ? 'text-amber-600' :
                          person.status === 'break' ? 'text-blue-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{person.name}</CardTitle>
                        <CardDescription>{person.role}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(person.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(person.status)}
                        <span className="capitalize">{person.status}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location & Health */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Current Sector</p>
                      <p className="font-semibold">{person.sector}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Heart Rate</p>
                      <p className={`font-semibold ${
                        person.heartRate > 90 ? 'text-red-600' :
                        person.heartRate > 80 ? 'text-amber-600' :
                        'text-green-600'
                      }`}>{person.heartRate} BPM</p>
                    </div>
                  </div>

                  {/* Device Status */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Battery className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Battery</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-16 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full ${
                              person.batteryLevel > 50 ? 'bg-green-500' :
                              person.batteryLevel > 20 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${person.batteryLevel}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{person.batteryLevel}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wifi className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Signal</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              person.signalStrength > 70 ? 'bg-green-500' :
                              person.signalStrength > 30 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${person.signalStrength}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{person.signalStrength}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                    <span>Updated: {person.lastUpdate}</span>
                    {person.emergencyDevice && (
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3 text-green-500" />
                        <span className="text-green-600">Emergency Device</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="h-3 w-3 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Radio className="h-3 w-3 mr-1" />
                      Radio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <Card className="animate-slideInUp">
        <CardHeader>
          <CardTitle>Personnel Summary & Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-green-700">
                {personnelData.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-green-600">Active Personnel</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-amber-700">
                {Math.round(personnelData.reduce((acc, p) => acc + p.batteryLevel, 0) / personnelData.length)}%
              </div>
              <div className="text-sm text-amber-600">Avg Battery Level</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-blue-700">
                {Math.round(personnelData.reduce((acc, p) => acc + p.signalStrength, 0) / personnelData.length)}%
              </div>
              <div className="text-sm text-blue-600">Avg Signal Strength</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-purple-700">
                {personnelData.filter(p => p.emergencyDevice).length}
              </div>
              <div className="text-sm text-purple-600">Emergency Devices</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-pink-700">
                {Math.round(personnelData.reduce((acc, p) => acc + p.heartRate, 0) / personnelData.length)}
              </div>
              <div className="text-sm text-pink-600">Avg Heart Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovedPersonnelTracking;