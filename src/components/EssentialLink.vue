<template>
<<<<<<< HEAD
  <q-item clickable tag="a" target="_blank" :href="props.link">
    <q-item-section v-if="props.icon" avatar>
=======
  <q-item
    clickable
    tag="a"
    target="_blank"
    :href="props.link"
  >
    <q-item-section
      v-if="props.icon"
      avatar
    >
>>>>>>> 346e535 (Initialize the project 🚀)
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
<<<<<<< HEAD
    required: true,
=======
    required: true
>>>>>>> 346e535 (Initialize the project 🚀)
  },

  caption: {
    type: String,
<<<<<<< HEAD
    default: '',
=======
    default: ''
>>>>>>> 346e535 (Initialize the project 🚀)
  },

  link: {
    type: String,
<<<<<<< HEAD
    default: '#',
=======
    default: '#'
>>>>>>> 346e535 (Initialize the project 🚀)
  },

  icon: {
    type: String,
<<<<<<< HEAD
    default: '',
  },
=======
    default: ''
  }
>>>>>>> 346e535 (Initialize the project 🚀)
})
</script>
