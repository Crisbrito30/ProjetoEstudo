<template>
    <div class="filters">
      <h3>Filtros</h3>
      
      <!-- Filtro por categoria -->
      <div class="filter-section">
        <h4>Categorias</h4>
        <div v-for="(count, category) in facets.categories" :key="category" class="filter-option">
          <label>
            <input 
              type="checkbox" 
              :value="category" 
              v-model="selectedCategories"
              @change="updateFilters"
            />
            {{ category }} ({{ count }})
          </label>
        </div>
      </div>
      
      <!-- Filtro por faixa de preço -->
      <div class="filter-section" v-if="facets.priceRanges">
        <h4>Faixa de Preço</h4>
        <div v-for="(count, range) in facets.priceRanges" :key="range" class="filter-option">
          <label>
            <input 
              type="radio" 
              :value="range" 
              v-model="selectedPriceRange"
              @change="updateFilters" 
              name="priceRange"
            />
            {{ formatPriceRange(range) }} ({{ count }})
          </label>
        </div>
      </div>
      
      <!-- Botão para limpar filtros -->
      <button 
        v-if="hasActiveFilters" 
        @click="clearFilters" 
        class="clear-filters-btn"
      >
        Limpar Filtros
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Filters',
    props: {
      facets: {
        type: Object,
        default: () => ({ 
          categories: {},
          priceRanges: {} 
        })
      }
    },
    data() {
      return {
        selectedCategories: [],
        selectedPriceRange: null
      };
    },
    computed: {
      hasActiveFilters() {
        return this.selectedCategories.length > 0 || this.selectedPriceRange !== null;
      }
    },
    methods: {
      updateFilters() {
        const filters = {
          categories: this.selectedCategories,
          priceRange: this.selectedPriceRange
        };
        this.$emit('filter-change', filters);
      },
      clearFilters() {
        this.selectedCategories = [];
        this.selectedPriceRange = null;
        this.updateFilters();
      },
      formatPriceRange(range) {
        if (!range) return '';
        
        const [min, max] = range.split('-').map(Number);
        if (isNaN(min) || isNaN(max)) return range;
        
        if (max === Infinity || max === 99999) {
          return `Acima de R$ ${min.toFixed(2)}`;
        } else {
          return `R$ ${min.toFixed(2)} - R$ ${max.toFixed(2)}`;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .filters {
    width: 250px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }
  .filter-section {
    margin-bottom: 20px;
  }
  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 18px;
  }
  h4 {
    margin-bottom: 10px;
    font-size: 16px;
    color: #555;
  }
  .filter-option {
    margin-bottom: 5px;
  }
  .filter-option label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .filter-option input {
    margin-right: 8px;
  }
  .clear-filters-btn {
    width: 100%;
    padding: 8px;
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    color: #555;
    font-size: 14px;
  }
  .clear-filters-btn:hover {
    background-color: #e7e7e7;
  }
  </style>
  