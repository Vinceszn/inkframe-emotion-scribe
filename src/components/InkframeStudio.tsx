import { useEffect } from 'react';
import { useInkframeStore } from '@/store/inkframe-store';
import { loadMemoryData } from '@/utils/memory-loader';
import { SceneComposer } from './SceneComposer';
import { FeedbackPanel } from './FeedbackPanel';
import { EmotionTracker } from './EmotionTracker';
import { CharacterPanel } from './CharacterPanel';
import { ExportSystem } from './ExportSystem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Feather, Brain, Activity, Users, Download } from 'lucide-react';

export function InkframeStudio() {
  const { loadMemoryData: storeLoadMemoryData } = useInkframeStore();

  // Load memory data on component mount
  useEffect(() => {
    const { characters, themes } = loadMemoryData();
    storeLoadMemoryData(characters, themes);
  }, [storeLoadMemoryData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Feather className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="studio-heading text-2xl">Inkframe</h1>
                <p className="text-xs text-muted-foreground">Emotionally Intelligent Co-Authoring Suite</p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Sprint 1 MVP • Studio Environment
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Layout */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Left Sidebar - Character & Theme Memory */}
          <div className="col-span-3">
            <div className="sticky top-6 max-h-[calc(100vh-180px)] overflow-y-auto">
              <CharacterPanel />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-6">
            <Tabs defaultValue="compose" className="h-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-card/50 border border-border/50">
                <TabsTrigger 
                  value="compose" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Feather className="h-4 w-4" />
                  Compose
                </TabsTrigger>
                <TabsTrigger 
                  value="feedback" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Brain className="h-4 w-4" />
                  Feedback
                </TabsTrigger>
                <TabsTrigger 
                  value="emotions" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Activity className="h-4 w-4" />
                  Emotions
                </TabsTrigger>
              </TabsList>

              <div className="h-[calc(100%-60px)] overflow-y-auto">
                <TabsContent value="compose" className="mt-0 h-full">
                  <SceneComposer />
                </TabsContent>

                <TabsContent value="feedback" className="mt-0 h-full">
                  <FeedbackPanel />
                </TabsContent>

                <TabsContent value="emotions" className="mt-0 h-full">
                  <EmotionTracker />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Sidebar - Export & Tools */}
          <div className="col-span-3">
            <div className="sticky top-6 space-y-6">
              <ExportSystem />
              
              {/* Quick Stats */}
              <Card className="studio-panel p-4">
                <h3 className="font-medium text-sm mb-3 text-muted-foreground">Session Overview</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Characters Available:</span>
                    <span className="font-mono">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Theme Library:</span>
                    <span className="font-mono">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Studio Version:</span>
                    <span className="font-mono">1.0</span>
                  </div>
                </div>
              </Card>

              {/* Studio Tips */}
              <Card className="studio-panel p-4">
                <h3 className="font-medium text-sm mb-3 text-accent">Pro Tips</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• Select multiple characters for complex scenes</p>
                  <p>• Use specific themes to guide AI generation</p>
                  <p>• Analyze emotions after each scene</p>
                  <p>• Export bundles for external review</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}