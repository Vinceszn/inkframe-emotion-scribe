import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useInkframeStore } from '@/store/inkframe-store';
import { Download, FileText, Image, Database, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function ExportSystem() {
  const { currentScene } = useInkframeStore();
  const [isExporting, setIsExporting] = useState(false);

  const exportStoryBundle = async () => {
    if (!currentScene) return;
    
    setIsExporting(true);
    
    try {
      const zip = new JSZip();
      
      // 1. Scene text file
      zip.file('scene.txt', currentScene.generatedText);
      
      // 2. Feedback JSON
      const feedbackData = {
        latestFeedback: currentScene.feedbackHistory[currentScene.feedbackHistory.length - 1] || null,
        feedbackHistory: currentScene.feedbackHistory,
        sceneMetadata: {
          id: currentScene.id,
          prompt: currentScene.prompt,
          genre: currentScene.genre,
          tone: currentScene.tone,
          sceneType: currentScene.sceneType,
          selectedCharacters: currentScene.selectedCharacters,
          selectedThemes: currentScene.selectedThemes,
          timestamp: currentScene.timestamp
        }
      };
      zip.file('feedback.json', JSON.stringify(feedbackData, null, 2));
      
      // 3. Emotion data CSV
      if (currentScene.emotionData.length > 0) {
        const emotionCsv = [
          'Position,EmotionValue,Sentence',
          ...currentScene.emotionData.map(point => 
            `${point.position},${point.value},"${point.sentence.replace(/"/g, '""')}"`
          )
        ].join('\n');
        zip.file('emotion_data.csv', emotionCsv);
      }
      
      // 4. Meta score summary
      const latestFeedback = currentScene.feedbackHistory[currentScene.feedbackHistory.length - 1];
      let metaScore = 'No feedback analysis available yet.';
      
      if (latestFeedback) {
        const overallScore = (
          latestFeedback.scores.coherence +
          latestFeedback.scores.dialogue +
          latestFeedback.scores.emotionalResonance +
          latestFeedback.scores.symbolism
        ) / 4;
        
        metaScore = `INKFRAME SCENE ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

SCENE METADATA
==============
Title: ${currentScene.id}
Prompt: ${currentScene.prompt}
Genre: ${currentScene.genre || 'Not specified'}
Tone: ${currentScene.tone || 'Not specified'}
Scene Type: ${currentScene.sceneType || 'Not specified'}
Created: ${currentScene.timestamp.toLocaleString()}

FEEDBACK SCORES
===============
Coherence: ${latestFeedback.scores.coherence}/10
Dialogue: ${latestFeedback.scores.dialogue}/10
Emotional Resonance: ${latestFeedback.scores.emotionalResonance}/10
Symbolism: ${latestFeedback.scores.symbolism}/10

OVERALL SCORE: ${overallScore.toFixed(1)}/10

SUGGESTIONS
===========
${latestFeedback.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

EMOTIONAL ANALYSIS
==================
${currentScene.emotionData.length > 0 ? 
  `Emotion data points: ${currentScene.emotionData.length}
Average emotion: ${(currentScene.emotionData.reduce((sum, p) => sum + p.value, 0) / currentScene.emotionData.length).toFixed(2)}
Peak positive: ${Math.max(...currentScene.emotionData.map(p => p.value)).toFixed(2)}
Peak negative: ${Math.min(...currentScene.emotionData.map(p => p.value)).toFixed(2)}` : 
  'Emotion analysis not yet performed'
}`;
      }
      
      zip.file('meta_score.txt', metaScore);
      
      // Generate and download zip
      const blob = await zip.generateAsync({ type: 'blob' });
      const filename = `inkframe_${currentScene.id}_${new Date().toISOString().split('T')[0]}.zip`;
      saveAs(blob, filename);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportFiles = [
    {
      name: 'scene.txt',
      icon: FileText,
      description: 'Raw scene text content'
    },
    {
      name: 'feedback.json',
      icon: Database,
      description: 'AI feedback and analysis data'
    },
    {
      name: 'emotion_data.csv',
      icon: Image,
      description: 'Emotional arc data points'
    },
    {
      name: 'meta_score.txt',
      icon: FileText,
      description: 'Summary report with scores'
    }
  ];

  return (
    <Card className="studio-panel p-6">
      <h2 className="studio-heading text-xl mb-4">Export Story Bundle</h2>
      
      {!currentScene && (
        <div className="text-center py-8 text-muted-foreground">
          <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Generate a scene to enable export functionality</p>
        </div>
      )}

      {currentScene && (
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Export your complete Inkframe session as a ZIP bundle containing all scene data, feedback analysis, and emotional insights.
          </div>

          {/* Export Preview */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Bundle Contents:</h3>
            <div className="grid grid-cols-2 gap-3">
              {exportFiles.map(file => {
                const Icon = file.icon;
                return (
                  <div key={file.name} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border/30">
                    <Icon className="h-4 w-4 text-accent" />
                    <div>
                      <div className="font-mono text-xs font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{file.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export Stats */}
          <Card className="p-4 bg-muted/10 border-border/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-accent">
                  {currentScene.generatedText.split(' ').length}
                </div>
                <div className="text-xs text-muted-foreground">Words</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent">
                  {currentScene.feedbackHistory.length}
                </div>
                <div className="text-xs text-muted-foreground">Feedback Rounds</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent">
                  {currentScene.emotionData.length}
                </div>
                <div className="text-xs text-muted-foreground">Emotion Points</div>
              </div>
            </div>
          </Card>

          {/* Export Button */}
          <Button
            onClick={exportStoryBundle}
            disabled={isExporting}
            className="w-full studio-button"
            style={{ background: 'var(--gradient-primary)' }}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Bundle...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Story Bundle
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Files will be downloaded as: inkframe_{currentScene.id}_{new Date().toISOString().split('T')[0]}.zip
          </div>
        </div>
      )}
    </Card>
  );
}