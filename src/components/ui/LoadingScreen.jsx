import { motion } from 'framer-motion'

// ─── LoadingScreen ────────────────────────────────────────────
// Full-screen loader with the academy logo and pulsing rings.
// Shown during initial data fetch or heavy transitions.

export default function LoadingScreen({ message = 'Loading...', progress = null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-900 px-6">
      {/* animated logo container */}
      <div className="relative mb-8">
        {/* outer pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-orange/30"
          style={{ width: 100, height: 100, margin: '-10px' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* inner ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-orange/50"
          style={{ width: 80, height: 80 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* center icon / logo */}
        <motion.div
          className="w-20 h-20 rounded-full gradient-orange flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-black font-bold text-2xl">A</span>
        </motion.div>
      </div>

      {/* brand name */}
      <motion.h1
        className="text-xl font-bold text-white tracking-wider mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        ACADEMY<span className="text-orange">PRO</span>
      </motion.h1>

      {/* message */}
      <motion.p
        className="text-dark-300 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {message}
      </motion.p>

      {/* optional progress bar */}
      {progress !== null && (
        <motion.div
          className="mt-6 w-48 h-1.5 progress-track"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="h-full progress-fill gradient-orange"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </motion.div>
      )}

      {/* bottom dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-orange"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}
