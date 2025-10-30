import { useState, useCallback } from 'react'
import axios from 'axios'
import { cacheManager } from '../utils/cache'

/**
 * Custom hook for fetching data with caching support
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Configuration options
 * @param {string} options.cacheKey - Key for caching the response
 * @param {Function} options.onSuccess - Callback on successful fetch
 * @param {Function} options.onError - Callback on error
 * @param {boolean} options.useCache - Whether to use caching (default: true)
 * @param {Object} options.axiosConfig - Additional axios configuration
 */
export const useFetch = (url, options = {}) => {
  const {
    cacheKey,
    onSuccess,
    onError,
    useCache = true,
    axiosConfig = {}
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    // Don't fetch if URL is null/undefined
    if (!url) {
      return null
    }

    setError(null)
    setLoading(true)

    // Check cache first if enabled
    if (useCache && cacheKey) {
      const cached = cacheManager.get(cacheKey)
      if (cached) {
        // console.log(`Using cached data for: ${cacheKey}`)
        setData(cached)
        setLoading(false)
        if (onSuccess) onSuccess(cached)
        return cached
      }
    }

    // Fetch from API
    try {
    //   const startTime = performance.now()
      const response = await axios.get(url, axiosConfig)
    //   const duration = performance.now() - startTime
    //   console.log(`API call to ${url} took ${duration.toFixed(2)}ms`)

      // Cache the response if enabled
      if (useCache && cacheKey) {
        cacheManager.set(cacheKey, response.data)
      }

      setData(response.data)
      if (onSuccess) onSuccess(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err?.message || 'Failed to fetch data'
      setError(errorMessage)
      if (onError) onError(err)
      console.error(`Error fetching ${url}:`, err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, cacheKey, useCache, axiosConfig]) // Removed onSuccess and onError from dependencies

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  const clearCache = useCallback(() => {
    if (cacheKey) {
      cacheManager.remove(cacheKey)
    }
  }, [cacheKey])

  return {
    data,
    loading,
    error,
    fetchData,
    refetch,
    clearCache,
    setData,
    setError
  }
}

export default useFetch
