<template>
  <el-row :gutter="20">
    <el-col :span="3">
      <div>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="将IDE录制回放的json进行导入，例 minitest-1.json"
            placement="right-start"
        >
          <el-button type="success" style="background: #77CD9E;">
            JSON 导入
            <el-icon>
              <QuestionFilled/>
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <el-empty v-if="list.length <= 0" description="空空如也，快导入你的 json 吧"></el-empty>
      <div class="mgnt20" v-else>
        <p class="lh20 file-item"
           @click="updateCurrentJsonFileNameAndPreview(item, index)"
           :class="currentHighlightIdx === index ? 'file-item-hl' : ''"
           v-for="(item, index) in list" :key="index">
          <el-icon class="vtln">
            <Document/>
          </el-icon>
          <span class="mgnl10">{{ item }}</span>
        </p>
      </div>
    </el-col>
    <el-col :span="8">
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
                                      :command="{ menuIdx, cmdIdx: item.cmdIndex, ...menuItem }"
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
                  <p class="info-left" :title="item.label">操作: {{ item.label }}</p>
                  <p class="info-right">标签名：{{ item.tag ? item.tag : '--' }}</p>
                </div>
                <div class="cnt-info-normal-line right-wider">
                  <p class="info-left" :title="item.text">文案：{{ item.text ? item.text : '--' }}</p>
                  <p class="info-right" :title="item.path">页面：{{ item.path }}</p>
                </div>
              </div>
            </div>
          </div>
          <el-button class="button" text v-if="item.byPlatform">
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
          <el-button type="success" style="background: #77CD9E;" @click="saveSpec">
            保存
            <el-icon>
              <QuestionFilled/>
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </el-col>
  </el-row>
  <el-dialog v-model="dialogFlag" :title="currentMenu.title + currentMenu.action">
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
                  :placeholder="iItem.placeholder"
                  autocomplete="off"/>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFlag = false">取消</el-button>
        <el-button type="primary" @click="addToCmds">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, onBeforeMount, reactive, computed, onMounted, onUnmounted } from 'vue'
import {getJsonFiles, previewAfterExtended, saveSpecFileAndJSON} from '@/api/workshop'
import {cmdToLabel, getCmds, getMockedApisWithoutDuplicate} from '@/views/GenCase/genCase';
import {
  menus,
  ACTION_SCREENSHOT_ADDED,
  ACTION_ROUTER_OPERATED,
  ACTION_ASSERTION_ADDED,
  ACTION_WAIT_FOR,
  ACTION_GET_DOM
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
  ElFormItem
} from 'element-plus';

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

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
const dialogFlag = ref<boolean>(false)
const currentJsonFileName = ref<string>('')
const originJsonData = reactive({})
const lineNums = reactive({})
const currentMenu = reactive<Record<any, any>>({
  cmdIdx: 0,
  menuIdx: 0,
  action: ACTION_GET_DOM,
  title: '获取 DOM 元素'
});
const e2eExtendsForm = reactive({
  [ACTION_GET_DOM]: {
    inputOptions: {
      clazzName: [
        {
          label: '元素类名：',
          value: ''
        }
      ],
      compName: [
        {
          label: '组件名：',
          value: ''
        }
      ]
    }
  },
  [ACTION_WAIT_FOR]: {
    selectOptions: [
      {
        label: 'waitFor 时间',
        value: 'waitForSomeTime'
      },
      {
        label: 'waitFor 页面路由',
        value: 'waitForExactRouter'
      },
      {
        label: 'waitFor 接口',
        value: 'waitForApiResponse'
      }
    ],
    selectedValue: 'waitForSomeTime',
    inputOptions: {
      waitForSomeTime: [
        {
          value: 10000,
          label: '时长：'
        }
      ],
      waitForExactRouter: [
        {
          value: '',
          label: '页面 path：'
        }
      ],
      waitForApiResponse: [
        {
          value: '',
          label: '接口 path：'
        }
      ]
    }
  },
  [ACTION_ROUTER_OPERATED]: {
    selectOptions: [
      {
        label: 'navigateBack',
        value: 'operateRouterNavigateBack'
      },
      {
        label: 'reLaunch',
        value: 'operateRouterRelaunch'
      },
      {
        label: 'navigateTo',
        value: 'operateRouterNavigateTo'
      },
      {
        label: 'redirectTo',
        value: 'operateRouterRedirectTo'
      },
      {
        label: 'switchTab',
        value: 'operateRouterSwitchTab'
      }
    ],
    selectedValue: 'operateRouterNavigateBack',
    inputOptions: {
      operateRouterNavigateBack: [],
      operateRouterRelaunch: [
        {
          value: '',
          label: 'ReLaunch Url:'
        }
      ],
      operateRouterNavigateTo: [
        {
          value: '',
          label: 'NavigateTo Url:'
        }
      ],
      operateRouterRedirectTo: [
        {
          value: '',
          label: 'RedirectTo Url:'
        }
      ],
      operateRouterSwitchTab: [
        {
          value: '',
          label: 'SwitchTab Url:'
        }
      ],
    }
  },
  [ACTION_ASSERTION_ADDED]: {
    selectOptions: [
      {
        label: '断言元素文案内容',
        value: 'assertTextContent'
      },
      {
        label: '断言元素文案长度',
        value: 'assertTextLength'
      },
      {
        label: '断言元素文案符合RegExp',
        value: 'assertTextByRegExp'
      },
      {
        label: '断言元素宽度',
        value: 'assertElementWidth'
      },
      {
        label: '断言元素高度',
        value: 'assertElementHeight'
      },
      {
        label: '断言元素是否存在',
        value: 'assertElementExistence'
      },
      {
        label: '断言接口返回字段',
        value: 'assertResponseFiledValue'
      }
    ],
    selectedValue: 'assertTextContent',
    inputOptions: {
      assertTextContent: [
        {
          value: '',
          label: '预期文案：'
        }
      ],
      assertTextLength: [
        {
          value: '',
          label: '预期文案长度：',
        }
      ],
      assertTextByRegExp: [
        {
          value: '',
          label: '正则元字符：'
        },
        {
          value: '',
          label: '正则修饰符：'
        }
      ],
      assertElementWidth: [
        {
          value: '',
          label: '操作符：',
          placeholder: '===, >=, <='
        },
        {
          value: '',
          label: '预期宽度：'
        }
      ],
      assertElementHeight: [
        {
          value: '',
          label: '操作符：',
          placeholder: '===, >=, <='
        },
        {
          value: '',
          label: '预期高度：'
        }
      ],
      assertElementExistence: [],
      assertResponseFiledValue: [
        {
          value: '',
          label: '取值表达式：'
        },
        {
          value: '',
          label: '比较操作符：'
        },
        {
          value: '',
          label: '返回值预期：'
        }
      ]
    }
  },
  [ACTION_SCREENSHOT_ADDED]: {
    inputOptions: {
      fileName: [
        {
          value: '',
          label: '文件名：'
        }
      ],
      savePath: [
        {
          value: '',
          label: '保存路径：'
        }
      ]
    }
  }
})
const cmds = computed(() => {
  return getCmds(originJsonData)
})

const cmdToLabels = computed(() => {
  let mocks = getMockedApisWithoutDuplicate(originJsonData).map(i => ({type: 'mockAPI', label: `mock 微信原生 API：${i}`, cmdIndex: void 0}))
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
  dialogFlag.value = true
}

const updateCurrentPreview = (res, loadAll) => {
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
  let res = await getJsonFiles({loadAll: !jsonName ? 1 : 0, jsonName})
  updateCurrentJsonFileName(res.tasks[0])
  updateCurrentPreview(res, loadAll)
}

const goEditorLine = (key: string) => {
  let line = lineNums[key];
  editor.revealLineInCenter(line);
}

const currentSpecFileName = computed(() => {
  let name = currentJsonFileName.value
  return name.replace('.json', '.spec.js')
});

const addToCmds = async e => {
  let cmdIdx = currentMenu.cmdIdx ?? 0;
  let action = currentMenu.action;
  let isSimpleCmd = typeof e2eExtendsForm[action].selectedValue === 'undefined' // 没有 select 的算简单命令
  let command = isSimpleCmd ? action : e2eExtendsForm[action].selectedValue
  let cmdItem = {command, byPlatform: true, timestamp: Date.now(), action, ...currentMenu}
  if (isSimpleCmd) {
    cmdItem.data = e2eExtendsForm[action].inputOptions
  } else {
    // let key = command + 'Val'
    // cmdItem[key] = e2eExtendsForm[currentMenu.action][key]
    cmdItem.data = e2eExtendsForm[action].inputOptions[command]
  }
  console.log(cmdItem);
  // 因为语义化开头是被 mock 的 wx api，所以 cmdIdx 为 undefined
  // 所以不能向后面增加操作，所以这个时候相当于是 commands 的开头 unshift 一项
  const intoIdx = command ? cmdIdx + 1 : 0
  originJsonData.commands.splice(intoIdx, 0, cmdItem);
  dialogFlag.value = false
  const res = await previewAfterExtended({jsonName: currentJsonFileName.value, originJsonData})
  updateCurrentPreview(res, 0)
}

const saveSpec = () => {
  let codeStr = editor.getValue()
  saveSpecFileAndJSON({
    codeStr,
    originJsonData,
    jsonFileName: currentJsonFileName.value,
    specFileName: currentSpecFileName.value
  })
}

onBeforeMount(getAndPreview);

onMounted(() => {
  editor = monaco.editor.create(document.getElementById('container') as HTMLElement, {
    value: '',
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
.bg-mg {
  background: #77CD9E;
  color: #fff;
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

.txt-center {
  text-align: center;
}

.vtln {
  vertical-align: middle;
}

.mgnl10 {
  margin-left: 5px;
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

.cnt-info-normal {
  max-width: 440px;
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
  width: 200px;
}

.cnt-info-normal-line .info-right {
  width: 240px;
}
</style>
