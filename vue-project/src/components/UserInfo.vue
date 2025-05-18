<template>
    <div class="modal fade" id="userInfoModal" tabindex="-1" aria-labelledby="userInfoModalLabel" ref="modalEl">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content shadow-lg border-0 rounded-4">
          <div class="modal-header bg-light border-bottom-0 rounded-top-4">
            <h5 class="modal-title fw-semibold" id="userInfoModalLabel">Detalhes do Usuário</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Fechar"></button>
          </div>
  
          <div class="modal-body px-4 py-3" v-if="user">
            <div class="text-center mb-4">
              <img
                v-if="getUserPhotoUrl(user.photo)"
                :src="getUserPhotoUrl(user.photo)"
                alt="Foto do usuário"
                class="rounded-circle border border-2 border-secondary-subtle shadow-sm"
                style="width: 90px; height: 90px; object-fit: cover;"
              />
              <i v-else class="bi bi-person-circle fs-1 text-secondary"></i>
            </div>
  
            <div class="mb-3">
              <p class="mb-2">
                <i class="bi bi-person-fill me-2 text-muted"></i>
                <strong>Nome:</strong> {{ user.name }}
              </p>
              <p class="mb-2">
                <i class="bi bi-envelope-fill me-2 text-muted"></i>
                <strong>Email:</strong> {{ user.email }}
              </p>
              <p class="mb-2">
                <i class="bi bi-telephone-fill me-2 text-muted"></i>
                <strong>Telefone:</strong> {{ user.phone }}
              </p>
              <p class="mb-0">
                <i class="bi bi-shield-lock-fill me-2 text-muted"></i>
                <strong>Função:</strong>
                <span v-if="user.roles === 'padrao'" class="badge bg-secondary-subtle text-dark">Padrão</span>
                <span v-else-if="user.roles === 'gestor'" class="badge bg-primary-subtle text-primary">Gestor</span>
                <span v-else-if="user.roles === 'administrador'" class="badge bg-success-subtle text-success-emphasis">Administrador</span>
                <span v-else class="badge bg-light text-dark">{{ user.roles }}</span>
              </p>
            </div>
          </div>
  
          <div class="modal-footer bg-light border-top-0 rounded-bottom-4">
            <button type="button" class="btn btn-outline-secondary" @click="closeModal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref,  watch, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    user: Object
  });
  
  const emit = defineEmits(['close']);
  const modalEl = ref(null);
  let modalInstance = null;
  
  // Função para obter o URL da foto
  const getUserPhotoUrl = (photo) => {
    if (photo) {
      return `http://localhost:5000${photo}`;
    }
    return null;
  };
  
  // Fechar o modal
  const closeModal = () => {
    if (modalInstance) {
      modalInstance.hide();
      emit('close');
    }
  };
  
  // Inicializar e mostrar o modal quando o componente for montado
  watch(() => props.user, (newVal) => {
    if (newVal) {
      import('bootstrap').then(bootstrap => {
        if (modalEl.value) {
          // Se já existe uma instância, a destruímos primeiro
          if (modalInstance) {
            modalInstance.dispose();
          }
          // Criamos uma nova instância do modal
          modalInstance = new bootstrap.Modal(modalEl.value);
          modalInstance.show();
          
          // Adicionar evento quando o modal fechar
          modalEl.value.addEventListener('hidden.bs.modal', () => {
            emit('close');
          });
        }
      });
    }
  }, { immediate: true });
  </script>