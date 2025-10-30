import React from 'react'
import styled from 'styled-components'

function OrdersPageHeader({ 
  icon: Icon, 
  iconColor = '#ff9800', 
  iconSize = 32, 
  title, 
  subtitle,
  rightContent 
}) {
  return (
    <Header>
      {rightContent && <HeaderActions>{rightContent}</HeaderActions>}
      <HeaderContent>
        <Icon sx={{ fontSize: iconSize, color: iconColor }} />
        <HeaderText>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </HeaderText>
      </HeaderContent>
    </Header>
  )
}

export default OrdersPageHeader

const Header = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 16px;
  margin-bottom: 16px;
`

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-direction: row-reverse; /* This reverses the order */
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`

const HeaderText = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  color: white;
`

const Subtitle = styled.div`
  color: #ccc;
  font-size: 14px;
  margin-top: 4px;
`
