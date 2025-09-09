import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, ArrowLeft, CheckCircle } from "lucide-react";

interface ReportUploadProps {
  onComplete: (reports: any[]) => void;
  onBack: () => void;
}

export default function ReportUpload({ onComplete, onBack }: ReportUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Some files were rejected. Only JPG, PNG, and PDF files under 10MB are allowed.",
        variant: "destructive",
      });
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const simulateUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one report to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    // Simulate file upload process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create mock report data
    const reports = uploadedFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      // Simulate report content based on filename
      content: generateMockReportContent(file.name)
    }));

    // Save to localStorage
    const existingReports = JSON.parse(localStorage.getItem('medicalReports') || '[]');
    const newReports = reports.map(report => ({
      ...report,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      uploadDate: new Date().toISOString()
    }));
    localStorage.setItem('medicalReports', JSON.stringify([...existingReports, ...newReports]));

    setUploading(false);
    
    toast({
      title: "Upload Successful",
      description: `${uploadedFiles.length} report(s) uploaded successfully.`,
    });

    onComplete(reports);
  };

  const generateMockReportContent = (filename: string) => {
    const reportType = filename.toLowerCase();
    
    if (reportType.includes('blood') || reportType.includes('cbc')) {
      return {
        type: 'Blood Test',
        values: {
          hemoglobin: '12.5 g/dL',
          wbc: '7,200 cells/μL',
          rbc: '4.2 million cells/μL',
          platelets: '250,000 cells/μL',
          glucose: '95 mg/dL',
          cholesterol: '180 mg/dL'
        },
        normalRanges: {
          hemoglobin: '12.0-15.5 g/dL',
          wbc: '4,000-11,000 cells/μL',
          rbc: '4.0-5.2 million cells/μL',
          platelets: '150,000-450,000 cells/μL',
          glucose: '70-100 mg/dL',
          cholesterol: '<200 mg/dL'
        }
      };
    } else if (reportType.includes('xray') || reportType.includes('chest')) {
      return {
        type: 'X-Ray',
        findings: 'Lungs appear clear with no signs of infection or abnormalities.',
        impression: 'Normal chest X-ray'
      };
    } else {
      return {
        type: 'General Report',
        findings: 'Report uploaded successfully. Awaiting detailed analysis.',
        status: 'Under Review'
      };
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Medical Reports
                </CardTitle>
                <CardDescription>
                  Upload your blood reports, X-rays, and other medical documents
                </CardDescription>
              </div>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Reports</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop files here, or click to select files
              </p>
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                Select Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: JPG, PNG, PDF (Max 10MB each)
              </p>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Selected Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading files...</span>
                  <span className="text-sm text-muted-foreground">Processing</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onBack} disabled={uploading}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button onClick={simulateUpload} disabled={uploading || uploadedFiles.length === 0}>
                {uploading ? (
                  "Processing..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Upload & Analyze
                  </>
                )}
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Upload Guidelines:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Upload clear, high-quality images of your reports</li>
                <li>• Ensure all text and values are clearly visible</li>
                <li>• Include recent blood tests, X-rays, and diagnostic reports</li>
                <li>• Our AI will analyze the reports for health insights</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}