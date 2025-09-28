import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Shield, AlertTriangle, Users, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';

const Login = () => {
  const [workerPin, setWorkerPin] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

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
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className={`rounded-full p-3 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
              <Shield className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MineSafe Pro</h1>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Advanced Mine Safety Monitoring System</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Emergency Access Button */}
        <Button
          onClick={handleEmergencyAccess}
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-shadow"
        >
          <AlertTriangle className="mr-2 h-5 w-5" />
          Emergency Override Access
        </Button>

        {/* Login Tabs */}
        <Card className={`border-0 shadow-xl transition-colors duration-300 ${isDarkMode
            ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
            : 'bg-white/90 backdrop-blur-sm border-gray-200'
          }`}>
          <CardHeader className="pb-4">
            <CardTitle className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              System Access
            </CardTitle>
            <CardDescription className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Select your role to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="worker" className="w-full">
              <TabsList className={`grid w-full grid-cols-2 mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                <TabsTrigger
                  value="worker"
                  className={`flex items-center gap-2 ${isDarkMode
                      ? 'data-[state=active]:bg-gray-600 data-[state=active]:text-white'
                      : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'
                    }`}
                >
                  <Users className="h-4 w-4" />
                  Worker
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className={`flex items-center gap-2 ${isDarkMode
                      ? 'data-[state=active]:bg-gray-600 data-[state=active]:text-white'
                      : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'
                    }`}
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              {/* Worker Login */}
              <TabsContent value="worker" className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="worker-pin"
                    className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                  >
                    Worker PIN
                  </Label>
                  <Input
                    id="worker-pin"
                    type="password"
                    placeholder="Enter your 4-digit PIN"
                    value={workerPin}
                    onChange={(e) => setWorkerPin(e.target.value)}
                    maxLength={4}
                    className={`text-center text-2xl tracking-widest ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleWorkerLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 shadow transition-colors"
                    disabled={workerPin.length < 4}
                  >
                    Access Worker Dashboard
                  </Button>
                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-xs ${isDarkMode
                          ? 'border-gray-600 text-gray-300'
                          : 'border-gray-300 text-gray-600'
                        }`}
                    >
                      Quick field access for safety checks
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              {/* Admin Login */}
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="admin-email"
                      className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                    >
                      Email Address
                    </Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@minesafe.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className={
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="admin-password"
                      className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                    >
                      Password
                    </Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className={
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleAdminLogin}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 shadow transition-colors"
                    disabled={!adminEmail || !adminPassword}
                  >
                    Access Admin Dashboard
                  </Button>
                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-xs ${isDarkMode
                          ? 'border-gray-600 text-gray-300'
                          : 'border-gray-300 text-gray-600'
                        }`}
                    >
                      Full system management access
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className={`border ${isDarkMode
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-gray-50 border-gray-200'
          }`}>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Demo Credentials:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Worker:
                  </p>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>PIN: 1234</p>
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    Admin:
                  </p>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Any email/password</p>
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