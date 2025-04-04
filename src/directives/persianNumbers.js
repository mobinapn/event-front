export default {
  beforeMount(el, binding) {
    el.textContent = binding.value.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  },
  updated(el, binding) {
    el.textContent = binding.value.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }
}
