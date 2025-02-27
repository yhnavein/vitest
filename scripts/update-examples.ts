import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'
import { resolve } from 'pathe'
import { notNullish } from '../packages/vitest/src/utils'

async function run() {
  const examplesRoot = resolve(fileURLToPath(import.meta.url), '../../examples')

  const examples = await fs.readdir(examplesRoot)

  const data = await Promise.all(examples.map(async(name) => {
    const path = resolve(examplesRoot, name)
    if ((await fs.lstat(path)).isFile())
      return

    const github = `https://github.com/vitest-dev/vitest/tree/main/examples/${name}`
    const stackblitz = `https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/${name}`
    return {
      name,
      path,
      github,
      stackblitz,
    }
  }))

  const table = `| Example | Source | Playground |\n|---|---|---|\n${data.filter(notNullish).map(i => `| \`${i.name}\` | [GitHub](${i.github}) | [Play Online](${i.stackblitz}) |`).join('\n')}`

  await fs.writeFile(resolve(examplesRoot, 'README.md'), `${table}\n`, 'utf-8')
}

run()
