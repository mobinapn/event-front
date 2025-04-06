<template>
  <div class="category-page-container q-pa-md" dir="rtl">
    <div class="flex justify-center q-mb-lg">
      <h2 class="text-h4 text-center text-bold">دسته‌بندی {{categoryName }}</h2>
    </div>

    <!-- Loading State -->
    <div v-if="tripsStore.loading" class="loading-state">
      <LoadingState />
    </div>

    <!-- Error State -->
    <div v-else-if="tripsStore.error" class="error-state">
      <q-icon name="error" color="negative" size="40px" />
      <div class="text-negative q-mt-sm">{{ tripsStore.error }}</div>
      <q-btn color="primary" flat label="تلاش مجدد" @click="loadTrips" class="q-mt-md" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!tripsStore.trips.length" class="empty-state">
     <q-img src="../../public/images/undraw_empty_4zx0.svg" width="200px" class="q-mb-sm"></q-img>
     <span class="text-secondary q-pa-md">موردی یافت نشد</span>
    </div>

    <!-- Trips Grid -->
    <div v-else class="trips-grid q-px-xs">
      <div v-for="trip in tripsStore.trips" class="trip-item" :key="trip.id">
        <TripCard :trip="trip" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useTripsStore } from '../stores/trips'
import TripCard from '../components/TripCard.vue'
import LoadingState from 'src/components/LoadingState.vue'

const route = useRoute()
const tripsStore = useTripsStore()
const totalPages = ref(5)
const categoryName = ref('دسته‌بندی')
const itemsPerPage = 8

const getCategoryId = () => route.params.categoryId

const loadTrips = async () => {
  const categoryId = getCategoryId()

  if (!categoryId) {
    console.error('No category ID found in route params')
    return
  }

  // Clear previous trips
  tripsStore.trips = []

  // Fetch trips for the category
  const response = await tripsStore.fetchTripsByCategory(categoryId, itemsPerPage)

  // Calculate total pages
  totalPages.value = Math.ceil(response.total / itemsPerPage)

  // Ensure categories are loaded
  if (!tripsStore.categories.length) {
    await tripsStore.fetchCategories()
  }

  // Get category name
  const category = tripsStore.categories.find((c) => c.id == categoryId)
  categoryName.value = category ? category.title : 'نامشخص'
}

// Load trips whenever route changes
watchEffect(() => {
  loadTrips()
})

// Initial load
onMounted(() => {
  loadTrips()
})
</script>

<style scoped>
.category-page-container {
  max-width: 1400px;
  margin: 0 auto;
  margin-bottom: 4rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  width: 100%;
}

@media (max-width: 1400px) {
  .trips-grid {
    gap: 22px;
  }
}

@media (max-width: 960px) {
  .trips-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 600px) {
  .trips-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  .category-header h2 {
    font-size: 1.5rem;
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 20px;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
