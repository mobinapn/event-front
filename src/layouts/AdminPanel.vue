<template>
  <q-layout view="hHh LpR fFf" dir="rtl">
    <!-- Header -->
        <q-header class="bg-white" bordered>
      <div class="header-container">
        <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          color="grey-8"
          aria-label="Menu"
          class="lt-md"
          @click="toggleRightDrawer"
        />
          
          <!-- Logo -->
          <q-toolbar-title class="text-weight-bold flex items-center">
            <img src="/images/airbnb-logo.png" class="logo cursor-pointer" @click="goHome" />
            <span class="text-subtitle2 text-weight-bold   text-accent">  پنل مدیریت </span>
          </q-toolbar-title>
          <!-- User Actions -->
          <q-toolbar-title class="flex justify-end text-primary">
              <q-btn-dropdown
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
    
    <!-- RIGHT Drawer for mobile -->
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      bordered
      :breakpoint="1023"
      content-class="bg-white"
      behavior="mobile"
      overlay
      class="lt-md"
    >
      <NavigationMenu />
    </q-drawer>
    
    <!-- Main content -->
    <q-page-container>
      <div class="rtl-layout">
        <div class="content-area">
          <div class="q-pa-md">
            <router-view />
          </div>
        </div>
        <!-- Fixed navigation card for desktop -->
        <div class="navigation-card gt-sm">
          <q-card flat bordered class="full-height">
            <NavigationMenu />
          </q-card>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavigationMenu from '../components/Admin/NavigationMenu.vue';
import { useAuthStore } from 'src/stores/auth';

const authStore = useAuthStore()

// const isAuthenticated = computed(() => authStore.isAuthenticated)
const router = useRouter()
const goHome = () => {
  router.push('/')
}


const goToProfile = () => {

  router.push('/profile')
}
const goToAdmin = () =>{
  router.push('/admin')
}
const logout = () => {
  authStore.logout();
  router.push('/');
};
// const isLoggedIn = computed(() => authStore.token !== null) ;
const rightDrawerOpen = ref(false);
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};


</script>

<style scoped>

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  height:80px;
}
.rtl-layout {
  display: flex;
  flex-direction: row-reverse; 
  width: 100%;
  height: calc(100vh - 50px);
}

.navigation-card {
  width: 220px;
  position: sticky;
  top: 50px;
  right: 0;
}

.content-area {
  flex: 1;
  overflow-x: hidden;
}

.q-drawer--right {
  transform-origin: right !important;
}

.q-drawer--right .q-list {
  padding-right: 0;
}

.q-item__section--avatar {
  padding-right: 0;
  padding-left: 16px;
}

.q-item {
  transition: background-color 0.2s;
}

.q-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.q-router-link--exact-active {
  background-color: rgba(0, 0, 0, 0.05);
  font-weight: 500;
}

/* .q-page-container {
  padding-top: 50px;
} */

.q-pa-md {
  padding: 16px;
}

.full-height {
  height: 100%;
}
.logo {
  width: 110px;
}
</style>