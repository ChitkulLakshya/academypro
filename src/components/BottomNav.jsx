import { motion } from 'framer-motion'

const tabs = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'analysis', label: 'Analysis', icon: ChartIcon },
  { id: 'reviews', label: 'Reviews', icon: StarIcon },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      <div className="mx-3 mb-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/60 shadow-[0_-4px_30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-around py-2">
          {tabs.map(t => {
            const isActive = active === t.id
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className="relative flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-brand/15 rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <t.icon active={isActive} />
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-brand-light' : 'text-slate-500'}`}>
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#a29bfe' : '#4f6490'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function ChartIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#a29bfe' : '#4f6490'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function StarIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#a29bfe' : '#4f6490'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
