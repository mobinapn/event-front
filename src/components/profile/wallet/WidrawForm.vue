<template>
  <div class="withdraw-form">
    <div class="modal-header">
      <h3>برداشت موجودی</h3>
      <button @click="$emit('cancel')" class="modal-close">
        <i class="material-icons">close</i>
      </button>
    </div>
    <div class="modal-body">
      <div class="input-group">
        <label>مبلغ (تومان)</label>
        <input
          type="number"
          v-model.number="amount"
          placeholder="مبلغ مورد نظر را وارد کنید"
          min="1000"
        />
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
      <div class="current-balance">
        موجودی فعلی: {{ formatCurrency(walletStore.balance) }} تومان
      </div>
    </div>
    <div class="modal-footer">
      <button @click="validateAndSubmit" class="btn btn-primary" :disabled="isProcessing">
        {{ isProcessing ? 'در حال پردازش...' : 'تأیید برداشت' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWalletStore } from 'src/stores/wallet'

const walletStore = useWalletStore()

const amount = ref(null)
const error = ref('')
const isProcessing = ref(false)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount || 0)
}

const validateAndSubmit = () => {
  // Reset previous errors
  error.value = ''

  // Validation checks
  if (!amount.value || amount.value <= 0) {
    error.value = 'لطفا مبلغ معتبر وارد کنید'
    return
  }

  if (amount.value < 1000) {
    error.value = 'حداقل مبلغ برداشت 1,000 تومان است'
    return
  }

  if (amount.value > walletStore.balance) {
    error.value = 'موجودی کافی نیست'
    return
  }

  // Trigger submission
  isProcessing.value = true

  // Emit submit event with amount
  emit('submit', amount.value)
}

const emit = defineEmits(['submit', 'cancel'])
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Modal Header Styles */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.modal-body {
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 8px;
  color: #666;
}

.input-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.error-message {
  color: red;
  font-size: 0.8em;
  margin-top: 8px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}
.btn {
  flex-grow: 1;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.btn-primary {
  background-color: #ff5a5f;
  color: white;
  border: none;
}
</style>
