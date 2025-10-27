import React, { useState } from 'react';
import styled from 'styled-components';
import AddressModal from '../components/AddressModal'
import EditIcon from '@mui/icons-material/Edit'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY' // Replace with your API key

const PageContainer = styled.div`
  background: #000;
  min-height: 100vh;
  color: white;
  
  @media (min-width: 769px) {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 20px;
  }
`

const ContentWrapper = styled.div`
  @media (min-width: 769px) {
    width: 100%;
    max-width: 800px;
  }
`

const CartItemsContainer = styled.div`
  margin: 20px 15px;
  
  @media (min-width: 769px) {
    margin: 30px;
  }
`

const CheckoutCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  
  @media (min-width: 769px) {
    padding: 30px;
    margin: 30px;
  }
`

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #333;
  
  @media (min-width: 769px) {
    padding: 30px;
    text-align: center;
  }
`

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #ff9800;
  
  @media (min-width: 769px) {
    font-size: 36px;
  }
`

const DeliverySection = styled.div`
  margin: 20px;
`

const SelectAddressButton = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
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
    background: linear-gradient(135deg, #333 0%, #222 100%);
    border-color: #ffb74d;
  }
  
  svg {
    font-size: 24px;
  }
`

const AddressCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #333;
`

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const AddressTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff9800;
  font-weight: bold;
  font-size: 18px;
  
  svg {
    font-size: 24px;
  }
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

const AddressDetails = styled.div`
  color: white;
  margin-bottom: 16px;
`

const AddressLine = styled.div`
  font-size: 16px;
  margin-bottom: 4px;
`

const AddressInstructions = styled.div`
  font-size: 14px;
  color: #aaa;
  font-style: italic;
  margin-top: 8px;
`

const MiniMap = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 12px;
`

const CheckoutPage = () => {
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [savedAddress, setSavedAddress] = useState(() => {
    const saved = localStorage.getItem('deliveryAddress')
    return saved ? JSON.parse(saved) : null
  })

  const handleSaveAddress = (address) => {
    setSavedAddress(address)
    localStorage.setItem('deliveryAddress', JSON.stringify(address))
    setShowAddressModal(false)
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>Checkout</Title>
        </Header>
        <CartItemsContainer>
          {/* Cart items will be mapped here */}
        </CartItemsContainer>
        <CheckoutCard>
          {/* Checkout form and summary will go here */}
        </CheckoutCard>

        {orderType === 'delivery' && (
          <DeliverySection>
            {savedAddress ? (
              <AddressCard>
                <AddressHeader>
                  <AddressTitle>
                    <LocationOnIcon />
                    Delivery Address
                  </AddressTitle>
                  <EditButton onClick={() => setShowAddressModal(true)}>
                    <EditIcon />
                    Edit
                  </EditButton>
                </AddressHeader>
                
                <AddressDetails>
                  <AddressLine>Block {savedAddress.block}, {savedAddress.road}</AddressLine>
                  <AddressLine>{savedAddress.building}</AddressLine>
                  {savedAddress.apartment && <AddressLine>{savedAddress.apartment}</AddressLine>}
                  {savedAddress.instructions && (
                    <AddressInstructions>{savedAddress.instructions}</AddressInstructions>
                  )}
                </AddressDetails>

                <MiniMap>
                  <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '150px', borderRadius: '8px' }}
                      center={savedAddress.position}
                      zoom={15}
                      options={{ disableDefaultUI: true }}
                    >
                      <Marker position={savedAddress.position} />
                    </GoogleMap>
                  </LoadScript>
                </MiniMap>
              </AddressCard>
            ) : (
              <SelectAddressButton onClick={() => setShowAddressModal(true)}>
                <LocationOnIcon />
                Select Delivery Address
              </SelectAddressButton>
            )}
          </DeliverySection>
        )}

        <AddressModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSave={handleSaveAddress}
          initialAddress={savedAddress}
        />
      </ContentWrapper>
    </PageContainer>
  );
}

export default CheckoutPage;