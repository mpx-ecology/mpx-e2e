<script setup lang="ts">
import { onBeforeMount, reactive, computed } from 'vue';
import axios from 'axios'
import { ElImage, ElEmpty, ElScrollbar } from 'element-plus'

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
    <el-scrollbar>
      <div class="scrollbar-flex-content">
        <div v-for="(item, index) in state.imgList" :key="index">
          <el-image class="image" :src="item.src" fit="contain" :preview-src-list="imgList" />
          <div class="path">{{ item.path }}</div>
        </div>
      </div>
    </el-scrollbar>
    <el-empty v-if="isEmpty" description="description" />
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

.path {
  margin-bottom: 20px;
}
</style>
