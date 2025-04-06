<template>
  <div class="gallery-hero relative-position">

    <div class="gallery-grid" v-if="trip?.images">


      <div class="main-image rounded-borders overflow-hidden">
        <q-img
          v-if="trip.images.main"
          :src="trip.images.main"
          :ratio="16 / 9"
          class="transition-transform hover-scale"
        />
      </div>

      <div class="side-images" v-if="trip.images.gallery && trip.images.gallery.length">
        <div
          v-for="(imgObj, index) in trip.images.gallery.slice(0, 4)"
          :key="index"
          class="side-image rounded-borders overflow-hidden"
        >
          <q-img
            :src="imgObj.url"
            :ratio="1"
            class="transition-transform hover-scale"
          />

  
          <div
            v-if="index === 3 && trip.images.gallery.length > 4"
            class="more-overlay flex flex-center"
          >
            +{{ trip.images.gallery.length - 4 }}
          </div>
        </div>
      </div>
    </div>

    <q-btn
      class="gallery-btn"
      color="white"
      text-color="dark"
      flat
      @click.stop="toggleshowGallery"
    >
      <q-icon name="grid_view" class="q-mr-sm" />
      مشاهده گالری
    </q-btn>

    <q-dialog
      v-model="showGallery"
      full-width
      full-height
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="gallery-dialog">
        <q-bar class="bg-black text-white">
          <q-space />
          <q-btn dense flat icon="close" size="20px" v-close-popup />
        </q-bar>

        <q-carousel
          v-model="currentSlide"
          animated
          navigation
          infinite
          height="calc(100vh - 50px)"
          class="bg-black"
        >
  
          <q-carousel-slide
            v-if="trip?.images?.main"
            name="main"
            class="column no-wrap flex-center"
          >
            <img
              :src="trip.images.main"
              style="height: 100%; max-width: 100%; object-fit: contain"
              :alt="`Main Image`"
            />
          </q-carousel-slide>


          <q-carousel-slide
            v-for="(imgObj, index) in trip?.images?.gallery || []"
            :key="index"
            :name="index"
            class="column no-wrap flex-center"
          >
            <img
              :src="imgObj.url"
              :alt="imgObj.alt || 'Gallery Image'"
              style="height: 100%; max-width: 100%; object-fit: contain"
            />


            <div class="text-white text-subtitle2 q-mt-md">{{ imgObj.caption }}</div>
          </q-carousel-slide>
        </q-carousel>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const props =defineProps({
  trip: {
    type: Object,
    required: true
  }
})
console.log(props.trip.images)
const showGallery = ref(false)

const currentSlide = ref('main')

const toggleshowGallery = () => {
  showGallery.value = !showGallery.value
  if (showGallery.value && props.trip?.images?.main) {
    currentSlide.value = 'main'
  }
}

</script>

<style scoped>
.gallery-hero {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.5rem;
  height: 500px;
  margin-bottom: 2rem;
  cursor: pointer;
}

.main-image {
  height: 100%;
}

.side-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.side-image {
  position: relative;
}

.more-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.gallery-btn {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .gallery-grid {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    height: auto;
  }

  .side-images {
    display: none;
  }
}
</style>
