import { useState, useEffect, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BottomNav from './components/BottomNav'
import HomeScreen from './components/HomeScreen'
import AnalysisScreen from './components/AnalysisScreen'
import ReviewsScreen from './components/ReviewsScreen'
import WelcomeScreen from './components/WelcomeScreen'
import PlayerComparison from './components/PlayerComparison'
import SettingsScreen from './components/SettingsScreen'
import ProfileScreen, { NotificationPanel, SearchOverlay } from './components/ProfileScreen'
import SessionDetailScreen from './components/SessionDetailScreen'
import LeaderboardScreen from './components/LeaderboardScreen'
import ScheduleScreen from './components/ScheduleScreen'
import { PlayerDetailModal } from './components/PlayerDetailModal'

const PRIMARY_TABS = ['home', 'analysis', 'reviews']
const OVERLAY_SCREENS = ['settings', 'profile', 'compare', 'session', 'leaderboard', 'schedule']

export default function App() {
  const [tab, setTab] = useState('home')
  const [overlay, setOverlay] = useState(null) // settings | profile | compare | session | leaderboard | schedule | null
  const [showNotifs, setShowNotifs] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  // onboarding state
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('ap_onboarded'))
  const [userRole, setUserRole] = useState(() => localStorage.getItem('ap_role') || 'coach')

  // build notification list from mock data
  const notifications = useMemo(() => mockNotifications.map(n => ({
    id: n.id,
    icon: notifIcons[n.type] || '🔔',
    title: n.title,
    message: n.body,
    time: formatTimeAgo(n.timestamp),
    read: n.read,
  })), [])

  const handleOnboardingComplete = useCallback((role) => {
    setUserRole(role)
    localStorage.setItem('ap_role', role)
    localStorage.setItem('ap_onboarded', '1')
    setShowWelcome(false)
  }, [])

  const closeOverlay = useCallback(() => setOverlay(null), [])
  const closeNotifs = useCallback(() => setShowNotifs(false), [])
  const closeSearch = useCallback(() => setShowSearch(false), [])
  const closePlayerModal = useCallback(() => setSelectedPlayer(null), [])

  // expose navigation helpers for child screens
  const nav = useMemo(() => ({
    goToSettings: () => setOverlay('settings'),
    goToProfile: () => setOverlay('profile'),
    goToCompare: () => setOverlay('compare'),
    goToLeaderboard: () => setOverlay('leaderboard'),
    goToSchedule: () => setOverlay('schedule'),
    openSession: (id) => { setSessionId(id); setOverlay('session') },
    openSearch: () => setShowSearch(true),
    openNotifs: () => setShowNotifs(true),
    openPlayer: (player) => setSelectedPlayer(player),
  }), [])

  // keyboard shortcut — Escape closes overlays
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (selectedPlayer) { setSelectedPlayer(null); return }
        if (showSearch) { setShowSearch(false); return }
        if (showNotifs) { setShowNotifs(false); return }
        if (overlay) { setOverlay(null); return }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedPlayer, showSearch, showNotifs, overlay])

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleOnboardingComplete} />
  }

  // overlay screens replace the main tab view
  if (overlay) {
    return (
      <div className="relative min-h-dvh bg-dark-900 overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-orange/[0.04] blur-[120px]" />
        <AnimatePresence mode="wait">
          {overlay === 'settings' && <SettingsScreen key="settings" onBack={closeOverlay} />}
          {overlay === 'profile' && <ProfileScreen key="profile" onBack={closeOverlay} />}
          {overlay === 'compare' && <PlayerComparison key="compare" />}
          {overlay === 'leaderboard' && <LeaderboardScreen key="lb" />}
          {overlay === 'schedule' && <ScheduleScreen key="sched" />}
          {overlay === 'session' && (
            <SessionDetailScreen key="session" sessionId={sessionId} onBack={closeOverlay} />
          )}
        </AnimatePresence>
        {/* back floating button for overlays without built-in back */}
        {['compare', 'leaderboard', 'schedule'].includes(overlay) && (
          <button
            onClick={closeOverlay}
            className="fixed top-4 left-4 z-50 w-9 h-9 rounded-full bg-dark-800/80 backdrop-blur border border-dark-700 flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a9a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="relative min-h-dvh bg-dark-900 pb-24 overflow-hidden">
      {/* subtle top glow — warm orange ambient light */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-orange/[0.04] blur-[120px]" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {tab === 'home' && <HomeScreen role={userRole} />}
          {tab === 'analysis' && <AnalysisScreen />}
          {tab === 'reviews' && <ReviewsScreen />}
        </motion.div>
      </AnimatePresence>

      <BottomNav active={tab} onChange={setTab} />

      {/* modals / overlays */}
      <AnimatePresence>
        {showNotifs && <NotificationPanel notifications={notifications} onClose={closeNotifs} />}
        {showSearch && <SearchOverlay onClose={closeSearch} />}
        {selectedPlayer && <PlayerDetailModal player={selectedPlayer} onClose={closePlayerModal} />}
      </AnimatePresence>
    </div>
  )
}

// exported so settings can trigger re-onboarding
export function resetOnboarding() {
  localStorage.removeItem('ap_onboarded')
  localStorage.removeItem('ap_role')
  window.location.reload()
}

// app-level config — might move to context if it grows
export const APP_CONFIG = {
  appName: 'AcademyPro',
  version: '1.0.0',
  maxPlayersPerSession: 15,
  defaultTimeFilter: '30 Days',
  enableAnimations: true,
  debugMode: false,
}

// tab metadata for potential deep linking later
export const TAB_META = {
  home: { title: 'Home', icon: 'home', requiresAuth: false },
  analysis: { title: 'Analysis', icon: 'chart', requiresAuth: true },
  reviews: { title: 'Reviews', icon: 'star', requiresAuth: true },
  settings: { title: 'Settings', icon: 'gear', requiresAuth: true },
  profile: { title: 'Profile', icon: 'user', requiresAuth: true },
  compare: { title: 'Compare', icon: 'compare', requiresAuth: true },
  leaderboard: { title: 'Leaderboard', icon: 'trophy', requiresAuth: true },
  schedule: { title: 'Schedule', icon: 'calendar', requiresAuth: true },
}

// feature flags — flip these to enable/disable stuff without deploys
export const FEATURE_FLAGS = {
  showWelcomeScreen: true,
  enablePlayerComparison: true,
  enableExportPDF: false,
  showAttendanceTrends: true,
  enablePushNotifications: false,
  showCoachNotes: true,
  enableVideoPlayback: false,
  maxRecentAchievements: 3,
  showPerformanceRing: true,
  enableDarkMode: true,
  enableLeaderboard: true,
  enableScheduleView: true,
  enableSearch: true,
  enablePlayerDetailModal: true,
}

// notification type → icon mapping
const notifIcons = {
  session_reminder: '📅',
  review_pending: '📝',
  achievement_unlocked: '🏆',
  attendance_alert: '⚠️',
  schedule_change: '🔄',
}

// notification types for the bell icon
export const NOTIFICATION_TYPES = {
  SESSION_REMINDER: 'session_reminder',
  REVIEW_PENDING: 'review_pending',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  ATTENDANCE_ALERT: 'attendance_alert',
  SCHEDULE_CHANGE: 'schedule_change',
}

// time-ago helper
function formatTimeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

// mock notifications — would come from push service
export const mockNotifications = [
  {
    id: 'notif_001',
    type: NOTIFICATION_TYPES.SESSION_REMINDER,
    title: 'Net Practice in 30 min',
    body: 'Batting session starts at 2:30 PM at Main Nets',
    timestamp: '2026-02-21T14:00:00',
    read: false,
  },
  {
    id: 'notif_002',
    type: NOTIFICATION_TYPES.REVIEW_PENDING,
    title: '3 Reviews Pending',
    body: 'Complete reviews for Aditya, Ananya, and Arjun',
    timestamp: '2026-02-21T10:00:00',
    read: false,
  },
  {
    id: 'notif_003',
    type: NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED,
    title: 'Arjun hit a milestone!',
    body: 'Batting average crossed 90 — academy record',
    timestamp: '2026-02-20T16:30:00',
    read: true,
  },
  {
    id: 'notif_004',
    type: NOTIFICATION_TYPES.ATTENDANCE_ALERT,
    title: 'Low attendance yesterday',
    body: 'Only 6 out of 8 attended bowling practice',
    timestamp: '2026-02-20T08:00:00',
    read: true,
  },
  {
    id: 'notif_005',
    type: NOTIFICATION_TYPES.SCHEDULE_CHANGE,
    title: 'Schedule Update',
    body: 'Fielding drills moved from 3 PM to 4 PM tomorrow',
    timestamp: '2026-02-19T18:00:00',
    read: true,
  },
  {
    id: 'notif_006',
    type: NOTIFICATION_TYPES.SESSION_REMINDER,
    title: 'Bowling Practice Tomorrow',
    body: 'Don\'t forget — 10 AM at Indoor Nets',
    timestamp: '2026-02-19T14:00:00',
    read: true,
  },
  {
    id: 'notif_007',
    type: NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED,
    title: 'Ananya earned a badge!',
    body: 'Best bowling economy this month — 3.2',
    timestamp: '2026-02-18T12:00:00',
    read: true,
  },
]
