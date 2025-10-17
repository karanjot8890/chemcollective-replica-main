# Chemistar E-Laboratory

AI-driven virtual chemistry lab with NLP chemical input, drag-and-drop apparatus, reaction predictions, measurements, and graphing.

## Quick Start

Requirements: Node.js 18+ and npm (or pnpm/yarn). On Windows, install Node.js from `https://nodejs.org/` so `npm` is available in PowerShell.

1. Install dependencies
```bash
npm install
```

2. Development server
```bash
npm run dev
```
Visit the local URL printed in the terminal.

## OpenAI API (optional)
To enable real NLP parsing and reaction predictions (fallback mocks are used without a key):

1. Create `.env.local` in the project root:
```env
VITE_OPENAI_API_KEY=sk-your-key-here
```
2. Restart the dev server.

If you need a key, ask: Copy the generated key and paste into `.env.local`:
```
OPENAI_API_KEY=sk-your-key-here
```
Restart the dev server after adding.

## Features
- New/Open/Save (localStorage persistence)
- NLP chemical input, “Add To” dropdown of apparatus
- Apparatus tab to add beakers, flasks, etc.
- 2D bench using React Konva with horizontal-only drag
- Simple pouring/combining when containers are close; triggers AI prediction
- Measurements logging and export to .xlsx
- Graphs via Chart.js
- AI Tutor toggle (UI placeholder)

## Folder Structure
- `src/lib/openai.ts`: OpenAI wrapper with mock fallbacks
- `src/store/useWorkspace.ts`: Zustand store + persistence
- `src/components/*`: UI (Header, Sidebar, WorkspaceCanvas, panels)
- `src/types/*`: Types for apparatus, chemicals, reactions

## Save/Load
State is auto-persisted to localStorage via Zustand. “Save” shows a confirmation; “Open” reloads the last session.

## Notes
- Firebase save/load is replaced with local storage in this version.
- Reaction visuals are simplified (color fill changes and text logs). You can enhance Konva shapes/animations for richer effects.
