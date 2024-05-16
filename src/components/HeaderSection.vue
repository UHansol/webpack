<template>
  <div style="height : 100px" align="center">
    <h1>ユーザー情報一覧</h1>
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
        });
    });
  }
}
</script>
