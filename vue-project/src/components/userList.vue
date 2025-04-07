<template>
  <div class="container mt-5 bg-white p-4 rounded shadow-sm">
    <h1>Lista de Usuários</h1>

    <!-- Tabela -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Função</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span v-if="user.roles === 'padrao'" class="text-secondary">Padrão</span>
              <span v-else-if="user.roles === 'gestor'" class="text-primary fw-bold">Gestor</span>
              <span v-else-if="user.roles === 'administrador'" class="text-danger fw-bold">Administrador</span>
              <span v-else>{{ user.roles }}</span>
            </td>
            <td>
              <button v-if="isGestor" class="btn btn-sm btn-light" data-bs-toggle="modal" data-bs-target="#editUserModal" @click="editUser(user)">
                <i class="bi bi-pencil-fill text-warning"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div class="container px-0">
      <nav v-if="pagination.pages > 1" aria-label="Paginação">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: pagination.page === 1 }">
            <button class="page-link" @click="changePage(pagination.page - 1)">Previous</button>
          </li>

          <li class="page-item" v-for="page in pagination.pages" :key="page"
            :class="{ active: page === pagination.page }">
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>

          <li class="page-item" :class="{ disabled: pagination.page === pagination.pages }">
            <button class="page-link" @click="changePage(pagination.page + 1)">Next</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal Edição com Bootstrap nativo -->
    <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true" ref="modalEl">
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
              <select v-model="selectedUser.role" class="form-select" id="role">
                <option value="padrao">Padrão</option>
                <option value="gestor">Gestor</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="updateUser">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const pagination = ref({ page: 1, pages: 1, total: 0 });
const selectedUser = ref(null);
const modalEl = ref(null);
const limit = 5;
const isGestor = ref(true); // Supondo que você vai verificar isso pelo login/token

// Buscar usuários paginados
const fetchUsers = async (page = 1) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000/api/users?page=${page}&limit=${limit}`, {
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

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.pages) {
    fetchUsers(page);
  }
};

const editUser = (user) => {
  selectedUser.value = { ...user, role: user.roles }; // Usar roles como valor inicial para role
};

// Método alternativo para fechar o modal sem usar diretamente o objeto bootstrap
const closeModal = () => {
  const closeButton = document.querySelector('#editUserModal .btn-close');
  if (closeButton) {
    closeButton.click();
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
    
    // Fechar o modal clicando no botão de fechar
    closeModal();
    
    fetchUsers(pagination.value.page);
    alert('Função do usuário atualizada com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar função:', err);
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
</style>