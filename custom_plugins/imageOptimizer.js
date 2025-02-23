import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

export async function optimizeImages() {
  const imageDir = path.resolve(__dirname, '../public/images')
  const files = fs.readdirSync(imageDir)

  for (const file of files) {
    if (/\.(jpe?g|png)$/i.test(file)) {
      const inputFilePath = path.join(imageDir, file)
      const outputFilePathWebP = path.join(
        imageDir,
        `${path.basename(file, path.extname(file))}.webp`
      )

      // Конвертация в WebP
      await sharp(inputFilePath)
        .webp({lossless: true})
        .toFile(outputFilePathWebP)
    }
  }
}

process.env.NODE_ENV === 'dev' ? await optimizeImages() : await function () {}