import { Deck, Flashcard } from "@shared/schema";

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
