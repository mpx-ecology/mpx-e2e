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
        <div v-for="(item, index) in cmdToLabels" :key="index" @click="goEditorLine(index + 1)"
            class="card-cnt">
          <div class="card-cnt-left">
            <p class="card-cnt-menu">
              <el-button class="bg-mg">
                <el-icon><CirclePlus /></el-icon>
              </el-button>
              【{{ index + 1 }}】
            </p>
            <div class="card-cnt-info">
              <div class="cnt-info-mock" v-if="item.type === 'mockAPI'">{{item.label}}</div>
              <div class="cnt-info-normal" v-else>
                <p>
                  <span>操作: {{item.label}}</span>
                </p>
                <p>
                  <span>页面：{{item.path}}</span>
                  <span v-if="item.tag">标签名：{{item.tag}}</span>
                </p>
              </div>
            </div>
          </div>
          <el-button class="button" text if="item.byPlatform">
            编辑
            <el-icon><Edit /></el-icon>
          </el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="13">
<!--      <div class="code-limit">-->
<!--        <highlight-js-->
<!--            autodectect-->
<!--            language="js"-->
<!--            :code="code"-->
<!--        />-->
<!--      </div>-->
      <div id="container" class="code-limit"></div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, reactive, computed, onMounted, onUnmounted } from 'vue'
import { getJsonFiles } from '@/api/workshop'
import { cmdToLabel, getCmds, getMockedApisWithoutDuplicate } from "@/views/GenCase/genCase";
import {
  ElCol,
  ElRow,
  ElIcon,
  ElButton,
  ElTooltip,
  ElEmpty,
  ElCard
} from 'element-plus';

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

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

const code = ref<string>('');
const list = ref<string[]>([]);
const currentJsonFileName = ref<string>('');
let currentJson = reactive<Record<any, any>>({});
let lineNums = reactive<Record<string, number>>({});

const cmds = ref<Record<any, any>[]>([]);
const cmdToLabels = computed(() => {
  let mocks = getMockedApisWithoutDuplicate(currentJson).map(i => ({ type: 'mockAPI', label: `mock 微信原生 API：${i}`}))
  return [...mocks, ...cmdToLabel(cmds.value)]
});
let editor: monaco.editor.IStandaloneCodeEditor;

const updateCurrentJsonFileName = (n: string, idx: number) => {
  if (currentJsonFileName.value === n || isNaN(idx)) return (currentJsonFileName.value = n);
  currentJsonFileName.value = n;
  getAndPreview(0, 0, 0, n)
};

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
  currentJson = res.originData;
  lineNums = res.lineNums;
  cmds.value = getCmds(currentJson)
});

const goEditorLine = (key:string) => {
  let line = lineNums[key];
  editor.revealLineInCenter(line);
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
    minimap:{
      enabled: false,
    },
    wordWrap: 'on', // 自动折行
    folding: true,
    readOnly: true, // 只读
    fontSize: 16, // 字体大小
    scrollBeyondLastLine: false, // 取消代码后面一大段空白
    overviewRulerBorder: false, // 不要滚动条的边框
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

.card-cnt-left {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-cnt-menu {
  flex-shrink: 0;
}
.grid-content {
  max-height: 800px;
  overflow: scroll;
}

.cnt-info-normal span {
  margin-left: 5px
}
</style>
