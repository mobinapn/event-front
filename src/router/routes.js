
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'trip/:id' , component : ()  => import ('../pages/EventDetail.vue') },
      { path: 'category/:categoryId', component:() =>import('../pages/CategoryPage.vue') , props: true },
      { path: 'checkout',component: () => import('../pages/CheckoutPage.vue') } ,
      { path: 'invoice' , component: () => import ('../pages/InvoicePage.vue'), meta: { requiresAuth: true } } ,
      { path: 'profile' , component:() => import('../pages/ProfilePage.vue') ,  meta: { requiresAuth: true }} ,
      { path: '/payment-status', component: () => import ('../pages/PaymentStatuse.vue') },
      { path: 'search-results' , component: () => import('../pages/SearchReasult.vue')} ,
    ]
  },
  { path:'/login' , component: () => import('../pages/AuthPage.vue') },
  { path:'/OTP' , component: () => import('../pages/OTPPage.vue') ,  meta: { requiresAuth: true } },
  // meta: { requiresAuth: true, role: "Admin" } ,
  {
    path: '/admin' ,
    component : () => import('layouts/AdminPanel.vue') , meta: { requiresAuth: true } ,
    children: [
      { path: '/admin', component: () => import('../pages/AdminPanel/DashboardPage.vue') },
      { path: 'events', component: () => import('../pages/AdminPanel/EventManagement.vue') },
      { path: 'users', component: () => import('../pages/AdminPanel/UserManagement.vue') },
      // { path: 'payments', component: () => import('../pages/AdminPanel/PaymentsManagement.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
