<script setup lang="ts">
import { ElTabPane, ElTabs } from 'element-plus'

import CommonImage from './CommonImage.vue';
import ErrorImage from './ErrorImage.vue';

</script>

<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Common">
      <CommonImage />
    </el-tab-pane>
    <el-tab-pane label="Error">
      <ErrorImage />
    </el-tab-pane>
  </el-tabs>
</template>


<style lang="scss" scoped></style>