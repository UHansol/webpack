<template>
  <div align="center">
    <span @click="changePage(1)" :class="{ disabled: currentPage === 1 }" class="pagination-btn"
      style="cursor: default;">&lt;&lt;</span>
    <span @click="changePage(currentPage - 1)" :class="{ disabled: currentPage === 1 }" class="pagination-btn"
      style="cursor: default;">&lt;</span>
    <span v-for="page in displayedPages" :key="page" @click="changePage(page)" :class="{ active: currentPage === page }"
      class="pagination-btn" style="cursor: default;">{{ page }}</span>
    <span @click="changePage(currentPage + 1)" :class="{ disabled: currentPage === pageCount }" class="pagination-btn"
      style="cursor: default;">&gt;</span>
    <span @click="changePage(pageCount)" :class="{ disabled: currentPage === pageCount }" class="pagination-btn"
      style="cursor: default;">&gt;&gt;</span>
  </div>
</template>

<script>
export default {
  name: 'PageSection',
  props: {
    pageCount: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    displayedPages() {
      const groupSize = 5;
      const currentGroup = Math.ceil(this.currentPage / groupSize);
      const startPage = (currentGroup - 1) * groupSize + 1;
      const endPage = Math.min(startPage + groupSize - 1, this.pageCount);
      return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    }
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.pageCount) {
        this.$emit('page-changed', page);
      }
    }
  }
};
</script>

<style scoped>
.pagination-btn {
  margin-top: 10px;
  font-size: 16px;
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
}

.pagination-btn.active {
  color: red;
}

.pagination-btn.disabled {
  color: gray;
  cursor: not-allowed;
}
</style>
