import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import {
  FiMenu, FiX, FiShoppingCart, FiLogOut, FiUser,
  FiGrid, FiPackage, FiMessageSquare
} from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.reduce((sum, i) => sum + i.quantity, 0))
    }
    updateCart()
    window.addEventListener('storage', updateCart)
    const interval = setInterval(updateCart, 1000)
    return () => {
      window.removeEventListener('storage', updateCart)
      clearInterval(interval)
    }
  }, [])

  const onLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navLink = (to, label, icon) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
        ${isActive(to)
          ? 'bg-brand-50 text-brand-600'
          : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50/50'
        }`}
    >
      {icon}
      {label}
    </Link>
  )

  if (location.pathname === '/') return null

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg' : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? (user.role === 'ADMIN' ? '/admin/manage-menu' : '/menu') : '/'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white text-lg">🍽</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              FoodShop
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!user ? (
              <>
                {navLink('/login', 'Login', <FiUser size={16} />)}
                <Link to="/register" className="ml-2 btn-primary !py-2 !px-5 text-sm">
                  Get Started
                </Link>
              </>
            ) : user.role === 'ADMIN' ? (
              <>
                {navLink('/admin/manage-menu', 'Menu', <FiGrid size={16} />)}
                {navLink('/admin/orders', 'Orders', <FiPackage size={16} />)}
                {navLink('/admin/feedback', 'Feedback', <FiMessageSquare size={16} />)}
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  <FiLogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                {navLink('/menu', 'Menu', <FiGrid size={16} />)}
                <Link
                  to="/cart"
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive('/cart') ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50/50'}`}
                >
                  <FiShoppingCart size={16} />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-fade-in">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {navLink('/orders', 'My Orders', <FiPackage size={16} />)}
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  <FiLogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {!user ? (
              <>
                {navLink('/login', 'Login', <FiUser size={16} />)}
                {navLink('/register', 'Register', <FiUser size={16} />)}
              </>
            ) : user.role === 'ADMIN' ? (
              <>
                {navLink('/admin/manage-menu', 'Manage Menu', <FiGrid size={16} />)}
                {navLink('/admin/orders', 'Orders', <FiPackage size={16} />)}
                {navLink('/admin/feedback', 'Feedback', <FiMessageSquare size={16} />)}
                <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  <FiLogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                {navLink('/menu', 'Menu', <FiGrid size={16} />)}
                {navLink('/cart', `Cart${cartCount > 0 ? ` (${cartCount})` : ''}`, <FiShoppingCart size={16} />)}
                {navLink('/orders', 'My Orders', <FiPackage size={16} />)}
                <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  <FiLogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
