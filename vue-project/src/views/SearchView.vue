<template>
  <div class="search-app">
    <header class="search-header">
      <h1>Meu Mecanismo de Busca</h1>
      <SearchBar 
        :initialValue="query" 
        @search="handleSearch" 
      />
    </header>
    
    <div class="search-container">
      <aside class="search-filters">
        <Filters 
          :filters="filters" 
          @filter-change="handleFilterChange" 
        />
      </aside>
      
      <main class="search-results">
        <div v-if="loading" class="loading-spinner">
          Carregando...
        </div>
        <div v-else>
          <p class="results-count" v-if="query">
            {{ totalResults }} resultados encontrados para "{{ query }}"
          </p>
          <ResultList :results="results" />
          <Pagination 
            :currentPage="currentPage"
            :totalPages="Math.ceil(totalResults / 10)"
            @page-change="handlePageChange"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import ResultList from '../components/ResultList.vue';
import Filters from '../components/Filters.vue';
import Pagination from '../components/Pagination.vue';

// Estado reativo
const query = ref('');
const results = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalResults = ref(0);
const filters = ref({
  categories: [],
  priceRange: [0, 1000],
  sortBy: 'relevance'
});

// Monitorar mudanças que devem disparar novas buscas
watch([query, currentPage, filters], () => {
  if (query.value.length > 2) {
    performSearch();
  }
}, { deep: true });

// Função de busca
const performSearch = async () => {
  loading.value = true;
  try {
    const response = await fetch(`http://localhost:3001/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.value,
        page: currentPage.value,
        filters: filters.value,
        hitsPerPage: 10
      }),
    });
    
    const data = await response.json();
    results.value = data.hits;
    totalResults.value = data.nbHits;
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
  } finally {
    loading.value = false;
  }
};

// Manipuladores de eventos
const handleSearch = (searchQuery) => {
  query.value = searchQuery;
  currentPage.value = 1;
};

const handleFilterChange = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters };
  currentPage.value = 1;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};
</script>

<style>
.search-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  gap: 30px;
}

.search-filters {
  flex: 0 0 250px;
}

.search-results {
  flex: 1;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
}

.results-count {
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
}
</style>