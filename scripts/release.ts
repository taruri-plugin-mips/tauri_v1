import { execSync } from 'node:child_process'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

function run() {
  // 获取当前文件的路径
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  // 获取根目录
  const rootPath = path.join(__dirname, '..')
  // --------------------------------------------
  // 删除 release 文件夹
  execSync('rm -rf release', { stdio: 'inherit', cwd: rootPath })
  // --------------------------------------------
  // 在根目录执行 pnpm run build
  execSync('pnpm run build', { stdio: 'inherit', cwd: rootPath })
  // 创建一个 release 文件夹
  execSync('mkdir release', { stdio: 'inherit', cwd: rootPath })
  // 创建一个 source 文件夹
  execSync('mkdir source', { stdio: 'inherit', cwd: path.join(rootPath, 'release') })
  execSync('mkdir dist', { stdio: 'inherit', cwd: path.join(rootPath, 'release/source') })
  // 拷贝 dist 到 release/source
  execSync('cp -r dist/* release/source/dist', { stdio: 'inherit', cwd: rootPath })
}

run()
