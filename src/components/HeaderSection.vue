<template>
  <div style="height : 100px">
    <h1>個人情報管理システム</h1>
      <h2>{{ currentTime }}</h2>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'HeaderSection',
  data() {
    return {
      currentTime: '',
    }
  }
  ,
  mounted() {
    setInterval(() => {
      axios.get('/api/clock')
        .then(response => {
          this.currentTime = response.data;
        })
        .catch(error => {
          console.error('Error fetching clock:', error);
        });
    });
  }
}
</script>
