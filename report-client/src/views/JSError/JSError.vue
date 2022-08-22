<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useCounterStore } from '../../stores/counter'

import type { ErrorItem } from "src/common/js/apiTypes";

import ErrorTable from './components/ErrorTable.vue';
import InfoCard from './components/InfoCard.vue'

const store = useCounterStore()

interface errorTable {
  lists: ErrorItem[],
  file: string,
}

/** 表格数据处理 */
const tableData = computed(() => {
  const result: errorTable[] = [];
  store.reportList.forEach((i) => {
    const temp: errorTable = {lists: [],file:''}
    if (i.errorList?.length > 0) {
      temp.lists = i.errorList
      temp.file = i.testFilePath.split(/\/|\\/).pop() || ''
      result.push(temp)
    }
  });
  return result;
});

</script>

<template>
  <InfoCard />
  <template v-for="item in tableData">
    <ErrorTable :list="item.lists" :file="item.file" />
  </template>
</template>
