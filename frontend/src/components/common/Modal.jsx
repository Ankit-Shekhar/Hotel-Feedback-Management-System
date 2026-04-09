function Modal({ title = 'Modal', isOpen = false, onClose, children }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-secondary p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ivory">{title}</h2>
          <button onClick={onClose} className="text-sm text-ivory/60 transition hover:text-gold">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal

