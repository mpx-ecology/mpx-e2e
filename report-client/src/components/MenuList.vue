<script setup lang="ts">
import { ElMenu, ElMenuItem } from 'element-plus'
import { config } from '../router/index'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const path = ref('')

onMounted(() => {
  const router = useRouter()
  path.value = '/home'
  router.replace('/home')
})
</script>

<template>
  <div class="menu-list">
    <div class="menu-inner">
      <img class="menu-logo" src="https://dpubstatic.udache.com/static/dpubimg/imdk1FF2QF/logo_color.png" alt="">
      <div class="menu-info">E2E 平台</div>
    </div>
    <el-menu
      :default-active="path"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      text-color="#1c1e21"
      active-text-color="#10910e"
      :router="true"
    >
      <el-menu-item
        v-for="(item, index) in config"
        :key="index" :index="item.path"
        :route="item">
        {{item.title}}
      </el-menu-item>
    </el-menu>
    <div class="menu-mark">
      <a class="doc" href="https://mpxjs.cn/guide/tool/e2e-test.html">官方文档</a>
      <a class="github" href="https://github.com/mpx-ecology/mpx-e2e"></a>
    </div>
  </div>
</template>

<style scoped>
.el-menu {
  height: 100%;
  flex: 1;
  border-bottom: none;
}

.el-menu-item {
  font-weight: 500;
}

.el-menu-item.is-active {
  background: none !important;
}

.menu-logo {
  width: 135px;
  height: 35px;
  margin-right: 24px;
}

.menu-info {
  background: #15c213;
  font-size: 20px;
  font-weight: 500;
  line-height: 20px;
  padding: 6px 15px;
  color: #fff;
}

.menu-list {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 24px;
  box-sizing: border-box;
}

.menu-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 50px;
}

.github {
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/%3E%3C/svg%3E") no-repeat;
  display: flex;
  height: 24px;
  width: 24px;
  margin-left: 12px;
}

.menu-mark {
  display: flex;
}

.doc {
  font-weight: 500;
  color: #1c1e21;
}

.doc:hover {
  background: none;
}
</style>
