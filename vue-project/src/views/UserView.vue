
<!-- src/views/user.vue -->
<template>
  <navbar />
  
  <div class="pt-4 m-2">
    <UserList />
  </div>
</template>
<script setup>
import Navbar from '@/components/Navbar.vue';
import UserList from '@/components/userList.vue';
import { ref } from 'vue'
</script>
