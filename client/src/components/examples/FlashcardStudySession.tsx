import { FlashcardStudySession } from "../FlashcardStudySession";

export default function FlashcardStudySessionExample() {
  const sampleCards = [
    {
      id: "1",
      front: "What is React?",
      back: "A JavaScript library for building user interfaces",
      subject: "Web Development",
      tags: ["React", "Frontend"],
      reviewCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "2",
      front: "What does JSX stand for?",
      back: "JavaScript XML",
      subject: "Web Development",
      tags: ["React", "JSX"],
      reviewCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  return (
    <FlashcardStudySession
      flashcards={sampleCards}
      onComplete={(cards) => console.log('Study session complete:', cards)}
      onExit={() => console.log('Exit clicked')}
    />
  );
}
