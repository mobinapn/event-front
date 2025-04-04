<template>
  <div class="wallet-container">
    <!-- Status Modal -->
    <div v-if="statusMessage" class="status-modal" :class="statusType">
      <div class="status-content">
        <div class="status-icon">
          <i class="material-icons">
            {{ statusType === 'success' ? 'check_circle' : 'error_outline' }}
          </i>
        </div>
        <div class="status-text">
          {{ statusMessage }}
        </div>
        <button @click="clearStatus" class="status-close">
          <i class="material-icons">close</i>
        </button>
      </div>
    </div>
    <!-- Header Section -->
    <div class="wallet-header">
      <div class="balance-section">
        <div class="balance-label">موجودی حساب</div>
        <div class="balance-amount">
          {{ formatCurrency(currentBalance) }}
          <span class="currency">تومان</span>
        </div>
      </div>
      <div class="action-buttons">
        <button @click="openAddFundsModal" class="btn btn-primary">افزایش موجودی</button>
        <button @click="openWithdrawModal" class="btn btn-outline" :disabled="currentBalance <= 0">
          برداشت موجودی
        </button>
      </div>
    </div>
    <!-- Transactions Section -->
    <div class="transactions-section">
      <TransAction :transactions="transactions" />
    </div>
    <!-- Add Funds Modal -->
    <div v-if="addFundsModalOpen" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>افزایش موجودی</h3>
          <button @click="closeAddFundsModal" class="modal-close">
            <i class="material-icons">close</i>
          </button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <label>مبلغ (تومان)</label>
            <input type="number" v-model="paymentAmount" placeholder="مبلغ مورد نظر را وارد کنید" />
            <div v-if="paymentError" class="error-message">
              {{ paymentError }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="processPayment" class="btn btn-primary" :disabled="processingPayment">
            {{ processingPayment ? 'در حال پردازش...' : 'پرداخت' }}
          </button>
        </div>
      </div>
    </div>
    <!-- Withdraw Modal
    <div v-if="withdrawModalOpen" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>برداشت موجودی</h3>
          <button @click="closeWithdrawModal" class="modal-close">
            <i class="material-icons">close</i>
          </button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <label>مبلغ (تومان)</label>
            <input 
              type="number" 
              v-model="withdrawAmount" 
              placeholder="مبلغ مورد نظر را وارد کنید"
            />
            <div v-if="withdrawError" class="error-message">
              {{ withdrawError }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            @click="processWithdraw" 
            class="btn btn-primary"
            :disabled="processingWithdraw"
          >
            {{ processingWithdraw ? 'در حال پردازش...' : 'تأیید برداشت' }}
          </button>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import TransAction from './wallet/TransAction.vue'
import { api } from 'src/boot/axios'

// Reactive state
const currentBalance = ref(0)
const transactions = ref([])
const addFundsModalOpen = ref(false)
// const withdrawModalOpen = ref(false)
const paymentAmount = ref(null)
// const withdrawAmount = ref(null)
const paymentError = ref('')
// const withdrawError = ref('')
const processingPayment = ref(false)
// const processingWithdraw = ref(false)
// Status Management
const statusMessage = ref('')
const statusType = ref('info')

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount || 0)
}
// Status Methods
const showSuccessStatus = (message) => {
  statusMessage.value = message
  statusType.value = 'success'

  setTimeout(() => {
    clearStatus()
  }, 3000)
}

const showErrorStatus = (message) => {
  statusMessage.value = message
  statusType.value = 'error'

  setTimeout(() => {
    clearStatus()
  }, 3000)
}

const clearStatus = () => {
  statusMessage.value = ''
}

// Fetch wallet data
const fetchWalletData = async () => {
  try {
    const response = await api.get('/profile/wallet')
    currentBalance.value = response.balance
    transactions.value = response.transactions
  } catch (error) {
    console.log(error)
    showErrorStatus('خطا در دریافت اطلاعات کیف پول')
  }
}

// Payment Methods
const processPayment = async () => {
  paymentError.value = ''

  if (!paymentAmount.value || paymentAmount.value <= 0) {
    paymentError.value = 'لطفا مبلغ معتبر وارد کنید'
    return
  }

  processingPayment.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    currentBalance.value += Number(paymentAmount.value)

    addFundsModalOpen.value = false

    showSuccessStatus('پرداخت با موفقیت انجام شد')

    await fetchWalletData()
  } catch (error) {
    console.log(error)
    showErrorStatus('خطا در انجام پرداخت')
  } finally {
    processingPayment.value = false
  }
}

// Withdrawal Methods
// const processWithdraw = async () => {
//   withdrawError.value = ''

//   if (!withdrawAmount.value || withdrawAmount.value <= 0) {
//     withdrawError.value = 'لطفا مبلغ معتبر وارد کنید'
//     return
//   }

//   if (withdrawAmount.value > currentBalance.value) {
//     withdrawError.value = 'موجودی کافی نیست'
//     return
//   }

//   processingWithdraw.value = true
//   try {
//     await new Promise(resolve => setTimeout(resolve, 1500))

//     currentBalance.value -= Number(withdrawAmount.value)

//     withdrawModalOpen.value = false

//     showSuccessStatus('برداشت با موفقیت انجام شد')

//     await fetchWalletData()
//   } catch (error) {
//     console.log(error)
//     showErrorStatus('خطا در برداشت')
//   } finally {
//     processingWithdraw.value = false
//   }
// }

// Dialog Control Methods
const openAddFundsModal = () => {
  paymentAmount.value = null
  paymentError.value = ''
  addFundsModalOpen.value = true
}
const closeAddFundsModal = () => {
  addFundsModalOpen.value = false
}
// const openWithdrawModal = () => {
//   withdrawAmount.value = null
//   withdrawError.value = ''
//   withdrawModalOpen.value = true
// }

// const closeWithdrawModal = () => {
//   withdrawModalOpen.value = false
// }
// Lifecycle Hook
onMounted(fetchWalletData)
</script>
<style scoped>
/* Material Icons placeholder */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.wallet-container {
  background-color: #f5f5f5;
  padding: 16px;
  font-family: 'Iranian Sans', Arial, sans-serif;
}

.wallet-header {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.balance-section {
  margin-bottom: 16px;
}

.balance-label {
  color: #666;
  margin-bottom: 8px;
}

.balance-amount {
  font-size: 24px;
  font-weight: bold;
  text-align: right;
}

.currency {
  font-size: 16px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 8px;
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

.btn-outline {
  background-color: white;
  color: #ff5a5f;
  border: 1px solid #ff5a5f;
}

.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.transactions-section {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Modal Styles */
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

/* Status Modal */
.status-modal {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.status-modal.success {
  background-color: #e6f3e6;
  color: #2a7f2a;
  border: 1px solid #2a7f2a;
}

.status-modal.error {
  background-color: #f3e6e6;
  color: #7f2a2a;
  border: 1px solid #7f2a2a;
}

.status-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.status-icon {
  margin-left: 12px;
}

.status-icon .material-icons {
  font-size: 24px;
}

.status-text {
  flex-grow: 1;
}

.status-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
}
/* Responsive Adjustments */
@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
  }
  .btn {
    width: 100%;
  }
  .wallet-header,
  .transactions-section {
    padding: 12px;
  }

  .balance-amount {
    font-size: 20px;
  }
}
</style>
