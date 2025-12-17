import esbuild from 'esbuild'
import {examples} from './config.js'

esbuild.build({
  ...examples,
  outdir: 'examples/',
})
