import { useEffect, useState } from 'react'
const API_BASE_URL = 'http://localhost:5000'
export function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [image, setImage] = useState(null)

  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/categories`)
    const data = await res.json()
    setCategories(data)
  }

  const addCategory = async () => {
    if (!newCategory) return
    const formData = new FormData()
    formData.append('name', newCategory)
    if (image) formData.append('image', image)

    await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      body: formData
    })
    setNewCategory('')
    setImage(null)
    fetchCategories()
  }

  const deleteCategory = async (id) => {
    await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Categories</h2>
      <div className="flex gap-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category name"
          className="border p-2 rounded flex-1"
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button
          onClick={addCategory}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <span>{cat.name}</span>
            <button
              onClick={() => deleteCategory(cat.id)}
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
