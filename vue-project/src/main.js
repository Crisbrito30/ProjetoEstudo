// Importando estilos e scripts do Bootstrap
import './assets/main.css'
import './assets/base.css'

// Importando estilos e scripts do Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import vue3GoogleLogin from 'vue3-google-login'
import themeStore from './stores/useTheme'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App);

app.use(router);

// Importando o plugin vue3-google-login
app.use(vue3GoogleLogin, {
    clientId: '728085137013-2qo05fqihas76dbl2o2bcvhs0juol99t.apps.googleusercontent.com'
  })

app.mount('#app');
