import { useEffect, useState } from 'react'
const API_BASE_URL = 'http://localhost:5000'
export function SubCategoryManager() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subcategories, setSubcategories] = useState([])
  const [newSubCategory, setNewSubCategory] = useState('')
  const [image, setImage] = useState(null)

  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/categories`)
    const data = await res.json()
    setCategories(data)
  }

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return
    const res = await fetch(
      `${API_BASE_URL}/subcategories?categoryId=${categoryId}`
    )
    const data = await res.json()
    setSubcategories(data)
  }

  const addSubCategory = async () => {
    if (!newSubCategory || !selectedCategory) return
    const formData = new FormData()
    formData.append('categoryId', selectedCategory)
    formData.append('name', newSubCategory)
    if (image) formData.append('image', image)

    await fetch(`${API_BASE_URL}/subcategories`, {
      method: 'POST',
      body: formData
    })
    setNewSubCategory('')
    setImage(null)
    fetchSubCategories(selectedCategory)
  }

  const deleteSubCategory = async (id) => {
    await fetch(`${API_BASE_URL}/subcategories/${id}`, { method: 'DELETE' })
    fetchSubCategories(selectedCategory)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchSubCategories(selectedCategory)
  }, [selectedCategory])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Subcategories</h2>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <input
          value={newSubCategory}
          onChange={(e) => setNewSubCategory(e.target.value)}
          placeholder="Subcategory name"
          className="border p-2 rounded flex-1"
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button
          onClick={addSubCategory}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {subcategories.map((sub) => (
          <li
            key={sub.id}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <span>{sub.name}</span>
            <button
              onClick={() => deleteSubCategory(sub.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
