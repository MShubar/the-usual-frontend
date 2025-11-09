import React from 'react'
import styled from 'styled-components'
import ItemCard from './ItemCard'
import SkeletonCard from './SkeletonCard'
import NotFound from './NotFound'

function ItemsGrid({ 
  items = [],
  loading = false,
  searchQuery = '',
  categoryName,
  onAddToCart,
  skeletonCount = 6,
  notFoundTitle = "No items",
  notFoundMessage = "No items available for this category."
}) {
  const formatArray = (val) => {
    if (!val) return []
    if (Array.isArray(val)) {
      if (val.length > 0 && typeof val[0] === 'object' && val[0] !== null && 'value' in val[0]) {
        return val
      }
      return val
    }
    if (typeof val === 'string')
      return val.replace(/[{}]/g, '').split(',')
    return []
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <>
        {categoryName && <Title>{categoryName}</Title>}
        <Container>
          <SkeletonCard count={skeletonCount} variant="item" />
        </Container>
      </>
    )
  }

  if (filteredItems.length === 0) {
    return (
      <>
        {categoryName && <Title>{categoryName}</Title>}
        <Container>
          <NotFound title={notFoundTitle} message={notFoundMessage} />
        </Container>
      </>
    )
  }

  return (
    <>
      {categoryName && <Title>{categoryName}</Title>}
      <Container>
        {filteredItems.map((item) => {
          const formattedItem = {
            ...item,
            options: {
              sizes: formatArray(item.sizes),
              milk: formatArray(item.milks),
              shots: formatArray(item.shots),
              mixer: formatArray(item.mixers)
            }
          }

          return (
            <ItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              serves={item.serves}
              price={item.price}
              image={item.image}
              cat={categoryName}
              options={formattedItem.options}
              onAddToCart={onAddToCart}
            />
          )
        })}
      </Container>
    </>
  )
}

export default ItemsGrid

const Title = styled.h1`
  color: white;
  font-family: 'Rubik', sans-serif;
  margin: 16px;
`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 20px;
`
