<template>
    <div class="dropdown btn " @click="toggleDropdown" :class="{'is-open': isOpen}">
      <button class="dropdown">Menu</button>
      <div v-if="isOpen" class="dropdown-menu">
        <ul>
          <li><a href="#" @click.prevent="selectOption('Option 1')">Option 1</a></li>
          <li><a href="#" @click.prevent="selectOption('Option 2')">Option 2</a></li>
          <li><a href="#" @click.prevent="selectOption('Option 3')">Option 3</a></li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const isOpen = ref(false)
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }
  
  const selectOption = (option) => {
    console.log(`Selected: ${option}`)
    isOpen.value = false
  }
  </script>
  
  <style scoped>
  .dropdown {
    position: relative;
    display: inline-block;
    border: none ;
;
  }
  
 
  .dropdown-button:hover {
    background-color: #0056b3;
   
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    width: 200px;
    border-radius: 4px;
    z-index: 1;
  }
  
  .dropdown-menu ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  
  .dropdown-menu ul li {
    padding: 10px;
  }
  
  .dropdown-menu ul li a {
    text-decoration: none;
    color: #333;
    display: block;
  }
  
  .dropdown-menu ul li a:hover {
    background-color: #f1f1f1;
  }
  
  .is-open .dropdown-menu {
    display: block;
  }
  </style>
  