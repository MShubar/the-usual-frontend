import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Checkout from './views/Checkout'
import HomePage from './views/HomePage'
import AdminPage from './views/AdminPage'
import OrderDetails from './views/OrderDetails'
import OrderConfirmation from './views/OrderConfirmation'
import Orders from './views/Orders'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  )
}

export default App
