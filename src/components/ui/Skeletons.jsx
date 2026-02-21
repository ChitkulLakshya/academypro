import { motion } from 'framer-motion'

// ─── Skeleton Components ──────────────────────────────────────
// Placeholder loading states that match the real layout shapes.
// Each variant mirrors a specific screen section so the content
// shift feels minimal when real data appears.

// reusable shimmer box
function Shimmer({ className = '', style = {} }) {
  return (
    <motion.div
      className={`skeleton ${className}`}
      style={style}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )
}

// ─── Text Skeleton ────────────────────────────────────────────
export function SkeletonText({ lines = 3, widths = [] }) {
  const defaultWidths = ['100%', '85%', '70%', '90%', '60%']
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          style={{
            height: 14,
            width: widths[i] || defaultWidths[i % defaultWidths.length],
          }}
        />
      ))}
    </div>
  )
}

// ─── Player Card Skeleton ─────────────────────────────────────
export function SkeletonPlayerCard() {
  return (
    <div className="card p-4 flex items-center gap-3">
      <Shimmer className="skeleton-circle" style={{ width: 44, height: 44 }} />
      <div className="flex-1 flex flex-col gap-2">
        <Shimmer style={{ height: 16, width: '60%' }} />
        <Shimmer style={{ height: 12, width: '40%' }} />
      </div>
      <Shimmer style={{ height: 28, width: 48, borderRadius: 8 }} />
    </div>
  )
}

// ─── Stats Grid Skeleton ──────────────────────────────────────
export function SkeletonStatsGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-inner p-4 flex flex-col gap-2">
          <Shimmer style={{ height: 12, width: '50%' }} />
          <Shimmer style={{ height: 28, width: '70%' }} />
          <Shimmer style={{ height: 8, width: '100%' }} />
        </div>
      ))}
    </div>
  )
}

// ─── Radar Chart Skeleton ─────────────────────────────────────
export function SkeletonRadarChart() {
  return (
    <div className="card p-4 flex flex-col items-center gap-3">
      <Shimmer style={{ height: 18, width: '40%' }} />
      <Shimmer className="skeleton-circle" style={{ width: 200, height: 200 }} />
      <div className="flex gap-3 mt-2">
        <Shimmer style={{ height: 12, width: 60 }} />
        <Shimmer style={{ height: 12, width: 60 }} />
        <Shimmer style={{ height: 12, width: 60 }} />
      </div>
    </div>
  )
}

// ─── Session Card Skeleton ────────────────────────────────────
export function SkeletonSessionCard() {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Shimmer style={{ height: 16, width: '55%' }} />
        <Shimmer style={{ height: 22, width: 60, borderRadius: 999 }} />
      </div>
      <Shimmer style={{ height: 12, width: '75%' }} />
      <div className="flex gap-2">
        <Shimmer style={{ height: 12, width: 80 }} />
        <Shimmer style={{ height: 12, width: 60 }} />
      </div>
    </div>
  )
}

// ─── Review Item Skeleton ─────────────────────────────────────
export function SkeletonReviewItem() {
  return (
    <div className="card p-4 flex gap-3">
      <Shimmer className="skeleton-circle" style={{ width: 36, height: 36 }} />
      <div className="flex-1 flex flex-col gap-2">
        <Shimmer style={{ height: 14, width: '50%' }} />
        <SkeletonText lines={2} widths={['90%', '65%']} />
        <Shimmer style={{ height: 10, width: '30%' }} />
      </div>
    </div>
  )
}

// ─── Profile Header Skeleton ──────────────────────────────────
export function SkeletonProfileHeader() {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <Shimmer className="skeleton-circle" style={{ width: 80, height: 80 }} />
      <Shimmer style={{ height: 20, width: 160 }} />
      <Shimmer style={{ height: 14, width: 100 }} />
      <div className="flex gap-4 mt-2">
        <div className="flex flex-col items-center gap-1">
          <Shimmer style={{ height: 22, width: 40 }} />
          <Shimmer style={{ height: 10, width: 50 }} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <Shimmer style={{ height: 22, width: 40 }} />
          <Shimmer style={{ height: 10, width: 50 }} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <Shimmer style={{ height: 22, width: 40 }} />
          <Shimmer style={{ height: 10, width: 50 }} />
        </div>
      </div>
    </div>
  )
}

// ─── Leaderboard Row Skeleton ─────────────────────────────────
export function SkeletonLeaderboardRow() {
  return (
    <div className="flex items-center gap-3 py-3 px-4">
      <Shimmer style={{ height: 18, width: 24 }} />
      <Shimmer className="skeleton-circle" style={{ width: 36, height: 36 }} />
      <div className="flex-1 flex flex-col gap-1">
        <Shimmer style={{ height: 14, width: '55%' }} />
        <Shimmer style={{ height: 10, width: '35%' }} />
      </div>
      <Shimmer style={{ height: 20, width: 40 }} />
    </div>
  )
}

// ─── Full-page Skeleton Layouts ───────────────────────────────
export function SkeletonHomePage() {
  return (
    <div className="px-4 pb-24 pt-4 flex flex-col gap-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <Shimmer style={{ height: 24, width: 140 }} />
        <Shimmer className="skeleton-circle" style={{ width: 36, height: 36 }} />
      </div>
      {/* welcome banner */}
      <div className="card p-4 flex flex-col gap-2">
        <Shimmer style={{ height: 18, width: '70%' }} />
        <Shimmer style={{ height: 14, width: '50%' }} />
      </div>
      {/* stats grid */}
      <SkeletonStatsGrid count={4} />
      {/* player cards */}
      <SkeletonPlayerCard />
      <SkeletonPlayerCard />
      <SkeletonPlayerCard />
    </div>
  )
}

export function SkeletonAnalysisPage() {
  return (
    <div className="px-4 pb-24 pt-4 flex flex-col gap-4">
      <Shimmer style={{ height: 24, width: 120 }} />
      {/* filter chips */}
      <div className="flex gap-2">
        <Shimmer style={{ height: 32, width: 64, borderRadius: 999 }} />
        <Shimmer style={{ height: 32, width: 64, borderRadius: 999 }} />
        <Shimmer style={{ height: 32, width: 64, borderRadius: 999 }} />
      </div>
      {/* radar */}
      <SkeletonRadarChart />
      {/* summary cards */}
      <SkeletonStatsGrid count={2} />
      {/* skill bars */}
      <div className="card p-4 flex flex-col gap-3">
        <Shimmer style={{ height: 16, width: '40%' }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Shimmer style={{ height: 12, width: 60 }} />
            <Shimmer style={{ height: 8, width: '100%', flex: 1 }} />
            <Shimmer style={{ height: 12, width: 30 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonReviewsPage() {
  return (
    <div className="px-4 pb-24 pt-4 flex flex-col gap-4">
      <Shimmer style={{ height: 24, width: 100 }} />
      {/* player selector */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="skeleton-circle" style={{ width: 48, height: 48, flexShrink: 0 }} />
        ))}
      </div>
      {/* player header */}
      <div className="card p-4 flex items-center gap-3">
        <Shimmer className="skeleton-circle" style={{ width: 52, height: 52 }} />
        <div className="flex-1 flex flex-col gap-2">
          <Shimmer style={{ height: 18, width: '60%' }} />
          <Shimmer style={{ height: 12, width: '40%' }} />
        </div>
      </div>
      {/* tabs */}
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} style={{ height: 28, width: 70, borderRadius: 999 }} />
        ))}
      </div>
      {/* review items */}
      <SkeletonReviewItem />
      <SkeletonReviewItem />
    </div>
  )
}

export { Shimmer }
