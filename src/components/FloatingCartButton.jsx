import React from 'react'
import styled from 'styled-components'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

function FloatingCartButton({ 
  show = true,
  itemCount = 0,
  totalPrice = 0,
  currency = 'BD',
  label = 'Checkout',
  onClick,
  position = { bottom: 20, right: 20 },
  animate = true
}) {
  if (!show || itemCount === 0) return null

  return (
    <Container $position={position}>
      <Button 
        onClick={onClick}
        className={animate ? 'pulse-animation' : ''}
      >
        <Content>
          <IconWrapper>
            <ShoppingCartIcon />
            {itemCount > 0 && (
              <Badge>{itemCount}</Badge>
            )}
          </IconWrapper>
          <TextWrapper>
            <Label>{label}</Label>
            <Price>{totalPrice.toFixed(2)}{currency}</Price>
          </TextWrapper>
        </Content>
      </Button>
    </Container>
  )
}

export default FloatingCartButton

const Container = styled.div`
  position: fixed;
  bottom: ${({ $position }) => $position.bottom}px;
  right: ${({ $position }) => $position.right}px;
  z-index: 1000;

  .pulse-animation {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
    }
  }
`

const Button = styled.button`
  position: fixed;
  bottom: calc(20px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%) ${props => props.$show ? 'translateY(0)' : 'translateY(150%)'};
  z-index: 1000;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(255, 152, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
  justify-content: space-between;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(255, 152, 0, 0.4);
    background: linear-gradient(135deg, #ffb74d 0%, #ff9800 100%);
  }

  &:active {
    transform: translateY(0);
  }
`

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
`

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  svg {
    font-size: 24px;
  }
`

const Badge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #d32f2f;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const Label = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
`

const Price = styled.span`
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  margin-top: 2px;
`
