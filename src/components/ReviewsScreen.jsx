import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
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

const PLAYERS = [
  { id: 1, name: 'Aditya Joshi', short: 'AJ' },
  { id: 2, name: 'Ananya Shah', short: 'AS' },
  { id: 3, name: 'Arjun Patel', short: 'AP' },
  { id: 4, name: 'Priya Menon', short: 'PM' },
  { id: 5, name: 'Vikram K.', short: 'VK' },
  { id: 6, name: 'Rahul D.', short: 'RD' },
]

const SKILL_TABS = ['Batting', 'Bowling', 'Fielding', 'Fitness']

// per-player radar + metric data — only fleshed out for Aditya, rest is similar shape
const playerData = {
  1: {
    radar: [
      { skill: 'Footwork', val: 72 },
      { skill: 'Timing', val: 85 },
      { skill: 'Shot Sel.', val: 65 },
      { skill: 'Impact', val: 80 },
      { skill: 'Balance', val: 70 },
    ],
    metrics: [
      { label: 'Footwork', score: 5 },
      { label: 'Timing', score: 7 },
      { label: 'Shot Selection', score: 5 },
      { label: 'Power', score: 6 },
      { label: 'Consistency', score: 5 },
    ],
    note: 'Aditya has shown solid timing improvement this month. Footwork needs more focused drills — tends to plant front foot too early against pace.',
  },
  2: {
    radar: [
      { skill: 'Footwork', val: 80 },
      { skill: 'Timing', val: 78 },
      { skill: 'Shot Sel.', val: 88 },
      { skill: 'Impact', val: 70 },
      { skill: 'Balance', val: 82 },
    ],
    metrics: [
      { label: 'Footwork', score: 7 },
      { label: 'Timing', score: 6 },
      { label: 'Shot Selection', score: 8 },
      { label: 'Power', score: 5 },
      { label: 'Consistency', score: 7 },
    ],
    note: 'Excellent shot selection under pressure. Needs to work on generating more power through the off side.',
  },
  3: {
    radar: [
      { skill: 'Footwork', val: 90 },
      { skill: 'Timing', val: 88 },
      { skill: 'Shot Sel.', val: 82 },
      { skill: 'Impact', val: 92 },
      { skill: 'Balance', val: 85 },
    ],
    metrics: [
      { label: 'Footwork', score: 9 },
      { label: 'Timing', score: 8 },
      { label: 'Shot Selection', score: 7 },
      { label: 'Power', score: 8 },
      { label: 'Consistency', score: 8 },
    ],
    note: 'Top performer across the board. Could refine shot selection against spin — occasionally plays across the line.',
  },
}

// fallback for players without detailed data
const defaultData = {
  radar: [
    { skill: 'Footwork', val: 60 },
    { skill: 'Timing', val: 55 },
    { skill: 'Shot Sel.', val: 58 },
    { skill: 'Impact', val: 52 },
    { skill: 'Balance', val: 62 },
  ],
  metrics: [
    { label: 'Footwork', score: 5 },
    { label: 'Timing', score: 5 },
    { label: 'Shot Selection', score: 5 },
    { label: 'Power', score: 5 },
    { label: 'Consistency', score: 5 },
  ],
  note: 'Review pending — no detailed notes yet for this session.',
}

export default function ReviewsScreen() {
  const [selectedPlayer, setSelectedPlayer] = useState(1)
  const [skillTab, setSkillTab] = useState('Batting')
  const scrollRef = useRef(null)

  const data = playerData[selectedPlayer] || defaultData
  const player = PLAYERS.find(p => p.id === selectedPlayer)

  return (
    <motion.div
      className="px-4 pt-14 pb-4"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* header */}
      <motion.div variants={fadeUp} className="mb-4">
        <h1 className="text-xl font-bold tracking-tight">Reviews</h1>
        <p className="text-xs text-slate-400 mt-0.5">Session · Feb 20, 2026</p>
      </motion.div>

      {/* player avatar strip */}
      <motion.div variants={fadeUp} className="mb-5">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar pb-2"
        >
          {PLAYERS.map(p => {
            const active = p.id === selectedPlayer
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlayer(p.id)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200
                  ${active
                    ? 'bg-brand text-white ring-2 ring-brand-light ring-offset-2 ring-offset-slate-950 shadow-[0_0_16px_rgba(108,92,231,0.4)]'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {p.short}
                </div>
                <span className={`text-[10px] font-medium truncate max-w-[60px] ${active ? 'text-white' : 'text-slate-500'}`}>
                  {p.name.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* review card */}
      <motion.div
        key={selectedPlayer} // re-mount on player switch for fresh animation
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        {/* player name bar */}
        <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-brand/20 flex items-center justify-center text-sm font-bold text-brand-light">
              {player.short}
            </div>
            <div>
              <h2 className="text-base font-bold">{player.name}</h2>
              <p className="text-[11px] text-slate-500">Session Review · Batting</p>
            </div>
          </div>

          {/* skill tabs */}
          <div className="flex gap-1 bg-slate-800/60 rounded-xl p-1 mb-4">
            {SKILL_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setSkillTab(tab)}
                className={`flex-1 text-[11px] font-semibold py-2 rounded-lg transition-all duration-200
                  ${skillTab === tab
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-300'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* radar */}
          <div className="w-full h-[210px] mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.radar} outerRadius="72%">
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
        </div>

        {/* sliding scale metrics */}
        <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-4 mb-4">
          <h3 className="text-sm font-semibold mb-3">Skill Breakdown</h3>
          <div className="space-y-3.5">
            {data.metrics.map(m => (
              <MetricBar key={m.label} label={m.label} score={m.score} />
            ))}
          </div>
        </div>

        {/* coach notes */}
        <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-4">
          <h3 className="text-sm font-semibold mb-2">Coach Notes</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{data.note}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MetricBar({ label, score }) {
  const pct = (score / 10) * 100
  // color ramp: red < 4, yellow 4-6, green > 6
  const barColor = score <= 3 ? 'bg-danger' : score <= 6 ? 'bg-warn' : 'bg-success'

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-300">{label}</span>
        <span className="text-xs font-bold text-slate-300">{score}/10</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}
