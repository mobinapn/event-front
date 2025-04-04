<template>
  <q-page class="bg-grey-1">
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen">
      <LoadingState />
    </div>
    <div v-else-if="error" class="text-center min-h-screen">
      <div class="text-negative text-h6 q-mt-md">{{ error }}</div>
      <q-btn unelevated color="primary" label="بازگشت" @click="router.back()" class="q-mt-lg" />
    </div>
    <template v-else-if="tripData">
      <div class="invoice-container q-pa-md">
        <!-- Header with Progress -->
        <ProgressInvoice />
        <div class="invoice-grid">
          <!-- Left Column: Trip & Passenger Details -->
          <div class="details-section">
            <!-- Trip Details Card -->
            <DetailSection :tripData="tripData" />
            <!-- Passengers Card -->
            <q-card flat bordered class="passengers-card">
              <q-card-section>
                <div class="text-h6 text-primary q-mb-md">مسافران</div>
                <q-list v-if="passengersData && passengersData.length" separator>
                  <q-item
                    v-for="(passenger, index) in passengersData"
                    :key="index"
                    class="passenger-item"
                  >
                    <q-item-section avatar class="q-px-sm">
                      <q-avatar color="primary" text-color="white">
                        {{ index + 1 }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-medium"
                        >{{ passenger.firstname }} {{ passenger.lastname }}</q-item-label
                      >
                      <q-item-label caption>
                        <q-icon name="badge" size="xs" class="q-mr-xs" />
                        {{ passenger.national_code }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="text-center text-grey q-pa-md">هیچ مسافری ثبت نشده است</div>
              </q-card-section>
            </q-card>
          </div>
          <!-- Right Column: Payment Section -->
          <div class="payment-section">
            <q-card flat bordered class="payment-card">
              <q-card-section>
                <div class="text-h6 text-primary q-mb-lg">جزئیات پرداخت</div>
                <!-- Price Breakdown -->
                <div class="price-breakdown">
                  <div class="price-row">
                    <span>هزینه هر نفر</span>
                    <span class="amount">{{ formatPrice(tripData.pricePerAdult) }} تومان</span>
                  </div>
                  <div class="price-row">
                    <span>تعداد مسافران</span>
                    <span class="amount">{{ passengersData?.length || 0 }} نفر</span>
                  </div>
                  <div class="price-row">
                    <span>کارمزد خدمات</span>
                    <span class="amount">{{ formatPrice(serviceFee) }} تومان</span>
                  </div>
                  <div class="total-row flex justify-between text-primary text-bold">
                    <span> مبلغ قابل پرداخت</span>
                    <span class="total-amount">{{ formatPrice(totalAmount) }} تومان</span>
                  </div>
                </div>
                <!-- Enhanced Payment Methods Section -->
                <div class="payment-methods q-mt-lg">
                  <h6 class="text-subtitle1 q-mb-md">روش پرداخت را انتخاب کنید</h6>
                  <!-- Wallet Option with Balance -->
                  <q-card
                    :class="[
                      'payment-option-card q-mb-md',
                      { selected: selectedPayment === 'wallet' },
                    ]"
                    clickable
                    @click="selectedPayment = 'wallet'"
                  >
                    <q-card-section class="row items-center no-wrap">
                      <q-radio v-model="selectedPayment" val="wallet" color="primary" />
                      <div class="wallet-icon q-mx-md">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5Z"
                            stroke="#1976D2"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M21 12H17C15.8954 12 15 12.8954 15 14C15 15.1046 15.8954 16 17 16H21V12Z"
                            stroke="#1976D2"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <circle cx="17" cy="14" r="1" fill="#1976D2" />
                        </svg>
                      </div>
                      <div class="column">
                        <span class="text-subtitle1 payment-label">پرداخت از کیف پول</span>
                        <span class="wallet-balance text-caption text-positive">
                          موجودی: {{ formatPrice(walletStore.balance) }} تومان
                        </span>
                      </div>
                      <q-space />
                    </q-card-section>
                  </q-card>
                  <!-- Mellat Bank Option -->
                  <q-card
                    :class="[
                      'payment-option-card q-mb-md',
                      { selected: selectedPayment === 'mellat' },
                    ]"
                    clickable
                    @click="selectedPayment = 'mellat'"
                  >
                    <q-card-section class="row items-center no-wrap">
                      <q-radio v-model="selectedPayment" val="mellat" color="primary" />
                      <div class="bank-icon q-mx-md">
                        <q-img src="/images/mellat.png" width="40px" height="40px"></q-img>
                      </div>
                      <span class="text-subtitle1 payment-label">درگاه بانک ملت</span>
                      <q-space />
                      <!-- <span class="text-caption text-grey">انتقال امن به درگاه بانک</span> -->
                    </q-card-section>
                  </q-card>
                  <!-- Payment Summary & Button -->
                  <div class="payment-action-section">
                    <q-btn
                      color="primary"
                      class="full-width payment-button q-mt-md"
                      size="lg"
                      :disable="
                        !selectedPayment ||
                        (selectedPayment === 'wallet' && walletStore.balance < totalAmount)
                      "
                      @click="processPayment"
                      :loading="processingPayment"
                    >
                      <span class="row items-center justify-center">
                        <q-icon name="payment" class="q-mr-sm" />
                        پرداخت
                      </span>
                    </q-btn>
                    <div
                      v-if="selectedPayment === 'wallet' && walletStore.balance < totalAmount"
                      class="text-negative text-center q-mt-md"
                    >
                      موجودی کیف پول شما کافی نیست. لطفاً روش پرداخت دیگری را انتخاب کنید.
                    </div>
                    <div class="secure-payment-info q-mt-lg text-center">
                      <div class="row justify-center items-center">
                        <q-icon name="lock" size="xs" color="green" class="q-mr-xs q-mb-md" />
                        <span class="text-caption text-grey"
                          >تمامی تراکنش‌های مالی با پروتکل امن SSL انجام می‌شود.</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReservationStore } from 'src/stores/reservation'
import LoadingState from 'src/components/LoadingState.vue'
import ProgressInvoice from 'src/components/ProgressInvoice.vue'
import DetailSection from 'src/components/DetailSection.vue'
// import { api } from 'src/boot/axios'
import { useWalletStore } from 'src/stores/wallet'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const reservation = useReservationStore()
const walletStore = useWalletStore()
const authStore = useAuthStore()
const selectedPayment = ref(null)
const loading = ref(true)
const error = ref(null)
const processingPayment = ref(false)
const currentUserId = authStore.user?.id

// Initialize data with better error handling
const initializeData = () => {
  try {
    console.log('Reservation Data:', reservation.reservationData) // Debug log

    if (!reservation.reservationData) {
      error.value = 'اطلاعات رزرو یافت نشد'
      router.push('/') // Redirect to home if no data found
      return false
    }
    return true
  } catch (err) {
    console.error('Initialization error:', err)
    error.value = 'خطا در بارگذاری اطلاعات'
    return false
  } finally {
    loading.value = false
  }
}

// Get data from store with proper error handling
const tripData = computed(() => {
  return reservation.reservationData?.trip || null
})
console.log('tripdata' , tripData.value)

const passengersData = computed(() => {
  return reservation.reservationData?.passengers || []
})

const totalAmount = computed(() => {
  return reservation.reservationData?.trip.totalPrice + serviceFee.value || 0
})

// Computed service fee (5% of total trip cost)
const serviceFee = computed(() => {
  if (!tripData.value?.pricePerAdult || !passengersData.value?.length) return 0
  return Math.floor(tripData.value.pricePerAdult * passengersData.value.length * 0.05)
})





const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('fa-IR').format(price)
}

// Function to clear form data after successful payment
const clearReservationFormData = () => {
  // Only clear form state after successful payment
  reservation.clearFormState()
}

const processPayment = async () => {
  if (!selectedPayment.value) return

  // For wallet payment, check balance first
  if (selectedPayment.value === 'wallet' && walletStore.balance < totalAmount.value) {
    error.value = 'موجودی کیف پول شما کافی نیست'
    return
  }

  processingPayment.value = true
  try {
    const payload = {
      tripId: tripData.value?.id,
      passengers: passengersData.value,
      totalAmount: totalAmount.value,
      paymentMethod: selectedPayment.value,
      serviceFee: serviceFee.value ,
      userId : currentUserId ,
      purchaseDate: new Date().toISOString()


    }


    console.log('Payment payload:', payload)

    // Handle different payment methods
    if (selectedPayment.value === 'wallet') {
      const result = await walletStore.withdrawFunds(totalAmount.value)

      if (result.success) {
        // Clear form state as we're done with the reservation flow
        clearReservationFormData()

        await axios.post('http://localhost:3000/purchased-trips' ,{
          userId : currentUserId ,
          tripData : tripData.value ,
          passengersData : passengersData.value ,
          totalAmount : totalAmount.value ,
          transactionId : `WALLET-${Date.now()}` ,
          paymentMethod : ' wallet' ,
          purchaseDate: new Date().toISOString() ,
          
        })
        const transactionId = `WALLET-${Date.now()}`
        reservation.setTransactionId(transactionId)
        localStorage.setItem('paymentAmount', totalAmount.value)

        router.push('/payment-status')
      } else {
        error.value = result.message || 'خطا در پرداخت از کیف پول'
      }
    } else if (['mellat'].includes(selectedPayment.value)) {
       $q.notify({
          message:'درگاه پرداخت در حال حاضر فعال نیست لطفا روش دیگری را انتخاب کنید' ,
          color:'negative',
          position:"top" ,
       })
    }
  } catch (err) {
    console.error('Payment Error:', err)
    error.value = 'خطا در پردازش پرداخت'
  } finally {
    processingPayment.value = false
  }
}

// Initialize data on mount
onMounted(() => {
  if (initializeData()) {
    walletStore.fetchWalletData()
  } ;
})
</script>
<style lang="scss" scoped>
.invoice-container {
  max-width: 1200px;
  margin: 0 auto;
  direction: rtl;
  padding: 2rem;
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
.passenger-item {
  padding: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f9fa;
  }
}
.price-breakdown {
  .price-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
    color: #666;
  }
  .total-row {
    padding: 1rem 0;
    margin-top: 1rem;
    font-size: 1.1rem;
  }
}
.payment-option-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
  }

  &.selected {
    border-color: var(--q-primary);
    background: rgba(25, 118, 210, 0.05);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  .payment-label {
    font-weight: 500;
  }

  .wallet-balance {
    font-size: 0.8rem;
    margin-top: 2px;
  }
}

.summary-card {
  border-radius: 12px;
  background-color: #f8f9fa;
}
.payment-button {
  border-radius: 12px;
  height: 54px;
  font-weight: 600;
  letter-spacing: 0.5px;

  &:not(:disabled) {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
}
.secure-payment-info {
  color: #666;
  font-size: 0.8rem;
}

.bank-icon,
.wallet-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}
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
