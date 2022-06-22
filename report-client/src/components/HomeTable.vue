<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { ElCollapse, ElCollapseItem, ElTable, ElTableColumn }  from 'element-plus'
import type { Report } from 'src/common/js/apiTypes'

type Props = {
  list: Report[]
}
// 使用 <script setup>
const props = defineProps<Props>()
const activeNames = ref('')
</script>

<template>
  <div v-if="props.list.length" style="width: 800px; border: 1px solid #eee; padding: 12px; margin-top: 50px;">
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item, index) in props.list" :key="index" :title="item.testFilePath" :name="index">
          <el-table :data="item.testResults" border style="width: 100%">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="duration" label="时间" />
            <el-table-column prop="status" label="状态" />
          </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>