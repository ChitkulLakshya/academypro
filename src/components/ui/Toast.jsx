import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Toast System ─────────────────────────────────────────────
// Provides a self-contained toast notification layer.  Import
// <ToastProvider> at the root and useToast() in any component.

const TOAST_DURATION = 3500
const MAX_TOASTS = 4

const TOAST_STYLES = {
  success: { bg: 'rgba(48, 209, 88, 0.15)', border: 'rgba(48, 209, 88, 0.35)', icon: '✓', color: '#30D158' },
  error:   { bg: 'rgba(255, 69, 58, 0.15)', border: 'rgba(255, 69, 58, 0.35)', icon: '✕', color: '#FF453A' },
  warning: { bg: 'rgba(255, 214, 10, 0.15)', border: 'rgba(255, 214, 10, 0.35)', icon: '⚠', color: '#FFD60A' },
  info:    { bg: 'rgba(100, 210, 255, 0.15)', border: 'rgba(100, 210, 255, 0.35)', icon: 'ℹ', color: '#64D2FF' },
}

let globalAddToast = () => {}

export function useToast() {
  return useCallback((message, type = 'info') => {
    globalAddToast({ message, type, id: Date.now() + Math.random() })
  }, [])
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    setToasts(prev => [...prev.slice(-(MAX_TOASTS - 1)), toast])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    globalAddToast = addToast
  }, [addToast])

  return (
    <>
      {children}
      <div style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 400,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '0 16px',
        pointerEvents: 'none',
      }}>
        <AnimatePresence mode="sync">
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

function ToastItem({ toast, onDismiss }) {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), TOAST_DURATION)
    return () => clearTimeout(timerRef.current)
  }, [toast.id, onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 12,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        pointerEvents: 'auto',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <span style={{ color: style.color, fontWeight: 700, fontSize: 16, lineHeight: 1, flexShrink: 0 }}>
        {style.icon}
      </span>
      <span style={{ color: '#f5f5f7', fontSize: 13, fontWeight: 500, lineHeight: 1.3, flex: 1 }}>
        {toast.message}
      </span>
      <span style={{ color: '#636366', fontSize: 11, flexShrink: 0 }}>✕</span>
    </motion.div>
  )
}

export default ToastProvider
