import { defineStore } from 'pinia'
import axios from 'axios'
import type { Report, SystemInfo } from 'src/common/js/apiTypes'

type BaseData = {
  data: {
    reportList: Report[]
  },
  error: number
}

type SystemData = {
  data: SystemInfo,
  error: number
}

type State = {
  reportList: Report[],
  counter: number,
  systemInfo: SystemInfo
}

export const useCounterStore = defineStore({
  id: 'counter',
  state: (): State => ({
    reportList: [],
    counter: 0,
    systemInfo: {
      brand: "devtools",
      model: "iPhone X",
      platform: "devtools",
      screenHeight: 812,
      screenWidth: 375,
      system: "iOS 10.0.1",
    }
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    increment() {
      this.counter++
    },
    async getData() {
      const isDEV = import.meta.env.DEV
      const path = isDEV ? 'http://localhost:8886' : location.origin
      const response = await axios.get<BaseData>(`${path}/common/testResult`)
      this.reportList = response.data.data.reportList
    },
    async getSystemInfo() {
      const isDEV = import.meta.env.DEV
      const path = isDEV ? 'http://localhost:8886' : location.origin
      const response = await axios.get<SystemData>(`${path}/common/systemInfo`)
      this.systemInfo = response.data.data
    }
  }
})
