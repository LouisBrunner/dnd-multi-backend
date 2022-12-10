import esbuild from 'esbuild';
import {examples} from './config.js';

esbuild.serve({
  servedir: 'examples/',
  port: 4001,
}, examples).then((server) => {
  console.log(`Server available at http://${server.host}:${server.port}`);
});
