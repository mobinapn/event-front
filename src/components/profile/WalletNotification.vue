<template>
  <q-dialog v-model="isVisible">
    <q-card class="notification-card">
      <q-card-section class="row items-center no-wrap bg-primary text-white">
        <div class="col">
          <div class="text-h6">کیف پول شما به‌روزرسانی شد</div>
          <div class="text-subtitle2">{{ formattedDate }}</div>
        </div>
        <q-space />
        <q-avatar icon="account_balance_wallet" color="white" text-color="primary" size="56px" />
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <div class="row items-center justify-center q-mb-md">
          <div class="text-h5 text-positive">
            + {{ formatPrice(amount) }} تومان
          </div>
        </div>
        
        <div class="text-center q-mb-lg">
          مبلغ بالا بابت <strong>{{ reason }}</strong> به کیف پول شما اضافه شد.
        </div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <div class="detail-box">
              <div class="detail-label">موجودی فعلی</div>
              <div class="detail-value">{{ formatPrice(currentBalance) }} تومان</div>
            </div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="detail-box">
              <div class="detail-label">شناسه تراکنش</div>
              <div class="detail-value transaction-id">{{ transactionId }}</div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md">
        <q-btn flat color="grey" label="بستن" @click="closeNotification" />
        <q-btn color="primary" label="مشاهده کیف پول" @click="viewWallet" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    default: 'لغو سفر'
  },
  transactionId: {
    type: String,
    required: true
  },
  currentBalance: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:show', 'view-wallet'])
const router = useRouter()

// Create a local reactive variable that we'll use for the dialog
const isVisible = ref(props.show)

// Watch for changes to the prop and update our local state
watch(() => props.show, (newValue) => {
  isVisible.value = newValue
})

// Watch for changes to our local state and emit events to update the parent
watch(isVisible, (newValue) => {
  if (props.show !== newValue) {
    emit('update:show', newValue)
  }
})

const formattedDate = computed(() => {
  const now = new Date()
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(now)
})

const formatPrice = (price) => {
  if (!price) return '0'
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const closeNotification = () => {
  isVisible.value = false
}

const viewWallet = () => {
  isVisible.value = false
  emit('view-wallet')
  router.push('/wallet')
}
</script>

<style scoped>
.notification-card {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
}

.detail-box {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.detail-label {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: bold;
}

.transaction-id {
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>