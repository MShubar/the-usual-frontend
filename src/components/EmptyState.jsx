import React from 'react'
import styled from 'styled-components'

function EmptyState({ 
  icon: Icon,
  iconSize = 64,
  iconColor = '#555',
  title,
  subtitle,
  actionButton,
  padding = '60px 20px'
}) {
  return (
    <Container $padding={padding}>
      {Icon && <Icon sx={{ fontSize: iconSize, color: iconColor, mb: 2 }} />}
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {actionButton && <ActionButton>{actionButton}</ActionButton>}
    </Container>
  )
}

export default EmptyState

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ $padding }) => $padding};
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`

const Title = styled.h2`
  font-size: 24px;
  margin: 16px 0 8px 0;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const Subtitle = styled.p`
  color: #999;
  font-size: 16px;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const ActionButton = styled.div`
  margin-top: 16px;
`
