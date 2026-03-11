import React, { useEffect, useState } from 'react'
import { FiPackage, FiClock, FiFilter, FiStar } from 'react-icons/fi'
import api from '../../services/api'

const STATUS_CONFIG = {
  PENDING:   { color: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-500',   label: 'Pending',   btnClass: 'bg-amber-500 hover:bg-amber-600' },
  PREPARING: { color: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500',    label: 'Preparing', btnClass: 'bg-blue-500 hover:bg-blue-600' },
  READY:     { color: 'bg-emerald-100 text-emerald-700',  dot: 'bg-emerald-500', label: 'Ready',     btnClass: 'bg-emerald-500 hover:bg-emerald-600' },
  COMPLETED: { color: 'bg-gray-100 text-gray-700',       dot: 'bg-gray-500',    label: 'Completed', btnClass: 'bg-gray-500 hover:bg-gray-600' },
  CANCELED:  { color: 'bg-red-100 text-red-700',         dot: 'bg-red-500',     label: 'Canceled',  btnClass: 'bg-red-500 hover:bg-red-600' },
}

const STATUS_LIST = ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELED']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('PENDING')
  const [feedbacks, setFeedbacks] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [status])

  async function fetchOrders() {
    try {
      setLoading(true)
      const res = await api.get('/admin/orders', { params: { status, page: 0, size: 50 } })
      const orderList = res.data.content || res.data
      setOrders(orderList)

      orderList.forEach(async (order) => {
        if (order.status === 'COMPLETED') {
          try {
            const fbRes = await api.get(`/admin/feedback/order/${order.id}`)
            setFeedbacks(prev => ({ ...prev, [order.id]: fbRes.data }))
          } catch { /* no feedback */ }
        }
      })
    } catch (err) {
      console.error(err)
      alert('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id, st) {
    try {
      await api.put(`/admin/orders/${id}/status`, null, { params: { status: st } })
      fetchOrders()
    } catch (err) {
      console.error(err)
      alert('Update failed')
    }
  }

  function formatDate(iso) {
    if (!iso) return 'N/A'
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const getActions = (s) => {
    switch (s) {
      case 'PENDING':   return ['PREPARING', 'READY', 'COMPLETED', 'CANCELED']
      case 'PREPARING': return ['READY', 'COMPLETED', 'CANCELED']
      case 'READY':     return ['COMPLETED', 'CANCELED']
      default:          return []
    }
  }

  const StarDisplay = ({ rating }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`text-lg ${s <= rating ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
      ))}
    </div>
  )

  const displayed = orders.filter(o => o.status === status)

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title !mb-1">Order Management</h1>
        <p className="text-gray-500">View and manage all customer orders</p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-2xl inline-flex">
        {STATUS_LIST.map(s => {
          const conf = STATUS_CONFIG[s]
          return (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                status === s
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
              {conf.label}
            </button>
          )
        })}
      </div>

      {/* Orders */}
      {loading ? (
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
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiPackage size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No {STATUS_CONFIG[status].label.toLowerCase()} orders</h3>
          <p className="text-gray-500 text-sm">Orders with this status will appear here</p>
        </div>
      ) : (
        <div className="space-y-5 stagger-children">
          {displayed.map(o => {
            const conf = STATUS_CONFIG[o.status] || STATUS_CONFIG.PENDING
            const actions = getActions(o.status)
            const feedback = feedbacks[o.id]

            return (
              <div key={o.id} className="card overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                      <FiPackage size={20} className="text-brand-500" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Order #{o.id}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FiClock size={12} /> {formatDate(o.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${conf.color} flex items-center gap-1.5`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                    {conf.label}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6">
                  {o.description && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
                      <strong>Customer Note:</strong> {o.description}
                    </div>
                  )}

                  <div className="divide-y divide-gray-100">
                    {o.items?.map(it => (
                      <div key={it.id} className="flex justify-between items-center py-2.5">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🍽</span>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{it.name}</div>
                            <div className="text-xs text-gray-500">Qty: {it.quantity} × ₹{it.unitPrice}</div>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">₹{it.unitPrice * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-brand-600">₹{o.totalPrice}</span>
                  </div>

                  {o.updatedAt && o.updatedAt !== o.createdAt && (
                    <div className="mt-2 text-xs text-gray-400">Updated: {formatDate(o.updatedAt)}</div>
                  )}

                  {/* Action Buttons */}
                  {actions.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {actions.map(action => (
                          <button
                            key={action}
                            onClick={() => updateStatus(o.id, action)}
                            className={`px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${STATUS_CONFIG[action].btnClass}`}
                          >
                            {STATUS_CONFIG[action].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {o.status === 'COMPLETED' && feedback && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                          <FiStar size={16} className="text-amber-500" />
                          Customer Feedback
                        </h4>
                        <StarDisplay rating={feedback.rating} />
                        <p className="text-sm text-gray-600 mt-2 italic">"{feedback.comment}"</p>
                        <p className="text-xs text-gray-400 mt-1">
                          by {feedback.userName || 'Anonymous'} · {formatDate(feedback.createdAt)}
                        </p>
                      </div>
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
