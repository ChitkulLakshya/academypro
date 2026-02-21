import { motion } from 'framer-motion'

// stagger children in — keeps scroll feeling zippy
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function HomeScreen() {
  return (
    <motion.div
      className="px-4 pt-14 pb-4"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <Header />
      <CurrentSession />
      <AttendanceStrip />
      <PendingReviews />
      <PlayerHighlights />
      <UpcomingSessions />
    </motion.div>
  )
}

function Header() {
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
      <div>
        <p className="text-slate-400 text-xs font-medium tracking-wide uppercase">{greeting}</p>
        <h1 className="text-2xl font-bold tracking-tight mt-0.5">
          Academy<span className="text-brand-light">Pro</span>
        </h1>
      </div>
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-brand-light">
          AP
        </div>
        {/* notif dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-danger rounded-full border-2 border-slate-950" />
      </div>
    </motion.div>
  )
}

function CurrentSession() {
  return (
    <motion.div variants={fadeUp} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand/20 via-slate-900 to-slate-900 border border-brand/20 p-5 mb-4">
      {/* decorative circle — purely vibes */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-brand/10 blur-2xl" />

      <div className="flex items-start justify-between relative">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            Live Now
          </span>
          <h2 className="text-lg font-bold leading-tight">Net Practice – Batting</h2>
          <p className="text-slate-400 text-sm mt-1">02:30 PM · Main Nets</p>
        </div>
        <div className="bg-brand/20 rounded-xl p-2.5 mt-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a29bfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

function AttendanceStrip() {
  const items = [
    { label: 'Checked In', value: 0, color: 'text-success' },
    { label: 'Checked Out', value: 0, color: 'text-slate-400' },
    { label: 'Unmarked', value: 10, color: 'text-warn' },
  ]

  return (
    <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2.5 mb-4">
      {items.map(it => (
        <div key={it.label} className="bg-slate-900 border border-slate-800/70 rounded-xl p-3.5 text-center">
          <p className={`text-2xl font-bold ${it.color}`}>{it.value}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{it.label}</p>
        </div>
      ))}
    </motion.div>
  )
}

function PendingReviews() {
  const players = ['Aditya J.', 'Ananya S.', 'Arjun P.']

  return (
    <motion.div variants={fadeUp} className="bg-slate-900 border border-slate-800/70 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Pending Reviews</h3>
        <span className="text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-full">
          {players.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {players.map((name, i) => (
          <div key={name} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-semibold text-brand-light">
                {name.split(' ').map(w => w[0]).join('')}
              </div>
              <span className="text-sm">{name}</span>
            </div>
            <button className="text-xs font-medium text-brand-light bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded-lg transition-colors">
              Review
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function PlayerHighlights() {
  const highlights = [
    { name: 'Arjun P.', stat: 'Top Batting Avg', badge: '92.3', positive: true },
    { name: 'Ananya S.', stat: 'Best Bowling Eco', badge: '3.2', positive: true },
    { name: 'Vikram K.', stat: 'Fitness Score', badge: '68', positive: false },
  ]

  return (
    <motion.div variants={fadeUp} className="mb-4">
      <h3 className="font-semibold text-sm mb-3">Player Highlights</h3>
      <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
        {highlights.map(h => (
          <div key={h.name} className="flex-shrink-0 w-[155px] bg-slate-900 border border-slate-800/70 rounded-xl p-3.5">
            <p className="text-xs text-slate-400 mb-1">{h.stat}</p>
            <p className="text-sm font-semibold mb-2">{h.name}</p>
            <span className={`text-lg font-bold ${h.positive ? 'text-success' : 'text-warn'}`}>
              {h.badge}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function UpcomingSessions() {
  const sessions = [
    { time: '04:00 PM', title: 'Fielding Drills', venue: 'Ground B' },
    { time: '05:30 PM', title: 'Bowling Practice', venue: 'Main Nets' },
  ]

  return (
    <motion.div variants={fadeUp}>
      <h3 className="font-semibold text-sm mb-3">Upcoming Sessions</h3>
      <div className="space-y-2.5">
        {sessions.map(s => (
          <div key={s.time} className="flex items-center gap-4 bg-slate-900 border border-slate-800/70 rounded-xl p-4">
            <div className="text-center min-w-[52px]">
              <p className="text-brand-light font-bold text-sm">{s.time.split(' ')[0]}</p>
              <p className="text-[10px] text-slate-500 font-medium">{s.time.split(' ')[1]}</p>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div>
              <p className="text-sm font-semibold">{s.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.venue}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
