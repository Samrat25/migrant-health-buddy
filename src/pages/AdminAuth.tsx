import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowLeft } from "lucide-react";

export default function AdminAuth() {
  const [govId, setGovId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"id" | "otp">("id");
  const { toast } = useToast();

  const startVerification = () => {
    if (!govId || govId.length < 6) {
      toast({
        title: "Government ID required",
        description: "Enter a valid ID to continue.",
        variant: "destructive",
      });
      return;
    }

    // Simulate OTP step; in production, call official govt ID service
    setStep("otp");
    toast({ title: "OTP Sent", description: "Enter the OTP sent to your registered contact." });
  };

  const verifyOtp = () => {
    if (otp.length < 4) {
      toast({ title: "Invalid OTP", description: "Please enter the 4-6 digit OTP.", variant: "destructive" });
      return;
    }
    // On success, mark admin session
    localStorage.setItem("adminSession", JSON.stringify({ id: govId, createdAt: new Date().toISOString() }));
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Admin Authentication</h1>
          </div>
          <CardTitle>Secure Admin Login</CardTitle>
          <CardDescription>Authenticate using official government ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "id" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="govId">Government ID</Label>
                <Input id="govId" placeholder="Enter your government ID" value={govId} onChange={(e) => setGovId(e.target.value)} />
              </div>
              <Button className="w-full" onClick={startVerification}>Continue</Button>
              <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input id="otp" placeholder="4-6 digit code" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              <Button className="w-full" onClick={verifyOtp}>Verify & Continue</Button>
              <Button variant="outline" className="w-full" onClick={() => setStep("id")}>Change ID</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


