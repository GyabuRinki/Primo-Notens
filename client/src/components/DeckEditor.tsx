import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import type { Deck } from "@shared/schema";

interface DeckEditorProps {
  deck: Deck | null;
  onSave: (deck: Deck) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function DeckEditor({ deck, onSave, onCancel, onDelete }: DeckEditorProps) {
  const [name, setName] = useState(deck?.name || "");
  const [description, setDescription] = useState(deck?.description || "");
  const [subject, setSubject] = useState(deck?.subject || "");

  const handleSave = () => {
    if (!name.trim()) {
      alert("Deck name is required!");
      return;
    }

    const savedDeck: Deck = {
      id: deck?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      subject: subject.trim() || "General",
      createdAt: deck?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    onSave(savedDeck);
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
            <Button variant="outline" onClick={onDelete} data-testid="button-delete-deck">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button onClick={handleSave} data-testid="button-save-deck">
            <Save className="h-4 w-4 mr-2" />
            Save Deck
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Deck Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Biology Chapter 1"
              className="mt-2"
              data-testid="input-deck-name"
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Biology, Mathematics, History"
              className="mt-2"
              data-testid="input-deck-subject"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this deck about?"
              className="mt-2"
              data-testid="textarea-deck-description"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
