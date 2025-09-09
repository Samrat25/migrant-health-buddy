import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Heart
} from "lucide-react";

export default function AdminPortal() {
  const [searchTerm, setSearchTerm] = useState("");

  const healthCamps = [
    {
      id: 1,
      name: "Central Health Camp",
      location: "Mumbai, Maharashtra", 
      date: "2024-01-20",
      capacity: 50,
      booked: 32,
      status: "active"
    },
    {
      id: 2,
      name: "North Zone Camp",
      location: "Delhi NCR",
      date: "2024-01-25", 
      capacity: 75,
      booked: 45,
      status: "active"
    }
  ];

  const pendingVerifications = [
    {
      id: 1,
      name: "Dr. Amit Patel",
      type: "doctor",
      license: "MH-12345",
      submitted: "2024-01-15"
    },
    {
      id: 2,
      name: "Sunita Devi",
      type: "patient", 
      aadhaar: "****-****-1234",
      submitted: "2024-01-16"
    }
  ];

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
            <div className="text-2xl font-bold text-primary">1,247</div>
            <div className="text-sm text-muted-foreground">Total Patients</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-secondary">89</div>
            <div className="text-sm text-muted-foreground">Verified Doctors</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-success">24</div>
            <div className="text-sm text-muted-foreground">Active Health Camps</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-warning">12</div>
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
                  <Button>
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
                        <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
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
                      <span>Daily Active Users:</span>
                      <span className="font-semibold">892</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health Assessments:</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reports Analyzed:</span>
                      <span className="font-semibold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prescriptions Sent:</span>
                      <span className="font-semibold">124</span>
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
                      <span className="font-semibold text-destructive">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium Risk:</span>
                      <span className="font-semibold text-warning">87</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low Risk:</span>
                      <span className="font-semibold text-success">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Health Score:</span>
                      <span className="font-semibold">78%</span>
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