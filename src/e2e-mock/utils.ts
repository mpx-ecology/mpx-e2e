let urlWithoutQuery = (url:string) => url.slice(0, url.indexOf('?'));
let toCamelCase = (str:string) => {
  return str.replace(/[/-]([a-z])/g, (w, g1) => g1.toUpperCase())
}
let toDashJoin = (url:string) => url.replace(/\//g, '-');

export {
  urlWithoutQuery,
  toCamelCase,
  toDashJoin
}
