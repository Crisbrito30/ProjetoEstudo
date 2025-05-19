<template>
    <div>
      <button @click="toggleTheme" class="theme-toggle "> Tema 
            <div class="theme-toggle-icon ">
                <i v-if="theme === 'dark'" class="bi bi-sun-fill icon"></i>
                <i v-else class="bi bi-moon-fill icon"></i>
            </div>
        </button>
    </div>
</template>

<script setup>
import useTheme from "@/stores/useTheme";

//mudanca de tema 
const { theme, setTheme } = useTheme();

const toggleTheme = () => {
    setTheme(theme.value === "light" ? "dark" : "light");
};

</script>
<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 40px;
  border-radius: 22%;
  border: none;
  background: transparent;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s;
  margin-left: 10px;

}



.theme-toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.5, 1.5, 0.8, 1);

}

.theme-toggle:active .theme-toggle-icon {
  transform: scale(0.9);
}



/* Animação dos ícones */
.icon {
  opacity: 0;
  animation: fadeAndRotate 0.5s ease forwards;
}

@keyframes fadeAndRotate {
  from {
    opacity: 0;
    transform: rotate(-45deg);
  }
  to {
    opacity: 1;
    transform: rotate(0);
  }
}
</style>