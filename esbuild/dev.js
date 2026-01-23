import esbuild from 'esbuild'
import {examples} from './config.js'

const baseDir = 'examples/'

const context = await esbuild.context({
  ...examples,
  outdir: baseDir,
})

const server = await context.serve({
  servedir: baseDir,
  port: 4001,
})
console.log(`Server available at http://${server.host}:${server.port}`)
