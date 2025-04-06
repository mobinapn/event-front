export function toPersianNumbers(value) {
    if (!value) return '';
    return value.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }
  