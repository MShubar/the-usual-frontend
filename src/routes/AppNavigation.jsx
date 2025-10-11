import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Checkout from '../views/Checkout'

function AppNavigation() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  )
}

export default AppNavigation
