// Mock data for mine safety monitoring system

export const mockSensorData = {
    tiltmeter: { current: 12.9, max: 25, percentage: 52, status: 'warning' },
    piezometer: { current: 8.5, max: 20, percentage: 43, status: 'normal' },
    vibration: { current: 19.8, max: 25, percentage: 79, status: 'critical' },
    crackmeter: { current: 11.0, max: 25, percentage: 44, status: 'normal' }
  };
  
  export const mockPersonnel = {
    online: 47,
    total: 52,
    currentUser: {
      name: 'Sarah Chen',
      sector: 'B-12',
      role: 'worker'
    }
  };
  
  export const mockAlerts = [
    {
      id: 1,
      priority: 'critical',
      message: 'Sector B-12 - Accelerating movement detected',
      timestamp: '2025-01-23T10:30:00Z',
      sector: 'B-12',
      acknowledged: false
    },
    {
      id: 2,
      priority: 'warning',
      message: 'Sector A-5 - New cracks detected in north wall',
      timestamp: '2025-01-23T09:15:00Z',
      sector: 'A-5',
      acknowledged: false
    },
    {
      id: 3,
      priority: 'info',
      message: 'Drone scan completed for sectors C-1 to C-8',
      timestamp: '2025-01-23T08:45:00Z',
      sector: 'C-1',
      acknowledged: true
    }
  ];
  
  export const mockSectors = [
    { id: 'A-1', riskLevel: 'low', personnel: 8, temperature: 22 },
    { id: 'A-2', riskLevel: 'low', personnel: 6, temperature: 24 },
    { id: 'A-5', riskLevel: 'medium', personnel: 4, temperature: 26 },
    { id: 'B-12', riskLevel: 'high', personnel: 12, temperature: 28 },
    { id: 'B-15', riskLevel: 'medium', personnel: 9, temperature: 25 },
    { id: 'C-1', riskLevel: 'low', personnel: 8, temperature: 23 }
  ];
  
  export const mockSystemStatus = {
    overallRisk: 'medium',
    activeSensors: 127,
    totalSensors: 130,
    criticalAlerts: 3,
    lastUpdated: '2025-01-23T10:32:15Z'
  };
  
  export const mockWeatherData = {
    rainfall: 15.2,
    temperature: 18,
    windSpeed: 12,
    windDirection: 'NW',
    lastUpdated: '2025-01-23T10:00:00Z'
  };
  
  export const mockEvacuationRoutes = [
    { id: 'route-1', name: 'Primary Exit A', status: 'clear', estimatedTime: '12 min' },
    { id: 'route-2', name: 'Emergency Exit B', status: 'clear', estimatedTime: '8 min' },
    { id: 'route-3', name: 'Service Tunnel C', status: 'blocked', estimatedTime: 'N/A' }
  ];
  
  export const mockHistoricalData = {
    riskTrends: [
      { date: '2025-01-16', risk: 0.2 },
      { date: '2025-01-17', risk: 0.3 },
      { date: '2025-01-18', risk: 0.25 },
      { date: '2025-01-19', risk: 0.4 },
      { date: '2025-01-20', risk: 0.6 },
      { date: '2025-01-21', risk: 0.7 },
      { date: '2025-01-22', risk: 0.65 },
      { date: '2025-01-23', risk: 0.8 }
    ]
  };
  
  // Helper function to get risk color
  export const getRiskColor = (level) => {
    switch (level) {
      case 'low':
      case 'normal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'high':
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  // Helper function to get priority icon
  export const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'info':
        return '🔵';
      default:
        return '⚪';
    }
  };