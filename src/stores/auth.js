import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(localStorage.getItem("token") || null);
    const user = ref(JSON.parse(localStorage.getItem("user") || null));
    const router = useRouter();
    const username = computed(() => {
        if (user.value && user.value.username) {
            return user.value.username;
        }
        // Check if username is stored separately as a fallback
        return localStorage.getItem("username") || '';
    });


    // New error handling reactive state
    const loginError = ref(null);
    const registerError = ref(null);

    const isAuthenticated = computed(() => !!token.value);
    const userRole = computed(() => {
        return user.value?.role || localStorage.getItem("role") || "guest";
    });
    
    async function login(formData) {
        loginError.value = null;
    
        try {
            const data = new URLSearchParams();
            data.append("grant_type", "password");
            data.append("username", formData.username);
            data.append("password", formData.password);
            const response = await api.post('/auth/token', data, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            const responseData = response.data;
            console.log('DEBUG: responseData:', responseData)       // ← Add this
            console.log('DEBUG: responseData.user:', responseData.user) // ← And this
            token.value = responseData.access_token;
            localStorage.setItem("token", responseData.access_token);
    
            const userResponse = await api.get('/profile', {
                headers: { Authorization: `Bearer ${token.value}` },
              });
        
              user.value = userResponse.data;
              localStorage.setItem("user", JSON.stringify(user.value));
            // Store user info
            if (responseData.user) {
                user.value = responseData.user;
                localStorage.setItem("user", JSON.stringify(responseData.user));
                localStorage.setItem("role", responseData.user.role); // Save role
                localStorage.setItem("username", responseData.user.username);
            }
            
            username.value = formData.username;
            localStorage.setItem("username", formData.username);
            //  Save attempted route but redirect to OTP first
            localStorage.setItem('attemptedRoute', localStorage.getItem('attemptedRoute') || "/"); 
            // router.push('/OTP'); // Redirect to OTP page first
    
        } catch (error) {
            // Detailed error handling
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        loginError.value = "نام کاربری یا رمز عبور اشتباه است";
                        break;
                    case 403:
                        loginError.value = "دسترسی غیر مجاز";
                        break;
                    case 500:
                        loginError.value = "مشکل در سرور. لطفاً بعداً تلاش کنید";
                        break;
                    default:
                        loginError.value = "خطای نامشخص. لطفاً دوباره تلاش کنید";
                }
            } else if (error.request) {
                loginError.value = "مشکل در ارتباط با سرور. اتصال اینترنت را بررسی کنید";
            } else {
                loginError.value = "خطای غیرمنتظره رخ داده است";
            }
            
            // Re-throw to allow component to handle if needed
            throw error;
        }
    }

    async function register(formData) {
        // Reset previous errors
        registerError.value = null;

        try {
            // Step 1: Register the user
            const registerResponse = await api.post('/auth/register', {
                username: formData.username,
                password: formData.password
            });

            // Step 2: After successful registration, automatically login
            try {
                // Use same format as login endpoint expects
                const data = new URLSearchParams();
                data.append("grant_type", "password");
                data.append("username", formData.username);
                data.append("password", formData.password);
                
                const loginResponse = await api.post('/auth/token', data, {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                });

                // Handle login response and set token
                const responseData = loginResponse.data;
                token.value = responseData.access_token;
                localStorage.setItem("token", responseData.access_token);
                
                // Get user profile with the new token
                const userResponse = await api.get('/profile', {
                    headers: { Authorization: `Bearer ${token.value}` },
                });
            
                user.value = userResponse.data;
                localStorage.setItem("user", JSON.stringify(user.value));
                
                // Store additional user info if available
                if (responseData.user) {
                    user.value = responseData.user;
                    localStorage.setItem("user", JSON.stringify(responseData.user));
                    localStorage.setItem("role", responseData.user.role); 
                    localStorage.setItem("username", responseData.user.username);
                } else {
                    username.value = formData.username;
                    localStorage.setItem("username", formData.username);
                }
                
                // Save attempted route for redirection
                localStorage.setItem('attemptedRoute', localStorage.getItem('attemptedRoute') || "/");
                
                // Return combined data
                return {
                    registration: registerResponse.data,
                    auth: responseData
                };
                
            } catch (loginError) {
                console.log(loginError)
                // If auto-login fails, still return registration data but add a notice
                registerError.value = "ثبت نام موفق اما ورود خودکار با مشکل مواجه شد";
                return {
                    registration: registerResponse.data,
                    authError: "Failed to auto-login after registration"
                };
            }
        } catch (error) {
            // Improved error handling for registration
            if (error.response) {
                switch (error.response.status) {
                    case 409:
                        registerError.value = "نام کاربری از قبل موجود است";
                        break;
                    case 400:
                        registerError.value = "اطلاعات ورودی نامعتبر است";
                        break;
                    case 500:
                        registerError.value = "مشکل در سرور. لطفاً بعداً تلاش کنید";
                        break;
                    default:
                        registerError.value = "ثبت نام با خطا مواجه شد";
                }
            } else if (error.request) {
                registerError.value = "مشکل در ارتباط با سرور. اتصال اینترنت را بررسی کنید";
            } else {
                registerError.value = "خطای غیرمنتظره رخ داده است";
            }
            
            throw error;
        }
    }

    function logout() {
        token.value = null;
        user.value = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("username"); // Also remove username
        localStorage.removeItem("role");     // Also remove role
        router.push("/login");
    }
    // Add this to your auth store
    function updateUsername(newUsername) {
        username.value = newUsername;
        localStorage.setItem("username", newUsername);
    }
  
    return { 
        token, 
        user, 
        isAuthenticated, 
        userRole, 
        login, 
        register, 
        logout, 
        loginError,  // Expose login error for component to use
        registerError,  // Expose register error for component to use
        username,
        updateUsername
    };
});