import React from 'react'
import styled from 'styled-components'

function OrderTypeSelector({ 
  options = [],
  activeType,
  onTypeChange,
  title = "Order Type"
}) {
  return (
    <OrderTypeSection>
      <SectionTitle>{title}</SectionTitle>
      <OrderTypeButtons>
        {options.map((option) => (
          <OrderTypeButton
            key={option.value}
            $active={activeType === option.value}
            onClick={() => onTypeChange(option.value)}
          >
            {option.icon && <option.icon />}
            <OrderTypeText>
              <span>{option.label}</span>
              {option.description && <small>{option.description}</small>}
            </OrderTypeText>
          </OrderTypeButton>
        ))}
      </OrderTypeButtons>
    </OrderTypeSection>
  )
}

export default OrderTypeSelector

const OrderTypeSection = styled.div`
  background: #181818;
  border-radius: 16px;
  padding: 16px;
  
  @media (max-width: 768px) {
    border-radius: 12px;
    padding: 12px;
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
