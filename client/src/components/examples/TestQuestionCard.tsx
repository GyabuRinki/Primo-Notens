import { useState } from "react";
import { TestQuestionCard } from "../TestQuestionCard";

export default function TestQuestionCardExample() {
  const [answer, setAnswer] = useState("");

  const sampleQuestion = {
    id: "1",
    type: "multiple-choice" as const,
    question: "Which data structure uses LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: "Stack",
    explanation: "A stack follows the LIFO principle where the last element added is the first one to be removed.",
    subject: "Data Structures",
    tags: ["Fundamentals"],
  };

  return (
    <div className="p-6 max-w-2xl">
      <TestQuestionCard
        question={sampleQuestion}
        questionNumber={1}
        selectedAnswer={answer}
        onAnswerChange={setAnswer}
      />
    </div>
  );
}
