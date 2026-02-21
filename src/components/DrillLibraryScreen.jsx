import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { drills, DRILL_CATEGORIES, DIFFICULTY_LEVELS, weeklyPrograms } from '../data/drillsData'
import { ANIM } from '../utils/constants'

// ─── Drill Library Screen ─────────────────────────────────────
// Browse, filter, and drill-down into the training exercise
// library.  Grouped by category with difficulty indicators.

export default function DrillLibraryScreen() {
  const [activeCat, setActiveCat] = useState('all')
  const [activeDiff, setActiveDiff] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [selectedDrill, setSelectedDrill] = useState(null)
  const [showPrograms, setShowPrograms] = useState(false)

  const filtered = useMemo(() => {
    return drills.filter(d => {
      if (activeCat !== 'all' && d.category !== activeCat) return false
      if (activeDiff !== 'all' && d.difficulty !== activeDiff) return false
      if (searchText) {
        const q = searchText.toLowerCase()
        return d.name.toLowerCase().includes(q) ||
               d.description.toLowerCase().includes(q) ||
               d.targetSkills.some(s => s.toLowerCase().includes(q))
      }
      return true
    })
  }, [activeCat, activeDiff, searchText])

  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach(d => {
      if (!map[d.category]) map[d.category] = []
      map[d.category].push(d)
    })
    return map
  }, [filtered])

  const diffColor = (diff) => DIFFICULTY_LEVELS.find(l => l.id === diff)?.color || '#8e8e93'

  return (
    <div className="pb-28 pt-2 px-4">
      {/* Header */}
      <motion.div {...ANIM.fadeUp} className="mb-4">
        <h1 className="text-xl font-bold text-white">Drill Library</h1>
        <p className="text-dark-300 text-sm mt-1">
          {drills.length} drills across {DRILL_CATEGORIES.length} categories
        </p>
      </motion.div>

      {/* Search */}
      <motion.div {...ANIM.fadeUp} className="mb-4">
        <input
          className="input"
          placeholder="Search drills or skills..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </motion.div>

      {/* Category Chips */}
      <motion.div {...ANIM.fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar mb-3">
        <button
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeCat === 'all' ? 'bg-orange text-black' : 'bg-dark-700 text-dark-200 border border-dark-600'
          }`}
          onClick={() => setActiveCat('all')}
        >
          All
        </button>
        {DRILL_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCat === cat.id ? 'bg-orange text-black' : 'bg-dark-700 text-dark-200 border border-dark-600'
            }`}
            onClick={() => setActiveCat(cat.id)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Difficulty Chips */}
      <motion.div {...ANIM.fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar mb-5">
        <button
          className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
            activeDiff === 'all' ? 'bg-dark-500 text-white' : 'bg-dark-800 text-dark-300 border border-dark-600'
          }`}
          onClick={() => setActiveDiff('all')}
        >
          Any Level
        </button>
        {DIFFICULTY_LEVELS.map(lvl => (
          <button
            key={lvl.id}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all border`}
            style={{
              background: activeDiff === lvl.id ? lvl.color + '20' : '#161616',
              borderColor: activeDiff === lvl.id ? lvl.color : '#2c2c2e',
              color: activeDiff === lvl.id ? lvl.color : '#aeaeb2',
            }}
            onClick={() => setActiveDiff(lvl.id)}
          >
            {lvl.label}
          </button>
        ))}
      </motion.div>

      {/* Programs Toggle */}
      <motion.button
        {...ANIM.fadeUp}
        className="w-full card p-3 mb-5 flex items-center justify-between"
        onClick={() => setShowPrograms(!showPrograms)}
      >
        <div>
          <p className="text-sm font-semibold text-white">Weekly Programs</p>
          <p className="text-xs text-dark-300">{weeklyPrograms.length} structured plans available</p>
        </div>
        <span className="text-dark-400 text-lg">{showPrograms ? '▲' : '▼'}</span>
      </motion.button>

      {/* Programs List */}
      <AnimatePresence>
        {showPrograms && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-5"
          >
            <div className="flex flex-col gap-3">
              {weeklyPrograms.map(prog => (
                <div key={prog.id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">{prog.name}</h3>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: diffColor(prog.difficulty) + '20',
                        color: diffColor(prog.difficulty),
                      }}
                    >
                      {prog.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-dark-300 mb-3">{prog.description}</p>
                  <div className="flex flex-col gap-1.5">
                    {prog.days.map(day => (
                      <div key={day.day} className="flex items-center gap-2 text-xs">
                        <span className="text-orange font-semibold w-20">{day.day}</span>
                        <span className="text-dark-200">{day.focus}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-dark-400">
                    <span>⏱ {prog.totalDuration} min total</span>
                    <span>👥 {prog.targetGroup}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <p className="text-xs text-dark-400 mb-3">
        Showing {filtered.length} drill{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grouped Drill List */}
      {Object.keys(grouped).length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-dark-400 text-sm">No drills match your filters</p>
        </div>
      ) : (
        Object.entries(grouped).map(([catId, catDrills]) => {
          const cat = DRILL_CATEGORIES.find(c => c.id === catId)
          return (
            <div key={catId} className="mb-5">
              <h2 className="text-sm font-bold text-dark-200 mb-2 flex items-center gap-2">
                <span>{cat?.icon}</span>
                <span>{cat?.label || catId}</span>
                <span className="text-dark-500 font-normal">({catDrills.length})</span>
              </h2>
              <div className="flex flex-col gap-3">
                {catDrills.map(drill => (
                  <motion.button
                    key={drill.id}
                    className="card p-4 text-left w-full"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDrill(drill)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-semibold text-white">{drill.name}</h3>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{
                          background: diffColor(drill.difficulty) + '20',
                          color: diffColor(drill.difficulty),
                        }}
                      >
                        {drill.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-dark-300 line-clamp-2 mb-2">{drill.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-dark-400">
                      <span>⏱ {drill.duration} min</span>
                      <span>{drill.sets}×{drill.reps}</span>
                      <span>🔥 {drill.caloriesBurned} cal</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )
        })
      )}

      {/* Drill Detail Modal */}
      <AnimatePresence>
        {selectedDrill && (
          <>
            <motion.div
              className="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDrill(null)}
            />
            <motion.div
              className="overlay-panel thin-scrollbar p-5"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="overlay-handle mb-4" />

              {/* title */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white">{selectedDrill.name}</h2>
                <button className="text-dark-400 text-xl" onClick={() => setSelectedDrill(null)}>✕</button>
              </div>

              {/* meta chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-orange">{selectedDrill.category}</span>
                <span
                  className="badge"
                  style={{
                    background: diffColor(selectedDrill.difficulty) + '20',
                    color: diffColor(selectedDrill.difficulty),
                    border: `1px solid ${diffColor(selectedDrill.difficulty)}40`,
                  }}
                >
                  {selectedDrill.difficulty}
                </span>
                <span className="badge badge-neutral">⏱ {selectedDrill.duration} min</span>
                <span className="badge badge-neutral">🔥 {selectedDrill.caloriesBurned} cal</span>
              </div>

              {/* description */}
              <p className="text-sm text-dark-200 mb-4 leading-relaxed">{selectedDrill.description}</p>

              {/* sets / reps / rest */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="card-inner p-3 text-center">
                  <p className="text-lg font-bold text-orange">{selectedDrill.sets}</p>
                  <p className="text-[10px] text-dark-400">Sets</p>
                </div>
                <div className="card-inner p-3 text-center">
                  <p className="text-lg font-bold text-orange">{selectedDrill.reps}</p>
                  <p className="text-[10px] text-dark-400">Reps</p>
                </div>
                <div className="card-inner p-3 text-center">
                  <p className="text-lg font-bold text-orange">{selectedDrill.restBetweenSets}s</p>
                  <p className="text-[10px] text-dark-400">Rest</p>
                </div>
              </div>

              {/* steps */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white mb-2">Steps</h3>
                <ol className="flex flex-col gap-2">
                  {selectedDrill.steps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs text-dark-200">
                      <span className="text-orange font-bold">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* coach tips */}
              <div className="card-inner p-3 mb-4">
                <p className="text-xs font-semibold text-orange mb-1">💡 Coach Tips</p>
                <p className="text-xs text-dark-200 leading-relaxed">{selectedDrill.coachTips}</p>
              </div>

              {/* equipment */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white mb-2">Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDrill.equipment.map(eq => (
                    <span key={eq} className="badge badge-neutral">{eq}</span>
                  ))}
                </div>
              </div>

              {/* target skills */}
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Target Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDrill.targetSkills.map(skill => (
                    <span key={skill} className="badge badge-orange">{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
