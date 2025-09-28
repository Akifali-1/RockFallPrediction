import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  Thermometer,
  Droplets
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const RiskAnalysis = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedSector, setSelectedSector] = useState('all');

  // Historical risk data
  const riskTrendData = [
    { date: '2025-01-17', overall: 25, structural: 30, environmental: 20, operational: 25 },
    { date: '2025-01-18', overall: 28, structural: 32, environmental: 24, operational: 28 },
    { date: '2025-01-19', overall: 35, structural: 40, environmental: 30, operational: 35 },
    { date: '2025-01-20', overall: 42, structural: 45, environmental: 38, operational: 43 },
    { date: '2025-01-21', overall: 58, structural: 65, environmental: 50, operational: 60 },
    { date: '2025-01-22', overall: 65, structural: 70, environmental: 58, operational: 67 },
    { date: '2025-01-23', overall: 68, structural: 72, environmental: 62, operational: 70 }
  ];

  // Risk factor comparison
  const riskFactorsData = [
    { factor: 'Ground Movement', current: 85, baseline: 45, change: +40 },
    { factor: 'Water Pressure', current: 72, baseline: 60, change: +12 },
    { factor: 'Seismic Activity', current: 38, baseline: 25, change: +13 },
    { factor: 'Weather Impact', current: 65, baseline: 40, change: +25 },
    { factor: 'Equipment Stress', current: 45, baseline: 35, change: +10 },
    { factor: 'Human Factors', current: 28, baseline: 30, change: -2 }
  ];

  // Sector comparison data
  const sectorRiskData = [
    { sector: 'A-1', risk: 25, incidents: 2, personnel: 8 },
    { sector: 'A-2', risk: 30, incidents: 1, personnel: 6 },
    { sector: 'A-5', risk: 55, incidents: 4, personnel: 4 },
    { sector: 'B-12', risk: 85, incidents: 8, personnel: 12 },
    { sector: 'B-15', risk: 45, incidents: 3, personnel: 9 },
    { sector: 'C-1', risk: 20, incidents: 1, personnel: 8 }
  ];

  // Risk distribution pie chart data
  const riskDistribution = [
    { name: 'Structural', value: 35, color: '#ef4444' },
    { name: 'Environmental', value: 28, color: '#f97316' },
    { name: 'Operational', value: 22, color: '#eab308' },
    { name: 'Human Factors', value: 15, color: '#22c55e' }
  ];

  // Radar chart data for multi-factor analysis
  const radarData = [
    { factor: 'Stability', current: 65, baseline: 80, fullMark: 100 },
    { factor: 'Weather', current: 35, baseline: 60, fullMark: 100 },
    { factor: 'Equipment', current: 75, baseline: 85, fullMark: 100 },
    { factor: 'Personnel', current: 90, baseline: 88, fullMark: 100 },
    { factor: 'Environmental', current: 45, baseline: 70, fullMark: 100 },
    { factor: 'Structural', current: 30, baseline: 75, fullMark: 100 }
  ];

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const getRiskColor = (risk) => {
    if (risk < 30) return 'text-green-600';
    if (risk < 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (risk) => {
    if (risk < 30) return 'bg-green-50 border-green-200';
    if (risk < 60) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Risk Analysis</h1>
            <p className="text-gray-600 mt-1">Comprehensive risk assessment and trend analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical Risk Level</p>
                <div className="text-2xl font-bold text-red-700 mt-2">68%</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-600">+15% from last week</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">High-Risk Sectors</p>
                <div className="text-2xl font-bold text-amber-700 mt-2">3</div>
                <div className="flex items-center mt-1">
                  <Target className="h-3 w-3 text-amber-500 mr-1" />
                  <span className="text-xs text-amber-600">B-12, A-5, B-15</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Prediction Accuracy</p>
                <div className="text-2xl font-bold text-blue-700 mt-2">94.2%</div>
                <div className="flex items-center mt-1">
                  <Activity className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600">AI Model Performance</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Risk Events</p>
                <div className="text-2xl font-bold text-purple-700 mt-2">19</div>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 text-purple-500 mr-1" />
                  <span className="text-xs text-purple-600">Last 7 days</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Risk Trends</TabsTrigger>
          <TabsTrigger value="factors">Risk Factors</TabsTrigger>
          <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          {/* Risk Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Risk Trend Analysis - {selectedTimeRange.toUpperCase()}
              </CardTitle>
              <CardDescription>
                Historical risk progression across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={riskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="overall"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Overall Risk"
                    />
                    <Area
                      type="monotone"
                      dataKey="structural"
                      stackId="2"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.4}
                      name="Structural"
                    />
                    <Area
                      type="monotone"
                      dataKey="environmental"
                      stackId="3"
                      stroke="#eab308"
                      fill="#eab308"
                      fillOpacity={0.4}
                      name="Environmental"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        dataKey="value"
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.value}%</div>
                      <div className="text-xs text-gray-500">of total risk</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="factors" className="space-y-6">
          {/* Risk Factors Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Risk Factors Analysis
              </CardTitle>
              <CardDescription>
                Current vs baseline risk factor comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskFactorsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="factor" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="baseline" fill="#94a3b8" name="Baseline" opacity={0.6} />
                    <Bar dataKey="current" fill="#ef4444" name="Current" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskFactorsData.map((factor, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{factor.factor}</h3>
                    <Badge className={getRiskColor(factor.current) + ' ' + getRiskBgColor(factor.current)}>
                      {factor.current}%
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current Level</span>
                        <span className="font-semibold">{factor.current}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            factor.current < 30 ? 'bg-green-500' :
                            factor.current < 60 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${factor.current}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Change from baseline:</span>
                      <span className={`font-semibold ${
                        factor.change > 0 ? 'text-red-600' :
                        factor.change < 0 ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {factor.change > 0 ? '+' : ''}{factor.change}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          {/* Sector Risk Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Sector Risk Comparison
              </CardTitle>
              <CardDescription>
                Risk levels and incident correlation by sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorRiskData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="sector" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="risk" fill="#ef4444" name="Risk Level (%)" />
                    <Bar yAxisId="right" dataKey="incidents" fill="#f97316" name="Incidents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sector Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectorRiskData.map((sector, index) => (
              <Card key={index} className={getRiskBgColor(sector.risk)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Sector {sector.sector}</h3>
                    <Badge className={getRiskColor(sector.risk) + ' bg-white'}>
                      {sector.risk}% Risk
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{sector.incidents}</div>
                      <div className="text-sm text-gray-600">Incidents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{sector.personnel}</div>
                      <div className="text-sm text-gray-600">Personnel</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-xs text-gray-600">
                      Risk per person: {(sector.risk / sector.personnel).toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Multi-factor Radar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Multi-Factor Risk Assessment
              </CardTitle>
              <CardDescription>
                Current performance vs baseline across all risk factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Baseline"
                      dataKey="baseline"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Models */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="font-semibold text-blue-800">Next 24 Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">75%</div>
                    <div className="text-sm text-gray-600">Predicted Risk Level</div>
                  </div>
                  <div className="text-xs text-blue-700">
                    Expected increase due to weather conditions and ground instability.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="font-semibold text-purple-800">Next 7 Days</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600">55%</div>
                    <div className="text-sm text-gray-600">Average Risk Level</div>
                  </div>
                  <div className="text-xs text-purple-700">
                    Stabilization expected as weather improves and mitigation measures take effect.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="font-semibold text-green-800">Long Term</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">25%</div>
                    <div className="text-sm text-gray-600">Target Risk Level</div>
                  </div>
                  <div className="text-xs text-green-700">
                    Achievable through continued monitoring and proactive interventions.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskAnalysis;