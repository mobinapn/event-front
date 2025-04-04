<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTripsStore } from 'src/stores/trips'
import TripCard from 'src/components/TripCard.vue'

const route = useRoute()
const tripsStore = useTripsStore()
const noResults = ref(false)
const searchTerms = ref({})
const isSearching = ref(false)

// Access reactive state from the store
const searchResults = computed(() => tripsStore.searchResults)
const loading = computed(() => tripsStore.loading)
const error = computed(() => tripsStore.error)

onMounted(async () => {
  console.log('Search Results Page - Query Params:', route.query)
  isSearching.value = true
  
  try {
    // Store search terms for display
    searchTerms.value = { ...route.query }
    
    // Make sure the store has the clearSearchResults function
    if (typeof tripsStore.clearSearchResults === 'function') {
      tripsStore.clearSearchResults()
    } else {
      console.warn('clearSearchResults function not found in store, setting empty array manually')
      tripsStore.setSearchResults([])
    }
    
    if (Object.keys(route.query).length > 0) {
      // Use the store's search function
      console.log('Searching with params:', route.query)
      const results = await tripsStore.searchTrips(route.query)
      console.log('Search completed with results count:', results.length)
      
      // Check if we got results
      noResults.value = results.length === 0
    } else {
      // No search parameters, show all trips
      console.log('No search parameters, fetching all trips')
      await tripsStore.fetchTrips()
      tripsStore.setSearchResults(tripsStore.trips)
    }
  } catch (err) {
    console.error('Error in search component:', err)
    noResults.value = true
  } finally {
    isSearching.value = false
  }
})
</script>

<template>
  <div class="search-results-container q-pa-md">
    <div class="q-mb-md">
      <h3 class="text-h5 q-mb-sm">نتایج جستجو</h3>
      
      <!-- Show search parameters if any -->
      <div v-if="Object.keys(searchTerms).length > 0" class="text-caption q-mb-md">
        <span v-if="searchTerms.destination" class="q-mr-sm">
          مقصد: <strong>{{ searchTerms.destination }}</strong>
        </span>
        <span v-if="searchTerms.start_date && searchTerms.start_date.trim()" class="q-mr-sm">
          تاریخ: <strong>{{ searchTerms.start_date }}</strong>
        </span>
      </div>
    </div>
    
    <div v-if="loading || isSearching" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
      <p class="q-mt-sm">در حال بارگذاری...</p>
    </div>
    
    <div v-else-if="error" class="text-center q-pa-lg text-negative">
      {{ error }}
    </div>
    
    <div v-else-if="noResults || searchResults.length === 0" class="text-center q-pa-lg">
      <p>هیچ نتیجه‌ای یافت نشد. لطفا معیارهای جستجوی خود را تغییر دهید.</p>
      <q-btn 
        color="primary" 
        label="نمایش همه سفرها" 
        class="q-mt-md"
        @click="tripsStore.fetchTrips().then(trips => tripsStore.setSearchResults(trips))"
      />
    </div>
    
    <div v-else>
      <p class="text-subtitle1 q-mb-md">{{ searchResults.length }} مورد یافت شد</p>
      
      <div class="row q-col-gutter-md">
        <div 
          v-for="(trip, index) in searchResults" 
          :key="index" 
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <TripCard :trip="trip" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-results-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 500px;
}
</style>