<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card flat class="contact-card q-pa-lg shadow-1" style="width: 100%">
      <q-card-section>
        <div class="text-center">

          <q-img
            src="/images/undraw_connected_0xor.svg"
            width="200px"
            height="auto"
            class="q-mb-md"
          ></q-img>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-center">
          <div class="text-subtitle1 text-weight-medium q-mb-sm">
            برای ارتباط با کارشناسان ما تماس بگیرید
          </div>
          <q-btn
            flat
            rounded
            color="primary"
            class="text-h6 q-py-sm q-px-md q-mb-md"
            label="۰۲۱-۱۲۳۴۵۶۷۸"
            type="a"
            icon-right="phone"
            href="tel:02112345678"
          />

          <div class="text-subtitle2 q-mt-md">
            <q-icon name="schedule" size="sm" class="q-ml-xs" />
            <span class="text-weight-medium">ساعات کاری:</span>
          </div>

          <div class="row justify-center q-mt-sm">
            <div class="col-auto q-mr-md q-px-lg">
              <div class="text-body2">شنبه تا چهارشنبه</div>
              <div class="text-body2 text-weight-medium">۸ صبح - ۵ عصر</div>
            </div>

            <div class="col-auto q-px-lg">
              <div class="text-body2">پنجشنبه‌ها</div>
              <div class="text-body2 text-weight-medium">۸ صبح - ۱ بعدازظهر</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
.contact-card {
  border-radius: 12px;
}
</style>
