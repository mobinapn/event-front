<template>
  <div class="transaction-status">
    <div class="status-container">
      <div
        class="status-icon"
        :class="{
          success: transaction.success,
          error: !transaction.success,
        }"
      >
        <i
          :class="
            transaction.success
              ? 'fa-solid fa-circle-check'
              : 'fa-solid fa-triangle-exclamation'
          "
        >
        </i>
      </div>
      <div class="status-details">
        <h5>
          {{
            transaction.success
              ? transaction.type === 'deposit'
                ? 'واریز موفق'
                : 'برداشت موفق'
              : transaction.type === 'deposit'
                ? 'خطا در واریز'
                : 'خطا در برداشت'
          }}
        </h5>

        <div class="transaction-info">
          <span class="transaction-type">
            {{ transaction.type === 'deposit' ? 'واریز' : 'برداشت' }}
          </span>
          <span class="transaction-amount"> {{ formatCurrency(transaction.amount) }} تومان </span>
        </div>
      </div>

      <div class="status-actions">
        <button @click="$emit('continue')" class="btn btn-primary">بازگشت به کیف پول</button>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  transaction: {
    type: Object,
    required: true,
    validator: (value) => {
      return ['type', 'amount', 'success'].every((key) => key in value)
    },
  },
})

// Currency formatting function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount || 0)
}

// Define emits
defineEmits(['continue'])
</script>

<style scoped>
.transaction-status {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 16px;
}

.status-container {
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.status-icon {
  display: flex;
  justify-content: center;
}

.status-icon i {
  font-size: 50px;
}

.status-icon.success i {
  color: #2a7f2a;
}

.status-icon.error i {
  color: #c10015;
}

.status-details h5 {
  margin-bottom: 8px;
  color: #292929;
}

.transaction-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.transaction-type {
  font-weight: bold;
}

.transaction-amount {
  color: #292929;
}

.status-actions {
  display: flex;
  justify-content: center;
}

.btn-primary {
  background-color: #ff5a5f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
