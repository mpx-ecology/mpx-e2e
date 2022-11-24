module.exports = ({ jestTimeout }) => `const path = require('path');
const automator = require('@mpxjs/e2e');
let e2eRc = require(path.resolve(process.cwd(), '.e2erc.js'));
automator.screenshotHandler();
jest.setTimeout(${ jestTimeout });`
