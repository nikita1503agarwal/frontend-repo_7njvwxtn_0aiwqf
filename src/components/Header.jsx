import { ShoppingCart, Leaf, Menu } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header({ onCartOpen, cartCount }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-emerald-900/30 border-b border-emerald-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div initial={{ rotate: -10, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <Leaf className="text-emerald-900" size={22} />
          </motion.div>
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">Forest Health</h1>
            <p className="text-emerald-200/70 text-xs">pure • holistic • modern</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-emerald-100/90">
          <a href="#shop" className="hover:text-white transition">Shop</a>
          <a href="#values" className="hover:text-white transition">Our Values</a>
          <a href="#reviews" className="hover:text-white transition">Reviews</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="md:hidden text-emerald-100/90 hover:text-white"><Menu /></button>
          <button onClick={onCartOpen} className="relative inline-flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 px-4 py-2 rounded-full border border-emerald-400/30 transition">
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-400 text-emerald-950 text-xs font-bold rounded-full w-6 h-6 grid place-items-center shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
