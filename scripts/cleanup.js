const fs = require('fs')
const path = require('path')
const { forFile } = require('san-webkit/scripts/utils')

async function cleanup() {
  forFile(['lib/**/*.ts', '!lib/**/*.d.ts'], async (entry) => {
    const absolutePath = path.resolve(entry)
    fs.unlinkSync(absolutePath)
  })
}
cleanup()
