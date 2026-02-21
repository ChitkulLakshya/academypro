// shared constants — colors, spacing tokens, etc.
// keeping it DRY so we dont scatter magic values everywhere

export const COLORS = {
  orange: '#F5A623',
  orangeLight: '#FFB84D',
  orangeDark: '#D4911E',
  accent: '#FF9F0A',
  success: '#30D158',
  danger: '#FF453A',
  warn: '#FFD60A',
  info: '#64D2FF',
  white: '#f5f5f7',
  gray100: '#d1d1d6',
  gray300: '#8e8e93',
  gray400: '#636366',
  gray500: '#3a3a3c',
  gray600: '#2c2c2e',
  gray700: '#1c1c1e',
  gray800: '#161616',
  gray900: '#0a0a0a',
}

// framer motion presets — reuse everywhere
export const ANIM = {
  fadeUp: {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3 } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  },
  stagger: {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  },
  staggerSlow: {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  },
}

export const TIME_FILTERS = ['30 Days', '60 Days', '90 Days', 'All Time']
export const SKILL_TABS = ['Batting', 'Bowling', 'Fielding', 'Fitness']

// map filter label to data key
export const filterToKey = (label) => {
  const map = { '30 Days': '30', '60 Days': '60', '90 Days': '90', 'All Time': 'all' }
  return map[label] || '30'
}
