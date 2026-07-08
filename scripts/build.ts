import {join} from 'node:path'
import esbuild from 'esbuild'
import tsConfig from '../tsconfig.json' with {type: 'json'}
import {getWorkspaces} from './common'

const main = async () => {
  for (const {dir, pkg} of getWorkspaces()) {
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
}

main()
