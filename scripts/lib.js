const svelte = require('svelte/compiler')
const sveltePreprocess = require('svelte-preprocess')
const cssModules = require('svelte-preprocess-cssmodules')
const fs = require('fs')
const path = require('path')
const fg = require('fast-glob')
const { forFile, mkdir } = require('san-webkit/scripts/utils')

const SRC = path.resolve(__dirname, '../src')
const LIB = path.resolve(__dirname, '../lib')
const preprocess = sveltePreprocess({
  typescript: {
    tsconfigDirectory: path.resolve(__dirname, '../'),
  },
})

const ROUTE_REGEX = /from '@\//g
const routesPreprocess = {
  script: ({ content, filename }) => {
    const diff = path.relative(filename, SRC).replace('..', '.')
    return {
      code: content
        .replace(ROUTE_REGEX, `from '${diff}/`)
        .replace(/from 'san-chart/g, "from '@santiment-network/chart")
        .replace(/from 'webkit/g, "from 'san-webkit/lib"),
    }
  },
}

async function processSvelte() {
  forFile(['src/**/*.svelte'], async (entry) => {
    const absolutePath = path.resolve(entry)
    const file = fs.readFileSync(absolutePath)

    const { code } = await svelte.preprocess(
      file.toString(),
      [cssModules(), preprocess, routesPreprocess],
      { filename: absolutePath },
    )

    const libFilePath = path.resolve(LIB, entry.slice('src/'.length))
    const libDirPath = path.dirname(libFilePath)

    mkdir(libDirPath)

    fs.writeFileSync(libFilePath, code)
  })
}

async function processTypescript() {
  forFile(['lib/**/*.js'], async (entry) => {
    const absolutePath = path.resolve(entry)
    const file = fs.readFileSync(absolutePath)

    const diff = path.relative(absolutePath, LIB).replace('..', '.')

    fs.writeFileSync(
      absolutePath,
      file
        .toString()
        .replace(ROUTE_REGEX, `from '${diff}/`)
        .replace(/from 'san-chart/g, "from '@santiment-network/chart")
        .replace(/from 'webkit/g, "from 'san-webkit/lib"),
    )
  })
}

async function main() {
  processTypescript()
  processSvelte()
}
main()
