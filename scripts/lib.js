const path = require('path')
const fs = require('fs')
const { forFile } = require('san-webkit/scripts/utils')
const { processSvelte } = require('./svelte')
const { SRC } = require('./utils')

async function main() {
  processSvelte()

  forFile(['lib/**/*.js.map'], async (entry) => {
    const absolutePath = path.resolve(entry)
    const file = fs.readFileSync(absolutePath)

    fs.writeFileSync(
      absolutePath,
      file
        .toString()
        .replace(`"sourceRoot":"../src/"`, `"sourceRoot":"${SRC}/"`),
    )
  })
}
main()
