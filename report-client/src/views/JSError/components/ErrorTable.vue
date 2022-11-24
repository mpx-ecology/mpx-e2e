<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ElTable, ElTableColumn, ElTag } from "element-plus";

import { useCounterStore } from '../../../stores/counter'


import type { ErrorItem } from "src/common/js/apiTypes";
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

const store = useCounterStore()

type Props = {
  list: ErrorItem[];
  file: string
};

/** 表格数据处理 */
const props = defineProps<Props>();
const tableData = computed(() => {
  const rs:ErrorItem[] = []
  props.list.forEach((item) => {
    rs.push({
      file: props.file,
      ...item
    })
  });
  return rs;
});

const imgStyle = computed(() => {
  return `width:${store.systemInfo.screenWidth}px;height:${store.systemInfo.screenHeight}px`
})

const smallImgStyle = computed(() => {
  return `width:${store.systemInfo.screenWidth!/5}px;height:${store.systemInfo.screenHeight!/5}px`
})

/** 列样式 */
function tableCellClassName({ column, columnIndex }: { row: ErrorItem, column: TableColumnCtx<ErrorItem>, columnIndex: number }) {
  let className = ''
  columnIndex === 0 ? className = 'expand-column' : void 0
  column.label === 'Stack' ? className = 'stack' : void 0
  column.label === 'Message' ? className = 'message' : void 0
  return className
}

</script>

<template>
  <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" header-row-class-name="header-row"
    class="el-table" :cell-class-name="tableCellClassName">
    <el-table-column :label="file" label-class-name="file">

      <el-table-column type="expand">
        <template #default="scope">
          <div class="expand-area">
            <div class="left">
              <div class="page">页面路径：{{scope.row.page}}</div>
              <pre class="stack" v-html="scope.row.stack"></pre>
            </div>
            <div class="right">
              <img class="image" :style="imgStyle" :src="scope.row.imgSrc" />
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Message" min-width="100" show-overflow-tooltip>
        <template #default="scope">
          <el-tag size="large" type="warning" effect="dark">{{ scope.row.message }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Stack" min-width="500">
        <template #default="scope">
          <div class="page">页面路径：{{scope.row.page}}</div>
          <pre class="stack" v-html="scope.row.stack"></pre>
        </template>
      </el-table-column>

      <el-table-column label="Thumbnail" width="130">
        <template #default="scope">
          <img :style="smallImgStyle" :src="scope.row.imgSrc" />
        </template>
      </el-table-column>

    </el-table-column>
  </el-table>

</template>

<style lang="scss" scoped>
.el-table{

  .page{
    font-weight: 700;
    font-size: 20px;
    color: #df7774;
  }

  .stack{
    padding: 0.4em;
    white-space: pre-wrap;
    color: #e18683;
  }
}

// 展开按钮列样式
:deep(.expand-column) {
  border: none;
  .el-icon{
    font-size: 20px;
  }
}
:deep(.header-row){
  .el-table__expand-column{
    border: none;
  }
}

:deep(.message){
  .el-tag {
    width: 95%;
  }
  .el-tag__content{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

// 详情列样式
:deep(.stack) {
  .cell {
    position: relative;
    height: 104px;
    overflow: hidden;
    padding-bottom: 8px;
    &::after {
      content: '......';
      font-weight: 700;
      color: #e18683;
      position: absolute;
      bottom: -7px;
      left: 50px;
    }
  }
}

// 展开内容
.expand-area{
  display: flex;
  padding: 10px 30px;
  .left{
    margin-right: 20px;
  }
  .right{
    margin-right: 50px;
  }
}

// spec文件名
:deep(.file){
  .cell {
    font-size: 18px;
    font-weight: 700;
    color: #008c8c;
  }
}
</style>
