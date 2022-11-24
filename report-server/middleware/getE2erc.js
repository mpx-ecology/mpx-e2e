let { getE2erc } = require('../util');

module.exports = (cfg) => {
  return async (ctx, next) => {
    let e2erc = getE2erc();
    if (cfg.debug) console.log('e2erc result ---->', getE2erc());
    ctx.e2erc = e2erc;
    return await next()
  }
}
