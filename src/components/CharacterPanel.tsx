import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInkframeStore } from '@/store/inkframe-store';
import { User, Users, Scroll } from 'lucide-react';

export function CharacterPanel() {
  const { characters, themes } = useInkframeStore();

  return (
    <div className="space-y-6">
      {/* Characters */}
      <div className="writer-panel p-6">
        <h2 className="writer-heading text-lg mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          Character Memory
        </h2>
        
        <div className="space-y-4">
          {characters.map(character => (
            <Card key={character.id} className="p-4 bg-muted/20 border-border">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1">{character.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{character.description}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-accent">Arc:</span>
                      <p className="text-xs text-muted-foreground">{character.arc}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-accent">Tone:</span>
                      <p className="text-xs text-muted-foreground">{character.tone}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-accent">Background:</span>
                      <p className="text-xs text-muted-foreground">{character.background}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {character.traits.map(trait => (
                        <Badge 
                          key={trait} 
                          variant="outline" 
                          className="text-xs px-2 py-0 h-5"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Themes */}
      <div className="writer-panel p-6">
        <h2 className="writer-heading text-lg mb-4 flex items-center gap-2">
          <Scroll className="h-5 w-5 text-accent" />
          Theme Library
        </h2>
        
        <div className="space-y-3">
          {themes.map(theme => (
            <Card key={theme.id} className="p-3 bg-muted/20 border-border">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1">{theme.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{theme.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {theme.keywords.map(keyword => (
                      <Badge 
                        key={keyword} 
                        variant="outline" 
                        className="text-xs px-2 py-0 h-5 border-accent/30"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}