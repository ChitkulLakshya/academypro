import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ANIM, filterToKey, TIME_FILTERS } from '../utils/constants'
import { getInitials, scoreColor, nameToHue, formatDateShort } from '../utils/helpers'
import { CURRENT_USER, ACADEMY_INFO, players } from '../data/mockData'
import { upcomingSessions, sessionHistory, attendanceData } from '../data/sessionData'

export default function ProfileScreen({ onBack }) {
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <motion.div
      className="px-4 pt-12 pb-4 min-h-screen"
      variants={ANIM.stagger}
      initial="hidden"
      animate="show"
    >
      <ProfileHeader onBack={onBack} />
      <AvatarCard />
      <SectionTabs active={activeSection} onChange={setActiveSection} />

      <AnimatePresence mode="wait">
        {activeSection === 'overview' && <OverviewSection key="overview" />}
        {activeSection === 'stats' && <StatsSection key="stats" />}
        {activeSection === 'history' && <HistorySection key="history" />}
        {activeSection === 'badges' && <BadgesSection key="badges" />}
      </AnimatePresence>
    </motion.div>
  )
}

function ProfileHeader({ onBack }) {
  return (
    <motion.div variants={ANIM.fadeUp} className="flex items-center gap-3 mb-5">
      {onBack && (
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a9a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      <h1 className="text-xl font-bold">Profile</h1>
    </motion.div>
  )
}

function AvatarCard() {
  return (
    <motion.div variants={ANIM.fadeUp} className="card p-5 mb-4 flex flex-col items-center">
      {/* large avatar */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-dark-950 font-bold text-2xl mb-3 ring-4 ring-orange/20 ring-offset-4 ring-offset-dark-900">
        {CURRENT_USER.name.split(' ').map(w => w[0]).join('')}
      </div>
      <h2 className="text-lg font-bold">{CURRENT_USER.name}</h2>
      <p className="text-xs text-dark-400 mt-0.5">{CURRENT_USER.role} · {ACADEMY_INFO.shortName}</p>

      {/* mini stats row */}
      <div className="flex gap-6 mt-4 pt-4 border-t border-dark-700 w-full justify-center">
        <MiniStat label="Sessions" value="42" />
        <MiniStat label="Reviews" value="128" />
        <MiniStat label="Streak" value="12d" />
      </div>
    </motion.div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-base font-bold text-orange">{value}</p>
      <p className="text-[9px] text-dark-500 mt-0.5 uppercase tracking-wider">{label}</p>
    </div>
  )
}

function SectionTabs({ active, onChange }) {
  const tabs = ['overview', 'stats', 'history', 'badges']
  return (
    <motion.div variants={ANIM.fadeUp} className="flex gap-1 bg-dark-800 rounded-xl p-1 mb-4">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex-1 text-[10px] font-semibold py-2 rounded-lg capitalize transition-all
            ${active === t ? 'bg-orange text-dark-950' : 'text-dark-400'}`}
        >
          {t}
        </button>
      ))}
    </motion.div>
  )
}

function OverviewSection() {
  const infoRows = [
    { label: 'Full Name', value: CURRENT_USER.name },
    { label: 'Role', value: CURRENT_USER.role },
    { label: 'Academy', value: ACADEMY_INFO.name },
    { label: 'Age Group', value: ACADEMY_INFO.ageGroup },
    { label: 'Season Record', value: `${ACADEMY_INFO.seasonRecord.wins}W-${ACADEMY_INFO.seasonRecord.losses}L-${ACADEMY_INFO.seasonRecord.draws}D` },
    { label: 'Performance', value: `${ACADEMY_INFO.performancePct}%` },
    { label: 'Overall Rating', value: ACADEMY_INFO.overallRating },
    { label: 'Joined', value: 'Sep 2024' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="card p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3">Information</h3>
        <div className="space-y-3">
          {infoRows.map(r => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-xs text-dark-400">{r.label}</span>
              <span className="text-xs font-semibold">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* recent activity */}
      <div className="card p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-2.5">
          {sessionHistory.slice(0, 5).map(s => (
            <div key={s.id} className="flex items-center gap-3 card-inner p-3">
              <div className={`w-2 h-2 rounded-full ${
                s.type === 'batting' ? 'bg-orange' :
                s.type === 'bowling' ? 'bg-info' :
                s.type === 'fielding' ? 'bg-success' :
                'bg-dark-500'
              }`} />
              <div className="flex-1">
                <p className="text-xs font-medium">{s.title}</p>
                <p className="text-[10px] text-dark-400">{s.date}</p>
              </div>
              <span className="text-[10px] text-dark-500">{s.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function StatsSection() {
  const statCategories = [
    { label: 'Total Sessions Conducted', value: 42, icon: '📅' },
    { label: 'Total Review Hours', value: 186, icon: '⏱️' },
    { label: 'Players Coached', value: 50, icon: '👥' },
    { label: 'Avg Session Rating', value: '4.6/5', icon: '⭐' },
    { label: 'Batting Sessions', value: 18, icon: '🏏' },
    { label: 'Bowling Sessions', value: 12, icon: '🎯' },
    { label: 'Fielding Sessions', value: 8, icon: '🧤' },
    { label: 'Fitness Sessions', value: 4, icon: '💪' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {statCategories.map(s => (
          <div key={s.label} className="card-inner p-3.5 text-center">
            <span className="text-lg block mb-1">{s.icon}</span>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-[9px] text-dark-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* monthly breakdown */}
      <div className="card p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3">Monthly Breakdown</h3>
        {['Jan', 'Feb', 'Mar', 'Apr'].map((month, i) => {
          const val = [8, 12, 10, 12][i]
          return (
            <div key={month} className="flex items-center gap-3 mb-2.5">
              <span className="text-[11px] text-dark-400 w-8">{month}</span>
              <div className="flex-1 h-2 rounded-full bg-dark-700 overflow-hidden">
                <motion.div
                  className="h-full rounded-full gradient-orange"
                  initial={{ width: 0 }}
                  animate={{ width: `${(val / 15) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                />
              </div>
              <span className="text-[11px] font-semibold text-orange w-6 text-right">{val}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function HistorySection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="card p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3">Session History</h3>
        <div className="space-y-2">
          {sessionHistory.map(s => (
            <div key={s.id} className="flex items-center gap-3 card-inner p-3.5">
              <div className="min-w-[42px] text-center">
                <p className="text-xs font-bold text-orange">{s.date.split(' ')[0]}</p>
                <p className="text-[9px] text-dark-500">{s.date.split(' ')[1]}</p>
              </div>
              <div className="w-px h-8 bg-dark-600" />
              <div className="flex-1">
                <p className="text-xs font-semibold">{s.title}</p>
                <p className="text-[10px] text-dark-400">{s.venue} · {s.coach}</p>
              </div>
              <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                s.status === 'completed' ? 'bg-success/10 text-success' :
                s.status === 'cancelled' ? 'bg-danger/10 text-danger' :
                'bg-dark-700 text-dark-400'
              }`}>
                {s.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function BadgesSection() {
  const badges = [
    { emoji: '🏆', title: 'Season MVP', desc: 'Top coach rating this season', earned: true },
    { emoji: '🔥', title: '10-Day Streak', desc: 'Active for 10 consecutive days', earned: true },
    { emoji: '📊', title: 'Data Guru', desc: 'Reviewed 100+ player sessions', earned: true },
    { emoji: '⭐', title: 'Five Star', desc: 'Maintained 5.0 avg rating', earned: false },
    { emoji: '💎', title: 'Diamond Coach', desc: 'Complete 200 sessions', earned: false },
    { emoji: '🎯', title: 'Sharpshooter', desc: 'All reviews submitted on time', earned: false },
    { emoji: '🏅', title: 'Gold Standard', desc: '95%+ attendance rate', earned: true },
    { emoji: '📈', title: 'Trend Setter', desc: 'Improved team avg by 10%', earned: false },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {badges.map(b => (
          <div
            key={b.title}
            className={`card-inner p-4 text-center transition-opacity ${!b.earned ? 'opacity-40' : ''}`}
          >
            <span className="text-2xl block mb-2">{b.emoji}</span>
            <p className="text-xs font-semibold">{b.title}</p>
            <p className="text-[9px] text-dark-400 mt-0.5">{b.desc}</p>
            {b.earned && (
              <span className="inline-block mt-2 text-[9px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                Earned
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Notification Panel ────────────────────────────────────
export function NotificationPanel({ notifications, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-dark-950/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 max-h-[85vh] overflow-y-auto bg-dark-900 rounded-b-3xl border-b border-dark-700 px-4 pt-12 pb-6"
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        exit={{ y: -40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Notifications</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-dark-400 hover:text-dark-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-8">
            <span className="text-3xl block mb-2">🔔</span>
            <p className="text-sm text-dark-400">No notifications yet</p>
          </div>
        )}

        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id || i}
              className="flex items-start gap-3 card-inner p-3.5"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <span className="text-lg shrink-0 mt-0.5">{n.icon || '🔔'}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold">{n.title}</p>
                <p className="text-[10px] text-dark-400 mt-0.5 leading-relaxed">{n.message}</p>
                <p className="text-[9px] text-dark-600 mt-1">{n.time || '2m ago'}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-orange shrink-0 mt-1.5" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Search Overlay ────────────────────────────────────────
export function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo(() => {
    if (query.length < 2) return []
    const q = query.toLowerCase()
    return players
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        String(p.jerseyNumber).includes(q)
      )
      .slice(0, 10)
  }, [query])

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="px-4 pt-12 pb-4 max-h-screen overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search players, categories..."
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:border-orange/40 transition-colors"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                onClick={() => setQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xs font-medium text-orange"
          >
            Cancel
          </button>
        </div>

        {/* recent searches */}
        {query.length < 2 && (
          <div className="card p-4">
            <h3 className="text-[11px] text-dark-500 font-semibold uppercase tracking-wider mb-3">Recent</h3>
            <div className="space-y-2">
              {['Arjun Patel', 'U-17 category', 'All-Rounder'].map(term => (
                <button
                  key={term}
                  className="flex items-center gap-2.5 w-full text-left py-1.5"
                  onClick={() => setQuery(term)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-xs text-dark-300">{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* results */}
        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-dark-500 font-medium mb-1">{results.length} results</p>
            {results.map(p => (
              <div key={p.id} className="flex items-center gap-3 card-inner p-3.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ backgroundColor: `hsl(${nameToHue(p.name)}, 40%, 18%)` }}
                >
                  {getInitials(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-[10px] text-dark-400">{p.category} · {p.role} · #{p.jerseyNumber}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="text-center py-10">
            <span className="text-3xl block mb-2">🔍</span>
            <p className="text-sm text-dark-400">No players found for "{query}"</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
