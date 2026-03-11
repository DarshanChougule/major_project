import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiArrowRight, FiClock, FiShield, FiSmartphone,
  FiStar, FiTruck, FiHeart
} from 'react-icons/fi'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1920&q=80&auto=format&fit=crop', // Indian thali spread
  'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1920&q=80&auto=format&fit=crop', // Indian feast
  'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=1920&q=80&auto=format&fit=crop', // Dosa
]

const FOOD_CATEGORIES = [
  { name: 'Vada Pav',    emoji: '🌶️', color: 'from-red-400 to-orange-400' },
  { name: 'Idli & Dosa', emoji: '🫓', color: 'from-yellow-400 to-amber-500' },
  { name: 'Paneer',      emoji: '🧀', color: 'from-green-400 to-emerald-500' },
  { name: 'Naan & Roti', emoji: '🍞', color: 'from-amber-400 to-orange-500' },
  { name: 'Sabji',       emoji: '🍛', color: 'from-lime-400 to-green-500' },
  { name: 'Sweets',      emoji: '🍮', color: 'from-purple-400 to-pink-500' },
]

const SPECIALTIES = [
  {
    title: 'Vada Pav',
    desc: 'Mumbai\'s iconic street food — a spicy potato fritter nestled in a soft pav bun with chutneys. Simple, fiery, and unforgettable.',
    img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80&auto=format&fit=crop',
    origin: 'Mumbai, Maharashtra',
  },
  {
    title: 'Idli & Medu Vada',
    desc: 'Soft steamed rice cakes and crispy lentil fritters served with coconut chutney and sambar — a wholesome South Indian breakfast loved nationwide.',
    img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80&auto=format&fit=crop',
    origin: 'South India',
  },
  {
    title: 'Paneer Butter Masala',
    desc: 'Cottage cheese cubes simmered in a rich, creamy tomato-butter gravy — the crown jewel of North Indian vegetarian cuisine.',
    img: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=600&q=80&auto=format&fit=crop',
    origin: 'Punjab, North India',
  },
]

const FEATURES = [
  { icon: <FiClock />,       title: 'Fresh & Hot',         desc: 'Every dish is prepared fresh with traditional recipes and served piping hot at your doorstep.' },
  { icon: <FiShield />,      title: '100% Pure Veg',       desc: 'We serve only vegetarian food, prepared with the freshest ingredients and zero compromises.' },
  { icon: <FiSmartphone />,  title: 'Easy Ordering',       desc: 'Browse our desi menu and order your favourite Indian dishes in just a few taps.' },
  { icon: <FiStar />,        title: 'Authentic Recipes',   desc: 'Time-honoured recipes passed down through generations — the real taste of India.' },
  { icon: <FiTruck />,       title: 'Fast Delivery',       desc: 'Get your food delivered in 20-30 minutes, from our kitchen to your doorstep.' },
  { icon: <FiHeart />,       title: 'Made with Love',      desc: 'Every dish is crafted with love, just like ghar ka khana — homemade goodness.' },
]

export default function LandingPage() {
  const { user } = useAuth()
  const [heroIdx, setHeroIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg">🍽</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              FoodShop
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to={user.role === 'ADMIN' ? '/admin/manage-menu' : '/menu'} className="btn-primary !py-2 !px-5 text-sm flex items-center gap-2">
                Go to Dashboard <FiArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-5 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${heroIdx === i ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              🌿 100% Pure Vegetarian • Free delivery on first order
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Authentic Indian
              <br />
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                Vegetarian Food
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
              From the smoky streets of Mumbai's vada pav stalls to the aromatic kitchens of Punjab — savour India's finest vegetarian delicacies, delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={user ? '/menu' : '/register'} className="btn-primary !py-3.5 !px-8 text-base flex items-center justify-center gap-2 !rounded-2xl">
                Order Now <FiArrowRight size={18} />
              </Link>
              <Link to="/menu" className="btn-secondary !py-3.5 !px-8 text-base flex items-center justify-center gap-2 !rounded-2xl !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                Browse Menu
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { value: '500+', label: 'Happy Foodies' },
                { value: '80+', label: 'Desi Dishes' },
                { value: '4.9', label: 'Avg. Rating' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">What are you craving today?</h2>
            <p className="text-gray-500 text-lg">Explore our rich variety of Indian vegetarian delights</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
            {FOOD_CATEGORIES.map(cat => (
              <Link
                to="/menu"
                key={cat.name}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl border border-transparent hover:border-gray-100 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {cat.emoji}
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-brand-600 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Signature Dishes ── */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Our Signature Dishes</h2>
            <p className="text-gray-500 text-lg">Each dish tells a story of India's diverse culinary heritage</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            {SPECIALTIES.map((s, i) => (
              <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-56 overflow-hidden">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-brand-600">
                    📍 {s.origin}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Indian Food ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Why Indian Vegetarian Food is Special</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl flex-shrink-0 mt-1">🌿</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">World's Largest Vegetarian Cuisine</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">India has the richest vegetarian culinary tradition on the planet, with thousands of unique dishes from every region.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl flex-shrink-0 mt-1">🫚</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">A Symphony of Spices</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">From turmeric, cumin, and coriander to cardamom and saffron — every dish is a masterful blend of aromatic spices with amazing health benefits.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl flex-shrink-0 mt-1">❤️</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Rooted in Tradition</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">Recipes passed down through generations, reflecting centuries of culture, festivals, and the warmth of Indian hospitality.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl flex-shrink-0 mt-1">🌍</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Regional Diversity</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">From South Indian dosas to Punjabi chole bhature, from Gujarati dhokla to Rajasthani dal baati — every state brings a unique flavour.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80&auto=format&fit=crop" alt="Indian thali" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
              <img src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80&auto=format&fit=crop" alt="Paneer tikka" className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8" />
              <img src="https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&q=80&auto=format&fit=crop" alt="Dosa" className="rounded-2xl shadow-lg w-full h-48 object-cover -mt-4" />
              <img src="https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80&auto=format&fit=crop" alt="Chole bhature" className="rounded-2xl shadow-lg w-full h-48 object-cover mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Why choose FoodShop?</h2>
            <p className="text-gray-500 text-lg">We make food ordering simple and delightful</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {FEATURES.map((f, i) => (
              <div key={i} className="card p-8 group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center text-2xl mb-5 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Craving Authentic Indian Food?</h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Join FoodShop today and experience the true taste of India — from piping hot vada pav to creamy paneer masala, all 100% vegetarian.
          </p>
          <Link to={user ? '/menu' : '/register'} className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold py-4 px-10 rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            Get Started Free <FiArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">🍽</span>
                </div>
                <span className="text-xl font-bold">FoodShop</span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Serving authentic Indian vegetarian food — from street-side favourites to royal Mughlai delicacies. Pure veg, always fresh.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-gray-400">
                {[{ l: 'Home', to: '/' }, { l: 'Menu', to: '/menu' }, { l: 'Login', to: '/login' }, { l: 'Register', to: '/register' }].map(k => (
                  <li key={k.l}><Link to={k.to} className="hover:text-brand-400 transition-colors">{k.l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2.5 text-gray-400">
                <li>📍 123 Food Street, Tasty City</li>
                <li>📞 +91 98765 43210</li>
                <li>✉️ hello@foodshop.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FoodShop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
