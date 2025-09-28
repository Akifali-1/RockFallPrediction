import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../PageHeader';
import {
  Upload,
  FileText,
  Image,
  MapPin,
  Calendar,
  Clock,
  Zap,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader,
  Camera,
  Map,
  Database,
  Cloud
} from 'lucide-react';

const ManualDataEntry = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [demData, setDemData] = useState({
    elevation: '',
    coordinates: '',
    accuracy: '',
    surveyDate: ''
  });

  const handleDEMUpload = async () => {
    setIsProcessing(true);
    setAnalysisStatus('Uploading DEM data...');

    // Simulate upload process
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));

      if (i === 30) setAnalysisStatus('Processing elevation data...');
      if (i === 60) setAnalysisStatus('Generating terrain model...');
      if (i === 90) setAnalysisStatus('Finalizing analysis...');
    }

    setAnalysisStatus('DEM data processed successfully!');
    setTimeout(() => {
      setIsProcessing(false);
      setUploadProgress(0);
      setAnalysisStatus('');
    }, 2000);
  };

  const handleDroneImageAnalysis = async () => {
    setIsProcessing(true);
    setAnalysisStatus('Analyzing drone imagery...');

    const steps = [
      'Uploading images...',
      'Running AI crack detection...',
      'Measuring crack dimensions...',
      'Comparing with historical data...',
      'Generating risk assessment...',
      'Analysis complete!'
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStatus(steps[i]);
      setUploadProgress((i + 1) * (100 / steps.length));
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setTimeout(() => {
      setIsProcessing(false);
      setUploadProgress(0);
      setAnalysisStatus('');
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Manual Data Entry"
        description="Upload and process DEM data, drone imagery, and field observations"
      >
        <div className="flex items-center space-x-4">
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Database className="mr-2 h-4 w-4" />
            Data Repository
          </Button>
        </div>
      </PageHeader>

      {/* Processing Status */}
      {isProcessing && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Loader className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">{analysisStatus}</div>
                <Progress value={uploadProgress} className="h-2" />
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{uploadProgress}% complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="dem-data" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="dem-data">DEM Data</TabsTrigger>
          <TabsTrigger value="drone-imagery">Drone Imagery</TabsTrigger>
          <TabsTrigger value="field-observations">Field Data</TabsTrigger>
          <TabsTrigger value="weather-data">Weather Data</TabsTrigger>
        </TabsList>

        <TabsContent value="dem-data" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DEM Upload */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                  <Map className="mr-2 h-5 w-5" />
                  Digital Elevation Model (DEM)
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Upload static terrain elevation data for baseline analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-300">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Drag & drop DEM files here, or click to browse</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Supports: .tif, .asc, .xyz files (Max: 500MB)</p>
                  <Button className="mt-4" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Select Files
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="elevation" className="text-gray-700 dark:text-gray-300">Max Elevation (m)</Label>
                    <Input
                      id="elevation"
                      value={demData.elevation}
                      onChange={(e) => setDemData({ ...demData, elevation: e.target.value })}
                      placeholder="1,250"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accuracy" className="text-gray-700 dark:text-gray-300">Accuracy (±m)</Label>
                    <Input
                      id="accuracy"
                      value={demData.accuracy}
                      onChange={(e) => setDemData({ ...demData, accuracy: e.target.value })}
                      placeholder="0.5"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="coordinates" className="text-gray-700 dark:text-gray-300">Survey Coordinates</Label>
                  <Input
                    id="coordinates"
                    value={demData.coordinates}
                    onChange={(e) => setDemData({ ...demData, coordinates: e.target.value })}
                    placeholder="34.0522°N, 118.2437°W"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="survey-date" className="text-gray-700 dark:text-gray-300">Survey Date</Label>
                  <Input
                    id="survey-date"
                    type="date"
                    value={demData.surveyDate}
                    onChange={(e) => setDemData({ ...demData, surveyDate: e.target.value })}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <Button
                  onClick={handleDEMUpload}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isProcessing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  Process DEM Data
                </Button>
              </CardContent>
            </Card>

            {/* DEM Analysis Results */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800 dark:text-green-300">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">3.2km²</div>
                    <div className="text-sm text-green-600 dark:text-green-300">Coverage Area</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">847m</div>
                    <div className="text-sm text-green-600 dark:text-green-300">Max Elevation</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Terrain Stability:</span>
                    <span className="font-semibold text-green-700 dark:text-green-400">Stable</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Slope Analysis:</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Moderate Risk</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Data Quality:</span>
                    <span className="font-semibold text-green-700 dark:text-green-400">High (±0.3m)</span>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">Key Findings:</h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Stable geological foundation detected</li>
                    <li>• 3 areas of steep slope identified</li>
                    <li>• Water flow patterns mapped</li>
                    <li>• No major elevation changes since last survey</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drone-imagery" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Drone Image Upload */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                  <Camera className="mr-2 h-5 w-5" />
                  Drone Image Analysis
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  AI-powered crack detection and measurement from drone imagery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-300">
                  <Image className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload drone images for AI analysis</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Supports: .jpg, .png, .tiff (Max: 100MB per image)</p>
                  <Button className="mt-4" variant="outline">
                    <Camera className="mr-2 h-4 w-4" />
                    Select Images
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sector-select" className="text-gray-700 dark:text-gray-300">Target Sector</Label>
                    <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      <option>Select Sector</option>
                      <option>A-1</option>
                      <option>A-2</option>
                      <option>A-5</option>
                      <option>B-12</option>
                      <option>B-15</option>
                      <option>C-1</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="flight-altitude" className="text-gray-700 dark:text-gray-300">Flight Altitude (m)</Label>
                    <Input id="flight-altitude" placeholder="50" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="flight-date" className="text-gray-700 dark:text-gray-300">Flight Date & Time</Label>
                  <Input id="flight-date" type="datetime-local" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                </div>

                <div>
                  <Label htmlFor="image-notes" className="text-gray-700 dark:text-gray-300">Additional Notes</Label>
                  <Textarea
                    id="image-notes"
                    placeholder="Weather conditions, specific areas of concern, etc."
                    rows={3}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <Button
                  onClick={handleDroneImageAnalysis}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isProcessing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="mr-2 h-4 w-4" />
                  )}
                  Start AI Analysis
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800 dark:text-purple-300">
                  <Brain className="mr-2 h-5 w-5" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-purple-700 dark:text-purple-400">7</div>
                    <div className="text-xs text-purple-600 dark:text-purple-300">Cracks Detected</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-purple-700 dark:text-purple-400">3.2m</div>
                    <div className="text-xs text-purple-600 dark:text-purple-300">Max Length</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-purple-700 dark:text-purple-400">4mm</div>
                    <div className="text-xs text-purple-600 dark:text-purple-300">Max Width</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Crack Analysis:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Structural cracks:</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">3 (Critical)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Surface cracks:</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">4 (Monitor)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Confidence level:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">94.2%</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2 flex items-center text-gray-900 dark:text-gray-100">
                    <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                    Recommendations:
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Immediate inspection of 3 structural cracks</li>
                    <li>• Install additional monitoring sensors in Sector B-12</li>
                    <li>• Schedule follow-up drone survey in 2 weeks</li>
                    <li>• Consider preventive stabilization measures</li>
                  </ul>
                </div>

                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Detailed Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="field-observations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                  <MapPin className="mr-2 h-5 w-5" />
                  Field Observations
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Manual field data entry and observations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="observer" className="text-gray-700 dark:text-gray-300">Observer Name</Label>
                    <Input id="observer" placeholder="Field Inspector" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <Label htmlFor="observation-date" className="text-gray-700 dark:text-gray-300">Date & Time</Label>
                    <Input id="observation-date" type="datetime-local" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">Location/Sector</Label>
                  <Input id="location" placeholder="Sector B-12, North Wall" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                </div>

                <div>
                  <Label htmlFor="observation-type" className="text-gray-700 dark:text-gray-300">Observation Type</Label>
                  <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option>Select Type</option>
                    <option>Crack Formation</option>
                    <option>Ground Movement</option>
                    <option>Water Seepage</option>
                    <option>Equipment Malfunction</option>
                    <option>Safety Hazard</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="severity" className="text-gray-700 dark:text-gray-300">Severity Level</Label>
                  <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option>Select Severity</option>
                    <option>Low - Monitor</option>
                    <option>Medium - Action Required</option>
                    <option>High - Immediate Response</option>
                    <option>Critical - Emergency</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the observation in detail..."
                    rows={4}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="photo-upload" className="text-gray-700 dark:text-gray-300">Photo Evidence</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    <Camera className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upload photos</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Select Photos
                    </Button>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Observation
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Recent Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 1, type: 'Crack Formation', severity: 'High', sector: 'B-12', time: '2h ago' },
                    { id: 2, type: 'Water Seepage', severity: 'Medium', sector: 'A-5', time: '4h ago' },
                    { id: 3, type: 'Equipment Check', severity: 'Low', sector: 'C-1', time: '6h ago' }
                  ].map((obs) => (
                    <div key={obs.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{obs.type}</span>
                        <span className={`text-xs px-2 py-1 rounded ${obs.severity === 'High' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                          obs.severity === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400' :
                            'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          }`}>
                          {obs.severity}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Sector {obs.sector}</span>
                        <span>{obs.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weather-data" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                <Cloud className="mr-2 h-5 w-5" />
                Weather Data Entry
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Manual weather data entry when automated systems are unavailable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="temperature" className="text-gray-700 dark:text-gray-300">Temperature (°C)</Label>
                      <Input id="temperature" type="number" placeholder="22" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <Label htmlFor="humidity" className="text-gray-700 dark:text-gray-300">Humidity (%)</Label>
                      <Input id="humidity" type="number" placeholder="65" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rainfall" className="text-gray-700 dark:text-gray-300">Rainfall (mm)</Label>
                      <Input id="rainfall" type="number" placeholder="5.2" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <Label htmlFor="wind-speed" className="text-gray-700 dark:text-gray-300">Wind Speed (km/h)</Label>
                      <Input id="wind-speed" type="number" placeholder="12" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="wind-direction" className="text-gray-700 dark:text-gray-300">Wind Direction</Label>
                    <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      <option>Select Direction</option>
                      <option>N</option>
                      <option>NE</option>
                      <option>E</option>
                      <option>SE</option>
                      <option>S</option>
                      <option>SW</option>
                      <option>W</option>
                      <option>NW</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="visibility" className="text-gray-700 dark:text-gray-300">Visibility (km)</Label>
                    <Input id="visibility" type="number" placeholder="10" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Weather Data
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Current Conditions</h3>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border dark:border-blue-800">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-gray-900 dark:text-gray-100">Temperature: 18°C</div>
                      <div className="text-gray-900 dark:text-gray-100">Humidity: 72%</div>
                      <div className="text-gray-900 dark:text-gray-100">Rainfall: 15.2mm</div>
                      <div className="text-gray-900 dark:text-gray-100">Wind: 12 km/h NW</div>
                      <div className="text-gray-900 dark:text-gray-100">Visibility: 8km</div>
                      <div className="text-gray-900 dark:text-gray-100">Pressure: 1013 hPa</div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Impact Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Stability Impact:</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">Moderate</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Erosion Risk:</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">High</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Monitoring Priority:</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">Increased</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManualDataEntry;