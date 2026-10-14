import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const config = await readFile(new URL('../vite.config.ts', import.meta.url), 'utf8');

test('Vite aliases every Next module imported by the bundled source', async () => {
  for (const [specifier, file] of [
    ['next/navigation', 'navigation.ts'],
    ['next/link', 'link.tsx'],
    ['next/image', 'image.tsx'],
    ['next/dynamic', 'dynamic.tsx'],
  ]) {
    assert.match(config, new RegExp(`['"]${specifier.replace('/', '\\/')}['"]`));
    await access(new URL(`../src/compat/${file}`, import.meta.url));
  }
});
