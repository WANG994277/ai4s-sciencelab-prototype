import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const execution = await readFile(new URL('../assets/execution-center.js', import.meta.url), 'utf8');
const resourceCategory = source.match(
  /const resourceCategory = \(\) => \{[\s\S]*?\/\* The original supplier pages are now the live resource-center content\. \*\//,
)?.[0];

test('resource-center modules use bundled offline routes', () => {
  assert.ok(resourceCategory, 'resourceCategory implementation should be present');
  assert.match(resourceCategory, /assets\/resource-app\/index\.html\?v=\$\{resourceBundleSessionVersion\}#\/resource\/\$\{onlineResourceRoute\}/);
  assert.doesNotMatch(resourceCategory, /http:\/\/127\.0\.0\.1:3002/);
  assert.doesNotMatch(resourceCategory, /vendor-plaza\.html|vendor-frame-[2457]\.html/);

  for (const [route, onlineRoute] of Object.entries({
    'resource-knowledge': 'knowledge',
    'resource-datasets': 'datasets',
    'resource-models': 'models',
    'resource-tools': 'tools',
    'resource-skills': 'skills',
  })) {
    assert.match(resourceCategory, new RegExp(`'${route}':'${onlineRoute}'`));
  }

  assert.match(resourceCategory, /'resource-agents':'vendor-frame-3\.html'/);
  assert.match(resourceCategory, /'resource-apps':'vendor-frame-1\.html'/);
});

test('index loads the fixed resource embedding bundle', () => {
  assert.match(index, /app\.js\?v=20261013-split-2/);
});

test('research activity execution pages use the bundled app', () => {
  assert.match(execution, /assets\/resource-app\/index\.html#\/resource\/execution-list/);
  assert.match(execution, /assets\/resource-app\/index\.html#\/resource\/execution-detail/);
  assert.doesNotMatch(execution, /127\.0\.0\.1:3002/);
});
