<template>

<div :class="['backgroundFundo', theme]">
  
    <RouterView />
  </div>

</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router';
import useTheme from "@/stores/useTheme"

const { theme } = useTheme()

const handleLogin = (response) => {
  console.log('Token JWT:', response.credential)
}

</script>


<style scoped>

</style>
