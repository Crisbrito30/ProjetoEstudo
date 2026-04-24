// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/HomeView.vue';  // Assumindo que você tenha uma página de Home
import Login from './views/loginvView.vue'; // Página de login, caso queira manter separada
import SearchView from './views/SearchView.vue'; // Página de busca
import UserView from './views/userView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login,
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            meta: { requiresAuth: true } // rota protegida
        },
        {
            path: '/reset-password',
            name: 'reset-password',
            component: Login, // Usar o mesmo componente Login
            props: (route) => ({ resetToken: route.query.token })
        },
        {
            path: '/user',
            name: 'user',
            component: UserView,
            meta: { requiresAuth: true } // rotas protegida
        },
        {
            path: '/search',
            name: 'search',
            component: SearchView
        }
    ],
});

// Proteção das rotas
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token'); // Verifica o token no localStorage

    // Se a rota exigir autenticação e o usuário não estiver autenticado
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        next('/');  // Redireciona para a página de login
    } else {
        next(); // Permite o acesso à rota
    }
});

export default router;

