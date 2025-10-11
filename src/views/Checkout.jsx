// src/views/Checkout.js
import React from 'react'
import styled from 'styled-components'
import Buttons from '../components/Buttons'
import BackButton from '../components/BackButton'
import { useDispatch, useSelector } from 'react-redux'
import { removeItem, clearCart } from '../store/cartSlice'

function Checkout() {
  const cartItems = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  return (
    <PageContainer>
      <BackButton />
      <h1>Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <CartList>
            {cartItems.map((item) => (
              <CartItem key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.quantity} × {item.price} BHD
                  </p>
                </div>
                <DeleteButton onClick={() => dispatch(removeItem(item.id))}>
                  Delete
                </DeleteButton>
              </CartItem>
            ))}
          </CartList>

          <Total>Total: {total.toFixed(2)} BHD</Total>

          <Buttons
            type="checkout"
            width="100%"
            onClick={() => {
              alert('Order placed successfully!')
              dispatch(clearCart())
            }}
          >
            Place Order
          </Buttons>
        </>
      )}
    </PageContainer>
  )
}

export default Checkout

const PageContainer = styled.div`
  padding: 20px;
  background: #111;
  color: white;
  min-height: 100vh;
`

const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: #222;
  padding: 10px;
  border-radius: 8px;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }

  h3 {
    margin: 0;
  }
`

const Total = styled.h2`
  margin-top: 20px;
`

const DeleteButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-left: auto;

  &:hover {
    background: #c0392b;
  }
`
