const Automator = require('./automator')
const initExpect = require('./expect')

let ins = new Automator();
initExpect()
module.exports = ins;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ins;

