<!-- AuthPage.vue -->
<template>
  <q-layout>
    <q-page-container>
      <q-page class="login-page" dir="rtl">
        <!-- <div class="floating-particles">
          <div v-for="n in 30" :key="n" class="particle" :class="`particle-${n}`"></div>
        </div> -->

        <div class="container">
          <div class="auth-container">
            <div class="auth-right">
              <h6 class="text-center q-pa-sm text-secondary">
                لطفا کد ۴ رقمی ارسال شده به شماره
                <span class="text-bold">{{ phoneNumber }}</span> را وارد کنید
              </h6>

              <!-- OTP Inputs -->
              <div class="q-gutter-xs row items-center">
                <div class="col" v-for="(digit, index) in otp" :key="index">
                  <input
                    ref="otpInputs"
                    v-model="otp[index]"
                    @input="handleInput(index, $event)"
                    @keydown.backspace="handleBackspace(index, $event)"
                    type="text"
                    class="otp-input"
                    maxlength="1"
                  />
                </div>
              </div>

              <!-- Timer & Resend OTP -->
              <div class="flex flex-center q-mt-lg">
                <p class="text-secondary">{{ formattedTimeLeft }} دوباره تلاش کنید</p>
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
                :loading="loading"
                @click="submitOtp"
              >
                <template v-slot:loading>
                  <q-spinner-dots />
                </template>
              </q-btn>
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
                    <source src="/gif/Animation - 1740035231330 (1).webm" type="video/webm" />
                  </video>
                </q-img>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
// import anime from 'animejs'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const loading = ref(false)
// const animateParticles = () => {
//   const particles = document.querySelectorAll('.particle')
//   particles.forEach((particle) => {
//     const size = Math.random() * 6 + 4
//     const delay = Math.random() * 5000
//     const duration = Math.random() * 5000 + 3000
//     const left = Math.random() * 100
//     const opacity = Math.random() * 0.5 + 0.3

//     particle.style.width = `${size}px`
//     particle.style.height = `${size}px`
//     particle.style.left = `${left}vw`
//     particle.style.opacity = opacity

//     anime({
//       targets: particle,
//       translateY: [-10, -window.innerHeight],
//       loop: true,
//       easing: 'easeInOutSine',
//       duration: duration,
//       delay: delay,
//     })
//   })
// }

// State for OTP inputs
const otp = ref(['', '', '', ''])
const otpInputs = ref([]) // Reference for input elements
const phoneNumber = ref('09339267632')

// Timer for OTP expiration
const timeLeft = ref(120) // 2 minutes
let timerId = null

// Computed property for formatted timer display
const formattedTimeLeft = computed(() => {
  if (timeLeft.value <= 0) return 'کد منقضی شده است'
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `(${minutes}:${seconds.toString().padStart(2, '0')})`
})

// Function to start countdown timer
const startTimer = () => {
  timerId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerId)
    }
  }, 1000)
}

// Function to handle OTP input behavior
const handleInput = (index, event) => {
  otp.value[index] = event.target.value.replace(/[^0-9]/g, '').slice(0, 1)
  if (otp.value[index] && index < otp.value.length - 1) {
    otpInputs.value[index + 1]?.focus()
  }
}

// Function to handle backspace key
const handleBackspace = (index, event) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

// Function to resend OTP
const resendOTP = () => {
  alert('کد جدید ارسال شد!')
  otp.value = ['', '', '', ''] // Clear inputs
  timeLeft.value = 120 // Reset timer
  clearInterval(timerId)
  startTimer()
}

// Function to submit OTP
const submitOtp = () => {
  const enteredOtp = otp.value.join('');
  loading.value = true;

  if (enteredOtp.length !== 4) {
    alert('لطفا کد ۴ رقمی را وارد کنید');
    return;
  }

  if (timeLeft.value > 0) {
    $q.notify({
      color:'positive' ,
      message: "شما با موفقیت وارد حساب کاربری خود شدید" ,
      position:'top'
      
    })


    const attemptedRoute = localStorage.getItem('attemptedRoute') || "/";
    localStorage.removeItem('attemptedRoute'); // Clear it after use


    localStorage.removeItem('attemptedRoute'); // Clear it after use

    router.push(attemptedRoute);
    loading.value = false;
  } else {
    $q.notify({
      color : 'negative' ,
      message: "کد منقضی شده است لطفا دوباره تلاش کنید"
    })
  }
};



// Auto-focus the first input on mount
onMounted(() => {
  otpInputs.value = document.querySelectorAll('.otp-input')
  otpInputs.value[0]?.focus()
  startTimer()
  // animateParticles()
})
</script>

<style scoped>
.login-page {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 0;
}

.particle {
  position: absolute;
  background: #ff5a5f;
  border-radius: 50%;
  bottom: -10px; /* Start slightly below the screen */
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

.auth-container {
  display: flex;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  width: 1000px;
  max-width: 95vw;
  min-height: 600px;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.auth-left {
  padding: 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  border-right: #ff5a5f 1px solid;
  border-radius: 15px;
}

.auth-right {
  padding: 40px;
  flex: 1;
  background: white;
}

.tagline {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 30px;
}

.featured-destinations {
  margin-top: auto;
}

.destination-preview {
  margin: 10px 0;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.destination-preview img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.destination-preview:hover img {
  transform: scale(1.05);
}

.destination-name {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    width: 95vw;
  }

  .auth-left,
  .auth-right {
    width: 100%;
  }

  .auth-left {
    padding: 20px;
  }

  .featured-destinations {
    display: none;
  }
}

.particle {
  position: absolute;
}
/* Style for OTP inputs */
.otp-input {
  text-align: center;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin: 0 5px;
}

/* Style for expired timer */
.expired {
  color: red;
  font-weight: bold;
}

/* Resend link style */
.resend-link {
  cursor: pointer;
  text-decoration: underline;
  text-align: center;
}
</style>
