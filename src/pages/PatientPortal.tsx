import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  FileText, 
  Brain, 
  MapPin, 
  Calendar,
  Upload,
  ArrowLeft,
  Heart,
  CheckCircle,
  AlertTriangle,
  Activity,
  Target
} from "lucide-react";
import HealthSurvey from "@/components/HealthSurvey";
import ReportUpload from "@/components/ReportUpload";
import AIAnalysis from "@/components/AIAnalysis";
import HealthGoals from "@/components/HealthGoals";
import NearbyHealthCamps from "@/components/NearbyHealthCamps";
import { storage, PatientData } from "@/lib/storage";

export default function PatientPortal() {
  const [currentStep, setCurrentStep] = useState("login");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null);
  const [surveyData, setSurveyData] = useState(null);
  const [reports, setReports] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [healthGoals, setHealthGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState<number[]>([]);
  const [bookings, setBookings] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load current patient session if exists
    const patient = storage.getCurrentPatient();
    if (patient) {
      setCurrentPatient(patient);
      setCurrentStep("dashboard");
      loadPatientData(patient.id);
    }
  }, []);

  const loadPatientData = (patientId: string) => {
    const patient = storage.getPatient(patientId);
    if (patient) {
      setSurveyData(patient.surveyData);
      setReports(patient.reports || []);
      setAnalysis(patient.analysis);
      setHealthGoals(patient.healthGoals || []);
      setBookings(storage.getBookingsByPatient(patientId));
    }
    setCompletedGoals(storage.getCompletedGoals());
  };

  const handleLogin = () => {
    if (!aadhaarNumber || !mobileNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter both Aadhaar number and mobile number.",
        variant: "destructive",
      });
      return;
    }

    // Check if patient exists
    let patient = storage.getPatientByAadhaar(aadhaarNumber);
    
    if (!patient) {
      // Create new patient
      patient = {
        id: Date.now().toString(),
        aadhaarNumber,
        mobileNumber,
        personalInfo: {
          name: "",
          age: "",
          gender: "",
          occupation: "",
          state: "",
          city: ""
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storage.savePatient(patient);
    }

    // Verify mobile number matches
    if (patient.mobileNumber !== mobileNumber) {
      toast({
        title: "Verification Failed",
        description: "Mobile number does not match the registered Aadhaar number.",
        variant: "destructive",
      });
      return;
    }

    setCurrentPatient(patient);
    storage.setCurrentPatient(patient);
    setCurrentStep("dashboard");
    loadPatientData(patient.id);
    
    toast({
      title: "Login Successful",
      description: `Welcome back, ${patient.personalInfo.name || 'Patient'}!`,
    });
  };

  if (currentStep === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold">HealthConnect</h1>
            </div>
            <CardTitle>Patient Login</CardTitle>
            <CardDescription>
              Enter your Aadhaar card number and mobile number to access your health portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aadhaar">Aadhaar Card Number</Label>
              <Input
                id="aadhaar"
                placeholder="1234 5678 9012"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                maxLength={12}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                placeholder="+91 9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Verify & Login
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = "/"}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSurveyComplete = (data: any) => {
    setSurveyData(data);
    if (currentPatient) {
      storage.updatePatient(currentPatient.id, { surveyData: data });
    }
    setCurrentStep("upload");
  };

  const handleReportComplete = (data: any[]) => {
    setReports(data);
    if (currentPatient) {
      storage.updatePatient(currentPatient.id, { reports: data });
    }
    setCurrentStep("analysis");
  };

  const handleAnalysisComplete = (data: any) => {
    setAnalysis(data);
    if (currentPatient) {
      storage.updatePatient(currentPatient.id, { analysis: data });
      // Save analysis to storage
      storage.saveAnalysis({
        id: Date.now().toString(),
        patientId: currentPatient.id,
        surveyData,
        reports,
        riskLevel: data.riskLevel,
        riskScore: data.riskScore,
        riskFactors: data.riskFactors,
        reportFindings: data.reportFindings,
        recommendations: data.recommendations,
        healthGoals: data.healthGoals,
        summary: data.summary,
        nextSteps: data.nextSteps,
        createdAt: new Date().toISOString()
      });
    }
    setCurrentStep("goals");
  };

  const handleGoalsComplete = () => {
    setCurrentStep("dashboard");
    loadPatientData(currentPatient!.id);
  };

  const handleLogout = () => {
    storage.clearCurrentSession();
    setCurrentPatient(null);
    setCurrentStep("login");
    setAadhaarNumber("");
    setMobileNumber("");
    setSurveyData(null);
    setReports([]);
    setAnalysis(null);
    setHealthGoals([]);
    setCompletedGoals([]);
    setBookings([]);
  };

  if (currentStep === "survey") {
    return <HealthSurvey onComplete={handleSurveyComplete} onBack={() => setCurrentStep("dashboard")} />;
  }

  if (currentStep === "upload") {
    return <ReportUpload onComplete={handleReportComplete} onBack={() => setCurrentStep("dashboard")} />;
  }

  if (currentStep === "analysis") {
    return <AIAnalysis surveyData={surveyData} reports={reports} onComplete={handleAnalysisComplete} onBack={() => setCurrentStep("dashboard")} />;
  }

  if (currentStep === "goals") {
    return <HealthGoals analysis={analysis} onComplete={handleGoalsComplete} onBack={() => setCurrentStep("dashboard")} />;
  }

  if (currentStep === "camps") {
    return <NearbyHealthCamps onBack={() => setCurrentStep("dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm animate-in fade-in-50 slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-primary mr-2 animate-pulse" />
            <h1 className="text-xl font-semibold">Patient Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {currentPatient?.personalInfo.name || 'Patient'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="hover:scale-105 transition-transform duration-200">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        {currentPatient && (
          <Card className="mb-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Health Assessment Progress
              </CardTitle>
              <CardDescription>
                Track your health journey completion status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center hover:scale-105 transition-transform duration-200">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    surveyData ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {surveyData ? <CheckCircle className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <p className="text-sm font-medium">Health Survey</p>
                  <p className="text-xs text-muted-foreground">
                    {surveyData ? 'Completed' : 'Pending'}
                  </p>
                </div>
                <div className="text-center hover:scale-105 transition-transform duration-200">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    reports.length > 0 ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {reports.length > 0 ? <CheckCircle className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                  </div>
                  <p className="text-sm font-medium">Reports Upload</p>
                  <p className="text-xs text-muted-foreground">
                    {reports.length > 0 ? `${reports.length} uploaded` : 'Pending'}
                  </p>
                </div>
                <div className="text-center hover:scale-105 transition-transform duration-200">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    analysis ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {analysis ? <CheckCircle className="h-6 w-6" /> : <Brain className="h-6 w-6" />}
                  </div>
                  <p className="text-sm font-medium">AI Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    {analysis ? 'Completed' : 'Pending'}
                  </p>
                </div>
                <div className="text-center hover:scale-105 transition-transform duration-200">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    healthGoals.length > 0 ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {healthGoals.length > 0 ? <CheckCircle className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                  </div>
                  <p className="text-sm font-medium">Health Goals</p>
                  <p className="text-xs text-muted-foreground">
                    {healthGoals.length > 0 ? 'Set' : 'Pending'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Health Survey */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Health Survey
              </CardTitle>
              <CardDescription>
                Complete your infectious disease assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {surveyData ? (
                <div className="space-y-2">
                  <div className="flex items-center text-success text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Survey Completed
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setCurrentStep("survey")}>
                    Retake Survey
                  </Button>
                </div>
              ) : (
                <Button className="w-full" onClick={() => setCurrentStep("survey")}>
                  Start Survey
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Upload Reports */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2 text-secondary" />
                Upload Reports
              </CardTitle>
              <CardDescription>
                Upload blood reports and medical documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center text-success text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {reports.length} report(s) uploaded
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setCurrentStep("upload")}>
                    Upload More
                  </Button>
                </div>
              ) : (
                <Button variant="secondary" className="w-full" onClick={() => setCurrentStep("upload")}>
                  Upload Files
                </Button>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-success" />
                AI Analysis
              </CardTitle>
              <CardDescription>
                View your AI-generated health analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Level:</span>
                    <Badge className={`${
                      analysis.riskLevel === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      analysis.riskLevel === 'medium' ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-success/10 text-success border-success/20'
                    }`}>
                      {analysis.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setCurrentStep("analysis")}>
                    View Analysis
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Complete Survey & Reports First
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Health Camps */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-warning" />
                Nearby Health Camps
              </CardTitle>
              <CardDescription>
                Find and book health camps in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => setCurrentStep("camps")}>
                Find Camps
              </Button>
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                My Appointments
              </CardTitle>
              <CardDescription>
                View and manage your bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">{bookings.length}</span> bookings
                </div>
                <Button variant="outline" className="w-full">
                  View Appointments
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Health Goals */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-destructive" />
                Health Goals
              </CardTitle>
              <CardDescription>
                Track your preventive health goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {healthGoals.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress:</span>
                    <span className="font-medium">
                      {completedGoals.length}/{healthGoals.length}
                    </span>
                  </div>
                  <Progress 
                    value={(completedGoals.length / healthGoals.length) * 100} 
                    className="w-full" 
                  />
                  <Button variant="outline" className="w-full" onClick={() => setCurrentStep("goals")}>
                    View Goals
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Complete Analysis First
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className={`text-2xl font-bold ${
              analysis ? 
                analysis.riskLevel === 'high' ? 'text-destructive' :
                analysis.riskLevel === 'medium' ? 'text-warning' : 'text-success'
                : 'text-muted-foreground'
            }`}>
              {analysis ? `${100 - analysis.riskScore}%` : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-secondary">{bookings.length}</div>
            <div className="text-sm text-muted-foreground">Camps Booked</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-success">{reports.length}</div>
            <div className="text-sm text-muted-foreground">Reports Uploaded</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-warning">
              {healthGoals.length > 0 ? completedGoals.length : 0}
            </div>
            <div className="text-sm text-muted-foreground">Goals Completed</div>
          </Card>
        </div>
      </div>
    </div>
  );
}