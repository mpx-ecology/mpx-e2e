<script setup lang="ts">
import { computed, ref, reactive } from "@vue/reactivity";
import { ElTable, ElTableColumn, ElTag, ElIcon, ElButton } from "element-plus";

import type { Report } from "src/common/js/apiTypes";
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

import DetailModal from "./DetailModal.vue"

import { getFormattedTime } from '../utils'

type Props = {
  list: Report[];
};

/** 表格数据处理 */
type parent = {
  file: string,
  useTime: string,
  status: [number, number],
  allPassed: boolean,
  failureMessage: string | null,
  children: Array<children>
}
type children = {
  file: string,
  useTime: string,
  status: string,
  failureMessage: string | null,
  fullName: string
}
const props = defineProps<Props>();
const tableData = computed(() => {
  let parent: parent[] = [];
  props.list.forEach((p) => {
    const children: Array<children> = [];
    p.testResults.forEach((c) => {
      children.push({
        file: c.title,
        useTime: formatUseTime(c.duration),
        status: c.status,
        failureMessage: c.failureMessages.join(),
        fullName: c.fullName
      });
    });
    parent.push({
      file: p.testFilePath.split(/\/|\\/).pop() || '',
      useTime: formatUseTime(p.perfStats.runtime),
      status: [p.numPassingTests, p.numFailingTests],
      allPassed: p.numFailingTests === 0, // 全部通过
      failureMessage: p.failureMessage,
      children
    });
  });
  return parent;
});

function formatUseTime(time: number) {
  const rs = getFormattedTime(0, time)
  console.log(typeof rs)
  return rs
}

/** 表格行存在失败case样式 */
function tableRowClassName({ row }: { row: parent | children }) {
  // console.log(row);
  let classes = ''
  if (Array.isArray(row.status)) { // 父级
    classes = row.status[1] >= 1 ? 'warning-row' : ''
  } else if (row.status === 'failed') { // 子级
    classes = 'warning-row-child'
  }
  return classes
}

/** 列样式 */
function tabelCellClassName({ row, column, columnIndex }: { row: parent | children, column: TableColumnCtx<parent | children>, columnIndex: number }) {
  // console.log(row);
  // console.log(column, columnIndex)
  let classes = []
  switch (column.label) {
    case 'File':
      classes.push('file')
      break
    case 'UseTime':
      classes.push('use-time')
      break
    case 'Status':
      classes.push('status')
      break
  }
  // eslint-disable-next-line no-prototype-builtins
  if (columnIndex === 0 && row.hasOwnProperty('children')) { // 父级行第一列
    classes.push('parent')
  }
  if (columnIndex === 2 && row.status === 'passed') {
    // console.log(row)
    classes.push('passed')
  }
  return classes.join(' ')
}

/** 表格action弹窗 */
let detailData = reactive({ header: '', message: '' })
let showDetail = ref(false)
function handleAction(row: parent | children) {
  detailData.header = (row as children).fullName || (row as parent).file,
    detailData.message = row.failureMessage || 'No Data'
  showDetail.value = true
}
</script>

<template>
  <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="file" border default-expand-all
    :row-class-name="tableRowClassName" class="el-table" :cell-class-name="tabelCellClassName">
    <el-table-column label="File">
      <template #default="scope">
        <el-icon v-if="scope.row.children">
          <Document />
        </el-icon>
        <span style="margin-left: 10px">{{ scope.row.file }}</span>
      </template>
    </el-table-column>

    <el-table-column label="UseTime" width="180">
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
        <el-button v-if="!scope.row.allPassed && scope.row.status !== 'passed'" size="default" type="warning"
          @click="handleAction(scope.row)">
          <el-icon class="el-icon--warning">
            <Warning />
          </el-icon>Info
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <DetailModal :detailData="detailData" v-model="showDetail"></DetailModal>
</template>

<style lang="scss" scoped>
/** 行样式 */ 
:deep(.warning-row),
:deep(.warning-row-child) {
  background: #be2e2c;
  color: #fff;

  &:hover>td.el-table__cell {
    background-color: #e36666 !important
  }

  .el-table__cell {
    div {
      color: #fff;
    }
  }
}
// 子级行
:deep(.warning-row-child) {
  background: #f3413d;
}
// 正常行hover
:deep(.el-table__body) {
  tr:hover>td.el-table__cell {
    background-color: #9beded
  }
}

// 列样式
:deep(.file) {
  &.el-table__cell {
    div {
      display: flex;
      align-items: center;
    }
  }

  &.parent {
    color: #008c8c;
  }
}

:deep(.use-time) {
  &.el-table__cell {
    div {
      display: flex;
      align-items: center;

      .el-icon {
        margin-right: 4px;
      }
    }
  }
}


:deep(.status) {
  &.el-table__cell {
    div {
      display: flex;
      align-items: center;

      .el-icon {
        margin-right: 8px;
      }
    }
  }

  &.passed {
    color: rgb(29, 146, 33);
  }

  .el-tag--success {
    min-width: 35px;
    margin-right: 4px;
  }

  .el-tag--danger {
    min-width: 35px;
  }
}

// Action
.el-icon--warning {
  margin-right: 4px;
}
</style>
