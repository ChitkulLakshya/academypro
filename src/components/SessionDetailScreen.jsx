import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ANIM } from '../utils/constants'
import { getInitials, nameToHue, scoreColor } from '../utils/helpers'
import { upcomingSessions, sessionHistory } from '../data/sessionData'
import { players } from '../data/mockData'
import { ProgressRing, AnimatedBar, EmptyState, SectionHeader } from './ui/shared'

export default function SessionDetailScreen({ sessionId, onBack }) {
  const session = upcomingSessions.find(s => s.id === sessionId) ||
                  sessionHistory.find(s => s.id === sessionId) ||
                  upcomingSessions[0]

  const [activeTab, setActiveTab] = useState('overview')

  // roster for this session — just grab first 15 players as mock
  const roster = useMemo(() => players.slice(0, 15), [])

  return (
    <motion.div
      className="px-4 pt-12 pb-4 min-h-screen"
      variants={ANIM.stagger}
      initial="hidden"
      animate="show"
    >
      {/* back + header */}
      <motion.div variants={ANIM.fadeUp} className="flex items-center gap-3 mb-5">
        {onBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a9a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-lg font-bold">{session.title}</h1>
          <p className="text-xs text-dark-400 mt-0.5">{session.time} · {session.venue}</p>
        </div>
      </motion.div>

      {/* session status badge */}
      <motion.div variants={ANIM.fadeUp} className="mb-4">
        <SessionStatusBadge status={session.status} type={session.type} />
      </motion.div>

      {/* tab strip */}
      <motion.div variants={ANIM.fadeUp} className="flex gap-1 bg-dark-800 rounded-xl p-1 mb-4">
        {['overview', 'roster', 'attendance', 'notes'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 text-[10px] font-semibold py-2 rounded-lg capitalize transition-all
              ${activeTab === t ? 'bg-orange text-dark-950' : 'text-dark-400'}`}
          >
            {t}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && <OverviewTab key="ov" session={session} rosterCount={roster.length} />}
        {activeTab === 'roster' && <RosterTab key="ro" roster={roster} />}
        {activeTab === 'attendance' && <AttendanceTab key="at" roster={roster} />}
        {activeTab === 'notes' && <NotesTab key="no" session={session} />}
      </AnimatePresence>
    </motion.div>
  )
}

function SessionStatusBadge({ status, type }) {
  const statusColors = {
    live: 'bg-success/10 text-success border-success/20',
    upcoming: 'bg-orange/10 text-orange border-orange/20',
    completed: 'bg-dark-700 text-dark-300 border-dark-600',
    cancelled: 'bg-danger/10 text-danger border-danger/20',
  }
  const typeIcons = {
    batting: '🏏',
    bowling: '🎯',
    fielding: '🧤',
    fitness: '💪',
    match: '⚔️',
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColors[status] || statusColors.upcoming}`}>
        {status === 'live' && <span className="inline-block w-1.5 h-1.5 bg-success rounded-full mr-1.5 live-dot" />}
        {status || 'Upcoming'}
      </span>
      <span className="text-[10px] text-dark-500 bg-dark-800 px-2.5 py-1 rounded-full">
        {typeIcons[type] || '📋'} {type || 'General'}
      </span>
    </div>
  )
}

function OverviewTab({ session, rosterCount }) {
  const infoItems = [
    { label: 'Coach', value: session.coach || 'Coach Ramesh' },
    { label: 'Venue', value: session.venue },
    { label: 'Time', value: session.time },
    { label: 'Type', value: session.type || 'General' },
    { label: 'Duration', value: session.duration || '90 min' },
    { label: 'Roster', value: `${rosterCount} players` },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* info grid */}
      <div className="card p-4 mb-4">
        <SectionHeader title="Session Details" />
        <div className="grid grid-cols-2 gap-3">
          {infoItems.map(it => (
            <div key={it.label} className="card-inner p-3">
              <p className="text-[10px] text-dark-500 font-medium">{it.label}</p>
              <p className="text-xs font-semibold mt-0.5 capitalize">{it.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* objectives */}
      <div className="card p-4 mb-4">
        <SectionHeader title="Session Objectives" />
        <div className="space-y-2">
          {['Work on footwork against pace bowling', 'Improve shot selection under pressure', 'Practice driving through covers', 'Focus on balance during the pull shot'].map((obj, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-orange/15 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs text-dark-300 leading-relaxed">{obj}</p>
            </div>
          ))}
        </div>
      </div>

      {/* equipment list */}
      <div className="card p-4 mb-4">
        <SectionHeader title="Equipment Required" />
        <div className="flex flex-wrap gap-2">
          {['Batting pads', 'Helmet', 'Thigh guard', 'Cones', 'Side screen', 'Bowling machine'].map(eq => (
            <span key={eq} className="text-[10px] bg-dark-700 text-dark-300 px-2.5 py-1 rounded-lg font-medium">
              {eq}
            </span>
          ))}
        </div>
      </div>

      {/* weather widget mock */}
      <div className="card p-4 mb-4 flex items-center gap-4">
        <span className="text-3xl">☀️</span>
        <div>
          <p className="text-sm font-semibold">28°C · Sunny</p>
          <p className="text-[10px] text-dark-400">Good conditions for outdoor training</p>
        </div>
      </div>
    </motion.div>
  )
}

function RosterTab({ roster }) {
  const [sortBy, setSortBy] = useState('name')

  const sorted = useMemo(() => {
    const arr = [...roster]
    if (sortBy === 'name') arr.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'jersey') arr.sort((a, b) => a.jerseyNumber - b.jerseyNumber)
    if (sortBy === 'category') arr.sort((a, b) => a.category.localeCompare(b.category))
    return arr
  }, [roster, sortBy])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* sort controls */}
      <div className="flex gap-2 mb-3">
        {['name', 'jersey', 'category'].map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg capitalize transition-all
              ${sortBy === s ? 'bg-orange text-dark-950' : 'bg-dark-800 text-dark-400'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {sorted.map((p, i) => (
          <motion.div
            key={p.id}
            className="flex items-center gap-3 card-inner p-3.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <span className="text-[10px] text-dark-600 w-5 text-right font-medium">{i + 1}</span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ backgroundColor: `hsl(${nameToHue(p.name)}, 40%, 18%)` }}
            >
              {getInitials(p.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{p.name}</p>
              <p className="text-[9px] text-dark-500">{p.category} · {p.role}</p>
            </div>
            <span className="text-[11px] font-bold text-dark-400">#{p.jerseyNumber}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function AttendanceTab({ roster }) {
  const [attendance, setAttendance] = useState(() => {
    const map = {}
    roster.forEach(p => { map[p.id] = 'unmarked' })
    return map
  })

  const toggle = (playerId) => {
    setAttendance(prev => {
      const current = prev[playerId]
      const next = current === 'unmarked' ? 'present' : current === 'present' ? 'absent' : 'unmarked'
      return { ...prev, [playerId]: next }
    })
  }

  const counts = useMemo(() => {
    const vals = Object.values(attendance)
    return {
      present: vals.filter(v => v === 'present').length,
      absent: vals.filter(v => v === 'absent').length,
      unmarked: vals.filter(v => v === 'unmarked').length,
    }
  }, [attendance])

  const statusStyles = {
    present: 'bg-success text-dark-950',
    absent: 'bg-danger text-white',
    unmarked: 'bg-dark-700 text-dark-400',
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* summary strip */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="card-inner p-3 text-center">
          <p className="text-lg font-bold text-success">{counts.present}</p>
          <p className="text-[9px] text-dark-400">Present</p>
        </div>
        <div className="card-inner p-3 text-center">
          <p className="text-lg font-bold text-danger">{counts.absent}</p>
          <p className="text-[9px] text-dark-400">Absent</p>
        </div>
        <div className="card-inner p-3 text-center">
          <p className="text-lg font-bold text-dark-400">{counts.unmarked}</p>
          <p className="text-[9px] text-dark-400">Unmarked</p>
        </div>
      </div>

      {/* progress */}
      <div className="mb-4">
        <AnimatedBar
          label="Attendance"
          value={counts.present}
          maxVal={roster.length}
          height="h-2.5"
          color="#30D158"
        />
      </div>

      {/* player list with toggles */}
      <div className="space-y-2">
        {roster.map(p => (
          <button
            key={p.id}
            className="flex items-center gap-3 card-inner p-3 w-full text-left"
            onClick={() => toggle(p.id)}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ backgroundColor: `hsl(${nameToHue(p.name)}, 40%, 18%)` }}
            >
              {getInitials(p.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{p.name}</p>
            </div>
            <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full ${statusStyles[attendance[p.id]]}`}>
              {attendance[p.id]}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function NotesTab({ session }) {
  const [note, setNote] = useState('')
  const [savedNotes, setSavedNotes] = useState([
    { time: '2:35 PM', text: 'Players warmed up well today. Started with throwdowns.', author: 'Coach Ramesh' },
    { time: '3:10 PM', text: 'Arjun showing excellent timing against pace. Footwork still a concern.', author: 'Coach Ramesh' },
  ])

  const handleSave = () => {
    if (!note.trim()) return
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setSavedNotes(prev => [{ time: timeStr, text: note.trim(), author: 'You' }, ...prev])
    setNote('')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* add note */}
      <div className="card p-4 mb-4">
        <SectionHeader title="Add Note" />
        <textarea
          className="w-full bg-dark-800 border border-dark-700 rounded-xl p-3.5 text-xs text-dark-200 placeholder:text-dark-500 focus:outline-none focus:border-orange/40 resize-none transition-colors mb-2"
          rows={3}
          placeholder="Type your session notes here..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <button
          onClick={handleSave}
          disabled={!note.trim()}
          className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
            note.trim()
              ? 'bg-orange text-dark-950 hover:bg-orange-light'
              : 'bg-dark-700 text-dark-500 cursor-not-allowed'
          }`}
        >
          Save Note
        </button>
      </div>

      {/* saved notes */}
      <SectionHeader title="Session Notes" />
      {savedNotes.length === 0 ? (
        <EmptyState emoji="📝" title="No notes yet" subtitle="Add your first note above" />
      ) : (
        <div className="space-y-2 mb-4">
          {savedNotes.map((n, i) => (
            <div key={i} className="card-inner p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-dark-500 font-medium">{n.author}</span>
                <span className="text-[10px] text-dark-600">{n.time}</span>
              </div>
              <p className="text-xs text-dark-300 leading-relaxed">{n.text}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
