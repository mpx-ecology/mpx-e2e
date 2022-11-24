<script setup lang="ts">
import 'element-plus/dist/index.css'

import { RouterView } from 'vue-router'
import { ElHeader, ElMain, ElContainer, ElFooter, ElScrollbar } from 'element-plus'
import MenuList from './components/MenuList.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <menu-list></menu-list>
      </el-header>
      <el-scrollbar>
        <el-main>
          <div class="common-container">
            <router-view></router-view>
          </div>
        </el-main>
      </el-scrollbar>
      <el-footer>
        <div class="bottom-footer">E2E Test Designed by 乘客前端/花小猪小程序</div>
      </el-footer>
    </el-container>
  </div>
</template>

<style>
@import '@/assets/base.css';

#app {
  height: 100%;
  margin: 0 auto;
  font-weight: normal;
}

.el-main {
  height: 100%;
  padding-bottom: 0;
}

.el-header {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .1);
  position: sticky;
  top: 0;
  background: #4A5259;
  z-index: 8;
}

.bottom-footer {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.common-container {
  padding-bottom: 30px;
  width: 100%;
  min-width: 1280px;
  min-height: 82vh;
  background: #fff;
  padding: 16px;
  display: inline-block;
  border: 1px solid #E6E9ED;
}
</style>
