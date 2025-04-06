// src/composables/useNumberFormatter.js


export function useNumberFormatter() {
  const toPersianNumber = (number) => {
    if (number === null || number === undefined) return '';
    
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return number.toString().replace(/[0-9]/g, function(w) {
      return persianDigits[+w];
    });
  };

  const toEnglishNumber = (str) => {
    if (!str) return '';
    
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    
    for (let i = 0; i < 10; i++) {
      str = str.replace(new RegExp(persianDigits[i], 'g'), i)
               .replace(new RegExp(arabicDigits[i], 'g'), i);
    }
    return str;
  };

  return {
    toPersianNumber,
    toEnglishNumber
  };
}