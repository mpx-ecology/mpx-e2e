<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import axios from 'axios'

type Result = {
  numFailingTests: number,
  numPassingTests: number,
}
type BaseData = {
  data: Result,
  errot: number
}

interface State {
  result: Result
}

const state = reactive<State>({ result: { numFailingTests: 0, numPassingTests: 0 } })

async function getData(url: string) {
  const response = await axios.get<BaseData>(url)
  return response.data.data
}

const isDEV = import.meta.env.DEV
const path = isDEV ? 'http://localhost:8886' : location.origin

onBeforeMount(() => {
  getData(`${path}/common/testResult`).then((res: Result) => {
    state.result = res
  })
})

</script>

<template>
  <div>
    <div>
      测试失败：{{ state.result.numFailingTests }}
    </div>
    <div>
      测试通过：{{ state.result.numPassingTests }}
    </div>
  </div>
</template>

<style scoped>

</style>
