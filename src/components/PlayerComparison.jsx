import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { ANIM, TIME_FILTERS, filterToKey } from '../utils/constants'
import { getInitials, scoreColor, nameToHue } from '../utils/helpers'
import { players } from '../data/mockData'

const SKILL_KEYS = ['footwork', 'timing', 'shotSelection', 'balance', 'impact', 'speed', 'passing', 'stamina', 'shooting']

export default function PlayerComparison() {
  const [playerA, setPlayerA] = useState(players[0]?.id || null)
  const [playerB, setPlayerB] = useState(players[1]?.id || null)
  const [timeFilter, setTimeFilter] = useState('30 Days')
  const [viewMode, setViewMode] = useState('radar') // radar | bars | table

  const filterKey = filterToKey(timeFilter)
  const pA = players.find(p => p.id === playerA)
  const pB = players.find(p => p.id === playerB)

  const radarData = useMemo(() => {
    if (!pA || !pB) return []
    const statsA = pA.stats?.[filterKey] || {}
    const statsB = pB.stats?.[filterKey] || {}
    return SKILL_KEYS.map(key => ({
      skill: key.charAt(0).toUpperCase() + key.slice(1),
      [pA.name.split(' ')[0]]: statsA[key] || 0,
      [pB.name.split(' ')[0]]: statsB[key] || 0,
    }))
  }, [playerA, playerB, filterKey])

  const avgA = useMemo(() => computeAvg(pA, filterKey), [playerA, filterKey])
  const avgB = useMemo(() => computeAvg(pB, filterKey), [playerB, filterKey])

  return (
    <motion.div
      className="px-4 pb-4"
      variants={ANIM.stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={ANIM.fadeUp} className="mb-4">
        <h2 className="text-lg font-bold">Compare Players</h2>
        <p className="text-xs text-dark-400 mt-0.5">Head-to-head skill analysis</p>
      </motion.div>

      {/* time filter */}
      <motion.div variants={ANIM.fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1">
        {TIME_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all
              ${timeFilter === f
                ? 'bg-orange text-dark-950'
                : 'bg-dark-800 text-dark-400 border border-dark-700'
              }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* player selectors side by side */}
      <motion.div variants={ANIM.fadeUp} className="grid grid-cols-2 gap-3 mb-4">
        <PlayerDropdown
          label="Player A"
          value={playerA}
          onChange={setPlayerA}
          exclude={playerB}
          color="#F5A623"
        />
        <PlayerDropdown
          label="Player B"
          value={playerB}
          onChange={setPlayerB}
          exclude={playerA}
          color="#30D158"
        />
      </motion.div>

      {/* score comparison bubbles */}
      {pA && pB && (
        <motion.div variants={ANIM.fadeUp} className="flex items-center justify-center gap-6 mb-4">
          <ScoreBubble player={pA} avg={avgA} color="#F5A623" />
          <div className="text-dark-600 text-lg font-bold">VS</div>
          <ScoreBubble player={pB} avg={avgB} color="#30D158" />
        </motion.div>
      )}

      {/* view mode toggle */}
      <motion.div variants={ANIM.fadeUp} className="flex gap-1 bg-dark-800 rounded-xl p-1 mb-4">
        {['radar', 'bars', 'table'].map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 text-[11px] font-semibold py-2 rounded-lg capitalize transition-all
              ${viewMode === mode ? 'bg-orange text-dark-950' : 'text-dark-400'}`}
          >
            {mode}
          </button>
        ))}
      </motion.div>

      {/* visualization */}
      <AnimatePresence mode="wait">
        {viewMode === 'radar' && pA && pB && (
          <CompareRadar key="radar" data={radarData} nameA={pA.name.split(' ')[0]} nameB={pB.name.split(' ')[0]} />
        )}
        {viewMode === 'bars' && pA && pB && (
          <CompareBars key="bars" pA={pA} pB={pB} filterKey={filterKey} />
        )}
        {viewMode === 'table' && pA && pB && (
          <CompareTable key="table" pA={pA} pB={pB} filterKey={filterKey} />
        )}
      </AnimatePresence>

      {/* edge cases */}
      {pA && pB && <CompareInsights pA={pA} pB={pB} filterKey={filterKey} />}
    </motion.div>
  )
}

function PlayerDropdown({ label, value, onChange, exclude, color }) {
  const filtered = players.filter(p => p.id !== exclude)

  return (
    <div className="card-inner p-3">
      <p className="text-[10px] font-medium mb-1.5" style={{ color }}>{label}</p>
      <select
        className="w-full bg-dark-700 text-dark-200 text-xs rounded-lg px-2.5 py-2 border border-dark-600 focus:outline-none focus:border-orange/40"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {filtered.map(p => (
          <option key={p.id} value={p.id}>{p.name} · #{p.jerseyNumber}</option>
        ))}
      </select>
    </div>
  )
}

function ScoreBubble({ player, avg, color }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ backgroundColor: `hsl(${nameToHue(player.name)}, 40%, 18%)`, border: `2px solid ${color}` }}
      >
        {getInitials(player.name)}
      </div>
      <span className="text-lg font-bold" style={{ color }}>{avg}</span>
      <span className="text-[10px] text-dark-400 truncate max-w-[80px]">{player.name.split(' ')[0]}</span>
    </div>
  )
}

function CompareRadar({ data, nameA, nameB }) {
  return (
    <motion.div
      className="card p-4 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="68%">
            <PolarGrid stroke="#2c2c2e" strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#9a9a9e', fontSize: 10 }} />
            <Radar
              dataKey={nameA}
              stroke="#F5A623"
              fill="#F5A623"
              fillOpacity={0.12}
              strokeWidth={2}
              dot={{ r: 3, fill: '#FF9F0A', stroke: '#F5A623' }}
            />
            <Radar
              dataKey={nameB}
              stroke="#30D158"
              fill="#30D158"
              fillOpacity={0.12}
              strokeWidth={2}
              dot={{ r: 3, fill: '#30D158', stroke: '#28A745' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-2">
        <LegendDot color="#F5A623" label={nameA} />
        <LegendDot color="#30D158" label={nameB} />
      </div>
    </motion.div>
  )
}

function CompareBars({ pA, pB, filterKey }) {
  const statsA = pA.stats?.[filterKey] || {}
  const statsB = pB.stats?.[filterKey] || {}

  return (
    <motion.div
      className="card p-4 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="space-y-3.5">
        {SKILL_KEYS.map(key => {
          const a = statsA[key] || 0
          const b = statsB[key] || 0
          const winner = a > b ? 'A' : b > a ? 'B' : 'tie'
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium capitalize text-dark-300">{key}</span>
                <div className="flex gap-3 text-[10px] font-bold">
                  <span style={{ color: winner === 'A' ? '#F5A623' : '#6e6e73' }}>{a}</span>
                  <span style={{ color: winner === 'B' ? '#30D158' : '#6e6e73' }}>{b}</span>
                </div>
              </div>
              <div className="flex gap-1 h-2">
                <motion.div
                  className="h-full rounded-l-full"
                  style={{ backgroundColor: '#F5A623', width: `${a}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${a}%` }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="h-full rounded-r-full"
                  style={{ backgroundColor: '#30D158', width: `${b}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${b}%` }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function CompareTable({ pA, pB, filterKey }) {
  const statsA = pA.stats?.[filterKey] || {}
  const statsB = pB.stats?.[filterKey] || {}

  return (
    <motion.div
      className="card p-4 mb-4 overflow-x-auto hide-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-dark-700 text-dark-400">
            <th className="text-left py-2 pr-2 font-medium">Skill</th>
            <th className="text-center py-2 px-2 font-medium" style={{ color: '#F5A623' }}>{pA.name.split(' ')[0]}</th>
            <th className="text-center py-2 px-2 font-medium" style={{ color: '#30D158' }}>{pB.name.split(' ')[0]}</th>
            <th className="text-center py-2 pl-2 font-medium">Diff</th>
          </tr>
        </thead>
        <tbody>
          {SKILL_KEYS.map(key => {
            const a = statsA[key] || 0
            const b = statsB[key] || 0
            const diff = a - b
            return (
              <tr key={key} className="border-b border-dark-800/50">
                <td className="py-2.5 pr-2 capitalize font-medium text-dark-300">{key}</td>
                <td className="text-center py-2.5 px-2">
                  <span className="font-semibold" style={{ color: scoreColor(a) }}>{a}</span>
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className="font-semibold" style={{ color: scoreColor(b) }}>{b}</span>
                </td>
                <td className="text-center py-2.5 pl-2">
                  <span className={`font-bold ${diff > 0 ? 'text-success' : diff < 0 ? 'text-danger' : 'text-dark-500'}`}>
                    {diff > 0 ? '+' : ''}{diff}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </motion.div>
  )
}

function CompareInsights({ pA, pB, filterKey }) {
  const statsA = pA.stats?.[filterKey] || {}
  const statsB = pB.stats?.[filterKey] || {}

  // find biggest gaps
  const gaps = SKILL_KEYS
    .map(key => ({ key, diff: (statsA[key] || 0) - (statsB[key] || 0) }))
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))

  const biggest = gaps[0]
  const closest = gaps[gaps.length - 1]

  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <h3 className="text-sm font-semibold mb-3">Insights</h3>
      <div className="space-y-2.5">
        {biggest && (
          <InsightRow
            emoji="⚡"
            text={`Biggest gap in ${biggest.key}: ${biggest.diff > 0 ? pA.name.split(' ')[0] : pB.name.split(' ')[0]} leads by ${Math.abs(biggest.diff)} pts`}
          />
        )}
        {closest && (
          <InsightRow
            emoji="🤝"
            text={`Closest match in ${closest.key}: only ${Math.abs(closest.diff)} pt difference`}
          />
        )}
        <InsightRow
          emoji="📊"
          text={`Overall: ${computeAvg(pA, filterKey)} vs ${computeAvg(pB, filterKey)}`}
        />
      </div>
    </motion.div>
  )
}

function InsightRow({ emoji, text }) {
  return (
    <div className="flex items-start gap-2.5 card-inner p-3">
      <span className="text-sm shrink-0">{emoji}</span>
      <p className="text-xs text-dark-300 leading-relaxed">{text}</p>
    </div>
  )
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] text-dark-400 font-medium">{label}</span>
    </div>
  )
}

function computeAvg(player, filterKey) {
  const stats = player?.stats?.[filterKey]
  if (!stats) return 0
  const vals = Object.values(stats).filter(v => typeof v === 'number')
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
}
