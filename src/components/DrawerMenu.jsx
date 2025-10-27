import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CloseIcon from '@mui/icons-material/Close'
import CoffeeIcon from '@mui/icons-material/LocalCafe'

function DrawerMenu({ isOpen, onClose }) {
  const navigate = useNavigate()

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
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
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
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`

const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
  width: 80%;
  max-width: 320px;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
  transition: right 0.3s ease-in-out;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 769px) {
    max-width: 400px;
  }
`

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
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

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #333;
    color: white;
  }
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
