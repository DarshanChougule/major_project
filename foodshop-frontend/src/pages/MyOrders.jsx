import React, { useEffect, useState } from 'react'
import { FiPackage, FiClock, FiStar, FiSend } from 'react-icons/fi'
import api from '../services/api'

const STATUS_CONFIG = {
  PENDING:   { color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500',  label: 'Pending' },
  PREPARING: { color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500',   label: 'Preparing' },
  READY:     { color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Ready' },
  COMPLETED: { color: 'bg-gray-100 text-gray-700',      dot: 'bg-gray-500',   label: 'Completed' },
  CANCELED:  { color: 'bg-red-100 text-red-700',        dot: 'bg-red-500',    label: 'Canceled' },
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbacks, setFeedbacks] = useState({})
  const [feedbackForm, setFeedbackForm] = useState({})

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      const res = await api.get('/user/orders/me')
      const orderList = res.data.content || res.data
      setOrders(orderList)

      const feedbackStatus = {}
      for (const order of orderList) {
        if (order.status === 'COMPLETED') {
          try {
            const fbRes = await api.get(`/user/feedback/order/${order.id}`)
            feedbackStatus[order.id] = fbRes.data === true
          } catch { feedbackStatus[order.id] = false }
        }
      }
      setFeedbacks(feedbackStatus)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(iso) {
    if (!iso) return 'N/A'
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  function handleInput(orderId, field, value) {
    setFeedbackForm(prev => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value }
    }))
  }

  async function submitFeedback(orderId) {
    const fb = feedbackForm[orderId]
    if (!fb?.rating || !fb?.comment) {
      alert('Please select a rating and enter a comment.')
      return
    }
    try {
      await api.post(`/user/feedback/${orderId}`, { rating: fb.rating, comment: fb.comment })
      setFeedbacks(prev => ({ ...prev, [orderId]: true }))
    } catch (err) {
      console.error(err)
      alert('Failed to submit feedback')
    }
  }

  const StarRating = ({ orderId }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => handleInput(orderId, 'rating', star)}
          className={`text-2xl transition-all duration-150 hover:scale-125 ${
            star <= (feedbackForm[orderId]?.rating || 0)
              ? 'text-amber-400 drop-shadow-sm'
              : 'text-gray-300 hover:text-amber-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">My Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title !mb-1">My Orders</h1>
        <p className="text-gray-500">Track and manage your food orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FiPackage size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-5 stagger-children">
          {orders.map(order => {
            const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
            return (
              <div key={order.id} className="card overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                      <FiPackage size={20} className="text-brand-500" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Order #{order.id}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FiClock size={12} /> {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${statusConf.color} flex items-center gap-1.5`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                    {statusConf.label}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Notes */}
                  {order.description && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
                      <strong>Note:</strong> {order.description}
                    </div>
                  )}

                  {/* Items */}
                  <div className="divide-y divide-gray-100">
                    {order.items?.map(it => (
                      <div key={it.id} className="flex justify-between items-center py-2.5">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🍽</span>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{it.name}</div>
                            <div className="text-xs text-gray-500">Qty: {it.quantity}</div>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">₹{it.unitPrice * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-brand-600">₹{order.totalPrice}</span>
                  </div>

                  {/* Updated date */}
                  {order.updatedAt && order.updatedAt !== order.createdAt && (
                    <div className="mt-2 text-xs text-gray-400">Last updated: {formatDate(order.updatedAt)}</div>
                  )}

                  {/* Feedback */}
                  {order.status === 'COMPLETED' && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      {feedbacks[order.id] ? (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                          <FiStar className="text-emerald-500" size={18} />
                          <span className="text-sm font-medium text-emerald-700">Thank you for your feedback!</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                            <FiStar size={16} className="text-amber-500" />
                            Rate your experience
                          </h4>
                          <StarRating orderId={order.id} />
                          <textarea
                            value={feedbackForm[order.id]?.comment || ''}
                            onChange={e => handleInput(order.id, 'comment', e.target.value)}
                            className="input-field resize-none text-sm"
                            rows="2"
                            placeholder="Tell us about your experience..."
                          />
                          <button
                            onClick={() => submitFeedback(order.id)}
                            className="btn-primary !py-2 !px-5 text-sm flex items-center gap-2"
                          >
                            <FiSend size={14} /> Submit Feedback
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
