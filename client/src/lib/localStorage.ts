import type { Note, Flashcard, Test, TestResult, Deck } from "@shared/schema";

const STORAGE_KEYS = {
  NOTES: 'primonotes_notes',
  FLASHCARDS: 'primonotes_flashcards',
  DECKS: 'primonotes_decks',
  TESTS: 'primonotes_tests',
  TEST_RESULTS: 'primonotes_test_results',
} as const;

export const localStorageService = {
  getNotes: (): Note[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : [];
  },
  
  saveNotes: (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },
  
  getFlashcards: (): Flashcard[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    return data ? JSON.parse(data) : [];
  },
  
  saveFlashcards: (flashcards: Flashcard[]) => {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards));
  },

  getDecks: (): Deck[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DECKS);
    return data ? JSON.parse(data) : [];
  },

  saveDecks: (decks: Deck[]) => {
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  },
  
  getTests: (): Test[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TESTS);
    if (!data) return [];
    
    const tests = JSON.parse(data) as any[];
    const migratedTests = tests.map(test => ({
      ...test,
      questions: test.questions.map((q: any) => {
        const correctAnswer = typeof q.correctAnswer === 'string' 
          ? [q.correctAnswer] 
          : q.correctAnswer;
        
        const migratedQuestion = {
          ...q,
          correctAnswer,
          type: q.type === 'short-answer' ? 'identification' : q.type,
        };
        
        if (migratedQuestion.type === 'identification' && migratedQuestion.caseSensitive === undefined) {
          migratedQuestion.caseSensitive = false;
        }
        
        return migratedQuestion;
      }),
    }));
    
    if (JSON.stringify(tests) !== JSON.stringify(migratedTests)) {
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(migratedTests));
    }
    
    return migratedTests as Test[];
  },
  
  saveTests: (tests: Test[]) => {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
  },
  
  getTestResults: (): TestResult[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    if (!data) return [];
    
    const results = JSON.parse(data) as TestResult[];
    const migratedResults = results.map(result => ({
      ...result,
      answers: Object.fromEntries(
        Object.entries(result.answers).map(([key, value]) => [
          key,
          typeof value === 'string' ? [value] : value
        ])
      ),
    }));
    
    if (JSON.stringify(results) !== JSON.stringify(migratedResults)) {
      localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(migratedResults));
    }
    
    return migratedResults;
  },
  
  saveTestResults: (results: TestResult[]) => {
    localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(results));
  },
};
