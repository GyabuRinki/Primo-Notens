import { TestTaker } from "../TestTaker";

export default function TestTakerExample() {
  const sampleTest = {
    id: "1",
    title: "JavaScript Fundamentals Quiz",
    description: "Test your knowledge of JavaScript basics",
    subject: "Programming",
    timeLimit: 30,
    questions: [
      {
        id: "q1",
        type: "multiple-choice" as const,
        question: "What is a closure in JavaScript?",
        options: [
          "A function that returns another function",
          "A function bundled with its lexical environment",
          "A way to create private variables",
          "All of the above"
        ],
        correctAnswer: "All of the above",
        explanation: "Closures encompass all these concepts in JavaScript.",
        subject: "Programming",
        tags: ["JavaScript"],
      },
      {
        id: "q2",
        type: "true-false" as const,
        question: "JavaScript is a statically typed language",
        correctAnswer: "False",
        explanation: "JavaScript is dynamically typed.",
        subject: "Programming",
        tags: ["JavaScript"],
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return (
    <TestTaker
      test={sampleTest}
      onComplete={() => console.log('Test completed')}
    />
  );
}
