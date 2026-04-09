import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toast.context'
import ToastViewport from '../components/common/ToastViewport'

let toastId = 0

function nextToastId() {
  toastId += 1
  return `toast-${toastId}`
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((payload) => {
    const id = nextToastId()
    const toast = {
      id,
      title: payload?.title || 'Notice',
      message: payload?.message || '',
      variant: payload?.variant || 'info',
      duration: payload?.duration ?? 3800,
    }

    setToasts((current) => [...current, toast])

    if (toast.duration > 0) {
      window.setTimeout(() => {
        dismissToast(id)
      }, toast.duration)
    }

    return id
  }, [dismissToast])

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}
