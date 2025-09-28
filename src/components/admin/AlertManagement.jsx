
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Settings,
  Users,
  Mail,
  Phone,
  Radio,
  Eye,
  Archive,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const AlertManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock alerts data
  const alertsData = [
    {
      id: 'ALT001',
      title: 'Ground Movement Detected',
      description: 'Accelerating movement detected in Sector B-12 north wall',
      priority: 'critical',
      status: 'active',
      sector: 'B-12',
      timestamp: '2025-01-23T10:30:00Z',
      acknowledgedBy: null,
      resolvedBy: null,
      affectedPersonnel: 12,
      sensorId: 'TILT_001',
      category: 'structural'
    },
    {
      id: 'ALT002',
      title: 'Low Battery Warning',
      description: 'Personnel device battery below 25% - James Thompson',
      priority: 'warning',
      status: 'acknowledged',
      sector: 'B-12',
      timestamp: '2025-01-23T09:45:00Z',
      acknowledgedBy: 'Sarah Chen',
      resolvedBy: null,
      affectedPersonnel: 1,
      sensorId: 'DEVICE_004',
      category: 'equipment'
    },
    {
      id: 'ALT003',
      title: 'New Crack Formation',
      description: 'New cracks detected in Sector A-5 via drone inspection',
      priority: 'warning',
      status: 'investigating',
      sector: 'A-5',
      timestamp: '2025-01-23T08:15:00Z',
      acknowledgedBy: 'Mike Rodriguez',
      resolvedBy: null,
      affectedPersonnel: 4,
      sensorId: 'DRONE_003',
      category: 'structural'
    },
    {
      id: 'ALT004',
      title: 'Sensor Communication Lost',
      description: 'Lost communication with vibration sensor VIB_005',
      priority: 'info',
      status: 'resolved',
      sector: 'C-1',
      timestamp: '2025-01-23T07:30:00Z',
      acknowledgedBy: 'Emily Watson',
      resolvedBy: 'David Kim',
      affectedPersonnel: 0,
      sensorId: 'VIB_005',
      category: 'technical'
    },
    {
      id: 'ALT005',
      title: 'High Rainfall Alert',
      description: 'Rainfall exceeding 20mm/hr detected, increased monitoring recommended',
      priority: 'warning',
      status: 'active',
      sector: 'ALL',
      timestamp: '2025-01-23T06:00:00Z',
      acknowledgedBy: null,
      resolvedBy: null,
      affectedPersonnel: 47,
      sensorId: 'WEATHER_001',
      category: 'environmental'
    },
    {
      id: 'ALT006',
      title: 'Equipment Maintenance Due',
      description: 'Scheduled maintenance required for Sector A-1 monitoring equipment',
      priority: 'info',
      status: 'scheduled',
      sector: 'A-1',
      timestamp: '2025-01-23T05:00:00Z',
      acknowledgedBy: 'Lisa Park',
      resolvedBy: null,
      affectedPersonnel: 8,
      sensorId: 'MAINT_001',
      category: 'maintenance'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'acknowledged': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'investigating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'info': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'structural': return '🏗️';
      case 'equipment': return '⚙️';
      case 'environmental': return '🌧️';
      case 'technical': return '🔧';
      case 'maintenance': return '🔧';
      default: return '📋';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return alertTime.toLocaleDateString();
    }
  };

  const filteredAlerts = alertsData.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || alert.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleAcknowledge = (alertId) => {
    console.log(`Acknowledging alert: ${alertId}`);
    // In real app, this would update the alert status
  };

  const handleResolve = (alertId) => {
    console.log(`Resolving alert: ${alertId}`);
    // In real app, this would mark the alert as resolved
  };

  const handleEscalate = (alertId) => {
    console.log(`Escalating alert: ${alertId}`);
    // In real app, this would escalate the alert
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Alert Management</h1>
            <p className="text-gray-600 mt-1">Monitor, acknowledge, and manage all system alerts</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {alertsData.filter(a => a.priority === 'critical').length}
                </div>
                <div className="text-xs text-gray-600">Critical</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {alertsData.filter(a => a.priority === 'warning').length}
                </div>
                <div className="text-xs text-gray-600">Warning</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {alertsData.filter(a => a.priority === 'info').length}
                </div>
                <div className="text-xs text-gray-600">Info</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {alertsData.filter(a => a.status === 'resolved').length}
                </div>
                <div className="text-xs text-gray-600">Resolved</div>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
              <Bell className="mr-2 h-4 w-4" />
              Configure Alerts
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search alerts by title, description, or sector..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`transition-all duration-200 hover:shadow-lg ${alert.priority === 'critical' ? 'border-l-4 border-l-red-500' :
                  alert.priority === 'warning' ? 'border-l-4 border-l-amber-500' :
                    'border-l-4 border-l-blue-500'
                }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg">{getCategoryIcon(alert.category)}</span>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(alert.priority)}>
                            <div className="flex items-center space-x-1">
                              {getPriorityIcon(alert.priority)}
                              <span className="capitalize">{alert.priority}</span>
                            </div>
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            <span className="capitalize">{alert.status}</span>
                          </Badge>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{alert.title}</h3>
                      <p className="text-gray-600 mb-3">{alert.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Sector:</span> {alert.sector}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {formatTime(alert.timestamp)}
                        </div>
                        <div>
                          <span className="font-medium">Personnel:</span> {alert.affectedPersonnel}
                        </div>
                        <div>
                          <span className="font-medium">Sensor:</span> {alert.sensorId}
                        </div>
                      </div>

                      {(alert.acknowledgedBy || alert.resolvedBy) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {alert.acknowledgedBy && (
                              <div>
                                <span className="font-medium">Acknowledged by:</span> {alert.acknowledgedBy}
                              </div>
                            )}
                            {alert.resolvedBy && (
                              <div>
                                <span className="font-medium">Resolved by:</span> {alert.resolvedBy}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      {alert.status === 'active' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAcknowledge(alert.id)}
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledge
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEscalate(alert.id)}
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Escalate
                          </Button>
                        </>
                      )}
                      {(alert.status === 'acknowledged' || alert.status === 'investigating') && (
                        <Button
                          size="sm"
                          onClick={() => handleResolve(alert.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Archive className="mr-2 h-5 w-5" />
                Alert History
              </CardTitle>
              <CardDescription>
                Historical alert data and resolution statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Archive className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Alert History</h3>
                <p className="text-gray-600">Detailed alert history and analytics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Worker Notification System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Worker Notification System
              </CardTitle>
              <CardDescription>
                Manage how workers receive safety alerts and emergency notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Emergency Broadcast */}
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-red-800">Emergency Broadcast</h3>
                    <Radio className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    Send immediate safety alerts to all personnel in affected sectors
                  </p>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Radio className="mr-2 h-4 w-4" />
                    Send Emergency Alert
                  </Button>
                </div>

                {/* Safety Announcements */}
                <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-amber-800">Safety Announcements</h3>
                    <Bell className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-sm text-amber-700 mb-4">
                    Send safety reminders and protocol updates to workers
                  </p>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    <Bell className="mr-2 h-4 w-4" />
                    Send Safety Notice
                  </Button>
                </div>

                {/* Evacuation Alerts */}
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-orange-800">Evacuation Alerts</h3>
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-sm text-orange-700 mb-4">
                    Trigger sector-specific or mine-wide evacuation procedures
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Trigger Evacuation
                  </Button>
                </div>

                {/* Equipment Alerts */}
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-800">Equipment Alerts</h3>
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    Notify workers about equipment malfunctions or maintenance
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    Equipment Notice
                  </Button>
                </div>
              </div>

              {/* Notification Channels */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Active Notification Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Radio className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Radio System</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">47 devices connected</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Mobile Alerts</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">52 phones registered</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Alarm System</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">12 zones covered</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Alert Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Alert Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Critical Risk Level</span>
                    <Badge className="bg-red-100 text-red-800">≥ 70%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Warning Risk Level</span>
                    <Badge className="bg-amber-100 text-amber-800">30-69%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Low Battery Warning</span>
                    <Badge className="bg-blue-100 text-blue-800">≤ 25%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Communication Timeout</span>
                    <Badge className="bg-purple-100 text-purple-800"> 10 min</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Configure Thresholds
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Email Notifications</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">SMS Alerts</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Critical Only</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Radio className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Radio Broadcast</span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Emergency Only</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Dashboard Alerts</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">All Levels</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Manage Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Reports & Analytics</CardTitle>
              <CardDescription>
                Generate detailed reports on alert patterns and response times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Alert Analytics</h3>
                <p className="text-gray-600">Comprehensive alert reporting and analytics dashboard</p>
                <Button className="mt-4">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertManagement;