<template>
    <div class="modern-login">
        <!-- Background Animation -->
        <div class="background">
            <div class="shape"></div>
            <div class="shape"></div>
        </div>

        <div class="container">
            <div class="row justify-content-center align-items-center min-vh-100">
                <!-- Login Form -->
                <div v-show="!isRegistering && !showForgotPassword" class="col-md-5 animate-form">
                    <div class="login-card">
                        <!-- Logo/Title Section -->
                        <div class="text-center mb-4">
                            <div class="logo-container">
                                <div class="logo-circle">
                                    <i class="bi bi-hexagon-fill"></i>
                                </div>
                            </div>
                            <h2 class="brand-title">Login</h2>
                            <p class="welcome-text">Bem-vindo de volta!</p>
                        </div>

                        <form @submit.prevent="handleSubmit" class="login-form">
                            <!-- Social Login Buttons -->
                            <div class="social-login mb-4">
                                <!-- Botão Google -->
                                <div class="social-btn google btn">
                                    <GoogleLogin
                                        :client-id="'728085137013-2qo05fqihas76dbl2o2bcvhs0juol99t.apps.googleusercontent.com'"
                                        :callback="handleLogin" v-if="!isLoggedIn" prompt>
                                        <i class="bi bi-google" v-if="!isLoggedIn"></i>
                                        <span v-if="!isLoggedIn"> Google</span>
                                    </GoogleLogin>
                                </div>

                                <!-- Botão Github -->
                                <button type="button" class="social-btn github">
                                    <i class="bi bi-github"></i>
                                    <span>Github</span>
                                </button>
                            </div>

                            <hr />

                            <!-- Email Input -->
                            <div class="form-floating modern-input-group">
                                <input type="email" class="modern-input" id="email" v-model="email" placeholder=""
                                    required autocomplete="current-password" />
                                <label for="email">
                                    <i class="bi bi-envelope"></i>
                                    Email
                                </label>
                                <div class="input-focus-bg"></div>
                            </div>

                            <!-- Password Input -->
                            <div class="form-floating modern-input-group">
                                <input :type="showPassword ? 'text' : 'password'" class="modern-input" id="password"
                                    v-model="password" placeholder="" required autocomplete="current-password" />
                                <label for="password">
                                    <i class="bi bi-lock"></i>
                                    Senha
                                </label>
                                <span class="password-toggle" @click="togglePassword">
                                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                </span>
                                <div class="input-focus-bg"></div>
                            </div>

                            <!-- Remember & Forgot Section -->
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <label class="modern-checkbox">
                                    <input type="checkbox" v-model="rememberMe" />
                                    <span class="checkmark"></span>
                                    <span class="label-text">Lembrar-me</span>
                                </label>
                                <a href="#" @click.prevent="showForgotPasswordForm" class="forgot-link">Esqueceu a senha?</a>
                            </div>

                            <!-- Login Button -->
                            <button type="submit" class="login-btn" :disabled="loading">
                                <span class="btn-content" :class="{ 'loading': loading }">
                                    <span class="spinner" v-if="loading"></span>
                                    <span class="btn-text">{{ loading ? 'Entrando...' : 'Entrar' }}</span>
                                </span>
                            </button>

                            <!-- Error Message -->
                            <div v-if="errorMessage" class="error-message">
                                {{ errorMessage }}
                            </div>

                            <!-- Register Link -->
                            <p class="register-text">
                                Não tem uma conta?
                                <a href="#" @click="switchToRegister" class="register-link">Registre-se</a>
                            </p>
                        </form>
                    </div>
                </div>

                <!-- Forgot Password Form -->
                <div v-show="showForgotPassword && !showResetPassword" class="col-md-5 animate-form">
                    <div class="login-card">
                        <!-- Logo/Title Section -->
                        <div class="text-center mb-4">
                            <div class="logo-container">
                                <div class="logo-circle">
                                    <i class="bi bi-key-fill"></i>
                                </div>
                            </div>
                            <h2 class="brand-title">Recuperar Senha</h2>
                            <p class="welcome-text">Digite seu email para recuperar a senha</p>
                        </div>

                        <form @submit.prevent="handleForgotPassword" class="login-form">
                            <!-- Email Input -->
                            <div class="form-floating modern-input-group">
                                <input type="email" class="modern-input" id="forgot-email" v-model="forgotEmail" 
                                    placeholder="" required />
                                <label for="forgot-email">
                                    <i class="bi bi-envelope"></i>
                                    Email
                                </label>
                                <div class="input-focus-bg"></div>
                            </div>

                            <!-- Submit Button -->
                            <button type="submit" class="login-btn" :disabled="forgotPasswordLoading">
                                <span class="btn-content" :class="{ 'loading': forgotPasswordLoading }">
                                    <span class="spinner" v-if="forgotPasswordLoading"></span>
                                    <span class="btn-text">{{ forgotPasswordLoading ? 'Enviando...' : 'Enviar Link' }}</span>
                                </span>
                            </button>

                            <!-- Success Message -->
                            <div v-if="forgotPasswordSuccess" class="success-message">
                                <i class="bi bi-check-circle-fill"></i>
                                Link de recuperação enviado! Verifique seu email.
                            </div>

                            <!-- Error Message -->
                            <div v-if="forgotPasswordError" class="error-message">
                                {{ forgotPasswordError }}
                            </div>

                            <!-- Back to Login Link -->
                            <p class="register-text">
                                Lembrou da senha?
                                <a href="#" @click.prevent="backToLogin" class="register-link">Fazer login</a>
                            </p>
                        </form>
                    </div>
                </div>

                <!-- Reset Password Form -->
                <div v-show="showResetPassword" class="col-md-5 animate-form">
                    <div class="login-card">
                        <!-- Logo/Title Section -->
                        <div class="text-center mb-4">
                            <div class="logo-container">
                                <div class="logo-circle">
                                    <i class="bi bi-shield-lock-fill"></i>
                                </div>
                            </div>
                            <h2 class="brand-title">Nova Senha</h2>
                            <p class="welcome-text">Digite sua nova senha</p>
                        </div>

                        <form @submit.prevent="handleResetPassword" class="login-form">
                            <!-- New Password Input -->
                            <div class="form-floating modern-input-group">
                                <input :type="showNewPassword ? 'text' : 'password'" class="modern-input" 
                                    id="new-password" v-model="newPassword" placeholder="" required 
                                    minlength="6" />
                                <label for="new-password">
                                    <i class="bi bi-lock"></i>
                                    Nova Senha
                                </label>
                                <span class="password-toggle" @click="toggleNewPassword">
                                    <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                </span>
                                <div class="input-focus-bg"></div>
                            </div>

                            <!-- Confirm Password Input -->
                            <div class="form-floating modern-input-group">
                                <input :type="showConfirmPassword ? 'text' : 'password'" class="modern-input" 
                                    id="confirm-password" v-model="confirmPassword" placeholder="" required 
                                    minlength="6" />
                                <label for="confirm-password">
                                    <i class="bi bi-lock-fill"></i>
                                    Confirmar Senha
                                </label>
                                <span class="password-toggle" @click="toggleConfirmPassword">
                                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                </span>
                                <div class="input-focus-bg"></div>
                            </div>

                            <!-- Password Strength Indicator -->
                            <div class="password-strength mb-3">
                                <div class="strength-bar">
                                    <div class="strength-fill" :class="passwordStrengthClass" 
                                        :style="{ width: passwordStrengthPercentage + '%' }"></div>
                                </div>
                                <small class="strength-text" :class="passwordStrengthClass">
                                    {{ passwordStrengthText }}
                                </small>
                            </div>

                            <!-- Submit Button -->
                            <button type="submit" class="login-btn" :disabled="resetPasswordLoading || !passwordsMatch">
                                <span class="btn-content" :class="{ 'loading': resetPasswordLoading }">
                                    <span class="spinner" v-if="resetPasswordLoading"></span>
                                    <span class="btn-text">{{ resetPasswordLoading ? 'Alterando...' : 'Alterar Senha' }}</span>
                                </span>
                            </button>

                            <!-- Password Match Warning -->
                            <div v-if="confirmPassword && !passwordsMatch" class="error-message">
                                As senhas não coincidem
                            </div>

                            <!-- Error Message -->
                            <div v-if="resetPasswordError" class="error-message">
                                {{ resetPasswordError }}
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Registration Form (existing code) -->
                <div v-show="isRegistering" class="col-md-5 animate-form">
                    <div class="login-card">
                        <!-- Logo/Title Section -->
                        <div class="text-center mb-4">
                            <div class="logo-container">
                                <div class="logo-circle">
                                    <i class="bi bi-hexagon-fill"></i>
                                </div>
                            </div>
                            <h2 class="brand-title">Registre-se</h2>
                            <p class="welcome-text">Crie sua conta!</p>
                        </div>

                        <form @submit.prevent="registrarUser" class="login-form">
                            <!-- Name Input -->
                            <div class="form-floating modern-input-group">
                                <input type="text" class="modern-input" v-model="name" placeholder="" required
                                    autocomplete="name" />
                                <label for="name">
                                    <i class="bi bi-person"></i>
                                    Nome
                                </label>
                                <div class="input-focus-bg"></div>
                            </div>
                            
                            <!-- Email Input -->
                            <div class="form-floating modern-input-group">
                                <input type="email" class="modern-input" v-model="email" placeholder="" required
                                    autocomplete="email" />
                                <label for="email">
                                    <i class="bi bi-envelope"></i>
                                    Email
                                </label>
                                <div class="input-focus-bg"></div>
                            </div>
                            
                            <!-- Password Input -->
                            <div class="form-floating modern-input-group">
                                <input type="password" class="modern-input" v-model="password" placeholder="" required
                                    autocomplete="new-password" />
                                <label for="password">
                                    <i class="bi bi-lock"></i>
                                    Senha
                                </label>
                            </div>
                            
                            <!-- Phone Input -->
                            <div class="form-floating modern-input-group">
                                <input type="text" class="modern-input" v-model="phone" placeholder="" required
                                    autocomplete="tel" />
                                <label for="phone">
                                    <i class="bi bi-telephone"></i>
                                    Telefone
                                </label>
                            </div>
                            
                            <!-- Photo Input -->
                            <div class="form-floating modern-input-group">
                                <input type="file" accept="image/*" @change="handlePhoto" class="modern-input" />
                                <label>
                                    <i class="bi bi-camera"></i>
                                    Foto
                                </label>
                            </div>
                            
                            <!-- Camera Button -->
                            <div class="text-center mb-3">
                                <button type="button" 
                                    class="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#cameraModal"
                                    @click="startCamera">
                                    Abrir Câmera
                                </button>
                            </div>

                            <!-- Register Button -->
                            <button type="submit" class="login-btn" :disabled="loading">
                                <span class="btn-content" :class="{ 'loading': loading }">
                                    <span class="spinner" v-if="loading"></span>
                                    <span class="btn-text">{{ loading ? 'Registrando...' : 'Registrar' }}</span>
                                </span>
                            </button>
                        </form>
                        <p class="register-text">
                            Já tem uma conta?
                            <a href="#" @click.prevent="switchToLogin" class="register-link">Faça login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Camera Modal -->
        <div class="modal fade" id="cameraModal" tabindex="-1" aria-labelledby="cameraModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="cameraModalLabel">Câmera</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
                            @click="stopCamera"></button>
                    </div>
                    <div class="modal-body text-center">
                        <video ref="video" autoplay playsinline class="w-100 rounded border"></video>
                    </div>
                    <div class="modal-footer">
                        <button @click="capturePhoto" class="btn btn-sm btn-primary">
                            <i class="bi bi-camera-fill"></i> Capturar Foto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { GoogleLogin } from "vue3-google-login";
import axios from "axios";
import { useToastStore } from '@/stores/useToastStore';

// Store and router
const toast = useToastStore();
const router = useRouter();
const route = useRoute();

// Google Client ID
const googleClientId = "728085137013-2qo05fqihas76dbl2o2bcvhs0juol99t.apps.googleusercontent.com";

// Form states
const isRegistering = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const isLoggedIn = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);

// Forgot password states
const showForgotPassword = ref(false);
const forgotEmail = ref("");
const forgotPasswordLoading = ref(false);
const forgotPasswordSuccess = ref(false);
const forgotPasswordError = ref("");

// Reset password states
const showResetPassword = ref(false);
const resetToken = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const resetPasswordLoading = ref(false);
const resetPasswordError = ref("");

// Form fields
const name = ref("");
const email = ref("");
const password = ref("");
const phone = ref("");

// Photo handling
const photoFile = ref(null);
const capturedPhoto = ref(null);

// Camera refs
const video = ref(null);
const stream = ref(null);

// Password strength computed properties
const passwordStrength = computed(() => {
    if (!newPassword.value) return 0;
    
    let strength = 0;
    const password = newPassword.value;
    
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
});

const passwordStrengthPercentage = computed(() => {
    return (passwordStrength.value / 6) * 100;
});

const passwordStrengthClass = computed(() => {
    if (passwordStrength.value <= 2) return 'weak';
    if (passwordStrength.value <= 4) return 'medium';
    return 'strong';
});

const passwordStrengthText = computed(() => {
    if (!newPassword.value) return '';
    if (passwordStrength.value <= 2) return 'Senha fraca';
    if (passwordStrength.value <= 4) return 'Senha média';
    return 'Senha forte';
});

const passwordsMatch = computed(() => {
    if (!confirmPassword.value) return true;
    return newPassword.value === confirmPassword.value;
});

// Check for reset token in URL
onMounted(() => {
    const token = route.query.token;
    if (token) {
        resetToken.value = token;
        verifyResetToken(token);
    }
    
    // Check if Bootstrap is available globally
    if (typeof window !== 'undefined' && !window.bootstrap && typeof document !== 'undefined') {
        console.warn('Bootstrap JavaScript não foi detectado. Tentando carregar via CDN...');

        if (!document.getElementById('bootstrap-js')) {
            const bootstrapScript = document.createElement('script');
            bootstrapScript.id = 'bootstrap-js';
            bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js';
            bootstrapScript.integrity = 'sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4';
            bootstrapScript.crossOrigin = 'anonymous';
            document.head.appendChild(bootstrapScript);
        }
    }
});

// Toggle functions
const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const toggleNewPassword = () => {
    showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
};

// Navigation functions
const switchToRegister = () => {
    resetForm();
    isRegistering.value = true;
    showForgotPassword.value = false;
    showResetPassword.value = false;
};

const switchToLogin = () => {
    resetForm();
    isRegistering.value = false;
    showForgotPassword.value = false;
    showResetPassword.value = false;
};

const showForgotPasswordForm = () => {
    resetForm();
    showForgotPassword.value = true;
    isRegistering.value = false;
    showResetPassword.value = false;
};

const backToLogin = () => {
    resetForm();
    showForgotPassword.value = false;
    isRegistering.value = false;
    showResetPassword.value = false;
};

// Reset form data
const resetForm = () => {
    errorMessage.value = "";
    forgotPasswordError.value = "";
    forgotPasswordSuccess.value = false;
    resetPasswordError.value = "";
    name.value = "";
    email.value = "";
    password.value = "";
    phone.value = "";
    forgotEmail.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    photoFile.value = null;
    capturedPhoto.value = null;
};

// Handle login submission
const handleSubmit = async () => {
    loading.value = true;
    errorMessage.value = '';

    try {
        if (!email.value || !password.value) {
            throw new Error("Por favor, preencha todos os campos");
        }

        const response = await axios.post('http://localhost:5000/api/login', {
            email: email.value,
            password: password.value,
        });

        if (response && response.data) {
            localStorage.setItem('token', response.data.token);
            toast.success('Login realizado com sucesso!');
            router.push({ name: 'home' });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        errorMessage.value = error.response?.data?.message || error.message || 'Erro ao fazer login';
        toast.error(errorMessage.value);
    } finally {
        loading.value = false;
    }
};

// Handle Google login
const handleLogin = async (response) => {
    loading.value = true;
    errorMessage.value = '';

    try {
        const googleResponse = await axios.post("http://localhost:5000/api/auth/google", {
            token: response.credential,
        });

        if (googleResponse.data.token) {
            localStorage.setItem("auth_token", googleResponse.data.token);
            toast.success('Login com Google realizado com sucesso!');
            router.push('/home');
        }
    } catch (error) {
        console.error("Erro ao fazer login com Google:", error);
        errorMessage.value = "Falha ao autenticar com o Google.";
        toast.error(errorMessage.value);
    } finally {
        loading.value = false;
    }
};

// Handle forgot password
const handleForgotPassword = async () => {
    forgotPasswordLoading.value = true;
    forgotPasswordError.value = '';
    forgotPasswordSuccess.value = false;

    try {
        if (!forgotEmail.value) {
            throw new Error("Por favor, digite seu email");
        }

        const response = await axios.post('http://localhost:5000/api/request-reset/', {
            email: forgotEmail.value,
        });

        if (response.data.success) {
            forgotPasswordSuccess.value = true;
            toast.success('Link de recuperação enviado para seu email!');
        }
    } catch (error) {
        console.error('Erro ao solicitar recuperação:', error);
        forgotPasswordError.value = error.response?.data?.message || 'Erro ao enviar link de recuperação';
        toast.error(forgotPasswordError.value);
    } finally {
        forgotPasswordLoading.value = false;
    }
};

// Verify reset token
const verifyResetToken = async (token) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/password-reset/verify-token/${token}`);
        
        if (response.data.success) {
            showResetPassword.value = true;
            showForgotPassword.value = false;
            isRegistering.value = false;
            toast.info('Token válido. Digite sua nova senha.');
        }
    } catch (error) {
        console.error('Token inválido:', error);
        toast.error('Link de recuperação inválido ou expirado');
        backToLogin();
    }
};

// Handle reset password
const handleResetPassword = async () => {
    resetPasswordLoading.value = true;
    resetPasswordError.value = '';

    try {
        if (!newPassword.value || !confirmPassword.value) {
            throw new Error("Por favor, preencha todos os campos");
        }
        
        if (newPassword.value !== confirmPassword.value) {
            throw new Error("As senhas não coincidem");
        }
        
        if (newPassword.value.length < 6) {
            throw new Error("A senha deve ter pelo menos 6 caracteres");
        }

        const response = await axios.post('http://localhost:5000/api/password-reset/', {
            token: resetToken.value,
            newPassword: newPassword.value,
        });

        if (response.data.success) {
            toast.success('Senha alterada com sucesso!');
            router.push('/login');
            backToLogin();
        }
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        resetPasswordError.value = error.response?.data?.message || error.message || 'Erro ao alterar senha';
        toast.error(resetPasswordError.value);
    } finally {
        resetPasswordLoading.value = false;
    }
};

// Handle user registration
const registrarUser = async () => {
    loading.value = true;
    errorMessage.value = '';

    try {
        if (!name.value || !email.value || !password.value || !phone.value) {
            throw new Error("Preencha todos os campos");
        }

        const formData = new FormData();
        formData.append("name", name.value); 
        formData.append("email", email.value);
        formData.append("password", password.value);
        formData.append("phone", phone.value);

        if (photoFile.value) {
            formData.append("photo", photoFile.value);
        }

        const response = await axios.post('http://localhost:5000/api/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        toast.success("Usuário registrado com sucesso!");
        switchToLogin();
    } catch (error) {
        console.error("Erro ao registrar:", error);
        errorMessage.value = error.response?.data?.message || "Erro ao registrar";
        toast.error(errorMessage.value);
    } finally {
        loading.value = false;
    }
};

// Handle photo file selection
const handlePhoto = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        photoFile.value = file;
        capturedPhoto.value = URL.createObjectURL(file);
    }
};

// Camera functions
const startCamera = async () => {
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
        if (video.value) {
            video.value.srcObject = stream.value;
        }
    } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
        toast.error("Não foi possível acessar a câmera.");
    }
};

const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const videoEl = video.value;

    if (!videoEl) return;

    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        if (blob) {
            photoFile.value = new File([blob], 'captured_photo.jpg', { type: 'image/jpeg' });
            capturedPhoto.value = URL.createObjectURL(blob);
        }
        toast.info("Foto capturada!");
    }, 'image/jpeg');
};

const stopCamera = () => {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
        stream.value = null;
    }
};

// Clean up on component unmount
onUnmounted(() => {
    stopCamera();
});
</script>

<style scoped>
/* Existing CSS styles */
.modern-login .container {
    position: relative;
    width: 100%;
    max-width: 1200px;
}

.modern-login {
    min-height: 100vh;
    background: #0f0c29;
    background: linear-gradient(to right, #24243e, #302b63, #0f0c29);
    position: relative;
    overflow: hidden;
    background-image: url('./public/ceuNoiteAzul.jpg');
    background-repeat: no-repeat;
    height: 100vh;
    background-size: cover;
}

.background {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.shape {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff6b6b, #fc5c7d);
    filter: blur(70px);
    animation: shapeMove 15s infinite alternate;
}

.shape:nth-child(1) {
    width: 400px;
    height: 400px;
    top: -150px;
    left: -100px;
    background: linear-gradient(45deg, #4776E6, #8E54E9);
}

.shape:nth-child(2) {
    width: 300px;
    height: 300px;
    bottom: -80px;
    right: -50px;
    animation-delay: -7s;
}

.login-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2.5rem;
    position: relative;
    z-index: 2;
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.logo-container {
    margin-bottom: 1rem;
}

.logo-circle {
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, #4776E6, #8E54E9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0 5px 15px rgba(71, 118, 230, 0.3);
}

.logo-circle i {
    font-size: 24px;
    color: white;
}

.brand-title {
    color: white;
    font-size: 1.8rem;
    font-weight: 600;
    margin: 1rem 0 0.5rem;
}

.welcome-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
}

.social-login {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.social-btn {
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.social-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.modern-input-group {
    position: relative;
    margin-bottom: 1.5rem;
    background-color: rgba(201, 206, 206, 0.603); 
}

.modern-input {
    width: 100%;
    padding: 1rem 1rem 1rem 2.8rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    background-color: rgba(201, 206, 206, 0.603); 
    transition: all 0.3s ease;
}

.modern-input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.15);
}

.modern-input-group label {
    position: absolute;
    left: 1rem;
    color: rgba(56, 55, 55, 0.952);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    pointer-events: none;
    transition: all 0.3s ease;
}

.modern-input:focus+label,
.modern-input:not(:placeholder-shown)+label {
    transform: translateY(-1.5rem);
    font-size: 0.8rem;
    color: rgb(68, 67, 67);
}

.password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    z-index: 2;
}

.modern-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.7);
}

.checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    display: inline-block;
    position: relative;
    transition: all 0.3s ease;
}

.modern-checkbox input:checked+.checkmark::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
}

.modern-checkbox input {
    display: none;
}

.forgot-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
}

.forgot-link:hover {
    color: white;
}

.login-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 10px;
    background: linear-gradient(45deg, #4776E6, #8E54E9);
    color: white;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(71, 118, 230, 0.3);
}

.login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.register-text {
    text-align: center;
    margin-top: 1.5rem;
    color: rgba(255, 255, 255, 0.7);
}

.register-link {
    color: #4776E6;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}

.register-link:hover {
    color: #8E54E9;
}

/* Error and Success Messages */
.error-message {
    background: rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.3);
    color: #ff6b6b;
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 1rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.success-message {
    background: rgba(40, 167, 69, 0.1);
    border: 1px solid rgba(40, 167, 69, 0.3);
    color: #28a745;
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 1rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Password Strength Indicator */
.password-strength {
    margin-bottom: 1rem;
}

.strength-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.strength-fill {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 2px;
}

.strength-fill.weak {
    background: linear-gradient(45deg, #ff4757, #ff3838);
}

.strength-fill.medium {
    background: linear-gradient(45deg, #ffa502, #ff6348);
}

.strength-fill.strong {
    background: linear-gradient(45deg, #2ed573, #1e90ff);
}

.strength-text {
    font-size: 0.8rem;
    font-weight: 500;
}

.strength-text.weak {
    color: #ff4757;
}

.strength-text.medium {
    color: #ffa502;
}

.strength-text.strong {
    color: #2ed573;
}

/* Animation for form transitions */
.animate-form {
    animation: slideIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes shapeMove {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

/* Responsive Design */
@media (max-width: 890px) {
    .login-card {
        padding: 2rem;
        margin: 1rem;
    }

    .social-login {
        flex-direction: column;
    }
}

/* Additional styles for camera modal */
.user-photo {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
}
</style>