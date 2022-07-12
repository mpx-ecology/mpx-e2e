let fn = ({ connectFirst }) => {
  let str = 'afterAll(async () => {';
  if (connectFirst) {
    str += 'await miniProgram.disconnect();'
  } else {
    str += 'await miniProgram.close();'
  }
  str += '});'

  return str
}

module.exports = fn;
