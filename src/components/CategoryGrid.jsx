import React from 'react'
import styled from 'styled-components'
import SkeletonCard from './SkeletonCard'
import NotFound from './NotFound'

function CategoryGrid({ 
  categories = [],
  loading = false,
  searchQuery = '',
  onCategoryClick,
  skeletonCount = 3,
}) {
  if (loading) {
    return (
      <CardList>
        <SkeletonCard count={skeletonCount} variant="subcategory" fullWidth />
      </CardList>
    )
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <CardList>
      {filteredCategories.map((cat) => (
        <CategoryCard
          key={cat.id}
          onClick={() => onCategoryClick(cat)}
          style={{
            backgroundImage: `url(${cat.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <Overlay />
          <CategoryName>{cat.name}</CategoryName>
        </CategoryCard>
      ))}
    </CardList>
  )
}

export default CategoryGrid

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 16px;
  
  @media (min-width: 769px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 24px;
    margin: 24px;
  }
`

const CategoryCard = styled.div`
  position: relative;
  height: 130px;
  border-radius: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  
  @media (min-width: 769px) {
    height: 200px;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
`

const CategoryName = styled.h2`
  font-family: 'Rubik', sans-serif;
  font-size: 28px;
  text-transform: uppercase;
  color: white;
  position: relative;
  z-index: 1;
  
  @media (min-width: 769px) {
    font-size: 36px;
  }
`
