import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiPlus, FiCheck } from 'react-icons/fi'
import api from '../services/api'

const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80&auto=format&fit=crop', // Paneer tikka
  'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80&auto=format&fit=crop', // Idli sambar
  'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80&auto=format&fit=crop', // Vada pav
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80&auto=format&fit=crop', // Naan & curry
  'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&q=80&auto=format&fit=crop', // Dosa
  'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80&auto=format&fit=crop', // Paneer butter masala
  'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80&auto=format&fit=crop', // Indian thali
  'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&q=80&auto=format&fit=crop', // Medu vada
  'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80&auto=format&fit=crop', // Chole bhature
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80&auto=format&fit=crop', // Pav bhaji
]

export default function Menu() {
  const [menu, setMenu] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [addedItems, setAddedItems] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchMenu()
  }, [])

  async function fetchMenu() {
    try {
      setLoading(true)
      const res = await api.get('/user/menu')
      setMenu(res.data.content)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function addToCart(item) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(i => i.menuItemId === item.id)
    if (existing) existing.quantity += 1
    else cart.push({ menuItemId: item.id, name: item.name, unitPrice: item.price, quantity: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))

    // Show check animation
    setAddedItems(prev => ({ ...prev, [item.id]: true }))
    setTimeout(() => setAddedItems(prev => ({ ...prev, [item.id]: false })), 1200)
  }

  const filtered = menu.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title !mb-1">Our Menu</h1>
          <p className="text-gray-500">Choose from our delicious selection</p>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <FiShoppingCart size={18} />
          View Cart
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search dishes..."
          className="input-field !pl-12 !py-3.5 !rounded-2xl shadow-sm"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🍽</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
          <p className="text-gray-500">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {filtered.map((item, idx) => (
            <div key={item.id} className="card overflow-hidden group hover:-translate-y-1">
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={FOOD_IMAGES[idx % FOOD_IMAGES.length]}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {!item.available && (
                  <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                    <span className="badge bg-red-500 text-white text-sm">Unavailable</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm text-brand-600 font-bold px-3 py-1 rounded-full text-sm shadow-md">
                    ₹{item.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description || 'Delicious dish prepared with fresh ingredients'}</p>

                <button
                  onClick={() => addToCart(item)}
                  disabled={item.available === false}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                    ${addedItems[item.id]
                      ? 'bg-emerald-500 text-white'
                      : item.available === false
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white'
                    }`}
                >
                  {addedItems[item.id] ? (
                    <><FiCheck size={18} /> Added!</>
                  ) : (
                    <><FiPlus size={18} /> Add to Cart</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
