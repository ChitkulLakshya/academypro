import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ANIM } from '../utils/constants'
import { upcomingSessions, sessionHistory } from '../data/sessionData'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// mock calendar data — sessions mapped to dates
function buildCalendarDates() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const dates = []
  // padding for start of week
  const startPad = firstDay === 0 ? 6 : firstDay - 1
  for (let i = 0; i < startPad; i++) dates.push(null)
  for (let d = 1; d <= daysInMonth; d++) dates.push(d)

  return { dates, year, month, daysInMonth }
}

// assign mock events to some dates
function getEventsForDate(day) {
  if (!day) return []
  // deterministic pseudo-random based on day
  const allSessions = [...upcomingSessions, ...sessionHistory]
  return allSessions.filter((_, i) => (day + i) % 7 === 0).slice(0, 2)
}

export default function ScheduleScreen() {
  const [viewMode, setViewMode] = useState('calendar') // calendar | list
  const [selectedDate, setSelectedDate] = useState(new Date().getDate())
  const { dates, year, month } = useMemo(buildCalendarDates, [])
  const allSessions = useMemo(() => [...upcomingSessions, ...sessionHistory], [])

  return (
    <motion.div
      className="px-4 pt-12 pb-4 min-h-screen"
      variants={ANIM.stagger}
      initial="hidden"
      animate="show"
    >
      {/* header */}
      <motion.div variants={ANIM.fadeUp} className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">Schedule</h1>
          <p className="text-xs text-dark-400 mt-0.5">{MONTHS[month]} {year}</p>
        </div>
        <div className="flex gap-1 bg-dark-800 rounded-lg p-0.5">
          {['calendar', 'list'].map(m => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3 py-1.5 text-[10px] font-semibold rounded-md capitalize transition-all
                ${viewMode === m ? 'bg-orange text-dark-950' : 'text-dark-400'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {viewMode === 'calendar' ? (
          <CalendarView
            key="cal"
            dates={dates}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        ) : (
          <ListView key="list" sessions={allSessions} />
        )}
      </AnimatePresence>

      {/* selected date sessions */}
      {viewMode === 'calendar' && (
        <DateSessions date={selectedDate} month={month} />
      )}
    </motion.div>
  )
}

function CalendarView({ dates, selectedDate, onSelect }) {
  const today = new Date().getDate()

  return (
    <motion.div
      className="card p-4 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[9px] text-dark-500 font-semibold uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* date grid */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} />
          const isToday = day === today
          const isSelected = day === selectedDate
          const hasEvent = getEventsForDate(day).length > 0

          return (
            <button
              key={day}
              onClick={() => onSelect(day)}
              className={`relative w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all
                ${isSelected
                  ? 'bg-orange text-dark-950 font-bold'
                  : isToday
                    ? 'bg-orange/15 text-orange font-bold'
                    : 'text-dark-300 hover:bg-dark-700'
                }`}
            >
              {day}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-orange" />
              )}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

function DateSessions({ date, month }) {
  const events = getEventsForDate(date)
  const monthName = MONTHS[month]?.slice(0, 3) || ''

  return (
    <motion.div variants={ANIM.fadeUp}>
      <h3 className="text-sm font-semibold mb-3">
        {monthName} {date} — {events.length > 0 ? `${events.length} session${events.length > 1 ? 's' : ''}` : 'No sessions'}
      </h3>
      {events.length === 0 ? (
        <div className="card p-5 text-center">
          <span className="text-2xl block mb-2">📭</span>
          <p className="text-xs text-dark-400">No sessions scheduled for this day</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((s, i) => (
            <div key={s.id || i} className="card-inner p-4 flex items-center gap-4">
              <div className="text-center min-w-[48px]">
                <p className="text-orange font-bold text-sm">{s.time?.split(' ')[0] || '3:00'}</p>
                <p className="text-[9px] text-dark-500">{s.time?.split(' ')[1] || 'PM'}</p>
              </div>
              <div className="w-px h-8 bg-dark-600" />
              <div className="flex-1">
                <p className="text-xs font-semibold">{s.title}</p>
                <p className="text-[10px] text-dark-400">{s.venue} · {s.coach || 'Coach'}</p>
              </div>
              <TypeDot type={s.type} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function ListView({ sessions }) {
  // group by status
  const groups = useMemo(() => {
    const live = sessions.filter(s => s.status === 'live')
    const upcoming = sessions.filter(s => s.status === 'upcoming' || !s.status)
    const completed = sessions.filter(s => s.status === 'completed')
    const cancelled = sessions.filter(s => s.status === 'cancelled')
    return [
      { label: 'Live Now', items: live, dotColor: 'bg-success' },
      { label: 'Upcoming', items: upcoming, dotColor: 'bg-orange' },
      { label: 'Completed', items: completed, dotColor: 'bg-dark-500' },
      { label: 'Cancelled', items: cancelled, dotColor: 'bg-danger' },
    ].filter(g => g.items.length > 0)
  }, [sessions])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {groups.map(group => (
        <div key={group.label} className="mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <span className={`w-2 h-2 rounded-full ${group.dotColor}`} />
            <h3 className="text-sm font-semibold">{group.label}</h3>
            <span className="text-[10px] text-dark-500 ml-auto">{group.items.length}</span>
          </div>
          <div className="space-y-2">
            {group.items.map((s, i) => (
              <div key={s.id || i} className="card-inner p-4 flex items-center gap-4">
                <div className="text-center min-w-[48px]">
                  <p className="text-orange font-bold text-sm">{s.time?.split(' ')[0] || '--'}</p>
                  <p className="text-[9px] text-dark-500">{s.time?.split(' ')[1] || '--'}</p>
                </div>
                <div className="w-px h-8 bg-dark-600" />
                <div className="flex-1">
                  <p className="text-xs font-semibold">{s.title}</p>
                  <p className="text-[10px] text-dark-400">{s.venue} · {s.coach || 'Staff'} · {s.duration || '90 min'}</p>
                </div>
                <TypeDot type={s.type} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

function TypeDot({ type }) {
  const colors = {
    batting: 'bg-orange',
    bowling: 'bg-info',
    fielding: 'bg-success',
    fitness: 'bg-danger',
    match: 'bg-warn',
  }
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[type] || 'bg-dark-500'}`} />
}
