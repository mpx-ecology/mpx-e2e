<template>
  <el-dialog v-model="dialogFormVisible" :title="titlesCollection[currentForm]">
    <el-form v-if="currentForm === 'mock'" :model="mockForm">
      <el-form-item label="操作类型：" :label-width="formLabelWidth">
        <el-select v-model="mockForm.mockOpType"
                   @change="handleChangeMockType"
                   placeholder="Please select a zone">
          <el-option label="移除指定接口 Mock" value="rmApiRes" />
          <el-option label="修改某个接口字段" value="replaceApiFields" />
        </el-select>
      </el-form-item>
      <el-form-item label="指定接口：" :label-width="formLabelWidth">
        <el-input v-model="mockForm.apiName" autocomplete="true" />
      </el-form-item>
      <el-form-item v-if="mockForm.mockOpType === 'replaceApiFields'" label="指定字段：" :label-width="formLabelWidth">
        <el-input v-model="mockForm.fieldName" autocomplete="true" />
      </el-form-item>
      <el-form-item v-if="mockForm.mockOpType === 'replaceApiFields'" label="字段新值：" :label-width="formLabelWidth">
        <el-input v-model="mockForm.fieldNewValue" autocomplete="true" />
      </el-form-item>
    </el-form>
    <el-form v-if="currentForm === 'code'" :model="codeForm">
      <el-form-item label="位置：" :label-width="formLabelWidth">
        <el-select v-model="codeForm.positionType" placeholder="Please select a zone">
          <el-option label="beforeAll" value="beforeAll" />
          <el-option label="afterAll" value="afterAll" />
          <el-option label="mock 微信方法后" value="afterMockWxMethod" />
        </el-select>
      </el-form-item>
      <el-form-item label="代码：" :label-width="formLabelWidth">
        <el-input :rows="4"
                  type="textarea"
                  v-model="codeForm.codeStr"
                  autocomplete="true" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelTools">取消</el-button>
        <el-button type="primary" @click="confirmTools">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import { ElDialog } from 'element-plus'
import { clearData } from '@/utils';

const formLabelWidth = '140px'
const dialogFormVisible = ref<boolean>(false)
const currentForm = ref<string>('mock')
const titlesCollection = reactive<Record<string, string>>({
  mock: '修改录制的 Mock 数据',
  code: '向指定位置插入代码'
})

interface mockFormType {
  mockOpType: 'rmApiRes'|'replaceApiFields',
  apiName: string,
  fieldName: string,
  fieldNewValue: string
}

type keysOfMockForm = 'fieldName' | 'fieldNewValue'

const mockForm = reactive<mockFormType>({
  mockOpType: 'rmApiRes',
  apiName: '',
  fieldName: '',
  fieldNewValue: ''
})

const codeForm = reactive({
  positionType: 'afterMockWxMethod',
  codeStr: ''
})

const emit = defineEmits<{
  (e: 'bubbleFormData', value: any): void
}>()

const showToolsDlg = (formType: 'mock' | 'code', isShow = true) => {
  clearMockForm()
  currentForm.value = formType
  dialogFormVisible.value = isShow
}

const clearMockForm = () => {
  clearData(mockForm, ['mockOpType'], 'rmApiRes')
  clearData(mockForm, ['apiName', 'fieldName', 'fieldNewValue'], '')
  clearData(codeForm, ['positionType'], 'afterMockWxMethod')
  clearData(codeForm, ['codeStr'], '')
}

/**
 * 类型变化时清空字段名和字段新值
 * @param val select val
 */
const handleChangeMockType = (val:number) => {
  if (val === 1) clearData(mockForm, ['fieldName', 'fieldNewValue'], '')
}

const cancelTools = () => {
  dialogFormVisible.value = false
}

const reportFormData = () => {
  emit('bubbleFormData', { type: currentForm.value, data: toRaw(currentForm.value === 'mock' ? mockForm : codeForm) })
}

const confirmTools = () => {
  reportFormData()
  dialogFormVisible.value = false
}


defineExpose({
  showToolsDlg
})
</script>
