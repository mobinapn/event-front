<template>
  <q-layout view="hHh lpR fff">
    <!-- Desktop/Tablet Header -->
    <q-header class="bg-white" v-if="!$q.screen.lt.sm">
      <div class="header-container">
        <q-toolbar>
          <!-- Logo -->
          <q-toolbar-title>
            <img src="/images/airbnb-logo.png" class="logo cursor-pointer" @click="goHome" />
          </q-toolbar-title>

          <!-- Desktop Menu -->
          <q-toolbar-title class="text-secondary flex justify-between q-none q-md-flex">
            <template v-for="(menu, index) in menuItems" :key="index">
              <q-btn-dropdown
                flat
                dense
                no-caps
                class="text-bold"
                :label="menu.label"
                auto-close
                :menu-anchor="$q.screen.lt.md ? 'bottom left' : 'bottom start'"
                :menu-self="$q.screen.lt.md ? 'top left' : 'top start'"
              >
                <q-list class="dropdown-menu">
                  <q-item
                    v-for="(item, idx) in menu.items"
                    :key="idx"
                    clickable
                    v-close-popup
                    @click="goToCategory(item.categoryId || item.route)"
                  >
                    <q-item-section>{{ item.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-separator
                v-if="index < menuItems.length - 1"
                vertical
                inset
                class="q-md-inline-block q-none"
              />
            </template>
          </q-toolbar-title>
          <!-- User Actions -->
          <q-toolbar-title class="flex justify-end text-primary">
              <q-btn v-if="!isLoggedIn" flat @click="goToLogin">
                <i class="fa-regular fa-user q-mx-sm"></i>
                ورود / ثبت نام
              </q-btn>
              <!-- Show Dropdown Menu if user is logged in -->
              <q-btn-dropdown
                v-if="isLoggedIn"
                flat
                dense
                no-caps
                :label="authStore.username"
                auto-close
                icon="fa-regular fa-user"
                :menu-anchor="$q.screen.lt.md ? 'bottom left' : 'bottom start'"
                :menu-self="$q.screen.lt.md ? 'top left' : 'top start'"
              >
                <q-list class="dropdown-menu text-primary text-center">
                  <q-item>
                      <q-btn flat v-close-popup @click="goToProfile">
                      <i class="fa-regular fa-user q-mx-sm"></i> پروفایل
                    </q-btn>
                  </q-item>
                  <q-item>
                      <q-btn flat v-close-popup @click="goToAdmin">
                      <i class="fa-solid fa-cog q-mx-sm"></i> داشبورد ادمین
                    </q-btn>
                  </q-item>
                  <q-item>
                    <q-btn flat v-close-popup @click="logout">
                      <i class="fa-solid fa-sign-out-alt q-mx-sm"></i> خروج
                    </q-btn>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-toolbar-title>
        </q-toolbar>
      </div>
    </q-header>

    <!-- Mobile Header -->
    <q-header class="bg-white texy-dark" v-if="$q.screen.lt.sm">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleMobileMenu" />
        <q-toolbar-title class="text-center">
          <img src="/images/airbnb-logo.png" class="mobile-logo cursor-pointer" @click="goHome" />
        </q-toolbar-title>
        <q-btn flat round dense icon="search" @click="toggleSearch" />
      </q-toolbar>

      <!-- Mobile Search Bar - shows when search is active -->
      <q-toolbar v-if="searchActive" class="bg-grey-2">
        <q-input
          dense
          filled
          v-model="searchText"
          placeholder="جستجو..."
          class="full-width"
          bg-color="white"
          borderless
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon
              name="close"
              @click="
                searchText = '' ,
                toggleSearch()"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <!-- Mobile Menu Drawer -->
    <q-drawer
      v-if="$q.screen.lt.sm"
      v-model="mobileMenuOpen"
      side="right"
      bordered
      class="bg-white"
    >
      <q-list>
        <q-item-label header>منو</q-item-label>
        <template v-for="(menu, index) in menuItems" :key="index">
          <q-expansion-item :icon="menu.icon" :label="menu.label" group="mobile-menu">
            <q-list>
              <q-item
                v-for="(item, idx) in menu.items"
                :key="idx"
                clickable
                @click="goToCategory(item.categoryId || item.route)"
              >
                <q-item-section>{{ item.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </template>
      </q-list>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container ref="pageContainer" class="q-mb-none" @scroll="handleScroll">
      <!-- Category Page - shows when category tab is active -->
      <category-page
        v-if="categoryPageActive && $q.screen.lt.sm"
        :menu-items="menuItems"
        @navigate="handleCategoryNavigation"
      />

      <!-- Regular router view - shows when category page is not active -->
      <router-view v-else />
    </q-page-container>

    <!-- Mobile Bottom Navigation -->
    <q-footer v-if="$q.screen.lt.sm" class="bg-white fixed-bottom-nav">
      <q-tabs
        v-model="activeTab"
        class="text-dark"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="home" icon="home" label="خانه" @click="goHome" />
        <q-tab name="search" icon="search" label="جستجو" @click="toggleSearch" />
        <q-tab name="category" icon="view_list" label="دسته بندی ها" @click="toggleCategoryPage" />
        <q-tab name="profile" icon="person" label="حساب کاربری" @click="goToProfile" />
      </q-tabs>
    </q-footer>

    <!-- Desktop Footer with Waves -->
    <q-footer
      v-if="showFooter && !$q.screen.lt.sm"
      class="footer-container bg-white "
      elevated
    >
      <FooterSection/>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import CategoryPage from '../pages/CategoryPageMobile.vue'
import { useAuthStore } from 'src/stores/auth'
import FooterSection from 'src/components/FooterSection.vue'
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
console.log('User Authenticated:', isAuthenticated.value)
const $q = useQuasar()
const router = useRouter()
const showFooter = ref(false)
const pageContainer = ref(null)
const mobileMenuOpen = ref(false)

const searchActive = ref(false)
const searchText = ref('')
const categoryPageActive = ref(false)
const activeTab = ref('home')
const recentCategories = ref([])


// Menu structure with icons
const menuItems = [
  {
    label: 'داخلی',
    icon: 'place',
    items: [
      { label: 'تور های داخلی', route: '/domestic-tours', icon: 'hiking' },
      { label: 'هتل های داخلی', route: '/domestic-hotels', icon: 'hotel' },
      { label: 'اقامتگاه های بومگردی', route: '/local-stays', icon: 'home' },
    ],
  },
  {
    label: 'خارجی',
    icon: 'flight',
    items: [
      { label: 'تور های خارجی', route: '/international-tours', icon: 'flight_takeoff' },
      { label: 'هتل های خارجی', route: '/international-hotels', icon: 'business' },
      { label: 'ویزا', route: '/visa', icon: 'card_travel' },
    ],
  },
  {
    label: 'مجله گردشگری',
    icon: 'book',
    items: [
      { label: 'مقالات گردشگری', route: '/articles', icon: 'article' },
      { label: 'راهنمای سفر', route: '/travel-guide', icon: 'map' },
      { label: 'تجربیات مسافران', route: '/experiences', icon: 'people' },
    ],
  },
  {
    label: 'نوع فعالیت',
    icon: 'category',
    items: [
      { label: ' فرهنگی', categoryId: '2', icon: 'park' },
      { label: ' تاریخی', categoryId: '3', icon: 'terrain' },
      { label: ' زیارتی', categoryId: '4', icon: 'beach_access' },
      { label: ' سیاحتی', categoryId: '5', icon: 'beach_access' },
      { label: ' گردشگری', categoryId: '1', icon: 'beach_access' },
      { label: 'تور یک و دو روزه', route: '/short-tours', icon: 'today' },
    ],
  },
]

const handleScroll = () => {
  if (!pageContainer.value) return
  const el = pageContainer.value.$el
  showFooter.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 10
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleSearch = () => {
  searchActive.value = !searchActive.value
  if (searchActive.value) {
    activeTab.value = 'search'
  }
}

const toggleCategoryPage = () => {
  categoryPageActive.value = !categoryPageActive.value
  if (categoryPageActive.value) {
    activeTab.value = 'category'
  } else {
    // If coming from category page, set the tab to home
    activeTab.value = 'home'
  }
}

const goToCategory = (path) => {
  // Close mobile menu if open
  if (mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }

  // Close category page if open
  if (categoryPageActive.value) {
    categoryPageActive.value = false
  }

  // Navigate to the category
  if (path) {
    if (path.startsWith('/')) {
      router.push(path)
    } else {
      router.push(`/category/${path}`)
    }

    // Save to recent categories (max 3)
    const menuItem = findCategoryItem(path)
    if (menuItem) {
      // Remove if already exists to avoid duplicates
      recentCategories.value = recentCategories.value.filter(
        (item) => item.route !== path && item.categoryId !== path,
      )

      // Add to beginning of array
      recentCategories.value.unshift(menuItem)

      // Limit to 3 items
      if (recentCategories.value.length > 3) {
        recentCategories.value.pop()
      }

      // Save to localStorage for persistence
      localStorage.setItem('recentCategories', JSON.stringify(recentCategories.value))
    }
  }
}

const handleCategoryNavigation = (path) => {
  goToCategory(path)
}

const findCategoryItem = (path) => {
  for (const menu of menuItems) {
    for (const item of menu.items) {
      if (item.route === path || item.categoryId === path) {
        return item
      }
    }
  }
  return null
}

const goHome = () => {
  categoryPageActive.value = false
  activeTab.value = 'home'
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToProfile = () => {
  categoryPageActive.value = false
  activeTab.value = 'profile'
  router.push('/profile')
}
const goToAdmin = () =>{
  router.push('/admin')
}
const logout = () => {
  authStore.logout();
  router.push('/');
};
const isLoggedIn = computed(() => authStore.token !== null) ;
onMounted(() => {
  console.log('User is logged in:', isLoggedIn.value);
  window.addEventListener('scroll', handleScroll)
  // Load recent categories from localStorage
  try {
    const savedCategories = localStorage.getItem('recentCategories')
    if (savedCategories) {
      recentCategories.value = JSON.parse(savedCategories)
    }
  } catch (e) {
    console.error('Error loading recent categories:', e)
  } ;
  
console.log('Username:', authStore.username)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.logo {
  width: 110px;
}

.mobile-logo {
  width: 80px;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
}

.footer-container {
  position: relative;
  overflow: hidden;
  direction: rtl;
}

/* Mobile Styles */
@media (max-width: 599px) {
  .q-toolbar {
    min-height: 60px;
  }

  .q-footer .q-tabs {
    height: 65px;
  }

  .q-tab {
    padding: 8px 4px;
    min-height: 60px;
  }

  .q-tab__icon {
    font-size: 24px;
  }

  .q-tab__label {
    font-size: 12px;
    margin-top: 4px;
  }
}

.fixed-bottom-nav {
  margin-top: 200px;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 2000;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* Add padding to page container to prevent content from being hidden behind fixed nav */
@media (max-width: 599px) {
  :deep(.q-page-container) {
    padding-bottom: 65px !important;
  }
}
.q-page-container {
    padding-bottom: 0px !important;  /* Or a reasonable value */
}

</style>
