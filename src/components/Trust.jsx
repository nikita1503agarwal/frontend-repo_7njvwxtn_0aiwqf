import { ShieldCheck, Recycle, Leaf, Heart } from 'lucide-react'

export default function Trust() {
  const points = [
    { icon: ShieldCheck, title: 'Trusted Quality', text: 'Third‑party tested and certified organic ingredients.' },
    { icon: Recycle, title: 'Planet Friendly', text: 'Plastic‑free, recyclable packaging and carbon‑neutral shipping.' },
    { icon: Leaf, title: 'Clean Formulas', text: 'No artificial colors, flavors, or fillers—ever.' },
    { icon: Heart, title: 'Loved by Customers', text: '30‑day happiness guarantee with easy returns.' },
  ]

  return (
    <section id="values" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Why shop with us</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {points.map((p, i) => (
          <div key={i} className="rounded-3xl p-5 bg-emerald-900/30 border border-emerald-700/40 text-emerald-100/90">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/30 text-emerald-200 grid place-items-center mb-3">
              <p.icon size={20} />
            </div>
            <h3 className="text-white font-semibold">{p.title}</h3>
            <p className="text-sm mt-1">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
