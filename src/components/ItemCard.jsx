import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

function ItemCard({ id, name, description, price, image, cat, options = {} }) {
  const navigate = useNavigate()
  const parsedPrice = Number(price)

  const handleClick = () => {
    navigate(`/item/${id}`, {
      state: {
        id,
        name,
        description,
        price: parsedPrice,
        image,
        cat,
        options
      }
    })
  }

  return (
    <Card onClick={handleClick}>
      <ImageContainer>
        <LazyLoadImage
          src={image}
          alt={name}
          effect="blur"
          width="100%"
          height="100%"
          threshold={100}
          placeholder={<ImagePlaceholder />}
          style={{
            objectFit: 'cover',
            display: 'block'
          }}
          wrapperProps={{
            style: { width: '100%', height: '100%' }
          }}
        />
      </ImageContainer>
      <Content>
        <Title>{name}</Title>
        <Description>{description}</Description>
        <Price>
          {Number.isNaN(parsedPrice)
            ? 'N/A'
            : Number.isInteger(parsedPrice)
            ? parsedPrice
            : parsedPrice.toFixed(2)}{' '}
          <Currency>BD</Currency>
        </Price>
      </Content>
    </Card>
  )
}

export default React.memo(ItemCard)

const Card = styled.div`
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  margin: 10px;
  transition: transform 0.2s;

  @media (min-width: 769px) {
    width: calc(33.333% - 20px);
    max-width: 350px;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(255, 152, 0, 0.2);
    }
  }

  @media (min-width: 1200px) {
    width: calc(25% - 20px);
  }
`

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  background: #1a1a1a;
  border-radius: 25px;

  .lazy-load-image-background {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 769px) {
    height: 250px;
  }
`

const Content = styled.div`
  padding: 12px;
`

const Title = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
`

const Description = styled.p`
  font-size: 0.9rem;
  color: grey;
  margin: 8px 0;
`

const Price = styled.p`
  font-size: 24px;
  margin-top: 8px;
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: 'rubik', sans-serif;
`

const Currency = styled.span`
  font-size: 16px;
  color: white;
  font-family: 'rubik', sans-serif;
`
