import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CoffeeIcon from '@mui/icons-material/LocalCafe'

function DrawerMenu({ isOpen, onClose }) {
  const navigate = useNavigate()

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <DrawerContainer $isOpen={isOpen}>
        <DrawerHeader>
          <Logo>
            <CoffeeIcon sx={{ fontSize: 28 }} />
            <span>The Usual</span>
          </Logo>
        </DrawerHeader>

        <MenuItems>
          <MenuItem onClick={() => handleNavigation('/')}>
            <HomeIcon />
            <span>Home</span>
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/orders')}>
            <ReceiptIcon />
            <span>Orders</span>
          </MenuItem>
        </MenuItems>
      </DrawerContainer>
    </>
  )
}

export default DrawerMenu

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1998;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  transform: translate3d(0, 0, 0);
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
`

const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
  transform: ${({ $isOpen }) => $isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)'};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1999;
  display: flex;
  flex-direction: column;
  will-change: transform;
  backface-visibility: hidden;
  
  @media (min-width: 769px) {
    max-width: 400px;
  }
`

const DrawerHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #333;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ff9800;
  font-size: 20px;
  font-weight: bold;
`

const MenuItems = styled.div`
  padding: 20px 0;
`

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;

  &:hover {
    background: rgba(255, 152, 0, 0.1);
    border-left-color: #ff9800;
    padding-left: 32px;
  }

  svg {
    font-size: 24px;
    color: #ff9800;
  }
  
  @media (min-width: 769px) {
    padding: 18px 28px;
    font-size: 18px;
    
    svg {
      font-size: 28px;
    }
  }
`
