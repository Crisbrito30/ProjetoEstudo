<template>
    <div class="container mt-5">
      <h1>Lista de Usuários</h1>
  
      <!-- Tabela de usuários -->
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
            <td>{{ user.role }}</td>
            <td>
              <!-- Botão de edição aparece apenas se o usuário for um gestor -->
              <button v-if="isGestor" @click="editUser(user)" class="btn btn-warning btn-sm">
                Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal para edição de usuário -->
      <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Usuário</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div>
                <label for="role">Função:</label>
                <select v-model="selectedUser.role" class="form-control" id="role">
                  <option value="padrao">Padrão</option>
                  <option value="gestor">Gestor</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
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
  const showModal = ref(false);
  const selectedUser = ref(null);
  const isGestor = ref(false); // Variável para verificar se o usuário é um gestor
  
  // Função para pegar usuários
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users'); // Supondo que esta rota retorne a lista de usuários
      users.value = response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };
  
  // Função para verificar se o usuário é um gestor
  const checkRole = () => {
    const token = localStorage.getItem('token'); // Supondo que o token esteja armazenado no localStorage
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (decoded.role === 'gestor') {
      isGestor.value = true;
    }
  };
  
  // Função para editar usuário
  const editUser = (user) => {
    selectedUser.value = { ...user }; // Clona o usuário para edição
    showModal.value = true;
  };
  
  // Função para fechar o modal
  const closeModal = () => {
    showModal.value = false;
  };
  
  // Função para atualizar o usuário
  const updateUser = async () => {
    try {
      await axios.put(`/api/users/${selectedUser.value.id}/role`, { role: selectedUser.value.role });
      fetchUsers(); // Atualiza a lista de usuários após a edição
      closeModal(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };
  
  // Carrega os dados ao montar o componente
  onMounted(() => {
    fetchUsers();
    checkRole();
  });
  </script>
  
  <style scoped>
  .modal-backdrop {
    z-index: 1040 !important;
  }
  </style>
  