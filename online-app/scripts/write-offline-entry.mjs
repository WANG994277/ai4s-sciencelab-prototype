import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(projectRoot, '../prototype/assets/resource-app');
const version = async (name) => createHash('sha256')
  .update(await readFile(path.join(output, name)))
  .digest('hex')
  .slice(0, 12);

const [jsVersion, cssVersion] = await Promise.all([version('app.js'), version('app.css')]);
const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ScienceLab · 科研资源中心</title>
  <link rel="stylesheet" href="./app.css?v=${cssVersion}">
</head>
<body>
  <div id="root"></div>
  <script>window.process = { env: { NODE_ENV: 'production', CLIENT_BASE_PATH: '' } };</script>
  <script defer src="./app.js?v=${jsVersion}"></script>
</body>
</html>
`;
await writeFile(path.join(output, 'index.html'), html);
