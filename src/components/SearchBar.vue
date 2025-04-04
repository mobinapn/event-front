<!-- search-bar -->
<template>
  <div class="search-container" dir="rtl">
    <q-card class="search-bar" bordered>
      <div class="row no-wrap items-center">
        <!-- Location Search -->
        <div class="search-section cursor-pointer">
          <q-input v-model="search.location" placeholder="مقصد" borderless class="search-input" />
        </div>

        <q-separator vertical inset class="separator" />

        <!-- Check-in Date -->
        <div class="search-section cursor-pointer" @click="showDatePicker = true">
          <div class="search-label">تاریخ ورود</div>
          <div class="search-text" :class="{ 'has-value': search.checkIn }">
            {{ search.checkIn || 'اضافه کنید' }}
          </div>
        </div>

        <q-separator vertical inset class="separator" />

        <!-- Guests -->
        <div class="search-section cursor-pointer" @click="showGuestsDialog = true">
          <div class="search-label">مهمان‌ها</div>
          <div class="search-text" :class="{ 'has-value': totalGuests > 0 }">
            {{ totalGuests > 0 ? `${totalGuests} مهمان` : 'اضافه کنید' }}
          </div>
        </div>

        <!-- Search Button -->
        <div class="search-button">
          <q-btn round color="primary" icon="search" size="md" @click="handleSearch">
            <q-tooltip>جستجو</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card>

    <!-- Date Picker Dialog -->
    <q-dialog v-model="showDatePicker">
      <q-card class="date-picker-card">
        <q-card-section class="row items-center">
          <div class="text-h6">انتخاب تاریخ</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-date
            v-model="CheckInshow"
            today-btn
            color="primary"
            calendar="persian"
            mask="YYYY/MM/DD"
            :locale="faLocale"
            class="full-width"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Guests Dialog -->
    <q-dialog v-model="showGuestsDialog">
      <q-card class="guests-dialog">
        <q-card-section>
          <div class="text-h6">مهمان‌ها</div>
        </q-card-section>

        <q-card-section>
          <div class="row items-center q-py-md">
            <div class="col">
              <div class="text-subtitle1">بزرگسالان</div>
              <div class="text-caption text-grey">۱۳ سال به بالا</div>
            </div>
            <div class="col-auto">
              <q-btn-group flat>
                <q-btn
                  round
                  flat
                  dense
                  icon="remove"
                  @click="updateGuests('adults', -1)"
                  :disable="search.guests.adults <= 0"
                />
                <q-btn flat dense class="q-px-md">{{ search.guests.adults }}</q-btn>
                <q-btn round flat dense icon="add" @click="updateGuests('adults', 1)" />
              </q-btn-group>
            </div>
          </div>

          <div class="row items-center q-py-md">
            <div class="col">
              <div class="text-subtitle1">کودکان</div>
              <div class="text-caption text-grey">۲ تا ۱۲ سال</div>
            </div>
            <div class="col-auto">
              <q-btn-group flat>
                <q-btn
                  round
                  flat
                  dense
                  icon="remove"
                  @click="updateGuests('children', -1)"
                  :disable="search.guests.children <= 0"
                />
                <q-btn flat dense class="q-px-md">{{ search.guests.children }}</q-btn>
                <q-btn round flat dense icon="add" @click="updateGuests('children', 1)" />
              </q-btn-group>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat color="primary" label="تایید" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  padding: 0 16px;
}

.search-bar {
  border-radius: 40px !important;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.search-bar:hover {
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
}

.search-section {
  padding: 8px 24px;
  min-width: 120px;
  flex: 1;
}

.search-label {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 4px;
  color: #222222;
}

.search-text {
  color: #717171;
  font-size: 14px;
}

.search-input :deep(.q-field__native) {
  padding: 0;
  font-size: 14px;
}

.search-input :deep(.q-field__control) {
  min-height: unset !important;
}

.has-value {
  color: #222222;
}

.search-button {
  padding: 8px 16px;
}

.search-button .q-btn {
  background: #ff385c;
  color: white;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .search-container {
    padding: 0 8px;
  }

  .search-section {
    padding: 8px 16px;
    min-width: 100px;
  }

  .search-label {
    font-size: 11px;
  }

  .search-text {
    font-size: 13px;
  }
}

@media (max-width: 600px) {
  .search-bar {
    border-radius: 24px !important;
  }

  .search-section {
    padding: 8px 12px;
    min-width: 80px;
  }
}

/* Dialog Styles */
.date-picker-card,
.guests-dialog {
  min-width: 320px;
  border-radius: 12px;
}

:deep(.q-date) {
  border-radius: 12px;
}
</style>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const search = ref({
  location: '',
  checkIn: '',
  guests: {
    adults: 0,
    children: 0,
  },
})
const router = useRouter()

const showDatePicker = ref(false)
const showGuestsDialog = ref(false)
const CheckInshow = ref(null)


const faLocale = {
  days: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'],
  daysShort: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
  months: [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ],
  monthsShort: ['فر', 'ار', 'خر', 'تی', 'مر', 'شه', 'مه', 'آب', 'آذ', 'دی', 'به', 'اس'],
}

const totalGuests = ref(0)

const updateGuests = (type, change) => {
  ;(search.value.guests[type] = Math.max(0, search.value.guests[type] + change)),
    (totalGuests.value = search.value.guests.adults + search.value.guests.children)
}

const handleSearch = () => {
  const params = {
    destination :search.value.location ,
    start_date : search.value.checkIn ,
    // capacity : totalGuests
  }
  console.log('Search params:', params)
  router.push({ path: '/search-results', query: params })
}

watch(CheckInshow, (newValue) => {
  if (newValue) {
    search.value.checkIn = newValue
    showDatePicker.value = false
  }
})
</script>
