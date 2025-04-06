<template>
  <q-page class="q-pa-md">
    <div class="dashboard-container">
      <!-- Header with improved branding -->
      <div class="row items-center justify-between q-mb-lg">
        <div class="col-12">
          <h1 class="text-h4 text-weight-bold text-right q-mb-none text-secondary">داشبورد مدیریت</h1>
        </div>
      </div>
      
      <!-- Status Cards - Grid layout with improved visuals -->
      <div class="row q-col-gutter-md q-mb-lg">
        <!-- Tour Card -->
        <div class="col-12 col-md-4">
          <q-card class="dashboard-card full-height" flat bordered>
            <q-card-section>
              <div class="column items-center">
                <div class="icon-container q-mb-md">
                  <q-img src="/images/undraw_booking_1ztt.svg"></q-img>
                </div>
                <h3 class="text-subtitle1 text-secondary q-mb-sm text-center">تعداد کل تورها</h3>
                <div class="stat-value">
                  <q-skeleton v-if="loading" type="text" width="80px" />
                  <template v-else>
                    <p class="text-h4 text-weight-bold text-secondary q-mb-none">{{ stats.totalTours }}</p>
                  </template>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        
        <!-- Users Card -->
        <div class="col-12 col-md-4">
          <q-card class="dashboard-card full-height" flat bordered>
            <q-card-section>
              <div class="column items-center">
                <div class="icon-container q-mb-md">
                  <q-img src="/images/undraw_avatars_xsfb.svg"></q-img>
                </div>
                <h3 class="text-subtitle1 text-secondary q-mb-sm text-center">تعداد کل کاربران</h3>
                <div class="stat-value">
                  <q-skeleton v-if="loading" type="text" width="80px" />
                  <template v-else>
                    <p class="text-h4 text-weight-bold text-secondary q-mb-none" v-persian-numbers>{{ stats.totalUsers }}</p>
                  </template>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        
        <!-- Revenue Card -->
        <div class="col-12 col-md-4">
          <q-card class="dashboard-card full-height" flat bordered>
            <q-card-section>
              <div class="column items-center">
                <div class="icon-container q-mb-md">
                  <q-img src="/images/undraw_investing_kncz.svg"></q-img>
                </div>
                <h3 class="text-subtitle1 text-grey-7 q-mb-sm text-center">درآمد ناخالص</h3>
                <div class="stat-value">
                  <q-skeleton v-if="loading" type="text" width="120px" />
                  <template v-else>
                    <p class="text-h4 text-weight-bold text-secondary q-mb-none" v-persian-numbers>
                      {{ persianRevenue  }}
                      <span class="text-caption q-ml-xs text-weight-regular">تومان</span>
                    </p>
                  </template>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      
      <!-- Revenue Chart with improved container -->
      <q-card flat bordered  class="q-mb-md" style="border-radius: 12px;">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="col-12">
              <h2 class="text-h5 text-weight-bold text-right q-mb-none"> نمودار درآمد ماهانه</h2>
            </div>
          </div>
          <div class="chart-container">
            <template v-if="loading">
              <div class="row justify-center">
                <q-spinner color="primary" size="3em" />
              </div>
            </template>
            <template v-else>
              <RevenueChart />
            </template>
          </div>
        </q-card-section>
      </q-card>
      
      <!-- Data refresh indicator -->
      <div class="row justify-start q-mt-xs">
        <q-badge outline color="grey" class="text-caption">
          <q-icon name="update" size="xs" class="q-mr-xs" />
          آخرین بروزرسانی: {{ lastUpdateTime }}
        </q-badge>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted , computed } from "vue";
import { date } from "quasar";
import RevenueChart from "../../components/Admin/RevenueChart.vue";
import { toPersianNumbers } from 'src/utilities/numberUtils'

const stats = ref({
  totalTours: 0,
  totalUsers: 0,
  totalRevenue: 0,
});

const loading = ref(true);
const lastUpdateTime = ref("");

const persianRevenue = computed(() => toPersianNumbers( stats.value.totalRevenue.toLocaleString()))

const fetchDashboardStats = async () => {
  loading.value = true;
  try {
    const response = await fetch('https://json-server-production-de66.up.railway.app/dashboardStats');
    stats.value = await response.json();
    lastUpdateTime.value = date.formatDate(new Date(), 'HH:mm:ss');
  } catch (error) {
    console.error("خطا در دریافت اطلاعات داشبورد:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardStats();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
}

.icon {
  width: 32px;
  height: 32px;
}
.chart-container {
  height: 300px;
  width: 100%;
  border-radius: 12px;
}

/* RTL support */
:root {
  direction: rtl;
}

@media (max-width: 599px) {
  .dashboard-card {
    margin-bottom: 12px;
  }
  
  .stat-value p {
    font-size: 1.5rem; /* Smaller font size on mobile */
  }
}
</style>