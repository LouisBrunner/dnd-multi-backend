import {execFileSync, spawnSync} from 'node:child_process'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {Glob} from 'bun'

export type PackageJSON = {
  name: string
  version: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  workspaces?: {
    packages?: string[]
  }
}

export type Workspace = {
  dir: string
  pkg: PackageJSON
}

export const readPackageJSON = (dir: string): PackageJSON => {
  return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
}

export const writePackageJSON = (dir: string, pkg: PackageJSON): void => {
  writeFileSync(join(dir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`)
}

export const getWorkspaces = (root = '.'): Workspace[] => {
  const rootPkg = readPackageJSON(root)
  const patterns = rootPkg.workspaces?.packages ?? []

  const dirs: string[] = []
  for (const pattern of patterns) {
    const glob = new Glob(pattern)
    for (const match of glob.scanSync({cwd: root, onlyFiles: false})) {
      const dir = join(root, match)
      if (existsSync(join(dir, 'package.json'))) {
        dirs.push(dir)
      }
    }
  }

  const workspaces = dirs.map((dir) => ({dir, pkg: readPackageJSON(dir)}))
  return workspaces.toSorted((a, b) => {
    if (a.pkg.dependencies?.[b.pkg.name] !== undefined) {
      return 1
    }
    if (b.pkg.dependencies?.[a.pkg.name] !== undefined) {
      return -1
    }
    return 0
  })
}

export const run = (command: string, args: string[], options?: {cwd?: string}): void => {
  const result = spawnSync(command, args, {stdio: 'inherit', ...options})
  if (result.status !== 0) {
    throw new Error(`command failed: ${command} ${args.join(' ')}`)
  }
}

export const output = (command: string, args: string[]): string => {
  return execFileSync(command, args, {encoding: 'utf8'}).trim()
}
