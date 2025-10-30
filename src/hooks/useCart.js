import { useState, useEffect } from 'react'

export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cartItems])

  const addToCart = (item) => {
    setCartItems(prevCart => {
      const itemKey = `${item.id}-${item.size || ''}-${item.milk || ''}-${item.shots || ''}-${item.mixer || ''}`
      
      const existingItem = prevCart.find(cartItem => {
        const cartItemKey = `${cartItem.id}-${cartItem.size || ''}-${cartItem.milk || ''}-${cartItem.shots || ''}-${cartItem.mixer || ''}`
        return cartItemKey === itemKey
      })

      if (existingItem) {
        return prevCart.map(cartItem => {
          const cartItemKey = `${cartItem.id}-${cartItem.size || ''}-${cartItem.milk || ''}-${cartItem.shots || ''}-${cartItem.mixer || ''}`
          return cartItemKey === itemKey
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        })
      }
      
      return [...prevCart, { ...item }]
    })
  }

  const updateCart = (newCart) => {
    setCartItems(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId)
    updateCart(updatedCart)
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    updateCart(updatedCart)
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  return {
    cartItems,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart
  }
}
