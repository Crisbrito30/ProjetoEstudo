<template>
  <div class="container mt-5 p-4 rounded shadow-sm efeito-enbacamento">
    <h1>Lista de Usuários</h1>
    <div class="d-flex align-items-end flex-column mb-3 rounded-4">
      <div class="input-group w-25">
        <span class="input-group-text bg-white border-end-0">
          <i class="bi bi-search"></i>
        </span>
        <input v-model="search" @input="onSearchInput" type="text" placeholder="Pesquisa"
          class="form-control border-start-0" />
      </div>
    </div>
    
    <!-- Tabela -->
    <div class="table-responsive rounded-2">
      <div class="user-table-scroll">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Foto</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tel</th>
              <th>Função</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>
                <div class="user-photo-container" style="cursor: pointer;" @click="openUserModal(user)">
                  <img v-if="getUserPhotoUrl(user.photo)" :src="getUserPhotoUrl(user.photo)" alt="Foto do usuário"
                    class="user-photo" />
                  <span v-else>
                    <i class="bi bi-person-circle fs-2"></i>
                  </span>
                </div>
              </td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <span v-if="user.roles === 'padrao'"
                  class="bg-secondary-subtle text-dark px-2 py-1 rounded fw-bold">Padrão</span>

                <span v-else-if="user.roles === 'gestor'"
                  class="bg-primary-subtle text-primary fw-bold px-2 py-1 rounded">Gestor</span>

                <span v-else-if="user.roles === 'administrador'"
                  class="bg-success-subtle text-success-emphasis fw-bold px-2 py-1 rounded">Administrador</span>

                <span v-else>{{ user.roles }}</span>
              </td>

              <td>
                <button v-if="isGestor" class="btn btn-sm btn-light" @click="openEditModal(user)">
                  <i class="bi bi-pencil-fill text-warning"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginação -->
    <div class="container px-0 m-3">
      <nav v-if="pagination.pages > 1" aria-label="Paginação">
        <ul class="pagination justify-content-center gap-2">
          <li class="page-item" :class="{ disabled: pagination.page === 1 }">
            <button class="page-link rounded-2 px-3" @click="changePage(pagination.page - 1)"><i
                class="bi bi-chevron-left"></i></button>
          </li>

          <li class="page-item" v-for="page in pagination.pages" :key="page"
            :class="{ active: page === pagination.page }">
            <button class="page-link rounded-2 px-3" @click="changePage(page)">
              {{ page }}
            </button>
          </li>

          <li class="page-item" :class="{ disabled: pagination.page === pagination.pages }">
            <button class="page-link rounded-3 px-3" @click="changePage(pagination.page + 1)"><i
                class="bi bi-chevron-right"></i></button>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- Modal Edição  -->
  <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" ref="editModalEl">
    <div class="modal-dialog modal-dialog-centered ">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title" id="editUserModalLabel">Editar Usuário</h5>
          <button type="button" class="btn-close" @click="closeEditModal" aria-label="Fechar"></button>
        </div>
        <div class="modal-body " v-if="selectedUser">
          <div class="mb-3">
            <label class="form-label fw-bold">Nome:</label>
            <p class="form-control-plaintext border-bottom">{{ selectedUser.name }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Email:</label>
            <p class="form-control-plaintext border-bottom">{{ selectedUser.email }}</p>
          </div>
          <div class="mb-3">
            <label for="role" class="form-label fw-bold">Função:</label>
            <select v-model="selectedUser.role" class="form-select" id="role">
              <option value="padrao">Padrão</option>
              <option value="gestor">Gestor</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="updateUser">Salvar</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modal de detalhes do usuário -->
  <UserInfo :user="userInfoData" @close="closeUserModal" />

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToastStore } from '@/stores/useToastStore'
import axios from 'axios';
import UserInfo from './UserInfo.vue';

const toast = useToastStore()
const users = ref([]);
const pagination = ref({ page: 1, pages: 1, total: 0 });
const selectedUser = ref(null);
const editModalEl = ref(null);
const search = ref('');
let searchTimeout;
const isGestor = ref(true); // verificar isso pelo login/token
let editModalInstance = null;

// Dados do usuário para o modal de informações
const userInfoData = ref(null);

// Buscar usuários paginados
const fetchUsers = async (page = 1) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000/api/users`, {
      params: {
        page,
        limit: 10,
        search: search.value,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    users.value = response.data.users;
    pagination.value = response.data.pagination;
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
  }
};

// Função para obter o URL da foto 
const getUserPhotoUrl = (photo) => {
  if (photo) {
    return `http://localhost:5000${photo}`;
  }
  return null;
}

// Debounce para evitar requisições a cada tecla
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchUsers(1); // sempre volta pra primeira página ao pesquisar
  }, 400);
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.pages) {
    fetchUsers(page);
  }
};

// Abrir modal de detalhes do usuário
const openUserModal = (user) => {
  userInfoData.value = user;
};

// Fechar modal de detalhes do usuário
const closeUserModal = () => {
  userInfoData.value = null;
};

// Modal de edição
const openEditModal = (user) => {
  selectedUser.value = { ...user, role: user.roles }; // Usar roles como valor inicial para role

  // Usar a API modal do Bootstrap corretamente
  import('bootstrap').then(bootstrap => {
    if (editModalEl.value) {
      if (editModalInstance) {
        editModalInstance.dispose();
      }
      editModalInstance = new bootstrap.Modal(editModalEl.value);
      editModalInstance.show();
    }
  });
};

const closeEditModal = () => {
  if (editModalInstance) {
    editModalInstance.hide();
  }
};

const updateUser = async () => {
  const token = localStorage.getItem('token');
  try {
    await axios.put(
      `http://localhost:5000/api/users/${selectedUser.value.id}/role`,
      { newRole: selectedUser.value.role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    closeEditModal();
    fetchUsers(pagination.value.page);
    toast.success('Função do usuário atualizada com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar função:', err);
    toast.error('Erro ao atualizar a função do usuário');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.form-control-plaintext.border-bottom {
  border-bottom: 1px solid #dee2e6 !important;
  padding-bottom: 0.5rem;
}

.user-table-scroll {
  max-height: 400px;
}

@media (max-width: 768px) {
  .user-table-scroll {
    max-height: 300px;
  }
}

.efeito-enbacamento {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease-in-out;
}

.user-photo {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
}
</style>