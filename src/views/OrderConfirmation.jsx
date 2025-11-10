import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StorefrontIcon from '@mui/icons-material/Storefront'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ReceiptIcon from '@mui/icons-material/Receipt'

function OrderConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { total, paymentMethod, orderNumber } = location.state || {}
  
  const [estimatedTime, setEstimatedTime] = useState(new Date())

  useEffect(() => {
    // Set estimated pickup time (20 minutes from now)
    const estimated = new Date()
    estimated.setMinutes(estimated.getMinutes() + 20)
    setEstimatedTime(estimated)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <SuccessIcon>
          <CheckCircleIcon sx={{ fontSize: 80, color: '#4CAF50' }} />
        </SuccessIcon>

        <Title>Order Confirmed!</Title>
        <Subtitle>Your pickup order has been successfully placed</Subtitle>

        <OrderNumberCard>
          <OrderNumberLabel>Order Number</OrderNumberLabel>
          <OrderNumber>#{orderNumber || Math.floor(Math.random() * 10000)}</OrderNumber>
          <OrderNote>Please show this number when picking up your order</OrderNote>
        </OrderNumberCard>

        <InfoSection>
          <InfoCard>
            <InfoHeader>
              <StorefrontIcon sx={{ color: '#ff9800' }} />
              <InfoTitle>Pickup Location</InfoTitle>
            </InfoHeader>
            <InfoContent>
              <LocationName>The Usual Coffee Shop</LocationName>
              <LocationAddress>Manama, Bahrain</LocationAddress>
              <LocationAddress>Building 123, Road 456</LocationAddress>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoHeader>
              <AccessTimeIcon sx={{ color: '#ff9800' }} />
              <InfoTitle>Pickup Time</InfoTitle>
            </InfoHeader>
            <InfoContent>
              <PickupTime>Ready by {formatTime(estimatedTime)}</PickupTime>
              <PickupNote>Estimated 15-20 minutes</PickupNote>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoHeader>
              <ReceiptIcon sx={{ color: '#ff9800' }} />
              <InfoTitle>Payment</InfoTitle>
            </InfoHeader>
            <InfoContent>
              <PaymentAmount>{total?.toFixed(2) || '0.00'} BD</PaymentAmount>
              <PaymentMethodText>
                {paymentMethod === 'cash' ? 'Pay at store' : 'Card payment processed'}
              </PaymentMethodText>
            </InfoContent>
          </InfoCard>
        </InfoSection>
        <ButtonContainer>
          <BackToMenuButton onClick={() => navigate('/')}>
            Back to Menu
          </BackToMenuButton>
        </ButtonContainer>
      </ContentWrapper>
    </PageContainer>
  )
}

export default OrderConfirmation

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.8);
  }
`

const PageContainer = styled.div`
  font-family: "Rubik", sans-serif;
  background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: white;
`;

const ContentWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  animation: ${fadeInUp} 0.6s ease;
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 10px;
  }
`

const SuccessIcon = styled.div`
  text-align: center;
  margin-bottom: 20px;
  animation: ${pulseGlow} 2s infinite;
`

const Title = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #4CAF50;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`

const Subtitle = styled.p`
  text-align: center;
  font-size: 16px;
  color: #ccc;
  margin: 0 0 30px 0;
`

const OrderNumberCard = styled.div`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(255, 152, 0, 0.3);
`

const OrderNumberLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  opacity: 0.9;
`

const OrderNumber = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`

const OrderNote = styled.div`
  font-size: 12px;
  opacity: 0.8;
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

const InfoCard = styled.div`
  background: #111;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 16px;
`

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`

const InfoTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: white;
`

const InfoContent = styled.div`
  margin-left: 36px;
`

const LocationName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
`

const LocationAddress = styled.div`
  font-size: 14px;
  color: #ccc;
  margin-bottom: 2px;
`

const PickupTime = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 4px;
`

const PickupNote = styled.div`
  font-size: 14px;
  color: #ccc;
`

const PaymentAmount = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #ff9800;
  margin-bottom: 4px;
`

const PaymentMethodText = styled.div`
  font-size: 14px;
  color: #ccc;
`

const InstructionsCard = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`

const InstructionsTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: #ff9800;
`

const InstructionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Instruction = styled.div`
  font-size: 14px;
  color: #ccc;
  line-height: 1.4;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`

const BackToMenuButton = styled.button`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 152, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`

const FooterText = styled.div`
  text-align: center;
  font-size: 14px;
  color: #888;
`
