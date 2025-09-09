import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, ArrowLeft, Upload, CheckCircle } from "lucide-react";

interface DoctorRegistrationProps {
  onComplete: (doctorData: any) => void;
  onBack: () => void;
}

export default function DoctorRegistration({ onComplete, onBack }: DoctorRegistrationProps) {
  const [doctorData, setDoctorData] = useState({
    fullName: "",
    registerId: "",
    licenseNumber: "",
    specialization: "",
    qualification: "",
    experience: "",
    hospitalAffiliation: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    pincode: ""
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const specializations = [
    "General Medicine",
    "Internal Medicine", 
    "Family Medicine",
    "Infectious Diseases",
    "Pulmonology",
    "Cardiology",
    "Endocrinology",
    "Gastroenterology",
    "Nephrology",
    "Emergency Medicine",
    "Public Health",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setDoctorData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const required = ['fullName', 'registerId', 'licenseNumber', 'specialization', 'phone', 'email'];
    return required.every(field => doctorData[field as keyof typeof doctorData].trim() !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (documents.length === 0) {
      toast({
        title: "Documents Required",
        description: "Please upload at least one verification document.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create doctor profile
    const doctorProfile = {
      ...doctorData,
      id: Date.now(),
      registrationDate: new Date().toISOString(),
      status: 'pending-verification',
      documents: documents.map(doc => ({
        name: doc.name,
        type: doc.type,
        size: doc.size
      }))
    };

    // Save to localStorage
    const existingDoctors = JSON.parse(localStorage.getItem('doctorRegistrations') || '[]');
    localStorage.setItem('doctorRegistrations', JSON.stringify([...existingDoctors, doctorProfile]));

    // Save current doctor session
    localStorage.setItem('currentDoctor', JSON.stringify(doctorProfile));

    setIsSubmitting(false);
    
    toast({
      title: "Registration Submitted",
      description: "Your registration has been submitted for verification. You'll be notified once approved.",
    });

    onComplete(doctorProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Doctor Registration
                </CardTitle>
                <CardDescription>
                  Register as a healthcare provider in the migrant worker health system
                </CardDescription>
              </div>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={doctorData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerId">Medical Register ID *</Label>
                  <Input
                    id="registerId"
                    value={doctorData.registerId}
                    onChange={(e) => handleInputChange('registerId', e.target.value)}
                    placeholder="MH-12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number *</Label>
                  <Input
                    id="licenseNumber"
                    value={doctorData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    placeholder="LIC-123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Select value={doctorData.specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={doctorData.qualification}
                    onChange={(e) => handleInputChange('qualification', e.target.value)}
                    placeholder="MBBS, MD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={doctorData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="hospitalAffiliation">Hospital/Clinic Affiliation</Label>
                  <Input
                    id="hospitalAffiliation"
                    value={doctorData.hospitalAffiliation}
                    onChange={(e) => handleInputChange('hospitalAffiliation', e.target.value)}
                    placeholder="City General Hospital"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={doctorData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={doctorData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="doctor@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={doctorData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Maharashtra"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={doctorData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Mumbai"
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Verification Documents</h3>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload medical license, certificates, and ID proof
                </p>
                <Button variant="outline" onClick={() => document.getElementById('doc-upload')?.click()}>
                  Select Files
                </Button>
                <input
                  id="doc-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Uploaded Documents:</h4>
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{doc.name}</span>
                      <Button variant="outline" size="sm" onClick={() => removeDocument(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Terms and Submit */}
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg text-sm">
                <h4 className="font-semibold mb-2">Verification Process:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Your documents will be verified by admin</li>
                  <li>• Verification typically takes 2-3 business days</li>
                  <li>• You'll receive notification once approved</li>
                  <li>• Only verified doctors can access patient data</li>
                </ul>
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !validateForm() || documents.length === 0}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  "Submitting Registration..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Registration
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}