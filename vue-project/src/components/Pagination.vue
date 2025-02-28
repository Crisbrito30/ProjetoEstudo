<template>
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="changePage(1)"
      >
        &laquo;
      </button>
      
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        &lt;
      </button>
      
      <div class="page-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          class="page-btn" 
          :class="{'active': page === currentPage}"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        &gt;
      </button>
      
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="changePage(totalPages)"
      >
        &raquo;
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Pagination',
    props: {
      currentPage: {
        type: Number,
        required: true
      },
      totalItems: {
        type: Number,
        required: true
      },
      itemsPerPage: {
        type: Number,
        default: 10
      },
      maxVisiblePages: {
        type: Number,
        default: 5
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
      },
      visiblePages() {
        if (this.totalPages <= this.maxVisiblePages) {
          return Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
        
        let start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
        let end = start + this.maxVisiblePages - 1;
        
        if (end > this.totalPages) {
          end = this.totalPages;
          start = Math.max(1, end - this.maxVisiblePages + 1);
        }
        
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
    },
    methods: {
      changePage(page) {
        if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
          this.$emit('page-change', page);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    gap: 5px;
  }
  .page-numbers {
    display: flex;
    gap: 5px;
  }
  .page-btn {
    min-width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    color: #333;
    font-size: 14px;
    transition: all 0.2s;
  }
  .page-btn:hover:not(:disabled) {
    background-color: #e0e0e0;
  }
  .page-btn.active {
    background-color: #2196F3;
    color: white;
    border-color: #2196F3;
  }
  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  