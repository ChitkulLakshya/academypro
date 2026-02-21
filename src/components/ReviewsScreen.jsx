import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { ANIM, SKILL_TABS, TIME_FILTERS, filterToKey } from '../utils/constants'
import { getInitials, scoreColor, nameToHue } from '../utils/helpers'
import { players } from '../data/mockData'
import { playerReviews } from '../data/sessionData'

const REVIEW_TABS = ['Overview', 'Batting', 'Bowling', 'Fielding', 'Fitness']

export default function ReviewsScreen() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0]?.id || 'p001')
  const [activeTab, setActiveTab] = useState('Overview')
  const [timeFilter, setTimeFilter] = useState('30 Days')
  const [coachNote, setCoachNote] = useState('')
  const [showAllPlayers, setShowAllPlayers] = useState(false)
  const scrollRef = useRef(null)

  const filterKey = filterToKey(timeFilter)
  const selectedPlayer = players.find(p => p.id === selectedPlayerId) || players[0]
  const review = playerReviews[selectedPlayerId] || null
  const visiblePlayers = showAllPlayers ? players : players.slice(0, 12)

  const radarData = useMemo(() => {
    const stats = selectedPlayer.stats?.[filterKey] || {}
    return Object.entries(stats).map(([key, val]) => ({
      skill: key.charAt(0).toUpperCase() + key.slice(1),
      value: val,
      fullMark: 100,
    }))
  }, [selectedPlayerId, filterKey])

  const overallAvg = useMemo(() => {
    const stats = selectedPlayer.stats?.[filterKey]
    if (!stats) return 0
    const vals = Object.values(stats).filter(v => typeof v === 'number')
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
  }, [selectedPlayerId, filterKey])

  return (
    <motion.div
      className="px-4 pt-12 pb-4"
      variants={ANIM.stagger}
      initial="hidden"
      animate="show"
    >
      <PageHeader />
      <TimeFilterStrip active={timeFilter} onChange={setTimeFilter} />
      <PlayerSelector
        players={visiblePlayers}
        selectedId={selectedPlayerId}
        onSelect={setSelectedPlayerId}
        scrollRef={scrollRef}
      />

      {!showAllPlayers && players.length > 12 && (
        <motion.button
          variants={ANIM.fadeUp}
          className="text-[11px] text-orange font-medium mb-4"
          onClick={() => setShowAllPlayers(true)}
        >
          Show all {players.length} players →
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPlayerId}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
        >
          <PlayerHeader player={selectedPlayer} overallAvg={overallAvg} />
          <TabSelector tabs={REVIEW_TABS} active={activeTab} onChange={setActiveTab} />
          <RadarCard data={radarData} filterLabel={timeFilter} player={selectedPlayer} />

          {activeTab === 'Overview' && (
            <>
              <OverallBreakdown player={selectedPlayer} filterKey={filterKey} />
              <AchievementsList achievements={selectedPlayer.recentAchievements} />
            </>
          )}

          {activeTab !== 'Overview' && review && (
            <CategoryReview
              category={activeTab.toLowerCase()}
              review={review}
              player={selectedPlayer}
            />
          )}

          {!review && activeTab !== 'Overview' && (
            <motion.div variants={ANIM.fadeUp} className="card p-5 mb-4 text-center">
              <p className="text-dark-400 text-sm">No review data for this tab yet</p>
            </motion.div>
          )}

          <CoachNotes
            existingNote={review?.coachNote}
            draft={coachNote}
            onDraftChange={setCoachNote}
          />
          <HistoryTimeline playerId={selectedPlayerId} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

function PageHeader() {
  const today = new Date()
  const formatted = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <motion.div variants={ANIM.fadeUp} className="mb-4">
      <h1 className="text-xl font-bold tracking-tight">Reviews</h1>
      <p className="text-xs text-dark-400 mt-0.5">Session · {formatted}</p>
    </motion.div>
  )
}

function TimeFilterStrip({ active, onChange }) {
  return (
    <motion.div variants={ANIM.fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1">
      {TIME_FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all
            ${active === f
              ? 'bg-orange text-dark-950 shadow-[0_2px_10px_rgba(245,166,35,0.3)]'
              : 'bg-dark-800 text-dark-400 border border-dark-700'
            }`}
        >
          {f}
        </button>
      ))}
    </motion.div>
  )
}

function PlayerSelector({ players, selectedId, onSelect, scrollRef }) {
  return (
    <motion.div variants={ANIM.fadeUp} className="mb-5">
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {players.map(p => {
          const active = p.id === selectedId
          const hue = nameToHue(p.name)
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <div
                className={`w-13 h-13 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  active
                    ? 'ring-2 ring-orange ring-offset-2 ring-offset-dark-950 shadow-[0_0_14px_rgba(245,166,35,0.35)]'
                    : 'border border-dark-700'
                }`}
                style={{ backgroundColor: active ? '#F5A623' : `hsl(${hue}, 35%, 18%)` }}
              >
                <span className={active ? 'text-dark-950' : 'text-dark-200'}>
                  {getInitials(p.name)}
                </span>
              </div>
              <span className={`text-[10px] font-medium truncate max-w-[60px] ${active ? 'text-orange' : 'text-dark-500'}`}>
                {p.name.split(' ')[0]}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

function PlayerHeader({ player, overallAvg }) {
  const hue = nameToHue(player.name)

  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: `hsl(${hue}, 40%, 18%)` }}
        >
          {getInitials(player.name)}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold">{player.name}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-dark-400">{player.category}</span>
            <span className="w-1 h-1 rounded-full bg-dark-600" />
            <span className="text-[10px] text-dark-400">{player.role}</span>
            <span className="w-1 h-1 rounded-full bg-dark-600" />
            <span className="text-[10px] text-dark-400">#{player.jerseyNumber}</span>
          </div>
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{
            backgroundColor: `${scoreColor(overallAvg)}18`,
            color: scoreColor(overallAvg),
          }}
        >
          {overallAvg}
        </div>
      </div>
    </motion.div>
  )
}

function TabSelector({ tabs, active, onChange }) {
  return (
    <motion.div variants={ANIM.fadeUp} className="mb-4">
      <div className="flex gap-1 bg-dark-800 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`flex-1 text-[10px] font-semibold py-2 rounded-lg transition-all duration-200
              ${active === tab
                ? 'bg-orange text-dark-950 shadow-sm'
                : 'text-dark-400 hover:text-dark-300'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function RadarCard({ data, filterLabel, player }) {
  if (!data.length) return null

  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold">{player.name.split(' ')[0]}'s Profile</h3>
          <p className="text-[11px] text-dark-400">{filterLabel}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange" />
          <span className="text-[10px] text-dark-400">Skills</span>
        </div>
      </div>
      <div className="w-full h-[230px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="70%">
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
              animationDuration={700}
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
    </motion.div>
  )
}

function OverallBreakdown({ player, filterKey }) {
  const stats = player.stats?.[filterKey] || {}

  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <h3 className="text-sm font-semibold mb-3">Skill Breakdown</h3>
      <div className="space-y-3">
        {Object.entries(stats).map(([key, val]) => (
          <SkillSlider key={key} label={key} value={val} />
        ))}
      </div>
    </motion.div>
  )
}

function SkillSlider({ label, value }) {
  const pct = Math.min(100, value)
  const color = scoreColor(value)

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-dark-300 capitalize">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
        />
      </div>
    </div>
  )
}

function AchievementsList({ achievements }) {
  if (!achievements?.length) return null

  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <h3 className="text-sm font-semibold mb-2.5">Recent Achievements</h3>
      <div className="flex flex-wrap gap-2">
        {achievements.map((a, i) => (
          <span
            key={i}
            className="text-[10px] bg-orange/10 text-orange px-2.5 py-1 rounded-lg font-medium"
          >
            🏅 {a}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function CategoryReview({ category, review, player }) {
  const catData = review?.[category]
  if (!catData) {
    return (
      <motion.div variants={ANIM.fadeUp} className="card p-5 mb-4 text-center">
        <p className="text-dark-400 text-sm">No {category} data available</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={ANIM.fadeUp}
      className="card p-4 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-sm font-semibold mb-3 capitalize">{category} Review</h3>

      {/* overall score */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold"
          style={{
            backgroundColor: `${scoreColor(catData.overall)}18`,
            color: scoreColor(catData.overall),
          }}
        >
          {catData.overall}
        </div>
        <div>
          <p className="text-sm font-medium">{catData.grade || 'Good'}</p>
          <p className="text-[10px] text-dark-400">Overall {category} rating</p>
        </div>
      </div>

      {/* sub-skill bars */}
      {catData.skills && (
        <div className="space-y-3 mb-4">
          {Object.entries(catData.skills).map(([sk, val]) => (
            <SkillSlider key={sk} label={sk} value={val} />
          ))}
        </div>
      )}

      {/* comment */}
      {catData.comment && (
        <div className="bg-dark-800 rounded-xl p-3.5 border border-dark-700">
          <p className="text-[10px] text-dark-500 uppercase tracking-wider font-medium mb-1">Coach Comment</p>
          <p className="text-xs text-dark-300 leading-relaxed">{catData.comment}</p>
        </div>
      )}
    </motion.div>
  )
}

function CoachNotes({ existingNote, draft, onDraftChange }) {
  return (
    <motion.div variants={ANIM.fadeUp} className="card p-4 mb-4">
      <h3 className="text-sm font-semibold mb-2">Coach Notes</h3>
      {existingNote && (
        <div className="bg-dark-800 rounded-xl p-3.5 border border-dark-700 mb-3">
          <p className="text-xs text-dark-300 leading-relaxed">{existingNote}</p>
        </div>
      )}
      <div className="relative">
        <textarea
          className="w-full bg-dark-800 border border-dark-700 rounded-xl p-3.5 text-xs text-dark-200 placeholder:text-dark-500 focus:outline-none focus:border-orange/40 resize-none transition-colors"
          rows={3}
          placeholder="Add notes for this session..."
          value={draft}
          onChange={e => onDraftChange(e.target.value)}
        />
        {draft.length > 0 && (
          <button className="absolute bottom-3 right-3 text-[10px] font-semibold text-dark-950 bg-orange px-3 py-1.5 rounded-lg hover:bg-orange-light transition-colors">
            Save
          </button>
        )}
      </div>
    </motion.div>
  )
}

function HistoryTimeline({ playerId }) {
  // pretend history entries
  const entries = [
    { date: 'Feb 18', note: 'Batting session — consistent drives', score: 78 },
    { date: 'Feb 15', note: 'Fielding session — reflexes improved', score: 72 },
    { date: 'Feb 12', note: 'Net practice — timing off', score: 65 },
    { date: 'Feb 10', note: 'Fitness test — stamina up 4%', score: 80 },
    { date: 'Feb 7', note: 'Match day — solid performance', score: 84 },
  ]

  return (
    <motion.div variants={ANIM.fadeUp} className="mb-4">
      <h3 className="text-sm font-semibold mb-3">Review History</h3>
      <div className="relative pl-4">
        {/* timeline line */}
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-dark-700" />

        <div className="space-y-3">
          {entries.map((e, i) => (
            <div key={i} className="flex items-start gap-3 relative">
              {/* dot */}
              <div
                className="w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-0.5 -ml-4"
                style={{
                  borderColor: scoreColor(e.score),
                  backgroundColor: i === 0 ? scoreColor(e.score) : 'transparent',
                }}
              />
              <div className="card-inner p-3 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-dark-400 font-medium">{e.date}</span>
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: scoreColor(e.score) }}
                  >
                    {e.score}
                  </span>
                </div>
                <p className="text-xs text-dark-300">{e.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// metric bar exported for reuse elsewhere
export function MetricBar({ label, score, maxScore = 10 }) {
  const pct = (score / maxScore) * 100
  const color = score <= 3 ? '#FF453A' : score <= 6 ? '#FFD60A' : '#30D158'

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-dark-300">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{score}/{maxScore}</span>
      </div>
      <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}

// summary stat row for outside use
export function ReviewSummaryRow({ name, score, trend }) {
  const isUp = trend === 'up'
  return (
    <div className="flex items-center justify-between card-inner p-3">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ backgroundColor: `hsl(${nameToHue(name)}, 40%, 18%)` }}
        >
          {getInitials(name)}
        </div>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-bold ${isUp ? 'text-success' : 'text-danger'}`}>{score}</span>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke={isUp ? '#30D158' : '#FF453A'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={isUp ? '' : 'rotate-180'}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </div>
    </div>
  )
}
