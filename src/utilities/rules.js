export function istenValue(value) {
    if(!value) return " کد ملی الزامی است"
    return value && value.length === 10 || "  کد ملی باید 10 عدد باشد";
  }


  export function validation(v) {
    return !!v || "این قسمت الزامی است";
  }


  export function mobileNumber(value) {
    if (!value) return " شماره موبایل نباید خالی باشد"
    return /^09\d{9}$/.test(value) || "شماره موبایل نامعتبر است";
  }
  
  export function passwordRules(password) {
    if (!password) return "رمز عبور نباید خالی باشد";
    if (password.length < 6) return "رمز عبور باید حداقل ۶ کاراکتر باشد";
    if (!/[a-zA-Z]/.test(password)) return "رمز عبور باید شامل حروف باشد";
    if (!/\d/.test(password)) return "رمز عبور باید شامل عدد باشد";
    return true; // Passes all rules
  }
  

  export const rules = {
    istenValue ,
    validation ,
    mobileNumber ,
    passwordRules 
  };