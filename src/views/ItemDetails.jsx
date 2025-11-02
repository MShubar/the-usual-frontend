import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import AlmondImg from '../assets/options/Almond.svg'
import LargeImg from '../assets/options/Large.svg'
import MediumImg from '../assets/options/Medium.svg'
import OatImg from '../assets/options/Oat.svg'
import OneShotImg from '../assets/options/OneShot.svg'
import RegularImg from '../assets/options/Regular.svg'
import SmallImg from '../assets/options/Small.svg'
import ThreeShotImg from '../assets/options/ThreeShot.svg'
import TwoShotImg from '../assets/options/TwoShot.svg'
import Sprite from '../assets/options/Sprite.svg'
import Redbull from '../assets/options/Redbull.svg'

const optionImages = {
  Almond: AlmondImg,
  Large: LargeImg,
  Medium: MediumImg,
  Oat: OatImg,
  OneShot: OneShotImg,
  Regular: RegularImg,
  Small: SmallImg,
  ThreeShot: ThreeShotImg,
  TwoShot: TwoShotImg,
  Sprite: Sprite,
  Redbull: Redbull
}

const shotsImageMap = {
  '1 Shot': 'OneShot',
  '2 Shots': 'TwoShot',
  '3 Shots': 'ThreeShot'
}

function ItemDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id, name, description, price, image, options = {} } = location.state || {}

  const getDisplayArray = useCallback(
    (arr) => Array.isArray(arr) ? arr.map((v) => (typeof v === 'object' && v !== null ? v.value : v)) : [],
    []
  )

  const [size, setSize] = useState(getDisplayArray(options.sizes)?.[0] || null)
  const [milk, setMilk] = useState(getDisplayArray(options.milk)?.[0] || getDisplayArray(options.milks)?.[0] || null)
  const [shots, setShots] = useState(getDisplayArray(options.shots)?.[0] || null)
  const [mixer, setMixer] = useState(getDisplayArray(options.mixer)?.[0] || getDisplayArray(options.mixers)?.[0] || null)
  const [quantity, setQuantity] = useState(1)

  const valueMap = useMemo(() => ({ sizes: size, milk, shots, mixer }), [size, milk, shots, mixer])
  const setterMap = useMemo(() => ({ sizes: setSize, milk: setMilk, shots: setShots, mixer: setMixer }), [])

  const incrementQuantity = useCallback(() => setQuantity((q) => Math.min(q + 1, 100)), [])
  const decrementQuantity = useCallback(() => setQuantity((q) => Math.max(q - 1, 1)), [])

  const handleAddToCart = () => {
    const item = { id, name, description, price, image, quantity, size, milk, shots, mixer }
    
    // Add to cart
    try {
      const savedCart = localStorage.getItem('cart')
      const cart = savedCart ? JSON.parse(savedCart) : []
      
      const itemKey = `${id}-${size || ''}-${milk || ''}-${shots || ''}-${mixer || ''}`
      const existingItem = cart.find(cartItem => {
        const cartItemKey = `${cartItem.id}-${cartItem.size || ''}-${cartItem.milk || ''}-${cartItem.shots || ''}-${cartItem.mixer || ''}`
        return cartItemKey === itemKey
      })

      let newCart
      if (existingItem) {
        newCart = cart.map(cartItem => {
          const cartItemKey = `${cartItem.id}-${cartItem.size || ''}-${cartItem.milk || ''}-${cartItem.shots || ''}-${cartItem.mixer || ''}`
          return cartItemKey === itemKey ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
        })
      } else {
        newCart = [...cart, item]
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart))
      window.dispatchEvent(new CustomEvent('cart-updated'))
      navigate(-1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const optionGroups = useMemo(() => {
    return Object.entries(options).map(([key, arr]) => {
      const displayArr = getDisplayArray(arr)
      if (!displayArr || displayArr.length === 0) return null

      return (
        <OptionGroup key={key}>
          <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
          <OptionsContainer>
            {displayArr.map((v) => {
              let imgKey = v.replace(/[^a-zA-Z0-9]/g, '')
              if (key === 'shots' && shotsImageMap[v]) imgKey = shotsImageMap[v]
              const imgSrc = optionImages[imgKey]
              const selected = valueMap[key] === v
              const isMixer = key === 'mixer' || key === 'mixers'
              
              return (
                <OptionButton key={v} $selected={selected} onClick={() => setterMap[key](v)}>
                  {imgSrc && <OptionImg src={imgSrc} alt={v} loading="lazy" $selected={selected} $isMixer={isMixer} />}
                  <OptionLabel><span>{v}</span></OptionLabel>
                </OptionButton>
              )
            })}
          </OptionsContainer>
        </OptionGroup>
      )
    })
  }, [options, valueMap, setterMap, getDisplayArray])

  if (!id) {
    return (
      <PageContainer>
        <p>Item not found</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)} />
      
      <ImageWrapper>
        <ItemImage src={image} alt={name} />
      </ImageWrapper>

      <Content>
        <Header>
          <Title>{name}</Title>
          <Price>{price.toFixed(2)} BD</Price>
        </Header>
        <Description>{description}</Description>

        {Object.values(options).every((arr) => !arr || arr.length === 0) ? (
          <NoOptions>No customization options available</NoOptions>
        ) : (
          optionGroups
        )}

        {/* bottom actions: quantity + add to cart pinned to bottom when not scrollable */}
        <BottomActions>
          <OptionGroup>
            <label>Quantity:</label>
            <QuantityContainer>
              <QuantityButton onClick={decrementQuantity} disabled={quantity <= 1}>−</QuantityButton>
              <QuantityDisplay>{quantity}</QuantityDisplay>
              <QuantityButton onClick={incrementQuantity} disabled={quantity >= 100}>+</QuantityButton>
            </QuantityContainer>
          </OptionGroup>

          <AddButton onClick={handleAddToCart}>
            Add to Cart • {(price * quantity).toFixed(2)} BD
          </AddButton>
        </BottomActions>
      </Content>
    </PageContainer>
  )
}

export default ItemDetails

const PageContainer = styled.div`
  background: #000;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const ImageWrapper = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: #1a1a1a;
  margin-top: 0;
  padding-top: env(safe-area-inset-top);

  @media (min-width: 769px) {
    height: 400px;
  }
`

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Content = styled.div`
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  
  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`

const BottomActions = styled.div`
  margin-top: auto; /* push to bottom when not scrollable */
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom)); /* safe area on iOS */
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`

const Price = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ff9800;
  white-space: nowrap;
  margin-left: 16px;
`

const Description = styled.p`
  font-size: 16px;
  color: #999;
  margin: 0 0 24px 0;
  line-height: 1.5;
`

const NoOptions = styled.div`
  color: #666;
  margin: 16px 0;
  font-style: italic;
`

const OptionGroup = styled.div`
  margin-bottom: 24px;
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 12px;
    font-size: 18px;
  }
`

const OptionsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

const OptionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: ${({ $selected }) => ($selected ? '#1a1a1a' : '#2a2a2a')};
  border: 2px solid ${({ $selected }) => ($selected ? '#ff9800' : '#555')};
  border-radius: 12px;
  padding: 8px 6px;
  width: 80px;
  height: 100px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #ff9800;
    background: #1a1a1a;
  }
`

const OptionImg = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 6px;
  filter: ${({ $selected, $isMixer }) => {
    if ($isMixer && !$selected) return 'none'
    if ($isMixer && $selected) return 'brightness(0) saturate(100%) invert(77%) sepia(79%) saturate(2500%) hue-rotate(359deg) brightness(102%) contrast(101%)'
    return $selected ? 'brightness(0) saturate(100%) invert(77%) sepia(79%) saturate(2500%) hue-rotate(359deg) brightness(102%) contrast(101%)' : 'brightness(0) saturate(100%) invert(100%)'
  }};
`

const OptionLabel = styled.div`
  color: white;
  font-size: 13px;
  text-align: center;
  line-height: 1.2;
  
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const QuantityButton = styled.button`
  background: #2a2a2a;
  color: white;
  border: 2px solid #ff9800;
  border-radius: 8px;
  width: 44px;
  height: 44px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:disabled {
    background: #1a1a1a;
    border-color: #555;
    color: #666;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background: #ff9800;
    color: #000;
  }
`

const QuantityDisplay = styled.div`
  background: #2a2a2a;
  color: white;
  border-radius: 8px;
  min-width: 60px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
`

const AddButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 18px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  /* removed margin-top:auto; handled by BottomActions */
  /* removed extra safe-area padding; handled by BottomActions */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 152, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`
