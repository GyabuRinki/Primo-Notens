import { z } from "zod";

export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  subject: z.string(),
  tags: z.array(z.string()),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const insertNoteSchema = noteSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Note = z.infer<typeof noteSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;

export const flashcardSchema = z.object({
  id: z.string(),
  front: z.string(),
  back: z.string(),
  subject: z.string(),
  tags: z.array(z.string()),
  difficulty: z.enum(['easy', 'good', 'hard', 'again']).optional(),
  nextReview: z.number().optional(),
  reviewCount: z.number().default(0),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const insertFlashcardSchema = flashcardSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Flashcard = z.infer<typeof flashcardSchema>;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;

export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer']),
  question: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  subject: z.string(),
  tags: z.array(z.string()),
});

export const testSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  subject: z.string(),
  questions: z.array(questionSchema),
  timeLimit: z.number().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const insertTestSchema = testSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Question = z.infer<typeof questionSchema>;
export type Test = z.infer<typeof testSchema>;
export type InsertTest = z.infer<typeof insertTestSchema>;

export const testResultSchema = z.object({
  id: z.string(),
  testId: z.string(),
  answers: z.record(z.string()),
  score: z.number(),
  totalQuestions: z.number(),
  completedAt: z.number(),
});

export type TestResult = z.infer<typeof testResultSchema>;
