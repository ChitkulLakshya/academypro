import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { ANIM, TIME_FILTERS, COLORS, filterToKey } from '../utils/constants'
import { getInitials, scoreColor, nameToHue, averageStat } from '../utils/helpers'
import { players } from '../data/mockData'
import {
  academyRadarStats, analysisSummaries,
  topPerformers as topPerformersData,
  needsAttention as needsAttentionData,
} from '../data/sessionData'

const SKILL_LABELS = {
  footwork: 'Footwork',
  timing: 'Timing',
  shotSelection: 'Shot Sel.',
  balance: 'Balance',
  impact: 'Impact',
  speed: 'Speed',
  passing: 'Passing',
  stamina: 'Stamina',
  shooting: 'Shooting',
}

export default function AnalysisScreen() {
  const [activeFilter, setActiveFilter] = useState('30 Days')
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [showCompare, setShowCompare] = useState(false)

  const filterKey = filterToKey(activeFilter)

  // build radar data from sessionData
  const radarData = useMemo(() => {
    const raw = academyRadarStats[filterKey] || academyRadarStats['30']
    return Object.entries(raw).map(([key, val]) => ({
      skill: SKILL_LABELS[key] || key,
      value: val,
      fullMark: 100,
    }))
  }, [filterKey])

  // summary text per filter
  const summaryText = analysisSummaries[filterKey] || analysisSummaries['30']

  // top performers & needs attention
  const topPerformers = topPerformersData[filterKey] || topPerformersData['30']
  const needsAttention = needsAttentionData[filterKey] || needsAttentionData['30']

  // player skill rankings for the drill-down
  const skillRankings = useMemo(() => {
    if (!selectedSkill) return []
    const key = Object.keys(SKILL_LABELS).find(k => SKILL_LABELS[k] === selectedSkill)
    if (!key) return []
    return players
      .map(p => ({
        ...p,
        skillVal: p.stats?.[filterKey]?.[key] ?? 0,
      }))
      .sort((a, b) => b.skillVal - a.skillVal)
      .slice(0, 10)
  }, [selectedSkill, filterKey])

  return (
    <motion.div
      className="px-4 pt-12 pb-4"
      variants={ANIM.stagger}
      initial="hidden"
      animate="show"
    >
      <PageHeader />
      <FilterChips
        filters={TIME_FILTERS}
        active={activeFilter}
        onChange={setActiveFilter}
      />
      <RadarChartCard
        data={radarData}
        filterLabel={activeFilter}
        onSkillTap={setSelectedSkill}
      />
      <SummaryCard text={summaryText} />
      <AcademyAverages filterKey={filterKey} />

      {/* skill drill-down */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillDrillDown
            skill={selectedSkill}
            rankings={skillRankings}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </AnimatePresence>

      <PerformerSection
        title="Top Performers"
        dotColor="bg-success"
        items={topPerformers}
      />
      <PerformerSection
        title="Needs Attention"
        dotColor="bg-danger"
        items={needsAttention}
      />
      <CategoryBreakdown filterKey={filterKey} />
      <CompareToggle show={showCompare} toggle={() => setShowCompare(!showCompare)} />
      {showCompare && <ComparePanel filterKey={filterKey} />}
    </motion.div>
  )
}

function PageHeader() {
  return (
    <motion.div variants={ANIM.fadeUp} className="mb-5">
      <h1 className="text-xl font-bold tracking-tight">Analysis</h1>
      <p className="text-xs text-dark-400 mt-0.5">Academy-wide performance insights</p>
    </motion.div>
  )
}

function FilterChips({ filters, active, onChange }) {
  return (
    <motion.div variants={ANIM.fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar mb-5 pb-1">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200
            ${active === f
              ? 'bg-orange text-dark-950 shadow-[0_2px_12px_rgba(245,166,35,0.35)]'
              : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-600'
            }`}
        >
          {f}
        </button>
      ))}
    </motion.div>
  )
}

function RadarChartCard({ data, filterLabel, onSkillTap }) {
  const handleClick = (e) => {
    if (e?.activeLabel) {
      onSkillTap(e.activeLabel)
    }
  }

  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold">Academy Overview</h3>
          <p className="text-[11px] text-dark-400">All Skills · {filterLabel}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-orange/15 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
        </div>
      </div>
      <div className="w-full h-[260px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%" onClick={handleClick}>
            <PolarGrid stroke="#2c2c2e" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: '#9a9a9e', fontSize: 10, fontWeight: 500 }}
            />
            <Radar
              dataKey="value"
              stroke="#F5A623"
              fill="#F5A623"
              fillOpacity={0.15}
              strokeWidth={2}
              dot={{ r: 3.5, fill: '#FF9F0A', stroke: '#F5A623', strokeWidth: 1 }}
              animationDuration={800}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c1c1e',
                border: '1px solid #2c2c2e',
                borderRadius: 10,
                fontSize: 12,
                color: '#fff',
              }}
              itemStyle={{ color: '#F5A623' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-dark-500 text-center mt-1">Tap a skill to see rankings</p>
    </motion.div>
  )
}

function SummaryCard({ text }) {
  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <h3 className="text-sm font-semibold mb-2">Analysis Summary</h3>
      <p className="text-xs text-dark-300 leading-relaxed">{text}</p>
    </motion.div>
  )
}

function AcademyAverages({ filterKey }) {
  // compute from players array
  const skills = ['footwork', 'timing', 'shotSelection', 'balance', 'impact', 'speed', 'passing', 'stamina', 'shooting']
  const averages = skills.map(sk => ({
    skill: SKILL_LABELS[sk],
    avg: averageStat(players, filterKey, sk),
  }))

  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <h3 className="text-sm font-semibold mb-3">Academy Averages</h3>
      <div className="space-y-2.5">
        {averages.map(a => (
          <div key={a.skill} className="flex items-center gap-2.5">
            <span className="text-[10px] text-dark-400 w-[68px] truncate">{a.skill}</span>
            <div className="flex-1 h-2 rounded-full bg-dark-700 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: scoreColor(a.avg) }}
                initial={{ width: 0 }}
                animate={{ width: `${a.avg}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[11px] font-semibold w-8 text-right" style={{ color: scoreColor(a.avg) }}>
              {a.avg}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function SkillDrillDown({ skill, rankings, onClose }) {
  return (
    <motion.div
      className="card p-4 mb-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">
          {skill} — <span className="text-orange">Top 10</span>
        </h3>
        <button
          className="text-[10px] font-medium text-dark-400 hover:text-dark-200 transition-colors"
          onClick={onClose}
        >
          Close ✕
        </button>
      </div>
      <div className="space-y-2">
        {rankings.map((p, idx) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-dark-500 w-5 text-right">
              {idx + 1}.
            </span>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ backgroundColor: `hsl(${nameToHue(p.name)}, 40%, 18%)` }}
            >
              {getInitials(p.name)}
            </div>
            <span className="flex-1 text-xs truncate">{p.name}</span>
            <span
              className="text-xs font-bold"
              style={{ color: scoreColor(p.skillVal) }}
            >
              {p.skillVal}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function PerformerSection({ title, dotColor, items }) {
  return (
    <motion.div variants={ANIM.fadeUp} className="mb-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        {title}
      </h3>
      <div className="space-y-2.5">
        {items.map(p => (
          <PlayerRow key={p.name} {...p} />
        ))}
      </div>
    </motion.div>
  )
}

function PlayerRow({ name, metric, val, trend }) {
  const isUp = trend === 'up'
  const initials = getInitials(name)
  const hue = nameToHue(name)

  return (
    <div className="flex items-center justify-between card-inner p-3.5">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold"
          style={{ backgroundColor: `hsl(${hue}, 40%, 18%)` }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-[11px] text-dark-400">{metric}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-bold ${isUp ? 'text-success' : 'text-danger'}`}>{val}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={isUp ? '#30D158' : '#FF453A'} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={isUp ? '' : 'rotate-180'}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </div>
    </div>
  )
}

function CategoryBreakdown({ filterKey }) {
  const categories = ['U-14', 'U-16', 'U-17']
  const skills = ['footwork', 'timing', 'shotSelection', 'speed', 'stamina']

  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <h3 className="text-sm font-semibold mb-3">Category Breakdown</h3>
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-dark-400 border-b border-dark-700">
              <th className="text-left py-2 pr-3 font-medium">Category</th>
              {skills.map(sk => (
                <th key={sk} className="text-center py-2 px-1.5 font-medium">{SKILL_LABELS[sk]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => {
              const catPlayers = players.filter(p => p.category === cat)
              return (
                <tr key={cat} className="border-b border-dark-800/50">
                  <td className="py-2.5 pr-3 font-semibold text-orange">{cat}</td>
                  {skills.map(sk => {
                    const avg = averageStat(catPlayers, filterKey, sk)
                    return (
                      <td key={sk} className="text-center py-2.5 px-1.5">
                        <span
                          className="font-semibold"
                          style={{ color: scoreColor(avg) }}
                        >
                          {avg}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

function CompareToggle({ show, toggle }) {
  return (
    <motion.div variants={ANIM.fadeUp} className="mb-4">
      <button
        onClick={toggle}
        className={`w-full py-3 rounded-xl text-xs font-semibold transition-all ${
          show
            ? 'bg-orange text-dark-950'
            : 'bg-dark-800 text-dark-300 border border-dark-700 hover:border-orange/30'
        }`}
      >
        {show ? 'Hide Comparison' : 'Compare Time Periods'}
      </button>
    </motion.div>
  )
}

function ComparePanel({ filterKey }) {
  const skills = ['footwork', 'timing', 'shotSelection', 'balance', 'impact', 'speed', 'passing', 'stamina', 'shooting']
  const periods = ['30', '60', '90', 'all']
  const periodLabels = { '30': '30D', '60': '60D', '90': '90D', 'all': 'Season' }

  return (
    <motion.div
      className="card p-4 mb-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-sm font-semibold mb-3">Period Comparison</h3>
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-dark-400 border-b border-dark-700">
              <th className="text-left py-2 pr-3 font-medium">Skill</th>
              {periods.map(pk => (
                <th key={pk} className={`text-center py-2 px-2 font-medium ${pk === filterKey ? 'text-orange' : ''}`}>
                  {periodLabels[pk]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {skills.map(sk => (
              <tr key={sk} className="border-b border-dark-800/50">
                <td className="py-2.5 pr-3 font-medium text-dark-300">{SKILL_LABELS[sk]}</td>
                {periods.map(pk => {
                  const avg = averageStat(players, pk, sk)
                  const isActive = pk === filterKey
                  return (
                    <td key={pk} className="text-center py-2.5 px-2">
                      <span
                        className={`font-semibold ${isActive ? 'underline decoration-orange decoration-1 underline-offset-2' : ''}`}
                        style={{ color: scoreColor(avg) }}
                      >
                        {avg}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// small reusable stat chip for external use
export function StatChip({ label, value, color }) {
  return (
    <div className="card-inner px-3 py-2 text-center min-w-[80px]">
      <p className="text-lg font-bold" style={{ color: color || scoreColor(value) }}>{value}</p>
      <p className="text-[9px] text-dark-400 mt-0.5 uppercase tracking-wide">{label}</p>
    </div>
  )
}

// bar breakdown used for drill-downs
export function SkillBar({ label, value, maxVal = 100, delay = 0 }) {
  const pct = Math.min(100, (value / maxVal) * 100)
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] text-dark-400 w-[68px] capitalize truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-dark-700 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: scoreColor(value) }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[10px] font-medium w-7 text-right">{value}</span>
    </div>
  )
}
