import { NoteEditor } from "../NoteEditor";

export default function NoteEditorExample() {
  const sampleNote = {
    id: "1",
    title: "React Hooks Guide",
    content: "<h1>Introduction to React Hooks</h1><p>React Hooks are a <strong>powerful feature</strong> that let you use state and other React features without writing a class.</p><ul><li>useState for state management</li><li>useEffect for side effects</li><li>Custom hooks for reusable logic</li></ul>",
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
