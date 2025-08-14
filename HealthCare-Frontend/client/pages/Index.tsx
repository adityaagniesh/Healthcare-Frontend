import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart, Activity, Thermometer, Droplets, Zap, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, Users, Search, Filter, Eye, Edit,
  Phone, Mail, Calendar, MapPin, User
} from "lucide-react";

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  icon: any;
  normalRange: string;
  lastUpdated: string;
}

interface VitalSign {
  timestamp: string;
  heartRate: number;
  bloodPressureS: number;
  bloodPressureD: number;
  temperature: number;
  oxygenSat: number;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  allergies: string[];
  lastVisit: string;
  nextAppointment?: string;
  riskLevel: "Low" | "Medium" | "High";
  currentVitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
  };
  status: "Active" | "Inactive" | "Critical";
  avatar?: string;
}

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>("All");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate fake health data
  useEffect(() => {
    const generateVitals = () => {
      const newVitals: VitalSign[] = [];
      const now = new Date();

      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
        newVitals.push({
          timestamp: timestamp.toISOString(),
          heartRate: 65 + Math.random() * 30,
          bloodPressureS: 110 + Math.random() * 30,
          bloodPressureD: 70 + Math.random() * 20,
          temperature: 36.1 + Math.random() * 1.5,
          oxygenSat: 95 + Math.random() * 5,
        });
      }
      setVitals(newVitals.reverse());
    };

    generateVitals();
    const interval = setInterval(generateVitals, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Generate fake patient data
  useEffect(() => {
    const generatePatients = () => {
      const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa", "James", "Maria", "William", "Jessica", "Richard", "Ashley", "Thomas", "Amanda"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas"];
      const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      const allergies = ["None", "Penicillin", "Shellfish", "Nuts", "Dairy", "Pollen"];
      const riskLevels: ("Low" | "Medium" | "High")[] = ["Low", "Medium", "High"];
      const statuses: ("Active" | "Inactive" | "Critical")[] = ["Active", "Inactive", "Critical"];

      const newPatients: Patient[] = [];

      for (let i = 0; i < 25; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const age = 18 + Math.floor(Math.random() * 70);
        const heartRate = 60 + Math.floor(Math.random() * 40);
        const systolic = 110 + Math.floor(Math.random() * 40);
        const diastolic = 70 + Math.floor(Math.random() * 20);
        const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];

        newPatients.push({
          id: `PAT-${String(i + 1).padStart(3, '0')}`,
          name: `${firstName} ${lastName}`,
          age,
          gender: Math.random() > 0.5 ? "Male" : "Female",
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
          phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          address: `${Math.floor(Math.random() * 9999) + 1} ${lastName} St, City, State ${String(Math.floor(Math.random() * 90000) + 10000)}`,
          bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
          allergies: [allergies[Math.floor(Math.random() * allergies.length)]],
          lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          nextAppointment: Math.random() > 0.3 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
          riskLevel,
          currentVitals: {
            heartRate,
            bloodPressure: `${systolic}/${diastolic}`,
            temperature: 36.1 + Math.random() * 1.5,
            oxygenSat: 95 + Math.random() * 5,
          },
          status: riskLevel === "High" ? "Critical" : statuses[Math.floor(Math.random() * statuses.length)],
        });
      }

      setPatients(newPatients);
    };

    generatePatients();
  }, []);

  const currentVitals = vitals[vitals.length - 1];

  // Filter patients based on search and risk level
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter === "All" || patient.riskLevel === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  const healthMetrics: HealthMetric[] = [
    {
      id: "heart-rate",
      name: "Heart Rate",
      value: currentVitals?.heartRate || 72,
      unit: "BPM",
      status: currentVitals?.heartRate > 100 ? "warning" : currentVitals?.heartRate < 60 ? "warning" : "normal",
      trend: "stable",
      icon: Heart,
      normalRange: "60-100 BPM",
      lastUpdated: "Just now"
    },
    {
      id: "blood-pressure",
      name: "Blood Pressure",
      value: currentVitals?.bloodPressureS || 120,
      unit: `/${currentVitals?.bloodPressureD?.toFixed(0) || 80} mmHg`,
      status: currentVitals?.bloodPressureS > 140 ? "warning" : "normal",
      trend: "down",
      icon: Activity,
      normalRange: "120/80 mmHg",
      lastUpdated: "2 min ago"
    },
    {
      id: "temperature",
      name: "Body Temperature",
      value: currentVitals?.temperature || 36.8,
      unit: "°C",
      status: currentVitals?.temperature > 37.5 ? "warning" : "normal",
      trend: "stable",
      icon: Thermometer,
      normalRange: "36.1-37.2°C",
      lastUpdated: "5 min ago"
    },
    {
      id: "oxygen",
      name: "Blood Oxygen",
      value: currentVitals?.oxygenSat || 98,
      unit: "%",
      status: currentVitals?.oxygenSat < 95 ? "critical" : "normal",
      trend: "up",
      icon: Droplets,
      normalRange: "95-100%",
      lastUpdated: "1 min ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-600 bg-green-50 border-green-200";
      case "warning": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "critical": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-2">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HealthMonitor Pro</h1>
                <p className="text-sm text-gray-600">Real-time Health Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentTime.toLocaleTimeString()}</p>
                <p className="text-xs text-gray-600">{currentTime.toLocaleDateString()}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthMetrics.map((metric) => (
              <Card key={metric.id} className={`border-2 ${getStatusColor(metric.status)} transition-all duration-300 hover:shadow-lg`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <metric.icon className="w-8 h-8 text-blue-600" />
                    {getStatusIcon(metric.status)}
                  </div>
                  <CardTitle className="text-lg">{metric.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                      </span>
                      <span className="text-lg text-gray-600">{metric.unit}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">Normal: {metric.normalRange}</p>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{metric.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vital Signs Chart */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>24-Hour Vital Signs</span>
              </CardTitle>
              <CardDescription>Real-time monitoring of key health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-blue-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-gray-600">Interactive Chart Visualization</p>
                  <p className="text-sm text-gray-500">Heart rate, BP, temp trends</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">Avg HR</p>
                  <p className="text-lg font-bold text-blue-600">74 BPM</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">Peak BP</p>
                  <p className="text-lg font-bold text-green-600">135/85</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">Min Temp</p>
                  <p className="text-lg font-bold text-yellow-600">36.2°C</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">O2 Sat</p>
                  <p className="text-lg font-bold text-red-600">98.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Alerts */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>Health Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">All vitals normal</p>
                    <p className="text-xs text-green-700">Last check: 2 min ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Exercise detected</p>
                    <p className="text-xs text-blue-700">HR elevated: 95 BPM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  Record Manual Reading
                </Button>
                <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                  Export Health Report
                </Button>
                <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                  Schedule Checkup
                </Button>
              </CardContent>
            </Card>

            {/* Health Score */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Health Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">92</div>
                  <div className="text-sm opacity-90 mb-3">Excellent</div>
                  <Progress value={92} className="w-full bg-white/20" />
                  <p className="text-xs mt-2 opacity-80">Based on your recent vitals</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Readings */}
        <Card className="mt-8 border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Readings</CardTitle>
            <CardDescription>Your latest health measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vitals.slice(-4).reverse().map((vital, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(vital.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">HR:</span>
                      <span className="text-sm font-medium">{vital.heartRate.toFixed(0)} BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">BP:</span>
                      <span className="text-sm font-medium">{vital.bloodPressureS.toFixed(0)}/{vital.bloodPressureD.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Temp:</span>
                      <span className="text-sm font-medium">{vital.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">O2:</span>
                      <span className="text-sm font-medium">{vital.oxygenSat.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Management System */}
        <Card className="mt-8 border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Patient Management</span>
                </CardTitle>
                <CardDescription>Monitor and manage patient records</CardDescription>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {patients.length} Total Patients
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {patients.filter(p => p.status === "Active").length} Active
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {patients.filter(p => p.status === "Critical").length} Critical
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Controls */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search patients by name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedRiskFilter}
                  onChange={(e) => setSelectedRiskFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
              </div>
            </div>

            {/* Patient Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.slice(0, 12).map((patient) => (
                <div key={patient.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  {/* Patient Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          patient.status === "Active" ? "bg-green-50 text-green-700 border-green-200" :
                          patient.status === "Critical" ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {patient.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          patient.riskLevel === "Low" ? "bg-green-50 text-green-700 border-green-200" :
                          patient.riskLevel === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {patient.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{patient.age} years, {patient.gender}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{patient.phone}</span>
                    </div>
                  </div>

                  {/* Current Vitals */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Current Vitals</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">HR:</span>
                        <span className="font-medium">{patient.currentVitals.heartRate} BPM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">BP:</span>
                        <span className="font-medium">{patient.currentVitals.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temp:</span>
                        <span className="font-medium">{patient.currentVitals.temperature.toFixed(1)}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">O2:</span>
                        <span className="font-medium">{patient.currentVitals.oxygenSat.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Appointments */}
                  <div className="space-y-1 mb-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                    </div>
                    {patient.nextAppointment && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>Next: {new Date(patient.nextAppointment).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {filteredPatients.length > 12 && (
              <div className="mt-6 text-center">
                <Button variant="outline" className="bg-white">
                  <Users className="w-4 h-4 mr-2" />
                  View All {filteredPatients.length} Patients
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredPatients.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
