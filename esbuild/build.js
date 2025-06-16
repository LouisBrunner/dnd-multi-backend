import esbuild from 'esbuild'
import {nodeExternalsPlugin} from 'esbuild-node-externals'
import tsConfig from '../tsconfig.json' with {type: 'json'}

esbuild.build({
  entryPoints: ['./src/index.ts'],
  format: 'esm',
  bundle: true,
  outfile: 'dist/index.js',
  minify: true,
  plugins: [nodeExternalsPlugin()],
  target: tsConfig.compilerOptions.target,
})
