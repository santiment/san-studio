const fs = require('fs')
const path = require('path')
const svelte = require('svelte/compiler')
const cssModules = require('svelte-preprocess-cssmodules')
const { forFile, mkdir } = require('san-webkit/scripts/utils')
const { Preprocess, RoutesPreprocess } = require('san-webkit/scripts/svelte')
const { LIB } = require('./utils')

const preprocess = Preprocess({
  typescript: { tsconfigDirectory: path.resolve(__dirname, '../') },
})

const routesPreprocess = RoutesPreprocess(LIB)

async function processSvelte() {
  forFile(['src/**/*.svelte'], async (entry) => {
    const absolutePath = path.resolve(entry)
    const file = fs.readFileSync(absolutePath)

    const { code } = await svelte.preprocess(
      file.toString(),
      [routesPreprocess, cssModules(), preprocess],
      { filename: absolutePath },
    )

    const libFilePath = path.resolve(LIB, entry.slice('src/'.length))
    const libDirPath = path.dirname(libFilePath)
    mkdir(libDirPath)

    fs.writeFileSync(libFilePath, code)
  })

  forFile(['src/**/*.svg', 'src/**/*.png', 'src/**/*.jpg'], async (entry) => {
    const absolutePath = path.resolve(entry)
    const file = fs.readFileSync(absolutePath)
    const libFilePath = path.resolve(LIB, entry.slice('src/'.length))

    const libDirPath = path.dirname(libFilePath)
    mkdir(libDirPath)

    fs.writeFileSync(libFilePath, file)
  })
}

module.exports = {
  processSvelte,
}
