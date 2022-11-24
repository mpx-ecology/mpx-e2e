<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ElDialog, ElButton, ElScrollbar } from "element-plus";

import Convert from 'ansi-to-html';
import escapeHtml from 'escape-html';

type Props = {
  detailData: { message: string, header: string};
  modelValue: boolean
};
const props = defineProps<Props>();



/** 将ansi编码的数据转换为xml */
const convert = new Convert({
  fg: '#545c64' // 前景色--默认字体的颜色
})
const message = computed(() => {
  return convert.toHtml(escapeHtml(props.detailData.message))
})

/** Modal开关控制 */
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
const showDetail = computed({
  get() {
    return props.modelValue
  },
  set(newValue: boolean) {
    emit('update:modelValue', newValue)
  }
})


function confirmClick() {
  showDetail.value = false
}


</script>

<template>
  <el-dialog v-model="showDetail" title="Shipping address" width="70%">
    <template #header="{ titleId, titleClass }">
      <div class="my-header">
        <Warning style="width: 1em; height: 1em; margin-right: 8px; color:coral" />
        INFO FOR -->
        <span :id="titleId" :class="titleClass">{{ props.detailData.header }}</span>
      </div>
    </template>
    <el-scrollbar class="scroll-bar">
      <pre v-html="message"></pre>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirmClick">OK</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
  .scroll-bar {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8AgMAAABHkjHhAAAACVBMVEWAgIBaWlo+Pj7rTFvWAAAAA3RSTlMHCAw+VhR4AAAA+klEQVQoz4WSMW7EQAhFPxKWNh2FCx+HkaZI6RRb5DYbyVfIJXLKDCFoMbaTKSw/8ZnPAPjaH2xgZcUNUDADD7D9LtDBCLZ45fbkvo/30K8yeI64pPwl6znd/3n/Oe93P3ho9qeh72btTFzqkz0rsJle8Zr81OLEwZ1dv/713uWqvu2pl+k0fy7MWtj9r/tN5q/02z89qa/L4Dc2LvM93kezPfXlME/O86EbY/V9GB9ePX8G1/6W+/9h1dq/HGfTfzT3j/xNo7522Bfnqe5jO/fvhVthlfk434v3iO9zG/UOphyPeinPl1J8Gtaa7xPTa/Dk+RIs4deMvwGvcGsmsCvJ0AAAAABJRU5ErkJggg==) #f6f6f6;
    border-radius: 10px;
    text-shadow: 0 1px white;
    padding: 0.4em;
  }
  pre {
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 1em;
    display: block;
    white-space: pre;
    margin: 1em 0px;
  }
</style>
