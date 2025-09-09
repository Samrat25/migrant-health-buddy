import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";
import { 
  Users, 
  UserCheck, 
  Stethoscope, 
  Heart, 
  ArrowRight,
  FileText,
  Brain,
  MapPin,
  CheckCircle,
  Activity,
  Target,
  Upload,
  Sparkles,
  Zap,
  Globe,
  Smartphone,
  Clock,
  TrendingUp,
  Star,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Shield
} from "lucide-react";

export default function RoleSelection() {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [currentFeature, setCurrentFeature] = useState(0);
  const { toast } = useToast();

  const features = [
    { icon: FileText, title: "Health Assessment", desc: "Comprehensive infectious disease screening" },
    { icon: Brain, title: "AI Analysis", desc: "Smart blood report analysis & diagnosis" },
    { icon: MapPin, title: "Health Camps", desc: "Find & book nearby medical camps" },
    { icon: Stethoscope, title: "Doctor Access", desc: "Direct connection with healthcare providers" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePatientLogin = () => {
    if (!aadhaarNumber || !mobileNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter both Aadhaar number and mobile number.",
        variant: "destructive",
      });
      return;
    }

    // Check if patient exists
    const existingPatient = storage.getPatientByAadhaar(aadhaarNumber);
    
    if (existingPatient) {
      // Patient exists, set current session and redirect
      storage.setCurrentPatient(existingPatient);
      window.location.href = "/patient";
    } else {
      // New patient, create and redirect
      const newPatient = {
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
      
      storage.savePatient(newPatient);
      storage.setCurrentPatient(newPatient);
      window.location.href = "/patient";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className="relative border-b bg-white/10 backdrop-blur-md border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center animate-in fade-in-50 slide-in-from-left-4 duration-1000">
              <div className="relative">
                <Heart className="h-10 w-10 text-red-500 mr-3 animate-pulse" />
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Migrant Health Buddy
                </h1>
                <p className="text-sm text-purple-200">Your Health, Our Priority</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 animate-in fade-in-50 slide-in-from-right-4 duration-1000">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={() => window.location.href = "/doctor"}
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Doctor Portal
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={() => window.location.href = "/admin"}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Portal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000">
            <Zap className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-white text-sm font-medium">AI-Powered Healthcare Platform</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000" style={{animationDelay: '0.2s'}}>
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Revolutionizing
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-200 via-purple-200 to-white bg-clip-text text-transparent">
              Migrant Healthcare
            </span>
          </h1>
          
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto animate-in fade-in-50 slide-in-from-bottom-4 duration-1000" style={{animationDelay: '0.4s'}}>
            Empowering migrant workers with accessible, intelligent healthcare solutions. 
            Get instant health assessments, AI-powered analysis, and connect with nearby health camps.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000" style={{animationDelay: '0.6s'}}>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-sm text-purple-200">Patients Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-sm text-purple-200">Health Camps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-sm text-purple-200">Accuracy Rate</div>
            </div>
          </div>
        </div>

        {/* Patient Login Card */}
        <div className="max-w-md mx-auto mb-16 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000" style={{animationDelay: '0.8s'}}>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-white">
                <Heart className="h-6 w-6 mr-2 text-red-400" />
                Patient Portal Access
              </CardTitle>
              <CardDescription className="text-purple-200">
                Enter your details to start your health journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaar" className="text-white">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  placeholder="Enter your Aadhaar number"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-white">Mobile Number</Label>
                <Input
                  id="mobile"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
                />
              </div>
              <Button 
                onClick={handlePatientLogin} 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Start Health Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Animated Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000">
            Key Features
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-500 cursor-pointer ${
                    currentFeature === index ? 'scale-105 shadow-2xl' : 'hover:scale-105'
                  } animate-in fade-in-50 slide-in-from-bottom-4 duration-1000`}
                  style={{animationDelay: `${0.2 * index}s`}}
                  onClick={() => setCurrentFeature(index)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentFeature === index 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'bg-white/20 text-purple-200'
                    }`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-purple-200">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Portal Access */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 animate-in fade-in-50 slide-in-from-left-4 duration-1000">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Stethoscope className="h-6 w-6 mr-3 text-blue-400" />
                Doctor Portal
              </CardTitle>
              <CardDescription className="text-purple-200">
                Advanced patient management and care delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-purple-200">
                  <CheckCircle className="h-4 w-4 mr-3 text-green-400" />
                  Real-time patient data access
                </div>
                <div className="flex items-center text-sm text-purple-200">
                  <CheckCircle className="h-4 w-4 mr-3 text-green-400" />
                  AI-powered report analysis
                </div>
                <div className="flex items-center text-sm text-purple-200">
                  <CheckCircle className="h-4 w-4 mr-3 text-green-400" />
                  Digital prescription system
                </div>
                <div className="flex items-center text-sm text-purple-200">
                  <CheckCircle className="h-4 w-4 mr-3 text-green-400" />
                  WhatsApp integration
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={() => window.location.href = "/doctor"}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Access Doctor Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 animate-in fade-in-50 slide-in-from-right-4 duration-1000">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="h-6 w-6 mr-3 text-green-400" />
                Admin Portal
              </CardTitle>
              <CardDescription className="text-purple-200">
                Comprehensive system management and oversight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-purple-200">
                  <CheckCircle className="h-4 w-4 mr-3 text-green-400" />
                  Biometric user verification
                </div>
                <div className="flex items-center text-sm text-purple-200">
                  <CheckCircle className="h-4 w-4 mr-3 text-green-400" />
                  Health camp management
                </div>
                <div className="flex items-center text-sm text-purple-200">
                  <CheckCircle className="h-4 w-4 mr-3 text-green-400" />
                  Real-time analytics dashboard
                </div>
                <div className="flex items-center text-sm text-purple-200">
                  <CheckCircle className="h-4 w-4 mr-3 text-green-400" />
                  System monitoring
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={() => window.location.href = "/admin"}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Access Admin Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <div className="text-center mb-16 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000">
          <h2 className="text-3xl font-bold text-white mb-8">Powered by Advanced Technology</h2>
          <div className="flex justify-center items-center space-x-8 flex-wrap">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Brain className="h-5 w-5 text-purple-400" />
              <span className="text-white font-medium">AI Analysis</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Smartphone className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium">Mobile First</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Globe className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">Cloud Based</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Shield className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-medium">Secure</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-in fade-in-50 slide-in-from-bottom-4 duration-1000">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Healthcare?</h2>
          <p className="text-purple-200 mb-8">Join thousands of migrant workers who trust us with their health</p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handlePatientLogin}
            >
              <Play className="h-5 w-5 mr-2" />
              Start Now
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => window.location.href = "/doctor"}
            >
              <Users className="h-5 w-5 mr-2" />
              For Doctors
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative border-t bg-white/5 backdrop-blur-md border-white/20 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-purple-200">
            <p>&copy; 2024 Migrant Health Buddy. Empowering healthcare for all.</p>
          </div>
        </div>
      </div>
    </div>
  );
}