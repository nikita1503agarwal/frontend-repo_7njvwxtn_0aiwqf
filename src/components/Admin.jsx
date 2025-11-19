import { useEffect, useState } from 'react'

export default function Admin() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${base}/api/content`)
        const data = await res.json()
        setContent(data)
      } catch (e) {
        setContent({})
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const updateField = (key, value) => setContent((c) => ({ ...c, [key]: value }))

  const updateArrayItem = (key, idx, field, value) => {
    setContent((c) => {
      const arr = Array.isArray(c[key]) ? [...c[key]] : []
      arr[idx] = { ...arr[idx], [field]: value }
      return { ...c, [key]: arr }
    })
  }

  const addArrayItem = (key, template) => setContent((c) => ({ ...c, [key]: [...(c[key] || []), template] }))
  const removeArrayItem = (key, idx) => setContent((c) => ({ ...c, [key]: (c[key] || []).filter((_, i) => i !== idx) }))

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${base}/api/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_title: content.hero_title,
          hero_subtitle: content.hero_subtitle,
          hero_cta_text: content.hero_cta_text,
          hero_secondary_cta_text: content.hero_secondary_cta_text,
          hero_badges: content.hero_badges,
          hero_image: content.hero_image,
          spline_url: content.spline_url,
          trust_items: content.trust_items,
          testimonials: content.testimonials,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to save')
      setContent(data)
      setToast('Saved')
    } catch (e) {
      setToast(e.message)
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 2000)
    }
  }

  if (loading) return <div className="min-h-screen grid place-items-center text-emerald-100">Loading…</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Site Content Admin</h1>
          <div className="flex gap-3">
            <a href="/" className="px-4 py-2 rounded-full bg-emerald-800/40 border border-emerald-600/40">View site</a>
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded-full bg-emerald-400 text-emerald-950 font-semibold disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>

        {/* Hero */}
        <section className="rounded-3xl p-6 bg-emerald-900/30 border border-emerald-700/40 mb-6">
          <h2 className="text-xl font-semibold mb-4">Hero</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-emerald-200/80">Title</span>
              <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content.hero_title || ''} onChange={(e) => updateField('hero_title', e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm text-emerald-200/80">Subtitle</span>
              <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content.hero_subtitle || ''} onChange={(e) => updateField('hero_subtitle', e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm text-emerald-200/80">Primary CTA</span>
              <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content.hero_cta_text || ''} onChange={(e) => updateField('hero_cta_text', e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm text-emerald-200/80">Secondary CTA</span>
              <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content.hero_secondary_cta_text || ''} onChange={(e) => updateField('hero_secondary_cta_text', e.target.value)} />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm text-emerald-200/80">Hero Image URL</span>
              <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content.hero_image || ''} onChange={(e) => updateField('hero_image', e.target.value)} placeholder="https://…" />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm text-emerald-200/80">Spline 3D Scene URL (optional)</span>
              <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content.spline_url || ''} onChange={(e) => updateField('spline_url', e.target.value)} placeholder="https://prod.spline.design/…/scene.splinecode" />
            </label>
            <div className="md:col-span-2">
              <span className="text-sm text-emerald-200/80">Hero Badges (one per line)</span>
              <textarea className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" rows={3} value={(content.hero_badges || []).join('\n')} onChange={(e) => updateField('hero_badges', e.target.value.split('\n'))} />
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="rounded-3xl p-6 bg-emerald-900/30 border border-emerald-700/40 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Trust Section</h2>
            <button className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30" onClick={() => addArrayItem('trust_items', { icon: 'Leaf', title: 'New point', text: '' })}>Add</button>
          </div>
          {(content.trust_items || []).map((item, i) => (
            <div key={i} className="grid md:grid-cols-3 gap-3 mb-3">
              <input className="px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" placeholder="Icon (Leaf, ShieldCheck, Truck, HandHeart)" value={item.icon || ''} onChange={(e) => updateArrayItem('trust_items', i, 'icon', e.target.value)} />
              <input className="px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" placeholder="Title" value={item.title || ''} onChange={(e) => updateArrayItem('trust_items', i, 'title', e.target.value)} />
              <div className="flex gap-2">
                <input className="flex-1 px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" placeholder="Text" value={item.text || ''} onChange={(e) => updateArrayItem('trust_items', i, 'text', e.target.value)} />
                <button className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200" onClick={() => removeArrayItem('trust_items', i)}>Remove</button>
              </div>
            </div>
          ))}
        </section>

        {/* Testimonials */}
        <section className="rounded-3xl p-6 bg-emerald-900/30 border border-emerald-700/40 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Testimonials</h2>
            <button className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30" onClick={() => addArrayItem('testimonials', { quote: '', author: '', role: '' })}>Add</button>
          </div>
          {(content.testimonials || []).map((t, i) => (
            <div key={i} className="grid md:grid-cols-3 gap-3 mb-3">
              <input className="px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" placeholder="Quote" value={t.quote || ''} onChange={(e) => updateArrayItem('testimonials', i, 'quote', e.target.value)} />
              <input className="px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" placeholder="Author" value={t.author || ''} onChange={(e) => updateArrayItem('testimonials', i, 'author', e.target.value)} />
              <div className="flex gap-2">
                <input className="flex-1 px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" placeholder="Role" value={t.role || ''} onChange={(e) => updateArrayItem('testimonials', i, 'role', e.target.value)} />
                <button className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200" onClick={() => removeArrayItem('testimonials', i)}>Remove</button>
              </div>
            </div>
          ))}
        </section>

        {toast && (
          <div className="fixed bottom-6 right-6 px-4 py-2 rounded-full bg-emerald-400 text-emerald-950 font-semibold shadow">{toast}</div>
        )}
      </div>
    </div>
  )
}
