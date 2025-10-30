// src/views/Checkout.js
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import orderTypeOptions from '../constants/orderTypeOptions.js'
import { useNavigate } from 'react-router-dom'
import { API_BACKEND } from './API'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/BackButton'
import PhoneInputModal from '../components/PhoneInputModal'
import ConfirmationModal from '../components/ConfirmationModal'
import CartItemsList from '../components/CartItemsList'
import EmptyState from '../components/EmptyState'
import OrderTypeSelector from '../components/OrderTypeSelector'
import OrderSummary from '../components/OrderSummary'
import AlertMessage from '../components/AlertMessage'
import useFetch from '../hooks/useFetch'
import { cacheManager } from '../utils/cache'

function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [orderType, setOrderType] = useState('delivery') 
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [hasPendingOrder, setHasPendingOrder] = useState(false)
  const [phone, setPhone] = useState(() => {
    // Load saved phone from localStorage
    try {
      return localStorage.getItem('userPhone') || ''
    } catch {
      return ''
    }
  })
  const [userId, setUserId] = useState(() => {
    // Load saved userId from localStorage
    try {
      return localStorage.getItem('userId') || ''
    } catch {
      return ''
    }
  })
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [showClearCartModal, setShowClearCartModal] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const navigate = useNavigate()

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      setCartItems(savedCart ? JSON.parse(savedCart) : [])
    } catch {
      setCartItems([])
    }
  }, [])

  // Only create the fetch hook if userId exists
  const shouldFetchOrders = Boolean(userId)
  
  const {
    fetchData: fetchOrders
  } = useFetch(
    shouldFetchOrders ? `${API_BACKEND}/orders/user/${encodeURIComponent(userId)}` : null,
    {
      useCache: false,
      onSuccess: (data) => {
        if (Array.isArray(data)) {
          setHasPendingOrder(data.some(order => order.status === 'pending'))
        }
      },
      onError: (err) => {
        console.error('Error fetching orders:', err)
        // Don't block the user if fetching orders fails
        setHasPendingOrder(false)
      }
    }
  )

  // Fetch orders when userId is available
  useEffect(() => {
    if (userId && shouldFetchOrders) {
      fetchOrders().catch(() => {
        // Silently handle error - order check is optional
        setHasPendingOrder(false)
      })
    }
  }, [userId, shouldFetchOrders])

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    setShowClearCartModal(true)
  }

  const handleClearCartConfirm = () => {
    setCartItems([])
    localStorage.removeItem('cart')
    setShowClearCartModal(false)
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const delivery = orderType === 'delivery' ? 0.40 : 0
  const total = subtotal + delivery

  const createOrder = async (orderData) => {
    try {
      const response = await fetch(`${API_BACKEND}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (result.message && result.message.includes('order_number')) {
          throw new Error('Order system error: Missing order number. Please contact support.')
        }
        throw new Error(result.message || `HTTP error! status: ${response.status}`)
      }

      return result
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  const handlePlaceOrder = async () => {
    setOrderError(null)

    if (hasPendingOrder) {
      setOrderError('You already have a pending order. Please wait for it to be completed before placing a new order.')
      return
    }

    // Phone modal only opens here, when user clicks Place Order button
    if (orderType === 'pickup') {
      if (!phone) {
        setShowPhoneModal(true) // This is the ONLY place modal opens
        return
      }
      
      let formattedPhone = phone.trim()
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+973' + formattedPhone
      }

      // Save phone and userId to localStorage
      try {
        localStorage.setItem('userPhone', phone)
        localStorage.setItem('userId', formattedPhone)
      } catch (error) {
        console.error('Error saving user info:', error)
      }

      // Set userId to fetch orders for this phone number
      if (!userId) {
        setUserId(formattedPhone)
      }

      setIsPlacingOrder(true)
      try {
        const orderData = {
          orderType: 'pickup',
          total: total,
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
        
        // Invalidate orders cache so it refreshes
        const cacheKey = `orders_${formattedPhone}`
        cacheManager.remove(cacheKey)
        
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
        
        // Still allow navigation with local order in case of backend issues
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
    } else {
      navigate('/order-details', {
        state: {
          orderType,
          cartItems,
          total
        }
      })
    }
  }

  const summaryItems = [
    {
      label: `Subtotal (${cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)`,
      value: subtotal
    },
    {
      label: orderType === 'delivery' ? 'Delivery Fee' : 'Pickup Fee',
      value: delivery
    }
  ]

  return (
    <>
      <PageContainer>
        <BackButton onClick={() => navigate(-1)} />
        
        <PageHeader
          icon={ShoppingCartIcon}
          iconColor="#ff9800"
          iconSize={32}
          title="Your Order"
          location={orderType === 'delivery' ? 'Delivery to Bahrain, Manama' : 'Pickup from Store'}
          showLocationIcon={true}
        />

        {cartItems.length === 0 ? (
          <EmptyState
            icon={ShoppingCartIcon}
            iconSize={64}
            iconColor="#555"
            title="Your cart is empty"
            subtitle="Add some delicious items to get started!"
          />
        ) : (
          <Content>
            <OrderTypeSelector
              options={orderTypeOptions}
              activeType={orderType}
              onTypeChange={setOrderType}
              title="Order Type"
            />

            <CartItemsList
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onClearAll={clearCart}
              title="Order Items"
              showClearButton={true}
              currency="BD"
            />

            <OrderSummary
              title="Order Summary"
              summaryItems={summaryItems}
              total={total}
              currency="BD"
              buttonText={orderType === 'delivery' ? 'Continue to Order Details' : 'Place Pickup Order'}
              buttonLoadingText="Placing Order..."
              onButtonClick={handlePlaceOrder}
              isButtonDisabled={isPlacingOrder || hasPendingOrder}
            >
              {hasPendingOrder && (
                <AlertMessage
                  type="warning"
                  message="You have a pending order. Please wait for it to be completed."
                />
              )}

              {orderError && (
                <AlertMessage
                  type="error"
                  message={orderError}
                  onClose={() => setOrderError(null)}
                />
              )}

              <PhoneInputModal
                open={showPhoneModal}
                onClose={() => setShowPhoneModal(false)}
                phone={phone}
                onChange={(e) => setPhone(e.target.value)}
                onSubmit={() => {
                  setShowPhoneModal(false)
                  handlePlaceOrder()
                }}
                title="Enter Phone Number"
                placeholder="Enter phone number (e.g., 39970100)"
                buttonText="Continue"
              />

              <ConfirmationModal
                open={showClearCartModal}
                onCancel={() => setShowClearCartModal(false)}
                onConfirm={handleClearCartConfirm}
                title="Clear Cart?"
                message="Are you sure you want to remove all items from your cart?"
                cancelText="Keep Items"
                confirmText="Clear All Items"
              />
            </OrderSummary>

          </Content>
        )}
      </PageContainer>
    </>
  )
}

export default Checkout

const PageContainer = styled.div`
  background: #000;
  color: white;
  min-height: 100vh;
  padding-bottom: 20px;
  overflow-x: hidden;
  width: 100%;
  position: relative;
`

const Content = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    padding: 0 12px;
    gap: 16px;
  }
`
