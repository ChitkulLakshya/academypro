import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { coaches, COACHING_ROLES, staffAllocation, announcements } from '../data/coachData'
import { ANIM } from '../utils/constants'

// ─── Coach Directory Screen ───────────────────────────────────
// Browse coaching staff, view individual profiles, and read
// academy announcements.  Designed for parents and players.

export default function CoachDirectoryScreen() {
  const [selectedCoach, setSelectedCoach] = useState(null)
  const [filterRole, setFilterRole] = useState('all')
  const [showAnnouncements, setShowAnnouncements] = useState(false)

  const filtered = useMemo(() => {
    if (filterRole === 'all') return coaches
    return coaches.filter(c => c.role === filterRole)
  }, [filterRole])

  const roleLabel = (roleId) => COACHING_ROLES.find(r => r.id === roleId)?.label || roleId

  const initials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const ratingStars = (rating) => {
    const full = Math.floor(rating)
    const frac = rating - full
    return { full, half: frac >= 0.3, empty: 5 - full - (frac >= 0.3 ? 1 : 0) }
  }

  return (
    <div className="pb-28 pt-2 px-4">
      {/* Header */}
      <motion.div {...ANIM.fadeUp} className="mb-4">
        <h1 className="text-xl font-bold text-white">Coaching Staff</h1>
        <p className="text-dark-300 text-sm mt-1">
          {coaches.length} coaches & staff members
        </p>
      </motion.div>

      {/* Announcements Banner */}
      <motion.button
        {...ANIM.fadeUp}
        className="w-full gradient-orange-subtle card p-3 mb-4 flex items-center justify-between"
        onClick={() => setShowAnnouncements(!showAnnouncements)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📢</span>
          <div>
            <p className="text-sm font-semibold text-white text-left">Announcements</p>
            <p className="text-xs text-dark-300">{announcements.length} recent updates</p>
          </div>
        </div>
        <span className="text-dark-400">{showAnnouncements ? '▲' : '▼'}</span>
      </motion.button>

      {/* Announcements Panel */}
      <AnimatePresence>
        {showAnnouncements && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-5"
          >
            <div className="flex flex-col gap-3">
              {announcements.map(ann => {
                const priorityColor = ann.priority === 'high' ? '#FF453A' : ann.priority === 'medium' ? '#FFD60A' : '#636366'
                return (
                  <div key={ann.id} className="card p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: priorityColor }}
                      />
                      <h3 className="text-sm font-semibold text-white flex-1">{ann.title}</h3>
                      <span className="text-[10px] text-dark-400">{ann.date}</span>
                    </div>
                    <p className="text-xs text-dark-200 leading-relaxed mb-2">{ann.body}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ann.tags.map(tag => (
                        <span key={tag} className="badge badge-neutral">{tag}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Filter Chips */}
      <motion.div {...ANIM.fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar mb-5">
        <button
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterRole === 'all' ? 'bg-orange text-black' : 'bg-dark-700 text-dark-200 border border-dark-600'
          }`}
          onClick={() => setFilterRole('all')}
        >
          All Staff
        </button>
        {COACHING_ROLES.map(role => (
          <button
            key={role.id}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              filterRole === role.id ? 'bg-orange text-black' : 'bg-dark-700 text-dark-200 border border-dark-600'
            }`}
            onClick={() => setFilterRole(role.id)}
          >
            {role.label}
          </button>
        ))}
      </motion.div>

      {/* Staff Allocation Quick Glance */}
      <motion.div {...ANIM.fadeUp} className="card p-4 mb-5">
        <h2 className="text-sm font-bold text-white mb-3">Staff per Age Group</h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(staffAllocation).map(([group, coachIds]) => (
            <div key={group} className="card-inner p-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-dark-200">{group}</span>
              <span className="text-xs font-bold text-orange">{coachIds.length} staff</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Coach Cards Grid */}
      <div className="flex flex-col gap-3">
        {filtered.map((coach, i) => {
          const stars = ratingStars(coach.rating)
          return (
            <motion.button
              key={coach.id}
              {...ANIM.fadeUp}
              transition={{ delay: i * 0.04 }}
              className="card p-4 text-left w-full"
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCoach(coach)}
            >
              <div className="flex items-center gap-3 mb-2">
                {/* avatar */}
                <div
                  className="avatar avatar-lg"
                  style={{ background: `hsl(${coach.name.length * 35}, 50%, 35%)` }}
                >
                  {initials(coach.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{coach.name}</h3>
                  <p className="text-xs text-orange font-medium">{roleLabel(coach.role)}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: stars.full }).map((_, j) => (
                      <span key={j} className="text-[10px] text-orange">★</span>
                    ))}
                    {stars.half && <span className="text-[10px] text-orange">★</span>}
                    {Array.from({ length: stars.empty }).map((_, j) => (
                      <span key={j} className="text-[10px] text-dark-500">★</span>
                    ))}
                    <span className="text-[10px] text-dark-400 ml-1">{coach.rating}</span>
                    <span className="text-[10px] text-dark-500">({coach.totalReviews})</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-dark-300 line-clamp-2 mb-2">{coach.bio}</p>
              <div className="flex items-center gap-3 text-[11px] text-dark-400">
                <span>{coach.experience} yrs exp</span>
                <span>•</span>
                <span>{coach.playersManaged} players</span>
                <span>•</span>
                <span>{coach.sessionsPerWeek}/wk</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Coach Detail Modal */}
      <AnimatePresence>
        {selectedCoach && (
          <>
            <motion.div
              className="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCoach(null)}
            />
            <motion.div
              className="overlay-panel thin-scrollbar p-5"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="overlay-handle mb-4" />

              {/* header */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="avatar avatar-xl avatar-ring"
                  style={{ background: `hsl(${selectedCoach.name.length * 35}, 50%, 35%)` }}
                >
                  {initials(selectedCoach.name)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedCoach.name}</h2>
                  <p className="text-sm text-orange font-medium">{roleLabel(selectedCoach.role)}</p>
                  <p className="text-xs text-dark-300 mt-0.5">Age {selectedCoach.age} • {selectedCoach.experience} yrs experience</p>
                </div>
                <button className="ml-auto text-dark-400 text-xl" onClick={() => setSelectedCoach(null)}>✕</button>
              </div>

              {/* bio */}
              <p className="text-sm text-dark-200 leading-relaxed mb-4">{selectedCoach.bio}</p>

              {/* philosophy */}
              <div className="card-inner p-3 mb-4">
                <p className="text-xs font-semibold text-orange mb-1">💬 Coaching Philosophy</p>
                <p className="text-xs text-dark-200 leading-relaxed italic">"{selectedCoach.philosophy}"</p>
              </div>

              {/* stats row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="card-inner p-3 text-center">
                  <p className="text-lg font-bold text-orange">{selectedCoach.rating}</p>
                  <p className="text-[10px] text-dark-400">Rating</p>
                </div>
                <div className="card-inner p-3 text-center">
                  <p className="text-lg font-bold text-orange">{selectedCoach.playersManaged}</p>
                  <p className="text-[10px] text-dark-400">Players</p>
                </div>
                <div className="card-inner p-3 text-center">
                  <p className="text-lg font-bold text-orange">{selectedCoach.totalReviews}</p>
                  <p className="text-[10px] text-dark-400">Reviews</p>
                </div>
              </div>

              {/* certifications */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white mb-2">Certifications</h3>
                <div className="flex flex-col gap-1.5">
                  {selectedCoach.certifications.map(cert => (
                    <div key={cert} className="flex items-center gap-2 text-xs text-dark-200">
                      <span className="text-success">✓</span>
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* specializations */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white mb-2">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCoach.specializations.map(spec => (
                    <span key={spec} className="badge badge-orange">{spec}</span>
                  ))}
                </div>
              </div>

              {/* achievements */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white mb-2">Achievements</h3>
                <ul className="flex flex-col gap-1.5">
                  {selectedCoach.achievements.map((ach, i) => (
                    <li key={i} className="flex gap-2 text-xs text-dark-200">
                      <span className="text-orange">🏆</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* availability */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white mb-2">Weekly Availability</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedCoach.availability).map(([day, slot]) => (
                    <div key={day} className="card-inner p-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-dark-200 capitalize">{day}</span>
                      {slot ? (
                        <span className="text-[10px] text-success">{slot.start}–{slot.end}</span>
                      ) : (
                        <span className="text-[10px] text-dark-500">Off</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* contact */}
              <div className="card-inner p-3">
                <h3 className="text-sm font-bold text-white mb-2">Contact</h3>
                <div className="flex flex-col gap-1.5 text-xs text-dark-200">
                  <span>📧 {selectedCoach.email}</span>
                  <span>📞 {selectedCoach.phone}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
