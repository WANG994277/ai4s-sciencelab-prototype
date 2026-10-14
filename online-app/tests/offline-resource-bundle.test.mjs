import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

test('offline resource entry loads local assets and uses hash navigation', async () => {
  const htmlUrl = new URL('../../prototype/assets/resource-app/index.html', import.meta.url);
  const html = await readFile(htmlUrl, 'utf8');
  assert.match(html, /src="\.\/app\.js\?v=[a-f0-9]{12}"/);
  assert.match(html, /href="\.\/app\.css\?v=[a-f0-9]{12}"/);
  assert.doesNotMatch(html, /127\.0\.0\.1:3002|src="\/assets\//);

  const assetPaths = [...html.matchAll(/(?:src|href)="(\.\/app\.(?:js|css))\?v=[a-f0-9]{12}"/g)];
  for (const [, asset] of assetPaths) await access(new URL(asset, htmlUrl));
  const script = await readFile(new URL('./app.js', htmlUrl), 'utf8');
  assert.equal(script.startsWith('(function()'), true, 'offline bundle should be a classic script');
});

test('reference prototype is not published as a resource entry', async () => {
  const entry = await readFile(new URL('../src/index.tsx', import.meta.url), 'utf8');
  const config = await readFile(new URL('../vite.offline.config.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(entry, /prototype\/index\.html/);
  assert.match(config, /copyPublicDir:\s*false/);
  await assert.rejects(access(new URL('../public/prototype/index.html', import.meta.url)));
  await assert.rejects(access(new URL('../../prototype/assets/resource-app/prototype/index.html', import.meta.url)));
});
