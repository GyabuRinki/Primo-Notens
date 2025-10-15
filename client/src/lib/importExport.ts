import { Deck, Flashcard, Note, Test, Question } from "@shared/schema";

export interface ExportOptions {
  includeProgress: boolean;
}

export function exportDeckToText(deck: Deck, cards: Flashcard[], options: ExportOptions = { includeProgress: false }): string {
  let output = `DECK: ${deck.name}\n`;
  output += `SUBJECT: ${deck.subject}\n`;
  if (deck.description) {
    output += `DESCRIPTION: ${deck.description}\n`;
  }
  output += `CREATED: ${new Date(deck.createdAt).toISOString()}\n`;
  output += `(d)-\n\n`;

  cards.forEach((card, index) => {
    output += `CARD ${index + 1}\n`;
    output += `FRONT: ${card.front}\n`;
    output += `BACK: ${card.back}\n`;
    output += `SUBJECT: ${card.subject}\n`;
    if (card.tags.length > 0) {
      output += `TAGS: ${card.tags.join(', ')}\n`;
    }
    
    if (options.includeProgress) {
      output += `PROGRESS: interval=${card.interval}, easeFactor=${card.easeFactor}, reviewCount=${card.reviewCount}`;
      if (card.nextReview) {
        output += `, nextReview=${card.nextReview}`;
      }
      output += `\n`;
    }
    
    output += `(c)-\n\n`;
  });

  return output;
}

export function exportCardsToText(cards: Flashcard[], options: ExportOptions = { includeProgress: false }): string {
  let output = `FLASHCARDS EXPORT\n`;
  output += `EXPORTED: ${new Date().toISOString()}\n`;
  output += `(d)-\n\n`;

  cards.forEach((card, index) => {
    output += `CARD ${index + 1}\n`;
    output += `FRONT: ${card.front}\n`;
    output += `BACK: ${card.back}\n`;
    output += `SUBJECT: ${card.subject}\n`;
    if (card.tags.length > 0) {
      output += `TAGS: ${card.tags.join(', ')}\n`;
    }
    
    if (options.includeProgress) {
      output += `PROGRESS: interval=${card.interval}, easeFactor=${card.easeFactor}, reviewCount=${card.reviewCount}`;
      if (card.nextReview) {
        output += `, nextReview=${card.nextReview}`;
      }
      output += `\n`;
    }
    
    output += `(c)-\n\n`;
  });

  return output;
}

interface ParsedDeck {
  deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>;
  cards: Omit<Flashcard, 'id' | 'deckId' | 'createdAt' | 'updatedAt'>[];
}

export function importDeckFromText(text: string): ParsedDeck {
  const lines = text.split('\n');
  let currentLine = 0;

  const deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'> = {
    name: '',
    subject: '',
    description: '',
  };

  const cards: Omit<Flashcard, 'id' | 'deckId' | 'createdAt' | 'updatedAt'>[] = [];

  // Parse deck info
  while (currentLine < lines.length && lines[currentLine].trim() !== '(d)-') {
    const line = lines[currentLine].trim();
    
    if (line.startsWith('DECK: ')) {
      deck.name = line.substring(6);
    } else if (line.startsWith('SUBJECT: ')) {
      deck.subject = line.substring(9);
    } else if (line.startsWith('DESCRIPTION: ')) {
      deck.description = line.substring(13);
    }
    
    currentLine++;
  }

  // Skip the (d)- separator and empty lines
  currentLine++;
  while (currentLine < lines.length && lines[currentLine].trim() === '') {
    currentLine++;
  }

  // Parse cards
  while (currentLine < lines.length) {
    const line = lines[currentLine].trim();
    
    if (line.startsWith('CARD ')) {
      const card: Omit<Flashcard, 'id' | 'deckId' | 'createdAt' | 'updatedAt'> = {
        front: '',
        back: '',
        subject: '',
        tags: [],
        interval: 0,
        easeFactor: 2.5,
        reviewCount: 0,
      };

      currentLine++;
      
      // Parse card fields
      while (currentLine < lines.length && lines[currentLine].trim() !== '(c)-') {
        const cardLine = lines[currentLine].trim();
        
        if (cardLine.startsWith('FRONT: ')) {
          card.front = cardLine.substring(7);
        } else if (cardLine.startsWith('BACK: ')) {
          card.back = cardLine.substring(6);
        } else if (cardLine.startsWith('SUBJECT: ')) {
          card.subject = cardLine.substring(9);
        } else if (cardLine.startsWith('TAGS: ')) {
          card.tags = cardLine.substring(6).split(',').map(t => t.trim()).filter(t => t);
        } else if (cardLine.startsWith('PROGRESS: ')) {
          const progressStr = cardLine.substring(10);
          const progressParts = progressStr.split(',').map(p => p.trim());
          
          progressParts.forEach(part => {
            const [key, value] = part.split('=').map(s => s.trim());
            if (key === 'interval') {
              card.interval = parseInt(value);
            } else if (key === 'easeFactor') {
              card.easeFactor = parseFloat(value);
            } else if (key === 'reviewCount') {
              card.reviewCount = parseInt(value);
            } else if (key === 'nextReview') {
              card.nextReview = parseInt(value);
            }
          });
        }
        
        currentLine++;
      }

      if (card.front && card.back) {
        cards.push(card);
      }
      
      // Skip the (c)- separator
      currentLine++;
      
      // Skip empty lines
      while (currentLine < lines.length && lines[currentLine].trim() === '') {
        currentLine++;
      }
    } else {
      currentLine++;
    }
  }

  return { deck, cards };
}

export function importCardsFromText(text: string): Omit<Flashcard, 'id' | 'deckId' | 'createdAt' | 'updatedAt'>[] {
  const lines = text.split('\n');
  let currentLine = 0;

  // Skip header
  while (currentLine < lines.length && lines[currentLine].trim() !== '(d)-') {
    currentLine++;
  }

  // Skip the (d)- separator and empty lines
  currentLine++;
  while (currentLine < lines.length && lines[currentLine].trim() === '') {
    currentLine++;
  }

  const cards: Omit<Flashcard, 'id' | 'deckId' | 'createdAt' | 'updatedAt'>[] = [];

  // Parse cards
  while (currentLine < lines.length) {
    const line = lines[currentLine].trim();
    
    if (line.startsWith('CARD ')) {
      const card: Omit<Flashcard, 'id' | 'deckId' | 'createdAt' | 'updatedAt'> = {
        front: '',
        back: '',
        subject: '',
        tags: [],
        interval: 0,
        easeFactor: 2.5,
        reviewCount: 0,
      };

      currentLine++;
      
      // Parse card fields
      while (currentLine < lines.length && lines[currentLine].trim() !== '(c)-') {
        const cardLine = lines[currentLine].trim();
        
        if (cardLine.startsWith('FRONT: ')) {
          card.front = cardLine.substring(7);
        } else if (cardLine.startsWith('BACK: ')) {
          card.back = cardLine.substring(6);
        } else if (cardLine.startsWith('SUBJECT: ')) {
          card.subject = cardLine.substring(9);
        } else if (cardLine.startsWith('TAGS: ')) {
          card.tags = cardLine.substring(6).split(',').map(t => t.trim()).filter(t => t);
        } else if (cardLine.startsWith('PROGRESS: ')) {
          const progressStr = cardLine.substring(10);
          const progressParts = progressStr.split(',').map(p => p.trim());
          
          progressParts.forEach(part => {
            const [key, value] = part.split('=').map(s => s.trim());
            if (key === 'interval') {
              card.interval = parseInt(value);
            } else if (key === 'easeFactor') {
              card.easeFactor = parseFloat(value);
            } else if (key === 'reviewCount') {
              card.reviewCount = parseInt(value);
            } else if (key === 'nextReview') {
              card.nextReview = parseInt(value);
            }
          });
        }
        
        currentLine++;
      }

      if (card.front && card.back) {
        cards.push(card);
      }
      
      // Skip the (c)- separator
      currentLine++;
      
      // Skip empty lines
      while (currentLine < lines.length && lines[currentLine].trim() === '') {
        currentLine++;
      }
    } else {
      currentLine++;
    }
  }

  return cards;
}

export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

export function uploadTextFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        resolve(text);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    };
    
    input.click();
  });
}

export function exportNotesToText(notes: Note[]): string {
  let output = `NOTES EXPORT\n`;
  output += `EXPORTED: ${new Date().toISOString()}\n`;
  output += `TOTAL: ${notes.length} notes\n`;
  output += `(d)-\n\n`;

  notes.forEach((note, index) => {
    output += `NOTE ${index + 1}\n`;
    output += `TITLE: ${note.title}\n`;
    output += `SUBJECT: ${note.subject}\n`;
    if (note.tags.length > 0) {
      output += `TAGS: ${note.tags.join(', ')}\n`;
    }
    output += `CONTENT-START\n`;
    output += `${note.content}\n`;
    output += `CONTENT-END\n`;
    output += `CREATED: ${new Date(note.createdAt).toISOString()}\n`;
    output += `UPDATED: ${new Date(note.updatedAt).toISOString()}\n`;
    output += `(n)-\n\n`;
  });

  return output;
}

export function importNotesFromText(text: string): Omit<Note, 'id' | 'createdAt' | 'updatedAt'>[] {
  const lines = text.split('\n');
  let currentLine = 0;

  while (currentLine < lines.length && lines[currentLine].trim() !== '(d)-') {
    currentLine++;
  }

  currentLine++;
  while (currentLine < lines.length && lines[currentLine].trim() === '') {
    currentLine++;
  }

  const notes: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  while (currentLine < lines.length) {
    const line = lines[currentLine].trim();
    
    if (line.startsWith('NOTE ')) {
      const note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
        title: '',
        content: '',
        subject: '',
        tags: [],
      };

      currentLine++;
      
      while (currentLine < lines.length && lines[currentLine].trim() !== '(n)-') {
        const noteLine = lines[currentLine].trim();
        
        if (noteLine.startsWith('TITLE: ')) {
          note.title = noteLine.substring(7);
        } else if (noteLine.startsWith('SUBJECT: ')) {
          note.subject = noteLine.substring(9);
        } else if (noteLine.startsWith('TAGS: ')) {
          note.tags = noteLine.substring(6).split(',').map(t => t.trim()).filter(t => t);
        } else if (noteLine === 'CONTENT-START') {
          currentLine++;
          let content = '';
          while (currentLine < lines.length && lines[currentLine].trim() !== 'CONTENT-END') {
            content += lines[currentLine] + '\n';
            currentLine++;
          }
          note.content = content.trim();
        }
        
        currentLine++;
      }

      if (note.title && note.subject) {
        notes.push(note);
      }
      
      currentLine++;
      
      while (currentLine < lines.length && lines[currentLine].trim() === '') {
        currentLine++;
      }
    } else {
      currentLine++;
    }
  }

  return notes;
}

export function exportTestsToText(tests: Test[]): string {
  let output = `TESTS EXPORT\n`;
  output += `EXPORTED: ${new Date().toISOString()}\n`;
  output += `TOTAL: ${tests.length} tests\n`;
  output += `(d)-\n\n`;

  tests.forEach((test, index) => {
    output += `TEST ${index + 1}\n`;
    output += `TITLE: ${test.title}\n`;
    if (test.description) {
      output += `DESCRIPTION: ${test.description}\n`;
    }
    output += `SUBJECT: ${test.subject}\n`;
    if (test.timeLimit) {
      output += `TIME_LIMIT: ${test.timeLimit}\n`;
    }
    output += `QUESTIONS: ${test.questions.length}\n`;
    output += `CREATED: ${new Date(test.createdAt).toISOString()}\n`;
    output += `(t)-\n\n`;

    test.questions.forEach((question, qIndex) => {
      output += `QUESTION ${qIndex + 1}\n`;
      output += `TYPE: ${question.type}\n`;
      output += `TEXT: ${question.question}\n`;
      output += `SUBJECT: ${question.subject}\n`;
      if (question.tags.length > 0) {
        output += `TAGS: ${question.tags.join(', ')}\n`;
      }
      if (question.options && question.options.length > 0) {
        output += `OPTIONS: ${question.options.join(' | ')}\n`;
      }
      output += `CORRECT_ANSWER: ${question.correctAnswer}\n`;
      if (question.explanation) {
        output += `EXPLANATION: ${question.explanation}\n`;
      }
      output += `(q)-\n\n`;
    });
  });

  return output;
}

export function importTestsFromText(text: string): Omit<Test, 'id' | 'createdAt' | 'updatedAt'>[] {
  const lines = text.split('\n');
  let currentLine = 0;

  while (currentLine < lines.length && lines[currentLine].trim() !== '(d)-') {
    currentLine++;
  }

  currentLine++;
  while (currentLine < lines.length && lines[currentLine].trim() === '') {
    currentLine++;
  }

  const tests: Omit<Test, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  while (currentLine < lines.length) {
    const line = lines[currentLine].trim();
    
    if (line.startsWith('TEST ')) {
      const test: Omit<Test, 'id' | 'createdAt' | 'updatedAt'> = {
        title: '',
        description: '',
        subject: '',
        questions: [],
        timeLimit: undefined,
      };

      currentLine++;
      
      while (currentLine < lines.length && lines[currentLine].trim() !== '(t)-') {
        const testLine = lines[currentLine].trim();
        
        if (testLine.startsWith('TITLE: ')) {
          test.title = testLine.substring(7);
        } else if (testLine.startsWith('DESCRIPTION: ')) {
          test.description = testLine.substring(13);
        } else if (testLine.startsWith('SUBJECT: ')) {
          test.subject = testLine.substring(9);
        } else if (testLine.startsWith('TIME_LIMIT: ')) {
          test.timeLimit = parseInt(testLine.substring(12));
        }
        
        currentLine++;
      }

      currentLine++;
      while (currentLine < lines.length && lines[currentLine].trim() === '') {
        currentLine++;
      }

      while (currentLine < lines.length) {
        const questionLine = lines[currentLine].trim();
        
        if (questionLine.startsWith('QUESTION ')) {
          const question: Question = {
            id: crypto.randomUUID(),
            type: 'multiple-choice',
            question: '',
            subject: '',
            tags: [],
            correctAnswer: '',
          };

          currentLine++;
          
          while (currentLine < lines.length && lines[currentLine].trim() !== '(q)-') {
            const qLine = lines[currentLine].trim();
            
            if (qLine.startsWith('TYPE: ')) {
              question.type = qLine.substring(6) as 'multiple-choice' | 'true-false' | 'short-answer';
            } else if (qLine.startsWith('TEXT: ')) {
              question.question = qLine.substring(6);
            } else if (qLine.startsWith('SUBJECT: ')) {
              question.subject = qLine.substring(9);
            } else if (qLine.startsWith('TAGS: ')) {
              question.tags = qLine.substring(6).split(',').map(t => t.trim()).filter(t => t);
            } else if (qLine.startsWith('OPTIONS: ')) {
              question.options = qLine.substring(9).split('|').map(o => o.trim()).filter(o => o);
            } else if (qLine.startsWith('CORRECT_ANSWER: ')) {
              question.correctAnswer = qLine.substring(16);
            } else if (qLine.startsWith('EXPLANATION: ')) {
              question.explanation = qLine.substring(13);
            }
            
            currentLine++;
          }

          if (question.question && question.correctAnswer) {
            test.questions.push(question);
          }
          
          currentLine++;
          while (currentLine < lines.length && lines[currentLine].trim() === '') {
            currentLine++;
          }
        } else if (questionLine.startsWith('TEST ') || currentLine >= lines.length) {
          break;
        } else {
          currentLine++;
        }
      }

      if (test.title && test.subject && test.questions.length > 0) {
        tests.push(test);
      }
    } else {
      currentLine++;
    }
  }

  return tests;
}
