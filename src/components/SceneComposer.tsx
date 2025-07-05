import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useInkframeStore, SceneData } from '@/store/inkframe-store';
import { Loader2, Wand2, RefreshCw } from 'lucide-react';

const genres = ['Drama', 'Thriller', 'Romance', 'Mystery', 'Sci-Fi', 'Fantasy', 'Horror'];
const tones = ['Dark', 'Hopeful', 'Melancholic', 'Tense', 'Intimate', 'Mysterious', 'Energetic'];
const sceneTypes = ['Dialogue', 'Action', 'Introspection', 'Confrontation', 'Discovery', 'Memory'];

export function SceneComposer() {
  const {
    currentScene,
    characters,
    themes,
    isGenerating,
    setCurrentScene,
    setIsGenerating
  } = useInkframeStore();

  const [prompt, setPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedSceneType, setSelectedSceneType] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const toggleCharacter = (characterId: string) => {
    setSelectedCharacters(prev => 
      prev.includes(characterId) 
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  const toggleTheme = (themeId: string) => {
    setSelectedThemes(prev => 
      prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  const generateScene = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual OpenAI API call)
    setTimeout(() => {
      const selectedChars = characters.filter(c => selectedCharacters.includes(c.id));
      const selectedThemeList = themes.filter(t => selectedThemes.includes(t.id));
      
      const mockScene = `The room fell silent as ${selectedChars[0]?.name || 'the protagonist'} entered. The air thick with tension, shadows dancing across worn wooden floors. 

"I know what you did," came the whispered accusation, barely audible yet cutting through the silence like a blade.

${selectedChars[0]?.name || 'The protagonist'} stood frozen, heart hammering against ribs, mind racing through possibilities. This was the moment everything would change—the precipice between before and after.

The accusation hung in the air, demanding an answer that might shatter everything carefully built over years of careful deception.`;

      const newScene: SceneData = {
        id: `scene-${Date.now()}`,
        prompt,
        generatedText: mockScene,
        selectedCharacters,
        selectedThemes,
        genre: selectedGenre,
        tone: selectedTone,
        sceneType: selectedSceneType,
        timestamp: new Date(),
        emotionData: [],
        feedbackHistory: []
      };
      
      setCurrentScene(newScene);
      setIsGenerating(false);
    }, 2000);
  };

  const regenerateScene = () => {
    if (currentScene) {
      generateScene();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="writer-heading text-xl mb-4">Scene Composer</h2>
        
        {/* Prompt Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Scene Prompt
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the scene you want to create... (e.g., 'A tense confrontation between two characters who share a dark secret')"
              className="min-h-[100px] bg-input border-border focus-visible:ring-ring resize-none text-base"
            />
          </div>

          {/* Scene Parameters */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Tone</label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {tones.map(tone => (
                    <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Scene Type</label>
              <Select value={selectedSceneType} onValueChange={setSelectedSceneType}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {sceneTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Character Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Characters
            </label>
            <div className="flex flex-wrap gap-2">
              {characters.map(character => (
                <Badge
                  key={character.id}
                  variant={selectedCharacters.includes(character.id) ? 'default' : 'outline'}
                  className="cursor-pointer writer-button hover:shadow-sm"
                  onClick={() => toggleCharacter(character.id)}
                >
                  {character.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Themes
            </label>
            <div className="flex flex-wrap gap-2">
              {themes.map(theme => (
                <Badge
                  key={theme.id}
                  variant={selectedThemes.includes(theme.id) ? 'secondary' : 'outline'}
                  className="cursor-pointer writer-button hover:shadow-sm"
                  onClick={() => toggleTheme(theme.id)}
                >
                  {theme.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateScene}
            disabled={!prompt.trim() || isGenerating}
            className="w-full writer-button bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Scene...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Scene
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Scene Display */}
      {currentScene && (
        <div className="writer-panel p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="writer-heading text-lg">Generated Scene</h3>
            <Button
              onClick={regenerateScene}
              variant="outline"
              size="sm"
              className="writer-button"
              disabled={isGenerating}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap border border-border">
            {currentScene.generatedText}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Generated: {currentScene.timestamp.toLocaleTimeString()}</span>
            {currentScene.genre && <span>• {currentScene.genre}</span>}
            {currentScene.tone && <span>• {currentScene.tone}</span>}
            {currentScene.sceneType && <span>• {currentScene.sceneType}</span>}
          </div>
        </div>
      )}
    </div>
  );
}