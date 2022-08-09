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
  imgList: { title: string, list: Info[], preview: string[] }[]
}

type Info = {
  time: string,
  path: string,
  page: string,
  src: string,
  imgStyle: {
    width?: string,
    height?: string,
    left?: string,
    top?: string
  },
  wrapStyle: {
    width?: string,
    height?: string,
  }
}

const state = reactive<State>({ imgList: [] })

async function getData(url: string) {
  const response = await axios.get<BaseData>(url)
  return response.data.data.reportList
}

const isDEV = import.meta.env.DEV
const path = isDEV ? 'http://localhost:8886' : location.origin

const addZero = (num: number) => {
  return num < 10 ? `0${num}` : `${num}`
}

onBeforeMount(() => {
  getData(`${path}/common/imgList`).then((res) => {
    res.forEach(item => {
      if (item.imgList && item.imgList.length) {
        const imgList: Info[] = item.imgList.map(img => {
          const title = img.path.split(/\/|\\/).pop() || ''
          const time = new Date(img.time || 0)
          const YY = time.getFullYear()
          const MM = addZero(time.getMonth() + 1)
          const DD = addZero(time.getDate())
          const h = addZero(time.getHours())
          const m = addZero(time.getMinutes())
          const s = addZero(time.getSeconds())
          const detail = `${YY}-${MM}-${DD} ${h}:${m}:${s}`
          const imgStyle = (img.size && img.offset) ? {
            width: `${img.size.width / 3}px`,
            height: `${img.size.height / 3}px`,
            left: `${img.offset.left / 3}px`,
            top: `${img.offset.top / 3}px`
          } : {}
          const wrapStyle = (img.systemInfo) ? {
            width: `${img.systemInfo.windowWidth / 3}px`,
            height: `${img.systemInfo.windowHeight / 3}px`
          } : {}
          return {
            path: title,
            time: detail,
            page: img.page,
            imgStyle,
            wrapStyle,
            src: img.src
          }
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
            <div class="container">
              <el-image :src="img.src" :style="img.wrapStyle" fit="contain" :preview-src-list="item.preview" :initial-index="idx" />
              <div
                v-if="img.imgStyle.width"
                :style="img.imgStyle"
                class="rect">
              </div>
            </div>
            <div class="info">
              <div>{{ img.time }}</div>
              <el-tag>{{ img.page }}</el-tag>
              <!-- <el-tag style="margin-left: 12px;">{{ img.time }}</el-tag> -->
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
  margin: 0 12px;
}

.step {
  margin-bottom: 20px;
  color: #909399;
}

.info {
  margin-bottom: 20px;
  color: #909399;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-tag {
  font-size: 10px;
  transform: scale(0.9);
}

.container {
  position: relative;
}

.rect {
  border: 1px solid red;
  position: absolute;
}
</style>
