<template>
  <div class="wallet-header">
    <div class="balance-section">
      <div class="balance-label">موجودی حساب</div>
      <div class="balance-amount">
        {{ formatCurrency(walletStore.balance) }}
        <span class="currency">تومان</span>
      </div>
    </div>
    <div class="action-buttons">
      <button @click="$emit('deposit')" class="btn btn-primary">افزایش موجودی</button>
      <button
        @click="$emit('withdraw')"
        class="btn btn-outline"
        :disabled="walletStore.balance <= 0"
      >
        برداشت موجودی
      </button>
    </div>
    <!-- Transactions Section -->
    <div class="transactions-section">
      <h6>تراکنش‌های اخیر</h6>
      <div v-if="walletStore.isLoading" class="loading">در حال بارگذاری...</div>
      <div v-else-if="walletStore.error" class="error">
        {{ walletStore.error }}
      </div>
      <div v-else-if="walletStore.transactions.length === 0" class="no-transactions">
        تراکنشی وجود ندارد
      </div>
      <ul v-else class="transaction-list">
        <li
          v-for="transaction in walletStore.transactions.slice(0, 5)"
          :key="transaction.id"
          class="transaction-item"
        >
          <div class="transaction-details">
            <span class="transaction-amount"> {{ formatCurrency(transaction.amount) }} تومان </span>
            <span
              class="transaction-type"
              :class="{
                deposit: transaction.type === 'deposit',
                withdraw: transaction.type === 'withdraw',
              }"
            >
              {{ transaction.type === 'deposit' ? 'واریز' : 'برداشت' }}
            </span>
          </div>
          <span class="transaction-date">
            {{ formatDate(transaction.date) }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useWalletStore } from 'src/stores/wallet'
import { onMounted } from 'vue'

const walletStore = useWalletStore()

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount || 0)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Fetch wallet data on component mount
onMounted(() => {
  walletStore.fetchWalletData()
})

defineEmits(['deposit', 'withdraw'])
</script>

<style scoped>
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

.transaction-list {
  list-style-type: none;
  padding: 0;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.transaction-details {
  display: flex;
  flex-direction: column;
}

.transaction-type {
  font-size: 0.8em;
  margin-top: 4px;
}

.transaction-type.deposit {
  color: green;
}

.transaction-type.withdraw {
  color: red;
}

.transaction-date {
  color: #666;
  font-size: 0.8em;
}

.loading,
.error,
.no-transactions {
  text-align: center;
  color: #666;
  padding: 20px;
}
.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.btn-icon {
  background: none;
  border: none;
  color: #ff5a5f;
  padding: 8px;
}

.empty-transactions {
  text-align: center;
  color: #999;
  padding: 32px;
}

.empty-icon .material-icons {
  font-size: 64px;
  color: #ddd;
}

.transactions-list {
  max-height: 300px;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.transaction-icon .material-icons {
  font-size: 24px;
}

.text-green {
  color: green;
}
.text-red {
  color: red;
}

.transaction-details {
  flex-grow: 1;
  margin: 0 12px;
}

.transaction-amount {
  font-weight: bold;
}

.transaction-date {
  color: #666;
  font-size: 0.8em;
}

.badge-green,
.badge-red {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  color: white;
}

.badge-green {
  background-color: green;
}
.badge-red {
  background-color: red;
}
</style>
