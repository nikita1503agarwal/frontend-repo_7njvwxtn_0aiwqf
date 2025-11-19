import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import Catalog from './components/Catalog'
import Trust from './components/Trust'
import Testimonials from './components/Testimonials'
import Cart from './components/Cart'
import Spline from '@splinetool/react-spline'

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)
  const [content, setContent] = useState(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
        const res = await fetch(`${base}/api/content`)
        const data = await res.json()
        setContent(data)
      } catch (e) {
        setContent(null)
      }
    }
    loadContent()
  }, [])

  const addToCart = (product) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.title === product.title)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 }
        return copy
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setToast(`${product.title} added to cart`)
  }

  const removeFromCart = (idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx))
  }

  const checkout = async () => {
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const items = cart.map((c) => ({ product_id: c.id || c._id || c.title, quantity: c.quantity }))
      const payload = {
        items,
        customer: {
          name: 'Guest',
          email: 'guest@example.com',
          phone: '',
          address: 'Checkout Address',
          city: 'City',
          country: 'Country',
          postal_code: '00000',
        },
        notes: 'Web checkout',
      }
      const res = await fetch(`${base}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Checkout failed')
      setToast(`Order received • Total $${data.total.toFixed(2)}`)
      setCart([])
      setCartOpen(false)
    } catch (e) {
      setToast(e.message)
    }
  }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const heroProps = {
    title: content?.hero_title,
    subtitle: content?.hero_subtitle,
    cta: content?.hero_cta_text,
    secondaryCta: content?.hero_secondary_cta_text,
    badges: content?.hero_badges,
    heroImage: content?.hero_image,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 relative">
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'radial-gradient(600px_600px_at_10%_0%, rgba(16,185,129,0.25), transparent 40%), radial-gradient(600px_600px_at_90%_10%, rgba(34,197,94,0.2), transparent 40%)' }} />

      <Header onCartOpen={() => setCartOpen(true)} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} />

      {content?.spline_url && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <div className="rounded-3xl overflow-hidden border border-emerald-700/40 bg-emerald-900/20">
            <div className="aspect-[16/9]">
              <Spline scene={content.spline_url} />
            </div>
          </div>
        </div>
      )}

      <Hero onShop={() => {
        const el = document.getElementById('shop');
        el?.scrollIntoView({ behavior: 'smooth' })
      }} {...heroProps} />

      <Catalog onAdd={(p) => addToCart(p)} content={content} />

      <Trust content={content} />
      <Testimonials content={content} />

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-emerald-100/80">
        <div className="rounded-3xl p-6 bg-emerald-900/30 border border-emerald-700/40">
          <p className="text-center">Sustainably crafted with love • © {new Date().getFullYear()} Forest Health</p>
        </div>
      </footer>

      <AnimatePresence>
        {cartOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Cart items={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onCheckout={checkout} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 rounded-full bg-emerald-400 text-emerald-950 font-semibold shadow">
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
