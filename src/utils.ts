import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http'
// import axios from 'axios'

interface Img {
  path: string,
  src: string
}

export const imgList: Img[] = []

export function pushImg (params: Img): void {
  imgList.push(params)
  // axios.post('http://localhost:8886/common/imgList', {imgList})
  const req = http.request({
    port: 8886,
    method: 'POST',
    hostname: 'localhost',
    path: '/common/imgList',
    headers: {
      'Content-Type': 'application/json',
    }
  }, () => {
    // console.log('发送成功')
  })
  req.write(JSON.stringify(params))
  req.end()
}

export function pushExpect (): void {
  // axios.post('http://localhost:8886/common/imgList', {imgList})
  const req = http.request({
    port: 8886,
    method: 'POST',
    hostname: 'localhost',
    path: '/common/expectList',
    headers: {
      'Content-Type': 'application/json',
    }
  }, () => {
    // console.log('发送成功')
  })
  // req.write(JSON.stringify(params))
  req.end()
}

export function emitFile (): void {
  try {
    const dist = path.resolve(__dirname, './testResult.json')
    const oldFile = fs.readFileSync(dist, 'utf8')
    const data = JSON.parse(oldFile)
    data.imgList = imgList
    fs.writeFileSync(dist, JSON.stringify(data))
  } catch (error) {
    console.log(error)
  }
}