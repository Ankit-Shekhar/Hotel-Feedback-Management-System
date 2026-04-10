import { AnimatePresence, motion as Motion } from 'framer-motion'

const variantClasses = {
  success: 'border-gold/45 bg-[#161616] text-ivory',
  error: 'border-red-400/45 bg-[#1C1111] text-red-100',
  info: 'border-white/20 bg-[#161616] text-ivory',
}

function ToastViewport({ toasts = [], onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[100] flex w-[min(92vw,26rem)] flex-col gap-3 sm:top-28">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto rounded-2xl border p-4 shadow-[0_16px_36px_rgba(0,0,0,0.35)] ${variantClasses[toast.variant] || variantClasses.info}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold tracking-wide">{toast.title}</p>
                {toast.message ? <p className="text-sm leading-6 opacity-100">{toast.message}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-md px-2 py-1 text-xs text-ivory/70 transition hover:bg-white/10 hover:text-ivory"
                aria-label="Dismiss notification"
              >
                Close
              </button>
            </div>
          </Motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastViewport
