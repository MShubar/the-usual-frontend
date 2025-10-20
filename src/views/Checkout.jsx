// src/views/Checkout.js
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Buttons from '../components/Buttons'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining'
import StorefrontIcon from '@mui/icons-material/Storefront'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import { useNavigate } from 'react-router-dom'

function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [orderType, setOrderType] = useState('delivery') // 'delivery' or 'pickup'
  const navigate = useNavigate()

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      setCartItems(savedCart ? JSON.parse(savedCart) : [])
    } catch (error) {
      setCartItems([])
    }
  }, [])

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
    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
      setCartItems([])
      localStorage.removeItem('cart')
    }
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const delivery = orderType === 'delivery' ? 0.40 : 0
  const total = subtotal + delivery

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)}>
        ← Back
      </BackButton>
      
      <Header>
        <HeaderContent>
          <ShoppingCartIcon sx={{ fontSize: 32, color: '#ff9800' }} />
          <HeaderText>
            <Title>Your Order</Title>
            <Location>
              <LocationOnIcon sx={{ fontSize: 16 }} />
              {orderType === 'delivery' ? 'Delivery to Bahrain, Manama' : 'Pickup from Store'}
            </Location>
          </HeaderText>
        </HeaderContent>
      </Header>

      {cartItems.length === 0 ? (
        <EmptyCart>
          <ShoppingCartIcon sx={{ fontSize: 64, color: '#555', mb: 2 }} />
          <EmptyTitle>Your cart is empty</EmptyTitle>
          <EmptySubtitle>Add some delicious items to get started!</EmptySubtitle>
        </EmptyCart>
      ) : (
        <Content>
          {/* Order Type Selection */}
          <OrderTypeSection>
            <SectionTitle>Order Type</SectionTitle>
            <OrderTypeButtons>
              <OrderTypeButton 
                $active={orderType === 'delivery'}
                onClick={() => setOrderType('delivery')}
              >
                <DeliveryDiningIcon />
                <OrderTypeText>
                  <span>Delivery</span>
                  <small>0.400 BD fee</small>
                </OrderTypeText>
              </OrderTypeButton>
              <OrderTypeButton 
                $active={orderType === 'pickup'}
                onClick={() => setOrderType('pickup')}
              >
                <StorefrontIcon />
                <OrderTypeText>
                  <span>Pickup</span>
                  <small>Free</small>
                </OrderTypeText>
              </OrderTypeButton>
            </OrderTypeButtons>
          </OrderTypeSection>

          <CartSection>
            <CartHeader>
              <SectionTitle>Order Items</SectionTitle>
              <ClearAllButton onClick={clearCart}>
                <ClearAllIcon />
                Clear All
              </ClearAllButton>
            </CartHeader>
            <CartList>
              {cartItems.map((item, index) => (
                <CartItem key={`${item.id}-${index}`}>
                  <ItemImage src={item.image} alt={item.name} />
                  <ItemDetails>
                    <ItemName>{item.name}</ItemName>
                    <ItemCustomizations>
                      {item.size && <Customization>Size: {item.size}</Customization>}
                      {item.milk && <Customization>Milk: {item.milk}</Customization>}
                      {item.shots && <Customization>Shots: {item.shots}</Customization>}
                      {item.mixer && <Customization>Mixer: {item.mixer}</Customization>}
                    </ItemCustomizations>
                    <ItemPrice>{item.price.toFixed(2)}BD each</ItemPrice>
                  </ItemDetails>
                  <QuantityControls>
                    <QuantityButton
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </QuantityButton>
                    <QuantityDisplay>{item.quantity}</QuantityDisplay>
                    <QuantityButton
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </QuantityButton>
                  </QuantityControls>
                  <ItemTotal>{(item.price * item.quantity).toFixed(2)}BD</ItemTotal>
                  <DeleteButton onClick={() => removeItem(item.id)}>
                    <DeleteIcon />
                  </DeleteButton>
                </CartItem>
              ))}
            </CartList>
          </CartSection>

          <OrderSummary>
            <SectionTitle>Order Summary</SectionTitle>
            <SummaryRow>
              <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
              <span>{subtotal.toFixed(2)}BD</span>
            </SummaryRow>
            <SummaryRow>
              <span>{orderType === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}</span>
              <span>{delivery.toFixed(2)}BD</span>
            </SummaryRow>
            <Divider />
            <TotalRow>
              <span>Total</span>
              <span>{total.toFixed(2)}BD</span>
            </TotalRow>
            
            <PlaceOrderButton
              onClick={() => {
                if (orderType === 'pickup') {
                  // For pickup orders, go directly to confirmation
                  const orderNumber = Math.floor(Math.random() * 10000)
                  localStorage.removeItem('cart')
                  navigate('/order-confirmation', {
                    state: {
                      orderType,
                      cartItems,
                      total,
                      paymentMethod: 'cash', // Default for pickup
                      orderNumber
                    }
                  })
                } else {
                  // For delivery orders, go to order details
                  navigate('/order-details', {
                    state: {
                      orderType,
                      cartItems,
                      total
                    }
                  })
                }
              }}
            >
              {orderType === 'delivery' ? 'Continue to Order Details' : 'Place Pickup Order'}
            </PlaceOrderButton>
          </OrderSummary>
        </Content>
      )}
    </PageContainer>
  )
}

export default Checkout

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
  margin-top: 8px;
  
  @media (max-width: 768px) {
    gap: 8px;
    margin-top: 4px;
  }
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

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ccc;
  font-size: 14px;
  margin-top: 4px;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`

const EmptyTitle = styled.h2`
  font-size: 24px;
  margin: 16px 0 8px 0;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const EmptySubtitle = styled.p`
  color: #999;
  font-size: 16px;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
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

const OrderTypeSection = styled.div`
  background: #111;
  border-radius: 16px;
  padding: 16px;
  
  @media (max-width: 768px) {
    border-radius: 12px;
    padding: 12px;
  }
`

const OrderTypeButtons = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`

const OrderTypeButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ $active }) => ($active ? '#ff9800' : '#222')};
  color: ${({ $active }) => ($active ? '#000' : '#fff')};
  border: 2px solid ${({ $active }) => ($active ? '#ff9800' : '#333')};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #ff9800;
    background: ${({ $active }) => ($active ? '#ff9800' : '#333')};
  }
  
  svg {
    font-size: 24px;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    
    svg {
      font-size: 20px;
    }
  }
`

const OrderTypeText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  span {
    font-weight: bold;
    font-size: 16px;
  }
  
  small {
    font-size: 12px;
    opacity: 0.8;
    margin-top: 2px;
  }
  
  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    
    span {
      font-size: 14px;
    }
    
    small {
      font-size: 11px;
    }
  }
`

const CartSection = styled.div`
  background: #111;
  border-radius: 16px;
  padding: 16px;
  
  @media (max-width: 768px) {
    border-radius: 12px;
    padding: 12px;
  }
`

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`

const ClearAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #333;
  color: #ff9800;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover {
    background: #444;
    border-color: #ff9800;
  }
  
  svg {
    font-size: 18px;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 10px;
    gap: 6px;
    
    svg {
      font-size: 16px;
    }
  }
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: #ff9800;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin: 0 0 12px 0;
  }
`

const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1a1a1a;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #333;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 10px;
  }
`

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 120px;
    max-width: 200px;
    align-self: center;
  }
`

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

const ItemName = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 4px 0;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 14px;
    text-align: center;
  }
`

const ItemCustomizations = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 4px 0;
  
  @media (max-width: 768px) {
    justify-content: center;
    gap: 4px;
  }
`

const Customization = styled.span`
  background: #333;
  color: #ff9800;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  
  @media (max-width: 768px) {
    font-size: 10px;
    padding: 1px 4px;
  }
`

const ItemPrice = styled.div`
  color: #999;
  font-size: 14px;
  margin-top: 4px;
  
  @media (max-width: 768px) {
    text-align: center;
    font-size: 12px;
  }
`

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #222;
  border-radius: 8px;
  padding: 4px;
  
  @media (max-width: 768px) {
    align-self: center;
    margin: 8px 0;
  }
`

const QuantityButton = styled.button`
  background: #333;
  color: white;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;

  &:hover:not(:disabled) {
    background: #ff9800;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const QuantityDisplay = styled.span`
  font-weight: bold;
  min-width: 24px;
  text-align: center;
`

const ItemTotal = styled.div`
  font-weight: bold;
  color: #ff9800;
  font-size: 16px;
  min-width: 60px;
  text-align: right;
  
  @media (max-width: 768px) {
    align-self: center;
    font-size: 14px;
    min-width: auto;
  }
`

const DeleteButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #c0392b;
  }
  
  @media (max-width: 768px) {
    align-self: center;
    width: 32px;
    height: 32px;
  }
`

const OrderSummary = styled.div`
  background: #111;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #333;
  
  @media (max-width: 768px) {
    border-radius: 12px;
    padding: 12px;
  }
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  color: #ccc;
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 4px 0;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #333;
  margin: 12px 0;
`

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 20px;
  font-weight: bold;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 18px;
    padding: 10px 0;
  }
`

const PlaceOrderButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 152, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    font-size: 16px;
    margin-top: 12px;
  }
`
