<template>
    <q-page padding>
      <!-- Main Layout -->
      <div class="row q-col-gutter-md" dir="rtl">
        <!-- Left side: User list -->
        <div :class="selectedUser ? 'col-12 col-md-5 col-lg-4' : 'col-12'">
          <q-card  flat class="user-list-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h4"> مدیریت کاربران </div>
                <div>
                  <q-input
                    v-model="searchQuery"
                    dense
                    outlined
                    placeholder="جستجوی کاربران..."
                    class="q-ml-sm"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>
              <q-separator />
            </q-card-section>
  
            <q-card-section class="q-pa-none">
              <q-list separator>
                <q-item
                  v-for="user in filteredUsers"
                  :key="user.id"
                  clickable
                  v-ripple
                  :active="selectedUser && selectedUser.id === user.id"
                  active-class="bg-primary text-white"
                  @click="selectUser(user)"
                >
                  <q-item-section side>
                    <q-badge :color="user.status === 'active' ? 'positive' : 'negative'">
                      {{ user.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </q-badge>
                  </q-item-section>
  
                  <q-item-section>
                    <q-item-label>{{ user.name }}</q-item-label>
                    <q-item-label caption>{{ user.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
  
            <q-card-section v-if="users && users.length > 10">
              <div class="row justify-center">
                <q-pagination
                  v-model="currentPage"
                  :max="Math.ceil(users.length / itemsPerPage)"
                  direction-links
                  boundary-links
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
  
        <!-- Right side: User details when a user is selected -->
        <div v-if="selectedUser" class="col-12 col-md-7 col-lg-8">
          <q-card class="user-details-card">
            <q-card-section>
              <div class="row items-center justify-between">
                <div class="text-h6">جزئیات کاربر</div>
                <div>
                  <q-btn flat round icon="close" @click="closeUserDetails" />
                </div>
              </div>
              <q-separator />
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <!-- Basic Info Card -->
                <div class="col-12 col-md-6">
                  <div class="text-center q-mb-md">
                    <div class="text-h5">{{ selectedUser.name }}</div>
                    <q-badge :color="selectedUser.status === 'active' ? 'positive' : 'negative'">
                      {{ selectedUser.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </q-badge>
                  </div>
                  <q-list bordered separator>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline>ایمیل</q-item-label>
                        <q-item-label>{{ selectedUser.email }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline>تلفن</q-item-label>
                        <q-item-label>{{ selectedUser.phone }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline>تاریخ عضویت</q-item-label>
                        <q-item-label>{{ formatPersianDate(selectedUser.joinDate) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline>نقش</q-item-label>
                        <q-item-label>{{ translateRole(selectedUser.role) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
  
                <!-- Events Attending Card -->
                <div class="col-12 col-md-6">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">رویدادهای ثبت‌نام شده</div>
                    </q-card-section>
                    <q-separator />
                    <q-list separator>
                      <q-item v-for="event in selectedUser.events" :key="event.id" clickable v-ripple>
                        <q-item-section>
                          <q-item-label>{{ event.name }}</q-item-label>
                          <q-item-label caption>{{ formatPersianDate(event.date) }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-badge :color="event.status === 'confirmed' ? 'positive' : 'warning'">
                            {{ event.status === 'confirmed' ? 'تایید شده' : 'در انتظار' }}
                          </q-badge>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="selectedUser && selectedUser.events && selectedUser.events.length === 0">
                        <q-item-section>
                          <q-item-label class="text-center text-grey">هیچ رویدادی ثبت نشده است</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
  
                  <!-- Actions Card -->
                  <q-card flat bordered class="q-mt-md">
                    <q-card-section>
                      <div class="text-h6">عملیات</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                      <div class="row q-col-gutter-sm">
                        <div class="col-6">
                          <q-btn
                            outline
                            color="primary"
                            icon="edit"
                            label="ویرایش کاربر"
                            class="full-width"
                            @click="editUser"
                          />
                        </div>
                        <div class="col-6 ">
                          <q-btn
                            outline
                            color="negative"
                            icon="delete"
                            label="حذف کاربر"
                            class="full-width"
                            @click="confirmDelete"
                          />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
  
                <!-- User Activity -->
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">فعالیت‌های اخیر</div>
                    </q-card-section>
                    <q-separator />
                    <q-timeline color="primary">
                      <q-timeline-entry
                        v-for="(activity, index) in selectedUser.recentActivity"
                        :key="index"
                        :title="translateActivity(activity.action)"
                        :subtitle="formatPersianDate(activity.date)"
                        :icon="getActivityIcon(activity.type)"
                        :color="getActivityColor(activity.type)"
                      >
                        <div>{{ translateActivityDetails(activity.details) }}</div>
                      </q-timeline-entry>
                    </q-timeline>
                  </q-card>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
  
      <!-- Edit User Dialog -->
      <q-dialog v-model="editDialogOpen" persistent>
        <q-card style="min-width: 350px" dir="rtl">
          <q-card-section>
            <div class="text-h6">ویرایش کاربر</div>
          </q-card-section>
  
          <q-card-section class="q-pt-none" v-if="selectedUser">
            <q-input v-model="editUserForm.name" label="نام" outlined class="q-mb-md" />
            <q-input v-model="editUserForm.email" label="ایمیل" outlined class="q-mb-md" />
            <q-input v-model="editUserForm.phone" label="تلفن" outlined class="q-mb-md" />
            <q-select
              v-model="editUserForm.role"
              :options="[
                { label: 'کاربر', value: 'User' },
                { label: 'مدیر', value: 'Admin' },
                { label: 'مدیر رویداد', value: 'Event Manager' }
              ]"
              option-label="label"
              option-value="value"
              map-options
              emit-value
              label="نقش"
              outlined
              class="q-mb-md"
            />
            <q-toggle v-model="editUserForm.isActive" label="فعال" />
          </q-card-section>
  
          <q-card-actions align="left" class="bg-white text-primary">
            <q-btn flat label="لغو" v-close-popup />
            <q-btn flat label="ذخیره تغییرات" @click="saveUserChanges" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <!-- Delete User Confirmation Dialog -->
      <q-dialog v-model="deleteDialogOpen" persistent>
        <q-card dir="rtl">
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="negative" text-color="white" />
            <span class="q-mr-sm">آیا از حذف این کاربر اطمینان دارید؟</span>
          </q-card-section>
  
          <q-card-actions align="left">
            <q-btn flat label="لغو" color="primary" v-close-popup />
            <q-btn flat label="حذف" color="negative" @click="deleteUser" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script>
  import { ref, computed, reactive, onMounted } from 'vue'
  import { useQuasar } from 'quasar'
  import axios from 'axios'
  
  
  export default {
    name: 'UserManagement',
    setup() {
      const $q = useQuasar()
      
      // User list state
      const users = ref([])
      const selectedUser = ref(null)
      const searchQuery = ref('')
      const currentPage = ref(1)
      const itemsPerPage = ref(10)
      
      // Dialog states
      const editDialogOpen = ref(false)
      const deleteDialogOpen = ref(false)
      const editUserForm = reactive({
        name: '',
        email: '',
        phone: '',
        role: '',
        isActive: true
      })
  
      // Computed properties
      const filteredUsers = computed(() => {
        if (!searchQuery.value) {
          return users.value
        }
        const query = searchQuery.value.toLowerCase()
        return users.value.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
        )
      })
  
      // Methods
      const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/Users')
    users.value = response.data || []
  } catch (error) {
    console.error('Error fetching users:', error)
    users.value = []
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات کاربران' ,
      position:'top'
    })
  }
}

      const selectUser = (user) => {
        selectedUser.value = user
      }
  
      const closeUserDetails = () => {
        selectedUser.value = null
      }
  
      const formatPersianDate = (dateString) => {
        // Persian date formatting (using standard date for demonstration)
        // In a real app, you might want to use a Persian date library
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('fa-IR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date)
      }
  
      // Translate roles to Persian
      const translateRole = (role) => {
        switch (role) {
          case 'Admin': return 'مدیر'
          case 'Event Manager': return 'مدیر رویداد'
          case 'User': return 'کاربر'
          default: return role
        }
      }
  
      // Translate activities to Persian
      const translateActivity = (action) => {
        switch (action) {
          case 'Logged in': return 'ورود به سیستم'
          case 'Updated profile': return 'بروزرسانی پروفایل'
          case 'Registered for event': return 'ثبت‌نام در رویداد'
          case 'Created event': return 'ایجاد رویداد'
          case 'Account deactivated': return 'غیرفعال‌سازی حساب'
          default: return action
        }
      }
  
      // Translate activity details to Persian
      const translateActivityDetails = (details) => {
        if (details.includes('User logged in from IP')) {
          return details.replace('User logged in from IP', 'کاربر از آی‌پی وارد شده است:')
        } else if (details.includes('Changed profile picture and contact information')) {
          return 'تغییر اطلاعات تماس'
        } else if (details.includes('Registered for Annual Tech Conference')) {
          return 'ثبت‌نام در کنفرانس سالانه تکنولوژی'
        } else if (details.includes('Created new event: Product Launch')) {
          return 'ایجاد رویداد جدید: معرفی محصول جدید'
        } else if (details.includes('Account deactivated by admin due to inactivity')) {
          return 'حساب کاربری توسط مدیر به دلیل عدم فعالیت غیرفعال شده است'
        } else if (details.includes('Last login from IP')) {
          return details.replace('Last login from IP', 'آخرین ورود از آی‌پی:')
        }
        return details
      }
  
      const getActivityIcon = (type) => {
        switch (type) {
          case 'login': return 'login'
          case 'event': return 'event'
          case 'profile': return 'person'
          case 'status': return 'info'
          default: return 'history'
        }
      }
  
      const getActivityColor = (type) => {
        switch (type) {
          case 'login': return 'primary'
          case 'event': return 'purple'
          case 'profile': return 'teal'
          case 'status': return 'orange'
          default: return 'grey'
        }
      }
  
      const editUser = () => {
        // Populate form with current user data
        if (selectedUser.value) {
          editUserForm.name = selectedUser.value.name
          editUserForm.email = selectedUser.value.email
          editUserForm.phone = selectedUser.value.phone
          editUserForm.role = selectedUser.value.role
          editUserForm.isActive = selectedUser.value.status === 'active'
          editDialogOpen.value = true
        }
      }
  
      // Update an existing user
const saveUserChanges = async () => {
  if (!selectedUser.value) return
  
  try {
    // Create updated user object
    const updatedUser = {
      ...selectedUser.value,
      name: editUserForm.name,
      email: editUserForm.email,
      phone: editUserForm.phone,
      role: editUserForm.role,
      status: editUserForm.isActive ? 'active' : 'inactive'
    }
    
    // Send PUT request to update user
    const response = await axios.put(
      `http://localhost:3000/Users/${selectedUser.value.id}`, 
      updatedUser
    )
    
    // Update local data
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index !== -1) {
      users.value[index] = response.data
      selectedUser.value = response.data
    }
    
    $q.notify({
      color: 'positive',
      icon: 'check',
      message: 'اطلاعات کاربر با موفقیت بروزرسانی شد' ,
      position:"top"
    })
  } catch (error) {
    console.error('Error updating user:', error)
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'خطا در بروزرسانی اطلاعات کاربر' ,
      position:"top"
    })
  }
}

//  Toggle user status (active/inactive)
const toggleUserStatus = async () => {
  if (!selectedUser.value) return
  
  try {
    const newStatus = selectedUser.value.status === 'active' ? 'inactive' : 'active'
    
    // // Create updated user object with new status
    // const updatedUser = {
    //   ...selectedUser.value,
    //   status: newStatus
    // }
    
    // Send PATCH request to update just the status
    const response = await axios.patch(
      `http://localhost:3000/Users/${selectedUser.value.id}`,
      { status: newStatus } ,
      console.log('Updating user' , response)
    )
    
    // Update local data
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index !== -1) {
      users.value[index].status = newStatus
      selectedUser.value.status = newStatus
    }
    
    $q.notify({
      color: 'info',
      icon: 'info',
      message: newStatus === 'active' ? 'کاربر با موفقیت فعال شد' : 'کاربر با موفقیت غیرفعال شد' ,
      position:'top'
    })
  } catch (error) {
    console.error('Error toggling user status:', error)
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'خطا در تغییر وضعیت کاربر',
      position:"top"
    })
  }
}

      const confirmDelete = () => {
        deleteDialogOpen.value = true
      }
  
      // Delete user
const deleteUser = async () => {
  if (!selectedUser.value) return
  
  try {
    // Send DELETE request
    await axios.delete(`http://localhost:3000/Users/${selectedUser.value.id}`)
    
    // Update local data
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
    
    selectedUser.value = null
    
    $q.notify({
      color: 'negative',
      icon: 'delete',
      message: 'کاربر با موفقیت حذف شد',
      position:"top"
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'خطا در حذف کاربر' ,
      position:'top'
    })
  }
}
  
      
  
      // Lifecycle hooks
      onMounted(() => {
        fetchUsers()
      })
  
      return {
        // State
        users,
        selectedUser,
        searchQuery,
        currentPage,
        itemsPerPage,
        editDialogOpen,
        deleteDialogOpen,
        editUserForm,
        
        // Computed
        filteredUsers,
        
        // Methods
        selectUser,
        closeUserDetails,
        formatPersianDate,
        translateRole,
        translateActivity,
        translateActivityDetails,
        getActivityIcon,
        getActivityColor,
        editUser,
        saveUserChanges,
        toggleUserStatus,
        confirmDelete,
        deleteUser,

      }
    }
  }
  </script>
  
  <style scoped>
  .user-list-card, .user-details-card {
    height: 100%;
  }
  
  .user-list-card {
    max-height: calc(100vh - 100px);
    overflow: auto;
  }
  
  /* RTL specific styles */
  .q-item__section--side {
    padding-right: 0;
    padding-left: 16px;
  }
  
  .q-timeline__entry--standard .q-timeline__subtitle {
    padding-right: 24px;
    padding-left: 0;
  }
  </style>