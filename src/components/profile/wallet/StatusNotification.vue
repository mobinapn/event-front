<template>
  <div class="status-modal" :class="type">
    <div class="status-content">
      <div class="status-icon">
        <i
          :class="
            type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation'
          "
        ></i>
      </div>
      <div class="status-text">
        {{ message }}
      </div>
      <button @click="$emit('close')" class="status-close">
        <i class="material-icons">close</i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    validator: (value) => ['success', 'error', 'info'].includes(value),
    default: 'info',
  },
})

defineEmits(['close'])
</script>

<style scoped>
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
  color: #c10015;
  border: 1px solid #c10015;
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
</style>
