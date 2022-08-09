<script setup lang="ts">
import ResultList from '@/views/HomeView/components/ReportList.vue';
import HomeChart from '@/views/HomeView/components/HomeChart.vue';
import HomeTable from '@/views/HomeView/components/HomeTable.vue';
import { onBeforeMount, computed } from 'vue';
import { useCounterStore } from '../../stores/counter'

const store = useCounterStore()

onBeforeMount(() => {
  store.getData()
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
  <div>
    <ResultList />
    <HomeChart :file="fileList" :list="chartList" v-if="chartList.length"  />
    <HomeTable :list="store.reportList" />
  </div>
</template>
