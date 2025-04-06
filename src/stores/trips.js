// trips.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
// import  {api } from 'src/boot/axios'
import axios from 'axios'

export const useTripsStore = defineStore('trips', () => {
  const trips = ref([])
  const searchResults = ref([])
  const currentTrip = ref(null)
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch all events
  // const fetchTrips = async () => {
  //   loading.value = true
  //   error.value = null
  //   try {
  //     const response = await api.get('/home/events')
  //     trips.value = response.data || []
  //     console.log('this is trips', trips.value)
  //     return trips.value
  //   } catch (err) {
  //     console.error('Error fetching events:', err)
  //     error.value = 'خطا در بارگذاری اطلاعات'
  //     return []
  //   } finally {
  //     loading.value = false
  //   }
  // }
  const fetchTrips = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('http://localhost:3000/events')
      trips.value = response.data || []
      console.log('this is trips', trips.value)
      return trips.value
    } catch (err) {
      console.error('Error fetching events:', err)
      error.value = 'خطا در بارگذاری اطلاعات'
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch all categories
  // const fetchCategories = async () => {
  //   loading.value = true
  //   error.value = null
  //   try {
  //     const response = await api.get('/home/categories')
  //     categories.value = response.data || []
  //     console.log('this is category', categories.value)
  //     return categories.value
  //   } catch (err) {
  //     console.error('Error fetching categories:', err)
  //     error.value = 'خطا در بارگذاری دسته بندی ها'
  //     return []
  //   } finally {
  //     loading.value = false
  //   }
  // }
  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('http://localhost:3000/categories')
      categories.value = response.data || []
      console.log('this is category', categories.value)
      return categories.value
    } catch (err) {
      console.error('Error fetching categories:', err)
      error.value = 'خطا در بارگذاری دسته بندی ها'
      return []
    } finally {
      loading.value = false
    }
  }

  // // Fetch trips for a specific category
  // const fetchTripsByCategory = async (categoryId) => {
  //   loading.value = true
  //   error.value = null
  //   try {
  //     const response = await api.get(`/home/category/${categoryId}`)
  //     const data = response.data
  //     trips.value = data.events || []
  //     console.log('Fetched category trips:', trips.value)
  //     return trips.value
     
  //   } catch (err) {
  //     console.error('Error fetching events by category:', err)
  //     error.value = 'خطا در بارگذاری اطلاعات'
  //     return []
  //   } finally {
  //     loading.value = false
  //   }
  // }
    // Fetch trips for a specific category
  // const fetchTripsByCategory = async (categoryId) => {
  //   loading.value = true
  //   error.value = null
  //   try {
  //     const response = await api.get(`/home/category/${categoryId}`)
  //     const data = response.data
  //     trips.value = data.events || []
  //     console.log('Fetched category trips:', trips.value)
  //     return trips.value
     
  //   } catch (err) {
  //     console.error('Error fetching events by category:', err)
  //     error.value = 'خطا در بارگذاری اطلاعات'
  //     return []
  //   } finally {
  //     loading.value = false
  //   }
  // }
    // Fetch trips for a specific category
    const fetchTripsByCategory = async (categoryId) => {
      loading.value = true
      error.value = null
      try {
        // Update the URL to match your JSON server structure
        const response = await axios.get(`http://localhost:3000/events?categoryId=${categoryId}`)
        // The JSON server will return an array directly, not nested under "events"
        trips.value = response.data || []
        console.log('Fetched category trips:', trips.value)
        return trips.value
      } catch (err) {
        console.error('Error fetching events by category:', err)
        error.value = 'خطا در بارگذاری اطلاعات'
        return []
      } finally {
        loading.value = false
      }
    }

  // Get a trip by its ID. If not found in the global state, fetch it.
  // const getTripById = async (id) => {
  //   let trip = trips.value.find((trip) => trip.id == id)
  //   if (!trip) {
  //     trip = await fetchTripById(id)
  //     return currentTrip.value
  //   } else {
  //     currentTrip.value = trip
  //     return trip
  //   }
  // }
  const getTripById = async (id) => {
    let trip = trips.value.find((t) => t.id == id)
    if (!trip) {
      console.log("Trip not found in store, fetching from API...");
      trip = await fetchTripById(id)
      currentTrip.value = trip // Ensure `currentTrip` is updated
    } else {
      currentTrip.value = trip
    }
    return currentTrip.value
  }
  
  
  // Fetch a single trip by its ID
  // const fetchTripById = async (id) => {
  //   loading.value = true
  //   error.value = null
  //   try {
  //     const response = await api.get(`/events/${id}`)
  //     currentTrip.value = response.data
  //     console.log('currentTrip', currentTrip.value)
  //     return response.data
  //   } catch (err) {
  //     console.error('Error fetching trip:', err)
  //     error.value = 'خطا در بارگذاری اطلاعات'
  //     return null
  //   } finally {
  //     loading.value = false
  //   }
  // }
  const fetchTripById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`http://localhost:3000/events/${id}`)
      currentTrip.value = response.data
      console.log('currentTrip', currentTrip.value)
      return response.data
    } catch (err) {
      console.error('Error fetching trip:', err)
      error.value = 'خطا در بارگذاری اطلاعات'
      return null
    } finally {
      loading.value = false
    }
  }
  

  
  const searchTrips = async (params) => {
    loading.value = true
    error.value = null
    searchResults.value = [] // Clear previous results first
    
    try {
      console.log('Searching with params:', params)
      
      // For testing, let's first see if we can get any data at all
      const allTrips = await fetchTrips()
      
      // If params are empty or undefined, return all trips
      if (!params || Object.keys(params).length === 0) {
        console.log('No search parameters provided, returning all trips')
        searchResults.value = [...allTrips]
        return searchResults.value
      }
      
      // Manual filtering approach
      let filteredResults = [...allTrips]
      
      // Filter by destination (city or location field - adjust based on your data structure)
      if (params.destination && params.destination.trim() !== '') {
        const destination = params.destination.trim().toLowerCase()
        console.log('Filtering by destination:', destination)
        
        // Try different fields that might contain location information
        filteredResults = filteredResults.filter(trip => {
          return (
            // Check all possible location fields in your data
            (trip.city && trip.city.toLowerCase().includes(destination)) ||
            (trip.location && trip.location.toLowerCase().includes(destination)) ||
            (trip.destination && trip.destination.toLowerCase().includes(destination)) ||
            (trip.title && trip.title.toLowerCase().includes(destination)) ||
            (trip.description && trip.description.toLowerCase().includes(destination))
          )
        })
        
        console.log('After destination filter:', filteredResults.length, 'results')
      }
      
      // Filter by date if needed
      if (params.start_date && params.start_date.trim() !== '') {
        const startDate = params.start_date.trim()
        console.log('Filtering by start date:', startDate)
        
        filteredResults = filteredResults.filter(trip => {
          // Adjust this based on how dates are stored in your data
          return (
            (trip.date && trip.date === startDate) ||
            (trip.startDate && trip.startDate === startDate)
          )
        })
        
        console.log('After date filter:', filteredResults.length, 'results')
      }
      
      // Set the search results
      searchResults.value = filteredResults
      console.log('Final search results:', searchResults.value.length)
      return searchResults.value
      
    } catch (err) {
      console.error('Error searching trips:', err)
      error.value = 'خطا در جستجوی سفرها'
      return []
    } finally {
      loading.value = false
    }
  }
  
  // Set search results directly
  const setSearchResults = (results) => {
    searchResults.value = results || []
  }
  
  // Clear search results
  const clearSearchResults = () => {
    searchResults.value = []
  }

  return {
    trips,
    searchResults,
    currentTrip,
    categories,
    loading,
    error,
    fetchTrips,
    fetchCategories,
    fetchTripsByCategory,
    getTripById,
    fetchTripById,
    searchTrips,
    setSearchResults,
    clearSearchResults
  }
})