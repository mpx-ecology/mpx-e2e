<script setup lang="ts">
import { onBeforeMount, reactive, computed } from 'vue';
import axios from 'axios'
import { ElImage, ElEmpty, ElScrollbar, ElDivider, ElTag } from 'element-plus'
import type { Report, Img } from 'src/common/js/apiTypes'

type BaseData = {
  data: {
    reportList: Report[]
  },
  errot: number
}

interface State {
  imgList: { title: string, list: Img[], preview: string[] }[]
}

const state = reactive<State>({ imgList: [] })

async function getData(url: string) {
  const response = await axios.get<BaseData>(url)
  return response.data.data.reportList
}

const isDEV = import.meta.env.DEV
const path = isDEV ? 'http://localhost:8886' : location.origin

onBeforeMount(() => {
  getData(`${path}/common/imgList`).then((res) => {
    res.forEach(item => {
      if (item.imgList && item.imgList.length) {
        const imgList: Img[] = item.imgList.map(img => {
          const title = img.path.split(/\/|\\/).pop() || ''
          const time = new Date(img.time || 0)
          // const YY = time.getFullYear()
          // const MM = time.getMonth() + 1
          // const DD = time.getDate()
          const h = time.getHours()
          const m = time.getMinutes()
          const s = time.getSeconds()
          return Object.assign({}, img, { path: title, time: `${h}:${m}:${s}` })
        })
        state.imgList.push({
          title: item.testFilePath.split(/\/|\\/).pop() || '',
          list: imgList,
          preview: item.imgList.map(img => img.src)
        })
      }
    })
  })
})

const isEmpty = computed(() => {
  return state.imgList.length === 0
})

</script>

<template>
  <div>
    <div class="step" v-for="(item, index) in state.imgList" :key="index">
      <el-divider content-position="left">{{item.title}}</el-divider>
      <el-scrollbar>
        <div class="scrollbar-flex-content">
          <div v-for="(img, idx) in item.list" :key="idx">
            <el-image class="image" :src="img.src" fit="contain" :preview-src-list="item.preview" :initial-index="idx" />
            <div class="step">
              <div>{{ img.path }}</div>
              <el-tag>{{ img.page }}</el-tag>
              <el-tag style="margin-left: 12px;">{{ img.time }}</el-tag>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-empty v-if="isEmpty" description="No Data" />
  </div>
</template>

<style scoped>
.scrollbar-flex-content {
  display: flex;
}

.image {
  width: 200px;
  height: 300px;
  background: #000;
  border: 1px solid #000;
  margin-right: 12px;
}

.step {
  margin-bottom: 20px;
  color: #909399;
}
</style>
