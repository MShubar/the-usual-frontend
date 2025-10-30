import React from 'react'
import styled from 'styled-components'

function AlertMessage({ 
  type = 'info', 
  message, 
  icon, 
  onClose 
}) {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          background: '#ff9800',
          color: '#000',
          defaultIcon: '⚠️'
        }
      case 'error':
        return {
          background: '#d32f2f',
          color: '#fff',
          defaultIcon: '❌'
        }
      case 'success':
        return {
          background: '#4CAF50',
          color: '#fff',
          defaultIcon: '✓'
        }
      case 'info':
      default:
        return {
          background: '#2196F3',
          color: '#fff',
          defaultIcon: 'ℹ️'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <AlertContainer $background={styles.background} $color={styles.color}>
      <AlertContent>
        <AlertIcon>{icon || styles.defaultIcon}</AlertIcon>
        <AlertText>{message}</AlertText>
      </AlertContent>
      {onClose && (
        <CloseButton onClick={onClose}>×</CloseButton>
      )}
    </AlertContainer>
  )
}

export default AlertMessage

const AlertContainer = styled.div`
  background: ${props => props.$background};
  color: ${props => props.$color};
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`

const AlertIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const AlertText = styled.div`
  font-weight: bold;
  font-size: 14px;
  text-align: left;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 24px;
  cursor: pointer;
  padding: 0 4px;
  margin-left: 8px;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`
