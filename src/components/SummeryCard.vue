<template>
  <div class="trip-info">
    <div class="trip-details">
      <h1 class="trip-title">{{ trip?.title }}</h1>
      <div class="trip-dates">
        <div class="date-item">
          <q-icon name="flight_takeoff" size="sm" color="primary" />
          <span>تاریخ حرکت :</span>
          <span>{{ trip?.startDate }}</span>
        </div>
        <div class="date-item">
          <q-icon name="flight_land" size="sm" color="primary" />
          <span>تاریخ برگشت</span>
          <span>{{ trip?.endDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  trip: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.trip-info {
  .trip-image {
    border-radius: 16px;
    overflow: hidden;
  }

  .trip-details {
    padding: 1rem;

    .trip-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .trip-dates {
      display: flex;
      gap: 2rem;

      .date-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #64748b;
      }
    }
  }
}
</style>
