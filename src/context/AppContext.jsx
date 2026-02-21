import { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useAppHooks'

// ─── Action Types ─────────────────────────────────────────────
const ActionTypes = {
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_SELECTED_PLAYER: 'SET_SELECTED_PLAYER',
  SET_TIME_FILTER: 'SET_TIME_FILTER',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  TOGGLE_OVERLAY: 'TOGGLE_OVERLAY',
  CLOSE_OVERLAY: 'CLOSE_OVERLAY',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
  MARK_ALL_READ: 'MARK_ALL_READ',
  SET_THEME: 'SET_THEME',
  SET_SORT_KEY: 'SET_SORT_KEY',
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  SET_SESSION_ID: 'SET_SESSION_ID',
  PUSH_BREADCRUMB: 'PUSH_BREADCRUMB',
  POP_BREADCRUMB: 'POP_BREADCRUMB',
  RESET_STATE: 'RESET_STATE',
}

// ─── Initial State ────────────────────────────────────────────
const initialState = {
  activeTab: 0,
  selectedPlayer: null,
  timeFilter: '30',
  searchQuery: '',
  overlay: null,          // 'notifications' | 'search' | 'profile' | 'settings' | null
  notifications: [],
  unreadCount: 0,
  theme: 'dark',
  sortKey: 'overall',
  viewMode: 'grid',       // 'grid' | 'list'
  favorites: [],
  activeSessionId: null,
  breadcrumbs: [],
}

// ─── Reducer ──────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload, overlay: null }

    case ActionTypes.SET_SELECTED_PLAYER:
      return { ...state, selectedPlayer: action.payload }

    case ActionTypes.SET_TIME_FILTER:
      return { ...state, timeFilter: action.payload }

    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload }

    case ActionTypes.TOGGLE_OVERLAY:
      return {
        ...state,
        overlay: state.overlay === action.payload ? null : action.payload,
      }

    case ActionTypes.CLOSE_OVERLAY:
      return { ...state, overlay: null }

    case ActionTypes.ADD_NOTIFICATION: {
      const notification = {
        ...action.payload,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        timestamp: new Date().toISOString(),
        read: false,
      }
      return {
        ...state,
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }
    }

    case ActionTypes.DISMISS_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }

    case ActionTypes.MARK_ALL_READ:
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      }

    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload }

    case ActionTypes.SET_SORT_KEY:
      return { ...state, sortKey: action.payload }

    case ActionTypes.SET_VIEW_MODE:
      return { ...state, viewMode: action.payload }

    case ActionTypes.TOGGLE_FAVORITE: {
      const id = action.payload
      const isFav = state.favorites.includes(id)
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter(f => f !== id)
          : [...state.favorites, id],
      }
    }

    case ActionTypes.SET_SESSION_ID:
      return { ...state, activeSessionId: action.payload }

    case ActionTypes.PUSH_BREADCRUMB:
      return {
        ...state,
        breadcrumbs: [...state.breadcrumbs, action.payload],
      }

    case ActionTypes.POP_BREADCRUMB:
      return {
        ...state,
        breadcrumbs: state.breadcrumbs.slice(0, -1),
      }

    case ActionTypes.RESET_STATE:
      return { ...initialState }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────
const AppStateContext = createContext(null)
const AppDispatchContext = createContext(null)

export function AppProvider({ children }) {
  const [savedFavs] = useLocalStorage('academy_favorites', [])
  const [savedTheme] = useLocalStorage('academy_theme', 'dark')

  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    favorites: savedFavs,
    theme: savedTheme,
  })

  // memoize action creators so consumers don't re-render unnecessarily
  const actions = useMemo(() => ({
    setTab: (tab) => dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab }),
    selectPlayer: (p) => dispatch({ type: ActionTypes.SET_SELECTED_PLAYER, payload: p }),
    setTimeFilter: (f) => dispatch({ type: ActionTypes.SET_TIME_FILTER, payload: f }),
    setSearch: (q) => dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: q }),
    toggleOverlay: (name) => dispatch({ type: ActionTypes.TOGGLE_OVERLAY, payload: name }),
    closeOverlay: () => dispatch({ type: ActionTypes.CLOSE_OVERLAY }),
    addNotification: (n) => dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: n }),
    dismissNotification: (id) => dispatch({ type: ActionTypes.DISMISS_NOTIFICATION, payload: id }),
    markAllRead: () => dispatch({ type: ActionTypes.MARK_ALL_READ }),
    setTheme: (t) => dispatch({ type: ActionTypes.SET_THEME, payload: t }),
    setSortKey: (k) => dispatch({ type: ActionTypes.SET_SORT_KEY, payload: k }),
    setViewMode: (m) => dispatch({ type: ActionTypes.SET_VIEW_MODE, payload: m }),
    toggleFavorite: (id) => dispatch({ type: ActionTypes.TOGGLE_FAVORITE, payload: id }),
    setSessionId: (id) => dispatch({ type: ActionTypes.SET_SESSION_ID, payload: id }),
    pushBreadcrumb: (bc) => dispatch({ type: ActionTypes.PUSH_BREADCRUMB, payload: bc }),
    popBreadcrumb: () => dispatch({ type: ActionTypes.POP_BREADCRUMB }),
    resetState: () => dispatch({ type: ActionTypes.RESET_STATE }),
  }), [dispatch])

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={actions}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

// ─── Consumer Hooks ───────────────────────────────────────────
export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within <AppProvider>')
  return ctx
}

export function useAppActions() {
  const ctx = useContext(AppDispatchContext)
  if (!ctx) throw new Error('useAppActions must be used within <AppProvider>')
  return ctx
}

/**
 * Combined convenience hook — returns [state, actions].
 */
export function useApp() {
  return [useAppState(), useAppActions()]
}

/**
 * Selector hook — subscribe to a specific slice of state to
 * reduce unnecessary re-renders in leaf components.
 */
export function useAppSelector(selectorFn) {
  const state = useAppState()
  return selectorFn(state)
}

// ─── Re-export action type constants for testing / debugging ─
export { ActionTypes, initialState }
