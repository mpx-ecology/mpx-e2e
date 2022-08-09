<template>
  <el-row :gutter="20">
    <el-col :span="3">
      <div>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="将IDE录制回放的json进行导入，例 minitest-1.json"
            placement="right-start"
        >
          <el-button type="success" style="background: #77CD9E;">
            JSON 导入
            <el-icon> <QuestionFilled /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <el-empty v-if="list.length <= 0" description="空空如也，快导入你的 json 吧"></el-empty>
      <div class="mgnt20" v-else>
        <p class="lh20 file-item"
           @click="updateCurrentJsonFile(item)"
           :class="currentJsonFile === item ? 'file-item-hl' : ''"
           v-for="(item, index) in list" :key="index">
          <el-icon class="vtln"><Document /></el-icon><span class="mgnl10">{{item}}</span>
        </p>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content ep-bg-purple">
        cc
      </div>
    </el-col>
    <el-col :span="13">
      <div>
        <highlight-js
            autodectect
            language="js"
            :code="code"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, reactive } from 'vue'
import { getJsonFiles } from '@/api/workshop'
import {
  ElCol,
  ElRow,
  ElIcon,
  ElButton,
  ElTooltip,
  ElEmpty
} from 'element-plus'
import type { LOAD_CASE_RESPONSE } from '@/types/genCaseType'
const code: { value: string } = ref('');
const list: { value: string[] } = ref([]);
const currentJsonFile: { value: string } = ref('');

// setTimeout(() => {
//   code.value = 'var g = null;'
// }, 5000)
const updateCurrentJsonFile = (n: string) => currentJsonFile.value = n;
onBeforeMount(() => {
  getJsonFiles(
      {
        write: 0,
        preview: 0,
        loadAll: 1
      }
  ).then((res: any) => {
    code.value = res.preview;
    list.value = res.tasks;
    currentJsonFile.value = res.tasks[0]
  })
})

</script>

<style scoped>
.mgnt20 {
  margin-top: 10px;
}
.lh20 {
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
  font-size: 14px;
}
.vtln {
  vertical-align: middle;
}
.mgnl10 {
  margin-left: 5px;
}
.file-item {
  padding-left: 20px;
  cursor: pointer;
}
.file-item-hl, .file-item:hover {
  background: #77CD9E;
}

</style>
