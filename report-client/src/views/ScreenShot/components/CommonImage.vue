<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElImage, ElEmpty, ElScrollbar, ElDivider, ElTag, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { useCounterStore } from '../../../stores/counter'
import { timestampToTime } from '../../../utils'
const store = useCounterStore()

type ImgList = { title: string, list: Info[], preview: string[] }[]

type Info = {
  time: string,
  path: string,
  page: string,
  src: string,
  type: string
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

const checkList = ref(['timeout', 'tap', 'user', 'route', 'request'])

const state = computed(() => {
  const result: ImgList = []
  const mapList: any = {
    timeout: 0,
    tap: 0,
    user: 0,
    route: 0,
    request: 0,
    error: 0
  }
  store.reportList.forEach(item => {
    if (item.imgList && item.imgList.length) {
      const imgList: Info[] = item.imgList.map(img => {
        const title = img.path.split(/\/|\\/).pop() || ''
        const time = timestampToTime(img.time || 0)
        const imgStyle = (img.size && img.offset) ? {
          width: `${img.size.width / 2}px`,
          height: `${img.size.height / 2}px`,
          left: `${img.offset.left / 2}px`,
          top: `${img.offset.top / 2}px`
        } : {
          display: 'none'
        }
        const wrapStyle = {
          width: `${store.systemInfo.windowWidth / 2}px`,
          height: `${store.systemInfo.windowHeight / 2}px`
        }
        mapList[img.type] = mapList[img.type] + 1
        return {
          path: title,
          time,
          page: img.page,
          imgStyle,
          wrapStyle,
          src: img.src,
          type: img.type
        }
      })
      result.push({
        title: item.testFilePath.split(/\/|\\/).pop() || '',
        list: imgList.filter(item => checkList.value.includes(item.type)),
        preview: item.imgList.map(img => img.src)
      })
    }
  })
  const filterMapList: any = {}
  for (const key in mapList) {
    if (key !== 'error' && mapList[key]) {
      filterMapList[key] = `${key}(${mapList[key]})`
    }
  }
  return { result, filterMapList }
})

const isEmpty = computed(() => {
  return store.reportList.length === 0
})

</script>

<template>
  <div>
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="(item, key) in state.filterMapList" :key="key" :label="key">{{item}}</el-checkbox>
    </el-checkbox-group>

    <div class="step" v-for="(item, index) in state.result" :key="index">
      <el-divider content-position="left">{{item.title}}</el-divider>
      <el-scrollbar v-if="item.list.length">
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
            </div>
          </div>
        </div>
      </el-scrollbar>
      <el-empty v-else description="No Data" />
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
  margin: 0 12px
}

.rect {
  border: 1px solid red;
  position: absolute;
}
</style>
