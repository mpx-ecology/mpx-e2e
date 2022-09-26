<script setup lang='ts'>
import { computed } from '@vue/reactivity';
import { useCounterStore } from '../../../stores/counter'
const store = useCounterStore()

const showInfo = computed(() => {
  const { 
    brand,
    model,
    platform,
    screenHeight,
    screenWidth,
    system } = store.systemInfo
  return {
    brand,
    model,
    platform,
    screenHeight,
    screenWidth,
    system
  }
})

</script>

<template>
  <div class="info">
    <div class="info-item" v-for="[key, value] of Object.entries(showInfo)" :key="key">
      <span class="label">{{ key }}:</span>
      <span class="message">{{ value }}</span>
    </div>
  </div>
</template>
<style lang='scss' scoped>
.info {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;
  display: flex;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  background-color: #fff;
  padding: 20px;
}

.info-item {
  flex: 0 0 33%;
  display: flex;
  align-items: center;
  margin: 5px 0;

  .label {
    color: #999;
    min-width: 100px;
    text-align: left;
  }

  .message {
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>
