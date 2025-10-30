import React from 'react'
import styled from 'styled-components'
import DeleteIcon from '@mui/icons-material/Delete'
import ClearAllIcon from '@mui/icons-material/ClearAll'

function CartItemsList({ 
  items = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearAll,
  title = "Order Items",
  showClearButton = true,
  currency = "BD"
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <CartSection>
      <CartHeader>
        <SectionTitle>{title}</SectionTitle>
        {showClearButton && (
          <ClearAllButton onClick={onClearAll}>
            <ClearAllIcon />
            Clear All
          </ClearAllButton>
        )}
      </CartHeader>
      <CartList>
        {items.map((item, index) => (
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
              <ItemPrice>{item.price.toFixed(2)}{currency} each</ItemPrice>
            </ItemDetails>
            <QuantityControls>
              <QuantityButton
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </QuantityButton>
              <QuantityDisplay>{item.quantity}</QuantityDisplay>
              <QuantityButton
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                +
              </QuantityButton>
            </QuantityControls>
            <ItemTotal>{(item.price * item.quantity).toFixed(2)}{currency}</ItemTotal>
            <DeleteButton onClick={() => onRemoveItem(item.id)}>
              <DeleteIcon />
            </DeleteButton>
          </CartItem>
        ))}
      </CartList>
    </CartSection>
  )
}

export default CartItemsList

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
