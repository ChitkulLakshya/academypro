// misc helpers
// nothing fancy, just stuff we use in a few places

/**
 * Extract initials from a full name string.
 * Returns up to 2 uppercase characters.
 * @param {string} name - Full name (e.g. "Aditya Joshi")
 * @returns {string} Initials (e.g. "AJ")
 */
export function getInitials(name) {
  if (!name) return '??'
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Get a time-of-day greeting string.
 * @returns {string} "Good Morning", "Good Afternoon", or "Good Evening"
 */
export function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

/**
 * Clamp a numeric value between min and max bounds.
 * @param {number} val - The value to clamp
 * @param {number} min - Minimum bound
 * @param {number} max - Maximum bound
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

/**
 * Format a date string to short readable form (e.g. "Feb 22, 2026").
 * @param {string} dateStr - ISO date string or parseable date
 * @returns {string}
 */
export function formatDateShort(dateStr) {
  const d = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/**
 * Get a hex color for a metric score.
 * Red ≤ 3, Yellow ≤ 6, Green > 6.
 * @param {number} score - Score value
 * @returns {string} Hex color string
 */
export function scoreColor(score) {
  if (score <= 3) return '#FF453A'
  if (score <= 6) return '#FFD60A'
  return '#30D158'
}

// get color name class for score
export function scoreColorClass(score) {
  if (score <= 3) return 'text-danger'
  if (score <= 6) return 'text-warn'
  return 'text-success'
}

// percentage to color for progress rings etc
export function pctColor(pct) {
  if (pct < 40) return '#FF453A'
  if (pct < 70) return '#FFD60A'
  return '#30D158'
}

/**
 * Debounce a function call.
 * @param {Function} fn - The function to debounce
 * @param {number} ms - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

/**
 * Group an array of players by their category field.
 * @param {Array} playerList - Array of player objects
 * @returns {Object} Object keyed by category with arrays of players
 */
export function groupByCategory(playerList) {
  return playerList.reduce((acc, p) => {
    const cat = p.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})
}

/**
 * Get top N players sorted by a specific stat key for a given time filter.
 * @param {Array} playerList - Array of player objects
 * @param {string} statKey - Stat key to sort by
 * @param {string} timeFilter - Time filter key ('30', '60', '90', 'all')
 * @param {number} [n=5] - Number of top players to return
 * @returns {Array}
 */
export function getTopPlayers(playerList, statKey, timeFilter, n = 5) {
  return [...playerList]
    .filter(p => p.stats && p.stats[timeFilter])
    .sort((a, b) => (b.stats[timeFilter][statKey] || 0) - (a.stats[timeFilter][statKey] || 0))
    .slice(0, n)
}

/**
 * Calculate the average of a specific stat across all players for a time filter.
 * @param {Array} playerList - Array of player objects
 * @param {string} statKey - Stat key to average
 * @param {string} timeFilter - Time filter key
 * @returns {number} Rounded average
 */
export function averageStat(playerList, statKey, timeFilter) {
  const valid = playerList.filter(p => p.stats && p.stats[timeFilter] && p.stats[timeFilter][statKey] != null)
  if (valid.length === 0) return 0
  const sum = valid.reduce((acc, p) => acc + p.stats[timeFilter][statKey], 0)
  return Math.round((sum / valid.length) * 10) / 10
}

/**
 * Deterministic hash to generate a hue value from a name string.
 * Used for consistent avatar background colors.
 * @param {string} name - Player name
 * @returns {number} Hue value 0-359
 */
export function nameToHue(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

/**
 * Format a date string relative to now (e.g. "2 days ago", "just now").
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function formatTimeRelative(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  return formatDateShort(dateStr)
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generate a random integer between min (inclusive) and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
