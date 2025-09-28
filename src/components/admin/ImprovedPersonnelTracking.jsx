import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useMine } from '../../contexts/MineContext';
import { useTheme } from '../../contexts/ThemeContext';
import MineSelector from '../MineSelector';
import ThemeToggle from '../ThemeToggle';
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

  // Use global mine context
  const { currentMine } = useMine();
  const { isDarkMode } = useTheme();

  // Get mine-specific personnel data - use actual data from currentMine
  const minePersonnelData = currentMine.personnelData || {};
  const totalPersonnel = currentMine.personnel || 0;
  const onlinePersonnel = minePersonnelData.online || Math.round(totalPersonnel * 0.9);

  // Generate realistic personnel data based on mine size and sectors
  const generatePersonnelForMine = () => {
    const sectors = minePersonnelData.sectors || [
      { id: 'A-1', personnel: Math.floor(totalPersonnel * 0.15), status: 'safe' },
      { id: 'B-12', personnel: Math.floor(totalPersonnel * 0.25), status: currentMine.riskLevel === 'Critical' ? 'critical' : 'safe' },
      { id: 'C-1', personnel: Math.floor(totalPersonnel * 0.20), status: 'safe' },
      { id: 'A-5', personnel: Math.floor(totalPersonnel * 0.18), status: 'safe' },
      { id: 'B-15', personnel: Math.floor(totalPersonnel * 0.22), status: 'safe' }
    ];

    const personnelList = [];
    const names = ['Sarah Chen', 'Mike Rodriguez', 'Emily Watson', 'James Thompson', 'Lisa Park', 'David Kim', 'Anna Singh', 'Robert Brown', 'Maria Garcia', 'John Wilson'];
    const roles = ['Safety Inspector', 'Equipment Operator', 'Geologist', 'Maintenance Tech', 'Environmental Monitor', 'Security Officer'];

    let personnelIndex = 0;
    sectors.forEach((sector, sectorIndex) => {
      for (let i = 0; i < sector.personnel && personnelIndex < totalPersonnel; i++) {
        personnelList.push({
          id: `P${String(personnelIndex + 1).padStart(3, '0')}`,
          name: names[personnelIndex % names.length] + (personnelIndex >= names.length ? ` ${Math.floor(personnelIndex / names.length) + 1}` : ''),
          role: roles[personnelIndex % roles.length],
          sector: sector.id,
          status: sector.status === 'critical' && i < 2 ? 'warning' : (Math.random() > 0.95 ? 'warning' : 'active'),
          lastUpdate: `${Math.floor(Math.random() * 10) + 1} min ago`,
          batteryLevel: Math.floor(Math.random() * 40) + 60,
          signalStrength: Math.floor(Math.random() * 30) + 70,
          emergencyDevice: true,
          gridPosition: { row: 0, col: sectorIndex },
          coordinates: { x: Math.random() * 300, y: Math.random() * 200 },
          heartRate: Math.floor(Math.random() * 30) + 65,
          temperature: (Math.random() * 1.5 + 35.8).toFixed(1)
        });
        personnelIndex++;
      }
    });

    return personnelList;
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced personnel data with precise grid positions - using mine-specific data
  const personnelData = generatePersonnelForMine();

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
    // Use mine-specific sector risk levels based on current mine's risk level
    const baseRiskMap = {
      'A-1': 'low', 'A-2': 'low', 'A-5': 'medium', 'A-6': 'low', 'A-7': 'low', 'A-8': 'low', 'A-9': 'low', 'A-10': 'low', 'A-11': 'low',
      'B-12': 'high', 'B-13': 'medium', 'B-14': 'medium', 'B-15': 'medium', 'B-16': 'low', 'B-17': 'low',
      'C-1': 'low', 'C-2': 'low', 'C-3': 'low'
    };

    let riskLevel = baseRiskMap[sectorId] || 'low';

    // Adjust risk based on current mine's overall risk level
    if (currentMine.riskLevel === 'Critical') {
      if (riskLevel === 'medium') riskLevel = 'high';
      if (riskLevel === 'low' && ['B-12', 'B-13', 'A-5'].includes(sectorId)) riskLevel = 'medium';
    } else if (currentMine.riskLevel === 'High') {
      if (riskLevel === 'low' && sectorId === 'B-12') riskLevel = 'medium';
    }

    return riskLevel;
  };

  const getSectorColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-200 dark:bg-red-800/30 border-red-400 dark:border-red-600';
      case 'medium': return 'bg-amber-200 dark:bg-amber-800/30 border-amber-400 dark:border-amber-600';
      case 'low': return 'bg-green-200 dark:bg-green-800/30 border-green-400 dark:border-green-600';
      default: return 'bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-600';
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
    <div className="p-6 space-y-6 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transform hover:scale-[1.01] transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Personnel Tracking - {currentMine.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time location and safety monitoring of all personnel</p>
            <div className="mt-4">
              <MineSelector />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="transform hover:scale-110 transition-all duration-200">
                <div className="text-2xl font-bold text-green-600">
                  {onlinePersonnel}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Online</div>
              </div>
              <div className="transform hover:scale-110 transition-all duration-200">
                <div className="text-2xl font-bold text-amber-600">
                  {personnelData.filter(p => p.status === 'warning').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Warning</div>
              </div>
              <div className="transform hover:scale-110 transition-all duration-200">
                <div className="text-2xl font-bold text-blue-600">
                  {totalPersonnel}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
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
          <Card className="transform hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                <MapPin className="mr-2 h-5 w-5" />
                Live Personnel Positioning System
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Real-time personnel positions with health monitoring across mine sectors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl">
                <div className="grid grid-cols-6 gap-4 mb-8">
                  {sectorGrid.map((row, rowIndex) =>
                    row.map((sectorId, colIndex) => {
                      const riskLevel = getRiskLevel(sectorId);
                      const personnel = getPersonnelInSector(sectorId);
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`relative aspect-square border-2 rounded-2xl p-3 transition-all duration-500 hover:scale-105 cursor-pointer ${getSectorColor(riskLevel)
                            } shadow-lg transform hover:-translate-y-1 overflow-hidden`}
                          style={{ animationDelay: `${(rowIndex * 6 + colIndex) * 50}ms` }}
                          onClick={() => setSelectedPersonnel(personnel[0] || null)}
                        >
                          <div className="text-center h-full flex flex-col justify-between relative z-10">
                            <div>
                              <div className="font-bold text-lg text-gray-800 dark:text-gray-200">{sectorId}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Risk: {riskLevel.toUpperCase()}
                              </div>
                            </div>

                            {/* Personnel positioning dots - fixed positioning to prevent overflow */}
                            <div className="absolute inset-2 flex flex-wrap gap-1 items-center justify-center">
                              {personnel.slice(0, 6).map((person, index) => {
                                // Use a grid-like positioning to prevent overflow
                                const row = Math.floor(index / 3);
                                const col = index % 3;
                                const xPos = 20 + col * 25;
                                const yPos = 35 + row * 20;

                                return (
                                  <div
                                    key={person.id}
                                    className={`absolute w-3 h-3 rounded-full border border-white/50 shadow-sm animate-pulse ${getPersonnelDotColor(person.status)
                                      } cursor-pointer transform hover:scale-125 transition-all duration-200 z-20`}
                                    style={{
                                      left: `${Math.min(xPos, 70)}%`,
                                      top: `${Math.min(yPos, 60)}%`,
                                      animationDelay: `${index * 300}ms`
                                    }}
                                    title={`${person.name} - ${person.role} (${person.status.toUpperCase()})`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPersonnel(person);
                                    }}
                                  >
                                    {/* Health indicator */}
                                    <div className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${person.heartRate > 90 ? 'bg-red-400' :
                                      person.heartRate > 80 ? 'bg-yellow-400' :
                                        'bg-green-400'
                                      } animate-ping`} />
                                  </div>
                                );
                              })}
                              {personnel.length > 6 && (
                                <div className="absolute bottom-1 right-1 text-xs text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-1 rounded z-20">
                                  +{personnel.length - 6}
                                </div>
                              )}
                            </div>

                            {/* Personnel count badge */}
                            {personnel.length > 0 && (
                              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-bounce z-30">
                                <span className="text-gray-800 dark:text-gray-200">{personnel.length}</span>
                              </div>
                            )}

                            {/* Temperature indicator for high-risk zones */}
                            {riskLevel === 'high' && (
                              <div className="absolute top-1 left-1 text-red-500 animate-pulse z-20">
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
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">Personnel Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Active ({personnelData.filter(p => p.status === 'active').length})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Warning ({personnelData.filter(p => p.status === 'warning').length})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Break ({personnelData.filter(p => p.status === 'break').length})</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">Risk Zones</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-400 rounded"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Low Risk</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-amber-400 rounded"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Medium Risk</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-400 rounded"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">High Risk</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">Health Indicators</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Normal HR</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Elevated HR</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">High HR</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">Last Update</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
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
                      <div>Heart Rate: <span className={`font-semibold ${selectedPersonnel.heartRate > 90 ? 'text-red-600' :
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
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${person.status === 'active' ? 'bg-green-100' :
                        person.status === 'warning' ? 'bg-amber-100' :
                          person.status === 'break' ? 'bg-blue-100' :
                            'bg-gray-100'
                        }`}>
                        <Users className={`h-6 w-6 ${person.status === 'active' ? 'text-green-600' :
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
                      <p className={`font-semibold ${person.heartRate > 90 ? 'text-red-600' :
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
                            className={`h-full ${person.batteryLevel > 50 ? 'bg-green-500' :
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
                            className={`h-full ${person.signalStrength > 70 ? 'bg-green-500' :
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