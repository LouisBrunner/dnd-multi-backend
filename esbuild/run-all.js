import {executeCommand, getWorkspaces} from './common.js'

// Note: this is not a technically a esbuild-related script.
const main = async () => {
  if (process.argv.length < 3) {
    console.error('Usage: node run-all.js <command...>')
    process.exit(1)
  }
  const workspaces = getWorkspaces()
  const args = process.argv.slice(2)
  for (const workspace of workspaces) {
    console.log(`🔨 Running in ${workspace.name}: ${args.join(' ')}`)
    executeCommand(args[0], args.slice(1), {
      cwd: workspace.path,
    })
  }
}

main()
