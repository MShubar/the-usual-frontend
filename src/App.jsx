import React, { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import Checkout from './views/Checkout'
import HomePage from './views/HomePage'
import AdminPage from './views/AdminPage'
import OrderDetails from './views/OrderDetails'
import OrderConfirmation from './views/OrderConfirmation'
import Orders from './views/Orders'
import ItemDetails from './views/ItemDetails'
import AddressPage from './views/AddressPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType() // 'POP' | 'PUSH' | 'REPLACE'
  const suppressUntilRef = useRef(0)

  // Listen for UI-triggered suppression (e.g., drawer toggle)
  useEffect(() => {
    const handler = (e) => {
      const ttl = Math.max(0, e?.detail?.ttl ?? 600)
      suppressUntilRef.current = Date.now() + ttl
    }
    window.addEventListener('suppress-scroll-top', handler)
    return () => window.removeEventListener('suppress-scroll-top', handler)
  }, [])

  useEffect(() => {
    const now = Date.now()
    if (now < suppressUntilRef.current) return

    if (navigationType === 'PUSH' || navigationType === 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      // Ensure both roots reset (Safari/older browsers)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }, [pathname, navigationType])

  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/address" element={<AddressPage />} />
      </Routes>
    </Router>
  )
}

export default App
