import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Play, BookOpen, ArrowLeft, Download, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { localStorageService } from "@/lib/localStorage";
import type { Flashcard, Deck } from "@shared/schema";
import { FlashcardEditor } from "@/components/FlashcardEditor";
import { FlashcardStudySession } from "@/components/FlashcardStudySession";
import { PriorityStudySession } from "@/components/PriorityStudySession";
import { DeckEditor } from "@/components/DeckEditor";
import { 
  exportDeckToText, 
  exportCardsToText, 
  importDeckFromText, 
  importCardsFromText,
  downloadTextFile,
  uploadTextFile
} from "@/lib/importExport";
import { useToast } from "@/hooks/use-toast";

export default function Flashcards() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [studyMode, setStudyMode] = useState<'spaced' | 'priority'>('spaced');
  const [studyModeDialogOpen, setStudyModeDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportCardsDialogOpen, setExportCardsDialogOpen] = useState(false);
  const [includeProgress, setIncludeProgress] = useState(false);
  const [studyAhead, setStudyAhead] = useState(() => {
    const saved = localStorage.getItem('studyAhead');
    return saved ? JSON.parse(saved) : false;
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadedDecks = localStorageService.getDecks();
    const loadedCards = localStorageService.getFlashcards();
    setDecks(loadedDecks);
    setFlashcards(loadedCards);
  }, []);

  const handleSaveDeck = (deck: Deck) => {
    const existingIndex = decks.findIndex(d => d.id === deck.id);
    let updatedDecks: Deck[];
    
    if (existingIndex >= 0) {
      updatedDecks = [...decks];
      updatedDecks[existingIndex] = deck;
    } else {
      updatedDecks = [deck, ...decks];
    }
    
    setDecks(updatedDecks);
    localStorageService.saveDecks(updatedDecks);
    setIsCreatingDeck(false);
    setIsEditingDeck(false);
  };

  const handleDeleteDeck = (deckId: string) => {
    const updatedDecks = decks.filter(d => d.id !== deckId);
    const updatedCards = flashcards.filter(c => c.deckId !== deckId);
    setDecks(updatedDecks);
    setFlashcards(updatedCards);
    localStorageService.saveDecks(updatedDecks);
    localStorageService.saveFlashcards(updatedCards);
    setSelectedDeck(null);
    setIsEditingDeck(false);
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
    setIsCreatingCard(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = flashcards.filter(c => c.id !== cardId);
    setFlashcards(updatedCards);
    localStorageService.saveFlashcards(updatedCards);
    setSelectedCard(null);
  };

  const handleUpdateAfterStudy = (updatedCards: Flashcard[]) => {
    const currentCards = localStorageService.getFlashcards();
    const updatedCardsMap = new Map(updatedCards.map(card => [card.id, card]));
    const currentCardsMap = new Map(currentCards.map(card => [card.id, card]));
    
    const mergedCards = currentCards.map(card => 
      updatedCardsMap.has(card.id) ? updatedCardsMap.get(card.id)! : card
    );
    
    updatedCards.forEach(card => {
      if (!currentCardsMap.has(card.id)) {
        mergedCards.push(card);
      }
    });
    
    setFlashcards(mergedCards);
    localStorageService.saveFlashcards(mergedCards);
  };

  const getDeckProgress = (deckId: string) => {
    const deckCards = flashcards.filter(c => c.deckId === deckId);
    if (deckCards.length === 0) return { total: 0, reviewed: 0, dueToday: 0, percentage: 0 };
    
    const now = Date.now();
    const reviewed = deckCards.filter(c => c.reviewCount > 0).length;
    const dueToday = deckCards.filter(c => !c.nextReview || c.nextReview <= now).length;
    const percentage = (reviewed / deckCards.length) * 100;
    
    return { total: deckCards.length, reviewed, dueToday, percentage };
  };

  const handleExportDeck = () => {
    if (!selectedDeck) return;
    
    const deckCards = flashcards.filter(c => c.deckId === selectedDeck.id);
    const textContent = exportDeckToText(selectedDeck, deckCards, { includeProgress });
    const filename = `${selectedDeck.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
    downloadTextFile(textContent, filename);
    
    setExportDialogOpen(false);
    setIncludeProgress(false);
    toast({
      title: "Deck exported",
      description: `${selectedDeck.name} has been exported successfully.`,
    });
  };

  const handleImportDeck = async () => {
    try {
      const text = await uploadTextFile();
      const { deck, cards } = importDeckFromText(text);
      
      const newDeck: Deck = {
        id: crypto.randomUUID(),
        ...deck,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      const newCards: Flashcard[] = cards.map(card => ({
        id: crypto.randomUUID(),
        deckId: newDeck.id,
        ...card,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      
      const updatedDecks = [newDeck, ...decks];
      const updatedCards = [...newCards, ...flashcards];
      
      setDecks(updatedDecks);
      setFlashcards(updatedCards);
      localStorageService.saveDecks(updatedDecks);
      localStorageService.saveFlashcards(updatedCards);
      
      toast({
        title: "Deck imported",
        description: `${newDeck.name} with ${newCards.length} cards has been imported.`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import deck",
        variant: "destructive",
      });
    }
  };

  const handleExportCards = () => {
    if (!selectedDeck) return;
    
    const deckCards = flashcards.filter(c => c.deckId === selectedDeck.id);
    const textContent = exportCardsToText(deckCards, { includeProgress });
    const filename = `${selectedDeck.name.replace(/[^a-z0-9]/gi, '_')}_cards.txt`;
    downloadTextFile(textContent, filename);
    
    setExportCardsDialogOpen(false);
    setIncludeProgress(false);
    toast({
      title: "Cards exported",
      description: `${deckCards.length} cards have been exported successfully.`,
    });
  };

  const handleImportCards = async () => {
    if (!selectedDeck) return;
    
    try {
      const text = await uploadTextFile();
      const cards = importCardsFromText(text);
      
      const newCards: Flashcard[] = cards.map(card => ({
        id: crypto.randomUUID(),
        deckId: selectedDeck.id,
        ...card,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      
      const updatedCards = [...newCards, ...flashcards];
      
      setFlashcards(updatedCards);
      localStorageService.saveFlashcards(updatedCards);
      
      toast({
        title: "Cards imported",
        description: `${newCards.length} cards have been imported to ${selectedDeck.name}.`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import cards",
        variant: "destructive",
      });
    }
  };

  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isStudying && selectedDeck) {
    const deckCards = flashcards.filter(c => c.deckId === selectedDeck.id);
    
    if (studyMode === 'priority') {
      if (deckCards.length === 0) {
        setIsStudying(false);
        toast({
          title: "No cards to study",
          description: "Add some cards to this deck first.",
        });
        return null;
      }
      
      return (
        <PriorityStudySession
          flashcards={deckCards}
          onComplete={handleUpdateAfterStudy}
          onExit={() => setIsStudying(false)}
        />
      );
    }
    
    const now = Date.now();
    let finalCards: Flashcard[];
    
    if (studyAhead) {
      finalCards = deckCards.sort((a, b) => {
        if (!a.nextReview && !b.nextReview) return 0;
        if (!a.nextReview) return -1;
        if (!b.nextReview) return 1;
        return a.nextReview - b.nextReview;
      });
    } else {
      finalCards = deckCards
        .filter(c => !c.nextReview || c.nextReview <= now)
        .sort((a, b) => {
          if (!a.nextReview && !b.nextReview) return 0;
          if (!a.nextReview) return -1;
          if (!b.nextReview) return 1;
          return a.nextReview - b.nextReview;
        });
    }
    
    if (finalCards.length === 0) {
      setIsStudying(false);
      toast({
        title: "No cards to study",
        description: "Enable 'Study cards not yet due' to study ahead.",
      });
      return null;
    }
    
    return (
      <FlashcardStudySession
        flashcards={finalCards}
        onComplete={handleUpdateAfterStudy}
        onExit={() => setIsStudying(false)}
      />
    );
  }

  if (isCreatingDeck) {
    return (
      <DeckEditor
        deck={null}
        onSave={handleSaveDeck}
        onCancel={() => setIsCreatingDeck(false)}
      />
    );
  }

  if (isEditingDeck && selectedDeck) {
    return (
      <DeckEditor
        deck={selectedDeck}
        onSave={handleSaveDeck}
        onCancel={() => {
          setIsEditingDeck(false);
          setSelectedDeck(null);
        }}
        onDelete={() => handleDeleteDeck(selectedDeck.id)}
      />
    );
  }

  if (selectedDeck) {
    const deckCards = flashcards.filter(c => c.deckId === selectedDeck.id);
    const progress = getDeckProgress(selectedDeck.id);

    if (isCreatingCard || selectedCard) {
      return (
        <FlashcardEditor
          flashcard={selectedCard}
          deckId={selectedDeck.id}
          onSave={handleSaveCard}
          onCancel={() => {
            setIsCreatingCard(false);
            setSelectedCard(null);
          }}
          onDelete={selectedCard ? () => handleDeleteCard(selectedCard.id) : undefined}
        />
      );
    }

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setSelectedDeck(null)} data-testid="button-back-to-decks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Decks
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-foreground">{selectedDeck.name}</h1>
              <p className="text-muted-foreground">{selectedDeck.description || selectedDeck.subject}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button onClick={() => setExportDialogOpen(true)} variant="outline" data-testid="button-export-deck">
                <Download className="h-4 w-4 mr-2" />
                Export Deck
              </Button>
              <Button onClick={() => setExportCardsDialogOpen(true)} variant="outline" data-testid="button-export-cards">
                <Download className="h-4 w-4 mr-2" />
                Export Cards
              </Button>
              <Button onClick={handleImportCards} variant="outline" data-testid="button-import-cards">
                <Upload className="h-4 w-4 mr-2" />
                Import Cards
              </Button>
              <Button onClick={() => setIsEditingDeck(true)} variant="outline" data-testid="button-edit-deck">
                Edit Deck
              </Button>
              {deckCards.length > 0 && (
                <Button onClick={() => setStudyModeDialogOpen(true)} variant="outline" data-testid="button-start-study">
                  <Play className="h-4 w-4 mr-2" />
                  Study
                </Button>
              )}
              <Button onClick={() => setIsCreatingCard(true)} data-testid="button-create-flashcard">
                <Plus className="h-4 w-4 mr-2" />
                New Flashcard
              </Button>
            </div>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{progress.reviewed} / {progress.total} reviewed</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <Badge variant="outline">{progress.total} total cards</Badge>
                  <Badge variant="outline">{progress.dueToday} due today</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="study-ahead"
                    checked={studyAhead}
                    onCheckedChange={(checked) => {
                      setStudyAhead(checked);
                      localStorage.setItem('studyAhead', JSON.stringify(checked));
                    }}
                    data-testid="switch-study-ahead"
                  />
                  <Label htmlFor="study-ahead" className="text-sm text-muted-foreground cursor-pointer">
                    Study cards not yet due
                  </Label>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {deckCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No flashcards in this deck yet. Create your first flashcard to start studying!
            </p>
            <Button onClick={() => setIsCreatingCard(true)} variant="outline" data-testid="button-create-first-flashcard">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Flashcard
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deckCards.map(card => (
              <Card
                key={card.id}
                className="p-4 cursor-pointer hover-elevate active-elevate-2 transition-all"
                onClick={() => setSelectedCard(card)}
                data-testid={`card-flashcard-${card.id}`}
              >
                <div className="mb-3">
                  <p className="text-sm text-foreground font-medium line-clamp-2 mb-2">
                    {card.front}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {card.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Reviews: {card.reviewCount || 0}</span>
                  {card.nextReview && card.nextReview > Date.now() && (
                    <Badge variant="secondary" className="text-xs">
                      Next: {Math.ceil((card.nextReview - Date.now()) / (24 * 60 * 60 * 1000))}d
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogContent data-testid="dialog-export-deck">
            <DialogHeader>
              <DialogTitle>Export Deck</DialogTitle>
              <DialogDescription>
                Export this deck and all its cards to a .txt file that can be shared with others.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <Label htmlFor="include-progress-deck" className="text-sm font-medium">
                  Include Progress Data
                </Label>
                <p className="text-sm text-muted-foreground">
                  Include review history and spaced repetition data
                </p>
              </div>
              <Switch
                id="include-progress-deck"
                checked={includeProgress}
                onCheckedChange={setIncludeProgress}
                data-testid="switch-include-progress"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleExportDeck} data-testid="button-confirm-export-deck">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={exportCardsDialogOpen} onOpenChange={setExportCardsDialogOpen}>
          <DialogContent data-testid="dialog-export-cards">
            <DialogHeader>
              <DialogTitle>Export Cards</DialogTitle>
              <DialogDescription>
                Export only the cards from this deck to a .txt file.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <Label htmlFor="include-progress-cards-deck" className="text-sm font-medium">
                  Include Progress Data
                </Label>
                <p className="text-sm text-muted-foreground">
                  Include review history and spaced repetition data
                </p>
              </div>
              <Switch
                id="include-progress-cards-deck"
                checked={includeProgress}
                onCheckedChange={setIncludeProgress}
                data-testid="switch-include-progress-cards"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleExportCards} data-testid="button-confirm-export-cards">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Flashcard Decks</h1>
          <p className="text-muted-foreground">Organize your flashcards by subject and topic</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleImportDeck} variant="outline" data-testid="button-import-deck">
            <Upload className="h-4 w-4 mr-2" />
            Import Deck
          </Button>
          <Button onClick={() => setIsCreatingDeck(true)} data-testid="button-create-deck">
            <Plus className="h-4 w-4 mr-2" />
            New Deck
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search decks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-decks"
        />
      </div>

      {filteredDecks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No decks found matching your search." : "No decks yet. Create your first deck to start organizing flashcards!"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreatingDeck(true)} variant="outline" data-testid="button-create-first-deck">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Deck
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDecks.map(deck => {
            const progress = getDeckProgress(deck.id);
            return (
              <Card
                key={deck.id}
                className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
                onClick={() => setSelectedDeck(deck)}
                data-testid={`card-deck-${deck.id}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-md bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-1 truncate">
                      {deck.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">{deck.subject}</Badge>
                  </div>
                </div>
                
                {progress.total > 0 && (
                  <div className="space-y-2">
                    <Progress value={progress.percentage} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{progress.reviewed}/{progress.total} reviewed</span>
                      {progress.dueToday > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {progress.dueToday} due
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {progress.total === 0 && (
                  <p className="text-xs text-muted-foreground">No cards yet</p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent data-testid="dialog-export-deck">
          <DialogHeader>
            <DialogTitle>Export Deck</DialogTitle>
            <DialogDescription>
              Export this deck and all its cards to a .txt file that can be shared with others.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <Label htmlFor="include-progress" className="text-sm font-medium">
                Include Progress Data
              </Label>
              <p className="text-sm text-muted-foreground">
                Include review history and spaced repetition data
              </p>
            </div>
            <Switch
              id="include-progress"
              checked={includeProgress}
              onCheckedChange={setIncludeProgress}
              data-testid="switch-include-progress"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleExportDeck} data-testid="button-confirm-export-deck">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={exportCardsDialogOpen} onOpenChange={setExportCardsDialogOpen}>
        <DialogContent data-testid="dialog-export-cards">
          <DialogHeader>
            <DialogTitle>Export Cards</DialogTitle>
            <DialogDescription>
              Export only the cards from this deck to a .txt file.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <Label htmlFor="include-progress-cards" className="text-sm font-medium">
                Include Progress Data
              </Label>
              <p className="text-sm text-muted-foreground">
                Include review history and spaced repetition data
              </p>
            </div>
            <Switch
              id="include-progress-cards"
              checked={includeProgress}
              onCheckedChange={setIncludeProgress}
              data-testid="switch-include-progress-cards"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleExportCards} data-testid="button-confirm-export-cards">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={studyModeDialogOpen} onOpenChange={setStudyModeDialogOpen}>
        <DialogContent data-testid="dialog-study-mode">
          <DialogHeader>
            <DialogTitle>Select Study Mode</DialogTitle>
            <DialogDescription>
              Choose how you want to study your flashcards.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Card 
              className={`p-4 cursor-pointer hover-elevate active-elevate-2 transition-all ${studyMode === 'spaced' ? 'border-primary' : ''}`}
              onClick={() => setStudyMode('spaced')}
              data-testid="card-study-mode-spaced"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Spaced Repetition</h3>
                  <p className="text-sm text-muted-foreground">
                    Study cards based on due dates using the proven SM-2 algorithm. Focus on cards you need to review today.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card 
              className={`p-4 cursor-pointer hover-elevate active-elevate-2 transition-all ${studyMode === 'priority' ? 'border-primary' : ''}`}
              onClick={() => setStudyMode('priority')}
              data-testid="card-study-mode-priority"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Priority Study</h3>
                  <p className="text-sm text-muted-foreground">
                    Study cards based on difficulty. Cards you struggle with appear more frequently, with color indicators showing recall difficulty.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-destructive" />
                      <span className="text-xs text-muted-foreground">Hard</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-chart-4" />
                      <span className="text-xs text-muted-foreground">Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-chart-2" />
                      <span className="text-xs text-muted-foreground">Easy</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => {
                setStudyModeDialogOpen(false);
                setIsStudying(true);
              }} 
              data-testid="button-confirm-study-mode"
            >
              Start Studying
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
