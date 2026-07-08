import {join} from 'node:path'
import semver from 'semver'
import {getWorkspaces, output, run, writePackageJSON} from './common'

const main = () => {
  const [ver, tag] = process.argv.slice(2)
  if (ver === undefined) {
    console.error('Usage: bun run publish -- <semver> [tag]')
    process.exit(1)
  }
  if (!semver.valid(ver)) {
    console.error(`❌ Invalid semver version: ${ver}`)
    process.exit(1)
  }

  console.log(`🚀 Publishing version: ${ver}${tag !== undefined ? ` with tag ${tag}` : ''}`)

  console.log('🔍 Checking if all changes are committed')
  const changes = output('git', ['status', '--porcelain'])
  if (changes !== '') {
    console.error('❌ Please commit all changes before publishing')
    process.exit(1)
  }

  console.log('🔍 Checking we are on main')
  const branch = output('git', ['branch', '--show-current'])
  if (branch !== 'main') {
    console.error('❌ Please switch to main branch before publishing')
    process.exit(1)
  }

  const workspaces = getWorkspaces()
  const workspaceNames = workspaces.map(({pkg}) => pkg.name)

  const pkgFiles: string[] = []
  for (const {dir, pkg} of workspaces) {
    console.log(`✏️ Updating ${pkg.name} version to: ${ver}`)
    pkg.version = ver
    for (const dep of Object.keys(pkg.dependencies ?? {})) {
      if (workspaceNames.includes(dep) && pkg.dependencies !== undefined) {
        pkg.dependencies[dep] = `^${ver}`
      }
    }
    console.log(`📝 Writing ${pkg.name} package.json`)
    writePackageJSON(dir, pkg)
    pkgFiles.push(join(dir, 'package.json'))
  }

  console.log('✅ Formatting package.json files')
  run('bun', ['run', 'format:fix:internal', '--', ...pkgFiles])

  for (const {dir, pkg} of workspaces) {
    console.log(`🔨 Publishing ${pkg.name}`)
    const args = ['--cwd', dir, 'publish']
    if (tag !== undefined) {
      args.push('--tag', tag)
    }
    run('bun', args)
  }

  console.log('↩️ Committing changes')
  run('git', ['commit', '-am', `release: v${ver}`])
  run('git', ['push'])

  console.log('🏷️ Tagging')
  run('git', ['tag', `v${ver}`])
  run('git', ['push', '--tags'])
  run('gh', ['release', 'create', `v${ver}`, '--generate-notes'])
}

main()
