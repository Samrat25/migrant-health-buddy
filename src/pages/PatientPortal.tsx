import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  FileText, 
  Brain, 
  MapPin, 
  Calendar,
  Upload,
  ArrowLeft,
  Heart
} from "lucide-react";

export default function PatientPortal() {
  const [currentStep, setCurrentStep] = useState("login");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const handleLogin = () => {
    if (aadhaarNumber && mobileNumber) {
      setCurrentStep("dashboard");
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-semibold">Patient Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, Patient</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentStep("login")}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-8">
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
              <Button className="w-full">Start Survey</Button>
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
              <Button variant="secondary" className="w-full">Upload Files</Button>
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
              <Button variant="outline" className="w-full">View Analysis</Button>
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
              <Button variant="outline" className="w-full">Find Camps</Button>
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
              <Button variant="outline" className="w-full">View Appointments</Button>
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
              <Button variant="outline" className="w-full">View Goals</Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">85%</div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-secondary">3</div>
            <div className="text-sm text-muted-foreground">Camps Booked</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-success">12</div>
            <div className="text-sm text-muted-foreground">Reports Uploaded</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-warning">7</div>
            <div className="text-sm text-muted-foreground">Days to Next Checkup</div>
          </Card>
        </div>
      </div>
    </div>
  );
}