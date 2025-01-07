import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import consola from 'consola'
import { remove } from 'fs-extra'

// resolve __filename and __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// resolve root path
const rootPath = path.join(__dirname, '..', '..')

export function removeFolder(releaseFolder: string = 'release') {
  return new Promise<void>((resolve, reject) => {
    remove(path.join(rootPath, releaseFolder)).then(() => {
      consola.success(`remove prev ${releaseFolder} folder success`)
      resolve()
    }).catch((err) => {
      consola.error(`remove prev ${releaseFolder} folder failed`)
      reject(err)
    })
  })
}
