import { motion } from 'framer-motion'
import { scoreColor } from '../utils/helpers'

/**
 * Animated circular progress ring.
 * Renders an SVG ring that fills from 0 → value%.
 */
export function ProgressRing({
  value = 0,
  size = 120,
  strokeWidth = 8,
  bgStroke = '#2c2c2e',
  delay = 0,
  showLabel = true,
  labelSuffix = '%',
  gradientId,
}) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(value, 100) / 100) * circ
  const color = scoreColor(value)
  const gId = gradientId || `ring-${value}-${size}`

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={bgStroke} strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={`url(#${gId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay }}
        />
        <defs>
          <linearGradient id={gId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9F0A" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-bold" style={{ color }}>
          {value}{labelSuffix}
        </span>
      )}
    </div>
  )
}

/**
 * Horizontal animated bar with label.
 */
export function AnimatedBar({
  label,
  value = 0,
  maxVal = 100,
  height = 'h-2',
  delay = 0,
  showValue = true,
  color,
}) {
  const pct = Math.min(100, (value / maxVal) * 100)
  const barColor = color || scoreColor(value)

  return (
    <div>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-[10px] text-dark-400 capitalize">{label}</span>}
          {showValue && (
            <span className="text-[10px] font-bold" style={{ color: barColor }}>
              {value}
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-dark-700 overflow-hidden`}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

/**
 * Empty state placeholder.
 */
export function EmptyState({ emoji = '📭', title = 'Nothing here', subtitle = '' }) {
  return (
    <div className="text-center py-10">
      <span className="text-4xl block mb-3">{emoji}</span>
      <p className="text-sm font-medium text-dark-300">{title}</p>
      {subtitle && <p className="text-xs text-dark-500 mt-1">{subtitle}</p>}
    </div>
  )
}

/**
 * Section header with optional action button.
 */
export function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {action && (
        <button
          onClick={onAction}
          className="text-[11px] font-medium text-orange hover:text-orange-light transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  )
}
