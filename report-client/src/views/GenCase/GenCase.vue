<template>
  <el-row :gutter="20" v-loading="loadingFlag">
    <el-col :span="3">
      <div>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="将IDE录制回放的json进行导入，例 minitest-1.json"
            placement="right-start"
        >
          <el-button type="success" class="mpx-btn" @click="loadMinitest">
            JSON 导入
            <el-icon>
              <QuestionFilled/>
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <div class="mgnt20" else>
        <p class="lh20 file-item"
           @click="updateCurrentJsonFileNameAndPreview(item, index)"
           :class="currentHighlightIdx === index ? 'file-item-hl' : ''"
           v-for="(item, index) in list"
           :key="index">
          <el-icon class="vtln">
            <Document/>
          </el-icon>
          <span class="mgnl10" :title="item">{{ item }}</span>
        </p>
      </div>
    </el-col>
    <el-col :span="8">
      <el-empty v-if="list.length <= 0" description="空空如也，快导入你的 json 吧"></el-empty>
      <div class="grid-content ep-bg-purple">
        <div v-for="(item, index) in cmdToLabels"
             :key="index"
             class="card-cnt">
          <div class="card-cnt-left">
            <div class="card-cnt-menu">

              <el-dropdown @command="handleMenuCommand">
                <el-button class="bg-mg">
                  <el-icon>
                    <CirclePlus/>
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="(menuItem, menuIdx) in menus"
                                      :command="{ menuIdx, cmdIndex: item.cmdIndex, ...menuItem }"
                                      :key="menuIdx">{{ menuItem.title }}
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
                  <p :class="!item.byPlatform ? 'info-left' : 'info-left-full'" :title="item.label">操作: {{ item.label }}</p>
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
              <Edit/>
            </el-icon>
          </el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="13">
      <!--      <h3 class="txt-center">{{currentSpecFileName}}</h3>-->
      <div id="container" class="code-limit"></div>
      <div class="save-btn-wrapper">
        <el-tooltip
            class="box-item"
            effect="dark"
            :content="'将' + currentSpecFileName + '保存到 case 目录' "
            placement="right-start"
        >
          <el-button type="success" class="bg-mg"  @click="saveSpec">
            保存
            <el-icon>
              <QuestionFilled/>
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </el-col>
  </el-row>
  <el-dialog v-model="dialogFlag" :title="currentMenu.title">
    <el-form :model="e2eExtendsForm[currentMenu.action]">
      <div>
        <el-form-item v-if="e2eExtendsForm[currentMenu.action].selectOptions"
                      label="操作类型：" :label-width="formLabelWidth">
          <el-select v-model="e2eExtendsForm[currentMenu.action].selectedValue"
                     placeholder="选择操作类型">
            <el-option v-for="(rItem, rIdx) in e2eExtendsForm[currentMenu.action].selectOptions"
                       :key="rIdx"
                       :label="rItem.label"
                       :value="rItem.value"/>
          </el-select>
        </el-form-item>
        <div v-for="(iVal, iKey) in e2eExtendsForm[currentMenu.action].inputOptions"
             :data-some="iKey"
             :key="iKey"
        >
          <div v-if="typeof e2eExtendsForm[currentMenu.action].selectedValue === 'undefined' || iKey === e2eExtendsForm[currentMenu.action].selectedValue">
            <el-form-item  v-for="(iItem, iIdx) in iVal"
                           :key="iIdx"
                           :label-width="formLabelWidth"
                           :label="iItem.label">
              <el-input
                  :data-s="iItem"
                  v-model="iItem.value"
                  :placeholder="iItem?.placeholder"
                  autocomplete="off"/>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dlgCancel" class="normal-btn">取消</el-button>
        <el-button @click="addToCmds" class="bg-mg">确认</el-button>
        <el-button v-show="!isCreate" type="danger" @click="delFromCmds">删除</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, onBeforeMount, reactive, computed, onMounted, onUnmounted } from 'vue'
import {getJsonFiles, previewAfterExtended, saveSpecFileAndJSON} from '@/api/workshop'
import {cmdToLabel, getCmds, getMockedApisWithoutDuplicate} from '@/views/GenCase/genCase';
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
  ElDialog,
  ElForm,
  ElInput,
  ElSelect,
  ElOption,
  ElFormItem,
  ElMessage
} from 'element-plus';

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import type {
  LOAD_CASE_RESPONSE,
  MENU_TYPE,
  TYPE_CMD_BY_PLATFORM,
  TYPE_ORIGIN_JSON,
  TYPE_SEMANTIC_ITEM
} from '../../types/genCaseType'

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
const formLabelWidth = '120px'
const code = ref<string>('')
const list = ref<string[]>([])
const loadingFlag = ref<boolean>(false)
const dialogFlag = ref<boolean>(false)
const currentJsonFileName = ref<string>('')
const originJsonData = reactive<TYPE_ORIGIN_JSON>({ commands: [] })
const lineNums = reactive<Record<any, any>>({})
const currentMenu = reactive<Record<any, any>>({
  cmdIndex: 0,
  menuIdx: 0,
  action: ACTION_GET_DOM,
  title: '获取 DOM 元素'
});
const e2eExtendsForm = reactive(_.cloneDeep(formCfg))
const cmds = computed(() => {
  return getCmds(originJsonData.commands)
})
const isCreate = ref(true)

let currentEditIndex = 0

const updateIsCrateFlag = (f = false) => {
  isCreate.value = f
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

const updateCurrentJsonFileName = (j:string, n = currentHighlightIdx.value) => {
  if (currentHighlightIdx.value === n && currentJsonFileName.value === j) return
  currentJsonFileName.value = j
  currentHighlightIdx.value = n
}

const updateCurrentJsonFileNameAndPreview = (j: string, n: number) => {
  updateCurrentJsonFileName(j, n);
  getAndPreview(0, currentJsonFileName.value)
};

const handleMenuCommand = (command: Record<any, any>) => {
  Object.assign(currentMenu, command)
  updateIsCrateFlag(true)
  dialogFlag.value = true
}

const updateCurrentPreview = (res: LOAD_CASE_RESPONSE, loadAll: number) => {
  editor.setScrollPosition({scrollTop: 0});
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
    let res: LOAD_CASE_RESPONSE = await getJsonFiles({loadAll: !jsonName ? 1 : 0, jsonName})
    if (res.errno === 0) {
      updateCurrentJsonFileName(res.tasks[0])
      updateCurrentPreview(res as LOAD_CASE_RESPONSE, loadAll);
    } else {
      console.error(res)
      ElMessage.error('没有找到 JSON 文件，请先录制 json')
    }
  } catch (e) {
    console.error(e);
    ElMessage.error(JSON.stringify(e).slice(0, 100))
  }
  updateLoading(false)
}

const goEditorLine = (key: number|string) => {
  let line = lineNums[key];
  editor.revealLineInCenter(line);
}

const currentSpecFileName = computed(() => {
  let name = currentJsonFileName.value
  return name.replace('.json', '.spec.js')
});

const addToCmds = async () => {
  let { menuIdx, action, cmdIndex = 0} = currentMenu
  let command = e2eExtendsForm[action].selectedValue
  const intoIdx = command ? isCreate.value ? cmdIndex + 1 : cmdIndex : 0
  let cmdItem = {
    command,
    byPlatform: true,
    timestamp: Date.now(),
    action,
    menuIdx,
    data: e2eExtendsForm[action].inputOptions[command]
  } as unknown as TYPE_CMD_BY_PLATFORM
  // 因为语义化开头是被 mock 的 wx api，所以 cmdIndex 为 undefined
  // 所以不能向后面增加操作，所以这个时候相当于是 commands 的开头 unshift 一项
  // 如果是编辑，则不是操作 cmdIndex + 1，而是操作 cmdIndex 自身
  console.log('addToCmds', isCreate.value, cmdItem);
  originJsonData.commands.splice(intoIdx, isCreate.value ? 0 : 1, cmdItem);
  dialogFlag.value = false
  updateLoading()
  const res = await previewAfterExtended({jsonName: currentJsonFileName.value, originJsonData})
  updateCurrentPreview(res as LOAD_CASE_RESPONSE, 0)
  Object.assign(e2eExtendsForm, _.cloneDeep(formCfg))
  updateLoading(false)
}

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
    updateLoading(false)
    ElMessage({
      message: currentSpecFileName.value + '保存成功',
      type: 'success',
    })
  } else {
    ElMessage.error(currentSpecFileName.value + '保存失败！' + res.errmsg)
  }
}

const editItem = (item: TYPE_SEMANTIC_ITEM) => {
  updateIsCrateFlag(false)
  let { cmdIndex, command } = item
  if (typeof cmdIndex !== 'number' || typeof command === 'undefined') return new TypeError('cmdIndex must be number, but got undefined')
  currentEditIndex = cmdIndex
  let cmdItem= originJsonData.commands[cmdIndex]
  let { action, data, menuIdx } = cmdItem
  console.log(item);
  console.log(cmdItem);
  // 更新弹窗内容
  Object.assign(currentMenu, {
    cmdIndex,
    action,
    menuIdx,
    title: menus[menuIdx].title
  })
  e2eExtendsForm[action].selectedValue = command as MENU_TYPE
  e2eExtendsForm[action].inputOptions[command] = data
  console.log(e2eExtendsForm);
  dialogFlag.value = true
}

const delFromCmds = async () => {
  originJsonData.commands.splice(currentEditIndex, 1)
  const res = await previewAfterExtended({ jsonName: currentJsonFileName.value, originJsonData })
  updateCurrentPreview(res as LOAD_CASE_RESPONSE, 0)
  Object.assign(e2eExtendsForm, _.cloneDeep(formCfg))
  updateLoading(false)
  dialogFlag.value = false
}

const dlgCancel = () => {
  dialogFlag.value = false
  Object.assign(e2eExtendsForm, _.cloneDeep(formCfg))
}
if (import.meta.env.DEV) {
  onBeforeMount(getAndPreview);
}
const loadMinitest = () => {
  getAndPreview()
}

const updateLoading = (f = true) => {
  loadingFlag.value = f
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
    foldingMaximumRegions: 100000,
  })
});

onUnmounted(() => editor.dispose());

</script>

<style scoped>
.cwhite {
  color: #fff;
}
.normal-btn:hover {
  color:#77CD9E!important;
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
.mpx-btn {
  background: #77CD9E;
}

.txt-center {
  text-align: center;
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
  /*padding-left: 20px;*/
  cursor: pointer;
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: rgb(96, 98, 102);
  font-weight: 500;
}

.file-item-hl, .file-item:hover {
  background: #77CD9E;
}

.code-limit {
  height: 790px;
  overflow: scroll;
}

.save-btn-wrapper {
  margin-top: 10px;
  height: 40px;
  display: flex;
  box-sizing: border-box;
}

.card-cnt {
  box-sizing: border-box;
  border: 1px solid #999999;
  height: 50px;
  margin-top: 5px;
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
  max-width: 21vw;
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
