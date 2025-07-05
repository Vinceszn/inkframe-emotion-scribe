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
      {/* Clean Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Feather className="h-3 w-3 text-primary-foreground" />
              </div>
              <div>
                <h1 className="writer-heading text-xl">Inkframe</h1>
                <p className="text-xs text-muted-foreground">AI Co-Authoring Suite</p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Sprint 1 MVP
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Document-style Layout */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Primary Scene Composer - Top Priority */}
          <div className="writer-panel p-6">
            <SceneComposer />
          </div>

          {/* Secondary Tools - Tabbed Interface */}
          <div className="writer-panel">
            <Tabs defaultValue="feedback" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger 
                  value="feedback" 
                  className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground"
                >
                  <Brain className="h-4 w-4" />
                  Feedback
                </TabsTrigger>
                <TabsTrigger 
                  value="emotions" 
                  className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground"
                >
                  <Activity className="h-4 w-4" />
                  Emotions
                </TabsTrigger>
                <TabsTrigger 
                  value="export" 
                  className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground"
                >
                  <Download className="h-4 w-4" />
                  Export
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="feedback" className="mt-0">
                  <FeedbackPanel />
                </TabsContent>

                <TabsContent value="emotions" className="mt-0">
                  <EmotionTracker />
                </TabsContent>

                <TabsContent value="export" className="mt-0">
                  <ExportSystem />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Character Memory - Collapsible */}
          <div className="writer-panel p-6">
            <CharacterPanel />
          </div>
        </div>
      </div>
    </div>
  );
}