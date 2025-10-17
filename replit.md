# PrimoNotes - Complete Study Companion

## Overview

PrimoNotes is a comprehensive study application that combines advanced note-taking, Anki-style spaced repetition flashcards, and mock test creation in a single platform. The application features a warm, earth-toned design (brownish-yellow palette) inspired by Notion's organizational clarity and Anki's focused study interface, creating a calm study sanctuary that promotes concentration and reduces digital fatigue.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing, providing a lightweight alternative to React Router with support for the following routes:
- `/` - Home/landing page
- `/notes` - Note management interface
- `/flashcards` - Flashcard deck and study interface
- `/tests` - Mock test builder and taker

**State Management**: 
- React Query (@tanstack/react-query) for server state management and caching
- Local component state using React hooks (useState, useEffect)
- Context API for theme management (ThemeProvider)

**UI Component System**: 
- Shadcn UI component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Typography: Crimson Pro (serif) for headings, Inter (sans-serif) for body text, JetBrains Mono for code
- Custom color palette defined in CSS variables supporting both light and dark modes
- Component path aliases configured: `@/` for client components, `@shared/` for shared schemas

**Design System**:
- Warm earth tone palette (browns, golds, cream backgrounds)
- Custom elevation system using CSS variables (--elevate-1, --elevate-2)
- Border radius tokens (lg: 9px, md: 6px, sm: 3px)
- Dark mode ("Study Night Mode") with deep warm brown-black backgrounds
- Hover and active state interactions for better user feedback

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API structure with routes prefixed with `/api`. The current implementation uses a placeholder server with minimal routes, as the application primarily operates client-side.

**Development Setup**:
- Vite middleware integration for HMR (Hot Module Replacement) during development
- Custom error overlay plugin for development
- Static file serving in production mode

### Data Storage Solutions

**Primary Storage**: Browser localStorage for client-side data persistence.

**Storage Service** (`client/src/lib/localStorage.ts`):
- Centralized service managing five storage keys:
  - `primonotes_notes` - Note documents
  - `primonotes_flashcards` - Individual flashcards
  - `primonotes_decks` - Flashcard deck metadata
  - `primonotes_tests` - Mock test definitions
  - `primonotes_test_results` - Test attempt results

**Database Configuration**: Drizzle ORM configured for PostgreSQL with Neon serverless driver, though not actively used in current client-side implementation. Database schema defined in `shared/schema.ts` using Zod for validation.

**Data Models**:
- **Notes**: Rich text content with title, subject, tags, timestamps
- **Decks**: Organizational containers for flashcards with name, description, subject, color
- **Flashcards**: Front/back content with spaced repetition metadata (interval, easeFactor, nextReview, reviewCount)
- **Tests**: Question collections with title, description, subject, time limits
- **Questions**: Multiple choice, true/false, or short answer formats with explanations
- **Test Results**: Score tracking with question-by-question answers and timestamps

### Key Features & Architectural Decisions

**Spaced Repetition Algorithm**: 
- Custom implementation of SuperMemo SM-2 algorithm for flashcard review scheduling
- Tracks ease factor (difficulty multiplier) and interval between reviews
- Four difficulty ratings: again, hard, good, easy
- Progressive interval scaling with reasonable growth: 1→3→7→15 days, then gradual increase
- Capped at 365 days maximum to prevent absurd intervals
- Different progression speeds for easy/good/hard ratings

**Rich Text Editor**:
- Custom contentEditable-based editor with toolbar controls
- Supports bold, italic, underline, headings, lists, code blocks, and text colors
- Sanitizes HTML output for storage
- No external WYSIWYG library dependency

**Test Generation System**:
- Flexible question builder supporting multiple question types
- Timer functionality with auto-submit on expiration
- Immediate feedback mode with explanations
- Result tracking and history
- Partial credit options with two modes:
  - Proportional: Students get points based on correct answers selected
  - All-or-nothing: Students must select all correct answers for full points

**Study Ahead Feature**:
- Toggle to allow studying cards not yet due
- When enabled, shows all cards (due + upcoming) sorted by review date
- Ensures closest due cards always appear in study sessions

**Progressive Web App (PWA)**:
- Fully installable as a standalone app on mobile and desktop
- Offline functionality with service worker caching
- Caches app shell and assets for offline access
- Navigation fallback ensures SPA routes work offline
- Manifest configured with app shortcuts for quick access
- Note: Custom app icons (192x192 and 512x512 PNG) should be added to `client/public/` for full PWA experience

**Theme System**:
- System preference detection on first load
- Persistent theme storage in localStorage
- CSS variable-based theming for easy customization
- Separate color tokens for light and dark modes

### Build & Deployment

**Build Process**:
- Vite builds the client React application to `dist/public`
- esbuild bundles the Express server to `dist/index.js`
- Separate build artifacts for client and server code

**Development Workflow**:
- `npm run dev` - Starts development server with HMR
- `npm run build` - Production build
- `npm start` - Runs production build
- `npm run check` - TypeScript type checking
- `npm run db:push` - Drizzle schema push (for future database integration)

**Code Organization**:
- Monorepo structure with client, server, and shared directories
- Shared schema definitions using Zod for runtime validation
- Path aliases for clean imports across the codebase

## External Dependencies

### UI & Component Libraries
- **Radix UI** - Headless UI primitives for accessible components (dialogs, dropdowns, popovers, tooltips, etc.)
- **Shadcn UI** - Pre-built component system built on Radix UI
- **Lucide React** - Icon library
- **cmdk** - Command palette component
- **Embla Carousel** - Carousel component
- **Vaul** - Drawer component

### Styling & Design
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Variant management for component styles
- **clsx** & **tailwind-merge** - Conditional class name utilities

### Form & Validation
- **React Hook Form** - Form state management
- **@hookform/resolvers** - Schema validation integration
- **Zod** - TypeScript-first schema validation
- **drizzle-zod** - Drizzle ORM Zod integration

### Data & State Management
- **@tanstack/react-query** - Server state management and caching
- **date-fns** - Date manipulation utilities

### Database & ORM
- **Drizzle ORM** - TypeScript ORM for SQL databases
- **@neondatabase/serverless** - Serverless PostgreSQL driver for Neon
- **drizzle-kit** - Drizzle CLI tools for migrations

### Development Tools
- **Vite** - Build tool and dev server
- **@vitejs/plugin-react** - React plugin for Vite
- **@replit/vite-plugin-runtime-error-modal** - Error overlay for Replit
- **@replit/vite-plugin-cartographer** - Replit code navigation
- **@replit/vite-plugin-dev-banner** - Development banner
- **tsx** - TypeScript execution engine
- **esbuild** - JavaScript bundler for server code

### Fonts
- **Google Fonts** - Crimson Pro, Inter, JetBrains Mono (loaded via CDN in index.html)