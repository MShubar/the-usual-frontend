import React from 'react'
import styled, { keyframes } from 'styled-components'

const shine = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const Container = styled.div`
  display: ${(p) => (p.$full ? 'block' : 'flex')};
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
`

// sizes tuned to match ItemCard look
const Card = styled.div`
  width: ${(p) => p.width};
  height: ${(p) => p.height};
  border-radius: ${(p) => p.radius};
  background: linear-gradient(90deg, #2a2a2a 25%, #343434 37%, #2a2a2a 63%);
  background-size: 400% 100%;
  animation: ${shine} 1.2s linear infinite;
  padding: 12px;
  box-sizing: border-box;
  margin-bottom: ${(p) => (p.$full ? '12px' : '0')};
  flex: 0 0 auto;
`

const Row = styled.div`
  height: ${(p) => p.$h || 16}px;
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
  margin-bottom: 10px;
`

export default function SkeletonCard({ count = 1, variant = 'item', fullWidth = false }) {
  // map variants to sizes that match the real UI
  let width = '100%'
  let height = '320px'
  let radius = '12px'
  let containerFull = fullWidth

  if (variant === 'subcategory') {
    width = '100%'
    height = '130px' // matches CategoryCard height
    radius = '40px'
    containerFull = true
  } else if (variant === 'compact') {
    width = '220px'
    height = '280px'
    radius = '12px'
  } else if (fullWidth) {
    width = '100%'
    height = '160px'
    radius = '12px'
    containerFull = true
  }

  const items = Array.from({ length: count })
  return (
    <Container $full={containerFull}>
      {items.map((_, i) => (
        <Card key={i} width={width} height={height} radius={radius} $full={containerFull}>
          {variant === 'subcategory' ? (
            <>
              <div style={{ height: 80, borderRadius: 8, background: 'rgba(255,255,255,0.02)', marginBottom: 12 }} />
              <Row $h={18} />
            </>
          ) : (
            <>
              <div style={{ height: 180, borderRadius: 8, background: 'rgba(255,255,255,0.02)', marginBottom: 12 }} />
              <Row $h={18} />
              <Row $h={12} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Row style={{ width: 80, height: 32, flex: 'none' }} />
                <Row style={{ width: 60, height: 32, flex: 'none' }} />
              </div>
            </>
          )}
        </Card>
      ))}
    </Container>
  )
}
