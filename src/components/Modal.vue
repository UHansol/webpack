<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  // 親Componentsから継承
  props: ['title']
}
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: auto;
}
h3{
  text-align: center;
}
</style>
