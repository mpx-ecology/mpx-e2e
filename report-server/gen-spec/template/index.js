let header = require('./header');
let describe = require('./describe');
module.exports = (renderData) => {
  let h = header(renderData);
  h += describe(renderData);
  return h
}
