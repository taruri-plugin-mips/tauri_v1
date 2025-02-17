import { execSync } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import archiver from 'archiver'
import { consola } from 'consola'
import { copy, mkdirp, remove } from 'fs-extra'
import { name, version } from '../package.json'
import { run as DebRun } from './deb'
import { ignore } from './ignore'
import { removeFolder } from './utils/remove-folder'

// resolve __filename and __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// resolve root path
const rootPath = path.join(__dirname, '..')

function handleBuildWebModule() {
  consola.start('build web module')
  execSync('pnpm run build', { stdio: 'inherit', cwd: rootPath })
}

function handleCreateFolder() {
  return new Promise<void>((resolve, reject) => {
    mkdirp(path.join(rootPath, 'release'), (err) => {
      if (err) {
        reject(err)
      }
      else {
        resolve()
      }
    })
  })
}

function handleRemoveIgnoreFiles(folder: string) {
  ignore.forEach((file) => {
    remove(path.join(folder, file))
  })
}

function handleZip(folder: string, zipPath: string) {
  consola.start('zip release folder...')
  const output = createWriteStream(zipPath)
  const archive = archiver('zip', { zlib: { level: 9 } })
  archive.pipe(output)
  archive.directory(folder, false)
  archive.finalize().then(() => {
    consola.success('zip release folder success')
  })
}

function handleReleaseFolder() {
  consola.info('Using', name, 'release script version', version)
  // remove release folder
  removeFolder().then(() => {
    // build web project
    handleBuildWebModule()
    // create release folder
    handleCreateFolder().then(() => {
      Promise.all([
        // copy dist folder to release/source/dist
        copy(path.join(rootPath, 'dist'), path.join(rootPath, 'release', 'source', 'dist')).then(() => {
          consola.success('create view module folder success')
        }),
        // copy src-tauri folder to release/source/src-tauri
        copy(path.join(rootPath, 'src-tauri'), path.join(rootPath, 'release', 'source', 'src-tauri')).then(() => {
          // remove ignore files
          Promise.all([
            handleRemoveIgnoreFiles(path.join(rootPath, 'release', 'source', 'src-tauri')),
          ]).then(() => {
            consola.success('create rust module folder success')
          })
        }),
      ]).then(() => {
        // create zip file
        DebRun().then(() => {
          handleZip(
            path.join(rootPath, 'release', 'source'),
            path.join(rootPath, 'release', `${name}-${version}-release.zip`),
          )
        })
      })
    })
  })
}

function run() {
  handleReleaseFolder()
}

run()
