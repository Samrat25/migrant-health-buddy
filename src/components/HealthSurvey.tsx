import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";

interface SurveyData {
  personalInfo: {
    age: string;
    gender: string;
    occupation: string;
    state: string;
  };
  symptoms: string[];
  exposure: {
    travelHistory: string;
    crowdedPlaces: string;
    sickContact: string;
  };
  healthHistory: {
    chronicDiseases: string[];
    medications: string;
    allergies: string;
  };
}

interface HealthSurveyProps {
  onComplete: (data: SurveyData) => void;
  onBack: () => void;
}

export default function HealthSurvey({ onComplete, onBack }: HealthSurveyProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const [surveyData, setSurveyData] = useState<SurveyData>({
    personalInfo: { age: "", gender: "", occupation: "", state: "" },
    symptoms: [],
    exposure: { travelHistory: "", crowdedPlaces: "", sickContact: "" },
    healthHistory: { chronicDiseases: [], medications: "", allergies: "" }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const symptoms = [
    "Fever", "Cough", "Shortness of breath", "Fatigue", "Body aches",
    "Headache", "Loss of taste/smell", "Sore throat", "Nausea", "Diarrhea"
  ];

  const chronicDiseases = [
    "Diabetes", "Hypertension", "Heart disease", "Asthma", "Kidney disease",
    "Liver disease", "Cancer", "HIV/AIDS", "Tuberculosis"
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setSurveyData(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleChronicDiseaseChange = (disease: string, checked: boolean) => {
    setSurveyData(prev => ({
      ...prev,
      healthHistory: {
        ...prev.healthHistory,
        chronicDiseases: checked 
          ? [...prev.healthHistory.chronicDiseases, disease]
          : prev.healthHistory.chronicDiseases.filter(d => d !== disease)
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Save to localStorage
    const timestamp = new Date().toISOString();
    const surveyWithTimestamp = { ...surveyData, timestamp, id: Date.now() };
    
    const existingSurveys = JSON.parse(localStorage.getItem('healthSurveys') || '[]');
    localStorage.setItem('healthSurveys', JSON.stringify([...existingSurveys, surveyWithTimestamp]));
    
    toast({
      title: "Survey Completed",
      description: "Your health assessment has been saved successfully.",
    });
    
    onComplete(surveyData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={surveyData.personalInfo.age}
                  onChange={(e) => setSurveyData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, age: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={surveyData.personalInfo.gender}
                  onValueChange={(value) => setSurveyData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, gender: value }
                  }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={surveyData.personalInfo.occupation}
                  onChange={(e) => setSurveyData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, occupation: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={surveyData.personalInfo.state}
                  onChange={(e) => setSurveyData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, state: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Symptoms</h3>
            <p className="text-sm text-muted-foreground">
              Select all symptoms you're currently experiencing:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {symptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={surveyData.symptoms.includes(symptom)}
                    onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                  />
                  <Label htmlFor={symptom}>{symptom}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exposure History</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Travel history in last 14 days?</Label>
                <RadioGroup
                  value={surveyData.exposure.travelHistory}
                  onValueChange={(value) => setSurveyData(prev => ({
                    ...prev,
                    exposure: { ...prev.exposure, travelHistory: value }
                  }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="travel-yes" />
                    <Label htmlFor="travel-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="travel-no" />
                    <Label htmlFor="travel-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Visited crowded places recently?</Label>
                <RadioGroup
                  value={surveyData.exposure.crowdedPlaces}
                  onValueChange={(value) => setSurveyData(prev => ({
                    ...prev,
                    exposure: { ...prev.exposure, crowdedPlaces: value }
                  }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="crowd-yes" />
                    <Label htmlFor="crowd-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="crowd-no" />
                    <Label htmlFor="crowd-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Contact with sick person?</Label>
                <RadioGroup
                  value={surveyData.exposure.sickContact}
                  onValueChange={(value) => setSurveyData(prev => ({
                    ...prev,
                    exposure: { ...prev.exposure, sickContact: value }
                  }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="contact-yes" />
                    <Label htmlFor="contact-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="contact-no" />
                    <Label htmlFor="contact-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Medical History</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Chronic diseases (select all that apply):</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {chronicDiseases.map((disease) => (
                    <div key={disease} className="flex items-center space-x-2">
                      <Checkbox
                        id={disease}
                        checked={surveyData.healthHistory.chronicDiseases.includes(disease)}
                        onCheckedChange={(checked) => handleChronicDiseaseChange(disease, checked as boolean)}
                      />
                      <Label htmlFor={disease}>{disease}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current medications</Label>
                <Input
                  id="medications"
                  placeholder="List any medications you're taking"
                  value={surveyData.healthHistory.medications}
                  onChange={(e) => setSurveyData(prev => ({
                    ...prev,
                    healthHistory: { ...prev.healthHistory, medications: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Known allergies</Label>
                <Input
                  id="allergies"
                  placeholder="List any known allergies"
                  value={surveyData.healthHistory.allergies}
                  onChange={(e) => setSurveyData(prev => ({
                    ...prev,
                    healthHistory: { ...prev.healthHistory, allergies: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Health Assessment Survey
                </CardTitle>
                <CardDescription>
                  Step {currentStep} of {totalSteps}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}
            
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentStep === totalSteps ? (
                <Button onClick={handleSubmit}>
                  Complete Survey
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}