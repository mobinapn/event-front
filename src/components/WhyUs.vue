<template>
  <div class="q-pa-lg">
    <div class="text-center q-mb-xl">
      <h2 class="text-h4 q-mb-sm text-weight-bold">چرا رزرو با ما؟</h2>
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="feature in features" :key="feature.id" class="col-12 col-sm-6 col-md-3 q-mb-md">
        <q-card class="feature-card text-center q-pa-md q-mb-md" v-ripple flat>
          <q-card-section>
            <div class="flex flex-center q-mb-md">
              <!-- SVG with better color handling -->
              <div
                class="svg-icon-container"
                :style="`--icon-color: ${feature.color}`"
                v-html="feature.svg"
              ></div>
            </div>

            <div class="text-h5 q-mb-sm text-weight-bold text-center">{{ feature.title }}</div>
            <div class="text-subtitle1">{{ feature.description }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const features = ref([
  {
    id: 1,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="22"></line>
            <circle cx="12" cy="16" r="2"></circle>
          </svg>`,
    title: 'پشتیبانی ۲۴/۷',
    description: 'در هر ساعت از شبانه‌روز، ما آماده کمک به شما هستیم',
    color: '#e91e63', // Pink color code
    buttonText: 'تماس با پشتیبانی',
    action: 'support',
  },
  {
    id: 2,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 12 20 22 4 22 4 12"></polyline>
            <rect x="2" y="7" width="20" height="5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
          </svg>`,
    title: 'کسب امتیاز',
    description: 'با هر رزرو امتیاز جمع کنید و از مزایای ویژه بهره‌مند شوید',
    color: '#009688', // Teal color code
    buttonText: 'مشاهده امتیازات',
    action: 'rewards',
  },
  {
    id: 3,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>`,
    title: 'نظرات کاربران',
    description: 'با اطمینان و بر اساس تجربه دیگر مسافران رزرو کنید',
    color: '#ff9800', // Orange color code
    buttonText: 'مشاهده نظرات',
    action: 'reviews',
  },
  {
    id: 4,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <line x1="9" y1="16" x2="15" y2="16"></line>
          </svg>`,
    title: 'انعطاف‌پذیری در رزرو',
    description: 'امکان کنسلی رایگان و پرداخت در زمان اقامت',
    color: '#9c27b0', // Purple color code
    buttonText: 'شرایط رزرو',
    action: 'flexibility',
  },
])
</script>

<style lang="scss">
.feature-card {
  transition: all 0.3s ease;
  height: 100%;
  border-radius: 12px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  .svg-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    color: var(--icon-color);
    background-color: color-mix(in srgb, var(--icon-color) 10%, transparent);
    transition: all 0.3s ease;

    svg {
      transition: transform 0.3s ease;
    }

    &:hover {
      background-color: color-mix(in srgb, var(--icon-color) 15%, transparent);

      svg {
        transform: scale(1.1);
      }
    }
  }
}
</style>
