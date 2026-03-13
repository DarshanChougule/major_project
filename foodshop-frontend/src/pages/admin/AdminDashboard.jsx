import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiUsers, FiShoppingBag, FiDollarSign, FiGrid,
  FiStar, FiMessageSquare, FiPackage, FiTrendingUp,
  FiArrowRight, FiClock, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi'
import api from '../../services/api'

const STATUS_COLORS = {
  PENDING:   'bg-amber-100 text-amber-700',
  PREPARING: 'bg-blue-100 text-blue-700',
  READY:     'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELED:  'bg-red-100 text-red-700',
}

const STATUS_DOTS = {
  PENDING:   'bg-amber-500',
  PREPARING: 'bg-blue-500',
  READY:     'bg-emerald-500',
  COMPLETED: 'bg-gray-500',
  CANCELED:  'bg-red-500',
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  async function fetchDashboard() {
    try {
      setLoading(true)
      const res = await api.get('/admin/dashboard')
      setData(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
                <div>
                  <div className="h-6 w-16 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-10 bg-gray-100 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const statCards = [
    {
      icon: <FiUsers size={24} />,
      label: 'Total Users',
      value: data.totalUsers,
      sub: `${data.totalCustomers} customers · ${data.totalAdmins} admins`,
      color: 'bg-blue-50 text-blue-500',
      link: '/admin/users',
    },
    {
      icon: <FiShoppingBag size={24} />,
      label: 'Total Orders',
      value: data.totalOrders,
      sub: `${data.ordersByStatus?.PENDING || 0} pending`,
      color: 'bg-brand-50 text-brand-500',
      link: '/admin/orders',
    },
    {
      icon: <FiDollarSign size={24} />,
      label: 'Total Revenue',
      value: `₹${data.totalRevenue?.toLocaleString('en-IN') || '0'}`,
      sub: 'From completed orders',
      color: 'bg-emerald-50 text-emerald-500',
    },
    {
      icon: <FiGrid size={24} />,
      label: 'Menu Items',
      value: data.totalMenuItems,
      sub: `${data.availableMenuItems} available`,
      color: 'bg-purple-50 text-purple-500',
      link: '/admin/manage-menu',
    },
  ]

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title !mb-1">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {statCards.map((s, i) => {
          const inner = (
            <div className="card p-6 group hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">{s.sub}</div>
            </div>
          )
          return s.link ? (
            <Link key={i} to={s.link} className="block">{inner}</Link>
          ) : (
            <div key={i}>{inner}</div>
          )
        })}
      </div>

      {/* Second Row — Feedback + Rating */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm">
            <FiStar size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{data.avgRating}</div>
            <div className="text-sm text-gray-500">Avg. Rating</div>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className={`text-sm ${s <= Math.round(data.avgRating) ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
        <Link to="/admin/feedback" className="block">
          <div className="card p-6 flex items-center gap-4 group hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <FiMessageSquare size={24} />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900">{data.totalFeedbacks}</div>
              <div className="text-sm text-gray-500">Total Reviews</div>
            </div>
            <FiArrowRight className="text-gray-400 group-hover:text-brand-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Third Row — Order Status Breakdown + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
        {/* Order Status Breakdown */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <FiTrendingUp size={18} className="text-brand-500" />
              Order Breakdown
            </h2>
            <Link to="/admin/orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {data.ordersByStatus && Object.entries(data.ordersByStatus).map(([status, count]) => {
              const pct = data.totalOrders > 0 ? (count / data.totalOrders) * 100 : 0
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOTS[status] || 'bg-gray-400'}`} />
                      <span className="text-sm font-medium text-gray-700">{status.charAt(0) + status.slice(1).toLowerCase()}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        status === 'PENDING' ? 'bg-amber-400' :
                        status === 'PREPARING' ? 'bg-blue-400' :
                        status === 'READY' ? 'bg-emerald-400' :
                        status === 'COMPLETED' ? 'bg-gray-400' :
                        'bg-red-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <FiClock size={18} className="text-brand-500" />
              Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          {data.recentOrders && data.recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.recentOrders.map(o => (
                <div key={o.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                    {o.userName ? o.userName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-sm truncate">#{o.id} · {o.userName}</span>
                      <span className="font-bold text-gray-900 text-sm ml-2">₹{o.totalPrice}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-gray-500 truncate">{o.createdAt}</span>
                      <span className={`badge text-[10px] py-0.5 px-2 ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FiPackage size={32} className="mx-auto mb-2" />
              <p className="text-sm">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="font-bold text-gray-900 text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: '/admin/manage-menu', label: 'Manage Menu', icon: <FiGrid size={18} />, desc: 'Add or edit menu items' },
            { to: '/admin/orders', label: 'View Orders', icon: <FiPackage size={18} />, desc: 'Process pending orders' },
            { to: '/admin/users', label: 'View Users', icon: <FiUsers size={18} />, desc: 'See all registered users' },
            { to: '/admin/feedback', label: 'View Feedback', icon: <FiMessageSquare size={18} />, desc: 'Read customer reviews' },
          ].map((a, i) => (
            <Link
              key={i}
              to={a.to}
              className="group card p-5 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-sm">
                {a.icon}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{a.label}</div>
                <div className="text-xs text-gray-500">{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
