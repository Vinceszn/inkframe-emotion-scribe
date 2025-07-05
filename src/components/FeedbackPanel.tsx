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
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="writer-heading text-xl">CritPartner Feedback</h2>
          <Button
            onClick={generateFeedback}
            disabled={!currentScene || isAnalyzing}
            className="writer-button bg-primary text-primary-foreground hover:bg-primary/90"
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

        {latestFeedback && (
          <div className="space-y-6 animate-fade-in">
            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-4">
              {feedbackCategories.map(category => {
                const score = latestFeedback.scores[category.key];
                const Icon = category.icon;
                
                return (
                  <Card key={category.key} className="p-4 bg-muted/20 border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="h-5 w-5 text-accent" />
                      <div>
                        <h3 className="font-medium text-sm">{category.label}</h3>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Progress value={score * 10} className="flex-1" />
                      <span className={`font-bold text-lg ${getScoreColor(score)}`}>
                        {score}/10
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

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
                    className="p-3 bg-muted/20 rounded-lg text-sm border border-border"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}