# PrimoNotes Design Guidelines

## Design Approach
**Selected Framework**: Hybrid approach combining Notion's organizational clarity with Anki's focused study interface, unified by a distinctive brownish-yellow earth tone palette. This creates a warm, scholarly environment that reduces eye strain during extended study sessions while maintaining modern usability.

**Core Design Principle**: Create a calm, focused study sanctuary with warm earth tones that promote concentration and reduce digital fatigue.

---

## Color Palette

### Primary Colors
- **Primary Brown**: 35 45% 35% (Deep warm brown for headers, primary actions)
- **Secondary Gold**: 45 60% 55% (Warm brownish-gold for accents, active states)
- **Background Cream**: 40 25% 95% (Soft cream background, main canvas)

### Functional Colors
- **Text Primary**: 35 30% 20% (Dark brown for body text)
- **Text Secondary**: 35 20% 45% (Medium brown for secondary text)
- **Border/Divider**: 40 15% 85% (Subtle warm dividers)
- **Success**: 145 40% 45% (Muted sage green)
- **Warning**: 25 70% 50% (Amber for notifications)

### Dark Mode (Study Night Mode)
- **Background**: 35 20% 12% (Deep warm brown-black)
- **Surface**: 35 15% 18% (Elevated surfaces)
- **Text Primary**: 40 25% 90% (Warm off-white)
- **Accents**: Maintain 45 60% 55% (Gold remains vibrant)

---

## Typography

### Font Families
- **Headings**: 'Crimson Pro', serif (scholarly, authoritative)
- **Body**: 'Inter', sans-serif (clean, highly readable)
- **Code/Monospace**: 'JetBrains Mono', monospace

### Type Scale
- **Hero/Display**: text-5xl font-bold (48px)
- **H1**: text-3xl font-semibold (30px)
- **H2**: text-2xl font-semibold (24px)
- **H3**: text-xl font-medium (20px)
- **Body**: text-base (16px)
- **Small**: text-sm (14px)
- **Caption**: text-xs (12px)

---

## Layout System

### Spacing Primitives
Core spacing: **2, 4, 6, 8, 12, 16 units**
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-16
- Card gaps: gap-4 to gap-6
- Generous whitespace between study sections

### Grid Structure
- **Main Container**: max-w-7xl mx-auto px-4
- **Note Editor**: max-w-4xl (optimal reading/writing width)
- **Flashcard Grid**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Dashboard**: Asymmetric 2-column (sidebar + main content)

---

## Component Library

### Navigation
- **Top Bar**: Sticky header with PrimoNotes branding, main navigation tabs (Notes, Flashcards, Tests), theme toggle
- **Sidebar**: Collapsible subject/folder tree with nested indentation
- **Tab Navigation**: Pill-style tabs with warm brown active states

### Core Study Components

**Note Editor**:
- Rich text toolbar with brownish-gold icons
- Distraction-free writing mode (full-screen toggle)
- Left sidebar: folder tree, right sidebar: table of contents
- Inline code blocks with subtle cream background
- Syntax highlighting with earth-tone color scheme

**Flashcard Interface**:
- Card design: Elevated with subtle shadow, cream background, rounded-2xl
- Flip animation: 3D transform on Y-axis (600ms ease)
- Difficulty buttons: Easy (sage green), Good (gold), Hard (amber), Again (brown)
- Progress ring: Circular indicator with gold fill showing mastery
- Deck overview: Card grid with study statistics

**Mock Test Builder**:
- Question cards: Bordered panels with question type badge (MCQ/True-False/Short Answer)
- Drag-and-drop reordering with subtle brown dashed indicators
- Add question button: Large, inviting with + icon
- Test preview mode: Clean, distraction-free exam interface
- Results dashboard: Circular progress charts with earth tone gradients

### Interactive Elements

**Buttons**:
- Primary: bg-[35_45%_35%] text-cream with hover:bg-[35_45%_30%]
- Secondary: border-2 border-[35_45%_35%] with hover:bg-[40_15%_90%]
- Ghost: text-[35_45%_35%] hover:bg-[40_15%_90%]

**Form Inputs**:
- Border: 2px solid warm brown, rounded-lg
- Focus state: ring-2 ring-[45_60%_55%] (gold ring)
- Background: Cream in light mode, darker brown in dark mode

**Cards**:
- Default: bg-cream border border-[40_15%_85%] rounded-xl p-6
- Hover: Subtle lift with shadow-lg transition
- Active/Selected: border-[45_60%_55%] border-2

### Data Display

**Progress Indicators**:
- Linear bars: Gradient from brown to gold
- Circular charts: Donut style with warm color segments
- Spaced repetition scheduler: Timeline visualization with gold markers

**Tables**:
- Zebra striping with subtle cream/white alternation
- Hover row: bg-[40_15%_90%]
- Sticky header with brown background

---

## Images

### Hero Section
- **Large Background**: Abstract study environment - warm library scene with books, soft natural lighting, blurred/faded overlay (30% opacity)
- **Placement**: Full-width behind hero content, min-h-[500px]
- **Treatment**: Warm sepia-toned filter to maintain brownish-yellow theme consistency

### Feature Illustrations
- **Icon Style**: Line icons with gold stroke, placed above feature cards
- **Spot Illustrations**: Small decorative academic icons (notebook, brain, checkmark) in brownish tones

---

## Page Layouts

### Landing Page Structure
1. **Hero**: Full-width with background image, centered headline "Master Your Studies with PrimoNotes", dual CTA buttons (Start Learning + View Features)
2. **Three Core Features**: Grid of 3 cards showcasing Notes/Flashcards/Tests with icons and descriptions
3. **How It Works**: Horizontal timeline with 4 steps (Create → Study → Test → Master)
4. **Study Statistics Showcase**: Visual metrics dashboard preview
5. **CTA Section**: Final conversion with "Start Your Learning Journey" against warm gradient

### Application Dashboard
- **Left Sidebar** (w-64): Folder tree, subject navigation, storage indicator
- **Main Content Area**: Dynamic based on active feature (editor/cards/tests)
- **Right Panel** (collapsible): Context-specific tools (formatting, card stats, test settings)

### Study Modes
- **Focus Mode**: Minimal UI, content-centered, hide sidebars, dark mode recommended
- **Review Mode**: Card-focused with progress tracking always visible

---

## Animations & Interactions

**Minimal & Purposeful**:
- Card flip: transform-style: preserve-3d, 600ms ease
- Page transitions: Fade + slight slide (200ms)
- Button interactions: Scale 0.98 on active
- Loading states: Pulsing brownish skeleton screens
- Success states: Subtle gold glow effect (500ms)

**Avoid**: Excessive parallax, distracting scroll animations, auto-playing content

---

## Accessibility

- WCAG AA contrast ratios maintained (dark brown on cream = 7:1)
- Keyboard navigation: Visible focus rings in gold
- Dark mode: Automatic toggle based on system preference
- Screen reader: Semantic HTML with ARIA labels for study statistics
- Consistent dark mode across all inputs and surfaces

---

## Design Philosophy

**Warm Minimalism**: Use brownish-yellow palette to create a cozy study environment without visual noise. Every element serves learning - from the scholarly serif headings to the gentle color transitions. The design should feel like a trusted study companion, not a flashy app.