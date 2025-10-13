import { FlashcardView } from "../FlashcardView";

export default function FlashcardViewExample() {
  const sampleFlashcard = {
    id: "1",
    front: "What is the time complexity of binary search?",
    back: "O(log n) - Binary search divides the search space in half with each iteration, making it logarithmic.",
    subject: "Algorithms",
    tags: ["Data Structures", "Complexity"],
    reviewCount: 5,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return (
    <div className="p-8">
      <FlashcardView 
        flashcard={sampleFlashcard}
        onRate={(difficulty) => console.log('Rated:', difficulty)}
      />
    </div>
  );
}
