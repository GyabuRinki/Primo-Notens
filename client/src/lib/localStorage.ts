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
    return data ? JSON.parse(data) : [];
  },
  
  saveTests: (tests: Test[]) => {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
  },
  
  getTestResults: (): TestResult[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    return data ? JSON.parse(data) : [];
  },
  
  saveTestResults: (results: TestResult[]) => {
    localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(results));
  },
};
