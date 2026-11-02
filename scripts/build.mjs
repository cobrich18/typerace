import {readFile, mkdir, rm, writeFile} from 'node:fs/promises';

const [html, css, js, worker, manifest] = await Promise.all([
  readFile('web/index.html', 'utf8'),
  readFile('web/styles.css', 'utf8'),
  readFile('web/app.js', 'utf8'),
  readFile('worker/index.js', 'utf8'),
  readFile('.openai/hosting.json', 'utf8')
]);
const marker = '__ASSETS__';
if (!worker.includes(marker)) throw new Error('Asset marker missing');
await rm('dist', {recursive: true, force: true});
await mkdir('dist/server', {recursive: true});
await mkdir('dist/.openai', {recursive: true});
await writeFile('dist/server/index.js', worker.replace(marker, JSON.stringify({html, css, js})));
await writeFile('dist/.openai/hosting.json', manifest);
console.log('Built Worker with game assets');
