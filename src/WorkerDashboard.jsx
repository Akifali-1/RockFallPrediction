import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { Separator } from './components/ui/separator';
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
  Thermometer
} from 'lucide-react';
import { mockPersonnel, mockSectors, mockAlerts, mockEvacuationRoutes, getRiskColor } from './mockData';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [currentSector] = useState('B-12');
  
  // Find current sector data
  const sectorData = mockSectors.find(s => s.id === currentSector) || mockSectors[0];
  const criticalAlerts = mockAlerts.filter(alert => alert.priority === 'critical').length;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{mockPersonnel.currentUser.name}</h1>
                <p className="text-sm text-gray-600">Sector {currentSector}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Emergency Button & Risk Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <Button
                onClick={handleEmergency}
                className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-bold"
                size="lg"
              >
                <AlertTriangle className="mr-3 h-8 w-8" />
                EMERGENCY
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`inline-flex items-center px-6 py-3 rounded-full text-white font-bold text-xl ${getRiskStatusColor(sectorData.riskLevel)}`}>
                  {getRiskStatusText(sectorData.riskLevel)}
                </div>
                <p className="text-sm text-gray-600 mt-2">Current Location Status</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Safety Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Am I Safe Here?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">Current Sector: {currentSector}</p>
                  <p className="text-sm text-gray-600">Risk Level: {sectorData.riskLevel.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <Badge className={getRiskColor(sectorData.riskLevel)}>
                    {sectorData.riskLevel.toUpperCase()}
                  </Badge>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Thermometer className="h-3 w-3 mr-1" />
                    {sectorData.temperature}°C
                  </div>
                </div>
              </div>
              
              {criticalAlerts > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {criticalAlerts} critical alert(s) in your area. Stay alert and follow safety protocols.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 flex-col">
                <Camera className="h-6 w-6 mb-1" />
                Report Hazard
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Navigation className="h-6 w-6 mb-1" />
                Evacuation Routes
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Phone className="h-6 w-6 mb-1" />
                Emergency Contacts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Evacuation Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Navigation className="mr-2 h-5 w-5" />
              Nearest Evacuation Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEvacuationRoutes.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{route.name}</p>
                    <p className="text-sm text-gray-600">Status: {route.status}</p>
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
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
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
              <Wifi className={`h-4 w-4 mr-1 ${connectionStatus === 'connected' ? 'text-green-500' : 'text-red-500'}`} />
              {connectionStatus === 'connected' ? 'Connected' : 'Offline'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;