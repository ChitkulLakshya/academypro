import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BottomNav from './components/BottomNav'
import HomeScreen from './components/HomeScreen'
import AnalysisScreen from './components/AnalysisScreen'
import ReviewsScreen from './components/ReviewsScreen'
import WelcomeScreen from './components/WelcomeScreen'

const TABS = ['home', 'analysis', 'reviews']

export default function App() {
  const [tab, setTab] = useState('home')
  // check if user has completed onboarding before
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('ap_onboarded')
  })
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('ap_role') || 'coach'
  })

  const handleOnboardingComplete = (role) => {
    setUserRole(role)
    localStorage.setItem('ap_role', role)
    localStorage.setItem('ap_onboarded', '1')
    setShowWelcome(false)
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleOnboardingComplete} />
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
}

// feature flags — flip these to enable/disable stuff without deploys
// TODO: wire this up to a remote config service
export const FEATURE_FLAGS = {
  showWelcomeScreen: true,
  enablePlayerComparison: false,
  enableExportPDF: false,
  showAttendanceTrends: true,
  enablePushNotifications: false,
  showCoachNotes: true,
  enableVideoPlayback: false,
  maxRecentAchievements: 3,
  showPerformanceRing: true,
  enableDarkMode: true, // lol its always dark
}

// notification types for the bell icon
export const NOTIFICATION_TYPES = {
  SESSION_REMINDER: 'session_reminder',
  REVIEW_PENDING: 'review_pending',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  ATTENDANCE_ALERT: 'attendance_alert',
  SCHEDULE_CHANGE: 'schedule_change',
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
]
