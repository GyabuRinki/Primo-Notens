import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";
import type { Note } from "@shared/schema";

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  const previewText = note.content.substring(0, 150).replace(/<[^>]*>/g, '');
  const date = new Date(note.updatedAt).toLocaleDateString();

  return (
    <Card
      className="p-4 cursor-pointer hover-elevate active-elevate-2 transition-all"
      onClick={onClick}
      data-testid={`card-note-${note.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-primary/10">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1 truncate" data-testid={`text-note-title-${note.id}`}>
            {note.title || "Untitled Note"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {previewText}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {note.subject}
            </Badge>
            {note.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Clock className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
