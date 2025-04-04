// src/composables/useAuthDialog.js
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

export function useAuthDialog() {
  const showAuthDialog = ref(false);
  const redirectPath = ref('');
  const router = useRouter();
  const authStore = useAuthStore();

  const openAuthDialog = (path = '') => {
    if (authStore.isAuthenticated) {
      // If already authenticated, redirect directly
      if (path) router.push(path);
      return;
    }
    
    redirectPath.value = path;
    showAuthDialog.value = true;
  };

  const handleAuthSuccess = () => {
    if (redirectPath.value) {
      router.push(redirectPath.value);
    }
  };

  return {
    showAuthDialog,
    redirectPath,
    openAuthDialog,
    handleAuthSuccess
  };
}