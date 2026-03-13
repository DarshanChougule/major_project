import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import AdminManageMenu from './pages/admin/AdminManageMenu'
import AdminOrders from './pages/admin/AdminOrders'
import AdminFeedback from './pages/admin/AdminFeedback'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './components/LandingPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/manage-menu" element={<ProtectedRoute role="ADMIN"><AdminManageMenu /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/feedback" element={<ProtectedRoute role="ADMIN"><AdminFeedback /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
            <div className="text-8xl mb-4">🍽</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <p className="text-gray-500 mb-6">This page doesn't exist</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
    </div>
  )
}
