function InputField({ label, error, className = '', ...props }) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-ivory/80">{label}</span> : null}
      <input
        className={`w-full rounded-2xl border border-white/10 bg-secondary px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition duration-300 focus:border-gold focus:shadow-[0_0_0_4px_rgba(212,175,55,0.12)] ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </label>
  )
}

export default InputField
