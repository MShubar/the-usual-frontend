import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Checkout from './views/Checkout'
import HomePage from './views/HomePage'
import AdminPage from './views/AdminPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
