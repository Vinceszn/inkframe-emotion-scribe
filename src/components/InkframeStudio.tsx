import { useEffect, useState } from 'react';
import { useInkframeStore } from '@/store/inkframe-store';
import { loadMemoryData } from '@/utils/memory-loader';
import { SceneComposer } from './SceneComposer';
import { FeedbackPanel } from './FeedbackPanel';
import { EmotionTracker } from './EmotionTracker';
import { CharacterPanel } from './CharacterPanel';
import { ExportSystem } from './ExportSystem';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Card } from '@/components/ui/card';
import { Feather } from 'lucide-react';

export function InkframeStudio() {
  const { loadMemoryData: storeLoadMemoryData } = useInkframeStore();
  const [activeSection, setActiveSection] = useState('compose');

  // Load memory data on component mount
  useEffect(() => {
    const { characters, themes } = loadMemoryData();
    storeLoadMemoryData(characters, themes);
  }, [storeLoadMemoryData]);

  const renderMainContent = () => {
    switch (activeSection) {
      case 'compose':
        return <SceneComposer />;
      case 'feedback':
        return <FeedbackPanel />;
      case 'emotions':
        return <EmotionTracker />;
      case 'characters':
        return <CharacterPanel />;
      case 'export':
        return <ExportSystem />;
      default:
        return <SceneComposer />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border bg-card">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <Feather className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="writer-heading text-xl">Inkframe</h1>
                  <p className="text-xs text-muted-foreground">AI Co-Authoring Suite</p>
                </div>
              </div>
              
              <div className="ml-auto text-xs text-muted-foreground">
                Sprint 1 MVP
              </div>
            </div>
          </header>

          {/* Main Content Area - Horizontal Layout */}
          <div className="flex-1 grid grid-cols-12 gap-6 p-6">
            {/* Left Summary Panel */}
            <div className="col-span-3 space-y-4">
              <Card className="writer-panel p-4">
                <h3 className="writer-heading text-sm mb-3">Quick Stats</h3>
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
                    <span>Active Section:</span>
                    <span className="font-mono capitalize">{activeSection}</span>
                  </div>
                </div>
              </Card>

              <Card className="writer-panel p-4">
                <h3 className="writer-heading text-sm mb-3">Navigation</h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Use sidebar to switch tools</p>
                  <p>• Scene editing available in compose mode</p>
                  <p>• Export bundles from export section</p>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="col-span-6">
              <div className="writer-panel p-6 min-h-[600px]">
                {renderMainContent()}
              </div>
            </div>

            {/* Right Summary Panel */}
            <div className="col-span-3 space-y-4">
              {activeSection === 'compose' && (
                <>
                  <Card className="writer-panel p-4">
                    <h3 className="writer-heading text-sm mb-3">Scene Status</h3>
                    <div className="text-xs text-muted-foreground">
                      Ready to generate new scenes or edit existing ones.
                    </div>
                  </Card>
                  
                  <Card className="writer-panel p-4">
                    <h3 className="writer-heading text-sm mb-3">Tips</h3>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>• Be specific in your prompts</p>
                      <p>• Select relevant characters</p>
                      <p>• Choose matching themes</p>
                    </div>
                  </Card>
                </>
              )}
              
              {activeSection === 'feedback' && (
                <Card className="writer-panel p-4">
                  <h3 className="writer-heading text-sm mb-3">Analysis Ready</h3>
                  <div className="text-xs text-muted-foreground">
                    Generate feedback on your scenes to improve writing quality.
                  </div>
                </Card>
              )}
              
              {activeSection === 'emotions' && (
                <Card className="writer-panel p-4">
                  <h3 className="writer-heading text-sm mb-3">Emotion Tracking</h3>
                  <div className="text-xs text-muted-foreground">
                    Visualize the emotional arc of your scenes.
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}