import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Upload } from "lucide-react";
import { NoteCard } from "@/components/NoteCard";
import { localStorageService } from "@/lib/localStorage";
import type { Note } from "@shared/schema";
import { NoteEditor } from "@/components/NoteEditor";
import { exportNotesToText, importNotesFromText, downloadTextFile, uploadTextFile } from "@/lib/importExport";
import { useToast } from "@/hooks/use-toast";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadedNotes = localStorageService.getNotes();
    setNotes(loadedNotes);
  }, []);

  const createNewNote = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  const handleSaveNote = (note: Note) => {
    const existingIndex = notes.findIndex(n => n.id === note.id);
    let updatedNotes: Note[];
    
    if (existingIndex >= 0) {
      updatedNotes = [...notes];
      updatedNotes[existingIndex] = note;
    } else {
      updatedNotes = [note, ...notes];
    }
    
    setNotes(updatedNotes);
    localStorageService.saveNotes(updatedNotes);
    setIsCreating(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    localStorageService.saveNotes(updatedNotes);
    setSelectedNote(null);
    setIsCreating(false);
  };

  const handleExportNotes = () => {
    if (notes.length === 0) {
      toast({
        title: "No notes to export",
        description: "Create some notes first before exporting.",
        variant: "destructive",
      });
      return;
    }

    const exportText = exportNotesToText(notes);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadTextFile(exportText, `notes_${timestamp}.txt`);
    
    toast({
      title: "Notes exported",
      description: `${notes.length} notes have been exported successfully.`,
    });
  };

  const handleImportNotes = async () => {
    try {
      const text = await uploadTextFile();
      const importedNotes = importNotesFromText(text);
      
      if (importedNotes.length === 0) {
        toast({
          title: "Import failed",
          description: "No valid notes found in the file.",
          variant: "destructive",
        });
        return;
      }

      const newNotes = importedNotes.map(note => ({
        ...note,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      
      const updatedNotes = [...newNotes, ...notes];
      
      setNotes(updatedNotes);
      localStorageService.saveNotes(updatedNotes);
      
      toast({
        title: "Notes imported",
        description: `${newNotes.length} notes have been imported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import notes",
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isCreating || selectedNote) {
    return (
      <NoteEditor
        note={selectedNote}
        onSave={handleSaveNote}
        onCancel={() => {
          setIsCreating(false);
          setSelectedNote(null);
        }}
        onDelete={selectedNote ? () => handleDeleteNote(selectedNote.id) : undefined}
      />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Notes</h1>
          <p className="text-muted-foreground">Organize your study materials</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={handleExportNotes} variant="outline" data-testid="button-export-notes">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleImportNotes} variant="outline" data-testid="button-import-notes">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={createNewNote} data-testid="button-create-note">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-notes"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No notes found matching your search." : "No notes yet. Create your first note to get started!"}
          </p>
          {!searchQuery && (
            <Button onClick={createNewNote} variant="outline" data-testid="button-create-first-note">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => setSelectedNote(note)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
