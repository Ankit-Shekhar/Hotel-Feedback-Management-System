function Card({ className = '', children }) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-secondary/90 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.22)] ${className}`}>
      {children}
    </section>
  )
}

export default Card

