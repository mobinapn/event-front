<!-- <template>
  <router-view />
</template>

<script setup>
//
</script> -->
<template>
  <q-layout>
    <!-- Your layout content -->
    <router-view />
    
    <!-- Global auth dialog -->
    <AuthDialog 
      v-model:isOpen="authDialog.showAuthDialog" 
      :redirectPath="authDialog.redirectPath"
      @auth-success="authDialog.handleAuthSuccess" 
    />
  </q-layout>
</template>

<script setup>
import { provide } from 'vue';
import { useAuthDialog } from 'src/composables/useAuthDialog';

const authDialog = useAuthDialog();

// Provide the auth dialog functionality to all child components
provide('authDialog', authDialog);
</script>