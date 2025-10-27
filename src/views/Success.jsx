import React from 'react'
import styled from 'styled-components'

const Success = () => {
  return (
    <Container>
      <SuccessCard>
        <h1>Success!</h1>
        <p>Your operation was completed successfully.</p>
      </SuccessCard>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #000;
  padding: 20px;
  text-align: center;
  
  @media (min-width: 769px) {
    padding: 40px;
  }
`

const SuccessCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 20px;
  padding: 40px 30px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  
  @media (min-width: 769px) {
    max-width: 500px;
    padding: 60px 40px;
  }
`

export default Success