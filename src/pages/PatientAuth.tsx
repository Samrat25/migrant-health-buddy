import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, ArrowLeft } from "lucide-react";
import { storage } from "@/lib/storage";

export default function PatientAuth() {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otpStep, setOtpStep] = useState<'idle' | 'sent'>("idle");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const { toast } = useToast();

  const sendOtp = () => {
    if (!aadhaarNumber) {
      toast({ title: "Aadhaar required", description: "Enter your Aadhaar number.", variant: "destructive" });
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpStep("sent");
    toast({ title: "OTP Sent", description: `Your OTP is ${otp}. Enter it to continue.` });
  };

  const verifyOtpAndLogin = () => {
    if (otpStep !== 'sent' || enteredOtp !== generatedOtp) {
      toast({ title: "Invalid OTP", description: "Please enter the correct OTP.", variant: "destructive" });
      return;
    }

    let patient = storage.getPatientByAadhaar(aadhaarNumber);
    if (!patient) {
      patient = {
        id: Date.now().toString(),
        aadhaarNumber,
        mobileNumber: "",
        personalInfo: { name: "", age: "", gender: "", occupation: "", state: "", city: "" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any;
      storage.savePatient(patient as any);
    }

    storage.setCurrentPatient(patient as any);
    window.location.href = "/patient";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Patient Login</h1>
          </div>
          <CardTitle>Authenticate with OTP</CardTitle>
          <CardDescription>Enter Aadhaar and verify via OTP to access your portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aadhaar">Aadhaar Number</Label>
            <Input id="aadhaar" placeholder="1234 5678 9012" value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} maxLength={12} />
          </div>
          {otpStep === 'idle' ? (
            <Button className="w-full" onClick={sendOtp}>Send OTP</Button>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input id="otp" placeholder="6-digit code" value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} />
              </div>
              <Button className="w-full" onClick={verifyOtpAndLogin}>Verify & Login</Button>
            </>
          )}
          <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/") }>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


