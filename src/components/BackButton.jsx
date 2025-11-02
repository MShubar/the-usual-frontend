import React from 'react'
import styled from 'styled-components'

function BackButton({ 
  onClick, 
  label = '← Back',
  show = true,
  position = { top: 16, left: 16 }
}) {
  if (!show) return null

  return (
    <Button onClick={onClick} $position={position}>
      {label}
    </Button>
  )
}

export default BackButton

const Button = styled.button`
  position: fixed;
  top: calc(${({ $position }) => $position.top}px + env(safe-area-inset-top));
  left: calc(${({ $position }) => $position.left}px + env(safe-area-inset-left));
  z-index: 2001;
  background: rgba(0, 0, 0, 0.8);
  color: #ff9800;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  height: 48px;

  &:hover {
    background: rgba(255, 152, 0, 0.3);
  }
`
