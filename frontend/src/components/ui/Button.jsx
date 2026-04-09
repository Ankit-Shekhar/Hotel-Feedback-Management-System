function Button({
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
