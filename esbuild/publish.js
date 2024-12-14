// Note: this is not a technically a esbuild-related script.

import {readFileSync, writeFileSync} from 'node:fs'
import semver from 'semver'
import {executeCommand, getCommandOutput, getWorkspaces} from './common.js'

const main = async () => {
  if (process.argv.length < 3) {
    console.error('Usage: node publish.js semver')
    process.exit(1)
  }
  const ver = process.argv[2]
  if (!semver.valid(ver)) {
    console.error(`❌ Invalid semver version: ${ver}`)
    process.exit(1)
  }

  console.log('🔍 Checking if all changes are committed')
  const changes = getCommandOutput('git', 'status', '--porcelain')
  if (changes !== '') {
    console.error('❌ Please commit all changes before publishing')
    process.exit(1)
  }

  console.log('🔍 Checking we are on main')
  const branch = getCommandOutput('git', 'branch', '--show-current')
  if (branch.trim() !== 'main') {
    console.error('❌ Please switch to main branch before publishing')
    process.exit(1)
  }

  const pkgs = []
  const workspaces = getWorkspaces()
  const workspaceNames = workspaces.map((w) => w.name)
  for (const workspace of workspaces) {
    console.log(`✏️ Updating ${workspace.name} version to: ${ver}`)
    const pkgFile = `${workspace.location}/package.json`
    const pkg = JSON.parse(readFileSync(pkgFile))
    pkg.version = ver
    for (const dep of Object.keys(pkg.dependencies ?? {})) {
      if (workspaceNames.includes(dep)) {
        pkg.dependencies[dep] = `^${ver}`
      }
    }
    console.log(`📝 Writing ${workspace.name} package.json`)
    const content = JSON.stringify(pkg, null, 2)
    writeFileSync(pkgFile, content)
    pkgs.push(pkgFile)
  }

  console.log('✅ Make sure the package.json are formatted correctly')
  executeCommand('npm', ['run', 'format:fix:internal', '--', ...pkgs])

  for (const workspace of workspaces) {
    console.log(`🔨 Publishing ${workspace.name}`)
    executeCommand('npm', ['publish'], {
      cwd: workspace.location,
    })
  }

  console.log('↩️ Committing changes')
  executeCommand('git', ['commit', '-am', `release: v${ver}`])

  console.log('🏷️ Tagging')
  executeCommand('git', ['tag', `v${ver}`])
  executeCommand('git', ['push', '--tags'])
  executeCommand('gh', ['release', 'create', `v${ver}`, '--generate-notes'])
}

main()
