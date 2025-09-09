import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DoctorRegistration from "@/components/DoctorRegistration";
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
  Heart
} from "lucide-react";

export default function DoctorPortal() {
  const [currentView, setCurrentView] = useState("main");
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    {
      id: 1,
      name: "Rajesh Kumar",
      aadhaar: "****-****-1234",
      status: "pending-review",
      lastVisit: "2024-01-15",
      riskLevel: "medium"
    },
    {
      id: 2,
      name: "Priya Sharma", 
      aadhaar: "****-****-5678",
      status: "completed",
      lastVisit: "2024-01-10",
      riskLevel: "low"
    },
    {
      id: 3,
      name: "Mohammed Ali",
      aadhaar: "****-****-9012", 
      status: "prescription-sent",
      lastVisit: "2024-01-12",
      riskLevel: "high"
    }
  ];

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

  if (currentView === "register") {
    return <DoctorRegistration onComplete={() => setCurrentView("main")} onBack={() => setCurrentView("main")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Stethoscope className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-semibold">Doctor Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Dr. Sarah Johnson</span>
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
            <div className="text-2xl font-bold text-primary">24</div>
            <div className="text-sm text-muted-foreground">Total Patients</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-warning">8</div>
            <div className="text-sm text-muted-foreground">Pending Reviews</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-success">16</div>
            <div className="text-sm text-muted-foreground">Completed Today</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-secondary">5</div>
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
                  {patients.map((patient) => (
                    <div key={patient.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{patient.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRiskColor(patient.riskLevel)}>
                            {patient.riskLevel} risk
                          </Badge>
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status.replace("-", " ")}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Aadhaar: {patient.aadhaar} | Last Visit: {patient.lastVisit}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          View Assessment
                        </Button>
                        <Button size="sm" variant="outline">
                          <ClipboardList className="h-4 w-4 mr-1" />
                          Prescribe
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Send to WhatsApp
                        </Button>
                      </div>
                    </div>
                  ))}
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