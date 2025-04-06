<template>
    <q-page-container>
      <q-page >
        <!-- Search and Filter Bar -->
        <div class="row q-mb-md">
          <div class="col-12 col-md-6">
            <q-input 
              v-model="search" 
              
              dense 
              clearable
              outlined
              debounce="300"
              placeholder="جستجو در رویدادها..." 
              class="full-width"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6 q-pr-md q-pt-sm-xs q-pt-md-none">
            <div class="row justify-end text-primary">
              <q-btn flat label="رویداد جدید" icon="add" @click="openNewEventDialog" class="text-center" style="border: 1px solid #FF5A5F; border-radius: 10px;"/>
              
              </div>
          </div>
          </div>
        <!-- Events Table -->
        <q-table
          :rows="filteredEvents"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          class="events-table"
          :rows-per-page-options="[10, 20, 50]"
          binary-state-sort
          flat
          bordered
        >
          <template v-slot:top>
            <div class="text-h6 q-py-sm  full-width text-secondary q-px-md">فهرست رویدادها</div>
          </template>

          <template v-slot:body-cell-title="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-avatar size="40px" class="q-mr-sm">
                  <q-img :src="props.row.images?.main" />
                </q-avatar>
                <div class="text-weight-bold">{{ props.row.title }}</div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-date="props">
            <q-td :props="props">
              <div>{{ formatDate(props.row.start_date) }}</div>
              <div class="text-caption">تا {{ formatDate(props.row.end_date) }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-price="props">
            <q-td :props="props">
              <div>{{ formatPrice(props.row.price_per_adult) }} تومان</div>
              
            </q-td>
          </template>

          <template v-slot:body-cell-capacity="props">
            <q-td :props="props">
              <q-badge :color="getCapacityColor(props.row.capacity)">{{ props.row.capacity }} نفر</q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-sm">
              <q-btn icon="fa-solid fa-eye" color="teal-7" dense flat @click="viewEvent(props.row)">
                <q-tooltip>مشاهده</q-tooltip>
              </q-btn>
              <q-btn icon="fa-solid fa-pen-to-square" color="yellow-8" dense flat @click="editEvent(props.row)">
                <q-tooltip>ویرایش</q-tooltip>
              </q-btn>
              <q-btn 
                  icon="fa-solid fa-trash-can" 
                  dense 
                  flat 
                 color="gray-8"
                  @click="confirmDelete(props.row)"
                >
                  <q-tooltip>حذف</q-tooltip>
                </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-page>
    </q-page-container>

    <!-- View Event Dialog -->
    <q-dialog v-model="viewEventDialog" full-width>
  <q-card style="width: 90vw; max-width: 1200px;">
    <q-card-section class="primary-gradient text-white">
      <div class="text-h6">{{ selectedEvent?.title }}</div>
      <div class="text-subtitle2">{{ selectedEvent?.destination }}</div>
    </q-card-section>

    <q-card-section class="q-pa-md">
      <q-tabs
        v-model="viewTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <!-- Keep the same tab structure as edit dialog -->
        <q-tab name="basicInfo" label="اطلاعات پایه" icon="info" />
        <q-tab name="details" label="جزئیات" icon="list" />
        <q-tab name="accommodation" label="اقامت و حمل‌ونقل" icon="hotel" />
        <q-tab name="services" label="خدمات و قوانین" icon="room_service" />
        <q-tab name="itinerary" label="برنامه سفر" icon="map" />
        <q-tab name="images" label="تصاویر" icon="photo_library" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="viewTab" animated>
        <!-- Basic Info Tab -->
        <q-tab-panel name="basicInfo">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="selectedEvent.title"
                label="عنوان رویداد"
                outlined
                readonly
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="selectedEvent.destination"
                label="مقصد"
                outlined
                readonly
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedEvent.description"
                label="توضیحات"
                type="textarea"
                outlined
                autogrow
                readonly
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="selectedEvent.source" label="مبدأ" outlined readonly />
            </div>
            <div class="col-12 col-md-6">
             
              <q-select
              v-model="selectedEvent.categoryId"
              :options="categoryOption"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="دسته بندی"
              outlined
              />

            </div>
          </div>
        </q-tab-panel>

        <!-- Details Tab -->
        <q-tab-panel name="details">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 q-mb-sm">تاریخ ها</div>
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input v-model="selectedEvent.start_date" label="تاریخ شروع" outlined readonly />
                </div>
                <div class="col-6">
                  <q-input v-model="selectedEvent.end_date" label="تاریخ پایان" outlined readonly />
                </div>
              </div>
            </div>
            
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 q-mb-sm">مدت</div>
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input v-model="selectedEvent.duration.days" label="تعداد روز" outlined readonly />
                </div>
                <div class="col-6">
                  <q-input v-model="selectedEvent.duration.nights" label="تعداد شب" outlined readonly />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 q-mb-sm">ظرفیت</div>
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input v-model="selectedEvent.capacity" label="ظرفیت" outlined readonly />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 q-mb-sm">قیمت</div>
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input v-model="selectedEvent.price_per_adult" label="قیمت بزرگسال (تومان)" outlined readonly />
                </div>
                <div class="col-6">
                  <q-input v-model="selectedEvent.price_per_child" label="قیمت کودک (تومان)" outlined readonly />
                </div>
              </div>
            </div>
          </div>
          
        </q-tab-panel>

        <!-- Services & Rules Tab -->
        <q-tab-panel name="services">
          <div class="row q-col-gutter-md">
            <!-- Services Section -->
            <div class="col-12">
              <div class="text-subtitle1 q-mb-sm">خدمات</div>
              <div class="row q-col-gutter-sm">
                <div v-for="(service, index) in selectedEvent.services" :key="index" class="col-12 col-md-6 col-lg-4 q-mb-sm">
                  <q-chip color="primary" text-color="white" outline>
                    {{ service }}
                  </q-chip>
                </div>
              </div>
            </div>
            
            <!-- Meals Section -->
            <div class="col-12 q-mt-md">
              <div class="text-subtitle1 q-mb-sm">وعده‌های غذایی</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4">
                  <q-chip :color="selectedEvent?.meals?.breakfast ? 'positive' : 'grey'" text-color="white">
                    <q-icon :name="selectedEvent?.meals?.breakfast ? 'check' : 'close'" />
                    صبحانه
                  </q-chip>
                </div>
                <div class="col-12 col-md-4">
                  <q-chip :color="selectedEvent?.meals?.lunch ? 'positive' : 'grey'" text-color="white">
                    <q-icon :name="selectedEvent?.meals?.lunch ? 'check' : 'close'" />
                    نهار
                  </q-chip>
                </div>
                <div class="col-12 col-md-4">
                  <q-chip :color="selectedEvent?.meals?.dinner ? 'positive' : 'grey'" text-color="white">
                    <q-icon :name="selectedEvent?.meals?.dinner ? 'check' : 'close'" />
                    شام
                  </q-chip>
                </div>
                <div class="col-12">
                  <q-input 
                    v-model="selectedEvent.meals.details" 
                    label="توضیحات وعده‌های غذایی" 
                    outlined 
                    type="textarea" 
                    autogrow 
                    readonly
                  />
                </div>
              </div>
            </div>
            
            <!-- Rules Section -->
            <div class="col-12 q-mt-md">
              <div class="text-subtitle1 q-mb-sm">قوانین</div>
              <q-input 
                v-model="selectedEvent.rules" 
                label="قوانین و مقررات" 
                outlined 
                type="textarea" 
                autogrow 
                readonly
              />
            </div>
            
            <!-- Cancellation Policy -->
            <div class="col-12 q-mt-md">
              <div class="text-subtitle1 q-mb-sm">سیاست لغو رزرو</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4">
                  <q-card flat bordered>
                    <q-card-section class="bg-green-1">
                      <div class="text-subtitle1">بازپرداخت کامل</div>
                      <div>تا {{ selectedEvent?.cancellation_policy?.full_refund_days }} روز قبل از سفر</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-4">
                  <q-card flat bordered>
                    <q-card-section class="bg-orange-1">
                      <div class="text-subtitle1">بازپرداخت جزئی</div>
                      <div>{{ selectedEvent?.cancellation_policy?.partial_refund?.percentage }}% تا {{ selectedEvent?.cancellation_policy?.partial_refund?.days }} روز قبل از سفر</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-4">
                  <q-card flat bordered>
                    <q-card-section class="bg-red-1">
                      <div class="text-subtitle1">بدون بازپرداخت</div>
                      <div>کمتر از {{ selectedEvent?.cancellation_policy?.no_refund_days }} روز مانده به سفر</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>

        <!-- Accommodation Tab -->
        <q-tab-panel name="accommodation">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-subtitle1 q-mb-sm">اقامت</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="selectedEvent.accommodation.name" label="نام هتل" outlined readonly />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="selectedEvent.accommodation.stars" label="تعداد ستاره" outlined readonly />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="selectedEvent.accommodation.roomType" label="نوع اتاق" outlined readonly />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="selectedEvent.accommodation.address" label="آدرس هتل" outlined readonly />
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="text-subtitle1 q-mb-sm">حمل و نقل</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="selectedEvent.transportation.type" label="نوع وسیله نقلیه" outlined readonly />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="selectedEvent.transportation.details" label="جزئیات" outlined readonly />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="selectedEvent.transportation.departureTime" label="ساعت حرکت" outlined readonly />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="selectedEvent.transportation.returnTime" label="ساعت برگشت" outlined readonly />
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>

        <!-- Itinerary Tab -->
        <q-tab-panel name="itinerary">
          <div class="text-subtitle1 q-mb-sm">برنامه سفر</div>
          <q-timeline color="primary">
            <q-timeline-entry
              v-for="(day, index) in selectedEvent?.itinerary"
              :key="index"
              :title="day.title"
              :subtitle="`روز ${day.day}`"
              icon="event"
            >
              <div>{{ day.description }}</div>
              <q-list>
                <q-item v-for="(activity, actIndex) in day.activities" :key="actIndex">
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>{{ activity }}</q-item-section>
                </q-item>
              </q-list>
            </q-timeline-entry>
          </q-timeline>
        </q-tab-panel>
            <q-tab-panel name="images">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-img
                    :src="selectedEvent?.images.main"
                    spinner-color="primary"
                    style="height: 300px"
                  >
                    <div class="absolute-bottom text-subtitle1 text-center bg-transparent">
                      تصویر اصلی
                    </div>
                  </q-img>
                </div>
                
                <div v-for="(image, index) in selectedEvent?.images.gallery" 
                    :key="index" 
                    class="col-12 col-md-4">
                  <q-card flat bordered>
                    <q-img
                      :src="image.url"
                      :alt="image.alt"
                      spinner-color="primary"
                      style="height: 200px"
                    >
                      <div class="absolute-bottom text-subtitle2 text-center bg-dark">
                        {{ image.caption }}
                      </div>
                    </q-img>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="بستن" color="primary" v-close-popup />
          <q-btn flat label="ویرایش" color="secondary" @click="editFromView" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit/Create Event Dialog -->
    <q-dialog v-model="editEventDialog" full-width persistent>
      <q-card style="width: 90vw; max-width: 1200px;">
        <q-card-section class="primary-gradient text-white">
          <div class="text-h6">{{ isNewEvent ? 'ایجاد رویداد جدید' : 'ویرایش رویداد' }}</div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-form @submit="saveEvent" class="q-gutter-md">
            <q-tabs
              v-model="editTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
            >
              <q-tab name="basicInfo" label="اطلاعات پایه" icon="info" />
              <q-tab name="details" label="جزئیات" icon="list" />
              <q-tab name="accommodation" label="اقامت و حمل‌ونقل" icon="hotel" />
              <q-tab name="services" label="خدمات و قوانین" icon="room_service" />
              <q-tab name="itinerary" label="برنامه سفر" icon="map" />
              <q-tab name="images" label="تصاویر" icon="photo_library" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="editTab" animated>
              <!-- Basic Info Tab -->
              <q-tab-panel name="basicInfo">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="editedEvent.title"
                      label="عنوان رویداد *"
                      outlined
                      :rules="[val => !!val || 'عنوان الزامی است']"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="editedEvent.destination"
                      label="مقصد *"
                      outlined
                      :rules="[val => !!val || 'مقصد الزامی است']"
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="editedEvent.description"
                      label="توضیحات *"
                      type="textarea"
                      outlined
                      autogrow
                      :rules="[val => !!val || 'توضیحات الزامی است']"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="editedEvent.source" label="مبدأ *" outlined :rules="[val => !!val || 'مبدأ الزامی است']" />
                  </div>
                  <div class="col-12 col-md-6">
                    <!-- <q-input v-model="editedEvent.categoryId" placeholder="0" label="دسته بندی *" type="number" outlined :rules="[val => val > 0 || 'ظرفیت باید بیشتر از صفر باشد']" /> -->
                      <q-select
                      v-model="editedEvent.categoryId"
                      :options="categoryOption"
                      option-label="label"
                      option-value="value"
                      map-options
                      label="دسته بندی"
                      outlined
                    />
                  </div>
                </div>
              </q-tab-panel>

              <!-- Details Tab -->
              <q-tab-panel name="details">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <div class="text-subtitle1 q-mb-sm">تاریخ ها</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-6">
                        <q-input 
                          v-model="editedEvent.start_date" 
                          label="تاریخ شروع *" 
                          outlined 
                          readonly
                          :rules="[val => !!val || 'تاریخ شروع الزامی است']"
                        >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date 
                                  v-model="editedEvent.start_date" 
                                  mask="YYYY-MM-DD" 
                                  :calendar="'persian'"
                                  today-btn
                                >
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="تایید" color="primary" flat />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                      <div class="col-6">
                        <q-input 
                          v-model="editedEvent.end_date" 
                          label="تاریخ پایان *" 
                          outlined 
                          readonly
                          :rules="[val => !!val || 'تاریخ پایان الزامی است']"
                        >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date 
                                  v-model="editedEvent.end_date" 
                                  mask="YYYY-MM-DD" 
                                  :calendar="'persian'"
                                  today-btn
                                >
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="تایید" color="primary" flat />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-12 col-md-6">
                    <div class="text-subtitle1 q-mb-sm">مدت</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-6">
                        <q-input v-model="editedEvent.duration.days" label="تعداد روز *" outlined type="number" :rules="[val => val > 0 || 'تعداد روز باید بیشتر از صفر باشد']" />
                      </div>
                      <div class="col-6">
                        <q-input v-model="editedEvent.duration.nights" label="تعداد شب *" outlined type="number" :rules="[val => val > 0 || 'تعداد شب باید بیشتر از صفر باشد']" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="text-subtitle1 q-mb-sm">ظرفیت</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-6">
                        <q-input v-model="editedEvent.capacity" label=" ظرفیت *" outlined type="number" :rules="[val => val > 0 || 'تعداد روز باید بیشتر از صفر باشد']" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="text-subtitle1 q-mb-sm">قیمت</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-6">
                        <q-input v-model="editedEvent.price_per_adult" label="قیمت بزرگسال (تومان) *" outlined type="number" :rules="[val => val > 0 || 'قیمت باید بیشتر از صفر باشد']" />
                      </div>
                      <div class="col-6">
                        <q-input v-model="editedEvent.price_per_child" label="قیمت کودک (تومان) *" outlined type="number" :rules="[val => val > 0 || 'قیمت باید بیشتر از صفر باشد']" />
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
                           <!-- New Services & Rules Tab -->
                           <q-tab-panel name="services">
                <div class="row q-col-gutter-md">
                  <!-- Services Section -->
                  <div class="col-12">
                    <div class="text-subtitle1 q-mb-sm">خدمات</div>
                    <div class="row q-col-gutter-sm">
                      <div v-for="(service, index) in editedEvent.services" :key="index" class="col-12 col-md-6 col-lg-4 q-mb-sm">
                        <div class="row q-col-gutter-sm">
                          <div class="col-10">
                            <q-input v-model="editedEvent.services[index]" label="خدمت" outlined dense />
                          </div>
                          <div class="col-2">
                            <q-btn icon="delete" color="negative" @click="removeService(index)" flat dense />
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <q-btn label="افزودن خدمت" color="primary" @click="addService" icon="add" flat />
                      </div>
                    </div>
                  </div>
                                    
                  <!-- Meals Section -->
                  <div class="col-12 q-mt-md">
                    <div class="text-subtitle1 q-mb-sm">وعده‌های غذایی</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-4">
                        <q-checkbox v-model="editedEvent.meals.breakfast" label="صبحانه" />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-checkbox v-model="editedEvent.meals.lunch" label="نهار" />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-checkbox v-model="editedEvent.meals.dinner" label="شام" />
                      </div>
                      <div class="col-12">
                        <q-input 
                          v-model="editedEvent.meals.details" 
                          label="توضیحات وعده‌های غذایی" 
                          outlined 
                          type="textarea" 
                          autogrow 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <!-- Rules Section -->
                  <div class="col-12 q-mt-md">
                    <div class="text-subtitle1 q-mb-sm">قوانین</div>
                    <q-input 
                      v-model="editedEvent.rules" 
                      label="قوانین و مقررات" 
                      outlined 
                      type="textarea" 
                      autogrow 
                    />
                  </div>
                  
                  <!-- Cancellation Policy -->
                  <div class="col-12 q-mt-md">
                    <div class="text-subtitle1 q-mb-sm">سیاست لغو رزرو</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-4">
                        <q-input 
                          v-model="editedEvent.cancellation_policy.full_refund_days" 
                          label="تعداد روز برای بازپرداخت کامل" 
                          outlined 
                          type="number" 
                          min="0"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-input 
                          v-model="editedEvent.cancellation_policy.partial_refund.days" 
                          label="تعداد روز برای بازپرداخت جزئی" 
                          outlined 
                          type="number"
                          min="0" 
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-input 
                          v-model="editedEvent.cancellation_policy.partial_refund.percentage" 
                          label="درصد بازپرداخت جزئی" 
                          outlined 
                          type="number"
                          min="0"
                          max="100" 
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-input 
                          v-model="editedEvent.cancellation_policy.no_refund_days" 
                          label="تعداد روز بدون بازپرداخت" 
                          outlined 
                          type="number"
                          min="0" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
              <!-- Accommodation Tab -->
              <q-tab-panel name="accommodation">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-subtitle1 q-mb-sm">اقامت</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-6">
                        <q-input v-model="editedEvent.accommodation.name" label="نام هتل *" outlined :rules="[val => !!val || 'نام هتل الزامی است']" />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input v-model="editedEvent.accommodation.stars" label="تعداد ستاره *" outlined type="number" :rules="[val => val > 0 || 'تعداد ستاره باید بیشتر از صفر باشد']" />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input v-model="editedEvent.accommodation.roomType" label="نوع اتاق *" outlined :rules="[val => !!val || 'نوع اتاق الزامی است']" />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input v-model="editedEvent.accommodation.address" label="آدرس هتل *" outlined :rules="[val => !!val || 'آدرس هتل الزامی است']" />
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="text-subtitle1 q-mb-sm">حمل و نقل</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-6">
                        <q-input v-model="editedEvent.transportation.type" label="نوع وسیله نقلیه *" outlined :rules="[val => !!val || 'نوع وسیله نقلیه الزامی است']" />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input v-model="editedEvent.transportation.details" label="جزئیات" outlined />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input v-model="editedEvent.transportation.departureTime" label="ساعت حرکت" outlined />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input v-model="editedEvent.transportation.returnTime" label="ساعت برگشت" outlined />
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>

              <!-- Itinerary Tab -->
              <q-tab-panel name="itinerary">
                <div class="text-subtitle1 q-mb-sm">برنامه سفر</div>
                <div v-for="(day, index) in editedEvent.itinerary" :key="index" class="q-mb-md">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="row q-col-gutter-md">
                        <div class="col-12">
                          <div class="text-subtitle1">روز {{ day.day }}</div>
                        </div>
                        <div class="col-12 col-md-6">
                          <q-input v-model="day.title" label="عنوان" outlined />
                        </div>
                        <div class="col-12">
                          <q-input v-model="day.description" label="توضیحات" outlined type="textarea" autogrow />
                        </div>
                        <div class="col-12">
                          <div class="text-subtitle2 q-mb-sm">فعالیت‌ها</div>
                          <div v-for="(activity, actIndex) in day.activities" :key="actIndex" class="row q-col-gutter-sm q-mb-sm">
                            <div class="col-10">
                              <q-input v-model="day.activities[actIndex]" label="فعالیت" outlined dense />
                            </div>
                            <div class="col-2">
                              <q-btn icon="delete" color="negative" @click="removeActivity(day, actIndex)" flat dense />
                            </div>
                          </div>
                          <q-btn label="افزودن فعالیت" color="primary" @click="addActivity(day)" icon="add" flat />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="row justify-center q-mt-md">
                  <q-btn label="افزودن روز جدید" color="primary" @click="addDay" icon="add" />
                </div>
              </q-tab-panel>

              <!-- Images Tab -->
              <q-tab-panel name="images">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-subtitle1 q-mb-sm">تصویر اصلی</div>
                    <q-input v-model="editedEvent.images.main" label="آدرس تصویر اصلی" outlined />
                    <q-file
                      v-model="mainImageFile"
                      label="آپلود تصویر اصلی"
                      outlined
                      class="q-mt-sm"
                      accept=".jpg, .png, .jpeg"
                    >
                      <template v-slot:append>
                        <q-icon name="cloud_upload" />
                      </template>
                    </q-file>
                    <q-img
                      v-if="editedEvent.images.main"
                      :src="editedEvent.images.main"
                      style="max-height: 200px; max-width: 100%;"
                      class="q-mt-sm"
                    />
                  </div>
                  
                  <div class="col-12 q-mt-md">
                    <div class="text-subtitle1 q-mb-sm">گالری تصاویر</div>
                    <div v-for="(image, index) in editedEvent.images.gallery" :key="index" class="q-mb-md">
                      <q-card flat bordered>
                        <q-card-section>
                          <div class="row q-col-gutter-md">
                            <div class="col-12 col-md-6">
                              <q-input v-model="image.url" label="آدرس تصویر" outlined />
                            </div>
                            <div class="col-12 col-md-6">
                              <q-input v-model="image.alt" label="متن جایگزین" outlined />
                            </div>
                            <div class="col-12">
                              <q-input v-model="image.caption" label="عنوان تصویر" outlined />
                            </div>
                            <div class="col-12">
                              <q-img
                                v-if="image.url"
                                :src="image.url"
                                style="max-height: 150px; max-width: 100%;"
                                class="q-mt-sm"
                              />
                            </div>
                          </div>
                        </q-card-section>
                        <q-card-actions align="right">
                          <q-btn color="negative" flat icon="delete" label="حذف تصویر" @click="removeImage(index)" />
                        </q-card-actions>
                      </q-card>
                    </div>
                    <div class="row justify-center q-mt-md">
                      <q-btn label="افزودن تصویر جدید" color="primary" @click="addImage" icon="add" />
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>

            <div class="row justify-end q-mt-lg">
              <q-btn label="انصراف" color="grey" flat v-close-popup />
              <q-btn label="ذخیره" type="submit" color="primary" class="q-mr-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center bg-negative text-white">
          <q-avatar icon="delete" text-color="white" />
          <span class="text-h6 q-mr-sm">حذف رویداد</span>
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <p>آیا از حذف رویداد "{{ selectedEvent?.title }}" اطمینان دارید؟</p>
          <p class="text-caption text-grey">این عملیات غیرقابل بازگشت است.</p>
        </q-card-section>

        <q-card-actions align="left">
          <q-btn flat label="انصراف" color="primary" v-close-popup />
          <q-btn flat label="حذف" color="negative" @click="deleteEvent" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useDateFormatter } from 'src/composables/useDateFormatter';
import axios from 'axios';

const $q = useQuasar();
const search = ref('');
const events = ref([]);
const loading = ref(true);
const viewEventDialog = ref(false);
const editEventDialog = ref(false);
const deleteDialog = ref(false);
const selectedEvent = ref(null);
const viewTab = ref('basicInfo');
const editTab = ref('basicInfo');
const isNewEvent = ref(false);
const mainImageFile = ref(null);
const editedEvent = ref({});
const filterDestination = ref(null);
const filterDate = ref(null);
const pagination = ref({
  rowsPerPage: 10,
  sortBy: 'title',
  descending: false
});
const { formatPersianDisplay } = useDateFormatter();

// Table columns definition
const columns = [
  { name: 'title', required: true, label: 'عنوان', align: 'right', field: 'title', sortable: true },
  { name: 'destination', label: 'مقصد', align: 'right', field: 'destination', sortable: true },
  { name: 'date', label: 'تاریخ', align: 'right', field: 'start_date', sortable: true },
  { name: 'price', label: 'قیمت', align: 'right', field: row => row.price_per_adult, sortable: true },
  { name: 'capacity', label: 'ظرفیت', align: 'right', field: 'capacity', sortable: true },
  { name: 'actions', label: 'عملیات', align: 'center' }
];
const categoryOption = ref([
  { label: 'تورهای تاریخی', value: 3 },
  { label: 'تورهای سیاحتی', value: 5 },
  { label: 'تورهای زیارتی', value: 4 },
  { label: 'تورهای فرهنگی', value: 2 },
  { label: 'تورهای گردشگری', value: 1 },
]);


// Computed property for filtered events
const filteredEvents = computed(() => {
  let result = events.value;
  
  // Apply search
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    result = result.filter(event => 
      event.title.toLowerCase().includes(searchLower) || 
      event.destination.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply destination filter
  if (filterDestination.value) {
    result = result.filter(event => event.destination === filterDestination.value);
  }
  
  // Apply date filter if needed
  if (filterDate.value && filterDate.value.from && filterDate.value.to) {
    result = result.filter(event => 
      event.start_date >= filterDate.value.from && 
      event.end_date <= filterDate.value.to
    );
  }
  
  return result;
});

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  if (!dateString) return '';
  return formatPersianDisplay(dateString);
};

// Format price function
const formatPrice = (price) => {
  if (!price) return '0';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Get color for capacity badge
const getCapacityColor = (capacity) => {
  if (capacity > 20) return 'positive';
  if (capacity > 10) return 'warning';
  return 'negative';
};


// View event details
const viewEvent = (event) => {
  selectedEvent.value = event;
  viewEventDialog.value = true;
  viewTab.value = 'basicInfo';
};

// Edit event
const editEvent = (event) => {
  selectedEvent.value = event;
  editedEvent.value = JSON.parse(JSON.stringify(event)); // Deep copy
  isNewEvent.value = false;
  editEventDialog.value = true;
  editTab.value = 'basicInfo';
  if (typeof editedEvent.value.categoryId === 'number') {
    const category = categoryOption.value.find(c => c.value === editedEvent.value.categoryId);
    if (category) {
      editedEvent.value.categoryId = category;
    }
  }
};

// Add new service
const addService = () => {
  if (!editedEvent.value.services) {
    editedEvent.value.services = [];
  }
  editedEvent.value.services.push('');
};

// Remove service
const removeService = (index) => {
  editedEvent.value.services.splice(index, 1);
};

// Create new event
const openNewEventDialog = () => {
  isNewEvent.value = true;
  editedEvent.value = {
    id: events.value.length + 1,
    title: '',
    description: '',
    destination: '',
    source: '',
    start_date: '',
    end_date: '',
    price_per_adult: '',
    price_per_child: '',
    duration: {days: '', nights: ''},
    discount: { percentage: 0, expires_at: '' },
    capacity: '',
    categoryId : '' ,
    transportation: { type: '', details: '', departureTime: '', returnTime: '' },
    accommodation: { name: '', stars: '', roomType: '', address: '', amenities: [] },
    meals: { breakfast: false, lunch: false, dinner: false, details: '' },
    images: { main: '', gallery: [] },
    itinerary: [{ day: 1, title: '', description: '', activities: [] }],
    services: [],
    rules: '',
    cancellation_policy: { 
      full_refund_days: 7, 
      partial_refund: { days: 3, percentage: 50 }, 
      no_refund_days: 1 
    }
  };
  editEventDialog.value = true;
  editTab.value = 'basicInfo';
};

// Edit from view dialog
const editFromView = () => {
  viewEventDialog.value = false;
  editEvent(selectedEvent.value);
};

// Confirm delete
const confirmDelete = (event) => {
  selectedEvent.value = event;
  deleteDialog.value = true;
};

const deleteEvent = async () => {
  try {
    await axios.delete(`https://json-server-production-de66.up.railway.app/events/${String(selectedEvent.value.id)}`);
    
    // Convert IDs to strings for correct comparison
    events.value = events.value.filter(e => String(e.id) !== String(selectedEvent.value.id));

    $q.notify({
      color: 'negative',
      position: 'top',
      message: `رویداد "${selectedEvent.value.title}" با موفقیت حذف شد.`,
      icon: 'delete'
    });
    
    deleteDialog.value = false;
  } catch (error) {
    console.error("Error deleting event:", error);
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'خطا در حذف رویداد',
      icon: 'error'
    });
  }
};



const prepareEventForSave = (event) => {
  const preparedEvent = JSON.parse(JSON.stringify(event)); // Create a deep copy
  
  // Convert categoryId to integer if it's an object
  if (preparedEvent.categoryId && typeof preparedEvent.categoryId === 'object') {
    preparedEvent.categoryId = preparedEvent.categoryId.value;
  }
  
  return preparedEvent;
};

// Save event
const saveEvent = async () => {
  try {
    const eventToSave = prepareEventForSave(editedEvent.value);

    if (isNewEvent.value) {
      // Creating a new event (use POST)
      const response = await axios.post(`https://json-server-production-de66.up.railway.app/events`, eventToSave);
      
      // Convert ID to string before adding to the list
      response.data.id = String(response.data.id);
      events.value.push(response.data);

      $q.notify({
        color: 'positive',
        position: 'top',
        message: 'رویداد جدید با موفقیت ایجاد شد.',
        icon: 'check_circle'
      });
    } else {
      // Updating an existing event (use PUT)
      const response = await axios.put(`https://json-server-production-de66.up.railway.app/events/${eventToSave.id}`, eventToSave);

      // Convert ID to string
      response.data.id = String(response.data.id);
      
      const index = events.value.findIndex(e => e.id === String(eventToSave.id));
      if (index !== -1) {
        events.value[index] = response.data;
      }

      $q.notify({
        color: 'positive',
        position: 'top',
        message: 'رویداد با موفقیت بروزرسانی شد.',
        icon: 'check_circle'
      });
    }

    editEventDialog.value = false;
  } catch (error) {
    console.error("Error saving event:", error);
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'خطا در ذخیره‌سازی رویداد',
      icon: 'error'
    });
  }
};

// Add new day to itinerary
const addDay = () => {
  if (!editedEvent.value.itinerary) {
    editedEvent.value.itinerary = [];
  }
  
  const newDayNumber = editedEvent.value.itinerary.length + 1;
  editedEvent.value.itinerary.push({
    day: newDayNumber,
    title: `روز ${newDayNumber}`,
    description: '',
    activities: []
  });
};

// Add activity to a day
const addActivity = (day) => {
  if (!day.activities) {
    day.activities = [];
  }
  day.activities.push('');
};

// Remove activity
const removeActivity = (day, index) => {
  day.activities.splice(index, 1);
};

// Add image to gallery
const addImage = () => {
  if (!editedEvent.value.images.gallery) {
    editedEvent.value.images.gallery = [];
  }
  
  editedEvent.value.images.gallery.push({
    url: '',
    alt: '',
    caption: ''
  });
};

// Remove image from gallery
const removeImage = (index) => {
  editedEvent.value.images.gallery.splice(index, 1);
};

// Fetch events (in a real app, this would be an API call)
const fetchEvents = async () => {
  loading.value = true;
  
  try {
    const response = await axios.get('https://json-server-production-de66.up.railway.app/events');

    // Convert all event IDs to strings
    events.value = response.data.map(event => ({
      ...event,
      id: String(event.id) // Force ID to be a string
    }));

    console.log("Fetched events:", events.value);
  } catch (error) {
    console.error("Error fetching events:", error);
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'خطا در دریافت اطلاعات رویدادها',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};



// Fetch events on component mounted
onMounted(() => {
  fetchEvents();
});
</script>

<style>
.primary-gradient {
  background: linear-gradient(135deg, #FF5A5F 0%, #e65358 100%);
  border-radius: 8px;
}
.events-table {
  border-radius: 8px;
  overflow: hidden;
}
</style>