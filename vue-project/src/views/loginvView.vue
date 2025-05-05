<template>
    <div class="modern-login">
        <!-- Background Animation -->
        <div class="background">
            <div class="shape"></div>
            <div class="shape"></div>
        </div>

        <div class="container">
            <div class="row justify-content-center align-items-center min-vh-100">
                <div v-show="!isRegistering" class="col-md-5 animate-form">
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

                                <!-- Botão Github (caso você queira futuramente adicionar) -->
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
                                <a href="#" class="forgot-link">Esqueceu a senha?</a>
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
                <!--registro de usuário-->
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
                            <!-- Social Login Buttons -->
                            <div class="form-floating modern-input-group">
                                <input type="text" class="modern-input" v-model="name" placeholder="" required
                                    autocomplete="current-password" />
                                <label for="name">
                                    <i class="bi bi-person"></i>
                                    Nome
                                </label>
                                <div class="input-focus-bg"></div>
                            </div>
                            <!-- Email Input -->
                            <div class="form-floating modern-input-group">
                                <input type="email" class="modern-input" v-model="email" placeholder="" required
                                    autocomplete="current-password" />
                                <label for="email">
                                    <i class="bi bi-envelope"></i>
                                    Email
                                </label>
                                <div class="input-focus-bg"> </div>
                            </div>
                            <!-- Password Input -->
                            <div class="form-floating modern-input-group">
                                <input type="password" class="modern-input" v-model="password" placeholder="" required
                                    autocomplete="current-password" />
                                <label for="password">
                                    <i class="bi bi-lock"></i>
                                    Senha
                                </label>
                            </div>
                            <!-- phone Input -->
                            <div class="form-floating modern-input-group">
                                <input type="text" class="modern-input" v-model="phone" placeholder="" required
                                    autocomplete="current-password" />
                                <label for="password">
                                    <i class="bi bi-telephone"></i>
                                    Tel
                                </label>
                            </div>
                            <!-- photo Input -->
                            <!-- Campo de foto -->
                            <div class="form-floating modern-input-group">
                                <input type="file" accept="image/*" @change="handlePhoto" class="modern-input" />
                                <label>
                                    <i class="bi bi-camera"></i>
                                    Foto
                                </label>
                            </div>
                            <!-- Botões da câmera -->
                            <div class="text-center mb-3">
                                <button type="button" 
                                    class="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#cameraModal"
                                    @click="startCamera"
                                    >
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
        <div>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#cameraModal" @click="startCamera">
                Abrir Câmera
            </button>

            <!-- Modal Bootstrap -->
            <div class="modal fade" id="cameraModal" tabindex="-1" aria-labelledby="cameraModalLabel"
                aria-hidden="true">
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

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import { GoogleLogin } from "vue3-google-login";
import axios from "axios";
import { useToastStore } from '@/stores/useToastStore';

// Store and router
const toast = useToastStore();
const router = useRouter();
const handleLogin = (response) => {
    // Aqui você pode lidar com a resposta do login do Google, como armazenar o token ou realizar outras ações.
    console.log(response);
    // Lógica para redirecionar ou atualizar o estado do aplicativo após o login
};
// Google Client ID
const googleClientId = "728085137013-2qo05fqihas76dbl2o2bcvhs0juol99t.apps.googleusercontent.com";

// Form states
const isRegistering = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const isLoggedIn = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);

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

// Toggle between login and registration forms
const switchToRegister = () => {
    resetForm();
    isRegistering.value = true;
};

const switchToLogin = () => {
    resetForm();
    isRegistering.value = false;
};

// Reset form data when switching between login and register
const resetForm = () => {
    errorMessage.value = "";
    name.value = "";
    email.value = "";
    password.value = "";
    phone.value = "";
    photoFile.value = null;
    capturedPhoto.value = null;
};

// Toggle password visibility
const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

// Handle login submission
const handleSubmit = async () => {
    loading.value = true;
    errorMessage.value = '';

    try {
        // Validate input
        if (!email.value || !password.value) {
            throw new Error("Por favor, preencha todos os campos");
        }

        // Send request to server
        const response = await axios.post('http://localhost:5000/api/login', {
            email: email.value,
            password: password.value,
        });

        // Handle server response
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
const handleGoogleLogin = async (response) => {
    loading.value = true;
    errorMessage.value = '';

    try {
        // Send Google token to backend
        const googleResponse = await axios.post("http://localhost:5000/api/auth/google", {
            token: response.credential,
        });

        // Save auth token
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
        switchToLogin(); // opcional
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
        capturedPhoto.value = URL.createObjectURL(file); // também útil para mostrar preview
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
            capturedPhoto.value = URL.createObjectURL(blob); // para visualização, se quiser
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

// Ensure Bootstrap is properly loaded
onMounted(() => {
    // Check if Bootstrap is available globally
    if (typeof window !== 'undefined' && !window.bootstrap && typeof document !== 'undefined') {
        console.warn('Bootstrap JavaScript não foi detectado. Tentando carregar via CDN...');

        // Only add if not already present
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

// Clean up on component unmount
onUnmounted(() => {
    stopCamera();
});
</script>

<style scoped>
/* CSS da animação */
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
}

.modern-input {
    width: 100%;
    padding: 1rem 1rem 1rem 2.8rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
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
    color: rgba(255, 255, 255, 0.7);
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
    color: white;
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

.btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
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

@media (max-width: 890px) {
    .login-card {
        padding: 2rem;
        margin: 1rem;
    }

    .social-login {
        flex-direction: column;
    }
}

.user-photo {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
}


/*anaimação de fundo*/
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
</style>