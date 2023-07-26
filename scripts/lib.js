import { forFile, copyFile } from 'san-webkit/scripts/utils.js'
import { prepareTypes } from 'san-webkit/scripts/types.js'
import { prepareSvelte } from 'san-webkit/scripts/svelte.js'
import { prepareImports } from 'san-webkit/scripts/imports.js'

async function main() {
  await forFile(['src/**', '!src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.test.js'], copyFile)

  prepareTypes()

  await prepareSvelte()

  prepareImports()
}
main()
