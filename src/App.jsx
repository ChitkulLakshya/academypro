import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BottomNav from './components/BottomNav'
import HomeScreen from './components/HomeScreen'
import AnalysisScreen from './components/AnalysisScreen'
import ReviewsScreen from './components/ReviewsScreen'

const TABS = ['home', 'analysis', 'reviews']

export default function App() {
  const [tab, setTab] = useState('home')
  const idx = TABS.indexOf(tab)

  return (
    <div className="relative min-h-dvh bg-slate-950 pb-20 overflow-hidden">
      {/* ambient glow — keeps the top from feeling too flat */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-brand/[0.07] blur-[100px]" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {tab === 'home' && <HomeScreen />}
          {tab === 'analysis' && <AnalysisScreen />}
          {tab === 'reviews' && <ReviewsScreen />}
        </motion.div>
      </AnimatePresence>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
