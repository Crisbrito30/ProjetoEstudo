<template>
    <!-- Exibe o modal apenas quando `modelValue` for true -->
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <header class="modal-header">
                <!-- Slot para o header (opcional) -->
                <slot name="header">
                    <h3>{{ title }}</h3>
                </slot>
                <button class="modal-close" @click="close">&times;</button>
            </header>
            <section class="modal-body">
                <!-- Slot principal para o conteúdo do modal -->
                <slot>
                    Conteúdo do modal...
                </slot>
            </section>
            <footer class="modal-footer">
                <!-- Slot para o footer (opcional) -->
                <slot name="footer">
                    <button @click="close">Fechar</button>
                </slot>
            </footer>
        </div>
    </div>
    <Modal v-model="isModalOpen" title="Meu Modal Personalizado">

        <template #header>
            <h2>{{ titulo }}</h2>
        </template>
        <p>{{ conteudo }}</p>
        <template #footer>
            <button class="btn btn-primary" @click="closeModal">Fechar</button>
        </template>
    </Modal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// Estado para controlar a visibilidade do modal
const isModalOpen = ref(false)

// Função para abrir o modal
function openModal() {
  isModalOpen.value = true
}

// Função para fechar o modal
function closeModal() {
  isModalOpen.value = false
}



onMounted(() => {
  // Seleciona todos os elementos que possuem o atributo data-bs-toggle="popover"
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
  popoverTriggerList.forEach(popoverTriggerEl => {
    new bootstrap.Popover(popoverTriggerEl)
  })
})
// Definindo as props que o modal receberá
const props = defineProps({
    // Usando v-model com prop "modelValue"
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Título do Modal'
    }
})

// Define os eventos que serão emitidos
const emit = defineEmits(['update:modelValue'])

// Função para fechar o modal
function close() {
    emit('update:modelValue', false)
}
</script>

<style scoped>
/* Estilo da sobreposição */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* Estilo do conteúdo do modal */
.modal-content {
    background: #fff;
    border-radius: 5px;
    padding: 1rem;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Cabeçalho e rodapé */
.modal-header,
.modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

/* Botão de fechar */
.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}
</style>