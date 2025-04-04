<template>
  <q-page class="flex flex-center column q-pa-md">
    <q-card flat bordered class="payment-status-card q-pa-lg">
      <div class="text-center">
        <q-icon
          name="check_circle"
          color="positive"
          size="100px"
          class="q-mb-md"
        />
        
        <h4 class="text-h4 text-positive q-mb-sm">پرداخت با موفقیت انجام شد</h4>
        <p class="text-subtitle1 q-mb-lg">
          مبلغ {{ formatPrice(paymentAmount) }} تومان از کیف پول شما کسر شد
        </p>
        
        <div class="transaction-details q-pa-md q-mb-md bg-grey-2 rounded-borders">
          <div class="row justify-between q-mb-sm">
            <span class="text-weight-medium">شماره تراکنش:</span>
            <span>{{ transactionId }}</span>
          </div>
          <div class="row justify-between q-mb-sm">
            <span class="text-weight-medium">تاریخ و زمان:</span>
            <span>{{ formatDateTime(new Date()) }}</span>
          </div>
          <div class="row justify-between">
            <span class="text-weight-medium">روش پرداخت:</span>
            <span>کیف پول</span>
          </div>
        </div>
        
        <div class="action-buttons">
          <q-btn
            color="primary"
            label="مشاهده سفرهای من"
            class="q-mb-md full-width"
            size="large"
            @click="goToTrips"
          />
          <q-btn
            outline
            color="primary"
            label="بازگشت به صفحه اصلی"
            class="full-width"
            size="large"
            to="/"
          />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReservationStore } from 'src/stores/reservation'

const router = useRouter()
const reservation = useReservationStore()
const transactionId = ref('')
const paymentAmount = ref(0)

// Format price with Farsi numerals
const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('fa-IR').format(price)
}

// Format date and time in Farsi
const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

onMounted(() => {
  // Get transaction data from reservation store
  transactionId.value = reservation.transactionId

  const storedAmount = localStorage.getItem('paymentAmount')
  paymentAmount.value = storedAmount ? parseInt(storedAmount) : 0
  
  // Clear localStorage after retrieving the data
  localStorage.removeItem('paymentAmount')
  // If there's no transaction ID, redirect to home
  if (!transactionId.value) {
    router.push('/')
  }
})
const goToTrips = () => {
  router.push({ path: '/profile', query: { tab: 'trips' } });
};

</script>

<style scoped>
.payment-status-card {
  max-width: 600px;
  width: 100%;
}

.transaction-details {
  text-align: right;
  border-radius: 8px;
}
</style>