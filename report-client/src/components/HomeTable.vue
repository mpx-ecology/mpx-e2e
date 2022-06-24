<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ElTable, ElTableColumn, ElTag, ElIcon, ElButton } from "element-plus";
import type { Report } from "src/common/js/apiTypes";

type Props = {
  list: Report[];
};
// 使用 <script setup>
const props = defineProps<Props>();
const tableData = computed(() => {
  let tmp: any[] = [];
  props.list.forEach((p) => {
    const children: any[] = [];
    p.testResults.forEach((c) => {
      children.push({
        file: c.title,
        useTime: c.duration,
        status: c.status
      });
    });
    tmp.push({
      file: p.testFilePath?.split(/\/|\\/).pop(),
      useTime: p.perfStats.runtime,
      status: [p.numPassingTests, p.numFailingTests],
      allPassed: p.numFailingTests === 0, // 全部通过
      children,
    });
  });
  return tmp;
});

function handleAction (row:any) {
  console.log(row)
}

console.log(tableData);
</script>

<template>
  <div>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="file" border default-expand-all>
      <el-table-column label="File">
        <template #default="scope">
          <el-icon v-if="scope.row.children">
            <Document />
          </el-icon>
          <span style="margin-left: 10px">{{ scope.row.file }}</span>
        </template>
      </el-table-column>

      <el-table-column label="useTime" width="180">
        <template #default="scope">
          <el-icon>
            <timer />
          </el-icon>
          <span>{{ scope.row.useTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Status" width="180">
        <template #default="scope">
          <template v-if="scope.row.allPassed">
            <el-tag type="success">
              All Passed {{ scope.row.status[0] }}
              <el-icon>
                <Check />
              </el-icon>
            </el-tag>
          </template>
          <template v-else-if="scope.row.status.length === 2">
            <el-tag type="success">{{ scope.row.status[0] }}</el-tag>
            <el-tag type="danger">{{ scope.row.status[1] }}</el-tag>
          </template>
          <template v-else>
            <el-icon v-if="scope.row.status === 'passed'">
              <Check />
            </el-icon>
            <el-icon v-else>
              <Close />
            </el-icon>
            <span>{{ scope.row.status }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="Action" width="100">
        <template #default="scope">
          <el-button v-if="!scope.row.allPassed && scope.row.status !== 'passed'" size="small" type="warning"
            @click="handleAction(scope.row)">
            <el-icon>
              <Warning />
            </el-icon>Info
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
</style>
