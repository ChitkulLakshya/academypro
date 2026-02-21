import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { ANIM, TIME_FILTERS, filterToKey } from '../utils/constants'
import { getInitials, scoreColor, nameToHue } from '../utils/helpers'

const SKILL_KEYS = ['footwork', 'timing', 'shotSelection', 'balance', 'impact', 'speed', 'passing', 'stamina', 'shooting']

export function PlayerDetailModal({ player, onClose }) {
  const [timeFilter, setTimeFilter] = useState('30 Days')
  const filterKey = filterToKey(timeFilter)

  if (!player) return null

  const stats = player.stats?.[filterKey] || {}
  const hue = nameToHue(player.name)

  const radarData = useMemo(() => {
    return SKILL_KEYS.map(key => ({
      skill: key.charAt(0).toUpperCase() + key.slice(1),
      value: stats[key] || 0,
      fullMark: 100,
    }))
  }, [filterKey, player.id])

  const overallAvg = useMemo(() => {
    const vals = Object.values(stats).filter(v => typeof v === 'number')
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
  }, [stats])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-dark-950/90 backdrop-blur-sm flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-h-[90vh] overflow-y-auto bg-dark-900 rounded-t-3xl border-t border-dark-700 px-4 pt-5 pb-8"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          {/* drag handle */}
          <div className="w-10 h-1 rounded-full bg-dark-600 mx-auto mb-5" />

          {/* player header */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ring-2 ring-orange/30 ring-offset-2 ring-offset-dark-900"
              style={{ backgroundColor: `hsl(${hue}, 40%, 18%)` }}
            >
              {getInitials(player.name)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{player.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] bg-orange/10 text-orange px-2 py-0.5 rounded-full font-medium">{player.category}</span>
                <span className="text-[10px] text-dark-400">{player.role}</span>
                <span className="text-[10px] text-dark-500">#{player.jerseyNumber}</span>
              </div>
            </div>
            <div
              className="w-13 h-13 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: `${scoreColor(overallAvg)}18`, color: scoreColor(overallAvg) }}
            >
              {overallAvg}
            </div>
          </div>

          {/* time filter strip */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1">
            {TIME_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all
                  ${timeFilter === f ? 'bg-orange text-dark-950' : 'bg-dark-800 text-dark-400 border border-dark-700'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* radar chart */}
          <div className="card p-4 mb-4">
            <h3 className="text-sm font-semibold mb-2">Skill Radar</h3>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="#2c2c2e" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#9a9a9e', fontSize: 9 }} />
                  <Radar
                    dataKey="value"
                    stroke="#F5A623"
                    fill="#F5A623"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#FF9F0A', stroke: '#F5A623' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* stat bars */}
          <div className="card p-4 mb-4">
            <h3 className="text-sm font-semibold mb-3">Skill Breakdown</h3>
            <div className="space-y-3">
              {SKILL_KEYS.map((key, i) => {
                const val = stats[key] || 0
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-dark-400 capitalize">{key}</span>
                      <span className="text-[10px] font-bold" style={{ color: scoreColor(val) }}>{val}</span>
                    </div>
                    <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: scoreColor(val) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.5, delay: i * 0.04 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* achievements */}
          {player.recentAchievements?.length > 0 && (
            <div className="card p-4 mb-4">
              <h3 className="text-sm font-semibold mb-2.5">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {player.recentAchievements.map((a, i) => (
                  <span key={i} className="text-[10px] bg-orange/10 text-orange px-2.5 py-1 rounded-lg font-medium">
                    🏅 {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* time comparison */}
          <div className="card p-4 mb-4">
            <h3 className="text-sm font-semibold mb-3">Progress Over Time</h3>
            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-dark-700 text-dark-400">
                    <th className="text-left py-2 pr-2 font-medium">Skill</th>
                    <th className="text-center py-2 px-2 font-medium">30D</th>
                    <th className="text-center py-2 px-2 font-medium">60D</th>
                    <th className="text-center py-2 px-2 font-medium">90D</th>
                    <th className="text-center py-2 pl-2 font-medium">All</th>
                  </tr>
                </thead>
                <tbody>
                  {SKILL_KEYS.map(key => (
                    <tr key={key} className="border-b border-dark-800/50">
                      <td className="py-2 pr-2 capitalize text-dark-300 font-medium">{key}</td>
                      {['30', '60', '90', 'all'].map(period => {
                        const v = player.stats?.[period]?.[key] || 0
                        return (
                          <td key={period} className="text-center py-2 px-2">
                            <span className="font-semibold" style={{ color: scoreColor(v) }}>{v}</span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* close button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-dark-800 text-dark-300 text-xs font-semibold hover:bg-dark-700 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
