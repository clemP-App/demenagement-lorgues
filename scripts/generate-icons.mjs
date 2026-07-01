import sharp from 'sharp'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'public/icons/source-photo.png')

async function roundedIcon(size, output) {
  const radius = Math.round(size * 0.2)
  const img = await sharp(source)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer()

  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/></svg>`,
  )

  await sharp(img)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(output)
}

await roundedIcon(32, join(root, 'public/favicon.png'))
await roundedIcon(180, join(root, 'public/icons/apple-touch-icon.png'))
await roundedIcon(192, join(root, 'public/icons/icon-192.png'))
await roundedIcon(512, join(root, 'public/icons/icon-512.png'))

console.log('Icônes générées dans public/')
