<template>
  <div class="trip-card-container">
    <q-card flat bordered class="trip-card" @click="goToDetails">
      <!-- Image Section with Gradient Overlay -->
      <div class="image-container">
        <q-img :src="trip.images.main" :ratio="16/9" class="trip-image" fit="cover">
          <template v-slot:loading>
            <div class="text-grey text-center full-height full-width flex flex-center">
              <q-spinner-dots color="primary" size="40" />
            </div>
          </template>
          
          <!-- Gradient Overlay -->
          <div class="image-overlay"></div>
          
          <!-- Trip Duration Badge -->
          <div class="duration-badge">
            <q-icon name="schedule" size="xs" class="q-mx-xs" /> {{ props.trip.duration.days }} روز
          </div>
        </q-img>

        <!-- Wishlist Button with Animation -->
        <q-btn
          round
          flat
          dense
          :class="['wishlist-btn', { wishlisted: isWishlisted }]"
          @click.stop="toggleFavorite"
        >
          <q-icon :name="isWishlisted ? 'favorite' : 'favorite_border'" size="sm" />
        </q-btn>
      </div>

      <!-- Content Section -->
      <q-card-section class="content-section">
        <!-- Title with Truncation -->
        <div class="header-row">
          <h3 class="trip-title text-truncate" :title="trip.title">{{ trip.title }}</h3>
        </div>

        <!-- Trip Details -->
        <div class="trip-details">
          <div class="trip-detail-item">
            <q-icon name="event" size="xs" class="detail-icon" />
            <span> اجرا : {{ formattedDateStart }}</span>
          </div>
          
          <div class="trip-detail-item">
            <q-icon name="place" size="xs" class="detail-icon" />
            <span>{{ props.trip.destination || 'مقصد' }}</span>
          </div>
        </div>
        
        <!-- Price with CTA -->
        <div class="action-row">
            <span class="price-label">هر نفر</span>
            <span class="price">{{ formatPrice(trip.price_per_adult) }}</span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWishListStore } from 'src/stores/wishlist'
import { useDateFormatter } from 'src/composables/useDateFormatter'

const props = defineProps({
  trip: {
    type: Object,
    required: true,
  },
})

const { formatPersianDisplay } = useDateFormatter()

const wishlistStore = useWishListStore()

const isWishlisted = computed(() => {
  return wishlistStore.isWishListed(props.trip.id)
})


const toggleFavorite = () => {
  wishlistStore.toggleFavorite(props.trip.id, props.trip)
}

const formatPrice = (price) => {
  return (
    new Intl.NumberFormat('fa-IR', {
      maximumFractionDigits: 0,
    }).format(price) + ' تومان '
  )
}

const router = useRouter()

const goToDetails = () => {
  router.push(`/trip/${props.trip.id}`)
}

const formattedDateStart = computed(() => formatPersianDisplay(props.trip.start_date))


</script>

<style scoped>
.trip-card-container {
  height: 100%;
  perspective: 1000px;
}

.trip-card {
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.trip-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.image-container {
  position: relative;
  overflow: hidden;
}

.trip-image {
  transition: transform 0.5s ease;
}

.trip-card:hover .trip-image {
  transform: scale(1.05);
}

/* Gradient overlay for better text visibility */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%);
  z-index: 1;
}

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.wishlist-btn:hover {
  background: white;
  transform: scale(1.1);
}

.wishlist-btn.wishlisted {
  color: #ff4081;
  animation: heartBeat 0.4s ease-in-out;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.duration-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--q-primary);
  z-index: 2;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-section {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.trip-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  color: var(--q-dark);
  max-width: 100%;
}

.trip-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.trip-detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--q-dark);
}

.detail-icon {
  color: var(--q-primary);
}

.action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.price-label {
  font-size: 0.8rem;
  color: var(--q-dark-secondary);
  margin-bottom: 2px;
  opacity: 0.8;
}

.price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--q-dark);
}

.view-btn {
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 12px;
  margin-right: -8px;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: rgba(var(--q-primary-rgb), 0.1);
}

@media (max-width: 768px) {
  .content-section {
    padding: 16px;
  }
  .trip-title {
    font-size: 1rem;
  }
  .price {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .content-section {
    padding: 14px;
  }
  .duration-badge {
    font-size: 0.75rem;
    padding: 3px 10px;
  }
}
</style>