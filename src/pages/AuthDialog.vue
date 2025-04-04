<template>
    <q-dialog v-model="dialogModel" persistent maximized>
      <q-card class="auth-dialog-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="col-12 flex justify-end">
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>
  
        <q-card-section class="auth-dialog-content">
          <div class="auth-container">
            <div class="auth-right">
              <q-tabs
                v-model="activeTab"
                class="text-primary custom-tabs"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="login" label="ورود" class="text-weight-bold" />
                <q-tab name="signup" label="ثبت نام" class="text-weight-bold" />
              </q-tabs>
  
              <q-tab-panels v-model="activeTab" animated>
                <q-tab-panel name="login">
                  <div class="login-form">
                    <h4 class="text-h5 text-center text-weight-bold q-pa-sm text-secondary">
                      ورود به حساب کاربری
                    </h4>
  
                    <!-- Global Error Message -->
                    <div
                      v-if="authStore.loginError"
                      class="text-negative text-center q-mb-md"
                    >
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
                        :loading="loginLoading"
                        :disable="!isLoginFormValid"
                      >
                        <template v-slot:loading>
                          <q-spinner-dots />
                        </template>
                      </q-btn>
                    </form>
                  </div>
                </q-tab-panel>
  
                <q-tab-panel name="signup">
                  <div class="signup-form">
                    <h4 class="text-h5 text-weight-bold q-mb-lg text-center text-secondary">
                      ایجاد حساب کاربری
                    </h4>
                    <!-- Global Error Message -->
                    <div
                      v-if="authStore.registerError"
                      class="text-negative text-center q-mb-md"
                    >
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
                        :type="isPwdSignup ? 'password' : 'text'"
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
                            :name="isPwdSignup ? 'visibility_off' : 'visibility'"
                            color="grey-7"
                            class="cursor-pointer"
                            @click="isPwdSignup = !isPwdSignup"
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
                        :loading="signupLoading"
                        :disable="!isSignupFormValid"
                      >
                        <template v-slot:loading>
                          <q-spinner-dots />
                        </template>
                      </q-btn>
                    </q-form>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
  
            <div class="auth-left">
              <div class="brand-col">
                <div class="brand-logo">
                  <img
                    src="/images/airbnb-logo.png"
                    alt="Travel Logo"
                    width="170px"
                    height="auto"
                  />
                </div>
                <q-img>
                  <video autoplay muted playsinline>
                    <source src="/gif/Animation - 1739970849189.webm" type="video/webm" />
                  </video>
                </q-img>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  
    <!-- OTP Dialog -->
    <q-dialog v-model="showOtpDialog" persistent>
      <q-card class="otp-dialog">
        <q-card-section class="column items-center">
          <h6 class="text-center q-pa-sm text-secondary">
            لطفا کد ۴ رقمی ارسال شده به شماره
            <span class="text-bold">{{ phoneNumber }}</span> را وارد کنید
          </h6>
  
          <!-- OTP Inputs -->
          <div class="q-gutter-xs row items-center q-mt-md">
            <div class="col" v-for="(digit, index) in otp" :key="index">
              <input
                ref="otpInputs"
                v-model="otp[index]"
                @input="handleOtpInput(index, $event)"
                @keydown.backspace="handleBackspace(index, $event)"
                type="text"
                class="otp-input"
                maxlength="1"
              />
            </div>
          </div>
  
          <!-- Timer & Resend OTP -->
          <div class="flex flex-center q-mt-lg">
            <p class="text-secondary">{{ formattedTimeLeft }}</p>
          </div>
          <div class="flex flex-center q-pa-md">
            <q-btn
              v-if="timeLeft <= 0"
              flat
              class="resend-link"
              color="primary"
              label="ارسال مجدد کد"
              @click="resendOTP"
            />
          </div>
  
          <!-- Submit Button -->
          <q-btn
            label="تایید"
            type="submit"
            color="primary"
            class="full-width q-py-sm q-mt-lg login-btn"
            unelevated
            :loading="otpLoading"
            @click="submitOtp"
          >
            <template v-slot:loading>
              <q-spinner-dots />
            </template>
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch  } from 'vue';
  import { useAuthStore } from 'src/stores/auth';
  import {  useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    },
    redirectPath: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:isOpen', 'auth-success']);
  const dialogModel = computed({
  get: () => props.isOpen,
  set: (val) => {
    emit('update:isOpen', val);
  }
});
  
  const authStore = useAuthStore();
  const $q = useQuasar();
  const router = useRouter();
  
  // Tab state
  const activeTab = ref('login');
  
  // Login form state
  const loginData = ref({
    username: '',
    password: '',
    rememberMe: false
  });
  
  const isPwd = ref(true);
  const loginLoading = ref(false);
  const loginFormErrors = ref({
    username: false,
    password: false
  });
  
  // Signup form state
  const signupData = ref({
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const isPwdSignup = ref(true);
  const isPwd2 = ref(true);
  const signupLoading = ref(false);
  const signupFormErrors = ref({
    phone: false,
    password: false,
    confirmPassword: false,
    terms: false
  });
  
  // OTP state
  const showOtpDialog = ref(false);
  const otp = ref(['', '', '', '']);
  const otpInputs = ref([]);
  const phoneNumber = ref('');
  const timeLeft = ref(120); // 2 minutes
  const otpLoading = ref(false);
  let timerId = null;
  const defaultOtp = ref('1234');
  
  // Phone validation
  const validateUsername = () => {
    const phoneRegex = /^09\d{9}$/;
    
    if (!loginData.value.username) {
      loginFormErrors.value.username = true;
      return false;
    } 
    
    if (!phoneRegex.test(loginData.value.username)) {
      loginFormErrors.value.username = true;
      $q.notify({
        type: 'warning',
        message: 'لطفا شماره تلفن را به صورت صحیح وارد کنید',
        position: 'top',
        timeout: 3000
      });
      return false;
    }
    
    loginFormErrors.value.username = false;
    return true;
  };
  
  // Password validation
  const validatePassword = () => {
    if (!loginData.value.password) {
      loginFormErrors.value.password = true;
      return false;
    }
    
    loginFormErrors.value.password = false;
    return true;
  };
  
  // Login form validation
  const isLoginFormValid = computed(() => {
    return (
      loginData.value.username &&
      loginData.value.password &&
      !loginFormErrors.value.username &&
      !loginFormErrors.value.password
    );
  });
  
  // Signup validation methods
  const validatePhone = () => {
    const phoneRegex = /^09\d{9}$/;
    
    if (!signupData.value.username) {
      signupFormErrors.value.phone = true;
      return false;
    } 
    
    if (!phoneRegex.test(signupData.value.username)) {
      signupFormErrors.value.phone = true;
      $q.notify({
        type: 'warning',
        message: 'لطفا شماره تلفن را به صورت صحیح وارد کنید (مثال: 09124578961)',
        position: 'top',
        timeout: 3000
      });
      return false;
    }
    
    signupFormErrors.value.phone = false;
    return true;
  };
  
  const validateConfirmPassword = () => {
    if (!signupData.value.confirmPassword) {
      signupFormErrors.value.confirmPassword = true;
      return false;
    } 
    
    if (signupData.value.confirmPassword !== signupData.value.password) {
      signupFormErrors.value.confirmPassword = true;
      $q.notify({
        type: 'warning',
        message: 'رمزهای عبور مطابقت ندارند',
        position: 'top',
        timeout: 3000
      });
      return false;
    }
    
    signupFormErrors.value.confirmPassword = false;
    return true;
  };
  
  const validateTerms = () => {
  if (!signupData.value.acceptTerms) {
    signupFormErrors.value.terms = true;
    $q.notify({
      type: 'warning',
      message: 'لطفا قوانین و مقررات را بپذیرید',
      position: 'top',
      timeout: 3000
    });
    return false;
  }
  
  signupFormErrors.value.terms = false;
  return true;
};

// Signup form validation
const isSignupFormValid = computed(() => {
  return signupData.value.username &&
         signupData.value.password &&
         signupData.value.confirmPassword &&
         signupData.value.acceptTerms &&
         !signupFormErrors.value.phone &&
         !signupFormErrors.value.password &&
         !signupFormErrors.value.confirmPassword;
});

// Timer for OTP expiration
const formattedTimeLeft = computed(() => {
  if (timeLeft.value <= 0) return 'کد منقضی شده است';
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `(${minutes}:${seconds.toString().padStart(2, '0')})`;
});


// Login handler
const handleLogin = async () => {
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();

  if (!isUsernameValid || !isPasswordValid) {
    if (!isPasswordValid) {
      $q.notify({
        type: 'warning',
        message: 'لطفا رمز عبور را وارد کنید',
        position: 'top',
        timeout: 3000
      });
    }
    return;
  }
  
  let formattedUsername = loginData.value.username;
  if (formattedUsername.length > 10) {
    formattedUsername = formattedUsername.slice(-10);
  }
  
  loginLoading.value = true;
  try {
    const formData = {
      username: formattedUsername,
      password: loginData.value.password,
    };
    
    await authStore.login(formData);
    
    $q.notify({
      type: 'positive',
      message: 'ورود با موفقیت انجام شد',
      position: 'top',
      timeout: 2000
    });
    
    // Show OTP dialog or redirect depending on your flow
    phoneNumber.value = formattedUsername;
    showOtpDialog.value = true;
    dialogModel.value = false;
    
  } catch (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: authStore.loginError || 'خطا در ورود. لطفا مجددا تلاش کنید.',
      position: 'top',
      timeout: 3000
    });
  } finally {
    loginLoading.value = false;
  }
};

// Signup handler
const handleSignup = async () => {
  // Validate all fields with user-friendly notifications
  const isPhoneValid = validatePhone();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  const isTermsAccepted = validateTerms();

  if (!isPhoneValid || !isPasswordValid || !isConfirmPasswordValid || !isTermsAccepted) {
    return;
  }
  
  let formattedUsername = signupData.value.username;
  if (formattedUsername.length > 10) {
    formattedUsername = formattedUsername.slice(-10);
  }
  
  signupLoading.value = true;
  
  try {
    const formData = {
      username: formattedUsername,
      password: signupData.value.password,
    };
    
    await authStore.register(formData);
    
    $q.notify({
      type: 'positive',
      message: 'ثبت نام با موفقیت انجام شد. لطفا کد تایید را وارد کنید.',
      position: 'top',
      timeout: 2000
    });
    
    // Show OTP dialog
    phoneNumber.value = formattedUsername;
    showOtpDialog.value = true;
    dialogModel.value = false
    
  } catch (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: authStore.registerError || 'خطا در ثبت نام. لطفا مجددا تلاش کنید.',
      position: 'top',
      timeout: 3000
    });
  } finally {
    signupLoading.value = false;
  }
};

// OTP functions
const startTimer = () => {
  clearInterval(timerId); // Clear any existing timer
  timeLeft.value = 120; // Reset time to 2 minutes

  timerId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerId);
    }
  }, 1000);
};
watch(showOtpDialog, (newValue) => {
  if (newValue) {
    otp.value = ['', '', '', '']; // Reset OTP input fields
    startTimer(); // Start timer when OTP dialog opens
  } else {
    clearInterval(timerId); // Stop timer when OTP dialog closes
  }
});


const handleOtpInput = (index, event) => {
  otp.value[index] = event.target.value.replace(/[^0-9]/g, '').slice(0, 1);
  if (otp.value[index] && index < otp.value.length - 1) {
    otpInputs.value[index + 1]?.focus();
  }
};

const handleBackspace = (index, event) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus();
  }
};

const resendOTP = () => {
  $q.notify({
    type: 'info',
    message: 'کد جدید ارسال شد!',
    position: 'top'
  });
  
  otp.value = ['', '', '', '']; // Clear inputs
  timeLeft.value = 120; // Reset timer
  clearInterval(timerId);
  startTimer();
};

const submitOtp = () => {
  const enteredOtp = otp.value.join(''); // Convert array to string
  otpLoading.value = true;

  if (enteredOtp.length !== 4) {
    $q.notify({
      type: 'warning',
      message: 'لطفا کد ۴ رقمی را وارد کنید',
      position: 'top'
    });
    otpLoading.value = false;
    return;
  }

  if (timeLeft.value > 0) {
    if (enteredOtp === defaultOtp.value) {
      // OTP is correct
      setTimeout(() => {
        $q.notify({
          color: 'positive',
          message: "شما با موفقیت وارد حساب کاربری خود شدید",
          position: 'top'
        });

        // Close the OTP dialog
        showOtpDialog.value = false;
        
        // Notify parent component that authentication was successful
        emit('auth-success');

        // Redirect if needed
        if (props.redirectPath && props.redirectPath !== router.currentRoute.value.fullPath) {
          router.push(props.redirectPath);
        }

        otpLoading.value = false;
      }, 1000);
    } else {
      // OTP is incorrect
      $q.notify({
        color: 'negative',
        message: "کد وارد شده صحیح نیست. لطفا مجددا تلاش کنید.",
        position: 'top'
      });
      otpLoading.value = false;
    }
  } else {
    // OTP expired
    $q.notify({
      color: 'negative',
      message: "کد منقضی شده است لطفا دوباره تلاش کنید",
      position: 'top'
    });
    otpLoading.value = false;
  }
};

// Forgot password handler
const forgotPassword = () => {
  $q.notify({
    type: 'info',
    message: 'بازیابی رمز عبور',
    position: 'top'
  });
  // Implement your forgot password logic here
};

// Setup and cleanup
onMounted(() => {
  authStore.loginError = null;
  authStore.registerError = null;
  
  if (showOtpDialog.value) {
    startTimer();
    setTimeout(() => {
      otpInputs.value = document.querySelectorAll('.otp-input');
      otpInputs.value[0]?.focus();
    }, 100);
  }
});

onUnmounted(() => {
  authStore.loginError = null;
  authStore.registerError = null;
  clearInterval(timerId);
});
</script>

<style scoped>
.auth-dialog-card {
  width: 90%;
  max-width: 1000px;
  height: auto;
  border-radius: 20px;
}

.auth-dialog-content {
  padding: 0;
  height: 100%;
}

.auth-container {
  display: flex;
  background: white;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.auth-left {
  padding: 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.auth-right {
  padding: 40px;
  flex: 1;
  background: white;
  overflow-y: auto;
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

.login-btn, .signup-btn {
  border-radius: 8px;
  height: 48px;
  font-weight: 600;
  font-size: 1.1em;
  transition: background-color 0.3s ease;
}

.login-btn:hover, .signup-btn:hover {
  background-color: #ff5a5f;
}

/* OTP Dialog */
.otp-dialog {
  width: 90%;
  max-width: 500px;
  padding: 20px;
  border-radius: 16px;
}

.otp-input {
  text-align: center;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin: 0 5px;
}

.resend-link {
  cursor: pointer;
  text-decoration: underline;
  text-align: center;
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
  }

  .auth-left {
    display: none;
  }

  .auth-right {
    width: 100%;
  }
}
</style>