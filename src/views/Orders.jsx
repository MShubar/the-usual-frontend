import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import StorefrontIcon from '@mui/icons-material/Storefront'

function Orders() {
  const navigate = useNavigate()
  
  // Sample order data - in real app this would come from API
  const [orders] = useState([
    {
      id: '#8372',
      date: 'Today, 2:30 PM',
      status: 'Ready for Pickup',
      type: 'pickup',
      total: 12.50,
      items: ['Spanish Latte', 'Croissant'],
      location: 'The Usual Coffee Shop'
    },
    {
      id: '#8371',
      date: 'Yesterday, 10:15 AM',
      status: 'Completed',
      type: 'delivery',
      total: 8.75,
      items: ['Americano', 'Muffin'],
      location: 'Building 123, Road 456'
    },
    {
      id: '#8370',
      date: 'Oct 18, 4:20 PM',
      status: 'Completed',
      type: 'pickup',
      total: 15.20,
      items: ['Cappuccino', 'Sandwich', 'Cookie'],
      location: 'The Usual Coffee Shop'
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready for Pickup': return '#4CAF50'
      case 'In Progress': return '#ff9800'
      case 'Completed': return '#888'
      default: return '#888'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ready for Pickup': return <CheckCircleIcon />
      case 'In Progress': return <AccessTimeIcon />
      case 'Completed': return <ReceiptIcon />
      default: return <ReceiptIcon />
    }
  }

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)}>
        ← Back
      </BackButton>
      
      <Header>
        <HeaderContent>
          <ReceiptIcon sx={{ fontSize: 32, color: '#ff9800' }} />
          <HeaderText>
            <Title>Your Orders</Title>
            <Subtitle>Track and view your order history</Subtitle>
          </HeaderText>
        </HeaderContent>
      </Header>

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
                    <OrderNumber>{order.id}</OrderNumber>
                    <OrderDate>{order.date}</OrderDate>
                  </OrderInfo>
                  <OrderStatus $color={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </OrderStatus>
                </OrderHeader>

                <OrderDetails>
                  <OrderType>
                    {order.type === 'delivery' ? (
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
                  <OrderLocation>{order.location}</OrderLocation>
                </OrderDetails>

                <OrderItems>
                  <ItemsLabel>Items:</ItemsLabel>
                  <ItemsList>
                    {order.items.map((item, index) => (
                      <OrderItem key={index}>{item}</OrderItem>
                    ))}
                  </ItemsList>
                </OrderItems>

                <OrderFooter>
                  <OrderTotal>{order.total.toFixed(2)} BD</OrderTotal>
                  <OrderActions>
                    {order.status === 'Ready for Pickup' && (
                      <ActionButton $primary>
                        View Details
                      </ActionButton>
                    )}
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
`

const BackButton = styled.button`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`

const Header = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 16px;
  margin-bottom: 16px;
  padding-top: 60px;
  
  @media (max-width: 768px) {
    padding: 12px;
    padding-top: 60px;
    margin-bottom: 12px;
  }
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const HeaderText = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
`

const Subtitle = styled.div`
  color: #ccc;
  font-size: 14px;
  margin-top: 4px;
`

const Content = styled.div`
  padding: 0 16px;
  
  @media (max-width: 768px) {
    padding: 0 12px;
  }
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
`

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
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
  
  svg {
    font-size: 16px;
  }
`

const OrderDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`

const OrderType = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff9800;
  font-weight: bold;
  font-size: 14px;
`

const OrderLocation = styled.div`
  color: #ccc;
  font-size: 14px;
`

const OrderItems = styled.div`
  margin-bottom: 16px;
`

const ItemsLabel = styled.div`
  color: #888;
  font-size: 14px;
  margin-bottom: 8px;
`

const ItemsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const OrderItem = styled.div`
  background: #222;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
`

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
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
  background: ${props => props.$primary ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' : 'transparent'};
  color: ${props => props.$primary ? 'white' : '#ccc'};
  border: 1px solid ${props => props.$primary ? 'transparent' : '#444'};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    ${props => props.$primary ? 
      'transform: translateY(-1px); box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);' :
      'border-color: #ff9800; color: #ff9800;'
    }
  }
`
