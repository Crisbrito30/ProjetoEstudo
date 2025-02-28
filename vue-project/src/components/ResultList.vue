<template>
    <div class="result-list">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando resultados...</p>
      </div>
      <div v-else-if="results.length === 0" class="no-results">
        <p>Nenhum resultado encontrado</p>
      </div>
      <div v-else class="results-container">
        <div v-for="result in results" :key="result.id" class="result-item">
          <h3 v-html="highlight(result.title || result.name)"></h3>
          <p v-if="result.description" v-html="highlight(result.description)"></p>
          <div class="result-meta">
            <span v-if="result.price">Preço: R$ {{ result.price.toFixed(2) }}</span>
            <span v-if="result.category">Categoria: {{ result.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ResultList',
    props: {
      results: {
        type: Array,
        required: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      query: {
        type: String,
        default: ''
      }
    },
    methods: {
      highlight(text) {
        if (!this.query || !text) return text;
        
        const regex = new RegExp(`(${this.query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
      }
    }
  };
  </script>
  
  <style scoped>
  .result-list {
    width: 100%;
  }
  .results-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .result-item {
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #fff;
    transition: box-shadow 0.3s ease;
  }
  .result-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .result-meta {
    display: flex;
    gap: 15px;
    margin-top: 10px;
    font-size: 0.9em;
    color: #666;
  }
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
  }
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }
  .no-results {
    text-align: center;
    padding: 30px;
    color: #666;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  mark {
    background-color: #ffeb3b;
    padding: 0 2px;
  }
  </style>