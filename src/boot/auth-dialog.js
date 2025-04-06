// src/boot/auth-dialog.js
import { boot } from 'quasar/wrappers';
import AuthDialog from 'src/pages/AuthDialog.vue'; // Adjust path as needed

export default boot(({ app }) => {
  app.component('AuthDialog', AuthDialog);
});