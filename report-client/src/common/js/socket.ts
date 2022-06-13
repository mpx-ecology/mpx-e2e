function initSocket (): void {
  const ws = new WebSocket('ws://localhost:8885')
  ws.onopen = function () {
    console.log('客户端连接成功')
  }
  ws.onmessage = function (e) {
    console.log(JSON.parse(e.data))
  }
  ws.onclose = function () {
    console.log('客户端连接关闭')
  }
  ws.onerror = function () {
    console.log('客户端连接错误')
  }
}

export default initSocket
