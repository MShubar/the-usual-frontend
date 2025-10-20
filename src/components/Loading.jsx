import React from 'react'
import styled from 'styled-components'
import { Spin } from 'antd'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`

export default function Loading({ size = 40, tip = 'Loading...' }) {
  return (
    <Wrapper>
      <Spin size={size === 40 ? 'large' : 'default'} tip={tip} />
    </Wrapper>
  )
}
