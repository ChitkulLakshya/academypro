// misc helpers
// nothing fancy, just stuff we use in a few places

export function getInitials(name) {
  if (!name) return '??'
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

// clamp a value between min and max
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

// format date string to short form
export function formatDateShort(dateStr) {
  const d = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

// get color for a metric score (1-10 scale)
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

// debounce — probably overkill for this project but whatever
export function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

// group players by category
export function groupByCategory(playerList) {
  return playerList.reduce((acc, p) => {
    const cat = p.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})
}

// get top N players by a specific stat key for a given time filter
export function getTopPlayers(playerList, statKey, timeFilter, n = 5) {
  return [...playerList]
    .filter(p => p.stats && p.stats[timeFilter])
    .sort((a, b) => (b.stats[timeFilter][statKey] || 0) - (a.stats[timeFilter][statKey] || 0))
    .slice(0, n)
}

// average a stat across all players for a time filter
export function averageStat(playerList, statKey, timeFilter) {
  const valid = playerList.filter(p => p.stats && p.stats[timeFilter] && p.stats[timeFilter][statKey] != null)
  if (valid.length === 0) return 0
  const sum = valid.reduce((acc, p) => acc + p.stats[timeFilter][statKey], 0)
  return Math.round((sum / valid.length) * 10) / 10
}

// quick hash for avatar bg color based on name — deterministic
export function nameToHue(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}
