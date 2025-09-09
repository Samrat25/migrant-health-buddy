import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  ArrowLeft, 
  Printer, 
  MessageSquare,
  Plus,
  X,
  Calendar,
  User,
  Stethoscope,
  Heart,
  Pill,
  Clock,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { PatientData, DoctorData } from "@/lib/storage";

interface PrescriptionFormProps {
  patient: PatientData;
  doctor: DoctorData;
  onBack: () => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function PrescriptionForm({ patient, doctor, onBack }: PrescriptionFormProps) {
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const { toast } = useToast();

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setMedications([...medications, newMedication]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      toast({
        title: "Prescription Printed",
        description: "Prescription has been prepared for printing.",
      });
    }, 1000);
  };

  const handleWhatsAppShare = () => {
    const prescriptionText = `
💊 *PRESCRIPTION*

👤 *Patient:* ${patient.personalInfo.name}
🆔 *Aadhaar:* ${patient.aadhaarNumber.slice(0, 4)}-****-${patient.aadhaarNumber.slice(-4)}
📅 *Date:* ${new Date().toLocaleDateString()}

👨‍⚕️ *Doctor:* Dr. ${doctor.fullName}
🏥 *Hospital:* ${doctor.hospitalAffiliation}
📋 *Register ID:* ${doctor.registerId}

🔍 *Diagnosis:* ${diagnosis || 'Not specified'}

💊 *Medications:*
${medications.filter(med => med.name).map(med => 
  `• ${med.name} ${med.dosage} - ${med.frequency} for ${med.duration}
  Instructions: ${med.instructions}`
).join('\n')}

📝 *Notes:* ${notes || 'None'}

📅 *Follow-up:* ${followUp || 'As needed'}

---
*Digital Prescription - Migrant Health Buddy System*
*Valid for 30 days from date of issue*
    `;

    const whatsappUrl = `https://wa.me/${patient.mobileNumber.replace(/\D/g, '')}?text=${encodeURIComponent(prescriptionText)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Share",
      description: "Opening WhatsApp to share prescription.",
    });
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="print:hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-primary" />
                  Digital Prescription
                </CardTitle>
                <CardDescription>
                  Create and share prescription for {patient.personalInfo.name}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
                  <Printer className="h-4 w-4 mr-2" />
                  {isPrinting ? "Printing..." : "Print Prescription"}
                </Button>
                <Button variant="outline" onClick={handleWhatsAppShare}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Share via WhatsApp
                </Button>
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Prescription Content */}
        <div className="space-y-6 print:space-y-4">
          {/* Header */}
          <Card className="print:shadow-none print:border-2">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="h-8 w-8 text-primary mr-2" />
                  <h1 className="text-2xl font-bold">MIGRANT HEALTH BUDDY</h1>
                </div>
                <p className="text-sm text-muted-foreground">Digital Healthcare System</p>
                <Separator className="my-4" />
                <h2 className="text-xl font-bold">PRESCRIPTION</h2>
              </div>
            </CardContent>
          </Card>

          {/* Patient & Doctor Info */}
          <Card className="print:shadow-none print:border-2">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Patient Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{patient.personalInfo.name || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Age:</span>
                      <span>{patient.personalInfo.age || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Gender:</span>
                      <span>{patient.personalInfo.gender || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Aadhaar:</span>
                      <span>{patient.aadhaarNumber.slice(0, 4)}-****-{patient.aadhaarNumber.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Mobile:</span>
                      <span>{patient.mobileNumber}</span>
                    </div>
                    {patient.analysis && (
                      <div className="flex justify-between">
                        <span className="font-medium">Risk Level:</span>
                        <Badge className={getRiskColor(patient.analysis.riskLevel)}>
                          {patient.analysis.riskLevel?.toUpperCase() || 'N/A'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Doctor Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>Dr. {doctor.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Register ID:</span>
                      <span>{doctor.registerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Specialization:</span>
                      <span>{doctor.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Hospital:</span>
                      <span>{doctor.hospitalAffiliation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Phone:</span>
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{doctor.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prescription Details */}
          <Card className="print:shadow-none print:border-2">
            <CardHeader className="print:pb-2">
              <CardTitle className="flex items-center text-lg">
                <Pill className="h-5 w-5 mr-2" />
                Prescription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Diagnosis */}
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis..."
                  className="print:border-0 print:bg-transparent"
                />
              </div>

              {/* Medications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Medications</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addMedication}
                    className="print:hidden"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Medication
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {medications.map((medication, index) => (
                    <div key={medication.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Medication {index + 1}</h4>
                        {medications.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeMedication(medication.id)}
                            className="print:hidden"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`med-name-${medication.id}`}>Medication Name</Label>
                          <Input
                            id={`med-name-${medication.id}`}
                            value={medication.name}
                            onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                            placeholder="e.g., Paracetamol"
                            className="print:border-0 print:bg-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`med-dosage-${medication.id}`}>Dosage</Label>
                          <Input
                            id={`med-dosage-${medication.id}`}
                            value={medication.dosage}
                            onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                            placeholder="e.g., 500mg"
                            className="print:border-0 print:bg-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`med-frequency-${medication.id}`}>Frequency</Label>
                          <Input
                            id={`med-frequency-${medication.id}`}
                            value={medication.frequency}
                            onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
                            placeholder="e.g., Twice daily"
                            className="print:border-0 print:bg-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`med-duration-${medication.id}`}>Duration</Label>
                          <Input
                            id={`med-duration-${medication.id}`}
                            value={medication.duration}
                            onChange={(e) => updateMedication(medication.id, 'duration', e.target.value)}
                            placeholder="e.g., 7 days"
                            className="print:border-0 print:bg-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`med-instructions-${medication.id}`}>Special Instructions</Label>
                        <Textarea
                          id={`med-instructions-${medication.id}`}
                          value={medication.instructions}
                          onChange={(e) => updateMedication(medication.id, 'instructions', e.target.value)}
                          placeholder="e.g., Take with food, avoid alcohol..."
                          rows={2}
                          className="print:border-0 print:bg-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional instructions or notes..."
                  rows={3}
                  className="print:border-0 print:bg-transparent"
                />
              </div>

              {/* Follow-up */}
              <div className="space-y-2">
                <Label htmlFor="followUp">Follow-up Instructions</Label>
                <Input
                  id="followUp"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  placeholder="e.g., Review after 1 week, contact if symptoms worsen..."
                  className="print:border-0 print:bg-transparent"
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card className="print:shadow-none print:border-2 print:mt-8">
            <CardContent className="pt-6">
              <Separator className="mb-4" />
              <div className="text-center text-sm text-muted-foreground">
                <p>Prescription issued on {new Date().toLocaleString()}</p>
                <p>Digital Prescription - Migrant Health Buddy System</p>
                <p className="font-medium mt-2">Valid for 30 days from date of issue</p>
                <div className="flex items-center justify-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>Helpline: +91 1800-123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    <span>support@healthbuddy.com</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-2 { border-width: 2px !important; }
          .print\\:space-y-4 > * + * { margin-top: 1rem !important; }
          .print\\:pb-2 { padding-bottom: 0.5rem !important; }
          .print\\:mt-8 { margin-top: 2rem !important; }
          .print\\:border-0 { border: none !important; }
          .print\\:bg-transparent { background: transparent !important; }
          body { background: white !important; }
          .bg-gradient-to-br { background: white !important; }
        }
      `}</style>
    </div>
  );
}
