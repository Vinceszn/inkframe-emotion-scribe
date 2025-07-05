import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useInkframeStore, FeedbackRound, FeedbackScore } from '@/store/inkframe-store';
import { Brain, Loader2, MessageSquare, Heart, Sparkles } from 'lucide-react';

const feedbackCategories = [
  {
    key: 'coherence' as keyof FeedbackScore,
    label: 'Coherence',
    icon: Brain,
    description: 'Story logic and narrative flow'
  },
  {
    key: 'dialogue' as keyof FeedbackScore,
    label: 'Dialogue',
    icon: MessageSquare,
    description: 'Character voice and conversation'
  },
  {
    key: 'emotionalResonance' as keyof FeedbackScore,
    label: 'Emotional Resonance',
    icon: Heart,
    description: 'Emotional impact and depth'
  },
  {
    key: 'symbolism' as keyof FeedbackScore,
    label: 'Symbolism',
    icon: Sparkles,
    description: 'Metaphor and deeper meaning'
  }
];

export function FeedbackPanel() {
  const {
    currentScene,
    isAnalyzing,
    setIsAnalyzing,
    addFeedbackRound
  } = useInkframeStore();

  const [currentFeedback, setCurrentFeedback] = useState<FeedbackRound | null>(null);

  const generateFeedback = async () => {
    if (!currentScene) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI feedback analysis (replace with actual OpenAI API call)
    setTimeout(() => {
      // Generate realistic scores and feedback
      const scores: FeedbackScore = {
        coherence: Math.floor(Math.random() * 3) + 7, // 7-10
        dialogue: Math.floor(Math.random() * 4) + 6, // 6-9
        emotionalResonance: Math.floor(Math.random() * 2) + 8, // 8-9
        symbolism: Math.floor(Math.random() * 3) + 6, // 6-8
      };

      const suggestions = [
        "Consider adding more sensory details to ground the reader in the scene",
        "The dialogue feels authentic, but could benefit from more subtext",
        "Strong emotional core - the tension is palpable",
        "The symbolism of shadows and light could be developed further"
      ];

      const feedback: FeedbackRound = {
        id: `feedback-${Date.now()}`,
        timestamp: new Date(),
        scores,
        suggestions,
        sceneText: currentScene.generatedText
      };

      setCurrentFeedback(feedback);
      addFeedbackRound(feedback);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return 'bg-success';
    if (score >= 6) return 'bg-warning';
    return 'bg-destructive';
  };

  const latestFeedback = currentScene?.feedbackHistory[currentScene.feedbackHistory.length - 1] || currentFeedback;

  return (
    <div className="space-y-6">
      <Card className="studio-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="studio-heading text-xl">CritPartner Feedback</h2>
          <Button
            onClick={generateFeedback}
            disabled={!currentScene || isAnalyzing}
            className="studio-button"
            style={{ background: 'var(--gradient-accent)' }}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Get Feedback
              </>
            )}
          </Button>
        </div>

        {!currentScene && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Generate a scene first to receive AI feedback</p>
          </div>
        )}

        {currentScene && !latestFeedback && !isAnalyzing && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click "Get Feedback" to analyze your scene</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-studio-pulse">
              <Brain className="h-12 w-12 mx-auto mb-4 text-accent" />
            </div>
            <p className="text-muted-foreground">Analyzing scene structure and emotional depth...</p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="animate-studio-fade-in">Evaluating narrative coherence...</div>
              <div className="animate-studio-fade-in animation-delay-1000">Analyzing dialogue quality...</div>
              <div className="animate-studio-fade-in animation-delay-2000">Measuring emotional resonance...</div>
            </div>
          </div>
        )}

        {latestFeedback && (
          <div className="space-y-6 animate-studio-fade-in">
            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-4">
              {feedbackCategories.map(category => {
                const score = latestFeedback.scores[category.key];
                const Icon = category.icon;
                
                return (
                  <Card key={category.key} className="p-4 bg-muted/20 border-border/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="h-5 w-5 text-accent" />
                      <div>
                        <h3 className="font-medium text-sm">{category.label}</h3>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={score * 10} 
                        className="flex-1"
                        style={{
                          '--progress-background': score >= 8 ? 'hsl(var(--success))' : 
                                                 score >= 6 ? 'hsl(var(--warning))' : 
                                                 'hsl(var(--destructive))'
                        } as React.CSSProperties}
                      />
                      <span className={`font-bold text-lg ${getScoreColor(score)}`}>
                        {score}/10
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Overall Score */}
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-border/30">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">
                  {(Object.values(latestFeedback.scores).reduce((a, b) => a + b, 0) / 4).toFixed(1)}/10
                </div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
            </Card>

            {/* Suggestions */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Suggestions for Improvement
              </h3>
              <div className="space-y-2">
                {latestFeedback.suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-muted/20 rounded-lg text-sm border border-border/30"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback History */}
            {currentScene && currentScene.feedbackHistory.length > 1 && (
              <div>
                <h3 className="font-medium mb-3">Feedback History</h3>
                <div className="space-y-2">
                  {currentScene.feedbackHistory.slice(-3).reverse().map((feedback, index) => (
                    <Card key={feedback.id} className="p-3 bg-muted/10 border-border/20">
                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                        <span>Round {currentScene.feedbackHistory.length - index}</span>
                        <span>{feedback.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        {feedbackCategories.map(cat => (
                          <span key={cat.key} className="flex items-center gap-1">
                            <cat.icon className="h-3 w-3" />
                            {feedback.scores[cat.key]}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}