<template>
  <div class="main-content q-pa-md">
    <div class="title-container q-pa-lg">
      <h1 class="text-h3 text-secondary q-mb-md font-weight-bold">{{ trip.title }}</h1>
      <div class="location-badge">
        <q-icon name="place" color="primary" size="18px" />
        <span class="q-ml-sm text-secondary">{{ trip.destination }}</span>
      </div>
    </div>

    <!-- Trip Details Cards -->
    <div class="q-mb-lg">
      <div class="row q-col-gutter-md">
        <div class="col-6 col-sm-3" v-for="(detail, index) in tripDetails" :key="index">
          <q-card class="trip-detail-card q-pa-md text-center" flat bordered>
            <q-icon :name="detail.icon" size="1.8rem" color="accent" class="q-mb-sm" />
            <p class="text-weight-bold q-mb-xs no-margin">{{ detail.title }}</p>
            <div class="text-subtitle2">{{ detail.value }}</div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Description Section -->
    <q-card class="description-card q-mb-lg" flat bordered>
      <q-card-section>
        <div class="text-h5 q-mb-md">درباره این سفر</div>
        <q-separator class="q-mb-md" />
        <p class="text-body1 line-height-lg">{{ trip.description }}</p>
      </q-card-section>
    </q-card>

    <!-- Services, Requirements, Rules in a Modern View -->
    <q-card flat bordered class="trip-info-card q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-mb-md">امکانات سفر</div>
        <q-separator class="q-mb-md" />
        <div class="row q-col-gutter-sm">
          <div v-for="(service, index) in trip.services" :key="index" class="col-12 col-sm-6 col-md-4">
            <div class="info-item">
              <!-- <q-icon name="check_circle" color="positive" size="xs" class="q-mr-sm" /> -->
              {{ service }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="trip-info-card q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-mb-md">لوازم ضروری</div>
        <q-separator class="q-mb-md" />
        <div class="row q-col-gutter-sm">
          <div v-for="(req, index) in combinedRequirements" :key="index" class="col-12 col-sm-6 col-md-4">
            <div class="info-item">
              <!-- <q-icon name="info" color="info" size="xs" class="q-mr-sm" /> -->
              {{ req }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <!-- Trip Itinerary Section -->
<q-card flat bordered class="trip-info-card q-mb-lg">
  <q-card-section>
    <div class="text-h5 q-mb-md">برنامه سفر</div>
    <q-separator class="q-mb-md" />
    
    <div class="itinerary-container">
      <div v-for="(day, index) in trip.itinerary" :key="index" class="itinerary-day q-mb-lg">
        <q-expansion-item
          :label="`روز ${day.day}: ${day.title}`"
          header-class="bg-grey-2"
          expand-icon-class="text-primary"
          :default-opened="index === 0"
        >
          <q-card>
            <q-card-section>
              <p class="text-body1">{{ day.description }}</p>
              
              <div v-if="day.activities && day.activities.length > 0" class="q-mt-md">
                <div class="text-subtitle1 q-mb-sm">فعالیت‌ها:</div>
                <div class="row q-col-gutter-sm">
                  <div v-for="(activity, actIndex) in day.activities" :key="actIndex" class="col-12 col-sm-6 col-md-4">
                    <div class="info-item text-center">
                      <!-- <q-icon name="directions_run" color="primary" size="xs" class="q-mr-sm" /> -->
                      {{ activity }}
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </div>
  </q-card-section>
</q-card>
    <q-card flat bordered class="trip-info-card q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-mb-md">شرایط و قوانین</div>
        <q-separator class="q-mb-md" />
        <p class="text-body1">{{ trip.rules }}</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  trip: {
    type: Object,
    required: true,
  }
})

const tripDetails = [
  { icon: 'fa-solid fa-clock', title: 'مدت زمان برنامه', value: `${props.trip.duration.days} روز و ${props.trip.duration.nights} شب` },
  { icon: 'fas fa-utensils', title: 'وعده‌های غذایی', value: '۴ وعده صبحانه + ۳ وعده نهار' },
  { icon: 'fa-solid fa-route', title: 'وسیله حمل و نقل', value: props.trip.transportation.type },
  { icon: 'fas fa-hotel', title: 'اقامت', value: props.trip.accommodation.name  }
]

const combinedRequirements = computed(() => {
  const defaultReqs = ['شناسنامه', 'لباس گرم']
  return [...(props.trip.requirements || []), ...defaultReqs]
})
</script>

<style scoped>

.location-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 4px 12px;
}
.trip-detail-card, .description-card, .trip-info-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}
.trip-detail-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}
.info-item {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
}
.info-item:hover {
  background-color: #e0e0e0;
}
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  direction: rtl;
}
.location-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 4px 12px;
}

/* Trip Detail Cards */
.trip-detail-card {
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.trip-detail-card:hover {
  border-left-color: var(--q-primary);
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

/* Description Card */
.description-card {
  border-radius: 12px;
  overflow: hidden;
}

.description-content {
  max-height: 120px;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.description-content.expanded {
  max-height: 2000px;
}

.rounded-top-borders {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

/* Trip Info Tabs */
.trip-info-card {
  border-radius: 12px;
  overflow: hidden;
}

.service-item, .requirement-item {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
}

.service-item:hover, .requirement-item:hover {
  background-color: #e0e0e0;
}


/* Responsive Adjustments */
@media (max-width: 599px) {

  
  .title-container {
    padding: 8px 16px;
  }
  
  .title-container h1 {
    font-size: 1.5rem;
  }
}


/* Animation Classes */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}
.slide-up-enter, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
/* Itinerary Styles */
.itinerary-day {
  border-radius: 12px;
  overflow: hidden;
}

.itinerary-day:not(:last-child) {
  margin-bottom: 16px;
}

.itinerary-day .q-expansion-item__content {
  background-color: #fff;
}
</style>