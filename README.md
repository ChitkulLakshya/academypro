# ACADEMYPRO — Sports Academy Management App

A feature-rich **React** mobile web application for managing cricket academy operations, built with **Vite 6**, **Tailwind CSS v4**, and **Framer Motion**. Designed as a mobile-first (430px max-width) dark-themed UI with orange accents.

---

## Table of Contents

- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Design System](#design-system)
- [Data Architecture](#data-architecture)
- [Screens & Components](#screens--components)
- [Custom Hooks](#custom-hooks)
- [State Management](#state-management)
- [Performance & UX](#performance--ux)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Screens
- **Home Dashboard** — Quick stats, performance ring, attendance tracker, upcoming sessions, player highlights, and live session banners
- **Analysis** — Radar charts, skill drill-downs, academy averages, time-period comparison, and performer rankings
- **Reviews** — Per-player review cards with radar visualization, skill sliders, category breakdowns, coach notes, and history timelines

### Extended Screens
- **Player Comparison** — Head-to-head dual-radar, bar comparisons, data tables, and automated insights
- **Profile** — User overview with stats, history log, and achievement badges
- **Settings** — Account management, notification preferences, appearance toggles, data controls
- **Schedule** — Calendar and list views with date-grouped session cards
- **Session Detail** — Overview, roster, attendance tracking, and coach notes per session
- **Leaderboard** — Animated podium with sortable player rankings
- **Drill Library** — 20+ training drills across 6 categories with difficulty tiers, weekly program templates, and exercise supplements
- **Coach Directory** — Staff profiles, certifications, availability, philosophy, and academy announcements

### UI System
- **Toast Notifications** — Animated, auto-dismissing, color-coded alerts (success/error/warning/info)
- **Loading Screen** — Branded full-page loader with animated rings and progress bar
- **Error Boundary** — Graceful error handling with expandable debug details
- **Skeleton Loaders** — Per-screen shimmer placeholders matching real layout shapes
- **Bottom Navigation** — 3-tab nav with smooth icon transitions and notification badges

### Infrastructure
- **Custom Hooks** — `useDebouncedValue`, `useLocalStorage`, `useToggle`, `usePrevious`, `useMediaQuery`, `useClickOutside`, `useInView`, `useTimer`, `useKeyboardShortcuts`, `useScrollPosition`
- **Global State** — Context + reducer pattern with memoized action creators, 17 action types, and selector hooks
- **Animations** — Framer Motion page transitions, staggered lists, bottom sheets, spring presets, and CSS keyframe fallbacks
- **Design Tokens** — Full token system for colors, spacing, radius, shadows, and typography via Tailwind `@theme`

---

## Tech Stack

| Layer        | Technology                                      |
|--------------|--------------------------------------------------|
| Framework    | [React 19](https://react.dev)                   |
| Build        | [Vite 6](https://vitejs.dev)                    |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com)      |
| Charts       | [Recharts](https://recharts.org)                |
| Animation    | [Framer Motion](https://motion.dev)             |
| Language     | JavaScript (ES2022+)                             |

---

## Project Structure

```
academypro/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── shared.jsx           # ProgressRing, AnimatedBar, EmptyState, SectionHeader
│   │   │   ├── Toast.jsx            # Toast notification provider + hook
│   │   │   ├── LoadingScreen.jsx    # Full-page branded loader
│   │   │   ├── ErrorBoundary.jsx    # React error boundary with debug panel
│   │   │   └── Skeletons.jsx        # Per-screen skeleton loading states
│   │   ├── HomeScreen.jsx           # Home dashboard tab
│   │   ├── AnalysisScreen.jsx       # Analysis/radar tab
│   │   ├── ReviewsScreen.jsx        # Player review tab
│   │   ├── PlayerCard.jsx           # Reusable player card (compact/default/expanded)
│   │   ├── PlayerComparison.jsx     # Head-to-head comparison screen
│   │   ├── PlayerDetailModal.jsx    # Bottom-sheet player detail
│   │   ├── ProfileScreen.jsx        # User profile + NotificationPanel + SearchOverlay
│   │   ├── SettingsScreen.jsx       # Settings with toggles and sections
│   │   ├── ScheduleScreen.jsx       # Calendar + list schedule views
│   │   ├── SessionDetailScreen.jsx  # Individual session detail tabs
│   │   ├── LeaderboardScreen.jsx    # Animated leaderboard with podium
│   │   ├── DrillLibraryScreen.jsx   # Drill browser with filters and detail modal
│   │   ├── CoachDirectoryScreen.jsx # Coach profiles and announcements
│   │   ├── BottomNav.jsx            # Tab bar with icon library
│   │   └── WelcomeScreen.jsx        # Onboarding role selection
│   ├── context/
│   │   └── AppContext.jsx           # Global state provider with useReducer
│   ├── hooks/
│   │   └── useAppHooks.js           # 10 custom React hooks
│   ├── data/
│   │   ├── mockData.js              # 50 player profiles (~985 lines)
│   │   ├── sessionData.js           # Sessions, attendance, reviews (~522 lines)
│   │   ├── drillsData.js            # 20 drills, 3 programs, 12 exercises (~520 lines)
│   │   └── coachData.js             # 8 coaches, announcements (~332 lines)
│   ├── utils/
│   │   ├── constants.js             # Colors, animation presets, filter config
│   │   ├── helpers.js               # Utility functions (formatting, scoring, grouping)
│   │   └── animations.js            # Extended Framer Motion variants and springs
│   ├── App.jsx                      # Root component with screen routing and overlays
│   ├── index.css                    # Master stylesheet (~700 lines of design system)
│   └── main.jsx                     # Entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9 (or pnpm / yarn)

### Installation

```bash
# clone the repo
git clone https://github.com/ChitkulLakshya/academypro.git
cd academypro

# install dependencies
npm install

# start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default. Open it in a mobile viewport (430px) for the intended experience.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Available Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview production build locally     |
| `npm run lint`    | Run ESLint (if configured)           |

---

## Design System

### Color Palette

| Token             | Value                            | Usage                    |
|-------------------|----------------------------------|--------------------------|
| `dark-900`        | `#0a0a0a`                        | Page background          |
| `dark-700`        | `#1c1c1e`                        | Card background          |
| `dark-600`        | `#2c2c2e`                        | Borders, dividers        |
| `dark-400`        | `#636366`                        | Muted text               |
| `dark-300`        | `#8e8e93`                        | Secondary text           |
| `orange`          | `#F5A623`                        | Primary brand color      |
| `accent`          | `#FF9F0A`                        | Accent highlights        |
| `success`         | `#30D158`                        | Positive indicators      |
| `danger`          | `#FF453A`                        | Negative indicators      |
| `warn`            | `#FFD60A`                        | Warning indicators       |
| `info`            | `#64D2FF`                        | Information indicators   |

### CSS Components

The stylesheet includes pre-built classes:

- **Cards**: `.card`, `.card-inner`, `.card-elevated`, `.card-glass`, `.card-glow`
- **Badges**: `.badge`, `.badge-orange`, `.badge-success`, `.badge-danger`, `.badge-warn`, `.badge-info`, `.badge-neutral`
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-sm`, `.btn-lg`, `.btn-icon`
- **Inputs**: `.input`, `.input-error`
- **Gradients**: `.gradient-orange`, `.gradient-orange-subtle`, `.gradient-orange-text`, `.gradient-dark`, `.gradient-success`, `.gradient-danger`
- **Progress**: `.progress-track`, `.progress-fill`, `.progress-fill-success`, `.progress-fill-orange`, `.progress-fill-gradient`
- **Avatars**: `.avatar`, `.avatar-sm/md/lg/xl`, `.avatar-ring`
- **Skeletons**: `.skeleton`, `.skeleton-text`, `.skeleton-title`, `.skeleton-circle`, `.skeleton-card`
- **Overlays**: `.backdrop`, `.overlay-panel`, `.overlay-handle`
- **Animations**: `.animate-fade-in-up`, `.animate-fade-in`, `.animate-scale-in`, `.animate-slide-up`, `.animate-bounce`, `.animate-count-up`, `.animate-spin`, `.stagger-children`

### Typography

- **Primary font**: Inter (system fallback)
- **Monospace**: JetBrains Mono (code/stats displays)
- **Scores**: Use `.tabular-nums` for aligned number columns

---

## Data Architecture

### Mock Data (`src/data/`)

| File              | Records  | Lines | Description                                      |
|-------------------|----------|-------|--------------------------------------------------|
| `mockData.js`     | 50 players | ~985  | Full profiles with per-period stats (30/60/90d)  |
| `sessionData.js`  | ~30 items  | ~522  | Sessions, attendance, reviews, highlights        |
| `drillsData.js`   | 20 drills  | ~520  | Training exercises with programs and gym library  |
| `coachData.js`    | 8 coaches  | ~332  | Staff profiles, certifications, announcements     |

Each player in `mockData.js` contains:
- Basic info (name, age, category, role, joined date, avatar URL)
- Overall score + attendance percentage
- Status indicator (improving/stable/declining)
- Time-filtered stats for 30-day, 60-day, 90-day, and all-time periods
- Each period has: batting, bowling, fielding, fitness, and overall scores

---

## Screens & Components

### Tab Screens (Bottom Nav)
1. **Home** (`HomeScreen.jsx`) — Dashboard with team stats, performance ring, pending reviews, highlights
2. **Analysis** (`AnalysisScreen.jsx`) — Radar charts, skill bars, performer sections, comparison panel
3. **Reviews** (`ReviewsScreen.jsx`) — Player-level reviews with tabbed categories and history

### Sub-Screens
4. **Player Comparison** — Select two players, compare across radar, bars, and table views
5. **Profile** — Current user stats with overview/stats/history/badges tabs
6. **Settings** — Account, notification, appearance, and data management
7. **Schedule** — Week calendar view + list view of upcoming sessions
8. **Session Detail** — Deep-dive into individual session with roster and attendance
9. **Leaderboard** — Top 3 podium + scrollable ranked list
10. **Drill Library** — Filterable by category and difficulty, with drill detail modals
11. **Coach Directory** — Staff cards with expandable profiles and academy announcements
12. **Player Detail Modal** — Bottom-sheet with radar, skill bars, and progress table

### Shared UI
- `shared.jsx` — ProgressRing, AnimatedBar, EmptyState, SectionHeader
- `PlayerCard.jsx` — Reusable card with compact/default/expanded variants
- `Toast.jsx` — Self-managing toast notification layer
- `LoadingScreen.jsx` — Branded loading state
- `ErrorBoundary.jsx` — Error handler with debug panel
- `Skeletons.jsx` — 10+ skeleton variants for all screen types

---

## Custom Hooks

| Hook                    | Description                                        |
|-------------------------|----------------------------------------------------|
| `useDebouncedValue`     | Debounce rapidly changing values (search inputs)   |
| `useLocalStorage`       | Persist state to localStorage with JSON serialization |
| `useToggle`             | Boolean state with `toggle`, `setTrue`, `setFalse` |
| `usePrevious`           | Access previous render's value                     |
| `useMediaQuery`         | Reactive CSS media query matching                  |
| `useClickOutside`       | Detect clicks outside a referenced element         |
| `useInView`             | Intersection observer for lazy loading             |
| `useTimer`              | Stopwatch with start/stop/reset controls           |
| `useKeyboardShortcuts`  | Global keyboard handler with combo support         |
| `useScrollPosition`     | Reactive window scroll X/Y                         |

---

## State Management

The app uses a **Context + useReducer** pattern (`src/context/AppContext.jsx`):

### State Shape
```js
{
  activeTab,          // current bottom nav tab index
  selectedPlayer,     // currently viewed player object
  timeFilter,         // '30' | '60' | '90' | 'all'
  searchQuery,        // global search input
  overlay,            // 'notifications' | 'search' | 'profile' | 'settings' | null
  notifications,      // array of notification objects
  unreadCount,        // count of unread notifications
  theme,              // 'dark' (extensible)
  sortKey,            // leaderboard sort criterion
  viewMode,           // 'grid' | 'list'
  favorites,          // array of favorited player IDs
  activeSessionId,    // currently viewing session
  breadcrumbs,        // navigation breadcrumb stack
}
```

### Usage
```jsx
import { useApp } from './context/AppContext'

function MyComponent() {
  const [state, actions] = useApp()
  actions.setTab(1)
  actions.toggleFavorite('p001')
}
```

---

## Performance & UX

- **Code splitting**: Vite handles chunk splitting automatically
- **Animation budget**: Framer Motion transitions capped at 60fps with `will-change` hints
- **Skeleton loading**: Every screen has a matching skeleton placeholder to minimize layout shift
- **Safe areas**: Bottom padding accounts for notched devices via `env(safe-area-inset-bottom)`
- **Keyboard navigation**: Focus-visible rings, Escape to close overlays, tab-index management
- **Touch feedback**: `whileTap` scale animations on interactive cards and buttons
- **Scrollbar**: Custom thin dark scrollbar on overlay panels; hidden on horizontal strips

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/awesome-feature`)
3. Commit your changes (`git commit -m 'feat: add awesome feature'`)
4. Push to the branch (`git push origin feat/awesome-feature`)
5. Open a Pull Request

Please follow the existing code style:
- Functional components with hooks
- Named exports for sub-components
- JSDoc-style comments for utility functions
- Tailwind utility classes for styling, custom CSS classes for reusable patterns

---

## License

This project is for educational and portfolio purposes. All mock data including player names, stats, and coach profiles are entirely fictional and do not represent real individuals.

---

**Built with ☕ and 🏏 by the AcademyPro team.**
