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
                                <input type="email" class="modern-input"  v-model="email" placeholder=""
                                    required autocomplete="current-password" />
                                <label for="email">
                                    <i class="bi bi-envelope"></i>
                                    Email
                                </label>
                                <div class="input-focus-bg"> </div>
                            </div>
                            <!-- Password Input -->
                            <div class="form-floating modern-input-group">
                                <input type="password" class="modern-input"  v-model="password"
                                    placeholder="" required autocomplete="current-password" />
                                <label for="password">
                                    <i class="bi bi-lock"></i>
                                    Senha
                                </label>
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
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { GoogleLogin } from "vue3-google-login";
import axios from "axios";


const isRegistering = ref(false);
const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const isLoggedIn = ref(false); //para controlar o login 



// Alternar entre tela de login e registro
const switchToRegister = () => {
    isRegistering.value = true;
};

const switchToLogin = () => {
    isRegistering.value = false;
};

//toggle de senha
const togglePassword = () => {
    showPassword.value = !showPassword.value;
};


//função de login//
const handleSubmit = async () => {
    loading.value = true;
    errorMessage.value = '';
    try {
        // Enviar a requisição para o servidor
        const response = await axios.post('http://localhost:5000/api/login', {
            email: email.value,
            password: password.value,
        });

        // Tratar a resposta do servidor
        if (response && response.data) {
            localStorage.setItem('token', response.data.token);  // Armazenar o token no localStorage  
        }

        // Redirecionar o usuário para a página de home após o login
        router.push({ name: 'home' }); // Usando o router corretamente para redirecionar

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        errorMessage.value = error.response?.data.message || 'Erro desconhecido';
    } finally {
        loading.value = false;
    }
};

// Login com Google
const handleLogin = async (response) => {
    console.log('Token JWT do Google:', response.credential);

    try {
        // Enviar o token do Google para o backend para verificação
        const googleResponse = await axios.post("http://localhost:5000/api/auth/google", {
            token: response.credential,
        });

        console.log("Login com Google realizado", googleResponse.data);

        // Salvar o token do Google ou outro dado relevante
        if (googleResponse.data.token) {
            localStorage.setItem("auth_token", googleResponse.data.token);
        }

        // Redirecionar ou fazer o que for necessário após o login com Google
        router.push('/home');

    } catch (error) {
        console.error("Erro ao fazer login com Google:", error);
        errorMessage.value = "Falha ao autenticar com o Google.";
    }
};

//Função de registro de usuário
const registrarUser = async () => {
    loading.value = true;
    errorMessage.value = '';
    try {
        // Enviar a requisição para o servidor
        const response = await axios.post('http://localhost:5000/api/register', {
            name: name.value,
            email: email.value,
            password: password.value,
        });

        console.log('Usuário registrado', response.data);

        // Redirecionar o usuário para a página de home após o login
        router.push({ name: 'home' }); // Usando o router corretamente para redirecionar

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        errorMessage.value = error.response?.data.message || 'Erro desconhecido';
    } finally {
        loading.value = false;
    }
};
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