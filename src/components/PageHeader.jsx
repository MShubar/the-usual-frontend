import React from 'react'
import styled from 'styled-components'
import LocationOnIcon from '@mui/icons-material/LocationOn'

function PageHeader({ 
  icon: Icon,
  iconColor = '#ff9800',
  iconSize = 32,
  title,
  location,
  showLocationIcon = true
}) {
  return (
    <Header>
      <HeaderContent>
        {Icon && <Icon sx={{ fontSize: iconSize, color: iconColor }} />}
        <HeaderText>
          <Title>{title}</Title>
          {location && (
            <Location>
              {showLocationIcon && <LocationOnIcon sx={{ fontSize: 16 }} />}
              {location}
            </Location>
          )}
        </HeaderText>
      </HeaderContent>
    </Header>
  )
}

export default PageHeader

const Header = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 16px;
  margin-bottom: 16px;
  padding-top: 60px;
  
  @media (max-width: 768px) {
    padding: 12px;
    padding-top: 60px;
    margin-bottom: 12px;
  }
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  
  @media (max-width: 768px) {
    gap: 8px;
    margin-top: 4px;
  }
`

const HeaderText = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
`

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ccc;
  font-size: 14px;
  margin-top: 4px;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`
