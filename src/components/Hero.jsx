import { motion } from 'framer-motion'

export default function Hero({ onShop, title = 'Wellness from the Forest', subtitle = 'Pure, eco-friendly goods crafted with care. Fresh, holistic, and delightfully simple for everyday vitality.', cta = 'Order Online', secondaryCta = 'Our Promise', badges = ['• Certified organic','• Plastic-free shipping','• 30-day happiness guarantee'], heroImage = null }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-emerald-950 to-emerald-900" />
        <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(52,211,153,0.2), transparent 30%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.25), transparent 35%), radial-gradient(circle at 50% 80%, rgba(74,222,128,0.2), transparent 30%)' }} />
        <div className="absolute inset-0 bg-[url('/forest-texture.png')] bg-cover bg-center opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pb-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            {title}
          </motion.h2>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }} className="mt-4 text-emerald-100/90 text-lg">
            {subtitle}
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-8 flex flex-wrap gap-4">
            <button onClick={onShop} className="px-6 py-3 rounded-full bg-emerald-400 text-emerald-950 font-semibold shadow-lg shadow-emerald-900/30 hover:shadow-emerald-800/40 transition">{cta}</button>
            <a href="#values" className="px-6 py-3 rounded-full bg-emerald-800/40 text-emerald-100 border border-emerald-500/30 hover:bg-emerald-700/40 transition">{secondaryCta}</a>
          </motion.div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-emerald-100/80">
            {badges.map((b, i) => (
              <span key={i} className="text-sm">{b}</span>
            ))}
          </div>
        </div>
        <div className="relative">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="aspect-square rounded-[2rem] bg-gradient-to-br from-emerald-400/20 to-green-500/20 border border-emerald-400/30 backdrop-blur-xl p-4 overflow-hidden">
            {heroImage ? (
              <img src={heroImage} alt="Hero" className="w-full h-full object-cover rounded-[1.5rem]" />
            ) : (
              <div className="w-full h-full rounded-[1.5rem] bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.25),transparent_60%)]" />
            )}
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="absolute -bottom-6 -left-6 bg-emerald-400 text-emerald-950 rounded-2xl px-4 py-2 shadow">
            Fresh & Bubbly
          </motion.div>
        </div>
      </div>
    </section>
  )
}
