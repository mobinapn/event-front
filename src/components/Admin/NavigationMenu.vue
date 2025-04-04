<template>
    <q-list padding>
      <q-item to="/admin" exact clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="dashboard" />
        </q-item-section>
        <q-item-section>داشبورد</q-item-section>
      </q-item>
      
      <q-item to="/admin/events" clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="fa-regular fa-calendar-days" />
        </q-item-section>
        <q-item-section>مدیریت رویدادها</q-item-section>
      </q-item>
      
      <q-item to="/admin/users" clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="fa-solid fa-users" />
        </q-item-section>
        <q-item-section>مدیریت کاربران</q-item-section>
      </q-item>
      
      <q-item to="/admin/payments" clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="fa-solid fa-money-check" />
        </q-item-section>
        <q-item-section>مدیریت پرداخت‌ها</q-item-section>
      </q-item>
    </q-list>
  </template>
  
  <script setup>

  </script>