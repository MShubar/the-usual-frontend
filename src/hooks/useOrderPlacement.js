import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BACKEND } from '../views/API'
import { cacheManager } from '../utils/cache'

export const useOrderPlacement = () => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const navigate = useNavigate()

  const createOrder = async (orderData) => {
    const response = await fetch(`${API_BACKEND}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })

    const result = await response.json()

    if (!response.ok) {
      if (result.message?.includes('order_number')) {
        throw new Error('Order system error: Missing order number. Please contact support.')
      }
      throw new Error(result.message || `HTTP error! status: ${response.status}`)
    }

    return result
  }

  const placeOrder = async ({ orderType, total, cartItems, phone, userId }) => {
    setOrderError(null)
    setIsPlacingOrder(true)

    try {
      let formattedPhone = phone.trim()
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+973' + formattedPhone
      }

      localStorage.setItem('userPhone', phone)
      localStorage.setItem('userId', formattedPhone)

      const orderData = {
        orderType,
        total,
        paymentMethod: 'cash',
        deliveryAddress: null,
        userId: formattedPhone,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name || `Item #${item.id}`,
          image: item.image || null,
          description: item.description || '',
          quantity: item.quantity,
          price: item.price,
          customizations: {
            size: item.size || null,
            milk: item.milk || null,
            shots: item.shots || null,
            mixer: item.mixer || null
          }
        }))
      }

      const orderResponse = await createOrder(orderData)
      
      cacheManager.remove(`orders_${formattedPhone}`)
      localStorage.removeItem('cart')

      navigate('/order-confirmation', {
        state: {
          orderType,
          cartItems,
          total,
          paymentMethod: 'cash',
          orderNumber: orderResponse.orderNumber || orderResponse.id || 'PENDING',
          success: true
        }
      })
    } catch (error) {
      console.error('Failed to place order:', error)
      setOrderError(error.message || 'Failed to place order. Please try again.')
      
      const fallbackOrderNumber = `LOCAL-${Date.now()}`
      localStorage.removeItem('cart')
      
      navigate('/order-confirmation', {
        state: {
          orderType,
          cartItems,
          total,
          paymentMethod: 'cash',
          orderNumber: fallbackOrderNumber,
          error: error.message || 'Order placed locally - backend unavailable'
        }
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return {
    isPlacingOrder,
    orderError,
    setOrderError,
    placeOrder
  }
}
