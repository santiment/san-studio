const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { forFile, mkdir } = require('san-webkit/scripts/utils')
const { replaceModuleAliases, LIB } = require('./utils')

async function prepare() {
  fs.rmdirSync(LIB, { recursive: true })

  // exec('npm run lib', {
  // cwd: require.resolve('san-webkit'),
  // })

  forFile(
    ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.test.js', '!src/main.ts'],
    async (entry) => {
      const absolutePath = path.resolve(entry)
      const file = fs.readFileSync(absolutePath)

      const libFilePath = path.resolve(LIB, entry.slice('src/'.length))
      const libDirPath = path.dirname(libFilePath)
      mkdir(libDirPath)

      fs.writeFileSync(libFilePath, replaceModuleAliases(file.toString(), absolutePath))
    },
  )
}

prepare()
