import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";
import type { Flashcard } from "@shared/schema";

interface FlashcardViewProps {
  flashcard: Flashcard;
  onRate?: (difficulty: 'easy' | 'good' | 'hard' | 'again') => void;
}

export function FlashcardView({ flashcard, onRate }: FlashcardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleRate = (difficulty: 'easy' | 'good' | 'hard' | 'again') => {
    onRate?.(difficulty);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{flashcard.subject}</Badge>
          {flashcard.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFlipped(!isFlipped)}
          data-testid="button-flip-card"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <Card
        className="min-h-[300px] p-8 cursor-pointer hover-elevate active-elevate-2"
        onClick={() => setIsFlipped(!isFlipped)}
        data-testid="card-flashcard"
        style={{
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div 
          className="flex items-center justify-center h-full min-h-[250px]"
          style={{
            transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)',
          }}
        >
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-4">
              {isFlipped ? 'ANSWER' : 'QUESTION'}
            </p>
            <p className="text-lg text-foreground whitespace-pre-wrap">
              {isFlipped ? flashcard.back : flashcard.front}
            </p>
          </div>
        </div>
      </Card>

      {isFlipped && (
        <div className="mt-6 grid grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={() => handleRate('again')}
            className="text-destructive border-destructive/50"
            data-testid="button-rate-again"
          >
            Again
          </Button>
          <Button
            variant="outline"
            onClick={() => handleRate('hard')}
            className="text-chart-4 border-chart-4/50"
            data-testid="button-rate-hard"
          >
            Hard
          </Button>
          <Button
            variant="outline"
            onClick={() => handleRate('good')}
            className="text-chart-2 border-chart-2/50"
            data-testid="button-rate-good"
          >
            Good
          </Button>
          <Button
            variant="outline"
            onClick={() => handleRate('easy')}
            className="text-chart-3 border-chart-3/50"
            data-testid="button-rate-easy"
          >
            Easy
          </Button>
        </div>
      )}
    </div>
  );
}
