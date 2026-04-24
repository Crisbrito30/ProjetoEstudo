import { ref, watchEffect } from "vue";

const theme = ref(localStorage.getItem("theme") || "light");

const setTheme = (newTheme) => {
  theme.value = newTheme;
  localStorage.setItem("theme", newTheme);
  document.documentElement.setAttribute("data-bs-theme", newTheme);
};

watchEffect(() => {
  document.documentElement.setAttribute("data-bs-theme", theme.value);
});

export default function useTheme() {
  return { theme, setTheme };
}
