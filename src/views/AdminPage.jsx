import React, { useEffect, useMemo, useState } from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider
} from '@mui/material'
import { styled } from '@mui/system'

const API = (path) => `http://localhost:5000${path}`
const Box = styled(Paper)({ padding: 16, borderRadius: 12 })

export default function AdminPage() {
  const [catNames, setCatNames] = useState([])
  const [catsAdmin, setCatsAdmin] = useState([])
  const [subs, setSubs] = useState([])
  const [selectedCatName, setSelectedCatName] = useState('')
  const [selectedSubId, setSelectedSubId] = useState('')
  const [items, setItems] = useState([])
  const [enums, setEnums] = useState({
    sizes: [],
    milks: [],
    shots: [],
    mixers: []
  })

  // forms
  const [catForm, setCatForm] = useState({
    id: null,
    name: '',
    imageFile: null
  })
  const [subForm, setSubForm] = useState({
    id: null,
    name: '',
    imageFile: null
  })
  const [itemForm, setItemForm] = useState({
    id: null,
    name: '',
    description: '',
    serves: '',
    price: '',
    imageFile: null,
    sizes: [],
    milks: [],
    shots: [],
    mixers: []
  })

  async function loadEnums() {
    const r = await fetch(API('/products/enums'))
    const data = await r.json()

    // Ensure all enum fields are arrays
    const normalized = {}
    for (const key of ['sizes', 'milks', 'shots', 'mixers']) {
      const val = data[key]
      if (Array.isArray(val)) {
        normalized[key] = val
      } else if (typeof val === 'string') {
        // If backend sends comma-separated string
        normalized[key] = val.split(',').map((s) => s.trim())
      } else if (val && typeof val === 'object') {
        // If backend sends object like {0:'Small',1:'Medium'}
        normalized[key] = Object.values(val)
      } else {
        // Default to empty array
        normalized[key] = []
      }
    }

    setEnums(normalized)
  }

  useEffect(() => {
    loadEnums()
  }, [])

  // --- LOADERS
  async function loadPublicCategories() {
    const r = await fetch(API('/categories'))
    setCatNames(await r.json())
  }
  async function loadAdminCategories() {
    const r = await fetch(API('/admin/categories'))
    setCatsAdmin(await r.json())
  }
  async function loadSubsByCatName(catName) {
    if (!catName) return setSubs([])
    const r = await fetch(API(`/categories/${encodeURIComponent(catName)}/sub`))
    setSubs(await r.json())
  }
  async function loadItems(catName, subId) {
    if (!catName || !subId) return setItems([])
    const sub = subs.find((s) => String(s.id) === String(subId))
    if (!sub) return
    const r = await fetch(
      API(
        `/categories/${encodeURIComponent(catName)}/${encodeURIComponent(
          sub.name
        )}/items`
      )
    )
    setItems(await r.json())
  }

  useEffect(() => {
    loadPublicCategories()
    loadAdminCategories()
  }, [])
  useEffect(() => {
    loadSubsByCatName(selectedCatName)
    setSelectedSubId('')
  }, [selectedCatName])
  useEffect(() => {
    loadItems(selectedCatName, selectedSubId)
  }, [selectedSubId])

  // --- HELPERS
  const selectedCatAdmin = useMemo(
    () => catsAdmin.find((c) => c.name === selectedCatName) || null,
    [catsAdmin, selectedCatName]
  )

  // --- CATEGORY CRUD
  async function saveCategory() {
    if (!catForm.name) return alert('Category name required')
    const fd = new FormData()
    fd.append('name', catForm.name)
    if (catForm.imageFile) fd.append('image', catForm.imageFile)
    const method = catForm.id ? 'PUT' : 'POST'
    const url = catForm.id
      ? API(`/admin/categories/${catForm.id}`)
      : API('/admin/categories')
    const r = await fetch(url, { method, body: fd })
    if (!r.ok) return alert('Category save failed')
    setCatForm({ id: null, name: '', imageFile: null })
    await loadPublicCategories()
    await loadAdminCategories()
  }
  async function deleteCategory(id) {
    if (!window.confirm('Delete category and its subs/items?')) return
    const r = await fetch(API(`/admin/categories/${id}`), { method: 'DELETE' })
    if (!r.ok) return alert('Delete failed')
    if (selectedCatAdmin?.id === id) {
      setSelectedCatName('')
      setSelectedSubId('')
    }
    await loadPublicCategories()
    await loadAdminCategories()
  }

  // --- SUBCATEGORY CRUD
  async function saveSub() {
    if (!selectedCatAdmin) return alert('Pick a category first')
    if (!subForm.name) return alert('Subcategory name required')
    const fd = new FormData()
    fd.append('categoryId', selectedCatAdmin.id)
    fd.append('name', subForm.name)
    if (subForm.imageFile) fd.append('image', subForm.imageFile)
    const method = subForm.id ? 'PUT' : 'POST'
    const url = subForm.id
      ? API(`/admin/subcategories/${subForm.id}`)
      : API('/admin/subcategories')
    const r = await fetch(url, { method, body: fd })
    if (!r.ok) return alert('Subcategory save failed')
    setSubForm({ id: null, name: '', imageFile: null })
    await loadSubsByCatName(selectedCatName)
  }
  async function deleteSub(id) {
    if (!window.confirm('Delete subcategory and its items?')) return
    const r = await fetch(API(`/admin/subcategories/${id}`), {
      method: 'DELETE'
    })
    if (!r.ok) return alert('Delete failed')
    if (String(selectedSubId) === String(id)) setSelectedSubId('')
    await loadSubsByCatName(selectedCatName)
  }

  // --- ITEM CRUD
  async function saveItem() {
    if (!selectedSubId) return alert('Pick subcategory')
    if (!itemForm.name || !itemForm.price) return alert('Name & price required')

    const fd = new FormData()
    fd.append('subcategoryId', selectedSubId)
    fd.append('name', itemForm.name)
    fd.append('description', itemForm.description)
    fd.append('serves', itemForm.serves)
    fd.append('price', itemForm.price)
    Object.keys(enums).forEach((key) => {
      fd.append(key, JSON.stringify(itemForm[key] || []))
    })

    if (itemForm.imageFile) fd.append('image', itemForm.imageFile)

    const method = itemForm.id ? 'PUT' : 'POST'
    const url = itemForm.id ? API(`/products/${itemForm.id}`) : API('/products')
    const r = await fetch(url, { method, body: fd })
    if (!r.ok) {
      const t = await r.text()
      return alert('Save failed: ' + t)
    }

    setItemForm({
      id: null,
      name: '',
      description: '',
      serves: '',
      price: '',
      imageFile: null,
      sizes: [],
      milks: [],
      shots: [],
      mixers: []
    })
    await loadItems(selectedCatName, selectedSubId)
  }
  async function deleteItem(id) {
    if (!window.confirm('Delete item?')) return
    await fetch(API(`/products/${id}`), { method: 'DELETE' })
    await loadItems(selectedCatName, selectedSubId)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Admin Dashboard
      </Typography>

      {/* CATEGORIES */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Categories</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <Select
              fullWidth
              displayEmpty
              value={selectedCatName}
              onChange={(e) => setSelectedCatName(e.target.value)}
            >
              <MenuItem value="">Select category</MenuItem>
              {catNames.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Name"
              value={catForm.name}
              onChange={(e) =>
                setCatForm((c) => ({ ...c, name: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={2}>
            <Button component="label" fullWidth variant="outlined">
              {catForm.imageFile ? catForm.imageFile.name : 'Image'}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCatForm((c) => ({
                    ...c,
                    imageFile: e.target.files?.[0] || null
                  }))
                }
              />
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button fullWidth variant="contained" onClick={saveCategory}>
              {catForm.id ? 'Save' : 'Create'}
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={1}>
          {catsAdmin.map((c) => (
            <Grid item key={c.id}>
              <Button
                size="small"
                variant={c.name === selectedCatName ? 'contained' : 'outlined'}
                onClick={() => setSelectedCatName(c.name)}
              >
                {c.name}
              </Button>
              <Button
                size="small"
                sx={{ ml: 1 }}
                onClick={() =>
                  setCatForm({ id: c.id, name: c.name, imageFile: null })
                }
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                sx={{ ml: 1 }}
                onClick={() => deleteCategory(c.id)}
              >
                Delete
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* SUBCATEGORIES */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Subcategories</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <Select
              fullWidth
              displayEmpty
              value={selectedSubId}
              onChange={(e) => setSelectedSubId(e.target.value)}
            >
              <MenuItem value="">Select subcategory</MenuItem>
              {subs.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Name"
              value={subForm.name}
              onChange={(e) =>
                setSubForm((s) => ({ ...s, name: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={2}>
            <Button component="label" fullWidth variant="outlined">
              {subForm.imageFile ? subForm.imageFile.name : 'Image'}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSubForm((s) => ({
                    ...s,
                    imageFile: e.target.files?.[0] || null
                  }))
                }
              />
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button fullWidth variant="contained" onClick={saveSub}>
              {subForm.id ? 'Save' : 'Create'}
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={1}>
          {subs.map((s) => (
            <Grid item key={s.id}>
              <Button
                size="small"
                variant={
                  String(selectedSubId) === String(s.id)
                    ? 'contained'
                    : 'outlined'
                }
                onClick={() => setSelectedSubId(String(s.id))}
              >
                {s.name}
              </Button>
              <Button
                size="small"
                sx={{ ml: 1 }}
                onClick={() =>
                  setSubForm({ id: s.id, name: s.name, imageFile: null })
                }
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                sx={{ ml: 1 }}
                onClick={() => deleteSub(s.id)}
              >
                Delete
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ITEMS */}
      <Box>
        <Typography variant="h6">Items</Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              label="Name"
              fullWidth
              value={itemForm.name}
              onChange={(e) =>
                setItemForm((f) => ({ ...f, name: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Description"
              fullWidth
              value={itemForm.description}
              onChange={(e) =>
                setItemForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Serves"
              fullWidth
              value={itemForm.serves}
              onChange={(e) =>
                setItemForm((f) => ({ ...f, serves: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={itemForm.price}
              onChange={(e) =>
                setItemForm((f) => ({ ...f, price: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={2}>
            <Button component="label" fullWidth variant="outlined">
              {itemForm.imageFile ? itemForm.imageFile.name : 'Image'}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setItemForm((f) => ({
                    ...f,
                    imageFile: e.target.files?.[0] || null
                  }))
                }
              />
            </Button>
          </Grid>
          {/* ENUM SELECTS */}
          {Object.entries(enums).map(([key, options]) => (
            <Grid item xs={3} key={key}>
              <Select
                multiple
                fullWidth
                value={itemForm[key] || []}
                onChange={(e) =>
                  setItemForm((f) => ({ ...f, [key]: e.target.value }))
                }
              >
                {options.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={saveItem}
              disabled={!selectedSubId}
            >
              {itemForm.id ? 'Save Item' : 'Create Item'}
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {items.map((it) => (
            <Grid item xs={12} sm={6} md={4} key={it.id}>
              <Card>
                {it.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={it.image}
                    alt={it.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{it.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${Number(it.price).toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      setItemForm({
                        id: it.id,
                        name: it.name,
                        description: it.description || '',
                        serves: it.serves || '',
                        price: it.price,
                        imageFile: null,
                        sizes: it.sizes || [],
                        milks: it.milks || [],
                        shots: it.shots || [],
                        mixers: it.mixers || []
                      })
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteItem(it.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}
