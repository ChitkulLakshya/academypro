/**
 * Animation variants & transition presets used across the app.
 * Centralizes motion config so every screen feels consistent.
 */

// page-level transitions
export const pageSlideLeft = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
  transition: { type: 'spring', damping: 28, stiffness: 260 },
}

export const pageSlideRight = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '30%', opacity: 0 },
  transition: { type: 'spring', damping: 28, stiffness: 260 },
}

export const pageFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

// modal backdrop
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

// bottom sheet
export const bottomSheetVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: { y: '100%', transition: { duration: 0.2 } },
}

// card hover / tap
export const cardTap = {
  whileTap: { scale: 0.98 },
  whileHover: { scale: 1.01 },
  transition: { type: 'spring', stiffness: 400, damping: 15 },
}

// stagger presets for lists
export const listStagger = (delay = 0.04) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: delay,
    },
  },
})

export const listItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

// number counter animation helper
export function countTo(target, duration = 1200) {
  return {
    from: 0,
    to: target,
    duration,
    ease: [0.33, 1, 0.68, 1], // easeOutCubic
  }
}

// spring config presets
export const springs = {
  snappy: { type: 'spring', stiffness: 500, damping: 30 },
  gentle: { type: 'spring', stiffness: 200, damping: 20 },
  bouncy: { type: 'spring', stiffness: 400, damping: 10, mass: 0.8 },
  smooth: { type: 'spring', stiffness: 120, damping: 14 },
  elastic: { type: 'spring', stiffness: 300, damping: 8, mass: 0.6 },
  stiff: { type: 'spring', stiffness: 600, damping: 35, mass: 1 },
}

// skeleton pulse for loading states
export const skeletonPulse = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// toast slide-in
export const toastVariants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
}
