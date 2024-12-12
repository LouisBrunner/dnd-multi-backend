// Note: this is not a technically a esbuild-related script.
import {execSync, spawnSync} from 'node:child_process'

export const getCommandOutput = (...args) => {
  const stdout = execSync(args.join(' '), {
    encoding: 'utf8',
  })
  return stdout.toString()
}

export const getWorkspaces = () => {
  const workspacesJSON = getCommandOutput('npm', 'query', '.workspace')
  const workspaces = JSON.parse(workspacesJSON)
  return workspaces.toSorted((a, b) => {
    if (Object.keys(a.dependencies ?? {}).includes(b.name)) {
      return 1
    }
    if (Object.keys(b.dependencies ?? {}).includes(a.name)) {
      return -1
    }
    return 0
  })
}

export const executeCommand = (command, args, options) => {
  spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  })
}
