import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
// import Buttons from '../components/Buttons'
import Logo from '../assets/background.jpg'
import ItemCard from '../components/ItemCard'
// import { useNavigate } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn'

function HomePage() {
  const [categories, setCategories] = useState([])
  const [mainCategory, setMainCategory] = useState('')
  const [subCategories, setSubCategories] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  // const navigate = useNavigate()

  // Fetch main categories
  useEffect(() => {
    axios
      .get('http://localhost:5000/categories')
      .then((res) => {
        setCategories(res.data)
        if (res.data.length > 0) {
          setMainCategory(res.data[0])
        }
      })
      .catch((err) => console.error(err))
  }, [])

  // Fetch subcategories when mainCategory changes
  useEffect(() => {
    if (!mainCategory) return
    axios
      .get(`http://localhost:5000/categories/${mainCategory}/sub`)
      .then((res) => setSubCategories(res.data))
      .catch((err) => console.error(err))
  }, [mainCategory])

  // Fetch items when subCategory is selected
  useEffect(() => {
    if (!mainCategory || !selectedSubCategory) return
    axios
      .get(
        `http://localhost:5000/categories/${mainCategory}/${selectedSubCategory}/items`
      )
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err))
  }, [mainCategory, selectedSubCategory])

  return (
    <>
      <PageWrapper>
        {selectedSubCategory && (
          <BackButton onClick={() => setSelectedSubCategory(null)}>
            ← Back
          </BackButton>
        )}
        <BackgroundImage />
        <PageContainer>
          <div style={{ gap: '10px' }}>
            <Title>The Usual</Title>
            <Location>
              <LocationOnIcon />
              Bahrain, Manama
            </Location>
          </div>

          {/* Category Buttons */}
          <FilterRow>
            {categories.map((cat) => (
              <FilterButton
                key={cat}
                active={cat === mainCategory}
                onClick={() => {
                  setMainCategory(cat)
                  setSelectedSubCategory(null)
                  setItems([])
                }}
              >
                {cat}
              </FilterButton>
            ))}
          </FilterRow>

          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          {/* Show subcategories */}
          {!selectedSubCategory && (
            <CardList>
              {subCategories
                .filter((subCat) =>
                  subCat.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((subCat) => (
                  <CategoryCard
                    key={subCat.id}
                    onClick={() => setSelectedSubCategory(subCat.name)}
                    style={{
                      backgroundImage: `url(${subCat.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <Overlay />
                    <CategoryName>{subCat.name}</CategoryName>
                  </CategoryCard>
                ))}
            </CardList>
          )}

          {/* Show items */}
          {selectedSubCategory && (
            <>
              <h1>{selectedSubCategory}</h1>
              <ItemsContainer>
                {items.length > 0 ? (
                  items.map((item) => {
                    const formatArray = (val) => {
                      if (!val) return []
                      if (Array.isArray(val)) return val // already an array
                      if (typeof val === 'string')
                        return val.replace(/[{}]/g, '').split(',') // string like "{Small,Medium}"
                      return [] // fallback
                    }

                    const formattedItem = {
                      ...item,
                      options: {
                        sizes: formatArray(item.sizes),
                        milk: formatArray(item.milks),
                        shots: formatArray(item.shots),
                        mixer: formatArray(item.mixers)
                      }
                    }

                    console.log('Item Options:', formattedItem.options) // verify

                    return (
                      <ItemCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        serves={item.serves}
                        price={item.price}
                        image={item.image}
                        cat={selectedSubCategory}
                        options={formattedItem.options}
                      />
                    )
                  })
                ) : (
                  <p>No items available for this category.</p>
                )}
              </ItemsContainer>
            </>
          )}

          {/* Floating Checkout
          <FloatingCheckout>
            <Buttons
              type="checkout"
              width="100%"
              onClick={() => navigate('/checkout')}
            >
              Checkout
            </Buttons>
          </FloatingCheckout> */}
        </PageContainer>
      </PageWrapper>
    </>
  )
}

export default HomePage

// Styled Components
const PageContainer = styled.div`
  position: relative;
  padding: 10px;
  background-color: black;
  min-height: 100vh;
  height: 100%;
`
const PageWrapper = styled.div`
  position: relative;
  min-height: 100%;
  color: white;
`
const BackgroundImage = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 250px;
  background-image: url(${Logo});
  background-size: cover;
  background-position: center;
  z-index: -1;
  filter: brightness(0.5);
`

const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  margin: 16px;
`

const FilterButton = styled.button`
  background-color: ${({ active }) => (active ? '#fff' : 'transparent')};
  color: ${({ active }) => (active ? '#000' : '#fff')};
  border: 3px solid #fff;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  height: 10%;
`
const Title = styled.div`
  font-size: 32px;
  font-family: 'Rubik', sans-serif;
  margin: 0px 16px;
`
const Location = styled.p`
  font-size: 14px;
  font-family: 'Rubik', sans-serif;
  margin: 0px 16px;
`
const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 16px;
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
`

const ItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 20px;
`

// const FloatingCheckout = styled.div`
//   position: fixed;
//   bottom: 20px;
//   right: 20px;
//   z-index: 100;
// `
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
`
const BackButton = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2; // above background
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`
