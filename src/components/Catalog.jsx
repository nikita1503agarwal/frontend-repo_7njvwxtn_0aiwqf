import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

export default function Catalog({ onAdd }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
        const res = await fetch(`${base}/api/products`)
        const data = await res.json()
        setProducts(data)
      } catch (e) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Shop popular picks</h2>
        <p className="text-emerald-100/70 text-sm">Nature-made • Lab-tested • Planet-kind</p>
      </div>
      {loading ? (
        <div className="text-emerald-100/80">Loading products…</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <ProductCard key={i} product={p} onAdd={onAdd} />)
          )}
        </div>
      )}
    </section>
  )
}
