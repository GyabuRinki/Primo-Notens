import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2, X, Plus } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import type { Note } from "@shared/schema";

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function NoteEditor({ note, onSave, onCancel, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [subject, setSubject] = useState(note?.subject || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
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
    const savedNote: Note = {
      id: note?.id || crypto.randomUUID(),
      title: title.trim() || "Untitled Note",
      content,
      subject: subject.trim() || "General",
      tags,
      createdAt: note?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    onSave(savedNote);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <Button variant="ghost" onClick={onCancel} data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {onDelete && (
            <Button variant="outline" onClick={onDelete} data-testid="button-delete-note">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button onClick={handleSave} data-testid="button-save-note">
            <Save className="h-4 w-4 mr-2" />
            Save Note
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="text-lg font-medium mt-2"
              data-testid="input-note-title"
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, History, etc."
              className="mt-2"
              data-testid="input-note-subject"
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

          <div>
            <Label htmlFor="content">Content</Label>
            <div className="mt-2">
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing your notes with rich formatting..."
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
