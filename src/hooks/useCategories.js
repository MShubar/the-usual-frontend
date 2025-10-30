import { useState, useEffect } from 'react'
import useFetch from './useFetch'
import { API_BACKEND } from '../views/API'

export const useCategories = () => {
  const [mainCategory, setMainCategory] = useState("")
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)

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

  const { data: subCategories, fetchData: fetchSubCategories } = useFetch(
    mainCategory ? `${API_BACKEND}/categories/${mainCategory.id}/sub` : null,
    {
      cacheKey: mainCategory ? `subcategories_${mainCategory.id}` : null,
      onError: (err) => setCategoriesError(err?.message || 'Failed to load subcategories')
    }
  )

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

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (mainCategory) {
      fetchSubCategories()
    }
  }, [mainCategory])

  useEffect(() => {
    if (mainCategory && selectedSubCategory) {
      setCategoriesError(null)
      fetchItems()
    }
  }, [mainCategory, selectedSubCategory])

  const handleCategorySelect = (cat) => {
    setMainCategory(cat)
    setSelectedSubCategory(null)
    setItems([])
  }

  const handleSubCategorySelect = (subCat) => {
    setSelectedSubCategory(subCat.name)
  }

  return {
    categories,
    subCategories,
    items,
    mainCategory,
    selectedSubCategory,
    loadingCategories,
    loadingItems,
    categoriesError,
    handleCategorySelect,
    handleSubCategorySelect,
    fetchCategories,
    fetchItems,
    setSelectedSubCategory
  }
}
