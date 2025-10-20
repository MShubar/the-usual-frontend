import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  padding: 40px;
  text-align: center;
  color: #ddd;
`

const Title = styled.h2`
  margin-bottom: 12px;
`

export default function NotFound({ title = 'Not Found', message = 'The requested resource was not found.' }) {
  return (
    <Wrap>
      <Title>{title}</Title>
      <div>{message}</div>
    </Wrap>
  )
}
