import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Logo from '../assets/background.png'
import ItemCard from '../components/ItemCard'
import { useNavigate } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuIcon from '@mui/icons-material/Menu'
import { API_BACKEND } from './API'
import SkeletonCard from '../components/SkeletonCard'
import ErrorMessage from '../components/ErrorMessage'
import NotFound from '../components/NotFound'
import UnderMaintenance from '../components/UnderMaintenance'
import DrawerMenu from '../components/DrawerMenu'
import { cacheManager } from '../utils/cache'

function HomePage() {
  const [categories, setCategories] = useState([])
  const [mainCategory, setMainCategory] = useState("")
  const [subCategories, setSubCategories] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      return []
    }
  }) // Initialize cart from localStorage
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const navigate = useNavigate()

  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)
  const [error, setError] = useState(null)
  const [maintenance] = useState(false)

  const pageContainerRef = useRef(null)
  const lastScrollTop = useRef(0)

  const fetchCategories = () => {
    setError(null)
    setLoadingCategories(true)
    
    // Check cache first
    const cached = cacheManager.get('categories')
    if (cached) {
      console.log('Using cached categories')
      setCategories(cached)
      if (cached.length > 0) {
        setMainCategory(cached[0])
      }
      setLoadingCategories(false)
      return
    }

    // Fetch from API
    axios.get(`${API_BACKEND}/categories`)
      .then((res) => {
        cacheManager.set('categories', res.data)
        setCategories(res.data)
        if (res.data.length > 0) {
          setMainCategory(res.data[0])
        }
      })
      .catch((err) => setError(err?.message || 'Failed to load categories'))
      .finally(() => setLoadingCategories(false))
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!mainCategory) return
    
    // Check cache first
    const cacheKey = `subcategories_${mainCategory.id}`
    const cached = cacheManager.get(cacheKey)
    if (cached) {
      console.log('Using cached subcategories')
      setSubCategories(cached)
      return
    }

    // Fetch from API
    axios
      .get(`${API_BACKEND}/categories/${mainCategory.id}/sub`)
      .then((res) => {
        cacheManager.set(cacheKey, res.data)
        setSubCategories(res.data)
      })
      .catch((err) => setError(err?.message || 'Failed to load subcategories'))
  }, [mainCategory])

  useEffect(() => {
    if (!mainCategory || !selectedSubCategory) return
    setError(null)
    setLoadingItems(true)
    
    // Check cache first
    const cacheKey = `items_${mainCategory.id}_${selectedSubCategory}`
    const cached = cacheManager.get(cacheKey)
    if (cached) {
      console.log('Using cached items')
      setItems(cached)
      setLoadingItems(false)
      return
    }

    // Fetch from API
    const startTime = performance.now()
    axios
      .get(
        `${API_BACKEND}/categories/${mainCategory.id}/${selectedSubCategory}/items`
      )
      .then((res) => {
        const duration = performance.now() - startTime
        console.log(`Items API took ${duration.toFixed(2)}ms`)
        cacheManager.set(cacheKey, res.data)
        setItems(res.data)
      })
      .catch((err) => setError(err?.message || 'Failed to load items'))
      .finally(() => setLoadingItems(false))
  }, [mainCategory, selectedSubCategory])

  // Add scroll-to-refresh effect
  useEffect(() => {
    const container = pageContainerRef.current
    if (!container) return

    let ticking = false
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = container.scrollTop
          // If user scrolled up to top (with a small threshold)
          if (scrollTop <= 0 && lastScrollTop.current > 10) {
            fetchCategories()
          }
          lastScrollTop.current = scrollTop
          ticking = false
        })
        ticking = true
      }
    }
    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const addToCart = (item) => {
    setCart(prevCart => {
      // Create a unique identifier for items with different customizations
      const itemKey = `${item.id}-${item.size || ''}-${item.milk || ''}-${item.shots || ''}-${item.mixer || ''}`;
      
      const existingItem = prevCart.find(cartItem => {
        const cartItemKey = `${cartItem.id}-${cartItem.size || ''}-${cartItem.milk || ''}-${cartItem.shots || ''}-${cartItem.mixer || ''}`;
        return cartItemKey === itemKey;
      });

      if (existingItem) {
        const newCart = prevCart.map(cartItem => {
          const cartItemKey = `${cartItem.id}-${cartItem.size || ''}-${cartItem.milk || ''}-${cartItem.shots || ''}-${cartItem.mixer || ''}`;
          return cartItemKey === itemKey
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem;
        });
        return newCart;
      } else {
        const newCart = [...prevCart, { ...item }];
        return newCart;
      }
    });
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cart])

  if (maintenance) {
    return <UnderMaintenance message="Site is under maintenance. Please check back soon." />
  }

  return (
    <>
      <PageWrapper>
        {selectedSubCategory && !isDrawerOpen && (
          <BackButton onClick={() => {
            setSelectedSubCategory(null)
            setSearchQuery('') // clear search bar on back
          }}>
            ← Back
          </BackButton>
        )}
        
        <MenuButton onClick={() => setIsDrawerOpen(true)}>
          <MenuIcon />
        </MenuButton>

        <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

        <BackgroundImage />
        <PageContainer ref={pageContainerRef}>
          <div style={{ gap: '10px' }}>
            <Title>The Usual</Title>
            <Location>
              <LocationOnIcon />
              Bahrain, Manama
            </Location>
          </div>

          {error && (
            <div style={{ margin: 16 }}>
              <ErrorMessage
                title="Load error"
                message={error}
                onRetry={() => {
                  if (!categories.length) fetchCategories()
                  if (selectedSubCategory) {
                    setSelectedSubCategory(selectedSubCategory)
                  }
                }}
              />
            </div>
          )}

          <FilterRow>
            {loadingCategories ? (
              <SkeletonCard count={4} variant="item" />
            ) : categories.length === 0 ? (
              <NotFound title="No categories" message="No categories available." />
            ) : (
              categories.map((cat) => (
                <FilterButton
                  key={cat.id}
                  $active={cat.id === mainCategory?.id}
                  onClick={() => {
                    const selectedCat = categories.find(c => c.id === cat.id)
                    setMainCategory(selectedCat)
                    setSelectedSubCategory(null)
                    setItems([])
                  }}
                >
                  {cat.name}
                </FilterButton>
              ))
            )}
          </FilterRow>

          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          {!selectedSubCategory && (
            <CardList>
              {subCategories.length === 0 && loadingCategories ? (
                <SkeletonCard count={3} variant="subcategory" fullWidth />
              ) : subCategories.length === 0 ? (
                <NotFound title="No subcategories" message="No subcategories found." />
              ) : (
                subCategories
                  .filter((subCat) =>
                    subCat.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((subCat) => (
                    <CategoryCard
                      key={subCat.id}
                      onClick={() => {
                        setSelectedSubCategory(subCat.name)
                        setSearchQuery('') // clear search bar on subcategory select
                      }}
                      style={{
                        backgroundImage: `url(${subCat.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <Overlay />
                      <CategoryName>{subCat.name}</CategoryName>
                    </CategoryCard>
                  ))
              )}
            </CardList>
          )}

          {selectedSubCategory && (
            <>
              <h1>{selectedSubCategory}</h1>
              <ItemsContainer>
                {loadingItems ? (
                  <SkeletonCard count={6} variant="item" />
                ) : items.length > 0 ? (
                  items
                    .filter(item =>
                      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => {
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
                          cat={selectedSubCategory}
                          options={formattedItem.options}
                          onAddToCart={addToCart}
                        />
                      )
                    })
                ) : (
                  <NotFound title="No items" message="No items available for this category." />
                )}
              </ItemsContainer>
            </>
          )}
        </PageContainer>

        {/* Change back to conditional rendering */}
        {cart.length > 0 && (
          <FloatingCheckout>
            <CheckoutButton 
              onClick={() => navigate('/checkout')}
              className="checkout-pulse"
            >
              <CheckoutContent>
                <CartIconWrapper>
                  <ShoppingCartIcon />
                  {getTotalItems() > 0 && (
                    <CartBadge>{getTotalItems()}</CartBadge>
                  )}
                </CartIconWrapper>
                <CheckoutText>
                  <CheckoutLabel>Checkout</CheckoutLabel>
                  <CheckoutPrice>{getTotalPrice().toFixed(2)}BD</CheckoutPrice>
                </CheckoutText>
              </CheckoutContent>
            </CheckoutButton>
          </FloatingCheckout>
        )}
      </PageWrapper>
    </>
  )
}

export default HomePage

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  color: white;
  background-color: black;
`

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(250px + env(safe-area-inset-top, 0px));
  background-image: url(${Logo});
  background-size: cover;
  background-position: center;
  z-index: 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%);
    pointer-events: none;
  }
  
  @media (min-width: 769px) {
    height: calc(400px + env(safe-area-inset-top, 0px));
  }
`

const PageContainer = styled.div`
  position: relative;
  z-index: 1;
  padding: 10px;
  padding-left: max(10px, calc(10px + env(safe-area-inset-left)));
  padding-right: max(10px, calc(10px + env(safe-area-inset-right)));
  padding-top: calc(250px + env(safe-area-inset-top, 0px));
  background-color: transparent;
  min-height: 100vh;
  
  @media (min-width: 769px) {
    padding-top: calc(400px + env(safe-area-inset-top, 0px));
  }
`

const FilterRow = styled.div`
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

const ItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 20px;
`

const FloatingCheckout = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;

  .checkout-pulse {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
    }
  }
`

const CheckoutButton = styled.button`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  border: none;
  border-radius: 25px;
  padding: 16px 24px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(255, 152, 0, 0.3);
  transition: all 0.3s ease;
  min-width: 140px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(255, 152, 0, 0.4);
    background: linear-gradient(135deg, #ffb74d 0%, #ff9800 100%);
  }

  &:active {
    transform: translateY(0);
  }
`

const CheckoutContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
`

const CartIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  svg {
    font-size: 24px;
  }
`

const CartBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #d32f2f;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
`

const CheckoutText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const CheckoutLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
`

const CheckoutPrice = styled.span`
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  margin-top: 2px;
`

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
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  color: #ff9800;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 152, 0, 0.2);
  }
`

const MenuButton = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  color: #ff9800;
  border: none;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 152, 0, 0.2);
  }
`