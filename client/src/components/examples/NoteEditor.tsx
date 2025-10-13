import { NoteEditor } from "../NoteEditor";

export default function NoteEditorExample() {
  const sampleNote = {
    id: "1",
    title: "React Hooks Guide",
    content: "# Introduction\n\nReact Hooks are a powerful feature...",
    subject: "Computer Science",
    tags: ["React", "JavaScript"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return (
    <NoteEditor
      note={sampleNote}
      onSave={(note) => console.log('Saved:', note)}
      onCancel={() => console.log('Cancelled')}
      onDelete={() => console.log('Deleted')}
    />
  );
}
