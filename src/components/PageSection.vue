<template>
  <div align="center">
    <button v-for="page in pageCount" :key="page" @click="changePage(page)">{{ page }}</button>
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
  methods: {
    changePage(page) {
      this.$emit('page-changed', page);
    }
  }
};
</script>

<style scoped>



button {
  margin-top: 50px;
 font-size:20px  ;
 margin-left: 5px;
}

</style>