// src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit'

const CART_KEY = 'cart_data'
const CART_EXPIRY_KEY = 'cart_expiry'
const CART_TTL = 24 * 60 * 60 * 1000 // 24 hours

function loadCartFromStorage() {
  try {
    const expiry = localStorage.getItem(CART_EXPIRY_KEY)
    if (!expiry || Date.now() > parseInt(expiry, 10)) {
      localStorage.removeItem(CART_KEY)
      localStorage.removeItem(CART_EXPIRY_KEY)
      return []
    }
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

function saveCartToStorage(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  localStorage.setItem(CART_EXPIRY_KEY, Date.now() + CART_TTL)
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addItem: (state, action) => {
      const existing = state.find((item) => item.id === action.payload.id)
      if (existing) {
        existing.quantity += action.payload.quantity || 1
      } else {
        state.push({ ...action.payload, quantity: 1 })
      }
      saveCartToStorage(state)
    },
    removeItem: (state, action) => {
      const newState = state.filter((item) => item.id !== action.payload)
      saveCartToStorage(newState)
      return newState
    },
    clearCart: () => {
      localStorage.removeItem(CART_KEY)
      localStorage.removeItem(CART_EXPIRY_KEY)
      return []
    }
  }
})

export const { addItem, removeItem, clearCart } = cartSlice.actions
export default cartSlice.reducer
