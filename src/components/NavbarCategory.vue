<template>
  <q-toolbar class="bg-white text-secondary q-pa-md flex justify-center">
    <!-- Scroll Left Button (Auto-Hide) -->
    <q-btn
      round
      flat
      icon="fa-solid fa-chevron-left"
      @click="scrollLeft"
      v-show="canScrollLeft"
      class="scroll-btn"
    />

    <!-- Scrollable Category List -->
    <div ref="scrollContainer" class="scroll-container" @scroll="checkScroll">
      <div class="scroll-content">
        <q-btn
          v-for="(category, index) in categories"
          :key="index"
          flat
          dense
          stack
          class="category-btn"
          @click="selectCategory(index)"
          :class="{ active: selectedCategory === index }"
        >
          <q-icon :name="category.icon" size="28px" />
          <div class="category-label">{{ category.label }}</div>
        </q-btn>
      </div>
    </div>

    <!-- Scroll Right Button (Auto-Hide) -->
    <q-btn
      round
      flat
      icon="fa-solid fa-chevron-right"
      @click="scrollRight"
      v-show="canScrollRight"
      class="scroll-btn"
    />
  </q-toolbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const scrollContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const selectedCategory = ref(null)

const categories = ref([
  { label: 'اقامت‌گاه سنتی', icon: 'fa-solid fa-mug-hot' },
  { label: 'باغ انگور', icon: 'fa-solid fa-wine-glass' },
  { label: 'غار', icon: 'fa-solid fa-mountain' },
  { label: 'آسیاب بادی', icon: 'fa-solid fa-wind' },
  { label: 'خانه روستایی', icon: 'fa-solid fa-house-chimney' },
  { label: 'اقامت در چادر', icon: 'fa-solid fa-campground' },
  { label: 'سفر دریایی', icon: 'fa-solid fa-ship' },
  { label: 'گردشگری', icon: 'fa-solid fa-compass' },
  { label: 'هتل', icon: 'fa-solid fa-hotel' },
  { label: 'کویرگردی', icon: 'fa-solid fa-mound' },
  { label: 'سفر با هواپیما', icon: 'fa-solid fa-plane' },
  { label: 'تور طبیعت گردی', icon: 'fa-solid fa-hiking' },
])

const scrollLeft = () => {
  scrollContainer.value.scrollBy({ left: -200, behavior: 'smooth' })
}

const scrollRight = () => {
  scrollContainer.value.scrollBy({ left: 200, behavior: 'smooth' })
}

const checkScroll = () => {
  const el = scrollContainer.value
  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth
}

const selectCategory = (index) => {
  selectedCategory.value = index
}

onMounted(() => {
  checkScroll()
})
</script>

<style scoped>
/* Prevent entire page from horizontal scrolling */
body {
  overflow-x: hidden;
}

/* Scrollable container */
.scroll-container {
  overflow-x: auto;
  width: 80%;
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
.scroll-container::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari */
}

/* Flex container for category buttons */
.scroll-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 5px 0;
}

/* Category buttons */
.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  color: #666;
}

/* Hover and click effects */
.category-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}
.category-btn.active {
  color: #d32f2f;
  background: rgba(211, 47, 47, 0.1);
  transform: scale(1.1);
}

/* Category labels */
.category-label {
  font-size: 12px;
  margin-top: 4px;
  font-weight: bold;
}

/* Auto-hide scroll buttons */
.scroll-btn {
  transition: opacity 0.3s ease-in-out;
}
</style>
