<template>
  <div class="container mt-5 p-4 rounded efeito-enbacamento">
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
                <div class="user-photo-container" style="cursor: pointer;" @click="setUserForModal(user)" 
                     data-bs-toggle="modal" data-bs-target="#userInfoModal">
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
                <span v-if="user.roles === 'padrao'" class="bg-secondary-subtle px-2 py-1 rounded fw-bold">Padrão</span>
                <span v-else-if="user.roles === 'gestor'"
                  class="bg-primary-subtle text-primary fw-bold px-2 py-1 rounded">Gestor</span>
                <span v-else-if="user.roles === 'administrador'"
                  class="bg-success-subtle text-success-emphasis fw-bold px-2 py-1 rounded">Administrador</span>
                <span v-else>{{ user.roles }}</span>
              </td>
              <td>
                <button v-if="isGestor" class="btn btn-sm border-warning me-1" 
                        @click="setUserForModal(user)" 
                        data-bs-toggle="modal" 
                        data-bs-target="#editUserModal">
                  <i class="bi bi-pencil-fill text-warning"></i>
                </button>
                <button v-if="isGestor" class="btn btn-sm border-danger" 
                        @click="setUserForModal(user)"
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteUserModal">
                  <i class="bi bi-trash-fill text-danger"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginação -->
    <div class="container px-0 m-3">
      <nav v-if="pagination?.pages > 1" aria-label="Paginação">
        <ul class="pagination justify-content-center gap-2">
          <li class="page-item" :class="{ disabled: pagination.page === 1 }">
            <button class="page-link rounded-2 px-3" @click="changePage(pagination.page - 1)">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          <li class="page-item" v-for="page in pagination.pages" :key="page"
            :class="{ active: page === pagination.page }">
            <button class="page-link rounded-2 px-3" @click="changePage(page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: pagination.page === pagination.pages }">
            <button class="page-link rounded-3 px-3" @click="changePage(pagination.page + 1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- Modal de Informações do Usuário -->
  <div class="modal fade" id="userInfoModal" tabindex="-1" aria-labelledby="userInfoModalLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title" id="userInfoModalLabel">Informações do Usuário</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
        </div>
        <div class="modal-body" v-if="selectedUser">
          <div class="text-center mb-3">
            <img v-if="getUserPhotoUrl(selectedUser.photo)" 
                 :src="getUserPhotoUrl(selectedUser.photo)" 
                 alt="Foto do usuário" 
                 class="rounded-circle" 
                 style="width: 80px; height: 80px; object-fit: cover;" />
            <i v-else class="bi bi-person-circle" style="font-size: 80px;"></i>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">ID:</label>
            <p class="form-control-plaintext border-bottom">{{ selectedUser.id }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Nome:</label>
            <p class="form-control-plaintext border-bottom">{{ selectedUser.name }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Email:</label>
            <p class="form-control-plaintext border-bottom">{{ selectedUser.email }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Telefone:</label>
            <p class="form-control-plaintext border-bottom">{{ selectedUser.phone }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Função:</label>
            <p class="form-control-plaintext border-bottom">{{ selectedUser.roles }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Edição -->
  <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title" id="editUserModalLabel">Editar Usuário</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
        </div>
        <div class="modal-body" v-if="selectedUser">
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
            <select v-model="editForm.role" class="form-select text-dark" id="role">
              <option value="padrao">Padrão</option>
              <option value="gestor">Gestor</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-success" @click="updateUser">Salvar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação de Exclusão -->
  <div class="modal fade" id="deleteUserModal" tabindex="-1" aria-labelledby="deleteUserModalLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger-subtle">
          <h5 class="modal-title text-danger" id="deleteUserModalLabel">Confirmar Exclusão</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja excluir o usuário <strong>{{ selectedUser?.name }}</strong>?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="confirmDeleteUser">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useToastStore } from '@/stores/useToastStore';
import axios from 'axios';

const toast = useToastStore();
const users = ref([]);
const pagination = ref({ page: 1, pages: 1, total: 0 });
const selectedUser = ref(null);
const search = ref('');
const isGestor = ref(true);
let searchTimeout;

// Formulário reativo para edição
const editForm = reactive({
  role: ''
});

// Função unificada para definir o usuário selecionado
const setUserForModal = (user) => {
  selectedUser.value = { ...user };
  editForm.role = user.roles; // Preenche o formulário de edição
};

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

    users.value = response.data.data.users;
    pagination.value = response.data.data.pagination;
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    toast.error('Erro ao buscar usuários');
  }
};

// Função para obter o URL da foto
const getUserPhotoUrl = (photo) => {
  if (photo && photo.data) {
    const path = new TextDecoder().decode(new Uint8Array(photo.data));
    return `http://localhost:5000${path}`;
  }
  return null;
};

// Debounce para evitar requisições a cada tecla
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchUsers(1);
  }, 400);
};

// Função para fechar modal
const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  const closeButton = modal?.querySelector('[data-bs-dismiss="modal"]');
  closeButton?.click();
};

// Mudança de página
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.pages) {
    fetchUsers(page);
  }
};

// Atualizar usuário
const updateUser = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(
      `http://localhost:5000/api/users/${selectedUser.value.id}/role`,
      { newRole: editForm.role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Resposta da atualização:', response.data);

    // Fechar modal
    closeModal('editUserModal');

    toast.success('Função do usuário atualizada com sucesso!');
    await fetchUsers(pagination.value.page);
  } catch (err) {
    console.error('Erro ao atualizar função:', err);
    toast.error('Erro ao atualizar a função do usuário');
  }
};

// Confirmar e deletar usuário
const confirmDeleteUser = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(`http://localhost:5000/api/users/${selectedUser.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Resposta da exclusão:', response.data);

    // Fechar modal
    closeModal('deleteUserModal');

    toast.success('Usuário deletado com sucesso');
    await fetchUsers(pagination.value.page);
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    toast.error('Erro ao deletar usuário');
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