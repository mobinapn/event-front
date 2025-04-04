<template>
  <q-page class="checkout-page" dir="rtl">
    <!-- Progress Steps Section - Already Added -->
    <div class="header-section q-mb-xl">
      <h1 class="text-h4 text-center q-mb-md q-pt-md text-weight-bold">تکمیل رزرو</h1>
      <div class="progress-steps">
        <div class="step complete">
          <div class="step-icon">1</div>
          <span>انتخاب تور</span>
        </div>
        <div class="step active">
          <div class="step-icon">2</div>
          <span>اطلاعات مسافران</span>
        </div>
        <div class="step">
          <div class="step-icon">3</div>
          <span>پرداخت</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen">
      <q-spinner-dots size="80px" color="primary" />
      <div class="text-subtitle1 q-mt-md">در حال بارگذاری...</div>
    </div>

    <div v-else-if="error" class="text-center min-h-screen">
      <div class="text-negative text-h6 q-mt-md">{{ error }}</div>
      <q-btn unelevated color="primary" label="بازگشت" @click="router.back()" class="q-mt-lg" />
    </div>

    <template v-else>
      <PreviousPassengersModal 
      v-model="passengerModal" 
      :passengers="passengerStore.passengers"
      @select-passenger="fillPassengerForm"
    />
      <div class="invoice-container">
        <q-form @submit.prevent="handleُSubmiting">
        <div class="invoice-grid">
          <!-- Left Column: Trip & Passenger Details -->
          <div class="details-section">
            <!-- Trip Details Card -->
            <q-card flat bordered class="trip-card q-mb-lg">
              <q-card-section>
                <SummeryCard :trip="trip" />
              </q-card-section>
            </q-card>
            <!-- Passenger Forms -->
            <q-card flat bordered class="passengers-card">
              <q-card-section>
                <div class="passengers-header">
                  <div class="text-h6 text-primary">اطلاعات مسافران</div>
                </div>
                <div v-for="(passenger, index) in passengers" :key="index" class="passenger-form">
                  <div class=" flex items-center justify-between">
                    <div class="passenger-number">
                      <h3>مسافر</h3>
                      <q-avatar color="primary" text-color="white" size="32px">
                        {{ index + 1 }}
                      </q-avatar>
                  </div>
                  <div>
                    <q-btn flat color="primary" class="select-previous" @click="openDialog(index)">
                        <q-icon name="people" class="q-mr-sm" />
                        انتخاب از مسافران قبلی
                      </q-btn>
                </div>
                  </div>
                  <div class="form-grid">
                      <q-input
                      v-model="passengers[index].firstname"
                      label="نام"
                      lazy-rules
                      outlined
                      class="input-field"
                      :rules="[(val) => !!val || 'نام الزامی است']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" color="primary" />
                      </template>
                    </q-input>

                    <q-input
                      v-model="passengers[index].lastname"
                      label="نام خانوادگی"
                      outlined
                      class="input-field"
                      :rules="[(val) => !!val || 'نام خانوادگی الزامی است']"
                      lazy-rules
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" color="primary" />
                      </template>
                    </q-input>

                    <q-input
                      v-model="passengers[index].national_code"
                      label="کد ملی"
                      outlined
                      class="input-field"
                      :rules="[
                        (val) => !!val || 'کد ملی الزامی است',
                        (val) => val.length === 10 || 'کد ملی باید 10 رقم باشد',
                      ]"
                      lazy-rules
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge" color="primary" />
                      </template>
                    </q-input>
                    <q-input
                      v-model="passengers[index].dobDisplay"
                      label="تاریخ تولد"
                      outlined
                      readonly
                      class="input-field"
                      lazy-rules
                      :rules="[(val) => !!val || 'تاریخ تولد الزامی است']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="calendar_today" color="primary" />
                      </template>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date
                              v-model="passengers[index].dob"
                              mask="YYYY-MM-DD"
                              calendar="persian"
                              today-btn
                              :navigation-min-year-month="'1300/01'"
                              :navigation-max-year-month="'1402/12'"
                              @update:model-value="updateDisplayDate(index)"
                            >
                              <div class="row items-center justify-end q-gutter-sm q-px-sm q-pb-sm">
                                <q-btn label="انصراف" color="grey-7" flat v-close-popup />
                                <q-btn label="تایید" color="primary" flat v-close-popup />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-select
                      v-model="passenger.gender"
                      :options="genderOptions"
                      option-label="label"
                      option-value="value"
                      map-options
                      label="جنسیت"
                      outlined
                    />
                  </div>
                </div>

              </q-card-section>
            </q-card>
          </div>
          <!-- Right Column: Payment Summary -->
          <div class="payment-section">
            <q-card flat bordered class="payment-card">
              <q-card-section>
                <div class="text-h6 text-primary q-mb-lg">جزئیات پرداخت</div>
                <div class="price-breakdown">
                  <div class="price-row">
                    <span>تعداد بزرگسالان</span>
                    <span class="amount">{{ trip.totalAdults }} نفر</span>
                  </div>
                  <div class="price-row">
                    <span>هزینه هر بزرگسال</span>
                    <span class="amount">{{ formatPrice(trip?.pricePerAdult ) }}</span>
                  </div>
                  <div class="price-row" v-if="trip.totalChildren > 0">
                    <span>تعداد کودکان</span>
                    <span class="amount">{{ trip.totalChildren }} نفر</span>
                  </div>
                  <div class="price-row" v-if="trip.totalChildren > 0">
                    <span>هزینه هر کودک</span>
                    <span class="amount">{{ formatPrice(trip?.pricePerChild ) }}</span>
                  </div>
                  <div class="total-row">
                    <span>جمع کل</span>
                    <span class="total-amount">{{ formatPrice(trip.totalPrice) }}</span>
                  </div>
                </div>
                <q-checkbox
                  v-model="termsAccepted"
                  :true-value="true"
                  :false-value="false"
                  class="terms-checkbox q-my-md text-center"
                  label="با تکمیل رزرو ، شما قوانین و مقررات  سایت را می‌پذیرید"
                  :left-label="true"
                />
                <q-btn
                  unelevated
                  color="primary"
                  class="payment-button"
                  :loading="submitting"
                  :disable="!isValid || !termsAccepted"
                  type="submit"
                >
                  <span class="row items-center justify-center">
                    <q-icon name="payment" class="q-mr-sm" />
                    تکمیل رزرو و پرداخت
                  </span>
                  <template v-slot:loading>
                    <q-spinner-dots />
                  </template>
                </q-btn>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-form>
      </div>
    </template>
    <AuthDialog 
      v-model:isOpen="authDialog.isOpen" 
      :redirectPath="authDialog.redirectPath"
      @auth-success="authDialog.handleSuccess" 
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch , reactive} from 'vue'
import { useRouter , useRoute } from 'vue-router'
import { useReservationStore } from '../stores/reservation'
import { usePassengerStore } from 'src/stores/passenger'
import { useAuthStore } from 'src/stores/auth'
import { useDateFormatter } from 'src/composables/useDateFormatter' 

import SummeryCard from 'src/components/SummeryCard.vue'
import PreviousPassengersModal from 'src/components/PreviousPassengersModal.vue'

const router = useRouter()
const route = useRoute()
const reservationStore = useReservationStore()
const passengerStore = usePassengerStore()
const currentPassengerIndex = ref(0)
const authStore = useAuthStore()
const { formatPersianDisplay } = useDateFormatter()


const authDialog = reactive({
  isOpen: false,
  redirectPath: route.fullPath,
  pendingAction: null,
  handleSuccess: () => {
    if (authDialog.pendingAction) {
      authDialog.pendingAction()
      authDialog.pendingAction = null
    }
  }
})

// State
const loading = ref(true)
const error = ref(null)
const trip = ref(null)
const submitting = ref(false)
const passengers = ref([])
const termsAccepted = ref(false)
const passengerModal = ref(false)


// select options
const genderOptions = [
  { label: 'مرد', value: 0 },
  { label: 'زن', value: 1 },
]

const loadData = async () => {
  try {
    if (!reservationStore.reservationData) {
      router.push('/')
      return
    }

    trip.value = reservationStore.reservationData.trip
    
    const savedState = reservationStore.getFormState()

    if (savedState.passengerDetails.length > 0) {
      passengers.value = savedState.passengerDetails
      passengers.value.forEach(passenger => {
        if (passenger.dob) {
          passenger.dobDisplay = formatPersianDisplay(passenger.dob)
        } else {
          passenger.dobDisplay = ''
        }
      })
      termsAccepted.value = savedState.checkoutFormState.termsAccepted
    } else {
      const passengerCount = reservationStore.totalGuests
      passengers.value = Array.from({ length: passengerCount }, () => ({
        firstname: '',
        lastname: '',
        national_code: '',
        dob: '',
        gender: ''
      }))
    }
  } catch (err) {
    console.error('Error initializing checkout:', err)
    error.value = 'خطا در بارگذاری اطلاعات'
  } finally {
    loading.value = false
  }
}

const updateDisplayDate = (index) => {
  if (passengers.value[index].dob) {
    passengers.value[index].dobDisplay = formatPersianDisplay(passengers.value[index].dob)
  }
}
onMounted(async () => {
  await 
  loadData()
})


const isValid = computed(() => {
  return passengers.value.every(
    (passenger) =>
      passenger.firstname &&
      passenger.lastname &&
      passenger.national_code &&
      passenger.national_code.length === 10 &&
      passenger.dob &&
      passenger.gender !== undefined
  )
})

// Methods
const formatPrice = (price) => {
  return (
    new Intl.NumberFormat('fa-IR', {
      maximumFractionDigits: 0,
    }).format(price) + ' تومان '
  )
}

watch(
  [passengers, termsAccepted],
  () => {
    reservationStore.saveFormState(passengers.value, termsAccepted.value)
  },
  { deep: true },
)

// Modify your handleُSubmiting function
const handleُSubmiting = async () => {
  if (!isValid.value || !termsAccepted.value) return

    // Check authentication before proceeding
    if (!authStore.isAuthenticated) {
    authDialog.pendingAction = proceedWithCheckout
    authDialog.redirectPath = '/checkout' // Stay on the same page after login
    authDialog.isOpen = true
    return
  }
    // If authenticated, proceed directly
    proceedWithCheckout()
}
const proceedWithCheckout = async () => {
  submitting.value = true
  try {
    const payload = {
      tripId: trip.value.id,
      trip: trip.value,
      passengers: passengers.value,
    }

    reservationStore.setReservationData(payload)
    router.push('/invoice')
  } catch (error) {
    console.error('Reservation error:', error)
  } finally {
    submitting.value = false
  }
}

// Modified openDialog method to check authentication
const openDialog = (index) => {
  // Check authentication before showing previous passengers
  if (!authStore.isAuthenticated) {
    currentPassengerIndex.value = index // Save the index for later use
    authDialog.pendingAction = () => showPreviousPassengersModal(index)
    authDialog.redirectPath = '/checkout' // Stay on the same page after login
    authDialog.isOpen = true
    return
  }
  
  // If authenticated, proceed directly
  showPreviousPassengersModal(index)
}

const showPreviousPassengersModal = (index) => {
  currentPassengerIndex.value = index
  passengerModal.value = true }


const fillPassengerForm = (selectedPassenger) => {
  if (currentPassengerIndex.value >= 0 && currentPassengerIndex.value < passengers.value.length) {
    // Ensure we're copying all properties correctly
    const passengerToUpdate = passengers.value[currentPassengerIndex.value];
    passengerToUpdate.firstname = selectedPassenger.firstname;
    passengerToUpdate.lastname = selectedPassenger.lastname;
    passengerToUpdate.national_code = selectedPassenger.national_code;
    passengerToUpdate.dob = selectedPassenger.dob;
    passengerToUpdate.dobDisplay = formatPersianDisplay(selectedPassenger.dob);
    passengerToUpdate.gender = selectedPassenger.gender;
    
    // Trigger reactivity by ensuring the array reference changes
    passengers.value = [...passengers.value];
    
    // Close the modal after selection
    passengerModal.value = false;
  }
}
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    await passengerStore.fetchPassengers()
  }
})

onMounted(async () => {
  await loadData()
  
  // Load previous passengers if authenticated
  if (authStore.isAuthenticated) {
    await passengerStore.fetchPassengers()
  }
})

</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  background: #f8fafc;
}
.invoice-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;

  @media (max-width: 1024px) {
    padding: 0 1rem 1rem;
  }
}

.invoice-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

// Card Styles
.trip-card,
.passengers-card,
.payment-card {
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: none;
  background: white;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }

  .q-card__section {
    padding: 1.5rem;
  }
}
.payment-card {
  position: sticky;
  top: 6rem;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 50px;
}

.passengers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.passenger-form {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
  }

  .passenger-number {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0;
    }
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  .input-field {
    transition: all 0.3s ease;

    &:focus-within {
      transform: translateY(-2px);
    }
  }
}

.price-breakdown {
  .price-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
    color: #64748b;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    margin-top: 1rem;
    border-top: 2px solid #e0e0e0;
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--q-primary);
  }
}

.payment-button {
  width: 100%;
  border-radius: 12px;
  height: 54px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 1.5rem;
  transition: all 0.3s ease;

  &:not(:disabled) {
    box-shadow: 0 4px 6px rgba(var(--q-primary), 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(var(--q-primary), 0.3);
    }
  }
}

.terms-checkbox {
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-1px);
  }
}

.progress-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;
  max-width: 600px;
  margin: 0 auto;

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    max-width: 150px;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 20px;
      right: 50%;
      width: 100%;
      height: 2px;
      background: #e0e0e0;
      z-index: 0;
    }

    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
      z-index: 1;
      font-weight: bold;
    }

    span {
      font-size: 0.9rem;
      color: #666;
    }

    &.complete {
      .step-icon {
        background: var(--q-primary);
        color: white;
      }

      &::after {
        background: var(--q-primary);
      }
    }

    &.active {
      .step-icon {
        background: var(--q-primary);
        color: white;
        box-shadow: 0 0 0 4px rgba(var(--q-primary), 0.2);
      }
    }
  }
}
</style>
