import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

export async function wrapImgWithPicture() {
  const htmlDir = path.resolve(__dirname, '../dist')
  const files = fs.readdirSync(htmlDir)

  for (const file of files) {
    if (file.endsWith('.html')) {
      const filePath = path.join(htmlDir, file)
      let html = fs.readFileSync(filePath)
      const $ = cheerio.load(html)

      // Оборачиваем все <img> в <picture>
      $('img').each((i, elem) => {
        const img = $(elem)
        const src = img.attr('src')
        if (!src.includes('.svg')) {
          const webpSrc = `${src.replace(/\.(jpeg|jpg|png)$/i, '.webp')}`
          const pictureTag = `<picture>
                              <source srcset="${webpSrc}" type="image/webp">
                              ${img.prop('outerHTML')}
                            </picture>`

          img.replaceWith(pictureTag)
        }
      })

      // Сохраняем измененный HTML
      fs.writeFileSync(filePath, $.html())
    }
  }
}