<script setup lang="ts">
import { computed, ref, reactive } from "@vue/reactivity";
import { ElTable, ElTableColumn, ElTag } from "element-plus";

import type { ErrorItem } from "src/common/js/apiTypes";
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

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


/** 表格行存在失败case样式 */
function tableRowClassName({ row }: { row: ErrorItem }) {
  // console.log(row);
  let classes = ''
  return classes
}

/** 列样式 */
function tableCellClassName({ row, column, columnIndex }: { row: ErrorItem, column: TableColumnCtx<ErrorItem>, columnIndex: number }) {
  // console.log(row);
  // console.log(column, columnIndex)
  let className = ''
  columnIndex === 0 ? className = 'expand-column' : void 0
  column.label === 'Detail' ? className = 'detail' : void 0
  column.label === 'Message' ? className = 'message' : void 0
  return className
}

</script>

<template>
  <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" header-row-class-name="header-row"
    :row-class-name="tableRowClassName" class="el-table" :cell-class-name="tableCellClassName">
    <el-table-column :label="file">

      <el-table-column type="expand">
        <template #default="scope">
          <div class="expand-area">
            <div class="left">
              <div class="page">页面路径：{{scope.row.page}}</div>
              <pre class="stack" v-html="scope.row.stack"></pre>
            </div>
            <div class="right">
              <img class="image" :src="scope.row.src" />
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Message" min-width="100" show-overflow-tooltip>
        <template #default="scope">
          <el-tag size="large" type="warning" effect="dark">{{ scope.row.message }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Detail" min-width="500">
        <template #default="scope">
          <div class="page">页面路径：{{scope.row.page}}</div>
          <pre class="stack" v-html="scope.row.stack"></pre>
        </template>
      </el-table-column>

      <el-table-column label="Src" width="130">
        <template #default="scope">
          <img class="small-image" :src="scope.row.src" />
        </template>
      </el-table-column>

    </el-table-column>
  </el-table>

</template>

<style lang="scss" scoped>
// 正常行hover
:deep(.el-table__body) {
  tr:hover>td.el-table__cell {
    // background-color: #9beded
  }
}

.el-table{
  .small-image {
    width: 100px;
  }

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
:deep(.detail) {
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
    .image{
      width: 375px
    }
  }
}
</style>
