import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useWalletStore = defineStore('wallet', () => {
  // Reactive State
  const balance = ref(0)
  const transactions = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Fetch Wallet Data
  async function fetchWalletData() {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/profile/wallet')
      console.log(response)
      balance.value = response.data.balance
      transactions.value = response.data?.transactions || []
    } catch (err) {
      error.value = err.response?.data?.message || 'خطا در دریافت اطلاعات کیف پول'
    } finally {
      isLoading.value = false
    }
  }
  // Deposit Funds
  async function depositFunds(amount) {
    isLoading.value = true
    error.value = null

    try {
     await api.post(`/profile/wallet/deposit?amount=${amount}`);

      
      // Optimistically update balance and transactions
      balance.value += amount
      transactions.value.unshift({
        id: Date.now(), // Temporary ID
        amount,
        type: 'deposit',
        date: new Date().toISOString(),
        status: 'completed'
      })

      return { success: true, message: 'پرداخت با موفقیت انجام شد' }
    } catch (err) {
      error.value = err.response?.data?.message || 'خطا در انجام پرداخت'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Withdraw Funds
  async function withdrawFunds(amount) {
    isLoading.value = true
    error.value = null

    try {
      if (amount > balance.value) {
        throw new Error('موجودی کافی نیست')
      }

      await api.post(`/profile/wallet/withdraw?amount=${amount}`);

      
      // Optimistically update balance and transactions
      balance.value -= amount
      transactions.value.unshift({
        id: Date.now(), // Temporary ID
        amount,
        type: 'withdraw',
        date: new Date().toISOString(),
        status: 'completed'
      })

      return { success: true, message: 'برداشت با موفقیت انجام شد' }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'خطا در برداشت'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Reset Error
  function resetError() {
    error.value = null
  }

  // Expose state and methods
  return {
    balance,
    transactions,
    isLoading,
    error,
    fetchWalletData,
    depositFunds,
    withdrawFunds,
    resetError
  }
})