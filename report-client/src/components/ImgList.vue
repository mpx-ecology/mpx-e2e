<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import axios from 'axios'
import { ElButton } from 'element-plus'

type Img = {
  path: string,
  src: string
}
type BaseData = {
  data: Img[],
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
  getData(`${path}/common/imgList`).then((res: Img[]) => {
    state.imgList = res
  })
})

</script>

<template>
  <div>
    <el-button>确定</el-button>
    <div v-for="(item, index) in state.imgList" :key="index">
      <img :src="item.src" :alt="item.path">
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
