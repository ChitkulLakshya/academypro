import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ROLES = [
  {
    id: 'player',
    label: 'Player',
    desc: 'Track Performance, View Stats.',
    emoji: '🏆',
  },
  {
    id: 'coach',
    label: 'Coach',
    desc: 'Manage Team, Track Players.',
    emoji: '📋',
  },
  {
    id: 'parent',
    label: 'Parent',
    desc: 'Track Child Progress Easily.',
    emoji: '👨‍👩‍👦',
  },
]

// hero images — hardcoded placeholders, swap with real assets later
const HERO_SLIDES = [
  {
    gradient: 'from-orange/30 via-orange-dark/20 to-transparent',
    title: 'Train Like Champions',
    subtitle: 'Professional coaching methodology',
  },
  {
    gradient: 'from-success/20 via-dark-900/80 to-transparent',
    title: 'Track Every Metric',
    subtitle: 'Data-driven player development',
  },
  {
    gradient: 'from-info/20 via-dark-900/80 to-transparent',
    title: 'Build Team Spirit',
    subtitle: 'Connect coaches, players & parents',
  },
]

export default function WelcomeScreen({ onComplete }) {
  const [selectedRole, setSelectedRole] = useState('coach')
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleContinue = () => {
    // TODO: persist role selection to context/localStorage
    onComplete(selectedRole)
  }

  return (
    <div className="min-h-dvh bg-dark-900 flex flex-col">
      {/* hero area */}
      <div className="relative h-[280px] overflow-hidden rounded-b-[32px]">
        <div className={`absolute inset-0 bg-gradient-to-b ${HERO_SLIDES[currentSlide].gradient}`} />

        {/* decorative sports elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-orange/5 blur-3xl" />
        </div>

        {/* sports icon grid — gives visual texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-5 gap-6 p-8 rotate-12 scale-125">
            {['⚽', '🏏', '🎯', '🏃', '💪', '🏆', '⭐', '📊', '🎓', '🔥',
              '🏅', '👟', '🥅', '🎾', '🏸', '⚾', '🏐', '🎖️', '💯', '🌟',
              '🏑', '🎪', '⛹️', '🤸', '🏋️'].map((e, i) => (
              <span key={i} className="text-2xl">{e}</span>
            ))}
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center"
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white mb-1">
            {HERO_SLIDES[currentSlide].title}
          </h2>
          <p className="text-sm text-dark-300">
            {HERO_SLIDES[currentSlide].subtitle}
          </p>
        </motion.div>
      </div>

      {/* main content */}
      <div className="flex-1 px-5 pt-8 pb-6 flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-bold leading-tight">
            Welcome to<br />
            <span className="text-orange">Sports Academy</span>
          </h1>
          <p className="text-dark-300 text-sm mt-2">Choose your role to get started</p>
        </div>

        {/* role cards */}
        <div className="space-y-3 flex-1">
          {ROLES.map((role, idx) => {
            const isSelected = selectedRole === role.id
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200
                  ${isSelected
                    ? 'bg-dark-700 border-orange/40 shadow-[0_0_20px_rgba(245,166,35,0.1)]'
                    : 'bg-dark-800 border-dark-600 hover:border-dark-500'
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl
                  ${isSelected ? 'gradient-orange' : 'bg-dark-600'}`}>
                  {role.emoji}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-[15px]">{role.label}</p>
                  <p className="text-xs text-dark-300 mt-0.5">{role.desc}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected
                    ? 'border-orange bg-orange'
                    : 'border-dark-400'
                  }`}>
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        <p className="text-center text-dark-400 text-[11px] mt-4 mb-4">
          You can change your role anytime in settings
        </p>

        {/* pagination dots + continue */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300
                  ${i === currentSlide ? 'w-6 bg-orange' : 'w-2 bg-dark-500'}`}
              />
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="w-14 h-14 rounded-full gradient-orange flex items-center justify-center shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

// sub-export: compact role badge used on settings page later
export function RoleBadge({ role }) {
  const cfg = ROLES.find(r => r.id === role) || ROLES[0]
  return (
    <div className="inline-flex items-center gap-2 bg-dark-700 border border-dark-600 rounded-full px-3 py-1.5">
      <span className="text-sm">{cfg.emoji}</span>
      <span className="text-xs font-medium text-dark-200">{cfg.label}</span>
    </div>
  )
}

// role descriptions for the settings page
export const ROLE_DESCRIPTIONS = {
  player: 'Access your personal performance dashboard, view your stats over time, and track individual session feedback from coaches.',
  coach: 'Manage your academy roster, track player performance, create session reviews, and monitor attendance across all groups.',
  parent: 'Monitor your childs progress at the academy, view session reports, and stay updated on upcoming schedules and achievements.',
}

// onboarding tips shown after role selection
export const ONBOARDING_TIPS = {
  player: [
    'Check your dashboard daily for updated performance metrics',
    'Review coach feedback after each session',
    'Set personal goals in the Goals tab',
    'Compare your stats with academy averages',
  ],
  coach: [
    'Mark attendance at the start of each session',
    'Submit player reviews within 24 hours of session end',
    'Use the Analysis tab to identify academy-wide trends',
    'Tap any player card for detailed individual breakdown',
  ],
  parent: [
    'Your childs latest session review appears on the home screen',
    'Check attendance history in the profile section',
    'Enable notifications for session reminders',
    'Use the comparison view to track progress over time',
  ],
}

// placeholder avatar colors based on role — gives visual distinction
export const ROLE_AVATAR_STYLES = {
  player: { bg: 'bg-info/20', text: 'text-info', border: 'border-info/30' },
  coach: { bg: 'bg-orange/20', text: 'text-orange', border: 'border-orange/30' },
  parent: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/30' },
}
