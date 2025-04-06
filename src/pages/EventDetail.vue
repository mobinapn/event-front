<!-- EvenDeatil page  -->
<!-- EvenDetail page - Enhanced Modern UI/UX -->

<template>
  <q-page class="trip-detail-page " dir="rtl">
    <!-- Loading and Error States -->
    <div v-if="loading" class="fullscreen-loader" dir="rtl">
      <LoadingState />
    </div>

    <div
      v-else-if="error"
      class="fullscreen-error flex flex-col items-center justify-center min-h-screen"
    >
      <q-icon name="error_outline" color="negative" size="64px" />
      <div class="text-negative text-h6 q-mt-md">{{ error }}</div>
      <q-btn unelevated color="primary" class="back-btn q-mt-lg" label="بازگشت" @click="router.back()" />
    </div>

    <template v-else-if="trip">
      <!-- Hero Section with Gradient Overlay -->
      <div class="hero-banner" v-if="trip?.images">
  <div class="hero-image-container">
    <SlideGallery :trip="trip" />
    <div class="hero-overlay"></div>
  </div>
</div>



      <!-- Main Content Area -->
      <div class="main-content-wrapper">
        <div class="content-grid">
          <!-- Description Section -->
          <div class="description-section">
            <EventDescription v-if="trip && trip.description" :trip="trip" />
          </div>

          <!-- Booking Card -->
          <div class="booking-wrapper">
            <q-card flat class="booking-card">
              <q-card-section>
                <!-- Price Display -->
                <div class="price-display">
                  <div class="price-tag">
                    <span class="text-h4 text-weight-bold">{{ formatPrice(trip.price_per_adult) }}</span>
                    <span class="text-h6 q-mr-sm">تومان</span>
                  </div>
                  <div class="text-caption text-grey-7">قیمت برای هر بزرگسال</div>
                </div>
                
                <!-- Date and Guest Selection Card -->
                <q-card flat bordered class="selection-card q-mt-md">
                  <!-- Trip Dates -->
                  <div class="dates-container">
                    <div class="date-column">
                      <div class="date-label">تاریخ حرکت</div>
                      <div class="date-value">
                        <q-icon name="event" color="primary" size="sm" class="q-mr-sm" />
                        <span>{{ formattedDateStrat }}</span>
                      </div>
                      <div class="time-value">
                        <q-icon name="schedule" color="primary" size="sm" class="q-mr-sm" />
                        <span>12:30 PM</span>
                      </div>
                    </div>
                    
                    <q-separator vertical class="date-separator" />
                    
                    <div class="date-column">
                      <div class="date-label">تاریخ برگشت</div>
                      <div class="date-value">
                        <q-icon name="event" color="primary" size="sm" class="q-mr-sm" />
                        <span>{{ formattedDateEnd }}</span>
                      </div>
                      <div class="time-value">
                        <q-icon name="schedule" color="primary" size="sm" class="q-mr-sm" />
                        <span>11:00 AM</span>
                      </div>
                    </div>
                  </div>

                  <q-separator class="selection-separator" />

                  <!-- Guest Selection -->
                  <div class="guest-selector-container" @click="showGuestsDialog = true">
                    <div class="guest-selector-content">
                      <div>
                        <div class="guest-label">مسافران</div>
                        <div class="guest-value">{{ roomsGuestsDisplay }}</div>
                      </div>
                      <q-icon name="fa-solid fa-user-plus" color="primary" size="1.2rem" />
                    </div>
                    
                    <div v-if="totalGuests > 0" class="capacity-badge">
                      <q-icon name="info" size="xs" class="q-mr-xs" />
                      {{ trip.capacity - totalGuests }} ظرفیت باقیمانده
                    </div>
                  </div>
                </q-card>
                
                <!-- Total Price -->
                <div class="total-price-container">
                  <div class="total-price-row">
                    <span class="text-subtitle1 text-weight-medium">جمع کل</span>
                    <span class="text-h6 text-primary text-weight-bold">{{
                      formatPrice(grandTotal)
                    }}</span>
                  </div>
                </div>
                
                <!-- Reserve Button -->
                <q-btn
                  unelevated
                  color="primary"
                  class="reserve-button"
                  size="lg"
                  :loading="reserving"
                  :disable="!isValidReservation || totalGuests === 0"
                  @click="handleReserve"
                >
                  <span class="row items-center justify-center">
                    <q-icon name="shopping_cart" class="q-mr-sm" />
                    رزرو سفر
                  </span>
                </q-btn>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </template>

    <!--Rooms and Guests Dialog -->
    <q-dialog v-model="showGuestsDialog" persistent>
      <q-card class="guests-dialog">
        <q-card-section class="dialog-header">
          <div class="text-h6">انتخاب اتاق و مسافران</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="dialog-body">
          <!-- Rooms List -->
          <div v-for="(room, roomIndex) in rooms" :key="roomIndex" class="room-container">
            <div class="room-header">
              <div class="room-title">
                اتاق {{ persianNumbers[roomIndex] }}
              </div>
              <q-btn
                v-if="rooms.length > 1"
                round
                flat
                dense
                color="red-7"
                icon="delete"
                @click="removeRoom(roomIndex)"
              >
                <q-tooltip>حذف اتاق</q-tooltip>
              </q-btn>
            </div>

            <!-- Guest Types for this Room -->
            <div class="guest-type-list">
              <div 
                v-for="type in guestTypes" 
                :key="`${roomIndex}-${type.key}`" 
                class="guest-type-item"
              >
                <div class="guest-type-info">
                  <div class="guest-type-title">{{ type.label }}</div>
                  <div class="guest-type-description">{{ type.description }}</div>
                </div>
                <div class="guest-counter">
                  <q-btn
                    round
                    flat
                    dense
                    icon="remove"
                    color="primary"
                    class="counter-btn"
                    @click="updateRoomGuests(roomIndex, type.key, -1)"
                    :disable="room[type.key] <= type.min"
                  />
                  <span class="guest-count">{{ room[type.key] }}</span>
                  <q-btn
                    round
                    flat
                    dense
                    icon="add"
                    color="primary"
                    class="counter-btn"
                    @click="updateRoomGuests(roomIndex, type.key, 1)"
                    :disable="
                      room[type.key] >= type.max || 
                      getRoomGuestsTotal(room) >= maxGuestsPerRoom ||
                      totalGuests >= maxAllowedGuests
                    "
                  />
                </div>
              </div>
            </div>
            
            <q-separator v-if="roomIndex < rooms.length - 1" class="room-separator" />
          </div>

          <!-- Add Room Button -->
          <div class="add-room-container">
            <q-btn
              outline
              color="primary"
              icon-right="add"
              label="افزودن اتاق"
              class="add-room-btn"
              @click="addRoom"
              :disable="rooms.length >= maxRooms || totalGuests >= maxAllowedGuests"
            />
          </div>

          <!-- Info Section -->
          <div class="info-message">
            <q-icon name="info" size="xs" class="q-mr-xs" />
            حداکثر {{ maxAllowedGuests }} نفر در {{ maxRooms }} اتاق در هر رزرو
          </div>
        </q-card-section>

        <q-card-actions align="right" class="dialog-footer">
          <q-btn unelevated label="تایید" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTripsStore } from '../stores/trips'
import { useReservationStore } from '../stores/reservation'
import { useDateFormatter } from 'src/composables/useDateFormatter'

import SlideGallery from 'components/SlideGallery.vue'
import EventDescription from 'components/EventDescription.vue'
import LoadingState from 'src/components/LoadingState.vue'

const route = useRoute()
const router = useRouter()
const tripsStore = useTripsStore()
const reservationStore = useReservationStore()
const {formatPersianDisplay} = useDateFormatter()


// State
const loading = ref(true)
const error = ref(null)
const trip = ref(null)
const reserving = ref(false)
const showGuestsDialog = ref(false)


// Room and Guest Configuration
const maxAllowedGuests = 9 // Maximum guests per reservation
const maxRooms = 4 // Maximum number of rooms
const maxGuestsPerRoom = 4 // Maximum guests per room

// Persian numbers for room numbering
const persianNumbers = ['اول', 'دوم', 'سوم', 'چهارم']

// Rooms and Guests State
const rooms = ref([
  {
    adults: 1,
    children: 0
  }
])

// Guest Types Configuration
const guestTypes = [
  {
    key: 'adults',
    label: 'بزرگسالان',
    description: '۱۲ سال به بالا',
    min: 1,
    max: 4,
  },
  {
    key: 'children',
    label: 'کودکان',
    description: '۲ تا ۱۲ سال',
    min: 0,
    max: 3,
  },
]

// Computed Properties

const formattedDateStrat = computed(() => formatPersianDisplay(trip.value.start_date))
const formattedDateEnd = computed(() => formatPersianDisplay(trip.value.end_date)) 

const totalGuests = computed(() => 
  rooms.value.reduce((sum, room) => 
    sum + Object.values(room).reduce((roomSum, count) => roomSum + count, 0), 0)
)

const roomsGuestsDisplay = computed(() => {
  if (rooms.value.length === 1) {
    const room = rooms.value[0]
    let display = `${room.adults} بزرگسال`
    if (room.children > 0) display += ` و ${room.children} کودک`
    return display
  } else {
    return `${totalGuests.value} مسافر در ${rooms.value.length} اتاق`
  }
})

const totalPrice = computed(() => {
  // Calculate price based on adults and children in all rooms
  let price = 0
  rooms.value.forEach(room => {
    price += (trip.value?.price_per_adult * room.adults)
    price += (trip.value?.price_per_child * room.children)
  })
  return price
})

const grandTotal = computed(() => totalPrice.value)

const isValidReservation = computed(() => 
  totalGuests.value > 0 && 
  totalGuests.value <= maxAllowedGuests && 
  totalGuests.value <= trip.value?.capacity &&
  rooms.value.length > 0 &&
  rooms.value.length <= maxRooms
)

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const getRoomGuestsTotal = (room) => {
  return Object.values(room).reduce((sum, count) => sum + count, 0)
}

const getTotalAdults = () => {
  return rooms.value.reduce((sum, room) => sum + room.adults, 0)
}

const getTotalChildren = () => {
  return rooms.value.reduce((sum, room) => sum + room.children, 0)
}

const updateRoomGuests = (roomIndex, type, change) => {
  const room = rooms.value[roomIndex]
  const guestType = guestTypes.find(gt => gt.key === type)
  const newValue = room[type] + change
  const newRoomTotal = getRoomGuestsTotal(room) + change
  const newTotalGuests = totalGuests.value + change

  if (
    newValue >= guestType.min &&
    newValue <= guestType.max &&
    newRoomTotal <= maxGuestsPerRoom &&
    newTotalGuests <= maxAllowedGuests &&
    newTotalGuests <= trip.value.capacity
  ) {
    // Create a new room object with the updated value
    const updatedRoom = { ...room, [type]: newValue }
    // Replace the room at the specified index
    rooms.value.splice(roomIndex, 1, updatedRoom)
  }
}

const addRoom = () => {
  if (rooms.value.length < maxRooms && totalGuests.value < maxAllowedGuests) {
    rooms.value.push({
      adults: 1,
      children: 0
    })
  }
}

const removeRoom = (roomIndex) => {
  if (rooms.value.length > 1) {
    rooms.value.splice(roomIndex, 1)
  }
}

const handleReserve = async () => {
  if (!isValidReservation.value) return

  reserving.value = true
  try {
    // Store the complete trip data with rooms information
    reservationStore.setReservationData({
      tripId: trip.value.id,
      trip: {
        id: trip.value.id,
        title: trip.value.title,
        startDate: formattedDateStrat,
        endDate: formattedDateEnd,
        pricePerAdult: trip.value.price_per_adult,
        pricePerChild: trip.value.price_per_child, 
        totalAdults: getTotalAdults(),
        totalChildren: getTotalChildren(),
        totalPrice: totalPrice.value
        
      },
      rooms: rooms.value,
      totalGuests: totalGuests.value,
    })
    router.push('/checkout')
  } catch (error) {
    console.error('Reservation error:', error)
  } finally {
    reserving.value = false
  }
}

// Lifecycle Hooks
onMounted(async () => {
  loading.value = true
  error.value = null
  const tripId = route.params.id
  trip.value = await tripsStore.getTripById(tripId)
  
  if (!trip.value) {
    error.value = 'تور مورد نظر پیدا نشد'
  }

  loading.value = false
})

</script>

<style lang="scss" scoped>
// Modern Color Palette
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
}

// Base Page Styles
.trip-detail-page {
  background:#f8fafc;;
  min-height: 100vh;
}

// Main Content Layout
.main-content-wrapper {
  position: relative;
  margin-top: -80px;
  z-index: 10;
  padding: 0 24px 40px;
  
  @media (max-width: 768px) {
    margin-top: -40px;
    padding: 0 16px 32px;
  }
}

.content-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 48px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

// Description Section
.description-section {
  background: var(--background-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  
  ::v-deep .event-description {
    padding: 32px;
    
    @media (max-width: 768px) {
      padding: 24px;
    }
  }
}

// Booking Card
.booking-wrapper {
  min-height: 1px;
}

.booking-card {
  position: sticky;
  top: 100px; // Matches Airbnb's offset from top
  border-radius: 12px;
  border: 1px solid #ebebeb;
  background: white;

  .q-card__section {
    padding: 24px;
  }

}

// Price Display
.price-display {
  margin-bottom: 24px;
  text-align: center;
  
  .price-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }
}

// Selection Card
.selection-card {
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
  margin-bottom: 24px;
}

// Date Selection
.dates-container {
  display: flex;
  padding: 16px 0;
  
  .date-column {
    flex: 1;
    padding: 0 16px;
    
    .date-label {
      font-size: 14px;
      color: var(--text-medium);
      margin-bottom: 8px;
    }
    
    .date-value, .time-value {
      display: flex;
      align-items: center;
      font-size: 15px;
      color: var(--text-dark);
      margin-bottom: 6px;
    }
  }
  
  .date-separator {
    margin: 0 8px;
    background-color: var(--border-color);
  }
}

.selection-separator {
  margin: 0;
  background-color: var(--border-color);
}

// Guest Selector
.guest-selector-container {
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.025);
  }
  
  .guest-selector-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .guest-label {
      font-size: 14px;
      color: var(--text-medium);
      margin-bottom: 4px;
    }
    
    .guest-value {
      font-size: 15px;
      color: var(--text-dark);
    }
  }
  
  .capacity-badge {
    display: inline-flex;
    align-items: center;
    margin-top: 8px;
    padding: 4px 8px;
    background-color: #f1f5f9;
    border-radius: 16px;
    font-size: 12px;
    color: var(--text-medium);
  }
}

// Total Price
.total-price-container {
  margin: 24px 0;
  padding: 16px;
  background-color: #f1f5f9;
  border-radius: var(--radius-md);
  
  .total-price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

// Reserve Button
.reserve-button {
  width: 100%;
  height: 54px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 12px;
  
  &:not(:disabled) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }
}

// Dialog Styles
.guests-dialog {
  border-radius: var(--radius-lg);
  max-width: 450px;
  width: 100%;
  
  @media (max-width: 480px) {
    max-width: 95vw;
  }
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
  }
  
  .dialog-body {
    padding: 24px;
  }
  
  .dialog-footer {
    padding: 16px 24px;
    background-color: #f8fafc;
    border-top: 1px solid var(--border-color);
  }
}

// Room Styles
.room-container {
  margin-bottom: 24px;
  
  .room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .room-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-dark);
    }
  }
  
  .guest-type-list {
    .guest-type-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 8px;
      background-color: #f8fafc;
      border-radius: var(--radius-md);
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: #f1f5f9;
      }
      
      .guest-type-info {
        .guest-type-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--text-dark);
        }
        
        .guest-type-description {
          font-size: 13px;
          color: var(--text-medium);
        }
      }
      
      .guest-counter {
        display: flex;
        align-items: center;
        
        .counter-btn {
          background-color: #e2e8f0;
          width: 32px;
          height: 32px;
          
          &:hover:not(:disabled) {
            background-color: #cbd5e1;
          }
        }
        
        .guest-count {
          padding: 0 16px;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
  
  .room-separator {
    margin: 24px 0;
    background-color: var(--border-color);
  }
}

// Add Room Button
.add-room-container {
  display: flex;
  justify-content: center;
  margin: 24px 0 16px;
  
  .add-room-btn {
    font-weight: 500;
    padding: 8px 16px;
    border-radius: var(--radius-md);
  }
}

// Info Message
.info-message {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--text-light);
  margin-top: 16px;
  padding: 8px 12px;
  background-color: #f8fafc;
  border-radius: var(--radius-md);
}

// Error State
.fullscreen-error {
  padding: 24px;
  text-align: center;
  
  .back-btn {
    border-radius: var(--radius-md);
    padding: 8px 24px;
  }
}

// Responsive Adjustments
@media (max-width: 768px) {
  .hero-banner {
    height: 40vh;
  }
  
  .booking-card {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    max-height: 80vh;
    overflow-y: auto;
    
    .q-card__section {
      padding: 20px;
    }
    
    .price-display {
      margin-bottom: 16px;
    }
    
    .total-price-container {
      margin: 16px 0;
    }
    
    .reserve-button {
      height: 48px;
    }
  }
  
  // Add space at the bottom to account for fixed booking card
  .content-grid {
    padding-bottom: 100px;
  }
}

// Mobile Optimizations
@media (max-width: 480px) {
  .main-content-wrapper {
    padding: 0 12px 24px;
  }
  
  .dates-container {
    flex-direction: column;
    
    .date-column {
      padding: 12px 16px;
    }
    
    .date-separator {
      width: calc(100% - 32px);
      margin: 0 16px;
      height: 1px;
    }
  }
  
  .guest-type-item {
    padding: 10px 12px !important;
  }
}

@media (max-width: 1024px) {
  .content-wrapper {
    padding: 0 16px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 50vh;
  }

  .booking-card {
    position: sticky;
    bottom: 0;
    border-radius: 16px 16px 0 0;
    margin-bottom: env(safe-area-inset-bottom);
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 40vh;
  }

  .content-wrapper {
    padding: 0 12px;
  }
}
// Adjust scrolling behavior for iOS
@supports (-webkit-touch-callout: none) {
  .booking-wrapper {
    @media (max-width: 1024px) {
      padding-bottom: calc(16px + env(safe-area-inset-bottom));
    }
  }
}
</style>