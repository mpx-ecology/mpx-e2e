let fn = ({ connectFirst, insertCode }) => {
  let str = 'afterAll(async () => {';
  if (connectFirst) {
    str += 'await miniProgram.disconnect();'
  } else {
    str += 'await miniProgram.close();'
  }

  str += insertCode?.type === 'afterAll' ? `${insertCode.codeStr}` : ''

  str += '});'

  return str
}

module.exports = fn;
