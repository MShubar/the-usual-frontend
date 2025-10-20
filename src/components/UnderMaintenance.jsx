import React from 'react'
import styled from 'styled-components'
import Buttons from './Buttons'

const Wrap = styled.div`
  padding: 40px;
  text-align: center;
  color: #fff;
`

const Title = styled.h2`
  margin-bottom: 8px;
`

const Note = styled.p`
  color: #ccc;
  margin-bottom: 16px;
`

export default function UnderMaintenance({ onContact, message = 'We are performing maintenance. Try again later.' }) {
  return (
    <Wrap>
      <Title>Under Maintenance</Title>
      <Note>{message}</Note>
      {onContact && <Buttons onClick={onContact}>Contact Support</Buttons>}
    </Wrap>
  )
}
