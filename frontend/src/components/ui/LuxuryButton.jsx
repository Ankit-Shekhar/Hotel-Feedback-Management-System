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
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold tracking-wide transition duration-300 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-60 ${
        className || ''
      } bg-gradient-to-r from-gold to-goldSoft text-primary shadow-[0_10px_30px_rgba(212,175,55,0.22)] hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(212,175,55,0.34)]`}
      {...resolvedProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default LuxuryButton

