import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import DoctorRegistration from "@/components/DoctorRegistration";
import DetailedPatientReport from "@/components/DetailedPatientReport";
import PrescriptionForm from "@/components/PrescriptionForm";
import { storage, DoctorData, PatientData } from "@/lib/storage";
import { 
  Stethoscope, 
  Users, 
  FileText, 
  MessageSquare,
  Search,
  Calendar,
  Activity,
  ClipboardList,
  ArrowLeft,
  Heart,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function DoctorPortal() {
  const [currentView, setCurrentView] = useState("login");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDoctor, setCurrentDoctor] = useState<DoctorData | null>(null);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([]);
  const [loginData, setLoginData] = useState({ registerId: "", password: "" });
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load current doctor session
    const doctor = storage.getCurrentDoctor();
    if (doctor && doctor.status === 'verified') {
      setCurrentDoctor(doctor);
      setCurrentView("main");
      loadPatients();
    } else if (doctor && doctor.status === 'pending-verification') {
      setCurrentView("pending");
    } else {
      setCurrentView("login");
    }
  }, []);

  useEffect(() => {
    // Filter patients based on search term
    if (searchTerm) {
      const filtered = patients.filter(patient =>
        patient.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.aadhaarNumber.includes(searchTerm)
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  const loadPatients = () => {
    const allPatients = storage.getPatients();
    // Filter patients who have completed surveys
    const patientsWithData = allPatients.filter(patient => 
      patient.surveyData && patient.analysis
    );
    setPatients(patientsWithData);
    setFilteredPatients(patientsWithData);
  };

  const handleRegistrationComplete = (doctorData: DoctorData) => {
    setCurrentDoctor(doctorData);
    storage.setCurrentDoctor(doctorData);
    setCurrentView("main");
    loadPatients();
    
    toast({
      title: "Registration Successful",
      description: "Your doctor profile has been created successfully.",
    });
  };

  const handleLogin = () => {
    if (!loginData.registerId) {
      toast({
        title: "Missing Information",
        description: "Please enter your Register ID.",
        variant: "destructive",
      });
      return;
    }

    const doctor = storage.getDoctorByRegisterId(loginData.registerId);
    if (!doctor) {
      toast({
        title: "Doctor Not Found",
        description: "No doctor found with this Register ID.",
        variant: "destructive",
      });
      return;
    }

    if (doctor.status === 'pending-verification') {
      setCurrentDoctor(doctor);
      setCurrentView("pending");
      return;
    }

    if (doctor.status === 'rejected') {
      toast({
        title: "Registration Rejected",
        description: "Your registration has been rejected. Please contact admin.",
        variant: "destructive",
      });
      return;
    }

    if (doctor.status === 'verified') {
      setCurrentDoctor(doctor);
      storage.setCurrentDoctor(doctor);
      setCurrentView("main");
      loadPatients();
      
      toast({
        title: "Login Successful",
        description: `Welcome back, Dr. ${doctor.fullName}!`,
      });
    }
  };

  const handleLogout = () => {
    storage.clearCurrentSession();
    setCurrentDoctor(null);
    setCurrentView("login");
    setLoginData({ registerId: "", password: "" });
    setPatients([]);
    setFilteredPatients([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending-review": return "bg-warning/10 text-warning border-warning/20";
      case "completed": return "bg-success/10 text-success border-success/20";
      case "prescription-sent": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (currentView === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Stethoscope className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold">Doctor Portal</h1>
            </div>
            <CardTitle>Doctor Login</CardTitle>
            <CardDescription>
              Enter your medical register ID and password to access your portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registerId">Medical Register ID</Label>
              <Input
                id="registerId"
                placeholder="MH-12345"
                value={loginData.registerId}
                onChange={(e) => setLoginData(prev => ({ ...prev, registerId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password (optional)"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              <Stethoscope className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setCurrentView("register")}
            >
              New Doctor Registration
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

  if (currentView === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-warning mr-2" />
              <h1 className="text-2xl font-bold">Verification Pending</h1>
            </div>
            <CardTitle>Registration Under Review</CardTitle>
            <CardDescription>
              Your registration is being reviewed by our admin team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-warning/10 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-warning mr-2" />
                <span className="font-semibold">Status: Pending Verification</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Dr. {currentDoctor?.fullName} ({currentDoctor?.registerId})
              </p>
              <p className="text-sm text-muted-foreground">
                Submitted: {new Date(currentDoctor?.registrationDate || '').toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">What happens next?</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Admin will review your documents</li>
                <li>• Verification typically takes 1-2 business days</li>
                <li>• You'll receive notification once approved</li>
                <li>• Only verified doctors can access patient data</li>
              </ul>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setCurrentView("login")}
            >
              Back to Login
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

  if (currentView === "register") {
    return <DoctorRegistration onComplete={handleRegistrationComplete} onBack={() => setCurrentView("login")} />;
  }

  if (currentView === "patientReport" && selectedPatient) {
    return <DetailedPatientReport patient={selectedPatient} onBack={() => setCurrentView("main")} />;
  }

  if (currentView === "prescription" && selectedPatient && currentDoctor) {
    return <PrescriptionForm patient={selectedPatient} doctor={currentDoctor} onBack={() => setCurrentView("main")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-blue-600/10 to-teal-600/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Stethoscope className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-semibold text-blue-700">Doctor Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {currentDoctor ? `Dr. ${currentDoctor.fullName}` : 'Doctor'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">{patients.length}</div>
            <div className="text-sm text-muted-foreground">Total Patients</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-warning">
              {patients.filter(p => p.analysis?.riskLevel === 'medium').length}
            </div>
            <div className="text-sm text-muted-foreground">Medium Risk Cases</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-success">
              {patients.filter(p => p.analysis?.riskLevel === 'low').length}
            </div>
            <div className="text-sm text-muted-foreground">Low Risk Cases</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-destructive">
              {patients.filter(p => p.analysis?.riskLevel === 'high').length}
            </div>
            <div className="text-sm text-muted-foreground">High Risk Cases</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Patient Management
                    </CardTitle>
                    <CardDescription>
                      Review assessments and manage patient care
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients by name or Aadhaar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Patients Found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm ? "No patients match your search criteria." : "No patients have completed their health assessments yet."}
                      </p>
                    </div>
                  ) : (
                    filteredPatients.map((patient) => (
                    <div key={patient.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{patient.personalInfo.name || 'Unknown Patient'}</h3>
                        <div className="flex items-center space-x-2">
                            <Badge className={getRiskColor(patient.analysis?.riskLevel || 'low')}>
                              {patient.analysis?.riskLevel || 'low'} risk
                          </Badge>
                            <Badge variant="outline">
                              {patient.analysis ? 'Analyzed' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                          Aadhaar: {patient.aadhaarNumber.slice(0, 4)}-****-{patient.aadhaarNumber.slice(-4)} | 
                          Age: {patient.personalInfo.age} | 
                          Gender: {patient.personalInfo.gender}
                        </p>
                        {patient.analysis && (
                          <div className="mb-3 p-2 bg-muted/30 rounded text-sm">
                            <div className="flex items-center justify-between">
                              <span>Risk Score: {patient.analysis.riskScore}/100</span>
                              <span>Reports: {patient.reports?.length || 0}</span>
                            </div>
                          </div>
                        )}
                      <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setCurrentView("patientReport");
                            }}
                          >
                          <FileText className="h-4 w-4 mr-1" />
                            View Detailed Report
                        </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setCurrentView("prescription");
                            }}
                          >
                          <ClipboardList className="h-4 w-4 mr-1" />
                          Prescribe
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Send to WhatsApp
                        </Button>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Health Camp
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Report Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Bulk Prescription Send
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Consultations:</span>
                    <span className="font-semibold">16/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prescriptions sent:</span>
                    <span className="font-semibold">14</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High risk cases:</span>
                    <span className="font-semibold text-destructive">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average consultation:</span>
                    <span className="font-semibold">15 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}