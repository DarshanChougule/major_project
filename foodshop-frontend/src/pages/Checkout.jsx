import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiShoppingBag, FiFileText, FiCheck } from 'react-icons/fi'
import api from '../services/api'

export default function Checkout() {
  const navigate = useNavigate()
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  async function placeOrder() {
    if (cart.length === 0) return

    const payload = {
      description,
      items: cart.map(i => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity
      }))
    }

    try {
      setLoading(true)
      await api.post('/user/orders', payload)
      localStorage.removeItem('cart')
      setSuccess(true)
      setTimeout(() => navigate('/orders'), 2000)
    } catch (err) {
      console.error('Error placing order:', err)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page-container">
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
            <FiCheck size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-500">Redirecting to your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 animate-fade-in-up">
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiShoppingBag size={20} className="text-brand-500" />
              Order Items
            </h2>
            <div className="divide-y divide-gray-100">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-lg">🍽</div>
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.unitPrice}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">₹{item.unitPrice * item.quantity}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiFileText size={20} className="text-brand-500" />
              Special Instructions
            </h2>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Any special requests? (e.g., no onions, extra spicy, deliver after 7 PM...)"
              rows="3"
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 animate-slide-in-right">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-emerald-600">FREE</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-brand-600">₹{total}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading || cart.length === 0}
              className="w-full btn-primary !py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Place Order</>
              )}
            </button>

            <p className="mt-3 text-xs text-gray-400 text-center">
              By placing this order, you agree to our terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
