import React, { useState } from 'react'
import styled from 'styled-components'
import DeleteIcon from '@mui/icons-material/Delete'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import { colors } from '../constants/colors'

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

  // Show 2 items initially, and reveal 5 more on each click
  const [visibleCount, setVisibleCount] = useState(2)
  const displayedItems = items.slice(0, visibleCount)

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
        {displayedItems.map((item, index) => (
          <CartItem key={`${item.id}-${index}`}>
            <ItemImage src={item.image} alt={item.name} />
            <ItemInfo>
              <NameRow>
              <ItemName>{item.name}</ItemName>
              <DeleteButton onClick={() => onRemoveItem(item.id)}>
                <DeleteIcon style={{fontSize: "20px"}} />
              </DeleteButton>
              </NameRow>
              <ItemCustomizations>
                {item.size && <Customization>Size: {item.size}</Customization>}
                {item.milk && <Customization>Milk: {item.milk}</Customization>}
                {item.shots && <Customization>Shots: {item.shots}</Customization>}
                {item.mixer && <Customization>Mixer: {item.mixer}</Customization>}
              </ItemCustomizations>
              <Actions>
              <ItemTotal>
               {(item.price * item.quantity).toFixed(3)} BHD
              </ItemTotal>
              <QuantityControl>
                <QtyButton
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >−</QtyButton>
                <QtyDisplay>{item.quantity}</QtyDisplay>
                <QtyButton
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >+</QtyButton>
              </QuantityControl>
            </Actions>
            </ItemInfo>
          </CartItem>
        ))}
      </CartList>

      {visibleCount < items.length && (
        <ShowMoreWrapper>
          <ShowMoreButton onClick={() => setVisibleCount(c => Math.min(c + 5, items.length))}>
            Show more
          </ShowMoreButton>
        </ShowMoreWrapper>
      )}
    </CartSection>
  )
}

export default CartItemsList

const CartSection = styled.div`
  background: ${colors.backgroundCard};
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

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: ${colors.primary};
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin: 0 0 12px 0;
  }
`

const ClearAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${colors.surface};
  color: ${colors.primary};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover {
    background: ${colors.surfaceLight};
    border-color: ${colors.primary};
    color: ${colors.textPrimary};
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

const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

const CartItem = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.surface};
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px ${colors.shadowMedium};
  width: 90%; 
  gap: 16px;
`

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  background: ${colors.backgroundCard};
  border-radius: 12px;
  object-fit: cover;
`
const NameRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

const ItemName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.textPrimary};
  margin-top: 2px;
`

const ItemCustomizations = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 4px 0;
`

const Customization = styled.span`
  background: ${colors.surfaceLight};
  color: ${colors.primary};
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
`

const ItemTotal = styled.div`
  font-weight: bold;
  color: ${colors.primary};
  font-size: 18px;
  margin-top: 6px;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between; /* push delete to top, quantity to bottom */
  gap: 12px;
  align-self: stretch; /* stretch to full height of CartItem */
`

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.backgroundCard};
  border-radius: 12px;
  padding: 2px 6px;
  gap: 2px;
`

const QtyButton = styled.button`
  background: ${colors.surface};
  border: none;
  color: ${colors.primary};
  font-size: 22px;
  font-weight: bold;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover:not(:disabled) {
    background: ${colors.primary};
    color: ${colors.surface};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const QtyDisplay = styled.div`
  background: ${colors.surface};
  color: ${colors.textPrimary};
  font-size: 20px;
  font-weight: bold;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
`

const DeleteButton = styled.button`
  background: ${colors.error};
  color: ${colors.textPrimary};
  border: none;
  border-radius: 8px;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
  &:hover {
    background: ${colors.primary};
    color: ${colors.surface};
  }
  svg {
    font-size: 28px;
  }
`
const ShowMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
`

const ShowMoreButton = styled.button`
  background: linear-gradient(135deg, ${colors.backgroundDark} 0%, ${colors.backgroundCard} 100%);
  color: ${colors.primary};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: linear-gradient(135deg, ${colors.backgroundLight} 0%, ${colors.surface} 100%);
    border-color: ${colors.primary};
    color: ${colors.textPrimary};
    box-shadow: 0 6px 20px ${colors.shadowOrange};
  }
`
