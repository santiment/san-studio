const path = require('path')

const SRC = path.resolve(__dirname, '../src')
const LIB = path.resolve(__dirname, '../lib')

const ROUTE_REGEX = /from '@\//g
const DYN_IMPORT_REGEX = /import\('@\//g
function replaceModuleAliases(fileContent, srcFilePath) {
  const diff = path.relative(srcFilePath, SRC).replace('..', '.')

  return fileContent
    .replace(ROUTE_REGEX, `from '${diff}/`)
    .replace(DYN_IMPORT_REGEX, `import('${diff}/`)
    .replace(/from 'san-chart/g, "from '@santiment-network/chart")
    .replace(/from 'webkit/g, "from 'san-webkit/lib")
}

module.exports = {
  replaceModuleAliases,
  SRC,
  LIB,
}
