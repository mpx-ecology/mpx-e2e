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
           @click="updateCurrentJsonFileName(item, index)"
           :class="currentJsonFileName === item ? 'file-item-hl' : ''"
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
                                      :command="{ index: item.cmdIndex, ...menuItem }"
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
    </el-col>
  </el-row>
  <el-dialog v-model="dialogFlag" :title="currentMenu.title + currentMenu.action">
    <el-form :model="e2eExtendsForm[currentMenu.action]">
      <div v-if="e2eExtendsForm[currentMenu.action].inputOptions">
        <el-form-item v-for="(iItem, iIdx) in e2eExtendsForm[currentMenu.action].inputOptions"
                      :key="iIdx"
                      :label="e2eExtendsForm[currentMenu.action][iItem + 'Label'] || iItem.defaultLabel"
                      :label-width="formLabelWidth">
          <el-input v-model="e2eExtendsForm[currentMenu.action][iItem]" autocomplete="off"/>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="操作类型：" :label-width="formLabelWidth">
          <el-select v-model="e2eExtendsForm[currentMenu.action].selectedValue"
                     placeholder="选择操作类型">
            <el-option v-for="(rItem, rIdx) in e2eExtendsForm[currentMenu.action].listOptions"
                       :key="rIdx"
                       :label="rItem.label"
                       :value="rItem.value"/>
          </el-select>
        </el-form-item>
        <el-form-item  :label-width="formLabelWidth"
            :label="e2eExtendsForm[currentMenu.action][e2eExtendsForm[currentMenu.action].selectedValue + 'Label'] || e2eExtendsForm[currentMenu.action].defaultLabel">
          <el-input v-model="e2eExtendsForm[currentMenu.action][e2eExtendsForm[currentMenu.action].selectedValue + 'Val']"
                    autocomplete="off"/>
        </el-form-item>
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
import {ref, onBeforeMount, reactive, computed, onMounted, onUnmounted} from 'vue'
import {getJsonFiles} from '@/api/workshop'
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

const formLabelWidth = '100px';
const code = ref<string>('');
const list = ref<string[]>([]);
const dialogFlag = ref<boolean>(false);
const currentJsonFileName = ref<string>('');
let originJsonData = reactive({});
let lineNums = reactive({});
let currentMenu = reactive<Record<any, any>>({
  index: 0,
  action: ACTION_GET_DOM,
  title: '获取 DOM 元素'
});
let e2eExtendsForm = reactive({
  [ACTION_GET_DOM]: {
    inputOptions: ['clazzName', 'compName'],
    clazzNameLabel: '元素类名：',
    compNameLabel: '组件名：'
  },
  [ACTION_WAIT_FOR]: {
    listOptions: [
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
    waitForSomeTimeVal: 10000,
    waitForApiResponseVal: '',
    waitForExactRouterVal: '',
    waitForSomeTimeLabel: '时长：',
    waitForExactRouterLabel: '页面 path：',
    waitForApiResponseLabel: '接口 path：'
  },
  [ACTION_ROUTER_OPERATED]: {
    listOptions: [
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
    operateRouterNavigateBackVal: '',
    operateRouterRelaunchVal: '',
    operateRouterNavigateToVal: '',
    operateRouterRedirectToVal: '',
    operateRouterSwitchTabVal: '',
    defaultLabel: 'path：'
  },
  [ACTION_ASSERTION_ADDED]: {
    listOptions: [
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
        label: '断言元素长度',
        value: 'assertElementLength'
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
    assertTextContentVal: '',
    assertTextContentLabel: '预期文案：',
    assertTextLengthVal: '',
    assertTextLengthLabel: '预期文案长度：',
    assertTextByRegExpVal: '',
    assertTextByRegExpLabel: '匹配正则：',
    assertElementWidthVal: '',
    assertElementWidthLabel: '预期宽度：',
    assertElementLengthVal: '',
    assertElementLengthLabel: '预期长度：',
    assertElementExistenceVal: '',
    assertElementExistenceLabel: '元素存在否：',
    assertResponseFiledValueVal: '',
    assertResponseFiledValueLabel: '取值表达式：'
  },
  [ACTION_SCREENSHOT_ADDED]: {
    inputOptions: ['fileName', 'savePath'],
    fileNameLabel: '文件名：',
    savePathLabel: '保存路径：'
  }
})

const cmds = computed(() => {
  return getCmds(originJsonData)
})

const cmdToLabels = computed(() => {
  let mocks = getMockedApisWithoutDuplicate(originJsonData).map(i => ({type: 'mockAPI', label: `mock 微信原生 API：${i}`}))
  return [...mocks, ...cmdToLabel(cmds.value)]
});

const updateCurrentJsonFileName = (n: string, idx: number) => {
  if (currentJsonFileName.value === n || isNaN(idx)) return (currentJsonFileName.value = n);
  currentJsonFileName.value = n;
  getAndPreview(0, 0, 0, n)
};

const handleMenuCommand = (command: Record<any, any>) => {
  console.log(command);
  Object.assign(currentMenu, command)
  dialogFlag.value = true
}

const getAndPreview = (write = 0, preview = 0, loadAll = 1, jsonName = '') => getJsonFiles(
    {
      write,
      preview,
      loadAll: !jsonName ? 1 : 0,
      jsonName
    }
).then((res: any) => {
  editor.setScrollPosition({scrollTop: 0});

  if (loadAll) {
    list.value = res.tasks;
  }

  code.value = res.preview;
  editor.setValue(res.preview);
  updateCurrentJsonFileName(res.tasks[0], NaN);
  Object.assign(originJsonData, res.originData)
  Object.assign(lineNums, res.lineNums)
});

const goEditorLine = (key: string) => {
  let line = lineNums[key];
  editor.revealLineInCenter(line);
}

const currentSpecFileName = computed(() => {
  let name = currentJsonFileName.value
  return name.replace('.json', '.spec.js')
});

const addToCmds = e => {
  let idx = currentMenu.index;
  let action = currentMenu.action;
  let isSimpleCmd = [ACTION_GET_DOM, ACTION_SCREENSHOT_ADDED].includes(action);
  let command = isSimpleCmd ? action : e2eExtendsForm[action].selectedValue
  let cmdItem = { command, byPlatform: true }
  if (isSimpleCmd) {
    let ops = e2eExtendsForm[command].inputOptions;
    ops.forEach(i => {
      cmdItem[i] = ops[i]
    })
  } else {
    let key = command + 'Val'
    cmdItem[key] = e2eExtendsForm[currentMenu.action][key]
  }
  console.log(idx)
  originJsonData.commands.splice(idx + 1, 0, cmdItem)
  dialogFlag.value = false
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
      enabled: false,
    },
    wordWrap: 'on', // 自动折行
    folding: true,
    readOnly: true, // 只读
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
  height: 800px;
  overflow: scroll;
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
