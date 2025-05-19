
<!-- src/views/user.vue -->
<template>
   <navbar />
 
  <UserList />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import UserList from '@/components/userList.vue';
import { ref } from 'vue'
</script>
