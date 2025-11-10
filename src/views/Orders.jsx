import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import StorefrontIcon from '@mui/icons-material/Storefront'
import MenuIcon from '@mui/icons-material/Menu'
import RefreshIcon from '@mui/icons-material/Refresh'
import DrawerMenu from '../components/DrawerMenu'
import PhoneInputModal from '../components/PhoneInputModal'
import ConfirmationModal from '../components/ConfirmationModal'
import OrdersPageHeader from '../components/OrdersPageHeader'
import { API_BACKEND } from './API'
import { cacheManager } from '../utils/cache'

function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [phone, setPhone] = useState('')
  const [userId, setUserId] = useState(() => {
    // Load saved userId from localStorage
    try {
      return localStorage.getItem('userId') || ''
    } catch {
      return ''
    }
  })

  useEffect(() => {
    if (!userId) {
      const timer = setTimeout(() => {
        setShowPhoneModal(true)
      }, 500) 
      
      return () => clearTimeout(timer)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchOrders()
      
      // Set up polling - check for updates every 10 seconds
      const pollInterval = setInterval(() => {
        fetchOrders(true) // Pass true to skip loading state
      }, 10000) // 10 seconds

      return () => clearInterval(pollInterval)
    } else {
      setLoading(false)
      setOrders([])
    }
  }, [userId])

  const fetchOrders = async (isPolling = false) => {
    if (!userId) {
      setOrders([])
      setLoading(false)
      return
    }

    if (!isPolling) {
      setLoading(true)
    } else {
      setIsRefreshing(true)
    }
    setError(null)

    const cacheKey = `orders_${userId}`

    try {
      // Use simpler root-level API endpoint
      const response = await fetch(`${API_BACKEND}/api/user-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }),
        cache: 'no-cache'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      cacheManager.set(cacheKey, data)
      setOrders(data)
    } catch (err) {
      console.error('Error fetching orders:', err)
      if (!isPolling) {
        setError(err.message || 'Failed to load orders')
      }
      if (isPolling) {
        const cached = cacheManager.get(cacheKey)
        if (cached) {
          setOrders(cached)
        }
      }
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleManualRefresh = () => {
    fetchOrders()
  }

  const handlePhoneSubmit = () => {
    let formattedPhone = phone.trim()
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+973' + formattedPhone
    }

    try {
      localStorage.setItem('userPhone', phone)
      localStorage.setItem('userId', formattedPhone)
      setUserId(formattedPhone)
      setShowPhoneModal(false)
    } catch (error) {
      console.error('Error saving user info:', error)
    }
  }

  const handleCancelOrder = (order) => {
    setOrderToCancel(order)
    setShowCancelModal(true)
  }

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return

    try {
      const response = await fetch(`${API_BACKEND}/orders/${orderToCancel.id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        // Refresh orders after cancellation
        fetchOrders()
        setShowCancelModal(false)
        setOrderToCancel(null)
      } else {
        console.error('Failed to cancel order')
        alert('Failed to cancel order. Please try again.')
      }
    } catch (error) {
      console.error('Error canceling order:', error)
      alert('Error canceling order. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ready': return '#4CAF50'
      case 'preparing': return '#ff9800'
      case 'pending': return '#ff9800'
      case 'completed': return '#888'
      default: return '#888'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'ready': return <CheckCircleIcon />
      case 'preparing': return <AccessTimeIcon />
      case 'pending': return <AccessTimeIcon />
      case 'completed': return <ReceiptIcon />
      default: return <ReceiptIcon />
    }
  }

  if (loading && orders.length === 0) {
    return (
      <PageContainer>
        <OrdersPageHeader
          icon={ReceiptIcon}
          title="Your Orders"
          subtitle="Track and view your order history"
          rightContent={
            <MenuButton onClick={() => setIsDrawerOpen(true)}>
              <MenuIcon />
            </MenuButton>
          }
        />

        <Content>
          <OrdersList>
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </OrdersList>
        </Content>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <OrdersPageHeader
        icon={ReceiptIcon}
        title="Your Orders"
        subtitle="Track and view your order history"
        rightContent={
          <>
            <MenuButton onClick={() => setIsDrawerOpen(true)}>
              <MenuIcon />
            </MenuButton>
            <RefreshButton 
              onClick={handleManualRefresh} 
              disabled={loading || isRefreshing}
              $isRefreshing={isRefreshing}
            >
              <RefreshIconStyled $isRefreshing={isRefreshing || loading}>
                <RefreshIcon />
              </RefreshIconStyled>
              {isRefreshing ? 'Updating...' : 'Refresh'}
            </RefreshButton>
          </>
        }
      />

      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <Content>
        {!userId ? (
          <EmptyOrders>
            <ReceiptIcon sx={{ fontSize: 64, color: '#555', mb: 2 }} />
            <EmptyTitle>No orders yet</EmptyTitle>
            <EmptySubtitle>Enter your phone number to view your orders</EmptySubtitle>
            <BackToMenuButton onClick={() => setShowPhoneModal(true)}>
              Enter Phone Number
            </BackToMenuButton>
          </EmptyOrders>
        ) : orders.length === 0 ? (
          <EmptyOrders>
            <ReceiptIcon sx={{ fontSize: 64, color: '#555', mb: 2 }} />
            <EmptyTitle>No orders yet</EmptyTitle>
            <EmptySubtitle>Your order history will appear here</EmptySubtitle>
            <BackToMenuButton onClick={() => navigate('/')}>
              Browse Menu
            </BackToMenuButton>
          </EmptyOrders>
        ) : (
          <OrdersList>
            {orders.map((order) => (
              <OrderCard key={order.id}>
                <OrderHeader>
                  <OrderInfo>
                    <OrderNumber>Order #{order.id}</OrderNumber>
                    <OrderDate>
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </OrderDate>
                  </OrderInfo>
                  <OrderStatus $color={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    {order.status || 'Pending'}
                  </OrderStatus>
                </OrderHeader>

                <OrderDetails>
                  <OrderType>
                    {order.orderType === 'delivery' ? (
                      <>
                        <LocalShippingIcon sx={{ fontSize: 18 }} />
                        Delivery
                      </>
                    ) : (
                      <>
                        <StorefrontIcon sx={{ fontSize: 18 }} />
                        Pickup
                      </>
                    )}
                  </OrderType>
                  {order.deliveryAddress && typeof order.deliveryAddress === 'object' ? (
                    <OrderLocation>
                      Block {order.deliveryAddress.block}, Road {order.deliveryAddress.road}, Building {order.deliveryAddress.building}
                    </OrderLocation>
                  ) : order.deliveryAddress && typeof order.deliveryAddress === 'string' ? (
                    <OrderLocation>{order.deliveryAddress}</OrderLocation>
                  ) : null}
                </OrderDetails>

                {/* Show order items if available */}
                {order.items && order.items.length > 0 && (
                  <OrderItems>
                    {order.items.map((item, index) => (
                      <OrderItem key={index}>
                        <ItemQuantity>{item.quantity}x</ItemQuantity>
                        <ItemDetails>
                          <ItemName>{item.name || `Item #${item.id}`}</ItemName>
                          {item.customizations && (
                            <ItemCustomizations>
                              {item.customizations.size && (
                                <CustomizationTag>{item.customizations.size}</CustomizationTag>
                              )}
                              {item.customizations.shots && (
                                <CustomizationTag>{item.customizations.shots}</CustomizationTag>
                              )}
                              {item.customizations.milk && (
                                <CustomizationTag>{item.customizations.milk}</CustomizationTag>
                              )}
                              {item.customizations.mixer && (
                                <CustomizationTag>{item.customizations.mixer}</CustomizationTag>
                              )}
                            </ItemCustomizations>
                          )}
                        </ItemDetails>
                        <ItemPrice>{item.price.toFixed(2)} BD</ItemPrice>
                      </OrderItem>
                    ))}
                  </OrderItems>
                )}

                <OrderFooter>
                  <OrderTotal>{order.total.toFixed(2)} BD</OrderTotal>
                  {(order.status === 'pending' || order.status === 'preparing') && (
                    <CancelButton onClick={() => handleCancelOrder(order)}>
                      Cancel Order
                    </CancelButton>
                  )}
                </OrderFooter>
              </OrderCard>
            ))}
          </OrdersList>
        )}
      </Content>

      <PhoneInputModal
        open={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        phone={phone}
        onChange={(e) => setPhone(e.target.value)}
        onSubmit={handlePhoneSubmit}
        title="Enter Phone Number"
        placeholder="Enter phone number (e.g., 39970100)"
        buttonText="Continue"
      />

      <ConfirmationModal
        open={showCancelModal}
        onCancel={() => {
          setShowCancelModal(false)
          setOrderToCancel(null)
        }}
        onConfirm={handleCancelConfirm}
        title="Cancel Order?"
        message={`Are you sure you want to cancel Order #${orderToCancel?.id}? This action cannot be undone.`}
        cancelText="Keep Order"
        confirmText="Cancel Order"
      />
    </PageContainer>
  )
}

export default Orders

const PageContainer = styled.div`
  background: #000;
  color: white;
  min-height: 100vh;
  padding-bottom: 20px;
  
  @media (min-width: 769px) {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px 40px;
  }
`


const MenuButton = styled.button`
  background: none;
  border: none;
  color: #ff9800;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 152, 0, 0.1);
  }
`

const Content = styled.div`
  padding: 0 16px;
`

const EmptyOrders = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`

const EmptyTitle = styled.h2`
  font-size: 24px;
  margin: 16px 0 8px 0;
  color: #fff;
`

const EmptySubtitle = styled.p`
  color: #999;
  font-size: 16px;
  margin: 0 0 24px 0;
`

const BackToMenuButton = styled.button`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 152, 0, 0.3);
  }
`

const SkeletonCard = styled.div`
  background: #111;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 20px;
  
  &::before {
    content: '';
    display: block;
    width: 60%;
    height: 24px;
    background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 12px;
  }
  
  &::after {
    content: '';
    display: block;
    width: 40%;
    height: 16px;
    background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (min-width: 769px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 24px;
  }
`

const OrderCard = styled.div`
  background: #111;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #444;
  }
  
  @media (min-width: 769px) {
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(255, 152, 0, 0.1);
      border-color: #ff9800;
    }
  }
`

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`

const OrderInfo = styled.div``

const OrderNumber = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
`

const OrderDate = styled.div`
  font-size: 14px;
  color: #888;
`

const OrderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  text-transform: capitalize;
`

const OrderDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #222;
`

const OrderType = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff9800;
  font-weight: bold;
  font-size: 14px;
  text-transform: capitalize;
`

const OrderLocation = styled.div`
  color: #ccc;
  font-size: 14px;
`

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 0;
`

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1a1a1a;
  padding: 12px;
  border-radius: 8px;
`

const ItemQuantity = styled.div`
  font-weight: bold;
  color: #ff9800;
  min-width: 30px;
`

const ItemDetails = styled.div`
  flex: 1;
`

const ItemName = styled.div`
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
`

const ItemCustomizations = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const CustomizationTag = styled.span`
  background: #333;
  color: #ff9800;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
`

const ItemPrice = styled.div`
  font-weight: bold;
  color: #ccc;
  white-space: nowrap;
`

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #222;
  gap: 12px;
`

const OrderTotal = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #ff9800;
`

const RefreshButton = styled.button`
  background: ${props => props.$isRefreshing ? '#444' : '#222'};
  color: ${props => props.$isRefreshing ? '#ff9800' : '#fff'};
  border: 1px solid #555;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover:not(:disabled) {
    background: #333;
    border-color: #ff9800;
    color: #ff9800;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.$isRefreshing && `
    animation: pulse 1.5s infinite;
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `}
`

const RefreshIconStyled = styled.span`
  color: #ff9800;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  
  ${props => props.$isRefreshing && `
    animation: rotate 1s linear infinite;
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}
`


const CancelButton = styled.button`
  background: transparent;
  color: #d32f2f;
  border: 1px solid #d32f2f;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #d32f2f;
    color: white;
  }
`
