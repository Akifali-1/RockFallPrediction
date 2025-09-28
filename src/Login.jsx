import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Shield, AlertTriangle, Users, Settings } from 'lucide-react';

const Login = () => {
  const [workerPin, setWorkerPin] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const navigate = useNavigate();

  const handleWorkerLogin = () => {
    if (workerPin.length >= 4) {
      // Mock validation - in real app would verify PIN
      navigate('/worker-dashboard');
    }
  };

  const handleAdminLogin = () => {
    if (adminEmail && adminPassword) {
      // Mock validation - in real app would verify credentials
      navigate('/admin-dashboard');
    }
  };

  const handleEmergencyAccess = () => {
    navigate('/emergency');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3">
              <Shield className="h-8 w-8 text-slate-800" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">MineSafe Pro</h1>
          <p className="text-slate-300">Advanced Mine Safety Monitoring System</p>
        </div>

        {/* Emergency Access Button */}
        <Button
          onClick={handleEmergencyAccess}
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
        >
          <AlertTriangle className="mr-2 h-5 w-5" />
          Emergency Override Access
        </Button>

        {/* Login Tabs */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-slate-800">System Access</CardTitle>
            <CardDescription className="text-center">
              Select your role to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="worker" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="worker" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Worker
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              {/* Worker Login */}
              <TabsContent value="worker" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="worker-pin">Worker PIN</Label>
                  <Input
                    id="worker-pin"
                    type="password"
                    placeholder="Enter your 4-digit PIN"
                    value={workerPin}
                    onChange={(e) => setWorkerPin(e.target.value)}
                    maxLength={4}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleWorkerLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={workerPin.length < 4}
                  >
                    Access Worker Dashboard
                  </Button>
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      Quick field access for safety checks
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              {/* Admin Login */}
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Address</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@minesafe.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleAdminLogin}
                    className="w-full bg-slate-800 hover:bg-slate-700"
                    disabled={!adminEmail || !adminPassword}
                  >
                    Access Admin Dashboard
                  </Button>
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      Full system management access
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-center text-sm text-slate-300">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-medium text-blue-300">Worker:</p>
                  <p>PIN: 1234</p>
                </div>
                <div>
                  <p className="font-medium text-slate-300">Admin:</p>
                  <p>Any email/password</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;