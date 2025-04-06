<template>
  <div class="passenger-selector">
    <!-- Button to add new passenger -->
    <div class="row justify-end items-center q-mb-md q-pa-xs">
      <q-btn outline color="primary" label="افزودن مسافر" @click="openAddPassengerDialog">
        <span class="text-primary q-px-sm"><i class="fa-solid fa-user-plus"></i></span>
      </q-btn>
    </div>

    <!-- Loading state -->
    <div v-if="passengerStore.loading" class="text-center q-pa-md">
      <q-spinner color="primary" size="2em" />
      <div class="q-mt-sm">در حال بارگیری اطلاعات مسافران...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="passengerStore.error" class="text-center text-negative q-pa-md">
      <q-icon name="error" size="2em" />
      <div class="q-mt-sm">{{ passengerStore.error }}</div>
      <q-btn color="primary" class="q-mt-md" label="تلاش مجدد" @click="loadPassengers" />
    </div>

    <!-- No passengers -->
    <div v-else-if="!passengerStore.hasPassengers" class="text-center q-pa-md">
      <q-icon name="people" size="2em" color="grey-7" />
      <div class="q-mt-sm">شما هنوز مسافری ثبت نکرده‌اید</div>
    </div>

    <!-- List of passengers -->
    <div v-else>
      <div class="row q-col-gutter-md">
        <div
          v-for="passenger in passengerStore.passengers"
          :key="passenger.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <q-card class="passenger-card" clickable @click="openEditPassengerDialog(passenger)">
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <!-- Display 'firstname lastname' as full name -->
                  <div class="text-subtitle1 text-weight-bold">
                    {{ passenger.firstname }} {{ passenger.lastname }}
                  </div>
                  <!-- Display national_code -->
                  <div class="text-caption">کد ملی: {{ passenger.national_code }}</div>
                  <!-- Display dob -->
                  <div class="text-caption">
                    تاریخ تولد: {{ formatPersianDate(passenger.dob) }}
                  </div>
                  <!-- Display gender -->
                  <div class="text-caption">
                    جنسیت: {{ getGenderLabel(passenger.gender) }}
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <q-btn
                    icon="fa-solid fa-pen"
                    color="accent"
                    size="10px"
                    dense
                    flat
                    @click.stop="openEditPassengerDialog(passenger)"
                  />
                  <q-btn
                    icon="fa-solid fa-trash"
                    size="10px"
                    color="negative"
                    dense
                    flat
                    @click.stop="confirmDelete(passenger)"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Add/Edit passenger dialog -->
    <q-dialog v-model="isDialogOpen" persistent>
      <q-card style="width: 400px; max-width: 90vw;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            {{ isEditing ? 'ویرایش مسافر' : 'افزودن مسافر' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form ref="passengerFormRef" @submit="savePassenger" class="q-gutter-md">
            <!-- firstname -->
            <q-input 
              v-model="passengerForm.firstname" 
              label="نام" 
              outlined 
              :rules="[val => !!val || 'نام الزامی است']"
            />
            
            <!-- lastname -->
            <q-input 
              v-model="passengerForm.lastname" 
              label="نام خانوادگی" 
              outlined 
              :rules="[val => !!val || 'نام خانوادگی الزامی است']"
            />
            
            <!-- national_code -->
            <q-input 
              v-model="passengerForm.national_code" 
              label="کد ملی" 
              outlined 
              :rules="[
                val => !!val || 'کد ملی الزامی است',
                val => /^\d{10}$/.test(val) || 'کد ملی باید ۱۰ رقم باشد'
              ]"
            />
            
            <!-- dob - Using the working date picker pattern -->
            <div class="col-12">
              <q-input 
                ref="dobRef" 
                v-model="passengerForm.dob" 
                label="تاریخ تولد" 
                filled 
                readonly
                :rules="[val => !!val || 'تاریخ تولد الزامی است']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="passengerForm.dob"
                        mask="YYYY-MM-DD"
                        calendar="persian"
                        locale="fa" 
                        today-btn
                        minimal
                        first-day-of-week="6"
                      >
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn label="تایید" color="primary" flat v-close-popup />
                          <q-btn
                            label="انصراف"
                            color="grey"
                            flat
                            v-close-popup
                            @click="passengerForm.dob = tempDob"
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- gender -->
            <q-select
              v-model="passengerForm.gender"
              :options="genderOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="جنسیت"
              outlined
              :rules="[val => val !== null && val !== undefined || 'لطفا جنسیت را انتخاب کنید']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="left" class="bg-grey-2 q-pa-md">
          <q-btn flat label="لغو" color="dark" v-close-popup />
          <q-space />
          <q-btn 
            :label="isEditing ? 'به‌روزرسانی' : 'ذخیره'" 
            color="primary" 
            @click="submitForm"
            :loading="isSubmitting" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete confirmation dialog -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="fa-solid fa-user-minus" color="negative" text-color="white" />
          <span class="q-mr-sm">آیا از حذف این مسافر اطمینان دارید؟</span>
        </q-card-section>

        <q-card-actions class="flex items-center justify-between">
          <q-btn 
          flat 
          label="حذف" 
          color="negative" 
          @click="proceedWithDelete" 
          :loading="isDeleting"
          v-close-popup
          />
          <q-btn flat label="انصراف" color="dark" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePassengerStore } from '../../stores/passenger'
import { useDateFormatter } from 'src/composables/useDateFormatter'

// PROPS: we assume parent passes an object with { id: someUserId }
const props = defineProps({
  passengerInfo: {
    type: Object,
    default: () => ({}),
  },
})

const { toISOFormat, formatPersianDisplay, formatForFormInput } = useDateFormatter()

const passengerStore = usePassengerStore()
const isDialogOpen = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const passengerFormRef = ref(null)
const dobRef = ref(null)
const tempDob = ref('') // For date picker cancel operation
const passengerToDelete = ref(null)
const showDeleteConfirm = ref(false)

// Form state
const passengerForm = ref({
  id: null,
  user_id: props.passengerInfo.id,
  firstname: '',
  lastname: '',
  national_code: '',
  dob: '',
  gender: 0,
})

// Gender options
const genderOptions = [
  { label: 'مرد', value: 0 },
  { label: 'زن', value: 1 },
]

// Format Persian date for display
const formatPersianDate = (dateStr) => {
  return formatPersianDisplay(dateStr);
}

// Get gender label for display
const getGenderLabel = (genderValue) => {
  const option = genderOptions.find(opt => opt.value === genderValue)
  return option ? option.label : ''
}

// On mount, fetch passenger data if needed
onMounted(() => {
  if (!passengerStore.hasPassengers && !passengerStore.loading) {
    loadPassengers()
  }
})

const loadPassengers = async () => {
  try {
    await passengerStore.fetchPassengers()
  } catch (error) {
    console.error('Error loading passengers:', error)
  }
}

// Open "Add Passenger" dialog
const openAddPassengerDialog = () => {
  isEditing.value = false
  
  // IMPORTANT: Reset the form with the user_id from props
  passengerForm.value = {
    id: null,
    user_id: props.passengerInfo.id,
    firstname: '',
    lastname: '',
    national_code: '',
    dob: '',
    gender: 0,
  }
  
  // Set temp dob to empty for new passengers
  tempDob.value = ''
  
  isDialogOpen.value = true
}

// Open "Edit Passenger" dialog
const openEditPassengerDialog = (passenger) => {
  isEditing.value = true
  
  // Copy the existing passenger data
  passengerForm.value = {
    ...passenger,
    // Ensure dob is in the format expected by q-date
    dob: formatForFormInput(passenger.dob),
  }
  
  // Store the current date for cancel operations
  tempDob.value = passengerForm.value.dob
  
  isDialogOpen.value = true
}

// Submit form validation
const submitForm = async () => {
  const formRef = passengerFormRef.value
  if (formRef) {
    formRef.validate().then(success => {
      if (success) {
        savePassenger()
      }
    })
  }
}

// Save passenger (add or edit)
const savePassenger = async () => {
  try {
    isSubmitting.value = true
    // Create form data with properly formatted date
    const formData = {
      ...passengerForm.value,
      // Convert to ISO format for backend
      dob: toISOFormat(passengerForm.value.dob),
    }
    
    if (isEditing.value) {
      await passengerStore.updatePassenger(formData)
      console.log('Passenger updated successfully')
    } else {
      await passengerStore.addPassenger(formData)
      console.log('Passenger added successfully')
    }
    
    isDialogOpen.value = false
  } catch (err) {
    console.error('Error saving passenger:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Confirm delete passenger
const confirmDelete = (passenger) => {
  passengerToDelete.value = passenger
  showDeleteConfirm.value = true
}

// Delete passenger after confirmation
const proceedWithDelete = async () => {
  if (!passengerToDelete.value) return
  
  try {
    isDeleting.value = true
    await passengerStore.deletePassenger(passengerToDelete.value.id)
    console.log('Passenger deleted successfully')
  } catch (err) {
    console.error('Error deleting passenger:', err)
  } finally {
    isDeleting.value = false
    passengerToDelete.value = null
  }
}
</script>

<style lang="scss" scoped>
.passenger-card {
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .q-card__section {
    padding: 16px;
  }
}

.q-dialog__inner > div {
  border-radius: 8px;
}

.q-form {
  .q-field {
    margin-bottom: 16px;
  }
}
</style>