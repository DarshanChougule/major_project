import React, { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiToggleLeft, FiToggleRight, FiX, FiPackage } from 'react-icons/fi'
import api from '../../services/api'

export default function AdminManageMenu() {
  const [menu, setMenu] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMenu() }, [])

  async function fetchMenu() {
    try {
      setLoading(true)
      const res = await api.get('/admin/menu')
      setMenu(res.data.content)
    } catch (err) {
      console.error(err)
      alert('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  async function submit(e) {
    e.preventDefault()
    try {
      if (editing) {
        const res = await api.put(`/admin/menu/${editing}`, {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price)
        })
        setMenu(menu.map(m => m.id === res.data.id ? res.data : m))
        setEditing(null)
      } else {
        const res = await api.post('/admin/menu', {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price)
        })
        setMenu([...menu, res.data])
      }
      setForm({ name: '', description: '', price: '' })
      setShowForm(false)
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
  }

  async function toggleAvailability(id) {
    try {
      await api.put(`/admin/menus/${id}`)
      fetchMenu()
    } catch (err) {
      console.error(err)
      alert('Update failed')
    }
  }

  function editItem(item) {
    setEditing(item.id)
    setForm({ name: item.name || '', description: item.description || '', price: item.price || '' })
    setShowForm(true)
  }

  function cancelEdit() {
    setEditing(null)
    setForm({ name: '', description: '', price: '' })
    setShowForm(false)
  }

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title !mb-1">Manage Menu</h1>
          <p className="text-gray-500">{menu.length} items in your menu</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 self-start">
            <FiPlus size={18} /> Add Item
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              {editing ? 'Edit Menu Item' : 'Add New Item'}
            </h2>
            <button onClick={cancelEdit} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <FiX size={20} className="text-gray-500" />
            </button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Name</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Margherita Pizza"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
                <input
                  required
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g., 299"
                  type="number"
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the dish..."
                rows="2"
                className="input-field resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2">
                {editing ? <><FiEdit2 size={16} /> Update Item</> : <><FiPlus size={16} /> Add Item</>}
              </button>
              <button type="button" onClick={cancelEdit} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse flex justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-72 bg-gray-100 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-16 bg-gray-200 rounded-xl" />
                <div className="h-9 w-24 bg-gray-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : menu.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FiPackage size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No menu items yet</h2>
          <p className="text-gray-500 mb-6">Start by adding your first menu item</p>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <FiPlus size={18} /> Add First Item
          </button>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {menu.map(item => (
            <div key={item.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:-translate-y-0.5">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  🍽
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                    <span className={`badge text-[10px] ${
                      item.available !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.available !== false ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{item.description || 'No description'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-lg font-bold text-brand-600">₹{item.price}</span>

                <button
                  onClick={() => editItem(item)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 transition-all"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>

                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    item.available !== false
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  {item.available !== false
                    ? <><FiToggleRight size={16} /> Disable</>
                    : <><FiToggleLeft size={16} /> Enable</>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
