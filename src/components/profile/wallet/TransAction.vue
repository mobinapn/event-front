<template>
  <div class="transactions-header">
    <span>تاریخچه تراکنش‌ها و درخواست‌ها</span>
    <div class="transaction-actions">
      <button @click="exportTransactions" class="btn-icon text-primary">
        <i class="material-icons">download</i>
      </button>
    </div>
  </div>
  <!-- Empty State -->
  <div v-if="transactions.length === 0" class="empty-transactions">
    <div class="empty-icon">
      <i class="material-icons">account_balance_wallet</i>
    </div>
    <p>هیچ تراکنشی یافت نشد</p>
  </div>

  <!-- Transactions List -->
  <div v-else class="transactions-list">
    <div v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
      <div class="transaction-icon">
        <i
          class="material-icons"
          :class="transaction.type === 'deposit' ? 'text-green' : 'text-red'"
        >
          {{ transaction.type === 'deposit' ? 'add_circle' : 'remove_circle' }}
        </i>
      </div>
      <div class="transaction-details">
        <div class="transaction-amount">{{ transaction.amount.toLocaleString('fa-IR') }} تومان</div>
        <div class="transaction-date">
          {{ formatDate(transaction.date) }}
        </div>
      </div>
      <div class="transaction-type">
        <span :class="transaction.type === 'deposit' ? 'badge-green' : 'badge-red'">
          {{ transaction.type === 'deposit' ? 'واریز' : 'برداشت' }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
})
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
</script>

<style scoped>
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
