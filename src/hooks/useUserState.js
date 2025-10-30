import { useState, useEffect } from 'react'
import useFetch from './useFetch'
import { API_BACKEND } from '../views/API'

export const useUserState = () => {
  const [phone, setPhone] = useState(() => {
    try {
      return localStorage.getItem('userPhone') || ''
    } catch {
      return ''
    }
  })

  const [userId, setUserId] = useState(() => {
    try {
      return localStorage.getItem('userId') || ''
    } catch {
      return ''
    }
  })

  const [hasPendingOrder, setHasPendingOrder] = useState(false)

  const { fetchData: fetchOrders } = useFetch(
    userId ? `${API_BACKEND}/orders/user/${encodeURIComponent(userId)}` : null,
    {
      useCache: false,
      onSuccess: (data) => {
        if (Array.isArray(data)) {
          setHasPendingOrder(data.some(order => order.status === 'pending'))
        }
      },
      onError: () => setHasPendingOrder(false)
    }
  )

  useEffect(() => {
    if (userId) {
      const timeoutId = setTimeout(() => {
        fetchOrders().catch(() => setHasPendingOrder(false))
      }, 100) // Debounce to prevent multiple calls
      
      return () => clearTimeout(timeoutId)
    }
  }, [userId]) // Only depend on userId

  return { 
    phone, 
    setPhone, 
    userId, 
    setUserId, 
    hasPendingOrder,
    setHasPendingOrder 
  }
}
