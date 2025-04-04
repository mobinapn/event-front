<template>
  <div>
    <div v-if="favoriteTrips.length > 0" class="row q-col-gutter-md">
      <div v-for="trip in favoriteTrips" :key="trip.id" class="col-12 col-sm-6 col-md-4 ">
        <TripCard :trip="trip" />
      </div>
    </div>
    <div v-else>
      <q-card flat>
        <q-card-section class="q-mb-lg">
          <div class="flex flex-center text-primary text-h5 q-mb-md">
            هنوز چیزی در لیست علاقه مندی های شما وجود ندارد
          </div>
          <div class="flex flex-center q-mt-md">
            <q-img src="/images/undraw_wishlist_71gv.svg" width="250px" height="auto"> </q-img>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useWishListStore } from 'src/stores/wishlist'
import TripCard from 'src/components/TripCard.vue'

const wishListStore = useWishListStore()
const favoriteTrips = ref([])

onMounted(() => {
  wishListStore.loadWishlist()
  favoriteTrips.value = wishListStore.getFavoriteTripsWithData()
})
</script>