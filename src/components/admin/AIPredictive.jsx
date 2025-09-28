import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useMine } from '../../contexts/MineContext';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../PageHeader';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AIPredictive = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedModel, setSelectedModel] = useState('crack');

  // Use global mine context
  const { currentMine } = useMine();

  // Get mine-specific AI prediction data
  const mineAIData = currentMine.aiPredictions || {};

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mine-specific prediction models
  const predictionModels = {
    crack: {
      name: 'Crack Probability Model',
      description: 'Predicts probability of crack formation and propagation',
      confidence: mineAIData.confidence || 94,
      status: 'active',
      lastUpdate: '2 minutes ago',
      currentRisk: mineAIData.crackPrediction || 68,
      trend: 'increasing',
      accuracy: mineAIData.confidence || 94.2,
      predictions: [
        { time: '00:00', probability: 45, actual: 42 },
        { time: '04:00', probability: 52, actual: 48 },
        { time: '08:00', probability: 58, actual: 61 },
        { time: '12:00', probability: 64, actual: 59 },
        { time: '16:00', probability: 68, actual: 71 },
        { time: '20:00', probability: 72, actual: null },
        { time: '24:00', probability: 75, actual: null },
      ],
      factors: [
        { name: 'Ground Water Pressure', impact: 85, trend: 'high' },
        { name: 'Temperature Changes', impact: 72, trend: 'medium' },
        { name: 'Seismic Activity', impact: 68, trend: 'medium' },
        { name: 'Rock Composition', impact: 45, trend: 'stable' }
      ]
    },
    displacement: {
      name: 'Displacement Probability Model',
      description: 'Monitors and predicts ground displacement patterns',
      confidence: mineAIData.confidence || 89,
      status: 'active',
      lastUpdate: '5 minutes ago',
      currentRisk: mineAIData.displacementPrediction || 42,
      trend: 'stable',
      accuracy: mineAIData.confidence || 89.7,
      predictions: [
        { time: '00:00', probability: 35, actual: 33 },
        { time: '04:00', probability: 38, actual: 41 },
        { time: '08:00', probability: 41, actual: 39 },
        { time: '12:00', probability: 42, actual: 44 },
        { time: '16:00', probability: 43, actual: 42 },
        { time: '20:00', probability: 44, actual: null },
        { time: '24:00', probability: 45, actual: null },
      ],
      factors: [
        { name: 'Soil Moisture', impact: 78, trend: 'high' },
        { name: 'Rainfall Impact', impact: 65, trend: 'medium' },
        { name: 'Mining Activity', impact: 54, trend: 'medium' },
        { name: 'Geological Structure', impact: 42, trend: 'stable' }
      ]
    },
    baseline: {
      name: 'Static/Baseline Probability Model',
      description: 'Establishes baseline stability measurements and anomaly detection',
      confidence: mineAIData.confidence || 96,
      status: 'active',
      lastUpdate: '1 minute ago',
      currentRisk: mineAIData.riskScore || 23,
      trend: 'decreasing',
      accuracy: mineAIData.confidence || 96.1,
      predictions: [
        { time: '00:00', probability: 28, actual: 26 },
        { time: '04:00', probability: 27, actual: 29 },
        { time: '08:00', probability: 25, actual: 24 },
        { time: '12:00', probability: 24, actual: 25 },
        { time: '16:00', probability: 23, actual: 23 },
        { time: '20:00', probability: 22, actual: null },
        { time: '24:00', probability: 21, actual: null },
      ],
      factors: [
        { name: 'Baseline Deviation', impact: 67, trend: 'low' },
        { name: 'Sensor Stability', impact: 89, trend: 'stable' },
        { name: 'Environmental Factors', impact: 34, trend: 'low' },
        { name: 'Historical Patterns', impact: 56, trend: 'stable' }
      ]
    }
  };

  const getRiskColor = (risk) => {
    if (risk < 30) return 'text-green-600 bg-green-50 border-green-200';
    if (risk < 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFactorColor = (trend) => {
    switch (trend) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      case 'stable': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentModel = predictionModels[selectedModel];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader
        title="AI Predictive Analytics"
        description="Machine learning models for mine safety prediction"
      >
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Model Update</p>
            <p className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{currentTime.toLocaleTimeString()}</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Brain className="mr-2 h-4 w-4" />
            Retrain Models
          </Button>
        </div>
      </PageHeader>

      {/* Model Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(predictionModels).map(([key, model]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${selectedModel === key
                ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]'
                : 'hover:shadow-md hover:scale-[1.01]'
              }`}
            onClick={() => setSelectedModel(key)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{model.name.split(' ')[0]} {model.name.split(' ')[1]}</CardTitle>
                <Badge className={getRiskColor(model.currentRisk)}>
                  {model.currentRisk}%
                </Badge>
              </div>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">{model.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                <div className="flex items-center space-x-2">
                  <Progress value={model.confidence} className="w-16 h-2" />
                  <span className="text-sm font-semibold">{model.confidence}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Trend</span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(model.trend)}
                  <span className="text-sm capitalize">{model.trend}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Updated {model.lastUpdate}</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Model Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Prediction Chart */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <LineChart className="mr-2 h-5 w-5" />
              {currentModel.name} - 24h Prediction
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Real-time vs predicted probability with {currentModel.accuracy}% accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentModel.predictions}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" />
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
                    dataKey="probability"
                    stroke="#3b82f6"
                    fill="url(#gradientPrediction)"
                    strokeWidth={3}
                    name="Predicted"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="Actual"
                  />
                  <defs>
                    <linearGradient id="gradientPrediction" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Model Stats & Factors */}
        <div className="space-y-6">
          {/* Current Status */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                <Target className="mr-2 h-5 w-5" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold ${currentModel.currentRisk < 30 ? 'bg-green-500 text-white' :
                    currentModel.currentRisk < 60 ? 'bg-amber-500 text-white' :
                      'bg-red-500 text-white'
                  }`}>
                  {currentModel.currentRisk}%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Current Risk Level</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{currentModel.confidence}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Model Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{currentModel.accuracy}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Factors */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                <BarChart3 className="mr-2 h-5 w-5" />
                Key Factors
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {currentModel.factors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{factor.name}</span>
                    <Badge className={getFactorColor(factor.trend)}>
                      {factor.impact}%
                    </Badge>
                  </div>
                  <Progress value={factor.impact} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Model Comparison */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <PieChart className="mr-2 h-5 w-5" />
            Model Performance Comparison
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Comparative analysis of all prediction models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(predictionModels).map(([key, model]) => (
              <div key={key} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{model.name.split(' ')[0]} Model</h4>
                  <Badge className={getRiskColor(model.currentRisk)}>
                    {model.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Accuracy:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{model.accuracy}%</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Confidence:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{model.confidence}%</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Current Risk:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{model.currentRisk}%</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 items-center">
                    <span>Trend:</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(model.trend)}
                      <span className="font-semibold capitalize text-gray-900 dark:text-gray-100">{model.trend}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Alert Thresholds & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-800 dark:text-green-300">Low Risk</h4>
                <Badge className="bg-green-500 text-white">0-30%</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Normal operations, routine monitoring</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-amber-800 dark:text-amber-300">Medium Risk</h4>
                <Badge className="bg-amber-500 text-white">31-70%</Badge>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300">Increased monitoring, prepare response teams</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-red-800 dark:text-red-300">High Risk</h4>
                <Badge className="bg-red-500 text-white">71-100%</Badge>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">Immediate action required, consider evacuation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPredictive;