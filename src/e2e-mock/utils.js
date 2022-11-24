let urlWithoutQuery = (url) => url.slice(0, url.indexOf('?'));
let toCamelCase = (str) => {
  return str.replace(/[/-]([a-z])/g, (w, g1) => g1.toUpperCase())
}
let toDashJoin = (url) => url.replace(/\//g, '-');

module.exports = {
  urlWithoutQuery,
  toCamelCase,
  toDashJoin
}
