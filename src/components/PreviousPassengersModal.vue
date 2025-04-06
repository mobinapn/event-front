<template>
  <q-dialog v-model="isOpen" @update:model-value="updateModalState">
    <q-card class="passenger-list-modal">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-primary">لیست مسافران سابق</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-input 
          v-model="searchTerm" 
          outlined
          dense
          placeholder="جستجو" 
          class="q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon v-if="searchTerm.length > 0" name="close" class="cursor-pointer" @click="searchTerm = ''" />
          </template>
        </q-input>
        
        <div class="previous-passengers-list">
          <q-list separator>
            <q-item 
              v-for="(passenger, index) in filteredPassengers" 
              :key="index" 
              clickable
              v-ripple
              @click="selectPassenger(passenger)"
            >
              <q-item-section>
                <q-item-label>{{ passenger.firstname }} {{ passenger.lastname }}</q-item-label>
                <q-item-label caption>
                  <span class="text-primary">کد ملی:</span> {{ passenger.national_code }} | 
                  <span class="text-primary"> تاریخ تولد:</span> {{ formatPassengerDate(passenger) }} 
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn color="primary" flat round icon="add" @click.stop="selectPassenger(passenger)" />
              </q-item-section>
            </q-item>
            
            <div v-if="filteredPassengers.length === 0" class="text-center q-pa-md text-grey">
              هیچ مسافری یافت نشد
            </div>
          </q-list>
        </div>
      </q-card-section>
      
      <q-card-actions align="center" class="q-pa-md">
        <q-btn v-close-popup color="primary" label="بستن" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDateFormatter } from 'src/composables/useDateFormatter'


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  passengers: {
    type: Array,
    default: () => []
  },
  currentPassengerIndex: {
    type: Number,
    default: 0
  }
})
const {formatPersianDisplay} = useDateFormatter()

const formatPassengerDate = (passenger) => {
  return formatPersianDisplay(passenger.dob)
}
const emit = defineEmits(['update:modelValue', 'select-passenger'])

// Local state
const searchTerm = ref('')
const isOpen = ref(props.modelValue)

// Watch for parent modelValue changes
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})

// Update parent when modal is closed
const updateModalState = (val) => {
  emit('update:modelValue', val)
}

// Computed for filtered passengers
const filteredPassengers = computed(() => {
  if (!searchTerm.value) return props.passengers
  
  const search = searchTerm.value.toLowerCase()
  return props.passengers.filter(passenger => 
    passenger.firstname?.toLowerCase().includes(search) || 
    passenger.lastname?.toLowerCase().includes(search) || 
    passenger.national_code?.includes(search) || 
    passenger.dob?.includes(search)
  )
})

// Function to select a passenger and emit to parent
const selectPassenger = (passenger) => {
  emit('select-passenger', passenger)
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.passenger-list-modal {
  width: 500px;
  max-width: 95vw;
  max-height: 80vh;
  border-radius: 16px;
}

.previous-passengers-list {
  max-height: 400px;
  overflow-y: auto;
}
</style>