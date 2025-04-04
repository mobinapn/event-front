//reservation.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useReservationStore = defineStore('reservation', () => {
  const reservationData = ref(null)
  const transactionId = ref(null)
  const formState = ref({
    passengerDetails: [], // Store form input values
    checkoutFormState: {
      termsAccepted: false
    }
  })

  // Computed properties to easily access room and guest information
  const totalRooms = computed(() => 
    reservationData.value?.rooms?.length || 0
  )

  const totalAdults = computed(() => 
    reservationData.value?.rooms?.reduce((sum, room) => sum + room.adults, 0) || 0
  )

  const totalChildren = computed(() => 
    reservationData.value?.rooms?.reduce((sum, room) => sum + room.children, 0) || 0
  )

  const totalGuests = computed(() => 
    totalAdults.value + totalChildren.value
  )

  const roomsBreakdown = computed(() => {
    if (!reservationData.value?.rooms) return []
    
    return reservationData.value.rooms.map((room, index) => ({
      roomNumber: index + 1,
      adults: room.adults,
      children: room.children
    }))
  })

  const setReservationData = (data) => {
    // Ensure we have the rooms data structure
    if (!data.rooms) {
      // For backward compatibility - convert old format to new format if needed
      data.rooms = [{ 
        adults: data.guests?.adults || 1, 
        children: data.guests?.children || 0 
      }]
    }
    
    // Calculate and store total guests if not provided
    if (!data.totalGuests) {
      data.totalGuests = data.rooms.reduce(
        (sum, room) => sum + room.adults + room.children, 0
      )
    }
    
    reservationData.value = data
  }

  const clearReservationData = () => {
    reservationData.value = null
  }

  const setTransactionId = (id) => {
    transactionId.value = id
  }

  const clearTransactionId = () => {
    transactionId.value = null
  }

  const saveFormState = (passengers, termsAccepted = false) => {
    formState.value.passengerDetails = [...passengers]
    formState.value.checkoutFormState.termsAccepted = termsAccepted
  }

  const getFormState = () => {
    return formState.value
  }

  const clearFormState = () => {
    formState.value = {
      passengerDetails: [],
      checkoutFormState: {
        termsAccepted: false
      }
    }
  }

  // Helper method to get reservation data ready for API submission
  const getReservationForAPI = () => {
    if (!reservationData.value) return null
    
    return {
      tripId: reservationData.value.tripId,
      totalGuests: totalGuests.value,
      totalRooms: totalRooms.value,
      adults: totalAdults.value,
      children: totalChildren.value,
      rooms: roomsBreakdown.value,
      passengerDetails: formState.value.passengerDetails,
      termsAccepted: formState.value.checkoutFormState.termsAccepted,
    }
  }

  return {
    reservationData,
    transactionId,
    formState,
    totalRooms,
    totalAdults,
    totalChildren,
    totalGuests,
    roomsBreakdown,
    setReservationData,
    clearReservationData,
    setTransactionId,
    clearTransactionId,
    saveFormState,
    getFormState,
    clearFormState,
    getReservationForAPI
  }
})