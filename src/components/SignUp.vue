<template>
  <div class="signup-form">
    <h4 class="text-h5 text-weight-bold q-mb-lg text-center text-secondary">
      ایجاد حساب کاربری
    </h4>
    <!-- Global Error Message -->
    <div v-if="authStore.registerError" class="text-negative text-center q-mb-md">
      {{ authStore.registerError }}
    </div>
    <q-form @submit.prevent="handleSignup" class="q-gutter-md q-mt-md">
      <!-- Phone Input -->
      <q-input
        v-model="signupData.username"
        type="tel"
        label="شماره تلفن"
        outlined
        class="custom-input"
        lazy-rules
        @blur="validatePhone"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-phone-flip" class="q-ml-sm text-primary" />
        </template>
      </q-input>
      <!-- Password Input -->
      <q-input
        v-model="signupData.password"
        :type="isPwd ? 'password' : 'text'"
        label="رمز عبور"
        outlined
        class="custom-input"
        lazy-rules
        @blur="validatePassword"
      >
        <template v-slot:prepend>
          <q-icon name="lock" color="primary" class="q-ml-sm"></q-icon>
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

      <!-- Confirm Password Input -->
      <q-input
        v-model="signupData.confirmPassword"
        :type="isPwd2 ? 'password' : 'text'"
        label="تکرار رمز عبور"
        outlined
        class="custom-input"
        lazy-rules
        @blur="validateConfirmPassword"
      >
        <template v-slot:prepend>
          <q-icon name="lock" color="primary" class="q-ml-sm"></q-icon>
        </template>
        <template v-slot:append>
          <q-icon
            :name="isPwd2 ? 'visibility_off' : 'visibility'"
            color="grey-7"
            class="cursor-pointer"
            @click="isPwd2 = !isPwd2"
          />
        </template>
      </q-input>

      <q-checkbox
        v-model="signupData.acceptTerms"
        label="با قوانین و مقررات موافقم"
        color="primary"
      />

      <q-btn
        label="ثبت نام"
        type="submit"
        color="primary"
        class="full-width q-py-sm q-mt-lg signup-btn"
        unelevated
        :loading="loading"
        :disable="!isFormValid"
      >
        <template v-slot:loading>
          <q-spinner-dots />
        </template>
      </q-btn>
    </q-form>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from "src/stores/auth";
import { useQuasar } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const signupData = ref({
  username: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
});

const isPwd = ref(true);
const isPwd2 = ref(true);
const loading = ref(false);

// Form validity state
const formErrors = ref({
  phone: false,
  password: false,
  confirmPassword: false,
  terms: false
});

// Clear any previous errors
onMounted(() => {
  authStore.registerError = null;
});

// Validation methods with helpful notifications
const validatePhone = () => {
  const phoneRegex = /^09\d{9}$/;
  
  if (!signupData.value.username) {
    formErrors.value.phone = true;
    return false;
  } 
  
  if (!phoneRegex.test(signupData.value.username)) {
    formErrors.value.phone = true;
    $q.notify({
      type: 'warning',
      message: 'لطفا شماره تلفن را به صورت صحیح وارد کنید (مثال: 09124578961)',
      position: 'top',
      timeout: 3000
    });
    return false;
  }
  
  formErrors.value.phone = false;
  return true;
};

const validatePassword = () => {
  if (!signupData.value.password) {
    formErrors.value.password = true;
    return false;
  } 
  
  if (signupData.value.password.length < 8) {
    formErrors.value.password = true;
    $q.notify({
      type: 'warning',
      message: 'رمز عبور باید حداقل 8 کاراکتر باشد',
      position: 'top',
      timeout: 3000
    });
    return false;
  }
  
  formErrors.value.password = false;
  return true;
};

const validateConfirmPassword = () => {
  if (!signupData.value.confirmPassword) {
    formErrors.value.confirmPassword = true;
    return false;
  } 
  
  if (signupData.value.confirmPassword !== signupData.value.password) {
    formErrors.value.confirmPassword = true;
    $q.notify({
      type: 'warning',
      message: 'رمزهای عبور مطابقت ندارند',
      position: 'top',
      timeout: 3000
    });
    return false;
  }
  
  formErrors.value.confirmPassword = false;
  return true;
};

const validateTerms = () => {
  if (!signupData.value.acceptTerms) {
    formErrors.value.terms = true;
    $q.notify({
      type: 'warning',
      message: 'لطفا قوانین و مقررات را بپذیرید',
      position: 'top',
      timeout: 3000
    });
    return false;
  }
  
  formErrors.value.terms = false;
  return true;
};

// Form validation
const isFormValid = computed(() => {
  return signupData.value.username &&
         signupData.value.password &&
         signupData.value.confirmPassword &&
         signupData.value.acceptTerms &&
         !formErrors.value.phone &&
         !formErrors.value.password &&
         !formErrors.value.confirmPassword;
});

const handleSignup = async () => {
  // Validate all fields with user-friendly notifications
  const isPhoneValid = validatePhone();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  const isTermsAccepted = validateTerms();

  if (!isPhoneValid || !isPasswordValid || !isConfirmPasswordValid || !isTermsAccepted) {
    return;
  }
  if (signupData.value.username.length > 10) {
    signupData.value.username = signupData.value.username.slice(-10)
  }
  loading.value = true;
  
  try {
    // Create form data using the full phone number
    const formData = {
      username: signupData.value.username,
      password: signupData.value.password,
    };
    
    await authStore.register(formData);
    console.log('sent username' , formData.username)
    
    $q.notify({
      type: 'positive',
      message: 'ثبت نام با موفقیت انجام شد. در حال انتقال به صفحه تایید...',
      position: 'top',
      timeout: 2000
    });
    
    setTimeout(() => {
      router.push("/OTP");
    }, 2000);
    
  } catch (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: 'خطا در ثبت نام. لطفا مجددا تلاش کنید.',
      position: 'top',
      timeout: 3000
    });
  } finally {
    loading.value = false;
  }
};

onUnmounted(() => {
  authStore.registerError = null;
});
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
}

.signup-card {
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
  border-color: #FF5A5F;
  box-shadow: 0 0 0 2px rgba(255, 90, 95, 0.2);
}

.custom-input input {
  direction: rtl;
  text-align: right;
}

.signup-btn {
  border-radius: 8px;
  height: 48px;
  font-weight: 600;
  font-size: 1.1em;
  transition: background-color 0.3s ease;
}

.signup-btn:hover {
  background-color: #FF5A5F;
}
</style>