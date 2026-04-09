function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-600 ${className}`}
      {...props}
    />
  )
}

export default Input
