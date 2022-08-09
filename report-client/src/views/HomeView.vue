<script setup lang="ts">
import ResultList from '@/components/ReportList.vue';
import { onBeforeMount } from 'vue';
import { useCounterStore } from '../stores/counter'

const store = useCounterStore()

onBeforeMount(() => {
  store.getData()
})
</script>

<template>
  <div>
    <ResultList />
  </div>
</template>
