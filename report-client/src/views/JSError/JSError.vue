<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useCounterStore } from '../../stores/counter'

import type { ErrorItem } from "src/common/js/apiTypes";

import { ElEmpty } from 'element-plus'

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
  <template v-if="tableData.length">
    <template v-for="(item, idx) in tableData" :key="idx">
      <ErrorTable :list="item.lists" :file="item.file" />
    </template>
  </template>
  <el-empty v-else description="No Error" />
</template>
