<template>
  <div class="trip-list-container" dir="rtl">
    <!-- Loading State -->
    <div v-if="tripsStore.loading" class="loading-state">
      <LoadingState />
    </div>
    <!-- <q-skeleton v-if="!dataLoaded" type="rect" width="100%" height="200px" /> -->
    <!-- Error State -->
    <div v-else-if="tripsStore.error" class="error-state">
      <q-icon name="error" color="negative" size="40px" />
      <div class="text-negative q-mt-sm">{{ tripsStore.error }}</div>
      <q-btn color="primary" flat label="تلاش مجدد" @click="fetchData" class="q-mt-md" />
    </div>

    <!-- Categories Rows -->
    <div v-else class="categories-wrapper">
      <div
        v-for="(category, index) in tripsStore.categories"
        :key="category.id"
        class="category-row"
        :class="{ 'last-category': index === tripsStore.categories.length - 1 }"
      >
        <div class="flex justify-between q-px-lg items-center">
          <h4 class="q-mr-lg">{{ category.title }}</h4>
          <q-btn
            color="primary"
            flat
            label="بیشتر"
            @click="goToCategoryPage(category.id)"
            size="20px"
            ><i class="fa-solid fa-arrow-left q-px-sm"></i
          ></q-btn>
        </div>

        <!-- Trips Grid -->
        <div
          v-if="categoryTripsMap[category.id] && categoryTripsMap[category.id].length"
          class="trips-grid q-px-lg"
        >
          <div
            v-for="trip in categoryTripsMap[category.id].slice(0, 4)"
            class="trip-item"
            :key="trip.id"
          >
            <TripCard :trip="trip" />
          </div>
        </div>
        <div v-else class="empty-state">
          <div class="text-grey">موردی برای این دسته‌بندی یافت نشد</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTripsStore } from '../stores/trips'
import TripCard from './TripCard.vue'
import LoadingState from './LoadingState.vue'

const tripsStore = useTripsStore()
const router = useRouter()
const categoryTripsMap = reactive({})

const fetchData = async () => {
  await tripsStore.fetchCategories()

  if (tripsStore.categories.length > 0) {
    for (const category of tripsStore.categories) {
      await fetchTripsForCategory(category.id)
    }
  }
}

// Fetch trips for a specific category
const fetchTripsForCategory = async (categoryId) => {
  const tripsForCategory = await tripsStore.fetchTripsByCategory(categoryId)
  categoryTripsMap[categoryId] = tripsForCategory
}

// Go to category page
const goToCategoryPage = (categoryId) => {
  router.push(`/category/${categoryId}`)
}

// Fetch trips when component mounts
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.trip-list-container {
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for preventing overflow */
  max-height: 100%; /* Fill available space but don't overflow */
}

.categories-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto; /* Grow but don't shrink */
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  width: 100%;
  margin-top: 30px;
}

@media (max-width: 1400px) {
  .trips-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }
}

@media (max-width: 960px) {
  .trips-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 600px) {
  .trips-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.load-more-section {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  text-align: center;
}

.last-category {
  margin-bottom: 200px;
}

/* Debug styles - can be removed after fixing */
.trip-item {
  height: 100%; /* Ensure all items are same height */
}
</style>
