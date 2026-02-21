import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ANIM, TIME_FILTERS, filterToKey } from '../utils/constants'
import { getInitials, scoreColor, nameToHue, averageStat } from '../utils/helpers'
import { players } from '../data/mockData'

const SORT_OPTIONS = [
  { key: 'overall', label: 'Overall' },
  { key: 'footwork', label: 'Footwork' },
  { key: 'timing', label: 'Timing' },
  { key: 'speed', label: 'Speed' },
  { key: 'stamina', label: 'Stamina' },
  { key: 'shooting', label: 'Shooting' },
  { key: 'passing', label: 'Passing' },
]

export default function LeaderboardScreen({ onBack }) {
  const [timeFilter, setTimeFilter] = useState('30 Days')
  const [sortKey, setSortKey] = useState('overall')

  const filterKey = filterToKey(timeFilter)

  const ranked = useMemo(() => {
    return players
      .map(p => {
        const stats = p.stats?.[filterKey] || {}
        let score
        if (sortKey === 'overall') {
          const vals = Object.values(stats).filter(v => typeof v === 'number')
          score = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
        } else {
          score = stats[sortKey] || 0
        }
        return { ...p, score }
      })
      .sort((a, b) => b.score - a.score)
  }, [filterKey, sortKey])

  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  return (
    <motion.div
      className="px-4 pt-12 pb-4"
      variants={ANIM.stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={ANIM.fadeUp} className="flex items-center gap-3 mb-4">
        {onBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a9a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <h1 className="text-xl font-bold">Leaderboard</h1>
        <p className="text-xs text-dark-400 mt-0.5">Top performers across the academy</p>
      </motion.div>

      {/* time filter */}
      <motion.div variants={ANIM.fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar mb-3 pb-1">
        {TIME_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all
              ${timeFilter === f ? 'bg-orange text-dark-950' : 'bg-dark-800 text-dark-400 border border-dark-700'}`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* sort option */}
      <motion.div variants={ANIM.fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar mb-5 pb-1">
        {SORT_OPTIONS.map(s => (
          <button
            key={s.key}
            onClick={() => setSortKey(s.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all
              ${sortKey === s.key ? 'bg-orange/15 text-orange border border-orange/30' : 'bg-dark-800 text-dark-500 border border-dark-700'}`}
          >
            {s.label}
          </button>
        ))}
      </motion.div>

      {/* podium */}
      <motion.div variants={ANIM.fadeUp} className="flex items-end justify-center gap-3 mb-6">
        {[1, 0, 2].map(idx => {
          const p = top3[idx]
          if (!p) return null
          const isFirst = idx === 0
          return (
            <PodiumSpot
              key={p.id}
              player={p}
              rank={idx + 1}
              isFirst={isFirst}
            />
          )
        })}
      </motion.div>

      {/* list */}
      <div className="space-y-2">
        {rest.map((p, i) => (
          <motion.div
            key={p.id}
            className="flex items-center gap-3 card-inner p-3.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.25 }}
          >
            <span className="text-[11px] font-bold text-dark-500 w-6 text-right">{i + 4}</span>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ backgroundColor: `hsl(${nameToHue(p.name)}, 40%, 18%)` }}
            >
              {getInitials(p.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{p.name}</p>
              <p className="text-[9px] text-dark-500">{p.category} · {p.role}</p>
            </div>
            <span className="text-sm font-bold" style={{ color: scoreColor(p.score) }}>
              {p.score}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function PodiumSpot({ player, rank, isFirst }) {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const heights = { 1: 'h-28', 2: 'h-20', 3: 'h-16' }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-${isFirst ? '14' : '12'} h-${isFirst ? '14' : '12'} rounded-full flex items-center justify-center font-bold text-${isFirst ? 'sm' : '[11px]'} mb-1.5 ${isFirst ? 'ring-2 ring-orange ring-offset-2 ring-offset-dark-950' : ''}`}
        style={{ backgroundColor: `hsl(${nameToHue(player.name)}, 40%, 18%)` }}
      >
        {getInitials(player.name)}
      </div>
      <span className="text-[10px] font-medium truncate max-w-[70px] text-center">{player.name.split(' ')[0]}</span>
      <span className="text-sm font-bold mt-0.5" style={{ color: scoreColor(player.score) }}>
        {player.score}
      </span>
      <div className={`w-16 ${heights[rank]} rounded-t-xl bg-dark-800 border border-dark-700 mt-1.5 flex items-start justify-center pt-2`}>
        <span className="text-lg">{medals[rank]}</span>
      </div>
    </div>
  )
}
