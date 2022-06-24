<script setup lang="ts">
import { onBeforeMount, reactive, computed } from 'vue';
import axios from 'axios'
import { ElImage, ElEmpty } from 'element-plus'

type Img = {
  path: string,
  src: string
}
type BaseData = {
  data: {
    imgList: Img[]
  },
  errot: number
}
interface State {
  imgList: Img[]
}

const state = reactive<State>({ imgList: [] })

async function getData(url: string) {
  const response = await axios.get<BaseData>(url)
  return response.data.data
}

const isDEV = import.meta.env.DEV
const path = isDEV ? 'http://localhost:8886' : location.origin

onBeforeMount(() => {
  getData(`${path}/common/imgList`).then((res) => {
    state.imgList = res.imgList
  })
})

const isEmpty = computed(() => {
  return state.imgList.length === 0
})

const imgList = computed(() => {
  return state.imgList.map(item => item.src)
})

</script>

<template>
  <div>
    <div>测试生成截图共 {{state.imgList.length}} 张</div>
    <div style="display: inline-block;" v-for="(item, index) in state.imgList" :key="index">
      <el-image
        style="width: 200px; height: 200px; background: #000; border: 1px solid #000; margin-right: 12px;"
        :src="item.src"
        fit="contain"
        :preview-src-list="imgList" />
      <div>{{item.path}}</div>
    </div>
    <el-empty v-if="isEmpty" description="description" />
  </div>
</template>

<style scoped>

</style>
