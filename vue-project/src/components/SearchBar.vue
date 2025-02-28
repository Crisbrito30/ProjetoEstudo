<!-- components/SearchBar.vue -->
<template>
  <form class="search-bar" @submit.prevent="emitSearch">
    <input
      type="text"
      v-model="inputValue"
      placeholder="Digite sua busca..."
      class="search-input"
    />
    <button type="submit" class="search-button">
      Buscar
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  initialValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['search']);
const inputValue = ref(props.initialValue);

const emitSearch = () => {
  emit('search', inputValue.value);
};
</script>

<style scoped>
.search-bar {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 15px 25px;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0 30px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
}

.search-button:hover {
  background-color: #2980b9;
}
</style>
