import esbuild from 'esbuild';
import {examples} from './config.js';

const context = await esbuild.context({
  ...examples,
  outdir: 'examples/',
});

const server = await context.serve({
  servedir: 'examples/',
  port: 4001,
});
console.log(`Server available at http://${server.host}:${server.port}`);
