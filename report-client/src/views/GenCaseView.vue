<template>
<div>
  <highlight-js
      autodectect
      language="js"
      :code="code"
  />
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const code = ref('');

setTimeout(() => {
  code.value = 'var g = null;'
}, 5000)

</script>

<style scoped>

</style>
