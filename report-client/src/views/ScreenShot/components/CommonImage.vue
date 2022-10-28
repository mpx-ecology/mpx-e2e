<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElImage, ElEmpty, ElScrollbar, ElDivider, ElTag, ElCheckboxGroup, ElCheckbox, ElColorPicker } from 'element-plus'
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

const isDEV = import.meta.env.DEV
const devPath = isDEV ? 'http://localhost:8886' : location.origin

const checkList = ref(['timeout', 'tap', 'user', 'route', 'request'])

const color = ref('#409EFF')

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
      const imgList: Info[] = item.imgList.map((img) => {
        const title = img.path.split(/\/|\\/).pop() || ''
        const time = timestampToTime(img.time || 0)
        // 绘制点击位置
        let imgStyle = (img.size && img.offset) ? {
          width: `${img.size.width / 2}px`,
          height: `${img.size.height / 2}px`,
          left: `${img.offset.left / 2}px`,
          top: `${img.offset.top / 2}px`,
          'background': 'none',
          'border': `1px solid ${color.value}`,
          'border-radius': '0'
        } : {
          display: 'none'
        };
        const firstTouch = img.event?.eventData.changedTouches
        if (firstTouch?.length && firstTouch[0] && img.offset) {
          const item = firstTouch[0]
          imgStyle = {
            width: `20px`,
            height: `20px`,
            left: `${(item.clientX) / 2 - 10}px`,
            top: `${(img.offset.top) / 2}px`,
            'background': color.value,
            'border': 'none',
            'border-radius': '50%'
          }
        }
        const wrapStyle = {
          width: `${store.systemInfo.screenWidth! / 2}px`,
          height: `${store.systemInfo.screenHeight! / 2}px`
        }
        mapList[img.type] = mapList[img.type] + 1
        return {
          path: title,
          time,
          page: img.page,
          imgStyle,
          wrapStyle,
          src: `${devPath}${img.src}`,
          type: img.type
        }
      })
      const filterList = imgList.filter(item => checkList.value.includes(item.type))
      result.push({
        title: item.testFilePath.split(/\/|\\/).pop() || '',
        list: filterList,
        preview: filterList.map(img => img.src)
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
    <div class="header">
      <el-checkbox-group v-model="checkList">
        <el-checkbox class="checkbox" v-for="(item, key) in state.filterMapList" :key="key" :label="key">{{item}}</el-checkbox>
      </el-checkbox-group>
      <div>
        <span class="rect-demo" :style="{background: color}"></span>
        <el-color-picker v-model="color" />
      </div>
    </div>
    <div class="step" v-for="(item, index) in state.result" :key="index">
      <el-divider content-position="left">{{item.title}}</el-divider>
      <el-scrollbar v-if="item.list.length">
        <div class="scrollbar-flex-content">
          <div v-for="(img, idx) in item.list" :key="idx">
            <div class="container" :style="img.wrapStyle">
              <div class="inner">
                <el-image loading="lazy" :src="img.src" fit="contain" :preview-src-list="item.preview" :initial-index="idx" />
                <div
                  v-if="img.imgStyle.width"
                  :style="img.imgStyle"
                  class="rect">
                </div>
              </div>
            </div>
            <div class="info">
              <div>{{ img.time }}</div>
              <el-tag v-if="img.page">{{ img.page }}</el-tag>
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
  margin: 0 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.11);
}

.inner {
  position: relative;
  overflow: hidden;
  font-size: 0;
}

.rect {
  border: 1px solid transparent;
  position: absolute;
  /* background: rgba(0, 0, 0); */
  opacity: 0.5;
}

.rect-demo {
  display: inline-block;
  border: 1px solid transparent;
  /* background: rgba(0, 0, 0); */
  width: 20px;
  height: 20px;
  border-radius: 50%;
  opacity: 0.5;
  margin-right: 12px;
  vertical-align: -4px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 12px;
}

.checkbox:deep(.el-checkbox__label){
  font-size: 16px;
}
</style>
