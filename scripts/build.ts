import {join} from 'node:path'
import esbuild from 'esbuild'
import tsConfig from '../tsconfig.json' with {type: 'json'}
import {getWorkspaces, type Workspace} from './common.ts'

const buildWorkspace = async ({dir, pkg}: Workspace): Promise<void> => {
  console.log(`🔨 Building ${pkg.name}`)
  const result = await esbuild.build({
    bundle: true,
    entryPoints: [join(dir, 'src/index.ts')],
    format: 'esm',
    minify: true,
    outfile: join(dir, 'dist/index.js'),
    packages: 'external',
    target: tsConfig.compilerOptions.target,
  })
  for (const warning of result.warnings) {
    console.warn(warning.text)
  }
}

const main = async () => {
  await Promise.all(getWorkspaces().map(buildWorkspace))
}

main()
