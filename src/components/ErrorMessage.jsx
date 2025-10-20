import React from 'react'
import styled from 'styled-components'
import Buttons from './Buttons'

const Box = styled.div`
  padding: 20px;
  background: #2a1212;
  color: #ffdede;
  border: 1px solid #5a1a1a;
  border-radius: 10px;
  text-align: center;
`

const Title = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
`

const Msg = styled.div`
  color: #ffbdbd;
  margin-bottom: 12px;
`

export default function ErrorMessage({ title = 'Something went wrong', message = '', onRetry }) {
  return (
    <Box>
      <Title>{title}</Title>
      {message && <Msg>{message}</Msg>}
      {onRetry && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Buttons type="primary" onClick={onRetry}>Retry</Buttons>
        </div>
      )}
    </Box>
  )
}
