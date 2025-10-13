import { NoteCard } from "../NoteCard";

export default function NoteCardExample() {
  const sampleNote = {
    id: "1",
    title: "Introduction to React Hooks",
    content: "React Hooks are functions that let you use state and other React features without writing a class. The most common hooks are useState and useEffect...",
    subject: "Computer Science",
    tags: ["React", "JavaScript", "Frontend"],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
  };

  return (
    <div className="p-4 max-w-md">
      <NoteCard note={sampleNote} onClick={() => console.log('Note clicked')} />
    </div>
  );
}
