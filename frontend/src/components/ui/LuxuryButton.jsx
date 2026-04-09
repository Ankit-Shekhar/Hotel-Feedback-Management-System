function LuxuryButton({
  as: Component = 'button',
  type = 'button',
  className = '',
  children,
  disabled = false,
  ...props
}) {
  const resolvedProps = Component === 'button' ? { type, disabled } : { ...props }

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#E7D3A0]/65 px-5 py-3 text-sm font-semibold tracking-wide transition duration-300 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 focus:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-60 ${
        className || ''
      } bg-gradient-to-r from-[#D6B873] via-[#E7D6AB] to-[#C2A05B] text-primary shadow-[0_10px_24px_rgba(187,155,92,0.18)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(187,155,92,0.24)]`}
      {...resolvedProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default LuxuryButton

