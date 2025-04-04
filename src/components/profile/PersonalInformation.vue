<template>
  <q-card flat bordered class="header-card q-mb-md">
    <q-card-section>
      <div class="row justify-between items-center">
        <div class="column q-gutter-y-sm">
          <div class="row items-center">
            <q-avatar size="70px" class="q-mr-md">
              <img src="/images/user.png" alt="User avatar" />
              <q-badge floating color="green" v-if="personalInfo?.verified" icon="check" />
            </q-avatar>
            <div class="column q-mr-md">
              <div class="text-h6">{{ personalInfo?.username || 'کاربر گرامی' }}</div>
              <div class="text-subtitle2">{{ personalInfo?.phoneNumber }}</div>
            </div>
          </div>
        </div>
        <div class="balance-card text-center q-pa-sm q-pr-md">
          <div class="text-subtitle1 text-weight-bold">موجودی حساب</div>
          <div class="text-h6 text-primary q-my-sm">
            {{  formatCurrency(walletStore.balance) }} تومان
          </div>
          <q-btn
            unelevated
            outline
            color="primary"
            class="text-subtitle"
            label="افزایش موجودی"
            no-caps 
            @click="$emit('show-wallet')">
            <q-icon name="fa-solid fa-plus q-pr-sm"></q-icon>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-card flat bordered class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">اطلاعات شخصی</div>
      <q-btn flat round color="primary" icon="edit" @click="startEditing" v-if="!isEditing" />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" size="2em" />
      <div class="q-mt-sm">در حال بارگذاری اطلاعات...</div>
    </div>

    <!-- Status message -->
    <q-banner v-if="statusMessage.show" class="q-mb-md" :class="statusMessage.type">
      {{ statusMessage.text }}
      <template v-slot:action>
        <q-btn flat label="بستن" @click="statusMessage.show = false" />
      </template>
    </q-banner>

    <!-- View Mode -->
    <div v-else-if="!isEditing">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <div class="text-subtitle2 text-grey-7">نام</div>
          <div>{{ personalInfo?.firstname || '−' }}</div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-subtitle2 text-grey-7">نام خانوادگی</div>
          <div>{{ personalInfo?.lastname || '−' }}</div>
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="text-subtitle2 text-grey-7">کد ملی</div>
          <div>{{ personalInfo?.national_code || '−' }}</div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-subtitle2 text-grey-7">تاریخ تولد</div>
          <div>{{ formattedDOB || '−' }}</div>
        </div>
      </div>
      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <div class="text-subtitle2 text-grey-7">نام کاربری</div>
          <div>{{ personalInfo?.username || '−' }}</div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-subtitle2 text-grey-7">ایمیل</div>
          <div>{{ personalInfo?.email || '−' }}</div>
        </div>
      </div>
      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <div class="text-subtitle2 text-grey-7">جنسیت</div>
          <div>{{ genderText || '−' }}</div>
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <q-form @submit.prevent="saveChanges" v-else>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="editForm.firstname"
            label="نام"
            :rules="[
              (val) => val === null || val === '' || val.length >= 2 || 'نام باید حداقل ۲ حرف باشد',
            ]"
            filled
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="editForm.lastname"
            label="نام خانوادگی"
            :rules="[
              (val) =>
                val === null ||
                val === '' ||
                val.length >= 2 ||
                'نام خانوادگی باید حداقل ۲ حرف باشد',
            ]"
            filled
          />
        </div>
      </div>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="editForm.national_code"
            label="کد ملی"
            mask="##########"
            :rules="[
              (val) =>
                val === null ||
                val === '' ||
                (val.length === 10 && /^\d+$/.test(val)) ||
                'کد ملی باید ۱۰ رقم باشد',
            ]"
            filled
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input ref="dobRef" v-model="editForm.dob" label="تاریخ تولد" filled readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="editForm.dob"
                    mask="YYYY-MM-DD"
                    calendar="persian"
                    today-btn
                    minimal
                    first-day-of-week="6"
                  >
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn label="تایید" color="primary" flat v-close-popup />
                      <q-btn
                        label="انصراف"
                        color="grey"
                        flat
                        v-close-popup
                        @click="editForm.dob = tempDob"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="editForm.email"
            label="ایمیل"
            type="email"
            :rules="[
              (val) =>
                val === null ||
                val === '' ||
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
                'ایمیل نامعتبر است',
            ]"
            filled
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="editForm.gender"
            :options="genderOptions"
            label="جنسیت"
            filled
            emit-value
            map-options
            clearable
          />
        </div>
      </div>
      <div class="row justify-between q-gutter-sm w-full">
        <q-btn label="ذخیره" color="primary" type="submit" :loading="saving" />
        <q-btn label="انصراف" color="grey" flat @click="cancelEdit" :disabled="saving" />
      </div>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { date as quasarDate } from 'quasar'
import { useWalletStore } from 'src/stores/wallet'
const walletStore = useWalletStore()

const props = defineProps({
  personalInfo: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update-success', 'error' , 'show-wallet'])

// Refs
const dobRef = ref(null)
const tempDob = ref(null)

// State management
const isEditing = ref(false)
const loading = ref(false)
const saving = ref(false)
const statusMessage = reactive({
  show: false,
  text: '',
  type: 'bg-positive text-white', // default is success
})

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0'
  return Number(amount).toLocaleString('fa-IR')
}

const genderOptions = [
  { label: 'مرد', value: 1 },
  { label: 'زن', value: 2 },
  { label: 'سایر', value: 3 },
]

const genderText = computed(() => {
  if (!props.personalInfo?.gender) return '−'
  const genderMap = { 1: 'مرد', 2: 'زن', 3: 'سایر' }
  return genderMap[props.personalInfo.gender] || '−'
})

const editForm = reactive({
  firstname: '',
  lastname: '',
  national_code: '',
  dob: null,
  email: '',
  gender: null,
})
// Computed properties
const formattedDOB = computed(() => {
  if (!props.personalInfo?.dob) return null
  try {
    const dateofBirth = new Date(props.personalInfo.dob)
    return quasarDate.formatDate(dateofBirth, 'YYYY/MM/DD', { calendar: 'persian' })
  } catch (e) {
    console.error('Error formatting date:', e)
    return props.personalInfo.dob
  }
})

// Helper functions
function populateForm(data) {
  if (!data) return
  editForm.firstname = data.firstname ?? ''
  editForm.lastname = data.lastname ?? ''
  editForm.national_code = data.national_code ?? ''

  if (data.dob) {
    try {
      const dateOfBirth = new Date(data.dob)
      // Call the Quasar date utility:
      editForm.dob = quasarDate.formatDate(dateOfBirth, 'YYYY/MM/DD', { calendar: 'persian' })
    } catch (e) {
      console.error('Error formatting date for form:', e)
      editForm.dob = data.dob
    }
  } else {
    editForm.dob = null
  }

  editForm.email = data.email ?? ''

  // Handle gender
  if (data.gender) {
    if (typeof data.gender === 'string') {
      const genderValueMap = { male: 1, female: 2, other: 3 }
      editForm.gender = genderValueMap[data.gender] || null
    } else {
      editForm.gender = data.gender
    }
  } else {
    editForm.gender = null
  }

  tempDob.value = editForm.dob
}

function showMessage(text, type = 'success') {
  statusMessage.text = text
  statusMessage.type = type === 'success' ? 'bg-positive text-white' : 'bg-negative text-white'
  statusMessage.show = true
  setTimeout(() => {
    statusMessage.show = false
  }, 5000)
}

function cleanFormData(data) {
  const cleanedData = { ...data }
  for (const key in cleanedData) {
    if (cleanedData[key] === '') {
      cleanedData[key] = null
    }
  }
  return cleanedData
}

// Actions
const startEditing = () => {
  populateForm(props.personalInfo)
  isEditing.value = true
}

const cancelEdit = () => {
  populateForm(props.personalInfo)
  isEditing.value = false
  statusMessage.show = false
}

const saveChanges = async () => {
  saving.value = true
  const cleanedForm = cleanFormData({ ...editForm })

  try {
    console.log('Sending update from PersonalInfo:', cleanedForm)
    emit('update-success', cleanedForm) // Emit form data to parent for processing
    isEditing.value = false // Switch to view mode after emitting
  } catch (error) {
    console.error('Error in saveChanges:', error)
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.detail
      if (validationErrors && Array.isArray(validationErrors)) {
        const errorMessages = validationErrors.map((err) => `${err.loc[1]}: ${err.msg}`).join(', ')
        showMessage(`خطای اعتبارسنجی: ${errorMessages}`, 'error')
      } else {
        showMessage('اطلاعات وارد شده معتبر نیست.', 'error')
      }
    } else if (error.response?.status === 401) {
      showMessage('لطفا مجددا وارد سیستم شوید.', 'error')
    } else if (error.code === 'ERR_NETWORK') {
      showMessage('خطای شبکه. لطفا اتصال اینترنت خود را بررسی کنید.', 'error')
      emit('error', { type: 'network', message: 'خطای شبکه.' })
    } else {
      showMessage('خطا در بروزرسانی اطلاعات.', 'error')
    }
  } finally {
    saving.value = false
  }
}

// Lifecycle hooks
watch(
  () => props.personalInfo,
  (newValue) => {
    console.log('personalInfo updated in PersonalInfo:', newValue)
    if (newValue && !isEditing.value) {
      populateForm(newValue)
    }
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  if (props.personalInfo) {
    populateForm(props.personalInfo)
  }
  walletStore.fetchWalletData()
})
</script>
<style scoped>
.bg-positive {
  background-color: #21ba45;
}
.bg-negative {
  background-color: #c10015;
}
</style>
