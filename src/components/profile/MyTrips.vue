<template>
  <div class="my-trips-container">
    <div class="trips-header q-mb-md">
      <div class="text-caption text-grey-7">مدیریت و مشاهده جزئیات سفرهای رزرو شده</div>
    </div>
    
    <q-tabs
      v-model="activeTab"
      dense
      class="text-primary q-mb-md"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="all" label="همه سفرها" />
      <q-tab name="active" label="فعال" />
      <q-tab name="completed" label="انجام شده" />
      <q-tab name="canceled" label="لغو شده" />
    </q-tabs>
    
    <div class="q-mb-md">
      <q-input
        v-model="searchQuery"
        dense
        outlined
        placeholder="جستجو در سفرها..."
        class="search-input"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="state-container">
      <q-spinner color="primary" size="3em" />
      <div class="text-center text-subtitle1 text-primary q-mt-md">در حال بارگذاری سفرها...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="state-container">
      <q-icon name="error_outline" size="3em" color="negative" />
      <div class="text-center text-subtitle1 text-negative q-mt-md">{{ error }}</div>
      <q-btn color="primary" label="تلاش مجدد" class="q-mt-md" @click="fetchTrips" />
    </div>

    <!-- Empty state -->
    <q-card v-else-if="filteredTrips.length === 0" flat class="empty-state q-pa-lg text-center">
      <q-card-section>
        <q-img src="/images/undraw_empty_4zx0.svg" width="200px" height="auto" class="q-mx-auto q-mb-md" />
        
        <div v-if="searchQuery || activeTab !== 'all'" class="text-h6 q-mb-sm">
          موردی یافت نشد
          <div class="text-body2 text-grey-7">
            {{ searchQuery ? 'جستجوی شما نتیجه‌ای نداشت.' : 'سفری با این وضعیت وجود ندارد.' }}
          </div>
        </div>
        <div v-else>
          <div class="text-h6 q-mb-sm">هنوز سفری رزرو نکرده‌اید</div>
          <div class="text-body2 text-grey-7 q-mb-md">به بخش تورها مراجعه کنید و اولین سفر خود را رزرو کنید.</div>
          <q-btn color="primary" label="مشاهده تورها" to="/" />
        </div>
      </q-card-section>
    </q-card>
    
    <!-- Trips list -->
    <div v-else class="trips-list q-mb-lg">
      <div class="text-caption text-grey-7 q-mb-sm">
        {{ filteredTrips.length }} سفر {{ getStatusLabel(activeTab) }}
      </div>
      
      <q-transition-group
  appear
  enter-active-class="animated fadeIn"
  leave-active-class="animated fadeOut"
>
  <TripCard 
    v-for="trip in filteredTrips" 
    :key="trip.id" 
    :trips="trip"
    @trip-canceled="handleTripCanceled"
    @trip-status-changed="handleTripStatusChange"
  />
</q-transition-group>
      
      
      <div v-if="filteredTrips.length >= 5" class="text-center q-mt-lg">
        <q-btn outline color="primary" label="مشاهده بیشتر" @click="loadMoreTrips" :loading="loadingMore" />
      </div>
    </div>
    <!-- Wallet Notification -->
    <q-dialog v-model="showWalletNotification">
      <q-card class="wallet-notification-card">
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-h6">کیف پول شما شارژ شد</div>
            <div class="text-body2 q-mt-sm">
              مبلغ <span class="text-weight-bold">{{ formatPrice(lastRefundAmount) }}</span> تومان بابت لغو سفر به کیف پول شما اضافه شد.
            </div>
          </div>
          <q-space />
          <q-icon name="account_balance_wallet" color="primary" size="56px" />
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="مشاهده کیف پول" color="primary" to="/wallet" v-close-popup />
          <q-btn flat label="بستن" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import TripCard from '../../components/profile/TripCard.vue'

const props = defineProps({
  userId: {
    type: String,
    required: true 
  }
})

const trips = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const error = ref(null)
const activeTab = ref('all')
const searchQuery = ref('')
const showWalletNotification = ref(false)
const lastRefundAmount = ref(0)
const visibleCount = ref(5)

// Fetch trips from API
const fetchTrips = async () => {
  loading.value = true
  error.value = null
  
  if (!props.userId) {
    error.value = 'کاربر لاگین نیست!'
    loading.value = false
    return
  }

  try {
    console.log(`Fetching trips for userId: ${props.userId}`)
    const response = await axios.get(`https://json-server-production-de66.up.railway.app/purchased-trips?userId=${props.userId}`)
    console.log('Trips response:', response.data)
    
    // Sort trips by purchase date (newest first)
    trips.value = response.data.sort((a, b) => 
      new Date(b.purchaseDate) - new Date(a.purchaseDate)
    )
    
    loading.value = false
  } catch (err) {
    console.error('خطا در دریافت سفرها:', err)
    error.value = 'مشکلی در دریافت اطلاعات پیش آمد. لطفاً دوباره تلاش کنید.'
    loading.value = false
  }
}

// Filter trips based on active tab and search query
const filteredTrips = computed(() => {
  let filtered = [...trips.value]
  
  // Filter by tab
  if (activeTab.value === 'active') {
    filtered = filtered.filter(trip => !trip.status || trip.status === 'active')
  } else if (activeTab.value === 'completed') {
    filtered = filtered.filter(trip => trip.status === 'completed')
  } else if (activeTab.value === 'canceled') {
    filtered = filtered.filter(trip => trip.status === 'canceled')
  }
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(trip => 
      trip.tripData.title.toLowerCase().includes(query) ||
      trip.transactionId.toLowerCase().includes(query) ||
      (trip.passengersData && trip.passengersData.some(p => 
        p.firstname.toLowerCase().includes(query) || 
        p.lastname.toLowerCase().includes(query)
      ))
    )
  }
  
  // Limit the number of trips shown
  return filtered.slice(0, visibleCount.value)
})

// Helper functions
const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return 'فعال'
    case 'completed': return 'انجام شده'
    case 'canceled': return 'لغو شده'
    default: return ''
  }
}

const formatPrice = (price) => {
  if (!price) return '0'
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


// Load more trips
const loadMoreTrips = () => {
  loadingMore.value = true
  
  // Simulate API call delay
  setTimeout(() => {
    visibleCount.value += 5
    loadingMore.value = false
  }, 500)
}

// Handle trip cancellation
const handleTripStatusChange = (updatedTrip) => {
  // Find the trip in our array and update its status
  const index = trips.value.findIndex(trip => trip.id === updatedTrip.id)
  if (index !== -1) {
    // Create a new object with the updated status
    trips.value[index] = {
      ...trips.value[index],
      status: updatedTrip.status
    }
  }
}

// Watch for tab changes to reset visible count
watch(activeTab, () => {
  visibleCount.value = 5
})

// Initialize
onMounted(fetchTrips)
</script>

<style scoped>
.my-trips-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.trips-header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.search-input {
  max-width: 400px;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.empty-state {
  border-radius: 12px;
  background-color: #f9f9f9;
}

.stat-box {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  height: 100%;
}

.stat-title {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
}

.wallet-notification-card {
  min-width: 350px;
  border-radius: 12px;
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .trips-header {
    text-align: center;
  }
  
  .search-input {
    max-width: 100%;
  }
}
</style>