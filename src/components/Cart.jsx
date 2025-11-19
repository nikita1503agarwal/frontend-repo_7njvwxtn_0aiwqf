import { useMemo } from 'react'
import { X, Trash2, CheckCircle2 } from 'lucide-react'

export default function Cart({ items, onClose, onRemove, onCheckout }) {
  const totals = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0)
    const shipping = subtotal < 50 && subtotal > 0 ? 5 : 0
    const total = subtotal + shipping
    return { subtotal, shipping, total }
  }, [items])

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-emerald-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full sm:max-w-md h-full bg-gradient-to-b from-emerald-900 to-emerald-950 border-l border-emerald-800/50 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Your Cart</h3>
          <button onClick={onClose} className="text-emerald-200/80 hover:text-white"><X /></button>
        </div>

        {items.length === 0 ? (
          <p className="text-emerald-100/80">Your cart is empty. Add some forest goodness!</p>
        ) : (
          <div className="space-y-4">
            {items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-800/40 border border-emerald-700/40">
                <div className="w-12 h-12 rounded-xl bg-emerald-700/40" />
                <div className="flex-1">
                  <p className="text-white font-medium">{it.title}</p>
                  <p className="text-emerald-200/70 text-sm">{it.quantity} × ${it.price.toFixed(2)}</p>
                </div>
                <button onClick={() => onRemove(idx)} className="text-emerald-200/70 hover:text-white"><Trash2 size={18} /></button>
              </div>
            ))}

            <div className="p-4 rounded-2xl bg-emerald-800/40 border border-emerald-700/40 space-y-2 text-sm text-emerald-100/90">
              <div className="flex justify-between"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{totals.shipping ? `$${totals.shipping.toFixed(2)}` : 'Free'}</span></div>
              <div className="flex justify-between font-semibold text-white"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
            </div>

            <button onClick={onCheckout} className="w-full mt-2 rounded-full bg-emerald-400 text-emerald-950 font-semibold py-3 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-900/30 transition">
              <CheckCircle2 size={18} /> Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
