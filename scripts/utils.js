const path = require('path')

const SRC = path.resolve(__dirname, '../src')
const LIB = path.resolve(__dirname, '../lib')

const IS_NODE_MODULES_INSTALL = __dirname.includes('node_modules')
const modulePrefix = IS_NODE_MODULES_INSTALL
  ? process.cwd().slice(0, process.cwd().indexOf('node_modules')) + 'node_modules/'
  : ''

const ROUTE_REGEX = /from '@\//g
const IMPORT_REGEX = /import '@\//g
const DYN_IMPORT_REGEX = /import\('@\//g
function replaceModuleAliases(fileContent, srcFilePath) {
  const diff = path.relative(srcFilePath, SRC).replace('..', '.')

  return fileContent
    .replace(ROUTE_REGEX, `from '${diff}/`)
    .replace(IMPORT_REGEX, `import '${diff}/`)
    .replace(DYN_IMPORT_REGEX, `import('${diff}/`)
    .replace(/from 'san-chart/g, `from '${modulePrefix}@santiment-network/chart`)
    .replace(/from 'webkit/g, `from '${modulePrefix}san-webkit/lib`)
}

module.exports = {
  replaceModuleAliases,
  SRC,
  LIB,
}
