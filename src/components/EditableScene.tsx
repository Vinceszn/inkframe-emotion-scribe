import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { SceneData } from '@/store/inkframe-store';
import { Edit3, Check, X, RotateCcw } from 'lucide-react';

interface EditableSceneProps {
  scene: SceneData;
  onSceneUpdate: (updatedText: string) => void;
}

export function EditableScene({ scene, onSceneUpdate }: EditableSceneProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(scene.generatedText);
  const [originalText] = useState(scene.generatedText);

  const handleStartEditing = () => {
    setEditedText(scene.generatedText);
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    onSceneUpdate(editedText);
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setEditedText(scene.generatedText);
    setIsEditing(false);
  };

  const handleRevertToOriginal = () => {
    setEditedText(originalText);
    onSceneUpdate(originalText);
    setIsEditing(false);
  };

  const hasChanges = editedText !== scene.generatedText;
  const hasRevertableChanges = scene.generatedText !== originalText;

  return (
    <Card className="writer-panel p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="writer-heading text-lg">Generated Scene</h3>
        <div className="flex items-center gap-2">
          {hasRevertableChanges && !isEditing && (
            <Button
              onClick={handleRevertToOriginal}
              variant="outline"
              size="sm"
              className="writer-button"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Revert
            </Button>
          )}
          
          {!isEditing ? (
            <Button
              onClick={handleStartEditing}
              variant="outline"
              size="sm"
              className="writer-button"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSaveChanges}
                size="sm"
                className="writer-button bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!hasChanges}
              >
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleCancelEditing}
                variant="outline"
                size="sm"
                className="writer-button"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="min-h-[300px] bg-input border-border focus-visible:ring-ring resize-none text-base font-mono leading-relaxed"
            placeholder="Edit your scene..."
          />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {editedText.split(' ').length} words • {editedText.length} characters
            </span>
            {hasChanges && (
              <span className="text-accent">• Unsaved changes</span>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-muted/30 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap border border-border hover:bg-muted/40 transition-colors cursor-text">
            {scene.generatedText}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Generated: {scene.timestamp.toLocaleTimeString()}</span>
            {scene.genre && <span>• {scene.genre}</span>}
            {scene.tone && <span>• {scene.tone}</span>}
            {scene.sceneType && <span>• {scene.sceneType}</span>}
            {hasRevertableChanges && (
              <span className="text-warning">• Modified from original</span>
            )}
          </div>
        </>
      )}
    </Card>
  );
}