<template>
  <div class="q-pa-lg">
    <!-- Status Component -->
    <StatusNotification
      v-if="statusMessage"
      :message="statusMessage"
      :type="statusType"
      @close="clearStatus"
    />
    <!-- Wallet View Modes -->
    <template v-if="currentView === 'overview'">
      <WalletOverview @deposit="switchToDepositView" @withdraw="switchToWithdrawView" />
    </template>

    <template v-else-if="currentView === 'deposit'">
      <DepositForm @submit="processDeposit" @cancel="switchToOverviewView" />
    </template>

    <template v-else-if="currentView === 'withdraw'">
      <WithdrawForm @submit="processWithdraw" @cancel="switchToOverviewView" />
    </template>

    <template v-else-if="currentView === 'status'">
      <TransactionStatus :transaction="currentTransaction" @continue="switchToOverviewView" />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWalletStore } from 'src/stores/wallet'
import WalletOverview from './wallet/WalletOverview.vue'
import DepositForm from './wallet/DepositForm.vue'
import WithdrawForm from './wallet/WidrawForm.vue'
import TransactionStatus from './wallet/TransactionStatus.vue'
import StatusNotification from './wallet/StatusNotification.vue'

const walletStore = useWalletStore()

// View Management
const currentView = ref('overview')
const currentTransaction = ref(null)
const statusMessage = ref('')
const statusType = ref('info')

// View Switching Methods
const switchToOverviewView = () => {
  currentView.value = 'overview'
  currentTransaction.value = null
}

const switchToDepositView = () => {
  currentView.value = 'deposit'
}

const switchToWithdrawView = () => {
  currentView.value = 'withdraw'
}

// Transaction Processing
const processDeposit = async (amount) => {
  const result = await walletStore.depositFunds(amount)

  currentTransaction.value = {
    type: 'deposit',
    amount,
    success: result.success,
  }

  currentView.value = 'status'

  if (result.success) {
    showSuccessStatus(result.message)
  } else {
    showErrorStatus(result.message)
  }
}

const processWithdraw = async (amount) => {
  const result = await walletStore.withdrawFunds(amount)

  currentTransaction.value = {
    type: 'withdraw',
    amount,
    success: result.success,
  }

  currentView.value = 'status'

  if (result.success) {
    showSuccessStatus(result.message)
  } else {
    showErrorStatus(result.message)
  }
}

// Status Management
const showSuccessStatus = (message) => {
  statusMessage.value = message
  statusType.value = 'success'

  setTimeout(clearStatus, 3000)
}

const showErrorStatus = (message) => {
  statusMessage.value = message
  statusType.value = 'error'

  setTimeout(clearStatus, 3000)
}

const clearStatus = () => {
  statusMessage.value = ''
}
</script>

<style scoped></style>
