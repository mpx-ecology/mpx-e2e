<template>
  <el-row :gutter="10" v-loading="loadingFlag">
    <!-- 1.1 JSON导入 展开态-->
    <el-col :span="colOneSpan" v-if="drawerIsOpen">
      <div class="button-area">
        <el-tooltip class="box-item" effect="dark" content="将IDE录制回放的json进行导入, 例 minitest-1.json"
          placement="right-start">
          <el-button class="import-btn" type="primary" @click="loadMinitest">
            JSON 导入
            <el-icon>
              <QuestionFilled />
            </el-icon>
          </el-button>
        </el-tooltip>
        <template v-if="currentSpecFileName">
          <el-tooltip class="box-item" effect="dark" :content="'将' + currentSpecFileName + '保存到 case 目录'"
            placement="right-start">
            <el-button class="save-btn" type="success" @click="saveSpec">
              保存
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-button class="arrow-btn" @click="openOrClose">
            <el-icon>
              <ArrowLeft />
            </el-icon>
          </el-button>
        </template>
      </div>
      <!-- JSON文件列表 -->
      <div class="mgnt20">
        <p class="lh20 file-item ellipsis" @click="updateCurrentJsonFileNameAndPreview(item, index)"
          :class="currentHighlightIdx === index ? 'file-item-hl' : ''" v-for="(item, index) in list" :key="index">
          <el-icon class="vtln">
            <Document />
          </el-icon>
          <span class="mgnl10" :title="item">{{ item }}</span>
        </p>
      </div>
    </el-col>
    <!-- 1.2 JSON导入 收起态-->
    <el-col :span="colOneSpan" v-else>
      <div class="arrow-btn-area">
        <el-button style="width:50%;margin-right: 6px;" @click="openOrClose">
          <el-icon>
            <ArrowRight />
          </el-icon>
        </el-button>
      </div>
      <!-- JSON文件列表 -->
      <div class="mgnt20">
        <p class="lh20 file-item" @click="updateCurrentJsonFileNameAndPreview(item, index)"
          :class="currentHighlightIdx === index ? 'file-item-hl' : ''" v-for="(item, index) in list" :key="index"
          style="text-align: center;padding-left: 0;">
          <el-icon class="vtln">
            <Document />
          </el-icon>
        </p>
      </div>
    </el-col>

    <!-- 2.操作项列表 -->
    <el-col :span="8">
      <el-empty v-if="list.length <= 0" description="空空如也，快导入你的 json 吧" :image-size="250"></el-empty>
      <el-row v-if="list.length > 0" class="mb-4 pding-btm-10">
        <el-tooltip class="box-item"
                    effect="dark"
                    content="操作录制 Mock 数据"
                    placement="right-start">
          <el-button
              size="large"
              :icon="Edit"
              @click="openToolsDlg('mock')"
              round>MOCK</el-button>
        </el-tooltip>
        <el-tooltip class="box-item"
                    effect="dark"
                    content="向 beforeAll/afterAll 插入代码"
                    placement="right-start">
          <el-button
              size="large"
              @click="openToolsDlg('code')"
              :icon="Plus"
              round>Code</el-button>
        </el-tooltip>
      </el-row>
      <div class="grid-content ep-bg-purple">
        <div v-for="(item, index) in cmdToLabels" :key="index" class="card-cnt">
          <div class="card-cnt-left">
            <div class="card-cnt-menu">
              <el-dropdown @command="handleMenuCommand" placement="bottom-start">
                <el-button class="bg-mg">
                  <el-icon>
                    <CirclePlus />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="(menuItem, menuIdx) in menus"
                      :command="{ menuIdx, cmdIndex: item.cmdIndex, ...menuItem }" :key="menuIdx">{{ menuItem.title }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              【{{ index + 1 }}】
            </div>
            <div class="card-cnt-info" @click="goEditorLine(index + 1)">
              <div class="cnt-info-mock" v-if="item.type === 'mockAPI'">{{ item.label }}</div>
              <div class="cnt-info-normal" v-else>
                <div class="cnt-info-normal-line">
                  <p :class="!item.byPlatform ? 'info-left' : 'info-left-full'" :title="item.label">操作: {{ item.label }}
                  </p>
                  <p class="info-right" v-if="!item.byPlatform">标签名：{{ item.tag ? item.tag : '--' }}</p>
                </div>
                <div class="cnt-info-normal-line right-wider" v-if="!item.byPlatform">
                  <p class="info-left" :title="item.text">文案：{{ item.text ? item.text : '--' }}</p>
                  <p class="info-right" :title="item.path">页面：{{ item.path }}</p>
                </div>
              </div>
            </div>
          </div>
          <el-button class="button" text v-if="item.byPlatform" @click="editItem(item)">
            编辑
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
        </div>
      </div>
    </el-col>

    <!-- 3.Monaco编辑器 -->
    <el-col :span="colThreeSpan">
      <div id="container" class="code-limit"></div>
    </el-col>
  </el-row>

  <operation-dialog v-model="dialogFlag"
                    :currentMenu="currentMenu"
                    :e2eExtendsForm="e2eExtendsForm"
                    :isCreate="isCreate"
                    @addToCmds="addToCmdsCB"
                    :dialogFlag="dialogFlag"
                    @delFromCmds="delFromCmdsCB" />
  <toolsDlg ref="toolsDlgRef"
            @bubbleFormData="receiveToolsDlgData"
  />

</template>

<script setup lang="ts">
import { ref, onBeforeMount, reactive, computed, onMounted, onUnmounted } from 'vue'
import { getJsonFiles, previewAfterExtended, saveSpecFileAndJSON } from '@/api/workshop'
import { cmdToLabel, getCmds, getMockedApisWithoutDuplicate } from '@/views/GenCase/genCase';
import _ from 'lodash'
import {
  menus,
  ACTION_GET_DOM,
  formCfg
} from './menu'

import {
  ElCol,
  ElRow,
  ElIcon,
  ElButton,
  ElTooltip,
  ElEmpty,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElMessage
} from 'element-plus';

import { Edit, Plus } from '@element-plus/icons-vue'
import copy from 'copy-to-clipboard'

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// 组件
import operationDialog from './operationDialog.vue';
import toolsDlg from './toolsDlg.vue';

import type {
  LOAD_CASE_RESPONSE,
  TYPE_CMD_BY_PLATFORM,
  TYPE_ORIGIN_JSON,
  TYPE_SEMANTIC_ITEM,
  TYPE_MENU
} from '@/types/genCaseType'

let editor: monaco.editor.IStandaloneCodeEditor;
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

let currentHighlightIdx = ref<number>(0)
const toolsDlgRef = ref<InstanceType<typeof toolsDlg> | null>(null)
const code = ref<string>('')
const list = ref<string[]>([])
const loadingFlag = ref<boolean>(false)
const dialogFlag = ref<boolean>(false) // 弹窗显隐
const currentJsonFileName = ref<string>('')
const originJsonData = reactive<TYPE_ORIGIN_JSON>({ commands: [] })
const lineNums = reactive<Record<any, any>>({})
const currentMenu = reactive<TYPE_MENU>({
  cmdIndex: 0,
  menuIdx: 0,
  action: ACTION_GET_DOM,
  title: '获取 DOM 元素'
});
const e2eExtendsForm = reactive(_.cloneDeep(formCfg)) // 弹窗数据
const cmds = computed(() => {
  return getCmds(originJsonData.commands)
})

const isCreate = ref(true)
let currentEditIndex = 0
const updateIsCrateFlag = (f = false) => {
  isCreate.value = f
}
const loadMinitest = () => {
  getAndPreview()
}

const updateLoading = (f = true) => {
  loadingFlag.value = f
}

const cmdToLabels = computed<TYPE_SEMANTIC_ITEM[]>(() => {
  let mocks = getMockedApisWithoutDuplicate(originJsonData).map(i => ({
    type: 'mockAPI',
    label: `mock 微信原生 API：${i}`,
    cmdIndex: undefined,
    text: undefined,
    tag: undefined,
    path: undefined,
    byPlatform: false,
    command: undefined
  }))
  return [...mocks, ...cmdToLabel(cmds.value)]
});

const updateCurrentJsonFileName = (j: string, n = currentHighlightIdx.value) => {
  if (currentHighlightIdx.value === n && currentJsonFileName.value === j) return
  currentJsonFileName.value = j
  currentHighlightIdx.value = n
}

const updateCurrentJsonFileNameAndPreview = (j: string, n: number) => {
  updateCurrentJsonFileName(j, n);
  getAndPreview(0, currentJsonFileName.value)
};

// 新增操作菜单 按钮点击
const handleMenuCommand = (command: TYPE_MENU) => {
  Object.assign(currentMenu, command)
  updateIsCrateFlag(true)
  dialogFlag.value = true
}

const updateCurrentPreview = (res: LOAD_CASE_RESPONSE, loadAll: number) => {
  editor.setScrollPosition({ scrollTop: 0 });
  if (loadAll) {
    list.value = res.tasks;
  }
  code.value = res.preview;
  editor.setValue(res.preview);
  Object.assign(originJsonData, res.minitestJson)
  Object.assign(lineNums, res.lineNums)
}

const getAndPreview = async (loadAll = 1, jsonName = '') => {
  updateLoading()
  try {
    let res: LOAD_CASE_RESPONSE = await getJsonFiles({ loadAll: !jsonName ? 1 : 0, jsonName })
    if (res.errno === 0) {
      updateCurrentJsonFileName(res.tasks[0])
      updateCurrentPreview(res as LOAD_CASE_RESPONSE, loadAll);
    } else {
      console.error(res)
      ElMessage.error('没有找到 JSON 文件，请先录制 JSON Case')
    }
  } catch (e) {
    console.error(e);
    ElMessage.error(JSON.stringify(e).slice(0, 100))
  }
  updateLoading(false)
}

const goEditorLine = (key: number | string) => {
  let line = lineNums[key];
  editor.revealLineInCenter(line);
}

const currentSpecFileName = computed(() => {
  let name = currentJsonFileName.value
  return name.replace('.json', '.spec.js')
});

const saveSpec = async () => {
  updateLoading()
  let codeStr = editor.getValue()
  let res = await saveSpecFileAndJSON({
    codeStr,
    originJsonData,
    jsonFileName: currentJsonFileName.value,
    specFileName: currentSpecFileName.value
  })
  if (res?.errno === 0) {
    let cpTxt = /^[^.]+/g.exec(currentSpecFileName.value)
    if (cpTxt && cpTxt[0]) copy(cpTxt[0])

    ElMessage({
      message: currentSpecFileName.value + '保存完成，文件名已写入剪贴板',
      type: 'success'
    })
  } else {
    ElMessage.error(currentSpecFileName.value + '保存失败！' + res.errmsg)
  }
  updateLoading(false)
}

const editItem = (item: TYPE_SEMANTIC_ITEM) => {
  updateIsCrateFlag(false)
  let { cmdIndex, command } = item
  if (typeof cmdIndex !== 'number' || typeof command === 'undefined') return new TypeError('cmdIndex must be number, but got undefined')
  currentEditIndex = cmdIndex
  let cmdItem = originJsonData.commands[cmdIndex]
  let { action, data, menuIdx } = cmdItem
  // console.log(item);
  // console.log(cmdItem);
  // 更新弹窗内容
  Object.assign(currentMenu, {
    cmdIndex,
    action,
    menuIdx,
    title: menus[menuIdx].title
  })
  e2eExtendsForm[action].selectedValue = command
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  e2eExtendsForm[action].inputOptions[command] = data
  console.log(e2eExtendsForm);
  dialogFlag.value = true
}
const addToCmdsCB = async (cmdItem: TYPE_CMD_BY_PLATFORM, intoIdx: number) => {
  // 因为语义化开头是被 mock 的 wx api，所以 cmdIndex 为 undefined
  // 所以不能向后面增加操作，所以这个时候相当于是 commands 的开头 unshift 一项
  // 如果是编辑，则不是操作 cmdIndex + 1，而是操作 cmdIndex 自身
  originJsonData.commands.splice(intoIdx, isCreate.value ? 0 : 1, cmdItem);
  dialogCBUpdate()
}
const delFromCmdsCB = async () => {
  originJsonData.commands.splice(currentEditIndex, 1)
  dialogCBUpdate()
}
const dialogCBUpdate = async (extraData = {}) => {
  updateLoading()
  const res = await previewAfterExtended({ jsonName: currentJsonFileName.value, originJsonData, ...extraData })
  updateCurrentPreview(res as LOAD_CASE_RESPONSE, 0)
  updateLoading(false)
  return res
}

const receiveToolsDlgData = async (data:any) => {
  let { mockOpType, apiName, fieldName, fieldNewValue, positionType, codeStr } = data.data
  let res
  switch (data.type) {
    case 'mock':
      res = await dialogCBUpdate({ updateMock: { type: mockOpType, apiName, fieldName, fieldNewValue } })
      break
    case 'code':
      res = await dialogCBUpdate({ insertCode: { type: positionType, codeStr } })
      break
  }
  if (res?.extraOpsResult) {
    let { type, removedTotalMockCount, totalMockCount, replacedApis, replacedFields, leftCount } = res.extraOpsResult
    ElMessage.success(type === 'rmApiRes'
        ? `mock 接口总数${totalMockCount}，删除总数 ${removedTotalMockCount}，剩余总数 ${leftCount}`
        : `mock 接口总数${totalMockCount}，替换接口总数 ${replacedApis}，替换字段总数 ${replacedFields}`
    )
  }
}

const openToolsDlg = (type: 'mock'|'code') => toolsDlgRef.value?.showToolsDlg(type);

let drawerIsOpen = ref(true)
const colOneSpan = computed(() => drawerIsOpen.value ? 3 : 1)
const colThreeSpan = computed(() => drawerIsOpen.value ? 13 : 15)

const openOrClose = () => {
  drawerIsOpen.value = !drawerIsOpen.value
  console.log(233)
}

if (import.meta.env.DEV) {
  onBeforeMount(getAndPreview);
}

onMounted(() => {
  editor = monaco.editor.create(document.getElementById('container') as HTMLElement, {
    value: '// E2E Test Designed by 乘客前端/花小猪小程序 ',
    language: 'javascript',
    automaticLayout: true, // 自适应布局
    theme: 'vs-dark',
    renderLineHighlight: 'all', // 行亮
    selectOnLineNumbers: true, // 显示行号
    minimap: {
      enabled: true,
    },
    wordWrap: 'on', // 自动折行
    folding: true,
    readOnly: false, // 只读
    fontSize: 16, // 字体大小
    scrollBeyondLastLine: false, // 取消代码后面一大段空白
    overviewRulerBorder: false, // 不要滚动条的边框
    foldingMaximumRegions: 200000,
  })
});

onUnmounted(() => editor.dispose());

</script>

<style scoped lang="scss">
.pding-btm-10 {
  padding-bottom: 10px;
}
button {
  padding: 5px;
}

.button-area {
  display: flex;

  .import-btn,
  .save-btn {
    flex: none;
  }
}

.arrow-btn-area {
  text-align: center;
}

.bg-mg {
  background: #77CD9E;
  color: #fff;
  outline: none;
}

.mgnt20 {
  margin-top: 10px;
}

.lh20 {
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
  font-size: 14px;
}

.vtln {
  vertical-align: middle;
}

.mgnl10 {
  margin-left: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.file-item {
  cursor: pointer;
  height: 35px;
  line-height: 35px;
  color: rgb(96, 98, 102);
  font-weight: 500;
  margin: 2px 6px 2px 0;
  padding-left: 10px;
  border-radius: 4px;
}

.file-item-hl,
.file-item:hover {
  background: #77CD9E;
  color: #fff;
}

.code-limit {
  height: 800px;
  overflow: scroll;
}

.card-cnt {
  box-sizing: border-box;
  border: 1px solid #999999;
  height: 50px;
  margin-bottom: 5px;
  border-radius: 4px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-cnt:hover {
  box-shadow: var(--el-box-shadow-light);
}

.card-cnt-left {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-cnt-menu {
  flex-shrink: 0;
  line-height: 32px;
}

.grid-content {
  max-height: 800px;
  overflow: scroll;
}

.card-cnt-info {
  cursor: pointer
}

.cnt-info-normal {
  max-width: 26vw;
}

.cnt-info-normal-line {
  display: flex;
}

.cnt-info-normal-line p {
  margin-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cnt-info-normal-line .info-left {
  width: 250px;
}

.cnt-info-normal-line .info-left-full {
  width: 100%;
}

.cnt-info-normal-line .info-right {
  width: 290px;
}
</style>
