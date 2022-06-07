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
      {{ state.result.numFailingTests }}
      {{ state.result.numPassingTests }}
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
