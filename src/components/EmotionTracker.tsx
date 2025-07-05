import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInkframeStore, EmotionPoint } from '@/store/inkframe-store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border/50 rounded-lg p-3 shadow-lg backdrop-blur-sm">
        <p className="text-xs text-muted-foreground mb-1">Position: {label}%</p>
        <p className="text-sm font-medium mb-2">
          Emotion: <span className={`font-bold ${
            data.value > 0.3 ? 'text-success' : 
            data.value < -0.3 ? 'text-destructive' : 
            'text-warning'
          }`}>
            {data.value > 0.3 ? 'Positive' : data.value < -0.3 ? 'Negative' : 'Neutral'}
          </span>
        </p>
        <p className="text-xs text-foreground/80 max-w-xs">"{data.sentence}"</p>
      </div>
    );
  }
  return null;
};

export function EmotionTracker() {
  const {
    currentScene,
    updateEmotionData
  } = useInkframeStore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotionSummary, setEmotionSummary] = useState<{
    trend: 'rising' | 'falling' | 'stable';
    avgEmotion: number;
    peakEmotion: number;
    lowEmotion: number;
  } | null>(null);

  const analyzeEmotions = async () => {
    if (!currentScene) return;
    
    setIsAnalyzing(true);
    
    // Simulate emotion analysis (replace with actual sentiment analysis)
    setTimeout(() => {
      const sentences = currentScene.generatedText.split(/[.!?]+/).filter(s => s.trim());
      const emotionData: EmotionPoint[] = sentences.map((sentence, index) => {
        // Simulate emotion scoring based on keywords and sentence structure
        let emotionValue = 0;
        
        // Positive words
        if (/hope|joy|love|peace|beautiful|wonderful|amazing|success|victory|triumph/.test(sentence.toLowerCase())) {
          emotionValue += 0.6;
        }
        
        // Negative words
        if (/fear|terror|death|pain|sorrow|hate|anger|despair|failure|darkness/.test(sentence.toLowerCase())) {
          emotionValue -= 0.7;
        }
        
        // Tension words
        if (/tension|silence|whisper|shadow|frozen|heart hammering|precipice/.test(sentence.toLowerCase())) {
          emotionValue -= 0.4;
        }
        
        // Mystery/intrigue
        if (/secret|mystery|hidden|whispered|accusation/.test(sentence.toLowerCase())) {
          emotionValue -= 0.3;
        }
        
        // Add some variation and normalization
        emotionValue += (Math.random() - 0.5) * 0.3;
        emotionValue = Math.max(-1, Math.min(1, emotionValue));
        
        return {
          position: Math.round((index / (sentences.length - 1)) * 100),
          value: emotionValue,
          sentence: sentence.trim()
        };
      });
      
      updateEmotionData(emotionData);
      
      // Calculate summary stats
      if (emotionData.length > 0) {
        const avgEmotion = emotionData.reduce((sum, point) => sum + point.value, 0) / emotionData.length;
        const peakEmotion = Math.max(...emotionData.map(p => p.value));
        const lowEmotion = Math.min(...emotionData.map(p => p.value));
        
        // Determine trend
        const firstHalf = emotionData.slice(0, Math.floor(emotionData.length / 2));
        const secondHalf = emotionData.slice(Math.floor(emotionData.length / 2));
        const firstAvg = firstHalf.reduce((sum, point) => sum + point.value, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, point) => sum + point.value, 0) / secondHalf.length;
        
        const trend = secondAvg > firstAvg + 0.1 ? 'rising' : 
                     secondAvg < firstAvg - 0.1 ? 'falling' : 'stable';
        
        setEmotionSummary({
          trend,
          avgEmotion,
          peakEmotion,
          lowEmotion
        });
      }
      
      setIsAnalyzing(false);
    }, 2500);
  };

  // Auto-analyze when scene changes
  useEffect(() => {
    if (currentScene && !currentScene.emotionData.length) {
      analyzeEmotions();
    }
  }, [currentScene]);

  const emotionData = currentScene?.emotionData || [];

  return (
    <div className="space-y-6">
      <Card className="studio-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="studio-heading text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Pulseboard
          </h2>
          
          <Button
            onClick={analyzeEmotions}
            disabled={!currentScene || isAnalyzing}
            variant="outline"
            size="sm"
            className="studio-button"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                Re-analyze
              </>
            )}
          </Button>
        </div>

        {!currentScene && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Generate a scene to see its emotional arc</p>
          </div>
        )}

        {currentScene && isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-studio-pulse">
              <Activity className="h-12 w-12 mx-auto mb-4 text-accent" />
            </div>
            <p className="text-muted-foreground">Analyzing emotional resonance...</p>
          </div>
        )}

        {currentScene && emotionData.length > 0 && (
          <div className="space-y-6 animate-studio-fade-in">
            {/* Emotion Graph */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emotionData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border))" 
                    opacity={0.3}
                  />
                  <XAxis 
                    dataKey="position"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Scene Progress (%)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    domain={[-1, 1]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Emotion', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Emotion Summary */}
            {emotionSummary && (
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4 bg-muted/20 border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    {emotionSummary.trend === 'rising' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : emotionSummary.trend === 'falling' ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : (
                      <Minus className="h-4 w-4 text-warning" />
                    )}
                    <span className="text-sm font-medium">Trend</span>
                  </div>
                  <div className={`text-lg font-bold ${
                    emotionSummary.trend === 'rising' ? 'text-success' :
                    emotionSummary.trend === 'falling' ? 'text-destructive' :
                    'text-warning'
                  }`}>
                    {emotionSummary.trend === 'rising' ? 'Rising' :
                     emotionSummary.trend === 'falling' ? 'Falling' :
                     'Stable'}
                  </div>
                </Card>

                <Card className="p-4 bg-muted/20 border-border/30">
                  <div className="text-sm font-medium mb-2 text-muted-foreground">Average</div>
                  <div className={`text-lg font-bold ${
                    emotionSummary.avgEmotion > 0.1 ? 'text-success' :
                    emotionSummary.avgEmotion < -0.1 ? 'text-destructive' :
                    'text-warning'
                  }`}>
                    {emotionSummary.avgEmotion > 0.1 ? 'Positive' :
                     emotionSummary.avgEmotion < -0.1 ? 'Negative' :
                     'Neutral'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {emotionSummary.avgEmotion.toFixed(2)}
                  </div>
                </Card>

                <Card className="p-4 bg-muted/20 border-border/30">
                  <div className="text-sm font-medium mb-2 text-muted-foreground">Peak High</div>
                  <div className="text-lg font-bold text-success">
                    {emotionSummary.peakEmotion.toFixed(2)}
                  </div>
                </Card>

                <Card className="p-4 bg-muted/20 border-border/30">
                  <div className="text-sm font-medium mb-2 text-muted-foreground">Peak Low</div>
                  <div className="text-lg font-bold text-destructive">
                    {emotionSummary.lowEmotion.toFixed(2)}
                  </div>
                </Card>
              </div>
            )}

            {/* Emotion Labels */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span>Negative (-1.0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span>Neutral (0.0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span>Positive (+1.0)</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}