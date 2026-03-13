import React, { useEffect, useState } from 'react'
import { FiUsers, FiMail, FiShoppingBag, FiSearch, FiShield } from 'react-icons/fi'
import api from '../../services/api'

const ROLE_BADGE = {
  ADMIN:    { color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500', label: 'Admin' },
  CUSTOMER: { color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500',   label: 'Customer' },
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load users')
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

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  )

  const totalCustomers = users.filter(u => u.role === 'CUSTOMER').length
  const totalAdmins = users.filter(u => u.role === 'ADMIN').length
  const totalOrders = users.reduce((sum, u) => sum + (u.totalOrders || 0), 0)

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title !mb-1">User Management</h1>
        <p className="text-gray-500">View all registered users and their details</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FiUsers size={22} className="text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
              <div className="text-sm text-gray-500">Customers</div>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
              <FiShield size={22} className="text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalAdmins}</div>
              <div className="text-sm text-gray-500">Admins</div>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
              <FiShoppingBag size={22} className="text-brand-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
              <div className="text-sm text-gray-500">Total Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field !pl-11"
        />
      </div>

      {/* Users Table / Cards */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-48 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiUsers size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No users found</h3>
          <p className="text-gray-500 text-sm">Try a different search term</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(u => {
                  const roleCfg = ROLE_BADGE[u.role] || ROLE_BADGE.CUSTOMER
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold shadow-sm">
                            {u.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="font-semibold text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${roleCfg.color} flex items-center gap-1.5 w-fit`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${roleCfg.dot}`} />
                          {roleCfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">{u.totalOrders || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(u.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 stagger-children">
            {filtered.map(u => {
              const roleCfg = ROLE_BADGE[u.role] || ROLE_BADGE.CUSTOMER
              return (
                <div key={u.id} className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                      {u.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 truncate">{u.name}</div>
                      <div className="text-sm text-gray-500 truncate flex items-center gap-1">
                        <FiMail size={12} /> {u.email}
                      </div>
                    </div>
                    <span className={`badge ${roleCfg.color} flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${roleCfg.dot}`} />
                      {roleCfg.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1"><FiShoppingBag size={14} /> {u.totalOrders || 0} orders</span>
                    <span>Joined: {formatDate(u.createdAt)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
