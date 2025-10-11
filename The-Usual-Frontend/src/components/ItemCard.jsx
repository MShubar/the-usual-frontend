import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Radio } from 'antd'
import 'antd/dist/reset.css'
import { useDispatch } from 'react-redux'
import { addItem } from '../store/cartSlice'

function ItemCard({ id, name, description, price, image, cat, options = {} }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Initialize dynamic option states
  const [size, setSize] = useState(options.sizes?.[0] || null)
  const [milk, setMilk] = useState(
    options.milk?.[0] || options.milks?.[0] || null
  )
  const [shots, setShots] = useState(options.shots?.[0] || null)
  const [mixer, setMixer] = useState(
    options.mixer?.[0] || options.mixers?.[0] || null
  )

  const dispatch = useDispatch()
  const parsedPrice = Number(price)

  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  const handleConfirm = () => {
    dispatch(
      addItem({
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
      })
    )
    closeModal()
  }

  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 100))
  const decrementQuantity = () => setQuantity((q) => Math.max(q - 1, 1))

  const valueMap = { sizes: size, milk, shots, mixer }
  const setterMap = {
    sizes: setSize,
    milk: setMilk,
    shots: setShots,
    mixer: setMixer
  }

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
        onOk={handleConfirm}
        okText="Add to Cart"
        centered
      >
        <ModalImage src={image} alt={name} />

        {/* DEBUG: Log options and state */}
        {console.log('Item Options:', options)}
        {console.log('Option States:', { size, milk, shots, mixer })}

        {Object.entries(options).map(([key, arr]) => {
          console.log('Rendering Option:', key, 'Values:', arr)
          if (!arr || arr.length === 0) return null

          return (
            <OptionGroup key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <Radio.Group
                value={valueMap[key]}
                onChange={(e) => setterMap[key](e.target.value)}
              >
                <OptionsContainer>
                  {arr.map((v) => (
                    <RadioCard key={v} value={v}>
                      <span>{v}</span>
                    </RadioCard>
                  ))}
                </OptionsContainer>
              </Radio.Group>
            </OptionGroup>
          )
        })}

        {/* Quantity selector */}
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

export default ItemCard

// Styled Components
const DarkModal = styled(Modal)`
  .ant-modal-content {
    background-color: #1a1a1a;
    color: white;
    border-radius: 12px;
  }
  .ant-modal-header {
    background-color: #1a1a1a;
    color: white;
    border-bottom: 1px solid #333;
  }
  .ant-modal-footer {
    background-color: #1a1a1a;
    border-top: 1px solid #333;
    color: white;
  }
  .ant-modal-title {
    color: white;
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
`

const RadioCard = styled(Radio)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 8px;
  width: 80px;
  height: 100px;
  justify-content: center;
  transition: all 0.2s;
  span {
    color: white;
    font-size: 0.85rem;
    text-align: center;
  }
  &.ant-radio-wrapper-checked {
    border: 2px solid #ff9800;
  }
  &:hover {
    border: 2px solid #ff9800;
  }
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
