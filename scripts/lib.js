const { forFile, copyFile } = require('san-webkit/scripts/utils')
const { prepareTypes } = require('san-webkit/scripts/types')
const { prepareSvelte } = require('san-webkit/scripts/svelte')
const { prepareImports } = require('san-webkit/scripts/imports')

async function main() {
  await forFile(['src/**', '!src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.test.js'], copyFile)

  prepareTypes()

  await prepareSvelte()

  prepareImports()
}
main()
