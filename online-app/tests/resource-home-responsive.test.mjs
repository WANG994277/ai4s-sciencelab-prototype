import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [knowledgeCss, resultCss, datasetCss, datasetPage, prototypeCss] = await Promise.all([
  read('../src/components/v1/knowledge-home.css'),
  read('../src/components/v1/knowledge-results.css'),
  read('../src/components/v1/dataset-marketplace.module.css'),
  read('../src/components/v1/datasets.tsx'),
  read('../../prototype/styles.css'),
]);

test('knowledge home reflows categories and overview panels at embedded desktop widths', () => {
  assert.match(knowledgeCss, /\.v-knowledge-search\.v-knowledge-home-hero\s*\{[\s\S]*?min-height:\s*360px;[\s\S]*?padding:\s*24px clamp\(24px, 4vw, 64px\) 18px;/);
  assert.match(knowledgeCss, /\.v-knowledge-home-three-col \.v-knowledge-home-panel\s*\{\s*min-height:\s*336px;/);
  assert.match(knowledgeCss, /@media \(max-width: 1150px\) \{\s*\.v-knowledge-quick-types\s*\{\s*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(knowledgeCss, /@media \(max-width: 1050px\) \{\s*\.v-knowledge-home-three-col\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(knowledgeCss, /\.v-knowledge-home-three-col \.v-hot-topics\s*\{\s*grid-column:\s*1\s*\/\s*-1/);
});

test('dataset home adapts card columns and keeps all featured items at narrower embedded widths', () => {
  assert.match(datasetPage, /marketStyles\.featuredGrid\}\s+\$\{styles\.datasetFeaturedGrid\}/);
  assert.match(datasetPage, /marketStyles\.skillGrid\}\s+\$\{layout === "grid" \? styles\.datasetGrid : ""\}/);
  assert.match(datasetPage, /layout === "list" \? styles\.datasetList : ""/);
  assert.match(datasetCss, /@media \(max-width: 920px\) \{[\s\S]*?\.page \.datasetGrid\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(datasetCss, /\.page \.datasetFeaturedGrid > :last-child\s*\{\s*display:\s*grid/);
  assert.match(datasetCss, /\.page \.datasetList\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(datasetCss, /\.hero\s*\{\s*min-height:\s*104px;/);
  assert.match(datasetCss, /\.datasetCard\s*\{\s*min-height:\s*156px;/);
});

test('knowledge results use a compact header, balanced split and a single page scroll', () => {
  assert.match(resultCss, /\.v-knowledge-results-search \.v-search,[\s\S]*?min-height:\s*42px;/);
  assert.match(resultCss, /\.v-knowledge-results-tabs button\s*\{[\s\S]*?min-height:\s*38px;/);
  assert.match(resultCss, /\.v-knowledge-results-layout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) 264px;/);
  assert.match(resultCss, /\.v-knowledge-result-card\s*\{[\s\S]*?padding:\s*11px 13px;/);
  assert.match(prototypeCss, /\.main-canvas:has\(\.resource-vendor-frame\[src\*="\/resource\/knowledge"\]\)\s*\{\s*overflow:\s*hidden;/);
});
