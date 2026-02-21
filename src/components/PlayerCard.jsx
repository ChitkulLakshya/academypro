import { motion } from 'framer-motion'
import { ANIM } from '../utils/constants'
import { getInitials, scoreColor, nameToHue } from '../utils/helpers'

/**
 * Reusable player card — used on Home, Analysis, and Reviews screens.
 * Size variants: compact | default | expanded
 */
export default function PlayerCard({
  player,
  variant = 'default',
  onTap,
  selected = false,
  showBadge = false,
  badgeText = '',
  delay = 0,
}) {
  if (!player) return null

  const initials = getInitials(player.name)
  const hue = nameToHue(player.name)
  const bgStyle = { backgroundColor: `hsl(${hue}, 40%, 18%)` }

  if (variant === 'compact') {
    return (
      <CompactCard
        player={player}
        initials={initials}
        bgStyle={bgStyle}
        onTap={onTap}
        selected={selected}
        delay={delay}
      />
    )
  }

  if (variant === 'expanded') {
    return (
      <ExpandedCard
        player={player}
        initials={initials}
        bgStyle={bgStyle}
        onTap={onTap}
        selected={selected}
        showBadge={showBadge}
        badgeText={badgeText}
        delay={delay}
      />
    )
  }

  return (
    <DefaultCard
      player={player}
      initials={initials}
      bgStyle={bgStyle}
      onTap={onTap}
      selected={selected}
      showBadge={showBadge}
      badgeText={badgeText}
      delay={delay}
    />
  )
}

function CompactCard({ player, initials, bgStyle, onTap, selected, delay }) {
  return (
    <motion.button
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
        selected
          ? 'bg-orange/15 border border-orange/30'
          : 'bg-dark-800 border border-dark-700 hover:border-dark-600'
      }`}
      variants={ANIM.fadeUp}
      whileTap={{ scale: 0.97 }}
      onClick={() => onTap?.(player)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05, duration: 0.25 }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
        style={bgStyle}
      >
        {initials}
      </div>
      <span className={`text-xs font-medium ${selected ? 'text-orange' : 'text-dark-200'}`}>
        {player.name.split(' ')[0]}
      </span>
    </motion.button>
  )
}

function DefaultCard({ player, initials, bgStyle, onTap, selected, showBadge, badgeText, delay }) {
  const overallAvg = computeOverallAvg(player)

  return (
    <motion.button
      className={`card-inner p-3.5 text-left w-full transition-all ${
        selected ? 'ring-1 ring-orange/40 bg-orange/5' : ''
      }`}
      variants={ANIM.fadeUp}
      whileTap={{ scale: 0.98 }}
      onClick={() => onTap?.(player)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.06, duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
          style={bgStyle}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{player.name}</p>
          <p className="text-[10px] text-dark-400 mt-0.5">
            {player.role} · #{player.jerseyNumber}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span
            className="text-sm font-bold"
            style={{ color: scoreColor(overallAvg) }}
          >
            {overallAvg}
          </span>
          {showBadge && badgeText && (
            <span className="block text-[9px] text-dark-400 mt-0.5">{badgeText}</span>
          )}
        </div>
      </div>
    </motion.button>
  )
}

function ExpandedCard({ player, initials, bgStyle, onTap, selected, showBadge, badgeText, delay }) {
  const stats = player.stats?.['30'] || {}
  const overallAvg = computeOverallAvg(player)
  const skillKeys = ['footwork', 'timing', 'shotSelection', 'balance', 'impact', 'speed', 'passing', 'stamina', 'shooting']

  return (
    <motion.div
      className={`card p-4 transition-all ${
        selected ? 'ring-1 ring-orange/40' : ''
      }`}
      variants={ANIM.fadeUp}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.07, duration: 0.35 }}
    >
      {/* header row */}
      <div className="flex items-center gap-3 mb-3.5">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={bgStyle}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{player.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-dark-400">{player.category}</span>
            <span className="w-1 h-1 rounded-full bg-dark-600" />
            <span className="text-[10px] text-dark-400">{player.role}</span>
            <span className="w-1 h-1 rounded-full bg-dark-600" />
            <span className="text-[10px] text-dark-400">#{player.jerseyNumber}</span>
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: `${scoreColor(overallAvg)}18`, color: scoreColor(overallAvg) }}
        >
          {overallAvg}
        </div>
      </div>

      {/* mini stat bars */}
      <div className="space-y-2">
        {skillKeys.map(key => {
          const val = stats[key] ?? 0
          return (
            <div key={key} className="flex items-center gap-2.5">
              <span className="text-[10px] text-dark-400 w-[72px] capitalize truncate">{key}</span>
              <div className="flex-1 h-1.5 rounded-full bg-dark-700">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: scoreColor(val) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] font-medium w-7 text-right">{val}</span>
            </div>
          )
        })}
      </div>

      {/* achievements */}
      {player.recentAchievements?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-dark-700">
          <p className="text-[10px] text-dark-400 mb-1.5 font-medium uppercase tracking-wider">Achievements</p>
          <div className="flex flex-wrap gap-1.5">
            {player.recentAchievements.map((a, i) => (
              <span
                key={i}
                className="text-[10px] bg-orange/10 text-orange px-2 py-0.5 rounded-md font-medium"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* show badge if requested */}
      {showBadge && badgeText && (
        <div className="mt-3 pt-3 border-t border-dark-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange" />
          <span className="text-[11px] text-dark-300">{badgeText}</span>
        </div>
      )}

      {/* tap handler */}
      {onTap && (
        <button
          className="mt-3 w-full text-center text-xs font-medium text-orange hover:text-orange-light transition-colors"
          onClick={() => onTap(player)}
        >
          View Full Profile →
        </button>
      )}
    </motion.div>
  )
}

/** average of all available 30-day stats */
function computeOverallAvg(player) {
  const stats = player.stats?.['30']
  if (!stats) return 0
  const vals = Object.values(stats).filter(v => typeof v === 'number')
  if (vals.length === 0) return 0
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

// pill-shaped role tag used in lists
export function RoleTag({ role }) {
  const colorMap = {
    'Batsman': 'bg-orange/15 text-orange',
    'Bowler': 'bg-info/15 text-info',
    'All-Rounder': 'bg-success/15 text-success',
    'Wicket-Keeper': 'bg-warn/15 text-warn',
  }
  const cls = colorMap[role] || 'bg-dark-700 text-dark-300'

  return (
    <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${cls}`}>
      {role}
    </span>
  )
}

// horizontal scroll list of compact player cards
export function PlayerChipList({ players, selectedId, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
      {players.map((p, i) => (
        <CompactCard
          key={p.id}
          player={p}
          initials={getInitials(p.name)}
          bgStyle={{ backgroundColor: `hsl(${nameToHue(p.name)}, 40%, 18%)` }}
          onTap={onSelect}
          selected={p.id === selectedId}
          delay={i}
        />
      ))}
    </div>
  )
}
