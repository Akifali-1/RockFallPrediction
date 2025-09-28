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

  // Multi-mine database
  export const mockMines = {
    'karimnagar': {
      id: 'karimnagar',
      name: 'Karimnagar Mine',
      location: 'Telangana, India',
      coordinates: [18.4361, 79.1282],
      status: 'Active',
      riskLevel: 'Medium',
      personnel: 150,
      sensors: { active: 147, total: 150 },
      lastInspection: '2024-01-14',
      mineType: 'Open Pit',
      depth: '120m',
      area: '2.5 sq km',
      established: '2018',
      manager: 'Rajesh Kumar',
      contact: '+91-9876543210',
      alerts: 3,
      heatmapData: {
        hotspots: [
          { x: 120, y: 80, intensity: 0.8 },
          { x: 280, y: 150, intensity: 0.6 },
          { x: 200, y: 220, intensity: 0.4 }
        ],
        riskZones: ['North: High', 'East: Medium', 'South: Low', 'West: Critical']
      },
      timelineData: [
        { time: '00:00', overall: 45, crack: 42, displacement: 38, weather: 35 },
        { time: '02:00', overall: 48, crack: 45, displacement: 40, weather: 38 },
        { time: '04:00', overall: 52, crack: 48, displacement: 42, weather: 40 },
        { time: '06:00', overall: 55, crack: 52, displacement: 45, weather: 42 },
        { time: '08:00', overall: 58, crack: 55, displacement: 48, weather: 45 },
        { time: '10:00', overall: 62, crack: 58, displacement: 52, weather: 48 },
        { time: '12:00', overall: 65, crack: 62, displacement: 55, weather: 50 },
        { time: '14:00', overall: 68, crack: 65, displacement: 58, weather: 52 },
        { time: '16:00', overall: 70, crack: 68, displacement: 60, weather: 54 },
        { time: '18:00', overall: 72, crack: 70, displacement: 62, weather: 56 },
        { time: '20:00', overall: 75, crack: 72, displacement: 65, weather: 58 },
        { time: '22:00', overall: 78, crack: 75, displacement: 68, weather: 60 },
        { time: '24:00', overall: 80, crack: 78, displacement: 70, weather: 62 }
      ],
      sensorData: {
        tiltmeter: { current: 12.9, max: 25, percentage: 52, status: 'warning' },
        piezometer: { current: 8.5, max: 20, percentage: 43, status: 'normal' },
        vibration: { current: 19.8, max: 25, percentage: 79, status: 'critical' },
        crackmeter: { current: 11.0, max: 25, percentage: 44, status: 'normal' }
      },
      personnelData: {
        online: 135,
        total: 150,
        sectors: [
          { id: 'A-1', personnel: 8, status: 'safe' },
          { id: 'A-2', personnel: 6, status: 'safe' },
          { id: 'B-12', personnel: 12, status: 'warning' },
          { id: 'C-1', personnel: 8, status: 'safe' }
        ]
      },
      aiPredictions: {
        crackPrediction: 65,
        displacementPrediction: 58,
        riskScore: 72,
        confidence: 87
      }
    },
    'bellary': {
      id: 'bellary',
      name: 'Bellary Iron Mine',
      location: 'Karnataka, India',
      coordinates: [15.1394, 76.9214],
      status: 'Active',
      riskLevel: 'High',
      personnel: 200,
      sensors: { active: 185, total: 200 },
      lastInspection: '2024-01-12',
      mineType: 'Open Pit',
      depth: '180m',
      area: '4.2 sq km',
      established: '2015',
      manager: 'Priya Sharma',
      contact: '+91-9876543211',
      alerts: 7,
      heatmapData: {
        hotspots: [
          { x: 100, y: 100, intensity: 0.9 },
          { x: 300, y: 120, intensity: 0.7 },
          { x: 150, y: 250, intensity: 0.5 }
        ],
        riskZones: ['North: Critical', 'East: High', 'South: Medium', 'West: High']
      },
      timelineData: [
        { time: '00:00', overall: 70, crack: 68, displacement: 65, weather: 60 },
        { time: '02:00', overall: 72, crack: 70, displacement: 67, weather: 62 },
        { time: '04:00', overall: 75, crack: 72, displacement: 70, weather: 65 },
        { time: '06:00', overall: 78, crack: 75, displacement: 72, weather: 67 },
        { time: '08:00', overall: 80, crack: 78, displacement: 75, weather: 70 },
        { time: '10:00', overall: 82, crack: 80, displacement: 77, weather: 72 },
        { time: '12:00', overall: 85, crack: 82, displacement: 80, weather: 75 },
        { time: '14:00', overall: 87, crack: 85, displacement: 82, weather: 77 },
        { time: '16:00', overall: 90, crack: 87, displacement: 85, weather: 80 },
        { time: '18:00', overall: 92, crack: 90, displacement: 87, weather: 82 },
        { time: '20:00', overall: 95, crack: 92, displacement: 90, weather: 85 },
        { time: '22:00', overall: 97, crack: 95, displacement: 92, weather: 87 },
        { time: '24:00', overall: 100, crack: 97, displacement: 95, weather: 90 }
      ],
      sensorData: {
        tiltmeter: { current: 18.5, max: 25, percentage: 74, status: 'critical' },
        piezometer: { current: 15.2, max: 20, percentage: 76, status: 'critical' },
        vibration: { current: 22.1, max: 25, percentage: 88, status: 'critical' },
        crackmeter: { current: 19.8, max: 25, percentage: 79, status: 'critical' }
      },
      personnelData: {
        online: 180,
        total: 200,
        sectors: [
          { id: 'A-1', personnel: 15, status: 'critical' },
          { id: 'A-2', personnel: 12, status: 'warning' },
          { id: 'B-12', personnel: 18, status: 'critical' },
          { id: 'C-1', personnel: 10, status: 'safe' }
        ]
      },
      aiPredictions: {
        crackPrediction: 85,
        displacementPrediction: 78,
        riskScore: 92,
        confidence: 94
      }
    },
    'singrauli': {
      id: 'singrauli',
      name: 'Singrauli Coal Mine',
      location: 'Madhya Pradesh, India',
      coordinates: [24.1997, 82.6753],
      status: 'Active',
      riskLevel: 'Low',
      personnel: 120,
      sensors: { active: 118, total: 120 },
      lastInspection: '2024-01-15',
      mineType: 'Underground',
      depth: '300m',
      area: '1.8 sq km',
      established: '2020',
      manager: 'Amit Patel',
      contact: '+91-9876543212',
      alerts: 1,
      heatmapData: {
        hotspots: [
          { x: 200, y: 150, intensity: 0.3 },
          { x: 150, y: 200, intensity: 0.2 }
        ],
        riskZones: ['North: Low', 'East: Low', 'South: Very Low', 'West: Medium']
      },
      timelineData: [
        { time: '00:00', overall: 20, crack: 18, displacement: 15, weather: 12 },
        { time: '02:00', overall: 22, crack: 20, displacement: 17, weather: 14 },
        { time: '04:00', overall: 25, crack: 22, displacement: 20, weather: 16 },
        { time: '06:00', overall: 28, crack: 25, displacement: 22, weather: 18 },
        { time: '08:00', overall: 30, crack: 28, displacement: 25, weather: 20 },
        { time: '10:00', overall: 32, crack: 30, displacement: 27, weather: 22 },
        { time: '12:00', overall: 35, crack: 32, displacement: 30, weather: 24 },
        { time: '14:00', overall: 37, crack: 35, displacement: 32, weather: 26 },
        { time: '16:00', overall: 40, crack: 37, displacement: 35, weather: 28 },
        { time: '18:00', overall: 42, crack: 40, displacement: 37, weather: 30 },
        { time: '20:00', overall: 45, crack: 42, displacement: 40, weather: 32 },
        { time: '22:00', overall: 47, crack: 45, displacement: 42, weather: 34 },
        { time: '24:00', overall: 50, crack: 47, displacement: 45, weather: 36 }
      ],
      sensorData: {
        tiltmeter: { current: 5.2, max: 25, percentage: 21, status: 'normal' },
        piezometer: { current: 3.8, max: 20, percentage: 19, status: 'normal' },
        vibration: { current: 8.1, max: 25, percentage: 32, status: 'normal' },
        crackmeter: { current: 4.5, max: 25, percentage: 18, status: 'normal' }
      },
      personnelData: {
        online: 108,
        total: 120,
        sectors: [
          { id: 'A-1', personnel: 6, status: 'safe' },
          { id: 'A-2', personnel: 4, status: 'safe' },
          { id: 'B-12', personnel: 8, status: 'safe' },
          { id: 'C-1', personnel: 6, status: 'safe' }
        ]
      },
      aiPredictions: {
        crackPrediction: 25,
        displacementPrediction: 18,
        riskScore: 22,
        confidence: 95
      }
    },
    'joda': {
      id: 'joda',
      name: 'Joda Iron Ore Mine',
      location: 'Odisha, India',
      coordinates: [22.0200, 85.4300],
      status: 'Critical',
      riskLevel: 'Critical',
      personnel: 180,
      sensors: { active: 165, total: 180 },
      lastInspection: '2024-01-10',
      mineType: 'Open Pit',
      depth: '250m',
      area: '3.5 sq km',
      established: '2012',
      manager: 'Suresh Reddy',
      contact: '+91-9876543213',
      alerts: 12,
      heatmapData: {
        hotspots: [
          { x: 80, y: 100, intensity: 0.95 },
          { x: 320, y: 80, intensity: 0.9 },
          { x: 200, y: 280, intensity: 0.8 },
          { x: 120, y: 200, intensity: 0.85 }
        ],
        riskZones: ['North: Critical', 'East: Critical', 'South: High', 'West: Critical']
      },
      timelineData: [
        { time: '00:00', overall: 85, crack: 82, displacement: 80, weather: 75 },
        { time: '02:00', overall: 87, crack: 85, displacement: 82, weather: 77 },
        { time: '04:00', overall: 90, crack: 87, displacement: 85, weather: 80 },
        { time: '06:00', overall: 92, crack: 90, displacement: 87, weather: 82 },
        { time: '08:00', overall: 95, crack: 92, displacement: 90, weather: 85 },
        { time: '10:00', overall: 97, crack: 95, displacement: 92, weather: 87 },
        { time: '12:00', overall: 100, crack: 97, displacement: 95, weather: 90 },
        { time: '14:00', overall: 100, crack: 100, displacement: 97, weather: 92 },
        { time: '16:00', overall: 100, crack: 100, displacement: 100, weather: 95 },
        { time: '18:00', overall: 100, crack: 100, displacement: 100, weather: 97 },
        { time: '20:00', overall: 100, crack: 100, displacement: 100, weather: 100 },
        { time: '22:00', overall: 100, crack: 100, displacement: 100, weather: 100 },
        { time: '24:00', overall: 100, crack: 100, displacement: 100, weather: 100 }
      ],
      sensorData: {
        tiltmeter: { current: 24.8, max: 25, percentage: 99, status: 'critical' },
        piezometer: { current: 19.5, max: 20, percentage: 98, status: 'critical' },
        vibration: { current: 24.9, max: 25, percentage: 100, status: 'critical' },
        crackmeter: { current: 24.2, max: 25, percentage: 97, status: 'critical' }
      },
      personnelData: {
        online: 162,
        total: 180,
        sectors: [
          { id: 'A-1', personnel: 20, status: 'critical' },
          { id: 'A-2', personnel: 18, status: 'critical' },
          { id: 'B-12', personnel: 25, status: 'critical' },
          { id: 'C-1', personnel: 15, status: 'warning' }
        ]
      },
      aiPredictions: {
        crackPrediction: 98,
        displacementPrediction: 95,
        riskScore: 100,
        confidence: 99
      }
    }
  };

  // Get current mine data (defaults to Karimnagar)
  export const getCurrentMineData = (mineId = 'karimnagar') => {
    return mockMines[mineId] || mockMines['karimnagar'];
  };

  // Get all mines for selection
  export const getAllMines = () => {
    return Object.values(mockMines);
  };

  // Get critical mines (risk level High or Critical)
  export const getCriticalMines = () => {
    return Object.values(mockMines).filter(mine => 
      mine.riskLevel === 'High' || mine.riskLevel === 'Critical'
    );
  };