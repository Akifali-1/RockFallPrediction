import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import {
  Shield,
  BarChart3,
  Radio,
  Box,
  Brain,
  Users,
  TrendingUp,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

const ImprovedAdminLayout = ({ children, activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount] = useState(5);

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      badge: null,
      description: 'Main dashboard and analytics',
      color: 'bg-blue-500'
    },
    {
      id: 'sensor-network',
      label: 'Sensor Network',
      icon: Radio,
      badge: '12 Active',
      description: 'Monitor all sensors',
      color: 'bg-green-500'
    },
    {
      id: '3d-mine-view',
      label: '3D Mine View',
      icon: Box,
      badge: null,
      description: 'Interactive mine visualization',
      color: 'bg-purple-500'
    },
    {
      id: 'ai-predictive',
      label: 'AI Predictive',
      icon: Brain,
      badge: 'ML Active',
      description: 'Machine learning predictions',
      color: 'bg-indigo-500'
    },
    {
      id: 'personnel-tracking',
      label: 'Personnel Tracking',
      icon: Users,
      badge: '47 Online',
      description: 'Track all personnel',
      color: 'bg-cyan-500'
    },
    {
      id: 'risk-analysis',
      label: 'Risk Analysis',
      icon: TrendingUp,
      badge: null,
      description: 'Risk assessment tools',
      color: 'bg-orange-500'
    },
    {
      id: 'alert-management',
      label: 'Alert Management',
      icon: AlertTriangle,
      badge: '3',
      description: 'Manage all alerts',
      color: 'bg-red-500'
    },
    {
      id: 'manual-data-entry',
      label: 'Manual Data Entry',
      icon: Settings,
      badge: null,
      description: 'Upload DEM data and drone images',
      color: 'bg-teal-500'
    }
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left side - Logo & Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-2 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MineSafe Pro
                </h1>
                <p className="text-xs text-gray-500">Mine Safety AI Platform</p>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search sensors, alerts, personnel..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">Demo User</p>
                <p className="text-xs text-gray-500">Safety Administrator</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-semibold">
                  DU
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 mt-16 lg:mt-16`}>

        {/* User Info Card */}
        <div className="p-6 border-b border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/api/placeholder/48/48" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                  DU
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Demo User</h3>
                <p className="text-sm text-gray-600">Sector Administrator</p>
                <div className="flex items-center mt-2">
                  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                    Sector 7
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] sidebar-nav">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Main Navigation
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                  : 'hover:bg-gray-50 text-gray-700 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center p-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${isActive
                    ? 'bg-white/20 text-white'
                    : `${item.color} text-white group-hover:scale-110`
                    }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1 text-left">
                    <div className={`font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                  {item.badge && (
                    <Badge
                      className={`text-xs ${isActive
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-l-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-gray-100 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-50"
            size="sm"
          >
            <Settings className="mr-3 h-4 w-4" />
            System Settings
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            size="sm"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-80 pt-16">
        {children}
      </div>
    </div>
  );
};

export default ImprovedAdminLayout;