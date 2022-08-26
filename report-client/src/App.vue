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
      <el-container>
        <el-container>
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
      </el-container>
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

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

.common-layout,
.el-container {
  height: 100%;
}

.el-header {
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
  position: sticky;
  top: 0;
  background: #4A5259;
  z-index: 8;
}

nav {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.top-header {
  display: flex;
  height: 100%;
  align-items: center;
  font-size: 22px;
  color: #fff;
}

.bottom-footer {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.common-container {
  width: 100%;
  min-width: 1280px;
  min-height: 76vh;
  background: #fff;
  margin-bottom: 10px;
  padding: 24px;
  display: inline-block;
  border: 1px solid #E6E9ED;
}
</style>
