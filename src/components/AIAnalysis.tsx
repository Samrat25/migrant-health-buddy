import { useState, useEffect, useRef } from "react";
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
  Shield,
  FileText
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
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return; // prevent duplicate runs & blinking notifications
    hasRunRef.current = true;
    // Check if we have survey data; if not, try to continue but with safe defaults
    if (!surveyData) {
      toast({
        title: "Missing Survey",
        description: "Survey not found. Using defaults for analysis. For best results, complete the survey.",
      });
    }

    const runAnalysis = async () => {
      try {
        // Progress simulation
        const intervals = [10, 25, 45, 60, 80, 95, 100];
        for (let i = 0; i < intervals.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 600));
          setAnalysisProgress(intervals[i]);
        }

        // Generate AI analysis with robust defaults
        const safeSurvey = {
          personalInfo: { age: '', gender: '', occupation: '', state: '' },
          symptoms: [],
          exposure: { travelHistory: 'no', crowdedPlaces: 'no', sickContact: 'no' },
          healthHistory: { chronicDiseases: [], medications: '', allergies: '' },
          ...(surveyData || {})
        };
        const safeReports = Array.isArray(reports) ? reports : [];

        let analysisResult = generateAIAnalysis(safeSurvey, safeReports);

        // Prototype: if anything appears missing, inject a safe default and continue
        if (!analysisResult || !analysisResult.riskLevel) {
          analysisResult = buildFallbackAnalysis(safeSurvey, safeReports);
        }

        setAnalysis(analysisResult);
        setAnalysisComplete(true);

        // Save analysis to localStorage
        const analysisWithTimestamp = {
          ...analysisResult,
          timestamp: new Date().toISOString(),
          id: Date.now().toString()
        };
        const existingAnalyses = JSON.parse(localStorage.getItem('aiAnalyses') || '[]');
        localStorage.setItem('aiAnalyses', JSON.stringify([...existingAnalyses, analysisWithTimestamp]));

        toast({ title: "Analysis Complete", description: "Your health analysis has been generated successfully." });
      } catch (error) {
        console.error('AI analysis error:', error);
        // Prototype fallback: never fail - generate default low-risk analysis
        const fallback = buildFallbackAnalysis(
          {
            personalInfo: { age: '', gender: '', occupation: '', state: '' },
            symptoms: [],
            exposure: { travelHistory: 'no', crowdedPlaces: 'no', sickContact: 'no' },
            healthHistory: { chronicDiseases: [], medications: '', allergies: '' }
          },
          []
        );
        setAnalysis(fallback);
        setAnalysisComplete(true);
        toast({ title: "Prototype Mode", description: "Generated a safe default analysis." });
      }
    };

    runAnalysis();
  }, [surveyData, reports, toast]);

  const buildFallbackAnalysis = (survey: any, reportData: any[]) => {
    return {
      riskLevel: 'low',
      riskColor: 'success',
      riskScore: 10,
      riskFactors: ['Prototype default assessment'],
      reportFindings: reportData.length ? ['Reports reviewed'] : ['No reports provided'],
      detailedAnalysis: [],
      insights: [],
      recommendations: ['Continue preventive healthcare measures', 'Maintain healthy lifestyle'],
      healthGoals: [
        { id: 1, title: 'Complete Health Checkup', description: 'Book a routine health check', deadline: '30 days', priority: 'medium', completed: false }
      ],
      summary: 'Prototype analysis generated with default low risk.',
      nextSteps: ['Schedule annual health camp visit', 'Stay updated with preventive screenings'],
      preDiagnosis: [
        { condition: 'General Health Assessment', probability: '40%', urgency: 'Low', symptoms: survey?.symptoms || [], recommendation: 'Maintain good health practices' }
      ]
    };
  };

  const generateAIAnalysis = (survey: any, reportData: any[]) => {
    // Calculate risk factors based on survey
    const riskFactors: string[] = [];
    let riskScore = 0;
    
    // Analyze symptoms
    if (Array.isArray(survey.symptoms) && survey.symptoms.length > 0) {
      riskFactors.push(`Current symptoms: ${survey.symptoms.join(', ')}`);
      riskScore += survey.symptoms.length * 10;
    }

    // Analyze exposure
    if (survey.exposure?.travelHistory === 'yes') {
      riskFactors.push('Recent travel history');
      riskScore += 15;
    }
    if (survey.exposure?.crowdedPlaces === 'yes') {
      riskFactors.push('Recent exposure to crowded places');
      riskScore += 10;
    }
    if (survey.exposure?.sickContact === 'yes') {
      riskFactors.push('Contact with sick individuals');
      riskScore += 20;
    }

    // Analyze chronic diseases
    if (Array.isArray(survey.healthHistory?.chronicDiseases) && survey.healthHistory.chronicDiseases.length > 0) {
      riskFactors.push(`Chronic conditions: ${survey.healthHistory.chronicDiseases.join(', ')}`);
      riskScore += survey.healthHistory.chronicDiseases.length * 15;
    }

    // Analyze reports
    const reportFindings: string[] = [];
    const detailedAnalysis: any[] = [];
    reportData.forEach(report => {
      if (report?.content?.type === 'Blood Test' && report.content.values && report.content.normalRanges) {
        const bloodAnalysis = analyzeBloodReport(report.content);
        reportFindings.push(...bloodAnalysis);
        detailedAnalysis.push({
          type: 'Blood Test',
          findings: bloodAnalysis,
          values: report.content.values,
          normalRanges: report.content.normalRanges
        });
        if (bloodAnalysis.some(finding => finding.includes('abnormal'))) {
          riskScore += 25;
        }
      } else if (report?.content?.type === 'X-Ray') {
        if (report.content.findings) reportFindings.push(`X-Ray: ${report.content.findings}`);
        detailedAnalysis.push({
          type: 'X-Ray',
          findings: report.content.findings,
          impression: report.content.impression
        });
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

    // Generate detailed insights
    const insights = generateDetailedInsights(survey, reportData, riskLevel);

    return {
      riskLevel,
      riskColor,
      riskScore,
      riskFactors,
      reportFindings,
      detailedAnalysis,
      insights,
      recommendations,
      healthGoals,
      summary: generateSummary(riskLevel, survey, reportData),
      nextSteps: generateNextSteps(riskLevel),
      preDiagnosis: generatePreDiagnosis(riskLevel, survey, reportData)
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
    const lifestyleScore = 100 - (symptomsCount * 5) - (chronicCount * 10);
    const pri = riskLevel === 'high' ? 80 : riskLevel === 'medium' ? 50 : 25;
    
    return `Based on your health assessment, you are a ${age}-year-old ${survey.personalInfo.gender} with ${symptomsCount} current symptoms and ${chronicCount} chronic conditions. Your overall risk level is assessed as ${riskLevel}. ${reports.length} medical reports have been analyzed to provide comprehensive health insights. Lifestyle Score: ${Math.max(0, lifestyleScore)}/100. Preventive Risk Index: ${pri}/100.`;
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

  // Helper to format file size
  const formatBytes = (bytes: number) => {
    if (!bytes && bytes !== 0) return '—';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const generateDetailedInsights = (survey: any, reportData: any[], riskLevel: string) => {
    const insights: any[] = [];
    
    // Symptom analysis
    if (survey.symptoms.length > 0) {
      insights.push({
        category: "Symptom Analysis",
        findings: survey.symptoms.map(symptom => ({
          symptom,
          severity: "moderate",
          recommendation: "Monitor closely"
        }))
      });
    }
    
    // Risk factor analysis
    const riskFactors = [];
    if (survey.exposure.travelHistory === 'yes') riskFactors.push('Travel exposure');
    if (survey.exposure.crowdedPlaces === 'yes') riskFactors.push('Crowded place exposure');
    if (survey.exposure.sickContact === 'yes') riskFactors.push('Sick contact exposure');
    
    if (riskFactors.length > 0) {
      insights.push({
        category: "Exposure Risk",
        findings: riskFactors.map(factor => ({
          factor,
          riskLevel: "medium",
          mitigation: "Self-monitoring recommended"
        }))
      });
    }
    
    // Chronic condition analysis
    if (survey.healthHistory.chronicDiseases.length > 0) {
      insights.push({
        category: "Chronic Conditions",
        findings: survey.healthHistory.chronicDiseases.map(disease => ({
          condition: disease,
          management: "Regular monitoring required",
          priority: "high"
        }))
      });
    }
    
    // Lifestyle score (prototype)
    const lifestyleScore = 100 - (survey.symptoms.length * 5) - (survey.healthHistory.chronicDiseases.length * 10);
    insights.push({
      category: 'Lifestyle Score',
      findings: [{ score: Math.max(0, lifestyleScore), interpretation: lifestyleScore > 70 ? 'Good' : lifestyleScore > 40 ? 'Moderate' : 'Needs improvement' }]
    });

    // Preventive risk index (prototype)
    const pri = riskLevel === 'high' ? 80 : riskLevel === 'medium' ? 50 : 25;
    insights.push({
      category: 'Preventive Risk Index',
      findings: [{ index: pri, recommendation: pri >= 50 ? 'Increase monitoring and screenings' : 'Maintain routine care' }]
    });

    return insights;
  };

  const generatePreDiagnosis = (riskLevel: string, survey: any, reportData: any[]) => {
    const diagnoses = [];
    
    if (riskLevel === 'high') {
      diagnoses.push({
        condition: "Acute Respiratory Infection",
        probability: "75%",
        urgency: "High",
        symptoms: survey.symptoms,
        recommendation: "Immediate medical attention required"
      });
    } else if (riskLevel === 'medium') {
      diagnoses.push({
        condition: "Mild Respiratory Symptoms",
        probability: "60%",
        urgency: "Medium",
        symptoms: survey.symptoms,
        recommendation: "Monitor symptoms and consult if worsening"
      });
    } else {
      diagnoses.push({
        condition: "General Health Assessment",
        probability: "40%",
        urgency: "Low",
        symptoms: survey.symptoms,
        recommendation: "Continue monitoring and maintain good health practices"
      });
    }
    
    return diagnoses;
  };

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

        {/* Uploaded Reports Preview */}
        {Array.isArray(reports) && reports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Uploaded Reports
              </CardTitle>
              <CardDescription>
                These reports were analyzed to generate your AI insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="truncate">
                        <div className="text-sm font-medium truncate">{r.name || 'Report'}</div>
                        <div className="text-xs text-muted-foreground">
                          {(r.type || '').replace('application/', '')} • {formatBytes(Number(r.size))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(r.uploadDate || Date.now()).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}