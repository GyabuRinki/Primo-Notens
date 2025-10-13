import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localStorageService } from "@/lib/localStorage";
import type { Flashcard } from "@shared/schema";
import { FlashcardEditor } from "@/components/FlashcardEditor";
import { FlashcardStudySession } from "@/components/FlashcardStudySession";

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isStudying, setIsStudying] = useState(false);

  useEffect(() => {
    const loadedCards = localStorageService.getFlashcards();
    setFlashcards(loadedCards);
  }, []);

  const createNewCard = () => {
    setSelectedCard(null);
    setIsCreating(true);
  };

  const handleSaveCard = (card: Flashcard) => {
    const existingIndex = flashcards.findIndex(c => c.id === card.id);
    let updatedCards: Flashcard[];
    
    if (existingIndex >= 0) {
      updatedCards = [...flashcards];
      updatedCards[existingIndex] = card;
    } else {
      updatedCards = [card, ...flashcards];
    }
    
    setFlashcards(updatedCards);
    localStorageService.saveFlashcards(updatedCards);
    setIsCreating(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = flashcards.filter(c => c.id !== cardId);
    setFlashcards(updatedCards);
    localStorageService.saveFlashcards(updatedCards);
    setSelectedCard(null);
    setIsCreating(false);
  };

  const handleUpdateAfterStudy = (updatedCards: Flashcard[]) => {
    setFlashcards(updatedCards);
    localStorageService.saveFlashcards(updatedCards);
  };

  const filteredCards = flashcards.filter(card =>
    card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.back.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isStudying) {
    return (
      <FlashcardStudySession
        flashcards={flashcards}
        onComplete={handleUpdateAfterStudy}
        onExit={() => setIsStudying(false)}
      />
    );
  }

  if (isCreating || selectedCard) {
    return (
      <FlashcardEditor
        flashcard={selectedCard}
        onSave={handleSaveCard}
        onCancel={() => {
          setIsCreating(false);
          setSelectedCard(null);
        }}
        onDelete={selectedCard ? () => handleDeleteCard(selectedCard.id) : undefined}
      />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Flashcards</h1>
          <p className="text-muted-foreground">Study with spaced repetition</p>
        </div>
        <div className="flex items-center gap-2">
          {flashcards.length > 0 && (
            <Button onClick={() => setIsStudying(true)} variant="outline" data-testid="button-start-study">
              <Play className="h-4 w-4 mr-2" />
              Start Study Session
            </Button>
          )}
          <Button onClick={createNewCard} data-testid="button-create-flashcard">
            <Plus className="h-4 w-4 mr-2" />
            New Flashcard
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search flashcards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-flashcards"
        />
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No flashcards found matching your search." : "No flashcards yet. Create your first flashcard to start studying!"}
          </p>
          {!searchQuery && (
            <Button onClick={createNewCard} variant="outline" data-testid="button-create-first-flashcard">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Flashcard
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map(card => (
            <Card
              key={card.id}
              className="p-4 cursor-pointer hover-elevate active-elevate-2 transition-all"
              onClick={() => setSelectedCard(card)}
              data-testid={`card-flashcard-${card.id}`}
            >
              <div className="mb-3">
                <Badge variant="secondary" className="mb-2">{card.subject}</Badge>
                <p className="text-sm text-foreground font-medium line-clamp-2">
                  {card.front}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Reviews: {card.reviewCount || 0}</span>
                {card.tags.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {card.tags[0]}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
