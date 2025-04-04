<template>
  <div class="deposit-form">
    <div class="modal-header">
      <h3>افزایش موجودی</h3>
      <button @click="$emit('cancel')" class="modal-close">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
    </div>
    <div class="modal-body">
      <div class="input-group">
        <label>مبلغ (تومان)</label>
        <q-input
          type="text"
          v-model="inputValue"
          placeholder="مبلغ مورد نظر را وارد کنید"
          outlined
          dense
          class="persian-input"
          dir="rtl"
        />
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <q-btn @click="validateAndSubmit" class="btn btn-primary" :disabled="isProcessing">
        {{ isProcessing ? 'در حال پردازش...' : 'پرداخت' }}
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// For storing the raw input value that user types
const inputValue = ref('')
// For storing the numeric value without formatting
const amount = ref('')
const error = ref('')
const isProcessing = ref(false)

// Convert Persian/Arabic numerals to English
const convertToEnglishDigits = (str) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  let result = str.toString();
  
  for (let i = 0; i < 10; i++) {
    const persianRegex = new RegExp(persianDigits[i], 'g');
    const arabicRegex = new RegExp(arabicDigits[i], 'g');
    result = result.replace(persianRegex, i).replace(arabicRegex, i);
  }
  
  return result;
}

// Format number with Persian locale
const formatToPersianNumber = (num) => {
  if (!num) return '';
  return num.toLocaleString('fa-IR');
}

// Watch for changes in the input field
watch(inputValue, (newValue) => {
  if (!newValue) {
    amount.value = '';
    return;
  }
  
  // Remove commas and convert Persian/Arabic numerals to English
  const cleanValue = convertToEnglishDigits(newValue).replace(/[^\d]/g, '');
  
  if (cleanValue !== '') {
    // Update the amount (numeric value)
    amount.value = cleanValue;
    
    // Update the displayed value with proper formatting
    // Use setTimeout to avoid input cursor jumping issues
    setTimeout(() => {
      const formatted = formatToPersianNumber(parseInt(cleanValue, 10));
      if (formatted !== newValue) {
        inputValue.value = formatted;
      }
    }, 10);
  } else {
    amount.value = '';
  }
});

// Validate & Submit Function
const validateAndSubmit = () => {
  error.value = '';

  if (!amount.value || parseInt(amount.value, 10) <= 0) {
    error.value = 'لطفا مبلغ معتبر وارد کنید';
    return;
  }

  if (parseInt(amount.value, 10) < 1000) {
    error.value = 'حداقل مبلغ واریز ۱,۰۰۰ تومان است';
    return;
  }

  isProcessing.value = true;
  setTimeout(() => {
    emit('submit', parseInt(amount.value, 10)); // Send as a number
    isProcessing.value = false;
  }, 1500);
}

// Emit Events
const emit = defineEmits(['submit', 'cancel']);
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

.persian-input input {
  text-align: right;
  direction: rtl;
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