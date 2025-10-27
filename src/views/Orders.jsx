import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import StorefrontIcon from '@mui/icons-material/Storefront'
import MenuIcon from '@mui/icons-material/Menu'
import DrawerMenu from '../components/DrawerMenu'
import { API_BACKEND } from './API'
import { cacheManager } from '../utils/cache'

function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)

    // Check cache first
    const cached = cacheManager.get('orders')
    if (cached) {
      console.log('Using cached orders')
      setOrders(cached)
      setLoading(false)
      return
    }

    // Fetch from API
    const startTime = performance.now()
    try {
      const response = await fetch(`${API_BACKEND}/orders`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      const duration = performance.now() - startTime
      console.log(`Orders API took ${duration.toFixed(2)}ms`)
      
      cacheManager.set('orders', data)
      setOrders(data)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return '#4CAF50'
      case 'preparing': return '#ff9800'
      case 'completed': return '#888'
      default: return '#888'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return <CheckCircleIcon />
      case 'preparing': return <AccessTimeIcon />
      case 'completed': return <ReceiptIcon />
      default: return <ReceiptIcon />
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingText>Loading orders...</LoadingText>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Header>
        <MenuButton onClick={() => setIsDrawerOpen(true)}>
          <MenuIcon />
        </MenuButton>
        <HeaderContent>
          <ReceiptIcon sx={{ fontSize: 32, color: '#ff9800' }} />
          <HeaderText>
            <Title>Your Orders</Title>
            <Subtitle>Track and view your order history</Subtitle>
          </HeaderText>
        </HeaderContent>
      </Header>

      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <Content>
        {orders.length === 0 ? (
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
                    <OrderNumber>#{order.orderNumber}</OrderNumber>
                    <OrderDate>{new Date(order.createdAt).toLocaleString()}</OrderDate>
                  </OrderInfo>
                  <OrderStatus $color={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    {order.status}
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
                  {order.deliveryAddress && (
                    <OrderLocation>{order.deliveryAddress}</OrderLocation>
                  )}
                </OrderDetails>

                <OrderFooter>
                  <OrderTotal>{order.total.toFixed(2)} BD</OrderTotal>
                  <OrderActions>
                    <ActionButton onClick={() => navigate('/')}>
                      Reorder
                    </ActionButton>
                  </OrderActions>
                </OrderFooter>
              </OrderCard>
            ))}
          </OrdersList>
        )}
      </Content>
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

const LoadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 18px;
  color: #ccc;
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

const Header = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 16px;
  margin-bottom: 16px;
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`

const HeaderText = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  color: white;
`

const Subtitle = styled.div`
  color: #ccc;
  font-size: 14px;
  margin-top: 4px;
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

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const OrderTotal = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #ff9800;
`

const OrderActions = styled.div`
  display: flex;
  gap: 8px;
`

const ActionButton = styled.button`
  background: transparent;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #ff9800;
    color: #ff9800;
  }
`
