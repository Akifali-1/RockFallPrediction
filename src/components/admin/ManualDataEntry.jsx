import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manual Data Entry</h1>
            <p className="text-gray-600 mt-1">Upload and process DEM data, drone imagery, and field observations</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Database className="mr-2 h-4 w-4" />
              Data Repository
            </Button>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <Card className="border-blue-200 bg-blue-50 animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Loader className="h-6 w-6 text-blue-600 animate-spin" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-800 mb-2">{analysisStatus}</div>
                <Progress value={uploadProgress} className="h-2" />
                <div className="text-xs text-blue-600 mt-1">{uploadProgress}% complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="dem-data" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dem-data">DEM Data</TabsTrigger>
          <TabsTrigger value="drone-imagery">Drone Imagery</TabsTrigger>
          <TabsTrigger value="field-observations">Field Data</TabsTrigger>
          <TabsTrigger value="weather-data">Weather Data</TabsTrigger>
        </TabsList>

        <TabsContent value="dem-data" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DEM Upload */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Map className="mr-2 h-5 w-5" />
                  Digital Elevation Model (DEM)
                </CardTitle>
                <CardDescription>
                  Upload static terrain elevation data for baseline analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-300">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Drag & drop DEM files here, or click to browse</p>
                  <p className="text-xs text-gray-500">Supports: .tif, .asc, .xyz files (Max: 500MB)</p>
                  <Button className="mt-4" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Select Files
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="elevation">Max Elevation (m)</Label>
                    <Input
                      id="elevation"
                      value={demData.elevation}
                      onChange={(e) => setDemData({...demData, elevation: e.target.value})}
                      placeholder="1,250"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accuracy">Accuracy (±m)</Label>
                    <Input
                      id="accuracy"
                      value={demData.accuracy}
                      onChange={(e) => setDemData({...demData, accuracy: e.target.value})}
                      placeholder="0.5"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="coordinates">Survey Coordinates</Label>
                  <Input
                    id="coordinates"
                    value={demData.coordinates}
                    onChange={(e) => setDemData({...demData, coordinates: e.target.value})}
                    placeholder="34.0522°N, 118.2437°W"
                  />
                </div>
                
                <div>
                  <Label htmlFor="survey-date">Survey Date</Label>
                  <Input
                    id="survey-date"
                    type="date"
                    value={demData.surveyDate}
                    onChange={(e) => setDemData({...demData, surveyDate: e.target.value})}
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
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-700">3.2km²</div>
                    <div className="text-sm text-green-600">Coverage Area</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-700">847m</div>
                    <div className="text-sm text-green-600">Max Elevation</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Terrain Stability:</span>
                    <span className="font-semibold text-green-700">Stable</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Slope Analysis:</span>
                    <span className="font-semibold text-amber-700">Moderate Risk</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Data Quality:</span>
                    <span className="font-semibold text-green-700">High (±0.3m)</span>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Key Findings:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
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
            <Card className="transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Drone Image Analysis
                </CardTitle>
                <CardDescription>
                  AI-powered crack detection and measurement from drone imagery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors duration-300">
                  <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Upload drone images for AI analysis</p>
                  <p className="text-xs text-gray-500">Supports: .jpg, .png, .tiff (Max: 100MB per image)</p>
                  <Button className="mt-4" variant="outline">
                    <Camera className="mr-2 h-4 w-4" />
                    Select Images
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sector-select">Target Sector</Label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
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
                    <Label htmlFor="flight-altitude">Flight Altitude (m)</Label>
                    <Input id="flight-altitude" placeholder="50" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="flight-date">Flight Date & Time</Label>
                  <Input id="flight-date" type="datetime-local" />
                </div>
                
                <div>
                  <Label htmlFor="image-notes">Additional Notes</Label>
                  <Textarea 
                    id="image-notes" 
                    placeholder="Weather conditions, specific areas of concern, etc." 
                    rows={3}
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
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <Brain className="mr-2 h-5 w-5" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-xl font-bold text-purple-700">7</div>
                    <div className="text-xs text-purple-600">Cracks Detected</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-xl font-bold text-purple-700">3.2m</div>
                    <div className="text-xs text-purple-600">Max Length</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-xl font-bold text-purple-700">4mm</div>
                    <div className="text-xs text-purple-600">Max Width</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Crack Analysis:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Structural cracks:</span>
                      <span className="font-semibold text-red-600">3 (Critical)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Surface cracks:</span>
                      <span className="font-semibold text-amber-600">4 (Monitor)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence level:</span>
                      <span className="font-semibold text-green-600">94.2%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg">
                  <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                    Recommendations:
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Field Observations
                </CardTitle>
                <CardDescription>
                  Manual field data entry and observations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="observer">Observer Name</Label>
                    <Input id="observer" placeholder="Field Inspector" />
                  </div>
                  <div>
                    <Label htmlFor="observation-date">Date & Time</Label>
                    <Input id="observation-date" type="datetime-local" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Location/Sector</Label>
                  <Input id="location" placeholder="Sector B-12, North Wall" />
                </div>
                
                <div>
                  <Label htmlFor="observation-type">Observation Type</Label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
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
                  <Label htmlFor="severity">Severity Level</Label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>Select Severity</option>
                    <option>Low - Monitor</option>
                    <option>Medium - Action Required</option>
                    <option>High - Immediate Response</option>
                    <option>Critical - Emergency</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the observation in detail..." 
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="photo-upload">Photo Evidence</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload photos</p>
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 1, type: 'Crack Formation', severity: 'High', sector: 'B-12', time: '2h ago' },
                    { id: 2, type: 'Water Seepage', severity: 'Medium', sector: 'A-5', time: '4h ago' },
                    { id: 3, type: 'Equipment Check', severity: 'Low', sector: 'C-1', time: '6h ago' }
                  ].map((obs) => (
                    <div key={obs.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{obs.type}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          obs.severity === 'High' ? 'bg-red-100 text-red-800' :
                          obs.severity === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {obs.severity}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="mr-2 h-5 w-5" />
                Weather Data Entry
              </CardTitle>
              <CardDescription>
                Manual weather data entry when automated systems are unavailable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <Input id="temperature" type="number" placeholder="22" />
                    </div>
                    <div>
                      <Label htmlFor="humidity">Humidity (%)</Label>
                      <Input id="humidity" type="number" placeholder="65" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rainfall">Rainfall (mm)</Label>
                      <Input id="rainfall" type="number" placeholder="5.2" />
                    </div>
                    <div>
                      <Label htmlFor="wind-speed">Wind Speed (km/h)</Label>
                      <Input id="wind-speed" type="number" placeholder="12" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="wind-direction">Wind Direction</Label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
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
                    <Label htmlFor="visibility">Visibility (km)</Label>
                    <Input id="visibility" type="number" placeholder="10" />
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Weather Data
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Current Conditions</h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>Temperature: 18°C</div>
                      <div>Humidity: 72%</div>
                      <div>Rainfall: 15.2mm</div>
                      <div>Wind: 12 km/h NW</div>
                      <div>Visibility: 8km</div>
                      <div>Pressure: 1013 hPa</div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold">Impact Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stability Impact:</span>
                      <span className="font-semibold text-amber-600">Moderate</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Erosion Risk:</span>
                      <span className="font-semibold text-red-600">High</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monitoring Priority:</span>
                      <span className="font-semibold text-amber-600">Increased</span>
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