import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const TIME_FILTERS = ['30 Days', '60 Days', '90 Days', 'Season']

const radarData = [
  { skill: 'Footwork', val: 78 },
  { skill: 'Timing', val: 85 },
  { skill: 'Shot Selection', val: 70 },
  { skill: 'Impact', val: 82 },
  { skill: 'Balance', val: 75 },
]

const summaryText = `Academy batting fundamentals are trending upward over the past 30 days. Timing and Impact scores have improved notably, while Shot Selection remains the primary area for focused coaching. Footwork consistency has plateaued — consider targeted ladder drills.`

const topPerformers = [
  { name: 'Arjun Patel', metric: 'Batting Avg', val: '92.3', trend: 'up' },
  { name: 'Ananya Shah', metric: 'Shot Selection', val: '88.1', trend: 'up' },
]

const needsAttention = [
  { name: 'Vikram K.', metric: 'Footwork', val: '52.0', trend: 'down' },
  { name: 'Rahul D.', metric: 'Balance', val: '48.5', trend: 'down' },
]

export default function AnalysisScreen() {
  const [activeFilter, setActiveFilter] = useState('30 Days')

  return (
    <motion.div
      className="px-4 pt-14 pb-4"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* page header */}
      <motion.div variants={fadeUp} className="mb-5">
        <h1 className="text-xl font-bold tracking-tight">Analysis</h1>
        <p className="text-xs text-slate-400 mt-0.5">Academy-wide batting performance</p>
      </motion.div>

      {/* time filter chips */}
      <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar mb-5 pb-1">
        {TIME_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200
              ${activeFilter === f
                ? 'bg-brand text-white shadow-[0_2px_12px_rgba(108,92,231,0.35)]'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* radar chart card */}
      <motion.div variants={fadeUp} className="bg-slate-900 border border-slate-800/70 rounded-2xl p-4 mb-4">
        <h3 className="text-sm font-semibold mb-1">Academy Overview</h3>
        <p className="text-[11px] text-slate-500 mb-3">Batting · {activeFilter}</p>
        <div className="w-full h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="#243054" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#a8b8d8', fontSize: 11 }} />
              <Radar
                dataKey="val"
                stroke="#6c5ce7"
                fill="#6c5ce7"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={{ r: 3, fill: '#a29bfe', stroke: '#6c5ce7' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* summary */}
      <motion.div variants={fadeUp} className="bg-slate-900 border border-slate-800/70 rounded-2xl p-4 mb-4">
        <h3 className="text-sm font-semibold mb-2">Analysis Summary</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{summaryText}</p>
      </motion.div>

      {/* top performers */}
      <motion.div variants={fadeUp} className="mb-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-success rounded-full" />
          Top Performers
        </h3>
        <div className="space-y-2.5">
          {topPerformers.map(p => (
            <PlayerRow key={p.name} {...p} />
          ))}
        </div>
      </motion.div>

      {/* needs attention */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-danger rounded-full" />
          Needs Attention
        </h3>
        <div className="space-y-2.5">
          {needsAttention.map(p => (
            <PlayerRow key={p.name} {...p} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function PlayerRow({ name, metric, val, trend }) {
  const isUp = trend === 'up'
  return (
    <div className="flex items-center justify-between bg-slate-900 border border-slate-800/70 rounded-xl p-3.5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-semibold text-brand-light">
          {name.split(' ').map(w => w[0]).join('')}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-[11px] text-slate-500">{metric}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-bold ${isUp ? 'text-success' : 'text-danger'}`}>{val}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={isUp ? '#00b894' : '#ff6b6b'} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={isUp ? '' : 'rotate-180'}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </div>
    </div>
  )
}
