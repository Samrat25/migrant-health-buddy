import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Activity,
  Heart,
  Shield
} from "lucide-react";

interface AIAnalysisProps {
  surveyData: any;
  reports: any[];
  onComplete: (analysis: any) => void;
  onBack: () => void;
}

export default function AIAnalysis({ surveyData, reports, onComplete, onBack }: AIAnalysisProps) {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate AI analysis process
    const runAnalysis = async () => {
      // Progress simulation
      const intervals = [10, 25, 45, 60, 80, 95, 100];
      
      for (let i = 0; i < intervals.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setAnalysisProgress(intervals[i]);
      }

      // Generate AI analysis based on survey and reports
      const analysisResult = generateAIAnalysis(surveyData, reports);
      setAnalysis(analysisResult);
      setAnalysisComplete(true);

      // Save analysis to localStorage
      const analysisWithTimestamp = {
        ...analysisResult,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      const existingAnalyses = JSON.parse(localStorage.getItem('aiAnalyses') || '[]');
      localStorage.setItem('aiAnalyses', JSON.stringify([...existingAnalyses, analysisWithTimestamp]));

      toast({
        title: "Analysis Complete",
        description: "Your health analysis has been generated successfully.",
      });
    };

    runAnalysis();
  }, [surveyData, reports, toast]);

  const generateAIAnalysis = (survey: any, reportData: any[]) => {
    // Calculate risk factors based on survey
    const riskFactors = [];
    let riskScore = 0;
    
    // Analyze symptoms
    if (survey.symptoms.length > 0) {
      riskFactors.push(`Current symptoms: ${survey.symptoms.join(', ')}`);
      riskScore += survey.symptoms.length * 10;
    }

    // Analyze exposure
    if (survey.exposure.travelHistory === 'yes') {
      riskFactors.push('Recent travel history');
      riskScore += 15;
    }
    if (survey.exposure.crowdedPlaces === 'yes') {
      riskFactors.push('Recent exposure to crowded places');
      riskScore += 10;
    }
    if (survey.exposure.sickContact === 'yes') {
      riskFactors.push('Contact with sick individuals');
      riskScore += 20;
    }

    // Analyze chronic diseases
    if (survey.healthHistory.chronicDiseases.length > 0) {
      riskFactors.push(`Chronic conditions: ${survey.healthHistory.chronicDiseases.join(', ')}`);
      riskScore += survey.healthHistory.chronicDiseases.length * 15;
    }

    // Analyze reports
    const reportFindings = [];
    reportData.forEach(report => {
      if (report.content.type === 'Blood Test') {
        const bloodAnalysis = analyzeBloodReport(report.content);
        reportFindings.push(...bloodAnalysis);
        if (bloodAnalysis.some(finding => finding.includes('abnormal'))) {
          riskScore += 25;
        }
      }
    });

    // Determine risk level
    let riskLevel = 'low';
    let riskColor = 'success';
    if (riskScore > 50) {
      riskLevel = 'high';
      riskColor = 'destructive';
    } else if (riskScore > 25) {
      riskLevel = 'medium';
      riskColor = 'warning';
    }

    // Generate recommendations
    const recommendations = generateRecommendations(riskLevel, survey, reportData);
    
    // Generate health goals
    const healthGoals = generateHealthGoals(survey, riskLevel);

    return {
      riskLevel,
      riskColor,
      riskScore,
      riskFactors,
      reportFindings,
      recommendations,
      healthGoals,
      summary: generateSummary(riskLevel, survey, reportData),
      nextSteps: generateNextSteps(riskLevel)
    };
  };

  const analyzeBloodReport = (bloodContent: any) => {
    const findings = [];
    const values = bloodContent.values;
    const ranges = bloodContent.normalRanges;

    // Simple analysis (in real app, this would be more sophisticated)
    if (parseFloat(values.hemoglobin) < 12.0) {
      findings.push('Hemoglobin levels are below normal range - possible anemia');
    }
    if (parseInt(values.glucose) > 100) {
      findings.push('Glucose levels are elevated - monitor for diabetes');
    }
    if (parseInt(values.cholesterol) > 200) {
      findings.push('Cholesterol levels are high - dietary changes recommended');
    }
    
    if (findings.length === 0) {
      findings.push('Blood test results are within normal ranges');
    }

    return findings;
  };

  const generateRecommendations = (riskLevel: string, survey: any, reports: any[]) => {
    const recommendations = [];

    if (riskLevel === 'high') {
      recommendations.push('Immediate medical consultation recommended');
      recommendations.push('Self-isolation until cleared by healthcare provider');
      recommendations.push('Monitor symptoms closely');
    } else if (riskLevel === 'medium') {
      recommendations.push('Schedule appointment with healthcare provider');
      recommendations.push('Continue monitoring symptoms');
      recommendations.push('Maintain good hygiene practices');
    } else {
      recommendations.push('Continue preventive healthcare measures');
      recommendations.push('Regular health checkups as scheduled');
      recommendations.push('Maintain healthy lifestyle');
    }

    // Add specific recommendations based on chronic diseases
    if (survey.healthHistory.chronicDiseases.includes('Diabetes')) {
      recommendations.push('Monitor blood sugar levels regularly');
    }
    if (survey.healthHistory.chronicDiseases.includes('Hypertension')) {
      recommendations.push('Monitor blood pressure daily');
    }

    return recommendations;
  };

  const generateHealthGoals = (survey: any, riskLevel: string) => {
    const goals = [
      {
        id: 1,
        title: 'Complete Health Checkup',
        description: 'Schedule and complete comprehensive health examination',
        deadline: '30 days',
        priority: riskLevel === 'high' ? 'high' : 'medium',
        completed: false
      },
      {
        id: 2,
        title: 'Improve Physical Activity',
        description: 'Engage in 30 minutes of moderate exercise daily',
        deadline: 'Ongoing',
        priority: 'medium',
        completed: false
      },
      {
        id: 3,
        title: 'Medication Adherence',
        description: 'Take prescribed medications as directed',
        deadline: 'Daily',
        priority: survey.healthHistory.medications ? 'high' : 'low',
        completed: false
      },
      {
        id: 4,
        title: 'Follow-up Testing',
        description: 'Schedule follow-up blood tests in 3 months',
        deadline: '90 days',
        priority: 'medium',
        completed: false
      }
    ];

    return goals.filter(goal => 
      goal.priority !== 'low' || survey.healthHistory.medications
    );
  };

  const generateSummary = (riskLevel: string, survey: any, reports: any[]) => {
    const age = survey.personalInfo.age;
    const symptomsCount = survey.symptoms.length;
    const chronicCount = survey.healthHistory.chronicDiseases.length;
    
    return `Based on your health assessment, you are a ${age}-year-old ${survey.personalInfo.gender} with ${symptomsCount} current symptoms and ${chronicCount} chronic conditions. Your overall risk level is assessed as ${riskLevel}. ${reports.length} medical reports have been analyzed to provide comprehensive health insights.`;
  };

  const generateNextSteps = (riskLevel: string) => {
    if (riskLevel === 'high') {
      return [
        'Contact healthcare provider immediately',
        'Book nearest health camp consultation',
        'Follow isolation guidelines if symptomatic',
        'Monitor vital signs regularly'
      ];
    } else if (riskLevel === 'medium') {
      return [
        'Schedule routine checkup within 2 weeks',
        'Continue current medications',
        'Book health camp for preventive screening',
        'Maintain healthy lifestyle practices'
      ];
    } else {
      return [
        'Continue preventive care routine',
        'Schedule annual health camp visit',
        'Maintain current health practices',
        'Stay updated with preventive screenings'
      ];
    }
  };

  const handleComplete = () => {
    onComplete(analysis);
  };

  if (!analysisComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                AI Health Analysis
              </CardTitle>
              <CardDescription>
                Our AI is analyzing your health data to provide personalized insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Brain className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">Analyzing Your Health Data</h3>
                <p className="text-muted-foreground mb-4">
                  Processing survey responses and medical reports...
                </p>
                <Progress value={analysisProgress} className="w-full mb-2" />
                <p className="text-sm text-muted-foreground">{analysisProgress}% Complete</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Survey data processed
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Medical reports analyzed
                </div>
                <div className={`flex items-center ${analysisProgress >= 80 ? 'text-success' : 'text-muted-foreground'}`}>
                  {analysisProgress >= 80 ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="h-4 w-4 mr-2 border-2 border-muted-foreground rounded-full" />
                  )}
                  Generating recommendations
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
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  AI Health Analysis Report
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis based on your health assessment and medical reports
                </CardDescription>
              </div>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">Risk Level: 
                  <Badge className={`ml-2 text-lg px-3 py-1 bg-${analysis.riskColor}/10 text-${analysis.riskColor} border-${analysis.riskColor}/20`}>
                    {analysis.riskLevel.toUpperCase()}
                  </Badge>
                </p>
                <p className="text-muted-foreground">Risk Score: {analysis.riskScore}/100</p>
              </div>
              <Progress value={analysis.riskScore} className="w-32" />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Risk Factors Identified:</h4>
              {analysis.riskFactors.length > 0 ? (
                <ul className="space-y-1">
                  {analysis.riskFactors.map((factor: string, index: number) => (
                    <li key={index} className="flex items-center text-sm">
                      <AlertTriangle className="h-4 w-4 mr-2 text-warning flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No significant risk factors identified</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{analysis.summary}</p>
          </CardContent>
        </Card>

        {/* Report Findings */}
        {analysis.reportFindings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Medical Report Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.reportFindings.map((finding: string, index: number) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-success flex-shrink-0" />
                    {finding}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Immediate Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {analysis.nextSteps.map((step: string, index: number) => (
                <li key={index} className="flex items-center text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs mr-3">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button onClick={handleComplete} size="lg">
            View Health Goals & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}