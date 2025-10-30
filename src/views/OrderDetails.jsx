import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PaymentIcon from '@mui/icons-material/Payment'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import EditIcon from '@mui/icons-material/Edit'
import AddressModal from '../components/AddressModal'
import PhoneInputModal from '../components/PhoneInputModal'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import BackButton from '../components/BackButton'
import { API_BACKEND } from './API'

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function OrderDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const { orderType = 'delivery', cartItems = [], total = 0 } = location.state || {}
  
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [phone, setPhone] = useState(() => {
    try {
      return localStorage.getItem('userPhone') || ''
    } catch {
      return ''
    }
  })
  const [savedAddress, setSavedAddress] = useState(() => {
    const saved = localStorage.getItem('deliveryAddress')
    return saved ? JSON.parse(saved) : null
  })
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const handleSaveAddress = (address) => {
    setSavedAddress(address)
    localStorage.setItem('deliveryAddress', JSON.stringify(address))
    setShowAddressModal(false)
  }

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCardIcon },
    { id: 'cash', name: 'Cash on Delivery', icon: LocalAtmIcon }
  ]

  const handlePlaceOrder = () => {
    if (orderType === 'delivery' && !savedAddress) {
      alert('Please select a delivery address')
      return
    }
    
    // Show phone modal if no phone number is saved
    if (!phone) {
      setShowPhoneModal(true)
      return
    }
    
    proceedWithOrder()
  }

  const handlePhoneSubmit = () => {
    let formattedPhone = phone.trim()
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+973' + formattedPhone
    }

    try {
      localStorage.setItem('userPhone', phone)
      localStorage.setItem('userId', formattedPhone)
    } catch (error) {
      console.error('Error saving user info:', error)
    }

    setShowPhoneModal(false)
    proceedWithOrder()
  }

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
        throw new Error(result.message || `HTTP error! status: ${response.status}`)
      }

      return result
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  const proceedWithOrder = async () => {
    setIsPlacingOrder(true)
    
    try {
      let formattedPhone = phone.trim()
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+973' + formattedPhone
      }

      const orderData = {
        orderType: orderType,
        total: total,
        paymentMethod: paymentMethod,
        deliveryAddress: orderType === 'delivery' ? savedAddress : null,
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
      
      localStorage.removeItem('cart')
      navigate('/order-confirmation', {
        state: {
          orderType,
          total,
          paymentMethod,
          orderNumber: orderResponse.orderNumber || orderResponse.id || 'PENDING',
          address: savedAddress,
          success: true
        }
      })
    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Failed to place order. Please try again.')
      
      // Fallback: still navigate with local order number
      const fallbackOrderNumber = `LOCAL-${Date.now()}`
      localStorage.removeItem('cart')
      navigate('/order-confirmation', {
        state: {
          orderType,
          total,
          paymentMethod,
          orderNumber: fallbackOrderNumber,
          address: savedAddress,
          error: error.message || 'Order placed locally - backend unavailable'
        }
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <PageContainer>
      <BackButton 
        show={!showAddressModal && !showPhoneModal} 
        onClick={() => navigate(-1)} 
      />

      <Header>
        <HeaderContent>
          <ShoppingCartIcon sx={{ fontSize: 32, color: '#ff9800' }} />
          <HeaderText>
            <Title>Order Details</Title>
            <Subtitle>{orderType === 'delivery' ? 'Delivery Order' : 'Pickup Order'}</Subtitle>
          </HeaderText>
        </HeaderContent>
      </Header>

      <Content>
        {/* Delivery/Pickup Location Section */}
        <Section>
          <SectionHeader>
            <LocationOnIcon sx={{ color: '#ff9800' }} />
            <SectionTitle>
              {orderType === 'delivery' ? 'Delivery Location' : 'Pickup Location'}
            </SectionTitle>
          </SectionHeader>
          
          {orderType === 'delivery' ? (
            <LocationCard>
              {savedAddress ? (
                <>
                  <AddressHeader>
                    <LocationText>
                      <strong>Delivery Address:</strong>
                      <AddressLine>Block {savedAddress.block}, {savedAddress.road}</AddressLine>
                      <AddressLine>{savedAddress.building}</AddressLine>
                      {savedAddress.apartment && <AddressLine>{savedAddress.apartment}</AddressLine>}
                      {savedAddress.instructions && (
                        <AddressInstructions>{savedAddress.instructions}</AddressInstructions>
                      )}
                    </LocationText>
                    <EditButton onClick={() => setShowAddressModal(true)}>
                      <EditIcon />
                      Edit
                    </EditButton>
                  </AddressHeader>
                  
                  {savedAddress.position && (
                    <MiniMapContainer>
                      <MapContainer 
                        center={savedAddress.position} 
                        zoom={15} 
                        dragging={false}
                        zoomControl={false}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; OpenStreetMap contributors'
                        />
                        <Marker position={savedAddress.position} />
                      </MapContainer>
                    </MiniMapContainer>
                  )}
                </>
              ) : (
                <SelectAddressButton onClick={() => setShowAddressModal(true)}>
                  <LocationOnIcon />
                  Select Delivery Address
                </SelectAddressButton>
              )}
            </LocationCard>
          ) : (
            <LocationCard>
              <LocationText>
                <strong>Pickup Location:</strong>
                <p>The Usual Coffee Shop<br/>
                Manama, Bahrain<br/>
                Building 123, Road 456</p>
              </LocationText>
            </LocationCard>
          )}
        </Section>

        {/* Payment Method Section */}
        <Section>
          <SectionHeader>
            <PaymentIcon sx={{ color: '#ff9800' }} />
            <SectionTitle>Payment Method</SectionTitle>
          </SectionHeader>
          
          <PaymentMethods>
            {paymentMethods.map((method) => (
              <PaymentOption
                key={method.id}
                $active={paymentMethod === method.id}
                onClick={() => setPaymentMethod(method.id)}
              >
                <method.icon />
                <PaymentOptionText>
                  <span>{method.name}</span>
                  {method.id === 'cash' && orderType === 'pickup' && (
                    <small>Pay at store</small>
                  )}
                </PaymentOptionText>
              </PaymentOption>
            ))}
          </PaymentMethods>
        </Section>

        {/* Order Summary Section */}
        <Section>
          <SectionHeader>
            <ShoppingCartIcon sx={{ color: '#ff9800' }} />
            <SectionTitle>Order Summary</SectionTitle>
          </SectionHeader>
          
          <OrderSummary>
            <OrderItems>
              {cartItems.map((item, index) => (
                <OrderItem key={`${item.id}-${index}`}>
                  <ItemImage src={item.image} alt={item.name} />
                  <ItemInfo>
                    <ItemName>{item.name}</ItemName>
                    <ItemDetails>
                      Qty: {item.quantity} × {item.price.toFixed(2)}BD
                    </ItemDetails>
                  </ItemInfo>
                  <ItemTotal>{(item.price * item.quantity).toFixed(2)}BD</ItemTotal>
                </OrderItem>
              ))}
            </OrderItems>
            
            <TotalSection>
              <TotalRow>
                <span>Total Amount:</span>
                <span>{total.toFixed(2)}BD</span>
              </TotalRow>
            </TotalSection>
          </OrderSummary>
        </Section>

        {/* Place Order Button */}
        <PlaceOrderButton onClick={handlePlaceOrder} disabled={isPlacingOrder}>
          {isPlacingOrder ? 'Placing Order...' : `Place Order • ${total.toFixed(2)}BD`}
        </PlaceOrderButton>
      </Content>

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleSaveAddress}
        initialAddress={savedAddress}
      />

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
    </PageContainer>
  )
}

export default OrderDetails

const PageContainer = styled.div`
  background: #000;
  color: white;
  min-height: 100vh;
  padding-bottom: 20px;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    padding: 0 12px;
    gap: 16px;
  }
`

const Section = styled.div`
  background: #111;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #333;
  
  @media (max-width: 768px) {
    border-radius: 12px;
    padding: 16px;
  }
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const LocationCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const LocationText = styled.div`
  color: #ccc;
  
  strong {
    color: white;
    display: block;
    margin-bottom: 8px;
  }
`

const AddressInput = styled.input`
  width: 100%;
  background: #222;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 14px;
  margin-top: 8px;
  
  &:focus {
    outline: none;
    border-color: #ff9800;
  }
  
  &::placeholder {
    color: #888;
  }
`

const MapPlaceholder = styled.div`
  background: #222;
  border: 2px dashed #444;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: #ff9800;
  }
`

const MapText = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
`

const MapSubtext = styled.div`
  color: #888;
  font-size: 14px;
`

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PaymentOption = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  background: ${({ $active }) => ($active ? '#ff9800' : '#222')};
  color: ${({ $active }) => ($active ? '#000' : '#fff')};
  border: 2px solid ${({ $active }) => ($active ? '#ff9800' : '#333')};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  
  &:hover {
    border-color: #ff9800;
    background: ${({ $active }) => ($active ? '#ff9800' : '#333')};
  }
  
  svg {
    font-size: 24px;
  }
`

const PaymentOptionText = styled.div`
  display: flex;
  flex-direction: column;
  
  span {
    font-weight: bold;
    font-size: 16px;
  }
  
  small {
    font-size: 12px;
    opacity: 0.8;
    margin-top: 2px;
  }
`

const OrderSummary = styled.div``

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1a1a1a;
  padding: 12px;
  border-radius: 8px;
`

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
`

const ItemInfo = styled.div`
  flex: 1;
`

const ItemName = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`

const ItemDetails = styled.div`
  color: #999;
  font-size: 14px;
`

const ItemTotal = styled.div`
  font-weight: bold;
  color: #ff9800;
`

const TotalSection = styled.div`
  border-top: 1px solid #333;
  padding-top: 16px;
`

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
`

const PlaceOrderButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 18px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 152, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    font-size: 16px;
  }
`

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`

const AddressLine = styled.div`
  color: #ccc;
  margin-bottom: 4px;
`

const AddressInstructions = styled.div`
  color: #888;
  font-style: italic;
  margin-top: 8px;
`

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid #555;
  border-radius: 8px;
  color: #ccc;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #ff9800;
    color: #ff9800;
  }
  
  svg {
    font-size: 18px;
  }
`

const SelectAddressButton = styled.button`
  width: 100%;
  padding: 40px;
  background: #222;
  border: 2px dashed #ff9800;
  border-radius: 12px;
  color: #ff9800;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #333;
    border-color: #ffb74d;
  }
  
  svg {
    font-size: 24px;
  }
`

const MiniMapContainer = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: #2a2a2a;
  
  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`
