<script setup lang="ts">
import { onBeforeMount, reactive, computed } from 'vue';
import { ElCard } from 'element-plus'
import axios from 'axios'
import HomeChart from './HomeChart.vue';
import HomeTable from './HomeTable.vue';
import type { Report } from 'src/common/js/apiTypes'

type BaseData = {
  data: {
    reportList: Report[]
  },
  errot: number
}

interface State {
  result: Report[]
}

const state = reactive<State>({ result: [] })

async function getData(url: string) {
  const response = await axios.get<BaseData>(url)
  return response.data.data.reportList
}

const totalInfo = computed(() => {
  let numFailingTests = 0
  let numPassingTests = 0
  state.result.forEach(item => {
    numFailingTests += item.numFailingTests
    numPassingTests += item.numPassingTests
  })

  return { numFailingTests, numPassingTests, total: state.result.length }
})

const chartList = computed(() => {
  return state.result.map(item => (item.expectCount || 0))
})

const fileList = computed(() => {
  return state.result.map(item => {
    const list = item.testFilePath.split(/\/|\\/)
    return list[list.length - 1]
  })
})

const isDEV = import.meta.env.DEV
const path = isDEV ? 'http://localhost:8886' : location.origin

onBeforeMount(() => {
  getData(`${path}/common/testResult`).then((res) => {
    state.result = res
  })
})

</script>

<template>
  <div>
     <div class="card">
      <el-card class="box-card">
        <template #header>
          <div class="card-title">Total Tests</div>
        </template>
        <div class="count dark">{{ totalInfo.total }}</div>
      </el-card>
    </div>
    <div class="card">
      <el-card class="box-card">
        <template #header>
          <div class="card-title">Passed Tests</div>
        </template>
        <div class="count">{{ totalInfo.numPassingTests }}</div>
      </el-card>
    </div>
    <div class="card">
      <el-card class="box-card">
        <template #header>
          <div class="card-title">Failed Tests</div>
        </template>
        <div class="count fail">{{ totalInfo.numFailingTests }}</div>
      </el-card>
    </div>
    <home-chart :file="fileList" :list="chartList" v-if="chartList.length"></home-chart>
    <home-table :list="state.result"></home-table>
  </div>
</template>

<style scoped>
.count {
  color: #0ebf8c;
  text-align: center;
  font-weight: 600;
  font-size: 32px;
  line-height: 1.1;
}
.fail {
  color: rgb(207, 19, 34);
}

.card {
  width: 260px;
  margin-right: 24px;
  display: inline-block;
  font-weight: 900;
}

.dark {
  color: #909399;
}

.card-title {
  font-weight: 600;
}
</style>
