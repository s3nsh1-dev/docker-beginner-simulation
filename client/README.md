# TaskPulse Client (Frontend)

React 19 single-page application built with Vite, TypeScript, and custom Glassmorphism styling.

## 📁 Folder Structure

```
client/
├── e2e/
│   └── todos.spec.ts        # Playwright E2E test suite
├── src/
│   ├── components/          # Modular React UI components
│   │   ├── Header.tsx           # Logo, theme switcher & action trigger
│   │   ├── StatsDashboard.tsx   # SVG Progress ring & metric counters
│   │   ├── QuickAdd.tsx         # Inline task creation bar
│   │   ├── FilterBar.tsx        # Search, status tabs, priority & category filters
│   │   ├── TodoCard.tsx         # Task item card with due date chips
│   │   ├── TodoModal.tsx        # Detailed task create & edit dialog
│   │   └── EmptyState.tsx       # Filter empty visual state
│   ├── hooks/
│   │   └── useTodos.ts      # Custom React state hook & optimistic UI updates
│   ├── services/
│   │   └── api.ts           # Fetch API service layer connecting to Express REST API
│   ├── types/
│   │   └── todo.ts          # Frontend TypeScript interface types
│   ├── App.tsx              # Root React component
│   └── index.css            # Glassmorphism dark/light CSS design system
├── playwright.config.ts     # Playwright configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Frontend dependencies & scripts
```

## 🛠️ Scripts

```bash
# Install dependencies
pnpm install

# Start Vite Development Server (http://localhost:5173)
pnpm dev

# Run Playwright End-to-End Tests
pnpm test:e2e

# Typecheck and Build for Production
pnpm build
```

## 🎨 Key Features

- **Theme Engine**: Light & Dark mode toggle with 4 accent themes (`Cyber Cyan`, `Neon Emerald`, `Sunset Rose`, `Electric Amber`).
- **SVG Progress Ring**: Live visual task completion percentage display.
- **Relative Due Dates**: Intelligent countdown labels (*"Overdue by 2 days"*, *"Due Today"*, *"Due in 3 days"*).
- **Keyboard Shortcuts**: `/` to search tasks, `N` to open the task modal.
