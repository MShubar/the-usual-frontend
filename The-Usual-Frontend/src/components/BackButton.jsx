import React from 'react'
import styled from 'styled-components'

function BackButton() {
  const handleBack = () => {
    window.history.back()
  }

  return <Button onClick={handleBack}>← Back</Button>
}

export default BackButton

const Button = styled.button`
  background: transparent;
  border: none;
  color: #3498db;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e1eaff;
  }
`
