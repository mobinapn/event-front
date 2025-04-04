<template>
  <q-card flat bordered class="trip-card q-mb-lg">
    <q-card-section>
      <div class="text-h6 text-primary q-mb-md">جزئیات سفر</div>
      <div class="detail-row">
        <q-icon name="flight_takeoff" color="primary" size="sm" class="q-mr-sm" />
        <span class="text-subtitle1">عنوان تور:</span>
        <span class="text-weight-medium">{{ tripData.title || 'N/A' }}</span>
      </div>
      <div class="detail-row">
        <q-icon name="event" color="primary" size="sm" class="q-mr-sm" />
        <span class="text-subtitle1"> تاریخ حرکت :</span>
        <span class="text-weight-medium">{{ tripData.startDate }}</span>
      </div>
      <div class="detail-row">
        <q-icon name="event" color="primary" size="sm" class="q-mr-sm" />
        <span class="text-subtitle1">تاریخ برگشت :</span>
        <span class="text-weight-medium">{{ tripData.endDate }}</span>
      </div>
      <div class="detail-row">
        <q-icon name="confirmation_number" color="primary" size="sm" class="q-mr-sm" />
        <span class="text-subtitle1">شناسه سفر:</span>
        <span class="text-weight-medium">{{ tripData.id || 'N/A' }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  tripData: {
    type: Object,
    require: true,
  },
})
</script>
<style lang="scss" scoped>
.detail-row {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .text-subtitle1 {
    color: #666;
    margin-right: 0.5rem;
    margin-left: 1rem;
  }

  .text-weight-medium {
    color: #333;
  }
}
.trip-card,
.passengers-card,
.payment-card {
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: none;
  background: white;

  .q-card__section {
    padding: 1.5rem;
  }
}
</style>
