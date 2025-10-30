const fetchCategories = () => {
    setError(null)
    setLoadingCategories(true)
    
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