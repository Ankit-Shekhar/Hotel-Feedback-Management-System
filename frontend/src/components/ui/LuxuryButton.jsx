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
      } bg-gradient-to-r from-[#B8944E] via-[#CCB27A] to-[#A98343] text-primary shadow-[0_8px_18px_rgba(164,132,73,0.14)] hover:-translate-y-0.5 hover:brightness-[1.02] hover:shadow-[0_11px_22px_rgba(164,132,73,0.18)]`}
      {...resolvedProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default LuxuryButton

