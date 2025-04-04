<!-- Login component -->
<template>
  <div class="login-form">
    <h4 class="text-h5 text-center text-weight-bold q-pa-sm text-secondary">ورود به حساب کاربری</h4>

    <!-- Global Error Message -->
    <div v-if="authStore.loginError" class="text-negative text-center q-mb-md">
      {{ authStore.loginError }}
    </div>

    <form @submit.prevent="handleLogin" class="q-gutter-md">
      <!-- Username Input -->
      <q-input
        v-model="loginData.username"
        type="tel"
        outlined
        class="custom-input"
        label="شماره تلفن"
        lazy-rules
        @blur="validateUsername"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-phone-flip" class="q-ml-sm text-primary" />
        </template>
      </q-input>

      <!-- Password Input -->
      <q-input
        v-model="loginData.password"
        :type="isPwd ? 'password' : 'text'"
        outlined
        class="custom-input"
        label="رمز عبور"
        lazy-rules
        @blur="validatePassword"
      >
        <template v-slot:prepend>
          <q-icon name="lock" color="primary" class="q-ml-sm" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            color="grey-7"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <div class="row items-center justify-between q-mt-sm">
        <q-btn
          flat
          color="primary"
          label="رمز عبور خود را فراموش کرده اید؟"
          class="text-weight-medium"
          @click="forgotPassword"
        />
        <q-checkbox
          v-model="loginData.rememberMe"
          label="مرا به خاطر بسپار"
          dir="ltr"
          color="primary"
        />
      </div>

      <q-btn
        label="ورود"
        type="submit"
        color="primary"
        class="full-width q-py-sm q-mt-lg login-btn"
        unelevated
        :loading="loading"
        :disable="!isFormValid"
      >
        <template v-slot:loading>
          <q-spinner-dots />
        </template>
      </q-btn>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const loginData = ref({
  username: '',
  password: '',
  rememberMe: false,
})

const isPwd = ref(true)
const loading = ref(false)

// Form validity state
const formErrors = ref({
  username: false,
  password: false
})

// Clear any previous login errors when component is mounted
onMounted(() => {
  authStore.loginError = null
})

const validateUsername = () => {
  const phoneRegex = /^09\d{9}$/
  
  if (!loginData.value.username) {
    formErrors.value.username = true
    return false
  } 
  
  if (!phoneRegex.test(loginData.value.username)) {
    formErrors.value.username = true
    $q.notify({
      type: 'warning',
      message: 'لطفا شماره تلفن را به صورت صحیح وارد کنید ',
      position: 'top',
      timeout: 3000
    })
    return false
  }
  
  formErrors.value.username = false
  return true
}

const validatePassword = () => {
  if (!loginData.value.password) {
    formErrors.value.password = true
    return false
  }
  
  formErrors.value.password = false
  return true
}

const isFormValid = computed(() => {
  return (
    loginData.value.username &&
    loginData.value.password &&
    !formErrors.value.username &&
    !formErrors.value.password
  )
})

const handleLogin = async () => {
  const isUsernameValid = validateUsername()
  const isPasswordValid = validatePassword()

  if (!isUsernameValid || !isPasswordValid) {
    if (!isPasswordValid) {
      $q.notify({
        type: 'warning',
        message: 'لطفا رمز عبور را وارد کنید',
        position: 'top',
        timeout: 3000
      })
    }
    return
  }
  if (loginData.value.username.length > 10) {
    loginData.value.username = loginData.value.username.slice(-10)
  }
  loading.value = true
  try {
    const formData = {
      username: loginData.value.username,
      password: loginData.value.password,
    }
    
    await authStore.login(formData)
    router.push('/OTP')
    $q.notify({
      type: 'positive',
      message: 'ورود با موفقیت انجام شد',
      position: 'top',
      timeout: 2000
    })
    
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: authStore.loginError || 'خطا در ورود. لطفا مجددا تلاش کنید.',
      position: 'top',
      timeout: 3000
    })
  } finally {
    loading.value = false
  }
}

const forgotPassword = () => {
  router.push('/forgot-password')
}

// Optional: Clear any errors when component is unmounted
onUnmounted(() => {
  authStore.loginError = null
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
}

.custom-input .q-field__control {
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: transparent;
  direction: rtl;
  text-align: right;
  transition: all 0.3s ease;
}

.custom-input .q-field__control:focus-within {
  border-color: #ff5a5f;
  box-shadow: 0 0 0 2px rgba(255, 90, 95, 0.2);
}

.custom-input input {
  direction: rtl;
  text-align: right;
}

.login-btn {
  border-radius: 8px;
  height: 48px;
  font-weight: 600;
  font-size: 1.1em;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #ff5a5f;
}
</style>