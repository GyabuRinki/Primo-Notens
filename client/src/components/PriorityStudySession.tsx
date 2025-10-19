import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { FlashcardView } from "./FlashcardView";
import type { Flashcard } from "@shared/schema";

interface PriorityStudySessionProps {
  flashcards: Flashcard[];
  onComplete: (updatedCards: Flashcard[]) => void;
  onExit: () => void;
}

export function PriorityStudySession({ flashcards, onComplete, onExit }: PriorityStudySessionProps) {
  const sortedCards = [...flashcards].sort((a, b) => {
    const scoreA = a.difficultyScore ?? 0.5;
    const scoreB = b.difficultyScore ?? 0.5;
    return scoreB - scoreA;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [updatedCards, setUpdatedCards] = useState<Flashcard[]>(sortedCards);

  const currentCard = updatedCards[currentIndex];
  const progress = ((currentIndex + 1) / updatedCards.length) * 100;

  const handleRate = (difficulty: 'easy' | 'good' | 'hard' | 'again') => {
    const updated = [...updatedCards];
    const card = { ...updated[currentIndex] };
    
    card.reviewCount = (card.reviewCount || 0) + 1;
    
    const difficultyScoreMap = {
      'again': 1.0,
      'hard': 0.7,
      'good': 0.4,
      'easy': 0.1
    };
    
    const newRating = difficultyScoreMap[difficulty];
    const currentScore = card.difficultyScore ?? 0.5;
    
    const weight = 0.3;
    card.difficultyScore = currentScore * (1 - weight) + newRating * weight;
    
    card.difficultyScore = Math.max(0, Math.min(1, card.difficultyScore));
    
    let newInterval = card.interval || 0;
    let newEaseFactor = card.easeFactor || 2.5;
    
    if (difficulty === 'again') {
      newInterval = 0;
      newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
      card.nextReview = Date.now() + 10 * 60 * 1000;
    } else {
      const qualityMap = { hard: 3, good: 4, easy: 5 };
      const quality = qualityMap[difficulty];
      newEaseFactor = newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      newEaseFactor = Math.max(1.3, newEaseFactor);
      
      if (newInterval === 0) {
        newInterval = 1;
      } else if (newInterval === 1) {
        newInterval = difficulty === 'easy' ? 4 : 3;
      } else if (newInterval <= 4) {
        newInterval = difficulty === 'easy' ? 10 : 7;
      } else if (newInterval <= 10) {
        newInterval = difficulty === 'easy' ? 20 : 15;
      } else {
        const multiplier = difficulty === 'hard' ? 1.2 : (difficulty === 'easy' ? newEaseFactor * 1.3 : newEaseFactor);
        newInterval = Math.round(newInterval * multiplier);
        newInterval = Math.min(newInterval, 365);
      }
      
      card.nextReview = Date.now() + newInterval * 24 * 60 * 60 * 1000;
    }
    
    card.interval = newInterval;
    card.easeFactor = newEaseFactor;
    
    updated[currentIndex] = card;
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

      <FlashcardView 
        flashcard={currentCard} 
        onRate={handleRate}
        showDifficultyIndicator={true}
      />
    </div>
  );
}
