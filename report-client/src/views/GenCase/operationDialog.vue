<script setup lang="ts">
import {
  formCfg
} from './menu'

import {
  ElButton,
  ElDialog,
  ElForm,
  ElInput,
  ElSelect,
  ElOption,
  ElFormItem
} from 'element-plus';
import { computed } from 'vue';

import type {
  TYPE_CMD_BY_PLATFORM,
} from '../../types/genCaseType'

type e2eExtendsFormType = typeof formCfg

type Props = {
  currentMenu: {
    title: string;
    action: string;
    cmdIndex: number;
    menuIdx: number;
  },
  e2eExtendsForm: e2eExtendsFormType,
  isCreate: boolean,
  modelValue: boolean
}

const emit = defineEmits<{
  (e: 'update:e2eExtendsForm', value: e2eExtendsFormType): void,
  (e: 'update:modelValue', value: boolean): void
  (e: 'delFromCmds'): void,
  (e: 'addToCmds', value: TYPE_CMD_BY_PLATFORM, value2: number): void,
}>()

const props = defineProps<Props>()

const menu = computed(() => props.currentMenu)
// 弹窗内容
const form = computed({
  get() {
    return props.e2eExtendsForm
  },
  set(newValue: e2eExtendsFormType) {
    emit('update:e2eExtendsForm', newValue)
  }
})
// 弹窗显隐
const showDialog = computed({
  get() {
    return props.modelValue
  },
  set(newValue: boolean) {
    emit('update:modelValue', newValue)
  }
})

const dlgCancel = () => {
  showDialog.value = false
}

const addToCmds = async () => {
  const { menuIdx, action, cmdIndex = 0 } = menu.value
  const command = form.value[action].selectedValue
  const intoIdx = command ? props.isCreate ? cmdIndex + 1 : cmdIndex : 0
  const cmdItem = {
    command,
    byPlatform: true,
    timestamp: Date.now(),
    action,
    menuIdx,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data: form.value[action].inputOptions[command]
  } as unknown as TYPE_CMD_BY_PLATFORM
  Object.assign(form.value, formCfg) // 初始化弹窗内容
  emit('addToCmds', cmdItem, intoIdx)
  showDialog.value = false
}

const delFromCmds = async () => {
  Object.assign(form.value, formCfg) // 初始化弹窗内容
  emit('delFromCmds')
  showDialog.value = false
}

</script>

<template>
  <el-dialog v-model="showDialog" :title="menu.title">
    <el-form :model="form[menu.action]">
      <div>
        <el-form-item v-if="form[menu.action].selectOptions" label="操作类型：" :label-width="120">
          <el-select v-model="form[menu.action].selectedValue" placeholder="选择操作类型">
            <el-option v-for="(rItem, rIdx) in form[menu.action].selectOptions" :key="rIdx" :label="rItem.label"
              :value="rItem.value" />
          </el-select>
        </el-form-item>
        <div v-for="(iVal, iKey) in form[menu.action].inputOptions" :data-some="iKey" :key="iKey">
          <div
            v-if="typeof form[menu.action].selectedValue === 'undefined' || iKey === form[menu.action].selectedValue">
            <el-form-item v-for="(iItem, iIdx) in iVal" :key="iIdx" :label-width="120" :label="iItem.label">
              <el-input :data-s="iItem" v-model="iItem.value" :placeholder="iItem?.placeholder" autocomplete="off" />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addToCmds" type="primary" class="bg-mg">确认</el-button>
        <el-button @click="dlgCancel" class="normal-btn">取消</el-button>
        <el-button v-if="!isCreate" type="danger" @click="delFromCmds">删除</el-button>
      </span>
    </template>
  </el-dialog>
</template>
