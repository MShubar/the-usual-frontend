import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  font-family: 'Rubik', sans-serif;
  
  @media (min-width: 769px) {
    padding: 0 20px;
  }
`

const Header = styled.div`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  padding: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.3);
  
  @media (min-width: 769px) {
    padding: 30px;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  padding: 20px;
  
  @media (min-width: 769px) {
    max-width: 1200px;
    margin: 0 auto;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 30px;
  }
`

const OrdersGrid = styled.div`
  display: grid;
  gap: 20px;
  padding: 0 20px 20px;
  
  @media (min-width: 769px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 30px 30px;
  }
  
  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const EmployeeOrders = () => {
  return (
    <Container>
      <Header>
        <h1>Employee Orders</h1>
      </Header>
      <StatsGrid>
        {/* Stats components go here */}
      </StatsGrid>
      <OrdersGrid>
        {/* Orders components go here */}
      </OrdersGrid>
    </Container>
  )
}

export default EmployeeOrders