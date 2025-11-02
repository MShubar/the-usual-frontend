import React from 'react'
import styled from 'styled-components'

function OrderSummary({ 
  title = "Order Summary",
  summaryItems = [],
  total,
  currency = "BD",
  buttonText,
  buttonLoadingText,
  onButtonClick,
  isButtonDisabled = false,
  children
}) {
  return (
    <Container>
      <SectionTitle>{title}</SectionTitle>
      
      {summaryItems.map((item, index) => (
        <SummaryRow key={index}>
          <span>{item.label}</span>
          <span>{item.value.toFixed(2)}{currency}</span>
        </SummaryRow>
      ))}
      
      {total !== undefined && (
        <>
          <Divider />
          <TotalRow>
            <span>Total</span>
            <span>{total.toFixed(2)}{currency}</span>
          </TotalRow>
        </>
      )}
      
      {buttonText && (
        <ActionButton
          onClick={onButtonClick}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled && buttonLoadingText ? buttonLoadingText : buttonText}
        </ActionButton>
      )}

      {children}
    </Container>
  )
}

export default OrderSummary

const Container = styled.div`
  background: #181818;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #333;
  
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

const Divider = styled.div`
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

const ActionButton = styled.button`
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

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 152, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    font-size: 16px;
    margin-top: 12px;
  }
`
