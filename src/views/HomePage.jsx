import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Logo from '../assets/background.webp'
import { useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { API_BACKEND } from './API'
import ErrorMessage from '../components/ErrorMessage'
import UnderMaintenance from '../components/UnderMaintenance'
import DrawerMenu from '../components/DrawerMenu'
import Location from '../components/Location'
import FilterRow from '../components/FilterRow'
import BackButton from '../components/BackButton'
import CategoryGrid from '../components/CategoryGrid'
import ItemsGrid from '../components/ItemsGrid'
import FloatingCartButton from '../components/FloatingCartButton'
import useFetch from '../hooks/useFetch'
import SearchBar from '../components/SearchBar'

function HomePage() {
  const [mainCategory, setMainCategory] = useState("")
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      return []
    }
  }) 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const navigate = useNavigate()
  const [maintenance] = useState(false)

  const pageContainerRef = useRef(null)
  const lastScrollTop = useRef(0)
  const savedScrollRef = useRef({ winY: 0, contY: 0 })

  // Fetch categories with caching
  const {
    data: categories,
    loading: loadingCategories,
    error: categoriesError,
    fetchData: fetchCategories,
    setError: setCategoriesError
  } = useFetch(`${API_BACKEND}/categories`, {
    cacheKey: 'categories',
    onSuccess: (data) => {
      if (data.length > 0) {
        setMainCategory(data[0])
      }
    }
  })

  // Fetch subcategories with caching
  const {
    data: subCategories,
    fetchData: fetchSubCategories,
  } = useFetch(
    mainCategory ? `${API_BACKEND}/categories/${mainCategory.id}/sub` : null,
    {
      cacheKey: mainCategory ? `subcategories_${mainCategory.id}` : null,
      onSuccess: (data) => {
        // Sort subcategories alphabetically by name
        if (Array.isArray(data)) {
          data.sort((a, b) => a.name.localeCompare(b.name))
        }
      },
      onError: (err) => setCategoriesError(err?.message || 'Failed to load subcategories')
    }
  )

  // Fetch items with caching
  const {
    data: items,
    loading: loadingItems,
    fetchData: fetchItems,
    setData: setItems
  } = useFetch(
    mainCategory && selectedSubCategory 
      ? `${API_BACKEND}/categories/${mainCategory.id}/${selectedSubCategory}/items`
      : null,
    {
      cacheKey: mainCategory && selectedSubCategory 
        ? `items_${mainCategory.id}_${selectedSubCategory}`
        : null,
      onError: (err) => setCategoriesError(err?.message || 'Failed to load items')
    }
  )

  // Initial fetch
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch subcategories when main category changes
  useEffect(() => {
    if (mainCategory) {
      fetchSubCategories()
    }
  }, [mainCategory])

  // Fetch items when subcategory is selected
  useEffect(() => {
    if (mainCategory && selectedSubCategory) {
      setCategoriesError(null)
      fetchItems()
    }
  }, [mainCategory, selectedSubCategory])

  // Scroll-to-refresh effect
  useEffect(() => {
    const container = pageContainerRef.current
    if (!container) return

    let ticking = false
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = container.scrollTop
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
  }, [fetchCategories])

  // Prevent window/container scroll jump when opening/closing drawer (no navigation)
  useEffect(() => {
    const container = pageContainerRef.current

    const saveScroll = () => {
      savedScrollRef.current.winY =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      savedScrollRef.current.contY = container?.scrollTop || 0
    }

    const restoreScroll = () => {
      // Restore window first
      window.scrollTo({ top: savedScrollRef.current.winY, behavior: 'auto' })
      // Restore container after layout settles
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTo({ top: savedScrollRef.current.contY, behavior: 'auto' })
        })
      }
    }

    if (isDrawerOpen) {
      // Save current positions
      saveScroll()
      // Lock body to prevent background scroll and jumping
      const y = savedScrollRef.current.winY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${y}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'
    } else {
      // Unlock and restore after closing
      const top = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      if (top) {
        // Restore window scroll
        const y = -parseInt(top, 10) || 0
        window.scrollTo({ top: y, behavior: 'auto' })
      }
      // Restore container scroll as well
      restoreScroll()
      // Double-restore to cover transitions/layout shifts
      setTimeout(restoreScroll, 0)
    }

    return () => {
      // Cleanup in case component unmounts while locked
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
    }
  }, [isDrawerOpen])

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const addToCart = (item) => {
    setCart(prevCart => {
      const itemKey = `${item.id}-${item.size || ''}-${item.milk || ''}-${item.shots || ''}-${item.mixer || ''}`;
      
      const existingItem = prevCart.find(cartItem => {
        const cartItemKey = `${cartItem.id}-${cartItem.size || ''}-${cartItem.milk || ''}-${cartItem.shots || ''}-${cartItem.mixer || ''}`;
        return cartItemKey === itemKey;
      });

      let newCart;
      if (existingItem) {
        newCart = prevCart.map(cartItem => {
          const cartItemKey = `${cartItem.id}-${cartItem.size || ''}-${cartItem.milk || ''}-${cartItem.shots || ''}-${cartItem.mixer || ''}`;
          return cartItemKey === itemKey
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem;
        });
      } else {
        newCart = [...prevCart, { ...item }];
      }
      return newCart;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
      // Dispatch custom event to notify other components about cart update
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cart])

  // Listen for cart updates from other components (like when navigating back from checkout)
  useEffect(() => {
    const handleCartUpdate = (event) => {
      try {
        const savedCart = localStorage.getItem('cart')
        const parsedCart = savedCart ? JSON.parse(savedCart) : []
        
        // Only update if cart actually changed to prevent infinite loop
        setCart(prevCart => {
          const prevCartString = JSON.stringify(prevCart)
          const newCartString = JSON.stringify(parsedCart)
          
          if (prevCartString !== newCartString) {
            return parsedCart
          }
          return prevCart
        })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }

    window.addEventListener('cart-updated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate)
    }
  }, [])

  const handleCategorySelect = (cat) => {
    setMainCategory(cat)
    setSelectedSubCategory(null)
    setItems([])
  }

  const handleSubCategoryClick = (subCat) => {
    setSelectedSubCategory(subCat.name)
    setSearchQuery('')
    // Scroll to top of page
    if (pageContainerRef.current) {
      pageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // Also scroll window to top in case container scroll doesn't work
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Listen to item modal open/close events
  useEffect(() => {
    const handler = (e) => setIsItemModalOpen(Boolean(e?.detail?.open))
    window.addEventListener('item-modal-toggle', handler)
    return () => window.removeEventListener('item-modal-toggle', handler)
  }, [])

  if (maintenance) {
    return <UnderMaintenance message="Site is under maintenance. Please check back soon." />
  }

  return (
    <>
      <PageWrapper>
        <BackButton 
          show={selectedSubCategory && !isDrawerOpen && !isItemModalOpen}
          onClick={() => {
            setSelectedSubCategory(null)
            setSearchQuery('')
            // Scroll to top of page
            if (pageContainerRef.current) {
              pageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
            }
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
        
        {!isItemModalOpen && (
          <MenuButton 
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation?.()
              // Tell ScrollToTop (App.jsx) to ignore this UI interaction
              window.dispatchEvent(new CustomEvent('suppress-scroll-top', { detail: { ttl: 800 } }))
              // Toggle drawer
              setIsDrawerOpen(prev => !prev)
            }}
            $hasBackButton={selectedSubCategory}
          >
            <MenuIcon />
          </MenuButton>
        )}
        <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <BackgroundImage />
        <PageContainer ref={pageContainerRef}>
          <Location />

          {categoriesError && (
            <div style={{ margin: 16 }}>
              <ErrorMessage
                title="Load error"
                message={categoriesError}
                onRetry={() => {
                  if (!categories?.length) fetchCategories()
                  if (selectedSubCategory) {
                    fetchItems()
                  }
                }}
              />
            </div>
          )}

          <FilterRow
            categories={categories || []}
            loading={loadingCategories}
            activeId={mainCategory?.id}
            onCategorySelect={handleCategorySelect}
          />

            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          <ContentWrapper>
            <TransitionContainer $show={!selectedSubCategory}>
              <CategoryGrid
                categories={subCategories || []}
                loading={loadingCategories && (!subCategories || subCategories.length === 0)}
                searchQuery={searchQuery}
                onCategoryClick={handleSubCategoryClick}
                skeletonCount={3}
                notFoundTitle="No subcategories"
                notFoundMessage="No subcategories found."
              />
            </TransitionContainer>

            <TransitionContainer $show={!!selectedSubCategory}>
              <ItemsGrid
                items={items || []}
                loading={loadingItems}
                searchQuery={searchQuery}
                categoryName={selectedSubCategory}
                onAddToCart={addToCart}
                skeletonCount={6}
                notFoundTitle="No items"
                notFoundMessage="No items available for this category."
              />
            </TransitionContainer>
          </ContentWrapper>
        </PageContainer>

        <FloatingCartButton
          show={cart.length > 0}
          itemCount={getTotalItems()}
          totalPrice={getTotalPrice()}
          currency="BD"
          label="Checkout"
          onClick={() => navigate('/checkout')}
          animate={true}
        />
        
      </PageWrapper>
    </>
  )
}

export default HomePage

const PageContainer = styled.div`
  position: relative;
  padding: 10px;
  background-color: black;
  min-height: 100vh;
  height: 100%;
`
const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  color: white;
  overflow-x: hidden;
  width: 100%;
  background: #000;
  
  /* Ensure notch area is black */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: env(safe-area-inset-top);
    background: #000;
    z-index: 9999;
    pointer-events: none;
  }
`

const BackgroundImage = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 250px;
  background-image: url(${Logo});
  background-size: cover;
  background-position: center;
  z-index: 0;
  
  /* Add padding at top for notch instead of margin */
  padding-top: env(safe-area-inset-top);
  
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
    height: 400px;
  }
`


const ContentWrapper = styled.div`
  position: relative;
  min-height: 300px;
`

const TransitionContainer = styled.div`
  position: ${props => props.$show ? 'relative' : 'absolute'};
  top: 0;
  left: 0;
  right: 0;
  opacity: ${props => props.$show ? 1 : 0};
  transform: translateX(${props => props.$show ? '0' : '30px'});
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${props => props.$show ? 'auto' : 'none'};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  
  ${props => !props.$show && `
    max-height: 0;
    overflow: hidden;
  `}
`

const MenuButton = styled.button.attrs({ type: 'button' })`
  position: fixed;
  top: calc(16px + env(safe-area-inset-top));
  right: calc(16px + env(safe-area-inset-right));
  z-index: 10000;
  background: rgba(0, 0, 0, 0.8);
  color: #ff9800;
  border: none;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: background 0.2s;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 152, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    right: calc(12px + env(safe-area-inset-right));
    top: calc(12px + env(safe-area-inset-top));
  }
`

