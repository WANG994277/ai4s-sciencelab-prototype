import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const catalogUrl = new URL('../assets/project-management-catalog.js', import.meta.url);

function catalog() {
  assert.equal(existsSync(catalogUrl), true, 'project management catalog module should exist');
  const browser = { window: {} };
  runInNewContext(readFileSync(catalogUrl, 'utf8'), browser);
  return browser.window.AI4SProjectManagement;
}

test('research management section has a project management route in the work area', () => {
  assert.match(app, /nav-section-label[^"`]*">科研管理<\/div>/);
  assert.match(app, /data-route="project-management"/);
  assert.match(app, /case 'project-management': return/);
  assert.match(index, /styles\.css\?v=20261013-split-1/);
  assert.match(index, /assets\/project-management-catalog\.js\?v=20261010-project-management-2/);
  assert.match(index, /app\.js\?v=20261013-split-2/);
});

test('the catalog follows the supplied seven categories and sixteen agent names', () => {
  const directory = catalog();
  assert.deepEqual(Array.from(directory.categories), [
    '立项管理', '过程管理', '外协管理', '成果管理', '人才管理', '考核管理', '日常管理',
  ]);
  assert.equal(directory.agents.length, 16);
  assert.deepEqual(Array.from(directory.agents.filter((agent) => agent.category === '立项管理'), (agent) => agent.name), [
    '科技情报探员', '科研立项审查专员', '需求分析专员', '三新审查专员',
  ]);
  assert.equal(directory.agents.find((agent) => agent.name === '科研日程助手').capabilities.length, 7);
});

test('category and text search filter the directory without changing source capability data', () => {
  const directory = catalog();
  assert.deepEqual(Array.from(directory.filterAgents({ category: '过程管理' }), (agent) => agent.name), [
    '科研进度跟踪', '科研经费预警', '实验室智慧共享专员',
  ]);
  assert.deepEqual(Array.from(directory.filterAgents({ query: '周报' }), (agent) => agent.name), ['科研日程助手']);
  assert.deepEqual(Array.from(directory.filterAgents({ category: '立项管理', query: '开题报告' }), (agent) => agent.name), ['科研立项审查专员']);
  assert.deepEqual(Array.from(directory.agents.find((agent) => agent.name === '三新审查专员').capabilities), []);
  assert.equal(directory.agents.every((agent) => agent.description?.length >= 12), true);
  assert.equal(new Set(directory.agents.map((agent) => agent.icon)).size, 16);
});

test('cards show descriptions and start buttons without capability pills or capability filter', () => {
  const directory = catalog();
  const html = directory.markup({ category: '全部' });
  const escapedHtml = directory.markup({ query: '<script>alert(1)</script>' });
  assert.match(html, /aria-label="搜索智能体"/);
  assert.match(html, /data-pm-category="立项管理"/);
  assert.match(html, /class="pm-agent-description"/);
  assert.match(html, /开始使用/);
  assert.doesNotMatch(html, /data-pm-capability|class="pm-capabilities"/);
  assert.doesNotMatch(app, /projectManagementCapability|pm-capability/);
  assert.doesNotMatch(escapedHtml, /<script>alert\(1\)<\/script>/);
  assert.match(directory.detailMarkup('intelligence'), /未接入实际智能体服务/);
});

test('project management cards use the existing desktop design system and retain focus visibility', () => {
  assert.match(styles, /\.project-management-page\s*\{/);
  assert.match(styles, /\.pm-agent-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /@media\s*\(max-width:\s*1300px\)[\s\S]*?\.pm-agent-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /\.pm-agent-card[^\n]*:focus-visible[^{]*\{[^}]*outline/);
  assert.match(styles, /\.pm-agent-description\s*\{/);
  assert.doesNotMatch(styles, /\.pm-capabilities\s*\{/);
});

test('the active project management navigation is kept visible in the scrolling sidebar', () => {
  assert.match(app, /state\.route==='project-management'[\s\S]{0,250}sidebar-scroll[\s\S]{0,350}scrollTop/);
});
