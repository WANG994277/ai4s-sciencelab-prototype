import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [entry, resourceCss, resultsCss, assetCss, homeCss, referenceCss] = await Promise.all([
  read('../src/index.tsx'),
  read('../src/resource.css'),
  read('../src/components/v1/knowledge-results.css'),
  read('../src/components/v1/knowledge-asset-views.css'),
  read('../src/components/v1/knowledge-home.css'),
  read('../src/components/v1/knowledge-reference.css'),
]);

test('resource routes provide the knowledge module theme context', () => {
  assert.match(entry, /<main id="v-main" className="v-resource-main">/);
  assert.match(resourceCss, /\.v-resource-main\s*\{[\s\S]*--v-brand:\s*#1268e8/);
  assert.match(resourceCss, /\.v-resource-main\s*\{[\s\S]*overflow-x:\s*hidden/);
});

test('knowledge results keep the results list wider than the overview panel', () => {
  assert.match(
    resultsCss,
    /\.v-resource-main \.v-knowledge-results-layout\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) 264px/,
  );
});

test('embedded knowledge assets do not use shell-only negative margins', () => {
  assert.match(
    assetCss,
    /\.v-resource-main \.v-knowledge-asset-heading\s*\{[\s\S]*margin:\s*0/,
  );
});

test('knowledge pages preserve visible keyboard focus', () => {
  assert.match(resultsCss, /:focus-visible[\s\S]*outline:\s*2px solid/);
  assert.doesNotMatch(resultsCss, /input\[type="checkbox"\]:focus-visible[\s\S]{0,160}outline:\s*none/);
});

test('knowledge pages use iframe-aware desktop breakpoints and readable labels', () => {
  for (const css of [homeCss, resultsCss, assetCss, referenceCss]) {
    assert.doesNotMatch(css, /@media \(max-width:\s*1350px\)/);
    assert.doesNotMatch(css, /font-size:\s*(?:9|10)px/);
  }
});
