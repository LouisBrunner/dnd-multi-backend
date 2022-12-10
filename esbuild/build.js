import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

esbuild.build({
  entryPoints: ['./src/index.ts'],
  format: 'esm',
  bundle: true,
  outfile: 'dist/index.js',
  minify: true,
  plugins: [nodeExternalsPlugin()],
});
