function Card({ className = '', children }) {
  return (
    <section className={`rounded-lg bg-white p-4 shadow-sm ${className}`}>
      {children}
    </section>
  )
}

export default Card
