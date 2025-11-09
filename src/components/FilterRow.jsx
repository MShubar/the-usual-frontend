import React from 'react'
import styled from 'styled-components'
import SkeletonCard from './SkeletonCard'
import NotFound from './NotFound'

function FilterRow({ 
  categories = [], 
  loading = false, 
  activeId = null, 
  onCategorySelect,
}) {
  if (loading) {
    return (
      <Container>
        <SkeletonCard count={4} variant="item" />
      </Container>
    )
  }


  return (
    <Container>
      {categories.map((cat) => (
        <FilterButton
          key={cat.id}
          $active={cat.id === activeId}
          onClick={() => onCategorySelect(cat)}
        >
          {cat.name}
        </FilterButton>
      ))}
    </Container>
  )
}

export default FilterRow

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 16px;
`

const FilterButton = styled.button`
  background-color: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#000' : '#fff')};
  border: 3px solid #fff;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  height: 10%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`
