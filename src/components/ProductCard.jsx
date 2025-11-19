import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function ProductCard({ product, onAdd }) {
  return (
    <motion.div layout className="group rounded-3xl p-4 bg-emerald-900/30 border border-emerald-700/40 backdrop-blur-md hover:bg-emerald-900/40 transition">
      <div className="rounded-2xl overflow-hidden bg-emerald-800/40 aspect-[4/3] grid place-items-center">
        <div className="w-24 h-24 rounded-2xl bg-emerald-400/30 grid place-items-center">
          <Leaf className="text-emerald-300" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          {product.badge && (
            <span className="text-xs bg-emerald-400 text-emerald-950 px-2 py-1 rounded-full">{product.badge}</span>
          )}
          <span className="text-emerald-200/70 text-xs">{product.category}</span>
        </div>
        <h3 className="text-white font-semibold mt-1">{product.title}</h3>
        <p className="text-emerald-100/70 text-sm line-clamp-2 mt-1">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-emerald-100 font-semibold">${product.price.toFixed(2)}</span>
          <button onClick={() => onAdd(product)} className="px-4 py-2 rounded-full bg-emerald-400 text-emerald-950 text-sm font-semibold hover:shadow-lg hover:shadow-emerald-900/30 transition">Add</button>
        </div>
      </div>
    </motion.div>
  )
}
