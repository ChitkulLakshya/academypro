import { motion } from 'framer-motion'
import { ANIM, COLORS } from '../utils/constants'
import { getGreeting, getInitials } from '../utils/helpers'
import { ACADEMY_INFO, CURRENT_USER, players } from '../data/mockData'
import { attendanceData, pendingReviews, playerHighlights, upcomingSessions } from '../data/sessionData'
import { BellIcon, SpeedIcon, TargetIcon, TrophyIcon } from './BottomNav'

export default function HomeScreen({ role }) {
  return (
    <motion.div
      className="px-4 pt-12 pb-4"
      variants={ANIM.stagger}
      initial="hidden"
      animate="show"
    >
      <Header />
      <WelcomeBanner />
      <TeamCard />
      <PerformanceRing />
      <StatsGrid />
      <QuickStatsSection />
      <AttendanceStrip />
      <PendingReviewsList />
      <PlayerHighlightsStrip />
      <UpcomingSessionsList />
    </motion.div>
  )
}

function Header() {
  return (
    <motion.div variants={ANIM.fadeUp} className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        {/* avatar — hardcoded for now, swap with real img later */}
        <div className="w-10 h-10 rounded-full bg-dark-700 border border-dark-600 overflow-hidden flex items-center justify-center">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
        <div>
          <p className="text-dark-300 text-xs">Hi 👋</p>
          <p className="font-semibold text-sm">{CURRENT_USER.name}</p>
        </div>
      </div>
      <button className="w-10 h-10 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center">
        <BellIcon hasNotif />
      </button>
    </motion.div>
  )
}

function WelcomeBanner() {
  return (
    <motion.div variants={ANIM.fadeUp} className="mb-5 mt-2">
      <h1 className="text-[26px] font-bold leading-tight">
        Welcome Back,<br />
        <span className="text-orange">Track Performance</span>
      </h1>
    </motion.div>
  )
}

function TeamCard() {
  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange/15 flex items-center justify-center">
            <span className="text-lg">⚽</span>
          </div>
          <div>
            <p className="font-semibold text-sm">{ACADEMY_INFO.shortName} {ACADEMY_INFO.ageGroup}</p>
            <p className="text-[11px] text-dark-300">{ACADEMY_INFO.seasonRecord.wins}W - {ACADEMY_INFO.seasonRecord.losses}L - {ACADEMY_INFO.seasonRecord.draws}D</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center">
          <span className="text-sm font-bold text-orange">{ACADEMY_INFO.overallRating}</span>
        </div>
      </div>
    </motion.div>
  )
}

function PerformanceRing() {
  const pct = ACADEMY_INFO.performancePct
  // SVG ring math
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <motion.div variants={ANIM.fadeUp} className="card p-5 mb-4 flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#2c2c2e" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke="url(#orangeGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
          <defs>
            <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF9F0A" />
              <stop offset="100%" stopColor="#F5A623" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{pct}%</span>
        </div>
      </div>
      {/* progress bar version underneath */}
      <div className="w-full mt-4">
        <div className="progress-track h-2">
          <motion.div
            className="progress-fill h-full gradient-orange"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

function StatsGrid() {
  const stats = [
    { icon: SpeedIcon, label: 'Speed', value: 82, color: '#FF9F0A' },
    { icon: TargetIcon, label: 'Passing', value: 82, color: '#30D158' },
    { icon: () => <span className="text-base">💪</span>, label: 'Stamina', value: 75, color: '#FF453A' },
    { icon: TrophyIcon, label: 'Shooting', value: 85, color: '#FFD60A' },
  ]

  return (
    <motion.div variants={ANIM.fadeUp} className="grid grid-cols-2 gap-3 mb-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="card-inner p-4 flex flex-col items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * i + 0.3, duration: 0.3 }}
        >
          <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center">
            <s.icon size={18} color={s.color} />
          </div>
          <span className="text-2xl font-bold">{s.value}</span>
          <span className="text-[11px] text-dark-300">{s.label}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

function QuickStatsSection() {
  const items = [
    { label: 'Goals This Season', value: '24', emoji: '⚽' },
    { label: 'Training Hours', value: '186', emoji: '⏱️' },
    { label: 'Team Rank', value: '#3', emoji: '🏆' },
    { label: 'Win Rate', value: '64%', emoji: '📊' },
  ]

  return (
    <motion.div variants={ANIM.fadeUp} className="mb-4">
      <h3 className="font-semibold text-sm mb-3">Quick Stats</h3>
      <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
        {items.map(it => (
          <div key={it.label} className="flex-shrink-0 w-[130px] card-inner p-3.5 text-center">
            <span className="text-xl mb-1 block">{it.emoji}</span>
            <p className="text-lg font-bold">{it.value}</p>
            <p className="text-[10px] text-dark-400 mt-0.5">{it.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function AttendanceStrip() {
  const { checkedIn, checkedOut, unmarked } = attendanceData.currentSession
  const items = [
    { label: 'Checked In', value: checkedIn, color: 'text-success' },
    { label: 'Checked Out', value: checkedOut, color: 'text-dark-300' },
    { label: 'Unmarked', value: unmarked, color: 'text-warn' },
  ]

  return (
    <motion.div variants={ANIM.fadeUp} className="grid grid-cols-3 gap-2.5 mb-4">
      {items.map(it => (
        <div key={it.label} className="card-inner p-3.5 text-center">
          <p className={`text-2xl font-bold ${it.color}`}>{it.value}</p>
          <p className="text-[11px] text-dark-400 mt-0.5 font-medium">{it.label}</p>
        </div>
      ))}
    </motion.div>
  )
}

function PendingReviewsList() {
  if (pendingReviews.length === 0) return null

  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Pending Reviews</h3>
        <span className="text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-full">
          {pendingReviews.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {pendingReviews.map((rev) => (
          <div key={rev.playerId} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center text-[11px] font-semibold text-orange">
                {getInitials(rev.name)}
              </div>
              <div>
                <span className="text-sm">{rev.name}</span>
                <p className="text-[10px] text-dark-400">{rev.sessionDate}</p>
              </div>
            </div>
            <button className="text-xs font-medium text-orange bg-orange/10 hover:bg-orange/20 active:bg-orange/25 px-3 py-1.5 rounded-lg transition-colors">
              Review
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function PlayerHighlightsStrip() {
  return (
    <motion.div variants={ANIM.fadeUp} className="mb-4">
      <h3 className="font-semibold text-sm mb-3">Player Highlights</h3>
      <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
        {playerHighlights.map(h => {
          const isPositive = h.trend === 'up'
          return (
            <div key={h.playerId} className="flex-shrink-0 w-[155px] card-inner p-3.5">
              <p className="text-xs text-dark-300 mb-1">{h.stat}</p>
              <p className="text-sm font-semibold mb-2">{h.name}</p>
              <div className="flex items-center gap-1">
                <span className={`text-lg font-bold ${isPositive ? 'text-success' : 'text-warn'}`}>
                  {h.value}
                </span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke={isPositive ? '#30D158' : '#FFD60A'} strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  className={isPositive ? '' : 'rotate-180'}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function UpcomingSessionsList() {
  // only show next 3
  const upcoming = upcomingSessions.filter(s => s.status !== 'live').slice(0, 3)

  return (
    <motion.div variants={ANIM.fadeUp}>
      <h3 className="font-semibold text-sm mb-3">Upcoming Sessions</h3>
      <div className="space-y-2.5">
        {upcoming.map(s => (
          <div key={s.id} className="flex items-center gap-4 card-inner p-4">
            <div className="text-center min-w-[52px]">
              <p className="text-orange font-bold text-sm">{s.time.split(' ')[0]}</p>
              <p className="text-[10px] text-dark-400 font-medium">{s.time.split(' ')[1]}</p>
            </div>
            <div className="w-px h-8 bg-dark-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{s.title}</p>
              <p className="text-xs text-dark-400 mt-0.5">{s.venue} · {s.coach}</p>
            </div>
            {/* session type dot */}
            <div className={`w-2 h-2 rounded-full ${
              s.type === 'batting' ? 'bg-orange' :
              s.type === 'bowling' ? 'bg-info' :
              s.type === 'fielding' ? 'bg-success' :
              s.type === 'fitness' ? 'bg-danger' :
              'bg-warn'
            }`} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// live session banner — currently unused, keeping for later
function LiveSessionBanner() {
  const liveSession = upcomingSessions.find(s => s.status === 'live')
  if (!liveSession) return null

  return (
    <motion.div variants={ANIM.fadeUp} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange/20 via-dark-800 to-dark-800 border border-orange/20 p-5 mb-4">
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-orange/10 blur-2xl" />
      <div className="flex items-start justify-between relative">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-success bg-success/10 px-2.5 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-success rounded-full live-dot" />
            Live Now
          </span>
          <h2 className="text-lg font-bold leading-tight">{liveSession.title}</h2>
          <p className="text-dark-300 text-sm mt-1">{liveSession.time} · {liveSession.venue}</p>
        </div>
        <div className="bg-orange/20 rounded-xl p-2.5 mt-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
