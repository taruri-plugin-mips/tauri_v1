import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import { desktop } from './template'
import { removeFolder } from './utils/remove-folder'

// resolve __filename and __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// resolve root path
const rootPath = path.join(__dirname, '..', 'release', 'source')

const archList = [
  {
    name: 'amd',
    target: 'amd64',
  },
  {
    name: 'arm',
    target: 'arm64',
  },
  {
    name: 'mips',
    target: 'mips64el',
  },
]

function createControl(name: string, version: string, arch: string, description: string) {
  return `Package: ${name}
Version: ${version}
Architecture: ${arch}
Priority: optional
Depends: libwebkit2gtk-4.0-37, libgtk-3-0
Description: ${description}
 (none)

`
}

async function createIcons(shareDir: string, name: string) {
  // 在 share 目录下创建 icons 目录
  const iconsDir = path.join(shareDir, 'icons')
  await fs.ensureDir(iconsDir)
  // 在 icons 目录下创建 hicolor 目录
  const hicolorDir = path.join(iconsDir, 'hicolor')
  await fs.ensureDir(hicolorDir)
  // 在 hicolor 目录下创建 32x32 目录
  const size32Dir = path.join(hicolorDir, '32x32')
  await fs.ensureDir(size32Dir)
  // 将 src-tauri 目录下 icons 目录下 32x32.png 复制 到 size32Dir 目录下，并重命名为 ${name}.png
  const src32Dir = path.join(rootPath, 'src-tauri', 'icons', '32x32.png')
  fs.copySync(src32Dir, path.join(size32Dir, `${name}.png`))
  // 在 hicolor 目录下创建 128x128 目录
  const size128Dir = path.join(hicolorDir, '128x128')
  await fs.ensureDir(size128Dir)
  // 将 src-tauri 目录下 icons 目录下 128x128.png 复制 到 size128Dir 目录下，并重命名为 ${name}.png
  const src128Dir = path.join(rootPath, 'src-tauri', 'icons', '128x128.png')
  fs.copySync(src128Dir, path.join(size128Dir, `${name}.png`))
  // 在 hicolor 目录下创建 256x256@2 目录
  const size256Dir = path.join(hicolorDir, '256x256@2')
  await fs.ensureDir(size256Dir)
  // 将 src-tauri 目录下 icons 目录下 128x128@2x.png 复制 到 size256Dir 目录下，并重命名为 ${name}.png
  const src256Dir = path.join(rootPath, 'src-tauri', 'icons', '128x128@2x.png')
  fs.copySync(src256Dir, path.join(size256Dir, `${name}.png`))
}

export async function run() {
  await removeFolder('envs')
  // 读取 src-tauri 下的 Cargo.toml 文件
  const tomlfile = await fs.readFile(path.join(rootPath, 'src-tauri', 'Cargo.toml'), {
    encoding: 'utf-8',
  })

  // 解析 Cargo.toml 文件内容
  const name = tomlfile.match(/name\s*=\s*"(.+)"/)?.[1] || 'tauri-app'
  const version = tomlfile.match(/version\s*=\s*"(.+)"/)?.[1] || '0.0.0'
  const description = tomlfile.match(/description\s*=\s*"(.+)"/)?.[1] || 'A Tauri App'

  // 创建 envs 目录 用来存放每一个架构的 deb 包
  const envsDir = path.join(rootPath, 'envs')
  await fs.ensureDir(envsDir)
  // 在 envs 目录下创建每一个架构的目录
  for (const arch of archList) {
    const archDir = path.join(envsDir, arch.name)
    await fs.ensureDir(archDir)
    // 在每一个架构的目录下创建 DEBIAN 目录
    const debianDir = path.join(archDir, 'DEBIAN')
    await fs.ensureDir(debianDir)
    // 在 DEBIAN 目录下创建 control 文件
    const controlFile = path.join(debianDir, 'control')
    await fs.writeFile(controlFile, createControl(name, version, arch.target, description))
    // 在 archDir 目录下创建 usr 目录
    const usrDir = path.join(archDir, 'usr')
    await fs.ensureDir(usrDir)
    // 在 usr 目录下创建 bin 目录
    const binDir = path.join(usrDir, 'bin')
    await fs.ensureDir(binDir)
    // 在 usr 目录下创建 share 目录
    const shareDir = path.join(usrDir, 'share')
    await fs.ensureDir(shareDir)
    // 在 share 目录下创建 applications 目录
    const applicationsDir = path.join(shareDir, 'applications')
    await fs.ensureDir(applicationsDir)
    // 在 applications 目录下创建 desktop 文件
    const desktopFile = path.join(applicationsDir, `${name}.desktop`)
    await fs.writeFile(desktopFile, desktop(description, name))
    createIcons(shareDir, name)
  }
}
