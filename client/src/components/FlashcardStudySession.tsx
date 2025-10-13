import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { FlashcardView } from "./FlashcardView";
import type { Flashcard } from "@shared/schema";

interface FlashcardStudySessionProps {
  flashcards: Flashcard[];
  onComplete: (updatedCards: Flashcard[]) => void;
  onExit: () => void;
}

export function FlashcardStudySession({ flashcards, onComplete, onExit }: FlashcardStudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updatedCards, setUpdatedCards] = useState<Flashcard[]>(flashcards);

  const currentCard = updatedCards[currentIndex];
  const progress = ((currentIndex + 1) / updatedCards.length) * 100;

  const handleRate = (difficulty: 'easy' | 'good' | 'hard' | 'again') => {
    const updated = [...updatedCards];
    const card = updated[currentIndex];
    
    card.reviewCount = (card.reviewCount || 0) + 1;
    card.difficulty = difficulty;
    
    const intervals = {
      easy: 7 * 24 * 60 * 60 * 1000,
      good: 3 * 24 * 60 * 60 * 1000,
      hard: 1 * 24 * 60 * 60 * 1000,
      again: 10 * 60 * 1000,
    };
    
    card.nextReview = Date.now() + intervals[difficulty];
    
    setUpdatedCards(updated);

    if (currentIndex < updatedCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(updated);
      onExit();
    }
  };

  const handleExit = () => {
    onComplete(updatedCards);
    onExit();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={handleExit} data-testid="button-exit-study">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Study Session
          </Button>
          <span className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {updatedCards.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <FlashcardView flashcard={currentCard} onRate={handleRate} />
    </div>
  );
}
