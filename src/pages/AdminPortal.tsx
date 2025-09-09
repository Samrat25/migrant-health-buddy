import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import HealthCampCreation from "@/components/HealthCampCreation";
import BiometricVerification from "@/components/BiometricVerification";
import { storage, DoctorData, PatientData, HealthCampData, VerificationData } from "@/lib/storage";
import { 
  UserCheck, 
  MapPin, 
  Users, 
  Stethoscope,
  Plus,
  Search,
  Calendar,
  Shield,
  Activity,
  ArrowLeft,
  Heart,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AdminPortal() {
  const [currentView, setCurrentView] = useState("main");
  const [searchTerm, setSearchTerm] = useState("");
  const [healthCamps, setHealthCamps] = useState<HealthCampData[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHealthCamps(storage.getHealthCamps());
    setPatients(storage.getPatients());
    setDoctors(storage.getDoctors());
    
    // Create pending verifications from doctors and patients
    const pendingDocs = storage.getDoctors().filter(d => d.status === 'pending-verification');
    const pendingPatients = storage.getPatients().filter(p => !p.personalInfo.name);
    
    const verifications = [
      ...pendingDocs.map(doc => ({
        id: doc.id,
        name: doc.fullName,
        type: "doctor",
        license: doc.registerId,
        submitted: doc.registrationDate,
        status: doc.status
      })),
      ...pendingPatients.map(patient => ({
        id: patient.id,
        name: patient.personalInfo.name || 'Unknown',
        type: "patient",
        aadhaar: patient.aadhaarNumber.slice(0, 4) + '-****-' + patient.aadhaarNumber.slice(-4),
        submitted: patient.createdAt,
        status: 'pending'
      }))
    ];
    
    setPendingVerifications(verifications);
  };

  const handleCampCreation = (campData: HealthCampData) => {
    storage.saveHealthCamp(campData);
    loadData();
    setCurrentView("main");
    
    toast({
      title: "Health Camp Created",
      description: `${campData.name} has been created successfully.`,
    });
  };

  const handleVerificationComplete = () => {
    loadData();
    setCurrentView("main");
  };

  const approveUser = (userId: string, userType: 'doctor' | 'patient') => {
    if (userType === 'doctor') {
      const success = storage.updateDoctorStatus(userId, 'verified', 'admin');
      if (success) {
        toast({
          title: "Doctor Approved",
          description: "Doctor has been verified and can now access the system.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to approve doctor. Please try again.",
          variant: "destructive",
        });
      }
    } else if (userType === 'patient') {
      // For patients, we'll mark them as verified by updating their personal info
      const patient = storage.getPatient(userId);
      if (patient) {
        storage.updatePatient(userId, { 
          personalInfo: { 
            ...patient.personalInfo, 
            name: patient.personalInfo.name || 'Verified Patient',
            verified: true 
          } 
        });
        toast({
          title: "Patient Approved",
          description: "Patient has been verified and can access the system.",
        });
      }
    }
    
    loadData();
  };

  const rejectUser = (userId: string, userType: 'doctor' | 'patient') => {
    if (userType === 'doctor') {
      const success = storage.updateDoctorStatus(userId, 'rejected', 'admin');
      if (success) {
        toast({
          title: "Doctor Rejected",
          description: "Doctor registration has been rejected.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to reject doctor. Please try again.",
          variant: "destructive",
        });
      }
    } else if (userType === 'patient') {
      // For patients, we can mark them as rejected
      const patient = storage.getPatient(userId);
      if (patient) {
        storage.updatePatient(userId, { 
          personalInfo: { 
            ...patient.personalInfo, 
            verified: false,
            rejectionReason: 'Admin rejection'
          } 
        });
        toast({
          title: "Patient Rejected",
          description: "Patient access has been rejected.",
          variant: "destructive",
        });
      }
    }
    
    loadData();
  };

  if (currentView === "createCamp") {
    return <HealthCampCreation onComplete={handleCampCreation} onBack={() => setCurrentView("main")} />;
  }

  if (currentView === "verification") {
    return <BiometricVerification onComplete={handleVerificationComplete} onBack={() => setCurrentView("main")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-semibold">Admin Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Admin User</span>
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">{patients.length}</div>
            <div className="text-sm text-muted-foreground">Total Patients</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-secondary">
              {doctors.filter(d => d.status === 'verified').length}
            </div>
            <div className="text-sm text-muted-foreground">Verified Doctors</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-success">
              {healthCamps.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Health Camps</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-warning">{pendingVerifications.length}</div>
            <div className="text-sm text-muted-foreground">Pending Verifications</div>
          </Card>
        </div>

        <Tabs defaultValue="camps" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="camps">Health Camps</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="camps" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Health Camp Management
                    </CardTitle>
                    <CardDescription>
                      Create and manage health camps across different locations
                    </CardDescription>
                  </div>
                  <Button onClick={() => setCurrentView("createCamp")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Camp
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthCamps.map((camp) => (
                    <div key={camp.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{camp.name}</h3>
                        <Badge className="bg-success/10 text-success border-success/20">
                          {camp.status}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                        <div>📍 {camp.location}</div>
                        <div>📅 {camp.date}</div>
                        <div>👥 {camp.booked}/{camp.capacity} booked</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-1" />
                          Edit Location
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          View Bookings
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Pending Verifications
                </CardTitle>
                <CardDescription>
                  Review and verify doctors and patients in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {item.type === "doctor" ? (
                            <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                          ) : (
                            <Users className="h-4 w-4 mr-2 text-secondary" />
                          )}
                          <h3 className="font-semibold">{item.name}</h3>
                        </div>
                        <Badge variant="outline">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.type === "doctor" ? `License: ${item.license}` : `Aadhaar: ${item.aadhaar}`} | 
                        Submitted: {item.submitted}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-success text-success-foreground hover:bg-success/90"
                          onClick={() => approveUser(item.id, item.type)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => rejectUser(item.id, item.type)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          Request More Info
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    System Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Users:</span>
                      <span className="font-semibold">{patients.length + doctors.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health Assessments:</span>
                      <span className="font-semibold">{patients.filter(p => p.surveyData).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reports Analyzed:</span>
                      <span className="font-semibold">{patients.filter(p => p.reports && p.reports.length > 0).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Analyses:</span>
                      <span className="font-semibold">{patients.filter(p => p.analysis).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Health Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>High Risk Cases:</span>
                      <span className="font-semibold text-destructive">
                        {patients.filter(p => p.analysis?.riskLevel === 'high').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium Risk:</span>
                      <span className="font-semibold text-warning">
                        {patients.filter(p => p.analysis?.riskLevel === 'medium').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low Risk:</span>
                      <span className="font-semibold text-success">
                        {patients.filter(p => p.analysis?.riskLevel === 'low').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Health Score:</span>
                      <span className="font-semibold">
                        {patients.filter(p => p.analysis).length > 0 
                          ? Math.round(patients.filter(p => p.analysis).reduce((sum, p) => sum + (100 - p.analysis.riskScore), 0) / patients.filter(p => p.analysis).length)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}