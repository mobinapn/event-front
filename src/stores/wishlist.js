// wishlist.js
import { defineStore } from "pinia"
import { ref, computed, watch } from "vue"
import { useAuthStore } from "./auth"
import { useRouter } from "vue-router"

export const useWishListStore = defineStore("wishlist", () => {
  const authStore = useAuthStore()
  const router = useRouter()

  // Store both trip IDs and full trip objects
  const favoriteTrips = ref([])
  const favoriteTripsData = ref([])
  
  // Load wishlist from localStorage on initialization
  const loadWishlist = () => {
    if (!authStore.isAuthenticated) {
      favoriteTrips.value = []
      favoriteTripsData.value = []
      return
    }
    
    const userId = authStore.user?.id
    try {
      const savedTrips = localStorage.getItem(`wishlist-${userId}`)
      if (savedTrips) {
        favoriteTrips.value = JSON.parse(savedTrips)
      }
      
      const savedTripsData = localStorage.getItem(`wishlist-data-${userId}`)
      if (savedTripsData) {
        favoriteTripsData.value = JSON.parse(savedTripsData)
      }
    } catch (error) {
      console.error('Failed to load wishlist from storage:', error)
    }
  }
  
  // Watch for changes in auth state to load appropriate wishlist
  watch(() => authStore.isAuthenticated, (isAuthenticated) => {
    if (isAuthenticated) {
      loadWishlist()
    } else {
      favoriteTrips.value = []
      favoriteTripsData.value = []
    }
  }, { immediate: true })
  
  // Watch for changes in the wishlist and save to localStorage
  watch(favoriteTrips, (newVal) => {
    if (authStore.isAuthenticated) {
      const userId = authStore.user?.id
      localStorage.setItem(`wishlist-${userId}`, JSON.stringify(newVal))
    }
  }, { deep: true })
  
  watch(favoriteTripsData, (newVal) => {
    if (authStore.isAuthenticated) {
      const userId = authStore.user?.id
      localStorage.setItem(`wishlist-data-${userId}`, JSON.stringify(newVal))
    }
  }, { deep: true })

  const isWishListed = computed(() => {
    return (tripId) => favoriteTrips.value.includes(tripId)
  })

  function toggleFavorite(tripId, tripData = null) {
    // Check if user is logged in
    if (!authStore.isAuthenticated) {
      router.push("/login")
      return
    }

    // Update the ID array
    const index = favoriteTrips.value.indexOf(tripId)
    if (index === -1) {
      favoriteTrips.value.push(tripId)
      
      // If we have the full trip data, add it to favoriteTripsData
      if (tripData) {
        favoriteTripsData.value.push(tripData)
      }
    } else {
      favoriteTrips.value.splice(index, 1)
      
      // Remove from favoriteTripsData as well
      const dataIndex = favoriteTripsData.value.findIndex(trip => trip.id === tripId)
      if (dataIndex !== -1) {
        favoriteTripsData.value.splice(dataIndex, 1)
      }
    }
  }

  // Add a trip to the wishlist with full data
  function addTripToWishlist(trip) {
    if (!isWishListed.value(trip.id)) {
      favoriteTrips.value.push(trip.id)
      favoriteTripsData.value.push(trip)
    }
  }

  // Get all favorited trips with full data
  function getFavoriteTripsWithData() {
    return favoriteTripsData.value
  }

  return {
    favoriteTrips,
    favoriteTripsData,
    isWishListed,
    toggleFavorite,
    addTripToWishlist,
    getFavoriteTripsWithData,
    loadWishlist,
  }
})