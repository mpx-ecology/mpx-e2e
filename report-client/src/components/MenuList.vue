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
  <div style="height: 100%;">
    <el-menu
      :default-active="path"
      class="el-menu-demo"
      mode="vertical"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
    >
      <el-menu-item
        v-for="(item, index) in config"
        :key="index" :index="item.path"
        :route="item">
        {{item.title}}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.el-menu {
  height: 100%;
}

.el-menu-item.is-active {
  background: #000;
}

</style>
