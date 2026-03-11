import React, { useEffect, useState } from 'react'
import { FiMessageSquare, FiStar } from 'react-icons/fi'
import api from '../../services/api'

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchFeedbacks() }, [])

  async function fetchFeedbacks() {
    try {
      const res = await api.get('/admin/feedback')
      setFeedbacks(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load feedbacks')
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

  const StarDisplay = ({ rating }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`text-lg ${s <= rating ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
      ))}
    </div>
  )

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0'

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title !mb-1">Customer Feedback</h1>
        <p className="text-gray-500">See what your customers are saying</p>
      </div>

      {/* Stats */}
      {!loading && feedbacks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
              <FiMessageSquare size={22} className="text-brand-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{feedbacks.length}</div>
              <div className="text-sm text-gray-500">Total Reviews</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <FiStar size={22} className="text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{avgRating}</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {feedbacks.filter(f => f.rating >= 4).length}
              </div>
              <div className="text-sm text-gray-500">Positive Reviews</div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FiMessageSquare size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No feedback yet</h2>
          <p className="text-gray-500">Customer reviews will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 stagger-children">
          {feedbacks.map(fb => (
            <div key={fb.id} className="card p-6 hover:-translate-y-0.5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {(fb.userName || 'U').charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{fb.userName || 'Anonymous'}</h3>
                      <div className="text-xs text-gray-500">Order #{fb.orderId} · {formatDate(fb.createdAt)}</div>
                    </div>
                    <StarDisplay rating={fb.rating} />
                  </div>

                  <p className="text-gray-600 leading-relaxed">"{fb.comment}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
