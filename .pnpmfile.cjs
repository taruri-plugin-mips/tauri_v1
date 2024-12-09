function readPackage(pkg, context) {
  if (pkg.name === 'rollup') {
    pkg.optionalDependencies = {
      ...pkg.optionalDependencies,
      'rollup-linux-loong64-gnu': '^4.28.0',
    }
    context.log('rollup package add loong64 support')
  }

  if (pkg.name === '@tauri-apps/cli') {
    pkg.optionalDependencies = {
      ...pkg.optionalDependencies,
      'tauri-cli-linux-loong64-gnu': '^1.6.1',
    }
    context.log('@tauri-apps/cli package add loong64 support')
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}
