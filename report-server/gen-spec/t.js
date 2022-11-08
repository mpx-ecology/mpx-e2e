const { pathToRegexp } = require('path-to-regexp');

let resStr = "{\"data\":{\"errno\":0,\"errmsg\":\"ok\",\"data\":{\"product_id\":430,\"eta\":8,\"eta_distance\":2000,\"eta_str\":\"在这里上车\",\"order_stat\":1,\"loc\":[{\"dirverId\":485559319,\"coords\":[{\"x\":39.924376,\"y\":116.365681,\"type\":2,\"timestamp\":1667551506,\"angle\":162}],\"status\":9999,\"channel\":430,\"car_level\":4800},{\"dirverId\":3150353779,\"coords\":[{\"x\":39.912376,\"y\":116.365681,\"type\":2,\"timestamp\":1667551506,\"angle\":112}],\"status\":9999,\"channel\":430,\"car_level\":4800},{\"dirverId\":3780879293,\"coords\":[{\"x\":39.918376,\"y\":116.377681,\"type\":2,\"timestamp\":1667551506,\"angle\":175}],\"status\":9999,\"channel\":430,\"car_level\":4800}],\"isexist_car\":0,\"t_eta\":{\"eta\":0,\"eta_distance\":0,\"eta_str\":\"\"},\"isshow_eta\":1,\"loop_interval\":5}},\"header\":{\"Date\":\"Fri, 04 Nov 2022 08:45:06 GMT\",\"Content-Type\":\"text/plain; charset=utf-8\",\"Content-Length\":\"691\",\"Connection\":\"keep-alive\"},\"statusCode\":200,\"cookies\":[],\"errMsg\":\"request:ok\",\"status\":200,\"headers\":{\"Date\":\"Fri, 04 Nov 2022 08:45:06 GMT\",\"Content-Type\":\"text/plain; charset=utf-8\",\"Content-Length\":\"691\",\"Connection\":\"keep-alive\"}}";

const reg = new RegExp(`"(Date)":(?:"([^"]+)"|([^,]+))`, 'img');

let res = resStr.replace(reg, (w, $1, $2, $3) => {
  console.log(0, w)
  console.log(1, $1)
  console.log(2, $2)
  console.log(3, $3)

  return $2 ? `"ç${$1}ç":"√${$2}√"` : $3 ? `"ç${$1}ç":√${$3}√` : w
})
console.log(res)


