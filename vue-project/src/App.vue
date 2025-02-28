<template>

  <div class="bacggroudFundo">

    <RouterView />
  </div>

</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router';

const handleLogin = (response) => {
  console.log('Token JWT:', response.credential)
}

</script>

<style scoped>
.bacggroudFundo {
    min-height: 100vh;
    background: #0f0c29;
    background: linear-gradient(to right, #24243e, #302b63, #0f0c29);
    position: relative;
    overflow: hidden;
    background-image: url('./public/ceuNoiteAzul.jpg');
    background-repeat: no-repeat;
    height: 100vh;
    background-size: cover;
}
</style>
