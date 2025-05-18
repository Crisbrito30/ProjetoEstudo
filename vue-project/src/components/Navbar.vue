<template>
    <nav class="navbar navbar-expand-lg fixed-top" :class="{ 'efeito-enbacamento': isExpanded }">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Navbar</a>

            <!-- Botão de menu para telas pequenas -->
            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" @click="toggleNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Menu Offcanvas para Mobile -->
            <div class="offcanvas offcanvas-start offcanvas-container" id="navbarNav"
                :class="{ 'efeito-enbacamento': !isExpanded }">
                <ul class="navbar-nav align-items-center">
                    <li class="nav-item">
                        <router-link to="/home" class="nav-link">
                            <i class="bi bi-house me-2 fs-4"></i> Home
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/search" class="nav-link">
                            <i class="bi bi-clipboard-data me-2 fs-4"></i> Pesquisa
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/user" class="nav-link">
                            <i class="bi bi-people me-2 fs-4"></i> Usuários
                        </router-link>
                    </li>
                    
                </ul>
            </div>
        </div>

        <!-- Botão de Logout -->
        <RouterLink to="/" class="btn  ms-3" @click="logout">Sair</RouterLink>

        <!-- Botão de alternar tema -->
        <ThemaPage />
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ThemaPage from './themaPage.vue';


const isExpanded = ref(window.innerWidth >= 992); // Define o estado inicial baseado na largura da tela

// Atualiza o estado ao redimensionar a tela
const updateNavbarState = () => {
    isExpanded.value = window.innerWidth >= 992;
};

// Alterna a navbar quando o botão for clicado
const toggleNavbar = () => {
    if (window.innerWidth < 992) {
        isExpanded.value = false; // Garante que o efeito só aplique no Offcanvas quando necessário
    }
};

// Adiciona/remover o evento de resize
onMounted(() => {
    window.addEventListener('resize', updateNavbarState);
});
onUnmounted(() => {
    window.removeEventListener('resize', updateNavbarState);
});

const menuItems = ref([
    { label: 'Perfil', action: 'perfil' },
    { label: 'Configurações', action: 'configuracoes' },
    { label: 'Sair', action: 'logout' }
]);

function handleItemSelected(item) {
    console.log('Item selecionado:', item);
}

const logout = () => {
    localStorage.removeItem('token');
    router.push({ name: 'login' });
};
</script>

<style scoped>
.efeito-enbacamento {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(13.5px);
    -webkit-backdrop-filter: blur(13.5px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    transition: all 0.3s ease-in-out;
}
</style>