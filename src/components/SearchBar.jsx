import React from 'react'
import styled from 'styled-components'

function SearchBar({ 
  value = '', 
  onChange, 
  placeholder = 'Search',
  disabled = false 
}) {
  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </SearchContainer>
  )
}

export default SearchBar

const SearchContainer = styled.div`
  margin: 16px;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: 20px;
  border: none;
  background: #222;
  color: white;
  font-size: 16px;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border: 2px solid #ff9800;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
