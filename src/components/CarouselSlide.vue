<template>
  <div class="carousel-wrapper">
    <q-carousel
      animated
      v-model="slide"
      infinite
      swipeable
      autoplay
      navigation
      class="custom-carousel"
      height="500px"
    >
      <q-carousel-slide
        :name="1"
        img-src="https://dynamic-media.tacdn.com/media/attractions-content--1x-1/14/37/d2/35.jpg?f=webp&amp;w=1900&amp;h=500&amp;s=1"
      />
      <q-carousel-slide
        :name="2"
        img-src="https://dynamic-media.tacdn.com/media/attractions-content--1x-1/14/37/d0/e0.jpg?f=webp&amp;w=1900&amp;h=500&amp;s=1"
      />
      <q-carousel-slide
        :name="3"
        img-src="https://dynamic-media.tacdn.com/media/attractions-content--1x-1/14/c3/5f/aa.jpg?f=webp&amp;w=1900&amp;h=500&amp;s=1"
      />

      <template #navigation-icon="{ active, onClick }">
        <i
          :class="active ? 'fas fa-circle' : 'far fa-circle'"
          class="custom-nav-icon"
          @click="onClick"
        ></i>
      </template>
    </q-carousel>

    <!-- Separate overlay content -->
    <div class="overlay-content">
      <search-bar />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import SearchBar from './SearchBar.vue'

const slide = ref(1)
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
}

.custom-carousel {
  height: 100%;
}

.overlay-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 0 20px;
}

.custom-nav-icon {
  font-size: 16px;
  cursor: pointer;
  margin: 0 4px;
}

/* Dark overlay for better text visibility */
.custom-carousel::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  pointer-events: none;
}
</style>
