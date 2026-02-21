import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Debounced value hook — delays updating a value until the user
 * stops changing it for `delay` ms. Great for search inputs.
 */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

/**
 * Local storage hook — persists state to localStorage and
 * rehydrates it on mount. Falls back to `initialValue` if
 * nothing is stored or JSON parsing fails.
 */
export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(stored) : value
    setStored(valueToStore)
    try {
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      // quota exceeded or private browsing — silently fail
    }
  }, [key, stored])

  return [stored, setValue]
}

/**
 * Toggle hook — simple boolean state with toggle callback.
 */
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn(prev => !prev), [])
  const setTrue = useCallback(() => setOn(true), [])
  const setFalse = useCallback(() => setOn(false), [])
  return { on, toggle, setTrue, setFalse }
}

/**
 * Previous value hook — returns the value from the previous render.
 * Useful for comparing old vs new state.
 */
export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

/**
 * Media query hook — returns true if viewport matches the query.
 * Example: useMediaQuery('(max-width: 768px)')
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Click-outside detection hook — fires callback when a click
 * happens outside the referenced element.
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

/**
 * Intersection observer hook — detects when an element enters
 * or exits the viewport. Useful for lazy loading.
 */
export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    }, { threshold: 0.1, ...options })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}

/**
 * Timer/stopwatch hook — counts elapsed seconds.
 * Returns { seconds, isRunning, start, stop, reset }.
 */
export function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  const start = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
  }, [isRunning])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const reset = useCallback(() => {
    stop()
    setSeconds(0)
  }, [stop])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { seconds, isRunning, start, stop, reset }
}

/**
 * Keyboard shortcut hook — registers a global key handler.
 * Pass a map of { key: handler } entries.
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toLowerCase()
      const combo = [
        e.ctrlKey && 'ctrl',
        e.shiftKey && 'shift',
        e.altKey && 'alt',
        key,
      ].filter(Boolean).join('+')

      if (shortcuts[combo]) {
        e.preventDefault()
        shortcuts[combo](e)
      } else if (shortcuts[key]) {
        shortcuts[key](e)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts])
}

/**
 * Window scroll position hook — returns { x, y }.
 */
export function useScrollPosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = () => setPos({ x: window.scrollX, y: window.scrollY })
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return pos
}
