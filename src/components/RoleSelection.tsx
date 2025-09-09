import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Stethoscope, Heart } from "lucide-react";
import healthcareHero from "@/assets/healthcare-hero.jpg";

const roles = [
  {
    id: "patient",
    title: "Patient Portal",
    description: "Access your health records, complete assessments, and book health camps",
    icon: Users,
    color: "bg-primary",
    path: "/patient"
  },
  {
    id: "doctor", 
    title: "Doctor Portal",
    description: "Review patient assessments, manage consultations, and send prescriptions",
    icon: Stethoscope,
    color: "bg-secondary",
    path: "/doctor"
  },
  {
    id: "admin",
    title: "Admin Portal", 
    description: "Manage health camps, verify users, and oversee system operations",
    icon: UserCheck,
    color: "bg-accent",
    path: "/admin"
  }
];

export default function RoleSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${healthcareHero})` }}
        />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HealthConnect
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive health record system for migrant workers - connecting patients, doctors, and administrators for better healthcare outcomes
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">Choose Your Portal</h2>
          <p className="text-muted-foreground text-lg">Select your role to access the appropriate interface</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card key={role.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/50">
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{role.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full transition-all duration-300" 
                    variant="outline"
                    onClick={() => window.location.href = role.path}
                  >
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Aadhaar Integration</h3>
            <p className="text-sm text-muted-foreground">Secure login with Aadhaar card verification</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">Smart health report analysis and recommendations</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Health Camps</h3>
            <p className="text-sm text-muted-foreground">Locate and book nearby health camps</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserCheck className="h-6 w-6 text-warning" />
            </div>
            <h3 className="font-semibold mb-2">Digital Prescriptions</h3>
            <p className="text-sm text-muted-foreground">Receive prescriptions via WhatsApp and SMS</p>
          </div>
        </div>
      </div>
    </div>
  );
}