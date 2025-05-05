
<!-- src/views/user.vue -->
<template>
   <navbar />
  <div class="">
      <h1>Página do Usuários</h1>
      
  </div>
  <UserList />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import UserList from '@/components/userList.vue';
import { ref } from 'vue'
</script>
