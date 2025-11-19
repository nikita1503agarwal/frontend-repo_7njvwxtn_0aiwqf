import { useEffect, useMemo, useState } from 'react'

export default function Admin() {
  const [content, setContent] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [authError, setAuthError] = useState('')

  const [activeTab, setActiveTab] = useState('content') // content | categories | products
  const [productEditor, setProductEditor] = useState({ open: false, index: -1 })

  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const authorized = Boolean(token)
  const authHeader = authorized ? { Authorization: `Bearer ${token}` } : {}

  const login = async (e) => {
    e?.preventDefault()
    setAuthError('')
    try {
      const res = await fetch(`${base}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      localStorage.setItem('admin_token', data.token)
      setToken(data.token)
      setUsername('')
      setPassword('')
      setToast('Signed in')
    } catch (err) {
      setAuthError(err.message)
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setToken('')
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, catRes, pRes] = await Promise.all([
          fetch(`${base}/api/content`),
          fetch(`${base}/api/categories`),
          fetch(`${base}/api/products`),
        ])
        const c = await cRes.json()
        const cats = await catRes.json()
        const prods = await pRes.json()
        setContent(c)
        setCategories(Array.isArray(cats) ? cats : [])
        setProducts(Array.isArray(prods) ? prods : [])
      } catch (e) {
        setContent({})
        setCategories([])
        setProducts([])
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

  const saveContent = async () => {
    if (!authorized) { setToast('Sign in required'); return }
    setSaving(true)
    try {
      const res = await fetch(`${base}/api/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          hero_title: content.hero_title,
          hero_subtitle: content.hero_subtitle,
          hero_cta_text: content.hero_cta_text,
          hero_secondary_cta_text: content.hero_secondary_cta_text,
          hero_badges: content.hero_badges,
          hero_image: content.hero_image,
          spline_url: content.spline_url,
          shop_title: content.shop_title,
          shop_subtitle: content.shop_subtitle,
          trust_items: content.trust_items,
          testimonials: content.testimonials,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to save')
      setContent(data)
      setToast('Content saved')
    } catch (e) {
      setToast(e.message)
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 2000)
    }
  }

  // Category CRUD
  const updateCategoryField = (idx, field, value) => setCategories((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c))
  const addCategory = async () => {
    if (!authorized) { setToast('Sign in required'); return }
    const payload = { name: 'New Category', slug: 'new-category', image: '' }
    try {
      const res = await fetch(`${base}/api/categories`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create category')
      setCategories((prev) => [...prev, data])
      setToast('Category created')
    } catch (e) { setToast(e.message) }
  }
  const saveCategory = async (idx) => {
    if (!authorized) { setToast('Sign in required'); return }
    const cat = categories[idx]
    try {
      const res = await fetch(`${base}/api/categories/${cat.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader }, body: JSON.stringify({ name: cat.name, slug: cat.slug, image: cat.image }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to save category')
      setCategories((prev) => prev.map((c, i) => i === idx ? data : c))
      setToast('Category saved')
    } catch (e) { setToast(e.message) }
  }
  const deleteCategory = async (idx) => {
    if (!authorized) { setToast('Sign in required'); return }
    const cat = categories[idx]
    try {
      const res = await fetch(`${base}/api/categories/${cat.id}`, { method: 'DELETE', headers: { ...authHeader } })
      if (!res.ok) { const data = await res.json(); throw new Error(data.detail || 'Failed to delete') }
      setCategories((prev) => prev.filter((_, i) => i !== idx))
      setToast('Category deleted')
    } catch (e) { setToast(e.message) }
  }

  // Product helpers
  const addProduct = async () => {
    if (!authorized) { setToast('Sign in required'); return }
    const payload = { title: 'New Product', description: '', price: 0, category: categories[0]?.slug || 'general', image: '', badge: '', in_stock: true }
    try {
      const res = await fetch(`${base}/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create product')
      setProducts((prev) => [...prev, data])
      setToast('Product created')
      // open the editor on the new product
      setProductEditor({ open: true, index: products.length })
      setActiveTab('products')
    } catch (e) { setToast(e.message) }
  }

  const saveProduct = async (idx) => {
    if (!authorized) { setToast('Sign in required'); return }
    const p = products[idx]
    try {
      const res = await fetch(`${base}/api/products/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader }, body: JSON.stringify({ title: p.title, description: p.description, price: Number(p.price || 0), category: p.category, image: p.image, badge: p.badge, in_stock: Boolean(p.in_stock) }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to save product')
      setProducts((prev) => prev.map((pp, i) => i === idx ? data : pp))
      setToast('Product saved')
    } catch (e) { setToast(e.message) }
  }

  const deleteProduct = async (idx) => {
    if (!authorized) { setToast('Sign in required'); return }
    const p = products[idx]
    try {
      const res = await fetch(`${base}/api/products/${p.id}`, { method: 'DELETE', headers: { ...authHeader } })
      if (!res.ok) { const data = await res.json(); throw new Error(data.detail || 'Failed to delete') }
      setProducts((prev) => prev.filter((_, i) => i !== idx))
      setToast('Product deleted')
      if (productEditor.index === idx) setProductEditor({ open: false, index: -1 })
    } catch (e) { setToast(e.message) }
  }

  const openEditor = (index) => setProductEditor({ open: true, index })
  const closeEditor = () => setProductEditor({ open: false, index: -1 })
  const updateProductField = (idx, field, value) => setProducts((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p))

  const selectedProduct = useMemo(() => (productEditor.index >= 0 ? products[productEditor.index] : null), [productEditor, products])

  if (loading) return <div className="min-h-screen grid place-items-center text-emerald-100">Loading…</div>

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-100 grid place-items-center p-6">
        <form onSubmit={login} className="w-full max-w-md rounded-3xl p-6 bg-emerald-900/40 border border-emerald-700/50">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Sign In</h1>
          <label className="block mb-3">
            <span className="text-sm text-emerald-200/80">Username</span>
            <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
          </label>
          <label className="block mb-4">
            <span className="text-sm text-emerald-200/80">Password</span>
            <input type="password" className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          </label>
          {authError && <p className="text-red-300 text-sm mb-3">{authError}</p>}
          <button type="submit" className="w-full px-4 py-2 rounded-full bg-emerald-400 text-emerald-950 font-semibold">Sign in</button>
          <p className="text-emerald-200/70 text-xs mt-3 text-center">Tip: default is F0r3St12! / F0r3St12!</p>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Site Admin</h1>
          <div className="flex gap-3 items-center">
            <a href="/" className="px-4 py-2 rounded-full bg-emerald-800/40 border border-emerald-600/40">View site</a>
            <button onClick={logout} className="px-3 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30">Sign out</button>
            {activeTab === 'content' && (
              <button onClick={saveContent} disabled={saving} className="px-4 py-2 rounded-full bg-emerald-400 text-emerald-950 font-semibold disabled:opacity-60">{saving ? 'Saving…' : 'Save content'}</button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['content','categories','products'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-full border ${activeTab===t ? 'bg-emerald-400 text-emerald-950 border-emerald-400' : 'bg-emerald-900/30 border-emerald-700/40'}`}>{t[0].toUpperCase()+t.slice(1)}</button>
          ))}
        </div>

        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Hero */}
            <section className="rounded-3xl p-6 bg-emerald-900/30 border border-emerald-700/40">
              <h2 className="text-xl font-semibold mb-4">Hero</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm text-emerald-200/80">Title</span>
                  <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content?.hero_title || ''} onChange={(e) => updateField('hero_title', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm text-emerald-200/80">Subtitle</span>
                  <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content?.hero_subtitle || ''} onChange={(e) => updateField('hero_subtitle', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm text-emerald-200/80">Primary CTA</span>
                  <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content?.hero_cta_text || ''} onChange={(e) => updateField('hero_cta_text', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm text-emerald-200/80">Secondary CTA</span>
                  <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content?.hero_secondary_cta_text || ''} onChange={(e) => updateField('hero_secondary_cta_text', e.target.value)} />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm text-emerald-200/80">Hero Image URL</span>
                  <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content?.hero_image || ''} onChange={(e) => updateField('hero_image', e.target.value)} placeholder="https://…" />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm text-emerald-200/80">Spline 3D Scene URL (optional)</span>
                  <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content?.spline_url || ''} onChange={(e) => updateField('spline_url', e.target.value)} placeholder="https://prod.spline.design/…/scene.splinecode" />
                </label>
                <div className="md:col-span-2">
                  <span className="text-sm text-emerald-200/80">Hero Badges (one per line)</span>
                  <textarea className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" rows={3} value={(content?.hero_badges || []).join('\n')} onChange={(e) => updateField('hero_badges', e.target.value.split('\n'))} />
                </div>
              </div>
            </section>

            {/* Shop section copy */}
            <section className="rounded-3xl p-6 bg-emerald-900/30 border border-emerald-700/40">
              <h2 className="text-xl font-semibold mb-4">Shop Section</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm text-emerald-200/80">Title</span>
                  <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content?.shop_title || ''} onChange={(e) => updateField('shop_title', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm text-emerald-200/80">Subtitle</span>
                  <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={content?.shop_subtitle || ''} onChange={(e) => updateField('shop_subtitle', e.target.value)} />
                </label>
              </div>
            </section>

            {/* Trust */}
            <section className="rounded-3xl p-6 bg-emerald-900/30 border border-emerald-700/40">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Trust Section</h2>
                <button className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30" onClick={() => addArrayItem('trust_items', { icon: 'Leaf', title: 'New point', text: '' })}>Add</button>
              </div>
              {(content?.trust_items || []).map((item, i) => (
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
            <section className="rounded-3xl p-6 bg-emerald-900/30 border border-emerald-700/40 mb-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Testimonials</h2>
                <button className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30" onClick={() => addArrayItem('testimonials', { quote: '', author: '', role: '' })}>Add</button>
              </div>
              {(content?.testimonials || []).map((t, i) => (
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
          </div>
        )}

        {activeTab === 'categories' && (
          <section className="rounded-3xl p-6 bg-emerald-900/30 border border-emerald-700/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Categories</h2>
              <button onClick={addCategory} className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30">Add Category</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {(categories || []).map((c, i) => (
                <div key={c.id || i} className="rounded-2xl p-4 bg-emerald-900/40 border border-emerald-700/40">
                  <div className="grid gap-3">
                    <input className="px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" placeholder="Name" value={c.name || ''} onChange={(e) => updateCategoryField(i, 'name', e.target.value)} />
                    <input className="px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" placeholder="Slug" value={c.slug || ''} onChange={(e) => updateCategoryField(i, 'slug', e.target.value)} />
                    <input className="px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" placeholder="Image URL" value={c.image || ''} onChange={(e) => updateCategoryField(i, 'image', e.target.value)} />
                    <div className="flex gap-2">
                      <button onClick={() => saveCategory(i)} className="px-3 py-2 rounded-xl bg-emerald-400 text-emerald-950">Save</button>
                      <button onClick={() => deleteCategory(i)} className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'products' && (
          <section className="rounded-3xl p-6 bg-emerald-900/30 border border-emerald-700/40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Products</h2>
              <div className="flex items-center gap-3">
                <button onClick={addProduct} className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30">Add Product</button>
              </div>
            </div>

            {/* Product grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(products || []).map((p, i) => (
                <button key={p.id || i} onClick={() => openEditor(i)} className="text-left group rounded-3xl p-4 bg-emerald-900/30 border border-emerald-700/40 hover:bg-emerald-900/40 transition">
                  <div className="rounded-2xl overflow-hidden bg-emerald-800/40 aspect-[4/3] grid place-items-center">
                    {p.image ? (
                      <img src={p.image} alt="" className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-emerald-400/20" />
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      {p.badge && (
                        <span className="text-xs bg-emerald-400 text-emerald-950 px-2 py-1 rounded-full">{p.badge}</span>
                      )}
                      <span className="text-emerald-200/70 text-xs">{p.category}</span>
                      {!p.in_stock && <span className="text-xs text-red-300">Sold out</span>}
                    </div>
                    <h3 className="text-white font-semibold mt-1 line-clamp-1">{p.title || 'Untitled'}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-emerald-100 font-semibold">${Number(p.price||0).toFixed(2)}</span>
                      <span className="text-emerald-200/70 text-xs">Click to edit</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {productEditor.open && selectedProduct && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={closeEditor} />
            <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-emerald-950 border-l border-emerald-700/50 overflow-y-auto">
              <div className="p-5 flex items-center justify-between border-b border-emerald-700/40">
                <h3 className="text-lg font-semibold">Edit product</h3>
                <button onClick={closeEditor} className="px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-700/50">Close</button>
              </div>
              <div className="p-5 grid gap-4">
                {/* Live preview */}
                <div className="rounded-2xl overflow-hidden bg-emerald-900/40 border border-emerald-700/40">
                  <div className="aspect-[4/3] bg-emerald-800/40 grid place-items-center">
                    {selectedProduct.image ? (
                      <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-emerald-400/20" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      {selectedProduct.badge && (
                        <span className="text-xs bg-emerald-400 text-emerald-950 px-2 py-1 rounded-full">{selectedProduct.badge}</span>
                      )}
                      <span className="text-emerald-200/70 text-xs">{selectedProduct.category}</span>
                      {!selectedProduct.in_stock && <span className="text-xs text-red-300">Sold out</span>}
                    </div>
                    <h4 className="text-white font-semibold mt-1">{selectedProduct.title || 'Untitled'}</h4>
                    <p className="text-emerald-100/70 text-sm mt-1 line-clamp-2">{selectedProduct.description || 'Add a description'}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-emerald-100 font-semibold">${Number(selectedProduct.price||0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <label className="block">
                  <span className="text-sm text-emerald-200/80">Title</span>
                  <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={selectedProduct.title || ''} onChange={(e)=>updateProductField(productEditor.index,'title',e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm text-emerald-200/80">Description</span>
                  <textarea rows={3} className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={selectedProduct.description || ''} onChange={(e)=>updateProductField(productEditor.index,'description',e.target.value)} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm text-emerald-200/80">Price</span>
                    <input type="number" step="0.01" className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={selectedProduct.price ?? ''} onChange={(e)=>updateProductField(productEditor.index,'price',e.target.value)} />
                  </label>
                  <label className="block">
                    <span className="text-sm text-emerald-200/80">Badge</span>
                    <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={selectedProduct.badge || ''} onChange={(e)=>updateProductField(productEditor.index,'badge',e.target.value)} />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm text-emerald-200/80">Category</span>
                  <select className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={selectedProduct.category || ''} onChange={(e)=>updateProductField(productEditor.index,'category',e.target.value)}>
                    {categories.map((c)=> (
                      <option key={c.id} value={c.slug}>{c.name} ({c.slug})</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-emerald-200/80">Image URL</span>
                  <input className="mt-1 w-full px-3 py-2 rounded-xl bg-emerald-800/40 border border-emerald-700/50" value={selectedProduct.image || ''} onChange={(e)=>updateProductField(productEditor.index,'image',e.target.value)} placeholder="https://…" />
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!selectedProduct.in_stock} onChange={(e)=>updateProductField(productEditor.index,'in_stock',e.target.checked)} />
                  In stock
                </label>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => saveProduct(productEditor.index)} className="px-4 py-2 rounded-xl bg-emerald-400 text-emerald-950 font-semibold">Save changes</button>
                  <button onClick={() => deleteProduct(productEditor.index)} className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200">Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 right-6 px-4 py-2 rounded-full bg-emerald-400 text-emerald-950 font-semibold shadow">{toast}</div>
        )}
      </div>
    </div>
  )
}
