<!-- AuthPage.vue -->
<template>
  <q-layout>
    <q-page-container>
      <q-page class="login-page" dir="rtl">
        <div class="floating-particles">
          <div
            v-for="n in 30"
            :key="n"
            class="particle"
            :style="generateParticleStyle()"
          ></div>
        </div>
        <div class="container">
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
                  <LogIn />
                </q-tab-panel>

                <q-tab-panel name="signup">
                  <SignUp />
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
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref , onMounted } from 'vue'
import LogIn from '../components/LogIn.vue'
import SignUp from '../components/SignUp.vue'




const activeTab = ref('login')

function generateParticleStyle() {
  const size = Math.random() * 6 + 4 // 4px to 10px
  const left = Math.random() * 100  // vw
  const duration = Math.random() * 5 + 3 // 3s to 8s
  const delay = Math.random() * 5 // 0s to 5s
  const opacity = Math.random() * 0.5 + 0.3

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}vw`,
    opacity,
    animation: `float ${duration}s ease-in-out ${delay}s infinite`
  }
}

onMounted(() => {
  generateParticleStyle()
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
  bottom: -10px;
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
</style>
