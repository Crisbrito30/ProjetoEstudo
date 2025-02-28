<template>
    <div v-if="show" class="custom-modal-overlay" @click.self="closeModal">
      <div class="custom-modal">
        <div class="custom-modal-header">
          <slot name="header"></slot>
        </div>
        <div class="custom-modal-body">
          <slot></slot>
        </div>
        <div class="custom-modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    show: {
      type: Boolean,
      required: true,
    }
  });
  
  const emit = defineEmits();
  const closeModal = () => {
    emit('update:show', false);
  };
  
  </script>
  
  <style scoped>
  .custom-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .custom-modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 50%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .custom-modal-header,
  .custom-modal-footer {
    padding: 10px;
    border-bottom: 1px solid #e1e1e1;
  }
  
  .custom-modal-body {
    padding: 20px;
  }
  </style>
  