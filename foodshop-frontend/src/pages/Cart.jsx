import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi'

export default function Cart() {
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(() => setCart(JSON.parse(localStorage.getItem('cart') || '[]')), [])

  function updateQty(idx, delta) {
    const c = [...cart]
    c[idx].quantity = Math.max(1, c[idx].quantity + delta)
    setCart(c)
    localStorage.setItem('cart', JSON.stringify(c))
  }

  function removeItem(idx) {
    const c = [...cart]
    c.splice(idx, 1)
    setCart(c)
    localStorage.setItem('cart', JSON.stringify(c))
  }

  function clearCart() {
    setCart([])
    localStorage.setItem('cart', '[]')
  }

  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="page-container">
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FiShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some delicious items from our menu!</p>
          <Link to="/menu" className="btn-primary flex items-center gap-2">
            Browse Menu <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title !mb-1">Your Cart</h1>
          <p className="text-gray-500">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
        </div>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4 stagger-children">
          {cart.map((item, idx) => (
            <div key={idx} className="card p-5 flex items-center gap-4 group hover:-translate-y-0.5">
              {/* Emoji placeholder */}
              <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🍽
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500">₹{item.unitPrice} each</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(idx, -1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQty(idx, 1)}
                  className="w-8 h-8 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 flex items-center justify-center transition-colors"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              {/* Price */}
              <div className="text-right w-20 flex-shrink-0">
                <div className="font-bold text-gray-900">₹{item.unitPrice * item.quantity}</div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(idx)}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-gray-900 flex-shrink-0">₹{item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-brand-600">₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary !py-3 flex items-center justify-center gap-2 text-base"
            >
              Proceed to Checkout <FiArrowRight size={18} />
            </button>

            <Link to="/menu" className="block text-center mt-3 text-sm text-gray-500 hover:text-brand-600 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
