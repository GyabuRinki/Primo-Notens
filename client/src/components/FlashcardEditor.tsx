import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2, X, Plus } from "lucide-react";
import type { Flashcard } from "@shared/schema";

interface FlashcardEditorProps {
  flashcard: Flashcard | null;
  deckId: string;
  onSave: (flashcard: Flashcard) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function FlashcardEditor({ flashcard, deckId, onSave, onCancel, onDelete }: FlashcardEditorProps) {
  const [front, setFront] = useState(flashcard?.front || "");
  const [back, setBack] = useState(flashcard?.back || "");
  const [subject, setSubject] = useState(flashcard?.subject || "");
  const [tags, setTags] = useState<string[]>(flashcard?.tags || []);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!front.trim() || !back.trim()) {
      alert("Both front and back are required!");
      return;
    }

    const savedCard: Flashcard = {
      id: flashcard?.id || crypto.randomUUID(),
      deckId: flashcard?.deckId || deckId,
      front: front.trim(),
      back: back.trim(),
      subject: subject.trim() || "General",
      tags,
      interval: flashcard?.interval || 0,
      easeFactor: flashcard?.easeFactor || 2.5,
      reviewCount: flashcard?.reviewCount || 0,
      nextReview: flashcard?.nextReview,
      createdAt: flashcard?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    onSave(savedCard);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <Button variant="ghost" onClick={onCancel} data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {onDelete && (
            <Button variant="outline" onClick={onDelete} data-testid="button-delete-flashcard">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button onClick={handleSave} data-testid="button-save-flashcard">
            <Save className="h-4 w-4 mr-2" />
            Save Flashcard
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Label htmlFor="front" className="text-lg font-medium mb-4 block">Front (Question)</Label>
          <Textarea
            id="front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="What is the question?"
            className="min-h-[200px]"
            data-testid="textarea-flashcard-front"
          />
        </Card>

        <Card className="p-6">
          <Label htmlFor="back" className="text-lg font-medium mb-4 block">Back (Answer)</Label>
          <Textarea
            id="back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="What is the answer?"
            className="min-h-[200px]"
            data-testid="textarea-flashcard-back"
          />
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, History, etc."
              className="mt-2"
              data-testid="input-flashcard-subject"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag..."
                  className="w-32"
                  data-testid="input-new-tag"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleAddTag}
                  data-testid="button-add-tag"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
