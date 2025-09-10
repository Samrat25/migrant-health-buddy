import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  ArrowLeft, 
  Target, 
  Calendar,
  CheckCircle,
  TrendingUp,
  Plus
} from "lucide-react";

interface HealthGoalsProps {
  analysis: any;
  onComplete: () => void;
  onBack: () => void;
}

export default function HealthGoals({ analysis, onComplete, onBack }: HealthGoalsProps) {
  const [goals, setGoals] = useState(analysis.healthGoals || []);
  const [completedGoals, setCompletedGoals] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load completed goals from localStorage
    const saved = localStorage.getItem('completedHealthGoals');
    if (saved) {
      setCompletedGoals(JSON.parse(saved));
    }
  }, []);

  const toggleGoalCompletion = (goalId: number) => {
    const newCompleted = completedGoals.includes(goalId)
      ? completedGoals.filter(id => id !== goalId)
      : [...completedGoals, goalId];
    
    setCompletedGoals(newCompleted);
    localStorage.setItem('completedHealthGoals', JSON.stringify(newCompleted));
    
    const goalTitle = goals.find((g: any) => g.id === goalId)?.title;
    
    if (newCompleted.includes(goalId)) {
      toast({
        title: "Goal Completed!",
        description: `Great job completing: ${goalTitle}`,
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const rawCompletion = goals.length === 0 ? 0 : (completedGoals.length / goals.length) * 100;
  const completionPercentage = Math.min(100, Math.max(0, rawCompletion));
  const overflowPercentage = Math.max(0, Math.round(rawCompletion - 100));

  const generatePreDiagnosis = () => {
    const riskLevel = analysis.riskLevel;
    const symptoms = analysis.riskFactors.filter((f: string) => f.includes('symptoms')).length > 0;
    
    if (riskLevel === 'high' && symptoms) {
      return {
        title: "Immediate Medical Attention Required",
        description: "Based on your symptoms and risk factors, we recommend immediate consultation with a healthcare provider.",
        urgency: "immediate",
        color: "destructive"
      };
    } else if (riskLevel === 'medium') {
      return {
        title: "Preventive Care Recommended",
        description: "Your health indicators suggest the need for preventive measures and regular monitoring.",
        urgency: "within 2 weeks",
        color: "warning"
      };
    } else {
      return {
        title: "Continue Preventive Healthcare",
        description: "Your health indicators are generally positive. Maintain current healthy practices.",
        urgency: "routine checkup",
        color: "success"
      };
    }
  };

  const preDiagnosis = generatePreDiagnosis();

  const sustainableGoals = [
    {
      id: 101,
      title: "Daily Health Monitoring",
      description: "Track vital signs and symptoms daily using health apps",
      category: "Monitoring",
      frequency: "Daily"
    },
    {
      id: 102,
      title: "Nutrition Improvement",
      description: "Follow balanced diet rich in fruits, vegetables, and whole grains",
      category: "Diet",
      frequency: "Daily"
    },
    {
      id: 103,
      title: "Regular Exercise",
      description: "Maintain 150 minutes of moderate exercise per week",
      category: "Fitness",
      frequency: "Weekly"
    },
    {
      id: 104,
      title: "Preventive Screenings",
      description: "Complete age-appropriate health screenings annually",
      category: "Prevention",
      frequency: "Annually"
    },
    {
      id: 105,
      title: "Stress Management",
      description: "Practice stress reduction techniques like meditation or yoga",
      category: "Mental Health",
      frequency: "Daily"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-primary" />
                  Health Goals & Pre-Diagnosis
                </CardTitle>
                <CardDescription>
                  Your personalized health goals and preliminary assessment
                </CardDescription>
              </div>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Pre-Diagnosis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Preliminary Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg border bg-${preDiagnosis.color}/10 border-${preDiagnosis.color}/20`}>
              <h3 className={`font-semibold text-lg mb-2 text-${preDiagnosis.color}`}>
                {preDiagnosis.title}
              </h3>
              <p className="mb-3">{preDiagnosis.description}</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Recommended Timeline: {preDiagnosis.urgency}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview (capped at 100%, overflow noted) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Goal Progress
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.min(completedGoals.length, goals.length)} of {goals.length} completed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={completionPercentage} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {Math.round(rawCompletion)}% Complete{overflowPercentage > 0 ? ` (capped at 100%)` : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Immediate Health Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Immediate Health Goals</CardTitle>
            <CardDescription>
              Goals based on your current health assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal: any) => (
                <div key={goal.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`goal-${goal.id}`}
                        checked={completedGoals.includes(goal.id)}
                        onCheckedChange={() => toggleGoalCompletion(goal.id)}
                      />
                      <div>
                        <h4 className={`font-semibold ${completedGoals.includes(goal.id) ? 'line-through text-muted-foreground' : ''}`}>
                          {goal.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                      {completedGoals.includes(goal.id) && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground ml-8">
                    <Calendar className="h-4 w-4 mr-1" />
                    Deadline: {goal.deadline}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sustainable Long-term Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Sustainable Health Goals
            </CardTitle>
            <CardDescription>
              Long-term goals for maintaining optimal health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {sustainableGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{goal.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {goal.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {goal.frequency}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => {
            // Reset all goals
            setCompletedGoals([]);
            localStorage.removeItem('completedHealthGoals');
            toast({
              title: "Goals Reset",
              description: "All goals have been reset to incomplete status.",
            });
          }}>
            Reset Goals
          </Button>
          
          <Button onClick={onComplete} size="lg">
            Continue to Dashboard
          </Button>
        </div>

        {/* Health Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Health Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Daily Habits:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Drink 8-10 glasses of water daily</li>
                  <li>• Get 7-9 hours of quality sleep</li>
                  <li>• Take regular breaks from screen time</li>
                  <li>• Practice deep breathing exercises</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preventive Measures:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Maintain good hand hygiene</li>
                  <li>• Follow vaccination schedules</li>
                  <li>• Regular health checkups</li>
                  <li>• Stay physically active</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}