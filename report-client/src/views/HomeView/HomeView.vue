<script setup lang="ts">
import { onBeforeMount, computed } from 'vue';
import { useCounterStore } from '../../stores/counter'

import ResultList from './components/ReportList.vue';
import HomeChart from './components/HomeChart.vue';
import HomeTable from './components/HomeTable.vue';

const store = useCounterStore()

onBeforeMount(() => {
  store.getData()
  store.getSystemInfo()
})

const chartList = computed(() => {
  return store.reportList.map(item => (item.expectCount || 0))
})

const fileList = computed(() => {
  return store.reportList.map(item => {
    const list = item.testFilePath.split(/\/|\\/)
    return list[list.length - 1]
  })
})
</script>

<template>
  <ResultList />
  <HomeChart :file="fileList" :list="chartList" v-if="chartList.length"  />
  <HomeTable :list="store.reportList" />
</template>
