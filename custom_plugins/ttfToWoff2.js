import {readFile, writeFile} from 'node:fs/promises'
import fs from 'fs'
import path from 'path'
import ttf2woff2 from 'ttf2woff2'

export async function ttfToWoff2() {
  const inputDir = path.resolve(__dirname, '../src/fonts')
  const outputDir = path.resolve(__dirname, '../public/fonts')
  const files = fs.readdirSync(inputDir)

  for (const file of files) {
    if (/\.(ttf)$/i.test(file)) {
      const inputFilePath = await readFile(`${inputDir}/${file}`)
      const outputFilePathWoff2 = path.join(
        outputDir,
        `${path.basename(file, path.extname(file))}.woff2`
      )
      await writeFile(outputFilePathWoff2, ttf2woff2(inputFilePath))
    }
  }
}

process.env.NODE_ENV === 'dev' ? await ttfToWoff2() : await function () {}
