<template>
  <q-page class="flex column">
    <carousel-slide />
    <!-- <NavbarCategory/> -->
    <TripList></TripList>
    <WhyUs />
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTripsStore } from '../stores/trips'
import CarouselSlide from 'components/CarouselSlide.vue'
import TripList from 'components/TripList.vue'
// import NavbarCategory from 'components/NavbarCategory.vue'
import WhyUs from 'src/components/WhyUs.vue'

const tripsStore = useTripsStore()

onMounted(async () => {
  await tripsStore.fetchTrips()
})
</script>
<style scoped></style>
