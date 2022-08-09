<script setup lang="ts">
import { onBeforeMount, reactive, computed } from 'vue';
import { ElCard, ElIcon } from 'element-plus'
import axios from 'axios'
import HomeChart from './HomeChart.vue';
import HomeTable from './HomeTable.vue';
import type { Report } from 'src/common/js/apiTypes'
import { getFormattedTime, timestampToTime } from '../utils'

type BaseData = {
  data: {
    reportList: Report[]
  },
  error: number
}

interface State {
  result: Report[]
}

const state = reactive<State>({ result: [] })

async function getData(url: string) {
  const response = await axios.get<BaseData>(url)
  return response.data.data.reportList
}

const dashboardInfo = computed(() => {
  let numFailingTests = 0
  let numPassingTests = 0
  let expectCount = 0
  state.result.forEach(item => {
    numFailingTests += item.numFailingTests
    numPassingTests += item.numPassingTests
    expectCount += item.expectCount
  })
  return { numFailingTests, numPassingTests, total: state.result.length, expectCount }
})

const information = computed(() => {
  if (state.result.length === 0) return {}
  let startTime = state.result[0].perfStats.start
  let endTime = 0
  const rootDir = state.result[0].testFilePath.split('/')!.slice(0, -1)!.join('/')
  state.result.forEach(item => {
    startTime = Math.min(item.perfStats.start, startTime)
    endTime = Math.max(item.perfStats.end, endTime)
  })
  const duration = getFormattedTime(startTime, endTime)
  return { startTime: timestampToTime(startTime), endTime: timestampToTime(endTime), duration, rootDir }
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
    <div class="dashboard">
      <div class="small-card">
        <el-card>
          <template #header>
            <div class="card-title">Total Tests</div>
          </template>
          <div class="count dark">{{ dashboardInfo.total }}</div>
        </el-card>
      </div>
      <div class="small-card">
        <el-card>
          <template #header>
            <div class="card-title">Passed Tests</div>
          </template>
          <div class="count">{{ dashboardInfo.numPassingTests }}</div>
        </el-card>
      </div>
      <div class="small-card">
        <el-card>
          <template #header>
            <div class="card-title">Failed Tests</div>
          </template>
          <div class="count fail">{{ dashboardInfo.numFailingTests }}</div>
        </el-card>
      </div>
      <div class="small-card">
        <el-card>
          <template #header>
            <div class="card-title">Total Expect</div>
          </template>
          <div class="count">{{ dashboardInfo.expectCount }}</div>
        </el-card>
      </div>
    </div>
    <div class="info">
      <div class="left">
        <div class="info-item">
          <el-icon>
            <VideoPlay />
          </el-icon>
          <span class="label">StartTime</span>
          <span class="message">{{ information.startTime }}</span>
        </div>
        <div class="info-item">
          <el-icon>
            <SwitchButton />
          </el-icon>
          <span class="label">EndTime</span>
          <span class="message">{{ information.endTime }}</span>
        </div>
      </div>
      <div class="right">
        <div class="info-item">
          <el-icon>
            <Clock />
          </el-icon>
          <span class="label">Duration</span>
          <span class="message">{{ information.duration }}</span>
        </div>
        <div class="info-item">
          <el-icon>
            <Folder />
          </el-icon>
          <span class="label">RootDir</span>
          <span class="message">{{ information.rootDir }}</span>
        </div>
      </div>
    </div>
    <home-chart :file="fileList" :list="chartList" v-if="chartList.length"></home-chart>
    <home-table :list="state.result"></home-table>
  </div>
</template>

<style lang="scss" scoped>
.small-card {
  width: 260px;
  margin-right: 24px;
  display: inline-block;
  font-weight: 900;

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

  .dark {
    color: #909399;
  }

  .card-title {
    font-weight: 600;
  }
}

.info {
  margin-top: 20px;
  display: flex;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  background-color: #fff;
  padding: 20px;

  .left,
  .right {
    flex-basis: 50%;
    margin: -10px 0;
  }

  .info-item {
    display: flex;
    align-items: center;
    margin: 10px 0;

    .label {
      color: #999;
      margin-left: 5px;
      min-width: 100px;
    }

    .message {
      color: rgba(0, 0, 0, 0.85);
    }
  }
}
</style>
