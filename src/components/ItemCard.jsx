import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Modal } from 'antd'
import 'antd/dist/reset.css'
import { useDispatch } from 'react-redux'
import { addItem } from '../store/cartSlice'
import AlmondImg from '../assets/options/Almond.jpg'
import LargeImg from '../assets/options/Large.jpg'
import MediumImg from '../assets/options/Medium.jpg'
import OatImg from '../assets/options/Oat.jpg'
import OneShotImg from '../assets/options/OneShot.png'
import RegularImg from '../assets/options/Regular.jpg'
import SmallImg from '../assets/options/Small.jpg'
import SoyImg from '../assets/options/Soy.jpg'
import ThreeShotImg from '../assets/options/ThreeShot.png'
import TwoShotImg from '../assets/options/TwoShot.png'
import XLImg from '../assets/options/XL.jpg'
import Sprite from '../assets/options/Sprite.png'
import Redbull from '../assets/options/Redbull.png'

const optionImages = {
  Almond: AlmondImg,
  Large: LargeImg,
  Medium: MediumImg,
  Oat: OatImg,
  OneShot: OneShotImg,
  Regular: RegularImg,
  Small: SmallImg,
  Soy: SoyImg,
  ThreeShot: ThreeShotImg,
  TwoShot: TwoShotImg,
  XL: XLImg,
  Sprite: Sprite,
  Redbull: Redbull
}

const shotsImageMap = {
  '1 Shot': 'OneShot',
  '2 Shots': 'TwoShot',
  '3 Shots': 'ThreeShot'
}

function ItemCard({ id, name, description, price, image, cat, options = {}, onAddToCart }) {
  const getDisplayArray = useCallback(
    (arr) =>
      Array.isArray(arr)
        ? arr.map((v) => (typeof v === 'object' && v !== null ? v.value : v))
        : [],
    []
  )

  const [size, setSize] = useState(getDisplayArray(options.sizes)?.[0] || null)
  const [milk, setMilk] = useState(
    getDisplayArray(options.milk)?.[0] ||
      getDisplayArray(options.milks)?.[0] ||
      null
  )
  const [shots, setShots] = useState(getDisplayArray(options.shots)?.[0] || null)
  const [mixer, setMixer] = useState(
    getDisplayArray(options.mixer)?.[0] ||
      getDisplayArray(options.mixers)?.[0] ||
      null
  )

  const [modalVisible, setModalVisible] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const dispatch = useDispatch()
  const parsedPrice = Number(price)

  const openModal = useCallback(() => setModalVisible(true), [])
  const closeModal = useCallback(() => setModalVisible(false), [])
  const incrementQuantity = useCallback(() => setQuantity((q) => Math.min(q + 1, 100)), [])
  const decrementQuantity = useCallback(() => setQuantity((q) => Math.max(q - 1, 1)), [])

  const handleConfirm = useCallback(() => {
    const item = {
      id,
      name,
      description,
      price: parsedPrice,
      image,
      cat,
      quantity,
      size,
      milk,
      shots,
      mixer
    }
    
    // Use the prop function if provided, otherwise fall back to Redux
    if (onAddToCart) {
      onAddToCart(item)
    } else {
      dispatch(addItem(item))
    }
    
    closeModal()
  }, [id, name, description, parsedPrice, image, cat, quantity, size, milk, shots, mixer, onAddToCart, dispatch, closeModal])

  const valueMap = useMemo(
    () => ({
      sizes: size,
      milk,
      shots,
      mixer
    }),
    [size, milk, shots, mixer]
  )

  const setterMap = useMemo(
    () => ({
      sizes: setSize,
      milk: setMilk,
      shots: setShots,
      mixer: setMixer
    }),
    []
  )

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
              if (key === 'shots' && shotsImageMap[v]) {
                imgKey = shotsImageMap[v]
              }
              const imgSrc = optionImages[imgKey]
              const selected = valueMap[key] === v
              return (
                <OptionButton
                  key={v}
                  $selected={selected}
                  onClick={() => setterMap[key](v)}
                >
                  {imgSrc && <OptionImg src={imgSrc} alt={v} />}
                  <OptionLabel>
                    <span>{v}</span>
                  </OptionLabel>
                </OptionButton>
              )
            })}
          </OptionsContainer>
        </OptionGroup>
      )
    })
  }, [options, valueMap, setterMap, getDisplayArray])

  const modalFooter = [
    <CancelButton key="cancel" onClick={closeModal}>
      Cancel
    </CancelButton>,
    <AddButton key="add" type="primary" onClick={handleConfirm}>
      Add to Cart
    </AddButton>
  ]

  return (
    <>
      <Card onClick={openModal}>
        <ImageContainer>
          <ProductImage src={image} alt={name} />
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

      <DarkModal
        title={`Customize your ${name}`}
        open={modalVisible}
        onCancel={closeModal}
        footer={modalFooter}
        centered
      >
        <ModalImage src={image} alt={name} />
        {Object.values(options).every((arr) => !arr || arr.length === 0) && (
          <div style={{ color: '#aaa', marginBottom: 16 }}>
            No customization options available for this item.
          </div>
        )}
        {optionGroups}
        <OptionGroup>
          <label>Quantity:</label>
          <QuantityContainer>
            <QuantityButton
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              −
            </QuantityButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityButton
              onClick={incrementQuantity}
              disabled={quantity >= 100}
            >
              +
            </QuantityButton>
          </QuantityContainer>
        </OptionGroup>
      </DarkModal>
    </>
  )
}

export default React.memo(ItemCard)

const DarkModal = styled(Modal)`
  .ant-modal-content {
    background-color: #181818;
    color: white;
    border-radius: 18px;
    box-shadow: 0 8px 32px #0008;
    padding: 32px 24px 24px 24px;
    border: none;
  }
  .ant-modal-header {
    background-color: #181818;
    color: white;
    border-bottom: 2px solid #222;
    border-radius: 18px 18px 0 0;
    padding: 24px 24px 12px 24px;
  }
  .ant-modal-title {
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  .ant-modal-close, .ant-modal-close-x {
    color: white !important;
    font-size: 22px;
    top: 18px;
    right: 18px;
  }
  .ant-modal-footer {
    background-color: #181818;
    border-top: 2px solid #222;
    border-radius: 0 0 18px 18px;
    padding: 18px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
`

const Card = styled.div`
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  margin: 10px;
`

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  background: #1a1a1a;
  border-radius: 25px;
`

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const OptionGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  label {
    font-weight: bold;
    margin-bottom: 8px;
    color: white;
  }
`

const ModalImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
`

const OptionsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
  /* Each option button is 100px tall */
  & > div {
    height: 100px;
  }
`

const OptionImg = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 6px;
  background: #222;
  box-shadow: 0 2px 8px #0002;
`

const OptionLabel = styled.div`
  color: white;
  font-size: 0.85rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`

const QuantityButton = styled.button`
  background-color: #2a2a2a;
  color: white;
  border: 1px solid #ff9800;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    background-color: #ff9800;
    color: #1a1a1a;
  }
  &:disabled {
    background-color: #333;
    border-color: #555;
    color: #888;
    cursor: not-allowed;
  }
`

const QuantityDisplay = styled.div`
  background-color: #2a2a2a;
  color: white;
  border-radius: 8px;
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-family: 'rubik', sans-serif;
`

const AddButton = styled.button`
  background: linear-gradient(90deg, #ff9800 60%, #ffb74d 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  padding: 10px 28px;
  margin-left: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #ffa726 60%, #ffd54f 100%);
    color: #222;
  }
`

const CancelButton = styled.button`
  background: #222;
  color: #fff;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 16px;
  padding: 10px 24px;
  margin-right: 12px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #444;
    color: #ff9800;
    border-color: #ff9800;
  }
`

const OptionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: ${({ $selected }) => ($selected ? '#222' : '#2a2a2a')};
  border: 2px solid ${({ $selected }) => ($selected ? '#ff9800' : 'transparent')};
  border-radius: 12px;
  padding: 8px 6px 4px 6px;
  width: 80px;
  height: 100px;
  cursor: pointer;
  transition: border 0.2s, background 0.2s;
  margin: 0;
  box-sizing: border-box;
  &:hover {
    border: 2px solid #ff9800;
    background: #222;
  }
`
