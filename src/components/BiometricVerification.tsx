import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  ArrowLeft, 
  Fingerprint, 
  Eye, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Users,
  Stethoscope
} from "lucide-react";

interface BiometricVerificationProps {
  onComplete: (verificationId: string, status: 'approved' | 'rejected') => void;
  onBack: () => void;
}

export default function BiometricVerification({ onComplete, onBack }: BiometricVerificationProps) {
  const [currentVerification, setCurrentVerification] = useState<any>(null);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Get pending verifications from localStorage via the storage API
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  
  // Load pending verifications from storage
  useEffect(() => {
    try {
      // Get patients and doctors from storage
      const patients = JSON.parse(localStorage.getItem('patients') || '[]');
      const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
      
      // Create pending verifications from doctors and patients
      const pendingDocs = doctors.filter((d: any) => d.status === 'pending-verification');
      const pendingPatients = patients.filter((p: any) => !p.personalInfo?.verified);
      
      const verifications = [
        ...pendingDocs.map((doc: any) => ({
          id: doc.id,
          name: doc.fullName || 'Unnamed Doctor',
          type: "doctor",
          registerId: doc.registerId || 'No License',
          licenseNumber: doc.licenseNumber || 'Unknown',
          submittedDate: doc.registrationDate || doc.createdAt || new Date().toISOString(),
          documents: doc.documents || ['Medical License'],
          status: doc.status || 'pending-verification'
        })),
        ...pendingPatients.map((patient: any) => ({
          id: patient.id,
          name: patient.personalInfo?.name || 'Unknown',
          type: "patient",
          aadhaar: patient.aadhaarNumber ? 
            (patient.aadhaarNumber.slice(0, 4) + '-****-' + patient.aadhaarNumber.slice(-4)) : 
            'No Aadhaar',
          phone: patient.mobileNumber || 'Unknown',
          submittedDate: patient.createdAt || new Date().toISOString(),
          documents: ['Aadhaar Card'],
          status: 'pending'
        }))
      ];
      
      setPendingVerifications(verifications);
    } catch (error) {
      console.error('Error loading verification data:', error);
      toast({
        title: "Data Loading Error",
        description: "There was a problem loading the verification data.",
        variant: "destructive",
      });
    }
  }, []);

  const startBiometricVerification = async (user: any) => {
    setCurrentVerification(user);
    setIsVerifying(true);
    setVerificationProgress(0);

    // Simulate biometric verification process
    const steps = [
      { progress: 20, message: "Initializing biometric scanner..." },
      { progress: 40, message: "Scanning fingerprint..." },
      { progress: 60, message: "Analyzing biometric data..." },
      { progress: 80, message: "Cross-referencing with database..." },
      { progress: 100, message: "Verification complete!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVerificationProgress(step.progress);
      
      if (step.progress === 100) {
        // Simulate verification result (90% success rate)
        const isVerified = Math.random() > 0.1;
        
        if (isVerified) {
          toast({
            title: "Verification Successful",
            description: `${user.name} has been successfully verified.`,
          });
          
          // Update verification status in localStorage
          updateVerificationStatus(user.id, 'verified');
        } else {
          toast({
            title: "Verification Failed",
            description: `Biometric verification failed for ${user.name}.`,
            variant: "destructive",
          });
          
          updateVerificationStatus(user.id, 'failed');
        }
      }
    }

    setIsVerifying(false);
    setCurrentVerification(null);
    setVerificationProgress(0);
  };

  const updateVerificationStatus = (userId: string, status: string) => {
    try {
      // Update the verification status in the storage system
      const verification = pendingVerifications.find(v => v.id === userId);
      if (!verification) {
        throw new Error('Verification not found');
      }
      
      // Call the onComplete callback with the appropriate status
      if (status === 'verified' || status === 'approved') {
        onComplete(userId, 'approved');
      } else if (status === 'failed' || status === 'rejected') {
        onComplete(userId, 'rejected');
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        title: "Verification Error",
        description: "Failed to update verification status.",
        variant: "destructive",
      });
    }
  };

  const manualApproval = (user: any, approved: boolean) => {
    const status = approved ? 'approved' : 'rejected';
    
    toast({
      title: approved ? "Manually Approved" : "Manually Rejected",
      description: `${user.name} has been ${status}.`,
    });
    
    updateVerificationStatus(user.id, status);
  };

  const getVerificationStatus = (userId: string) => {
    const verification = pendingVerifications.find(v => v.id === userId);
    return verification?.status || 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return 'bg-success/10 text-success border-success/20';
      case 'failed':
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isVerifying && currentVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fingerprint className="h-5 w-5 mr-2 text-primary" />
                Biometric Verification in Progress
              </CardTitle>
              <CardDescription>
                Verifying {currentVerification.name} using biometric authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="relative">
                  <Fingerprint className="h-24 w-24 mx-auto mb-4 text-primary animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-4 border-primary/20 rounded-full animate-ping"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Scanning Biometric Data</h3>
                <p className="text-muted-foreground mb-4">
                  Please ensure the user places their finger on the scanner
                </p>
                <Progress value={verificationProgress} className="w-full mb-2" />
                <p className="text-sm text-muted-foreground">{verificationProgress}% Complete</p>
              </div>

              {/* User Info */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Verifying User:</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{currentVerification.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentVerification.type === 'doctor' 
                        ? `Register ID: ${currentVerification.registerId}`
                        : `Aadhaar: ${currentVerification.aadhaar}`
                      }
                    </p>
                  </div>
                  <Badge variant="outline">
                    {currentVerification.type}
                  </Badge>
                </div>
              </div>

              {/* Verification Steps */}
              <div className="space-y-2 text-sm">
                <div className={`flex items-center ${verificationProgress >= 20 ? 'text-success' : 'text-muted-foreground'}`}>
                  {verificationProgress >= 20 ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="h-4 w-4 mr-2 border-2 border-muted-foreground rounded-full" />
                  )}
                  Scanner initialized
                </div>
                <div className={`flex items-center ${verificationProgress >= 40 ? 'text-success' : 'text-muted-foreground'}`}>
                  {verificationProgress >= 40 ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="h-4 w-4 mr-2 border-2 border-muted-foreground rounded-full" />
                  )}
                  Fingerprint captured
                </div>
                <div className={`flex items-center ${verificationProgress >= 60 ? 'text-success' : 'text-muted-foreground'}`}>
                  {verificationProgress >= 60 ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="h-4 w-4 mr-2 border-2 border-muted-foreground rounded-full" />
                  )}
                  Biometric analysis complete
                </div>
                <div className={`flex items-center ${verificationProgress >= 80 ? 'text-success' : 'text-muted-foreground'}`}>
                  {verificationProgress >= 80 ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="h-4 w-4 mr-2 border-2 border-muted-foreground rounded-full" />
                  )}
                  Database verification
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Biometric Verification Center
                </CardTitle>
                <CardDescription>
                  Verify user identities using biometric authentication
                </CardDescription>
              </div>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Verification Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">
              {pendingVerifications.filter(v => getVerificationStatus(v.id) === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-success">
              {pendingVerifications.filter(v => ['verified', 'approved'].includes(getVerificationStatus(v.id))).length}
            </div>
            <div className="text-sm text-muted-foreground">Verified</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-destructive">
              {pendingVerifications.filter(v => ['failed', 'rejected'].includes(getVerificationStatus(v.id))).length}
            </div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-secondary">
              {pendingVerifications.length}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
        </div>

        {/* Verification Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Verification Queue
            </CardTitle>
            <CardDescription>
              Users pending biometric verification and manual approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.map((user) => {
                const status = getVerificationStatus(user.id);
                return (
                  <div key={user.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {user.type === 'doctor' ? (
                          <Stethoscope className="h-5 w-5 mr-3 text-primary" />
                        ) : (
                          <Users className="h-5 w-5 mr-3 text-secondary" />
                        )}
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {user.type === 'doctor' 
                              ? `${user.registerId} • License: ${user.licenseNumber}`
                              : `${user.aadhaar} • ${user.phone}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {user.type}
                        </Badge>
                        <Badge className={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">
                        Submitted: {user.submittedDate}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Documents: {user.documents.join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => startBiometricVerification(user)}
                            disabled={isVerifying}
                          >
                            <Fingerprint className="h-4 w-4 mr-1" />
                            Biometric Verify
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => manualApproval(user, true)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Manual Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => manualApproval(user, false)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {status === 'verified' && (
                        <div className="flex items-center text-success text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Biometrically verified
                        </div>
                      )}
                      
                      {status === 'failed' && (
                        <div className="flex items-center text-destructive text-sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Verification failed
                        </div>
                      )}
                      
                      {status === 'approved' && (
                        <div className="flex items-center text-success text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Manually approved
                        </div>
                      )}
                      
                      {status === 'rejected' && (
                        <div className="flex items-center text-destructive text-sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Manually rejected
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Verification Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Biometric Verification:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Ensure proper fingerprint scanner connection</li>
                  <li>• Clean scanner surface before each use</li>
                  <li>• Ask user to place finger firmly on scanner</li>
                  <li>• Retry if initial scan quality is poor</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Manual Verification:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Verify all submitted documents thoroughly</li>
                  <li>• Cross-check license numbers with medical board</li>
                  <li>• Confirm identity with government issued ID</li>
                  <li>• Document any discrepancies found</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => onBack()} size="lg">
            Return to Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}