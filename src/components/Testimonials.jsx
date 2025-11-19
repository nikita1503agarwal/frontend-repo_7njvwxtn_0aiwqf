export default function Testimonials({ content }) {
  const items = content?.testimonials?.length ? content.testimonials : [
    { author: 'Ava R.', quote: 'Everything feels so fresh and gentle. The packaging is beautiful and eco‑friendly.' },
    { author: 'Mateo L.', quote: 'The greens blend gives me clean energy without jitters. Love the vibe.' },
    { author: 'Sofia K.', quote: 'Fast delivery, thoughtful ingredients, and a brand I trust.' },
  ]

  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Loved by our community</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <div key={i} className="rounded-3xl p-5 bg-emerald-900/30 border border-emerald-700/40 text-emerald-100/90">
            <p className="text-sm">“{t.quote}”</p>
            <p className="mt-3 text-emerald-300 font-semibold">{t.author}</p>
            {t.role && <p className="text-emerald-100/70 text-sm">{t.role}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
