import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Estilos globais
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';  
import 'bootstrap-icons/font/bootstrap-icons.css'

// Plugins
import vue3GoogleLogin from 'vue3-google-login'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import './assets/base.css'
// Criação do app
const app = createApp(App)
const pinia = createPinia()

// Configuração de plugins
app.use(pinia)
app.use(router)

app.use(vue3GoogleLogin, {
  clientId: 'seu-client-id'
})

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-center',
  closeOnClick: true,
  pauseOnHover: true,
  hideProgressBar: false
})

// Montagem da aplicação
app.mount('#app')
