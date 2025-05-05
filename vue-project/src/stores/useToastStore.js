import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue3-toastify' 

export const useToastStore = defineStore('toast', () => {
  const history = ref([])

  const addToHistory = (type, message) => {
    history.value.push({ type, message, timestamp: new Date() })
    if (history.value.length > 30) {
      history.value.shift()
    }
  }

  const success = (message, options = {}) => {
    toast.success(message, options)
    addToHistory('success', message)
  }

  const error = (message, options = {}) => {
    toast.error(message, options)
    addToHistory('error', message)
  }

  const info = (message, options = {}) => {
    toast.info(message, options)
    addToHistory('info', message)
  }

  const warning = (message, options = {}) => {
    toast.warning(message, options)
    addToHistory('warning', message)
  }

  return {
    success,
    error,
    info,
    warning,
    history,
    addToHistory,
    clearHistory: () => (history.value = [])
  }
})
