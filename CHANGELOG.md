# Changelog

All notable changes to the AcademyPro project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2025-02-22

### Added — Core Player Data
- Created `src/data/mockData.js` with 25 detailed player profiles
- Each player includes name, age, category (U-13 to Senior), role, joined date, avatar URL
- Overall score, attendance percentage, and status indicator per player
- Time-filtered stats object with 30-day, 60-day, 90-day, and all-time breakdowns
- Each period tracks batting, bowling, fielding, fitness, and overall scores

### Added — Extended Player Roster
- Expanded `mockData.js` from 25 to 50 complete player profiles
- Added players p026 through p050 covering all age categories
- Mixed status indicators (improving, stable, declining) for realistic variety
- Academy info constants and current user profile object

### Added — Session & Review Data
- Created `src/data/sessionData.js` with ~522 lines of structured training data
- Upcoming sessions array with dates, coaches, types, and attendee counts
- Session history with completion status and notes
- Attendance data array for chart rendering
- Pending review objects with player references and due dates
- Player highlights with notable achievements and stat snapshots
- Academy-wide radar stats for the analysis screen
- Analysis summaries grouped by time period
- Top performers and needs-attention lists
- Player review entries with timestamps and coach commentary

### Added — Theme & Design System
- Complete dark/orange color palette in `src/index.css` via Tailwind `@theme`
- Colors: dark-950 through dark-100, orange variants, semantic colors (success, danger, warn, info)
- Added muted color variants for badge/chip backgrounds
- Spacing scale: xs (4px) through 2xl (48px)
- Border radius tokens: sm (8px) through full (9999px)
- Shadow system: card, elevated, orange glow, inset
- Typography: Inter as primary, JetBrains Mono for stats
- CSS reset with tap-highlight removal and font smoothing
- Scrollbar utilities: `.hide-scrollbar`, `.thin-scrollbar`
- Recharts overrides for dark theme consistency
- Gradient utilities: orange, subtle, text, dark, success, danger
- Card classes: `.card`, `.card-inner`, `.card-elevated`, `.card-glass`, `.card-glow`
- Progress bar classes with color variants and gradient fill
- Badge system: 7 color variants with border and background
- Button system: primary, secondary, ghost, danger with size modifiers
- Input styles with focus ring and error state
- Overlay and backdrop classes with blur
- Avatar sizing (sm/md/lg/xl) with ring variant
- Skeleton shimmer animation with shape variants
- 10 CSS keyframe animations with utility classes
- Staggered children animation (CSS-only, up to 10 items)
- Typography helpers, dividers, tooltip, focus rings, safe areas, misc utilities

### Added — Utility Functions
- `src/utils/constants.js` with COLORS, ANIM presets, TIME_FILTERS, SKILL_TABS, filterToKey
- `src/utils/helpers.js` with getInitials, getGreeting, clamp, formatDateShort, scoreColor, scoreColorClass, pctColor, debounce, groupByCategory, getTopPlayers, averageStat, nameToHue
- `src/utils/animations.js` with page transition variants, backdrop/bottom-sheet variants, card tap preset, list stagger factory, spring presets, skeleton pulse, toast variants

### Added — Welcome & Onboarding
- `WelcomeScreen.jsx` with animated role selection (Player, Coach, Parent)
- Slide-up animation with role cards and orange gradient CTA
- Persists selection to localStorage via `onboardComplete` flag

### Added — App Shell & Navigation
- Rebuilt `App.jsx` as root orchestrator importing all screens
- Bottom navigation (`BottomNav.jsx`) with 3 tabs and custom SVG icon library
- Exported icons: Bell, Calendar, Gear, CricketBat, Speed, Target, Trophy, User
- Orange active indicator with smooth transitions
- Overlay state management for notifications, search, profile, settings
- Keyboard Escape handler to close overlays
- Navigation helpers object for screen transitions
- Expanded mock notifications (7 items with types and timestamps)
- Feature flags for progressive rollout
- Tab metadata with labels, descriptions, and badge counts

### Added — Home Dashboard
- `HomeScreen.jsx` with Header, WelcomeBanner, TeamCard, PerformanceRing (animated SVG)
- StatsGrid with 4 key metrics, QuickStatsSection, AttendanceStrip
- PendingReviewsList, PlayerHighlightsStrip, UpcomingSessionsList
- LiveSessionBanner component (prepared for future activation)

### Added — Player Card Component
- `PlayerCard.jsx` supporting compact, default, and expanded variants
- Role tag component with category-based color coding
- PlayerChipList for horizontal scrollable player strips
- Framer Motion tap animations and status indicators

### Added — Analysis Screen
- `AnalysisScreen.jsx` with PageHeader, FilterChips, RadarChartCard
- SummaryCard, AcademyAverages, SkillDrillDown with animated bars
- PerformerSection for top players and needs-attention
- CategoryBreakdown with nested skill groups
- CompareToggle and ComparePanel for side-by-side analysis
- Exported StatChip and SkillBar sub-components

### Added — Reviews Screen
- `ReviewsScreen.jsx` with PageHeader, TimeFilterStrip, PlayerSelector
- PlayerHeader with stats overview, TabSelector (Overview/Batting/Bowling/Fielding/Fitness)
- RadarCard, OverallBreakdown, SkillSlider for individual metrics
- AchievementsList, CategoryReview, CoachNotes, HistoryTimeline
- Exported MetricBar and ReviewSummaryRow

### Added — Player Comparison
- `PlayerComparison.jsx` with head-to-head dual player dropdowns
- ScoreBubble, CompareRadar (overlayed dual radar chart)
- CompareBars for side-by-side horizontal bar comparison
- CompareTable with full stat breakdown
- CompareInsights with automated analysis text

### Added — Settings Screen
- `SettingsScreen.jsx` with account, notifications, appearance, data, and about sections
- SettingsRow and ToggleSwitch components
- QuickStat summary at top
- Exported SettingToggle for reuse

### Added — Profile Screen
- `ProfileScreen.jsx` with AvatarCard, SectionTabs, OverviewSection
- StatsSection, HistorySection, BadgesSection
- NotificationPanel overlay with notification list and mark-all-read
- SearchOverlay with player search and recent results

### Added — Shared UI Primitives
- `src/components/ui/shared.jsx` with ProgressRing (animated SVG), AnimatedBar
- EmptyState component with icon and message
- SectionHeader with title, subtitle, and optional action button

### Added — Session Detail Screen
- `SessionDetailScreen.jsx` with Overview, Roster, Attendance, and Notes tabs
- SessionStatusBadge with color-coded status indicators
- Attendance tracking with check-in/check-out toggles

### Added — Leaderboard Screen
- `LeaderboardScreen.jsx` with animated PodiumSpot display (top 3)
- Sortable ranking list with player cards

### Added — Schedule Screen
- `ScheduleScreen.jsx` with CalendarView (week horizontal scroll)
- DateSessions grouping, ListView alternative, TypeDot indicators

### Added — Player Detail Modal
- `PlayerDetailModal.jsx` as bottom-sheet overlay
- Radar chart, skill bars, and progress data table
- Spring animation for smooth open/close

### Added — Extended Animation System
- `src/utils/animations.js` with pageSlideLeft/Right, pageFade
- backdropVariants, bottomSheetVariants, cardTap preset
- listStagger factory and listItem variants
- Spring presets: snappy, gentle, bouncy
- skeletonPulse and toastVariants

### Added — Custom React Hooks
- `src/hooks/useAppHooks.js` with 10 hooks:
  - useDebouncedValue, useLocalStorage, useToggle, usePrevious
  - useMediaQuery, useClickOutside, useInView, useTimer
  - useKeyboardShortcuts, useScrollPosition

### Added — Global State Management
- `src/context/AppContext.jsx` with useReducer pattern
- 17 action types covering navigation, players, filters, overlays, notifications, theme, favorites
- AppProvider component with localStorage rehydration
- useAppState, useAppActions, useApp, and useAppSelector hooks
- Memoized action creators to prevent unnecessary re-renders

### Added — Training Drill Library
- `src/data/drillsData.js` with 20 structured drills across 6 categories
- Categories: Batting, Bowling, Fielding, Fitness, Agility, Mental
- 4 difficulty tiers: Beginner, Intermediate, Advanced, Elite
- Each drill includes sets, reps, rest periods, equipment, steps, coach tips, target skills, calories
- 3 weekly program templates (Batting Masterclass, All-Rounder, Fast Bowling Bootcamp)
- 12 supplementary gym exercises with cricket-specific relevance

### Added — Coach & Staff Data
- `src/data/coachData.js` with 8 detailed coaching staff profiles
- Roles: Head Coach, Batting Coach, Bowling Coach, Fielding Coach, Fitness Trainer, Physiotherapist, Analyst, Mental Coach
- Each profile includes bio, certifications, specializations, availability schedule, rating, achievements, philosophy
- Staff allocation map per age group
- 5 academy announcements with priority levels and tags

### Added — Toast Notification System
- `src/components/ui/Toast.jsx` with ToastProvider and useToast hook
- Auto-dismissing (3.5s) with manual dismiss on click
- 4 types: success, error, warning, info with distinct colors
- Max 4 toasts visible simultaneously
- Spring animations for enter/exit

### Added — Loading Screen
- `src/components/ui/LoadingScreen.jsx` with branded animated loader
- Pulsing rings, spinning inner ring, and bouncing dots
- Optional progress bar with smooth transitions

### Added — Error Boundary
- `src/components/ui/ErrorBoundary.jsx` as class component
- Expandable error details with stack trace
- Try Again and Reload Page buttons
- Console error logging

### Added — Skeleton Loading Components
- `src/components/ui/Skeletons.jsx` with 10+ skeleton variants
- SkeletonText, SkeletonPlayerCard, SkeletonStatsGrid, SkeletonRadarChart
- SkeletonSessionCard, SkeletonReviewItem, SkeletonProfileHeader, SkeletonLeaderboardRow
- Full-page layouts: SkeletonHomePage, SkeletonAnalysisPage, SkeletonReviewsPage

### Added — Drill Library Screen
- `DrillLibraryScreen.jsx` with category and difficulty filtering
- Search across drill names, descriptions, and target skills
- Expandable weekly programs panel
- Drill detail modal with steps, coach tips, equipment, and target skills

### Added — Coach Directory Screen
- `CoachDirectoryScreen.jsx` with role-based filtering
- Announcements panel with priority indicators
- Staff allocation quick glance per age group
- Coach detail modal with full profile, availability, certifications, achievements

### Added — Documentation
- Comprehensive `README.md` with installation, design system, architecture, and API docs
- `CHANGELOG.md` documenting all 20 commits
- `LICENSE` — MIT license
