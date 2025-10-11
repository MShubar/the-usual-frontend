import { useEffect, useState } from 'react'

const API_BASE_URL = 'http://localhost:5000'

// enums
const Sizes = Object.freeze({
  SMALL: 'Small',
  MEDIUM: 'Medium',
  LARGE: 'Large'
})

const Milks = Object.freeze({
  WHOLE: 'Whole',
  SKIM: 'Skim',
  SOY: 'Soy',
  ALMOND: 'Almond'
})

const Shots = Object.freeze({
  SINGLE: 'Single',
  DOUBLE: 'Double',
  TRIPLE: 'Triple'
})

const Mixers = Object.freeze({
  VANILLA: 'Vanilla',
  CARAMEL: 'Caramel',
  HAZELNUT: 'Hazelnut'
})

export function ItemManager() {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [selectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [items, setItems] = useState([])

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedMilk, setSelectedMilk] = useState('')

  // test logging
  useEffect(() => {
    console.log('Categories:', categories)
    console.log('Subcategories:', subcategories)
    console.log('Items:', items)

    console.log('Enums -> Sizes:', Object.values(Sizes))
    console.log('Enums -> Milks:', Object.values(Milks))
    console.log('Enums -> Shots:', Object.values(Shots))
    console.log('Enums -> Mixers:', Object.values(Mixers))
  }, [categories, subcategories, items])

  // fetchers
  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/categories`)
    const data = await res.json()
    console.log('Fetched categories:', data)
    setCategories(data)
  }

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return
    const res = await fetch(
      `${API_BASE_URL}/subcategories?categoryId=${categoryId}`
    )
    const data = await res.json()
    console.log('Fetched subcategories:', data)
    setSubcategories(data)
  }

  const fetchItems = async (subcategoryId) => {
    if (!subcategoryId) return
    const res = await fetch(
      `${API_BASE_URL}/products?subcategoryId=${subcategoryId}`
    )
    const data = await res.json()
    console.log('Fetched items:', data)
    const filteredItems = data.map(({ id, name }) => ({ id, name }))
    setItems(filteredItems)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchSubCategories(selectedCategory)
    setSelectedSubCategory('')
  }, [selectedCategory])

  useEffect(() => {
    fetchItems(selectedSubCategory)
  }, [selectedSubCategory])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Items</h2>

      {/* DEBUG inline */}
      <pre>{JSON.stringify({ categories, subcategories, items }, null, 2)}</pre>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={selectedSize}
          onChange={(e) => {
            console.log('Selected size:', e.target.value)
            setSelectedSize(e.target.value)
          }}
          className="border p-2 rounded"
        >
          <option value="">Select size</option>
          {Object.values(Sizes).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={selectedMilk}
          onChange={(e) => {
            console.log('Selected milk:', e.target.value)
            setSelectedMilk(e.target.value)
          }}
          className="border p-2 rounded"
        >
          <option value="">Select milk</option>
          {Object.values(Milks).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
