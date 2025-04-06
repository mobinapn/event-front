<template>
  <div class="profile-page q-pa-md">
    <!-- Status message -->
    <q-banner v-if="statusMessage.show" class="q-mb-md" :class="statusMessage.type">
      {{ statusMessage.text }}
      <template v-slot:action>
        <q-btn flat label="بستن" @click="statusMessage.show = false" />
      </template>
    </q-banner>
    <!-- Loading State for Initial Data Fetch -->
    <div v-if="initialLoading" class="text-center q-my-xl">
      <q-spinner-dots color="primary" size="3em" />
      <div class="q-mt-md text-subtitle1">در حال بارگذاری اطلاعات حساب کاربری...</div>
    </div>

    <!-- Main Content Area (shown after initial loading) -->
    <div v-else class="row q-col-gutter-md">
      <!-- Right Side - Navigation Menu -->
      <div class="col-12 col-md-3">
        <q-card flat bordered class="menu-card sticky-top">
          <q-card-section class="q-pa-none">
            <q-list padding>
              <q-item
                v-for="item in menuItems"
                :key="item.title"
                clickable
                v-ripple
                :active="currentTab === item.value"
                active-class="active-menu-item"
                @click="currentTab = item.value"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="item.icon"
                    :color="currentTab === item.value ? 'primary' : 'grey'"
                  />
                </q-item-section>
                <q-item-section>
                  <div :class="{ 'text-primary text-weight-medium': currentTab === item.value }">
                    {{ item.title }}
                  </div>
                </q-item-section>
                <q-item-section side v-if="item.badge">
                  <q-badge color="red" rounded>{{ item.badge }}</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-section class="text-center q-mt-xl">
            <q-btn
              outline
              color="red-6"
              label="خروج از حساب کاربری"
              no-caps
              @click="logout"
              style="border-radius: 6px"
            >
              <q-icon name="fa-solid fa-arrow-right-from-bracket q-mr-sm" />
            </q-btn>
          </q-card-section>
        </q-card>
      </div>

      <!-- Left Side - Content Area -->
      <div class="col-12 col-md-9">
        <q-card flat class="content-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ getActiveTabTitle() }}</div>

            <!-- Tab content with transition -->
            <!-- <transition name="fade" mode="out-in"> -->
            <div>
              <!-- Personal Info -->
              <PersonalInfo
                v-if="currentTab === 'profile'"
                :personalInfo="userData"
                @update-success="handleProfileUpdate"
                @show-wallet="handleShowWallet"
              />
              <!-- Trips -->
              <MyTrips v-else-if="currentTab === 'trips'" @loading="setLoading" :userId="authStore.user?.id" />

              <!-- Passengers List -->
              <Passengers
                v-else-if="currentTab === 'passengers'"
                :passengerInfo="userData"
                @passenger-added="updatePassengerStats"
              />

              <!-- Favorites -->
              <WishList
                v-else-if="currentTab === 'favorites'"
                :userId="user?.id"
                @loading="setLoading"
              />

              <!-- Wallet -->
              <Walletcomponent
                v-else-if="currentTab === 'wallet'"
                :currentBalance="userData?.balance || 0"
                @balance-updated="updateBalance"
              />

              <!-- Support -->
              <SupportAsk
                v-else-if="currentTab === 'support'"
                @ticket-submitted="handleTicketSubmit"
              />
            </div>
            <!-- </transition> -->
          </q-card-section>

          <q-inner-loading :showing="loading">
            <q-spinner-dots size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted ,watch} from 'vue'
import { api } from 'src/boot/axios'
import { useRouter , useRoute } from 'vue-router'
import Passengers from '../components/profile/PassengersInformation.vue'
import PersonalInfo from '../components/profile/PersonalInformation.vue'
import WishList from '../components/profile/WishList.vue'
import Walletcomponent from 'src/components/profile/WalletComponent.vue'
import SupportAsk from '../components/profile/SupportAsk.vue'
import MyTrips from '../components/profile/MyTrips.vue'
import { useAuthStore } from 'src/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State management
const userData = ref(null)
const currentTab = ref('profile')
const loading = ref(false)
const initialLoading = ref(true)
const statusMessage = reactive({
  show: false,
  text: '',
  type: 'bg-positive text-white', // default is success
})

// Menu items
const menuItems = [
  { title: 'حساب کاربری', icon: 'fa-solid fa-user', value: 'profile' },
  { title: 'سفرهای من', icon: 'fa-solid fa-suitcase-rolling', value: 'trips' },
  { title: 'لیست مسافران', icon: 'fa-solid fa-user-group', value: 'passengers' },
  { title: 'علاقه‌مندی‌ها', icon: 'fa-solid fa-heart', value: 'favorites' },
  { title: 'موجودی و اعتبار من', icon: 'fa-solid fa-wallet', value: 'wallet' },
  { title: 'درخواست پشتیبانی', icon: 'fa-solid fa-headset', value: 'support' },
]

// Authentication check
const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

// Centralized fetchUserData
const fetchUserData = async () => {
  initialLoading.value = true
  try {
    const response = await api.get('/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Profile data loaded:', response.data)
    userData.value = response.data
  } catch (error) {
    console.error('Error fetching profile data:', error)
    showMessage('خطا در بارگذاری اطلاعات پروفایل. لطفا دوباره تلاش کنید.', 'error')
    if (error.response && error.response.status === 401) {
      handleUnauthorized()
    }
  } finally {
    initialLoading.value = false
  }
}

// Update profile function
const updateProfile = async (formData) => {
  loading.value = true
  try {
    console.log('Sending update:', formData)
    const response = await api.put('/profile', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    })
    console.log('Update response:', response.data)
    await fetchUserData() // Refresh data after update
    showMessage('اطلاعات پروفایل با موفقیت بروزرسانی شد')
    // In your profile component after successfully updating profile
    authStore.updateUsername(response.data.username);
  } catch (error) {
    console.error('Error updating profile:', error)
    showMessage('خطا در بروزرسانی اطلاعات. لطفا دوباره تلاش کنید.', 'error')
    throw error // Let child components handle specific errors if needed
  } finally {
    loading.value = false
  }
}

// Helper functions
function showMessage(text, type = 'success') {
  statusMessage.text = text
  statusMessage.type = type === 'success' ? 'bg-positive text-white' : 'bg-negative text-white'
  statusMessage.show = true

  // Auto-hide after 5 seconds
  setTimeout(() => {
    statusMessage.show = false
  }, 5000)
}

const setLoading = (status) => {
  loading.value = status
}

// Event handlers
const handleProfileUpdate = (updatedData) => {
  updateProfile(updatedData).catch(() => {}) // Errors handled in updateProfile
}
const handleShowWallet = ()=>{
  currentTab.value = 'wallet'
}

const updateBalance = async (newBalance) => {
  if (userData.value) {
    userData.value.balance = newBalance

    // Show status message
    statusMessage.text = 'موجودی کیف پول با موفقیت به‌روزرسانی شد'
    statusMessage.type = 'bg-positive text-white'
    statusMessage.show = true

    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusMessage.show = false
    }, 5000)
  }
}

const updatePassengerStats = () => {
  fetchUserData()
}

const handleTicketSubmit = () => {
  showMessage('درخواست پشتیبانی شما با موفقیت ثبت شد')
}

const logout = () => {
  if (confirm('آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟')) {
    localStorage.removeItem('token')
    router.push('/')
  }
}

const handleUnauthorized = () => {
  localStorage.removeItem('token')
  showMessage('نشست شما منقضی شده است. لطفا دوباره وارد شوید.', 'error')
  router.push('/login')
}

const getActiveTabTitle = () => {
  const activeItem = menuItems.find((item) => item.value === currentTab.value)
  return activeItem ? activeItem.title : ''
}
// Lifecycle hooks
onMounted(async () => {
  await fetchUserData() ;
  if (route.query.tab) {
    currentTab.value = route.query.tab;
  }
})
watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    currentTab.value = newTab;
  }
});
</script>

<style lang="scss" scoped>
.profile-page {
  direction: rtl;

  .header-card {
    border-radius: 12px;
    background: linear-gradient(to left, #f7f7f7, #ffffff);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .balance-card {
      background-color: rgba(0, 0, 0, 0.02);
      border-radius: 8px;
    }
  }

  .stats-card {
    border-radius: 12px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    }
  }

  .menu-card {
    border-radius: 12px;

    .active-menu-item {
      background-color: rgba(25, 118, 210, 0.1);
      border-right: 4px solid var(--q-primary);
    }
  }

  .content-card {
    border-radius: 12px;
    min-height: 400px;
  }

  .sticky-top {
    position: sticky;
    top: 16px;
  }

  // Animation for tab transitions
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.3s,
      transform 0.3s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }

  // Status message styles
  .bg-positive {
    background-color: #21ba45;
  }
  .bg-negative {
    background-color: #c10015;
  }
}

// Mobile responsiveness improvements
@media (max-width: 768px) {
  .profile-page {
    .header-card {
      .row {
        flex-direction: column;
      }

      .balance-card {
        margin-top: 16px;
        width: 100%;
      }
    }

    .sticky-top {
      position: static;
    }
  }
}
</style>
