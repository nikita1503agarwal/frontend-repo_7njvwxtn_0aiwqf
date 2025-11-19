export default function Testimonials() {
  const items = [
    { name: 'Ava R.', text: 'Everything feels so fresh and gentle. The packaging is beautiful and eco‑friendly.' },
    { name: 'Mateo L.', text: 'The greens blend gives me clean energy without jitters. Love the vibe.' },
    { name: 'Sofia K.', text: 'Fast delivery, thoughtful ingredients, and a brand I trust.' },
  ]

  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Loved by our community</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <div key={i} className="rounded-3xl p-5 bg-emerald-900/30 border border-emerald-700/40 text-emerald-100/90">
            <p className="text-sm">“{t.text}”</p>
            <p className="mt-3 text-emerald-300 font-semibold">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
