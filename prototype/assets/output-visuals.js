/* 科研任务产出可视化（2026-10-13）：3D 分子 / 晶胞 / 无定形体系（自动旋转）、数据图表、报告缩略图。演示素材，非真实科研数据。 */
(() => {
'use strict';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const seeded = seed => { let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); };
const EL = { C: ['#9aa3b0', '#4b5563', 9], O: ['#ff8a80', '#d32f2f', 9], H: ['#ffffff', '#c9cfd8', 5.5], N: ['#8fb4ff', '#2f5fd0', 9], Si: ['#ffe08a', '#c79a1b', 10], Zn: ['#c7a8ff', '#6d3fd0', 11], Cu: ['#ffc59a', '#c9692a', 11] };

/* ---------- 结构库（3D 坐标，单位任意） ---------- */
function ring(cx, cy, cz, r, n = 6, rot = 0) { return Array.from({ length: n }, (_, i) => { const a = rot + i * 2 * Math.PI / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a), cz + (i % 2 ? 0.25 : -0.25)]; }); }
function withH(atoms, rnd, count) { const out = atoms.slice(); const heavy = atoms.filter(a => a[3] !== 'H'); for (let i = 0; i < count; i++) { const p = heavy[i % heavy.length]; const t = rnd() * Math.PI * 2, f = rnd() * Math.PI; out.push([p[0] + 1.05 * Math.sin(f) * Math.cos(t), p[1] + 1.05 * Math.sin(f) * Math.sin(t), p[2] + 1.05 * Math.cos(f), 'H']); } return out; }
const STRUCT = {
  sty() { const r = ring(0, 0, 0, 1.4).map(p => [...p, 'C']); const a = [...r, [0, -2.8, 0.3, 'C'], [1.1, -3.6, 0.1, 'C'], [0, 2.8, -0.3, 'O'], [1.2, 3.6, -0.2, 'C'], [1.2, 5.0, 0.4, 'C']]; return withH(a, seeded('sty'), 9); },
  iso() { const a = [[-2.4, 0.6, 0, 'C'], [-1.2, 0, 0.3, 'C'], [0, 0.7, 0, 'C'], [0, 2.1, 0.4, 'C'], [1.3, 0, -0.3, 'C']]; return withH(a, seeded('iso'), 8); },
  cell(seed = 'cell') { const rnd = seeded(seed), a = []; for (let k = 0; k < 14; k++) { let x = (rnd() - .5) * 8, y = (rnd() - .5) * 8, z = (rnd() - .5) * 8; for (let j = 0; j < 7; j++) { a.push([x, y, z, j % 5 === 4 ? 'O' : 'C']); x += (rnd() - .5) * 2.2; y += (rnd() - .5) * 2.2; z += (rnd() - .5) * 2.2; x = Math.max(-4, Math.min(4, x)); y = Math.max(-4, Math.min(4, y)); z = Math.max(-4, Math.min(4, z)); } } return a; },
  mof() { const a = []; for (const x of [-3, 3]) for (const y of [-3, 3]) for (const z of [-3, 3]) a.push([x, y, z, 'Zn']); const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2]; const zn = a.slice(); zn.forEach((p, i) => zn.forEach((q, j) => { if (j > i && [0, 1, 2].filter(k => p[k] !== q[k]).length === 1) { const m = mid(p, q); a.push([...ring(m[0], m[1], m[2], .8, 6, .3)[0], 'C'], [...ring(m[0], m[1], m[2], .8, 6, .3)[3], 'C'], [m[0], m[1], m[2], 'O']); } })); return a; },
  cu() { const a = []; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) a.push([i * 1.6, j * 1.6, -1.6, 'Cu'], [i * 1.6 + .8, j * 1.6 + .8, -3.0, 'Cu']); a.push([0, 0, 0.2, 'C'], [0, -1.15, 0.6, 'O'], [0, 1.15, 0.6, 'O']); return a; },
  rock(seed = 'rock') { const rnd = seeded(seed), a = []; for (let i = 0; i < 70; i++) { const l = Math.floor(rnd() * 4); a.push([(rnd() - .5) * 9, -3 + l * 2 + (rnd() - .5) * .8, (rnd() - .5) * 9, l % 2 ? 'Si' : 'O']); } return a; }
};
const BOX = { cell: 4.2, mof: 3.4, rock: 4.6 };
const bondCut = { cell: 2.0, mof: 1.9, rock: 0, cu: 1.95 };

function render(kind, angle, seed) {
  const atoms = (STRUCT[kind] || STRUCT.sty)(seed), cut = bondCut[kind] ?? 1.75;
  const tilt = -0.42, ca = Math.cos(angle), sa = Math.sin(angle), ct = Math.cos(tilt), stt = Math.sin(tilt);
  const span = Math.max(...atoms.map(a => Math.hypot(a[0], a[1], a[2]))) || 1, scale = 92 / (span + 1.2);
  const P = ([x, y, z]) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y1 = y * ct - z1 * stt, z2 = y * stt + z1 * ct; const k = 1 + z2 / 40; return [130 + x1 * scale * k, 100 - y1 * scale * k, z2]; };
  const pts = atoms.map(a => [...P(a), a[3]]);
  let bonds = '';
  if (cut) for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++) { const A = atoms[i], B = atoms[j]; if ((A[3] === 'H') === (B[3] === 'H') && A[3] === 'H') continue; const d = Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); if (d < (A[3] === 'H' || B[3] === 'H' ? 1.2 : cut)) { const p = pts[i], q = pts[j]; bonds += `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="#b9c0cb" stroke-width="${(3.2 * (1 + (p[2] + q[2]) / 80)).toFixed(2)}" stroke-linecap="round" opacity="${(0.55 + (p[2] + q[2]) / 40).toFixed(2)}"/>`; } }
  let box = '';
  if (BOX[kind]) { const b = BOX[kind], c = [[-b, -b, -b], [b, -b, -b], [b, b, -b], [-b, b, -b], [-b, -b, b], [b, -b, b], [b, b, b], [-b, b, b]].map(P); box = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].map(([i, j]) => `<line x1="${c[i][0].toFixed(1)}" y1="${c[i][1].toFixed(1)}" x2="${c[j][0].toFixed(1)}" y2="${c[j][1].toFixed(1)}" stroke="#9fb3cc" stroke-width="1" stroke-dasharray="3 3"/>`).join(''); }
  const order = pts.map((p, i) => i).sort((i, j) => pts[i][2] - pts[j][2]);
  const small = atoms.length > 60;
  const balls = order.map(i => { const [x, y, z, el] = pts[i], e = EL[el] || EL.C, r = e[2] * (small ? .62 : 1) * (1 + z / 40) * (scale / 18); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${Math.max(1.6, r).toFixed(2)}" fill="url(#ov-${el})"/>`; }).join('');
  return `${box}${bonds}${balls}`;
}
const DEFS = `<defs>${Object.entries(EL).map(([k, [a, b]]) => `<radialGradient id="ov-${k}" cx="35%" cy="32%" r="70%"><stop offset="0%" stop-color="#fff"/><stop offset="28%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/></radialGradient>`).join('')}</defs>`;
function mol(kind, seed = '') { return `<svg class="ov-svg ov-3d" viewBox="0 0 260 200" data-ov3d="${kind}" data-ov-seed="${esc(seed)}" role="img" aria-label="三维结构可视化（可旋转）">${DEFS}<g class="ov-scene">${render(kind, 0.6, seed)}</g></svg>`; }

/* ---------- 图表 ---------- */
const axis = (w, h, xl, yl) => `<path d="M40 ${h - 30}H${w - 14}M40 16V${h - 30}" stroke="#c9d6e6"/>${[0.25, 0.5, 0.75].map(f => `<path d="M40 ${16 + (h - 46) * f}H${w - 14}" stroke="#edf2f8"/>`).join('')}<text x="${w / 2}" y="${h - 8}" text-anchor="middle" font-size="10" fill="#8aa0bb">${xl}</text><text x="12" y="${h / 2}" font-size="10" fill="#8aa0bb" transform="rotate(-90 12 ${h / 2})" text-anchor="middle">${yl}</text>`;
function chart(kind, seed = '') {
  const rnd = seeded(kind + seed), W = 260, H = 200;
  if (kind === 'parity') { let g = ''; for (let i = 0; i < 26; i++) { const t = rnd(), x = 52 + t * 180, y = H - 40 - t * 140 + (rnd() - .5) * 26; g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${i % 7 === 0 ? '#f08c3a' : '#4d8ff0'}" opacity=".85"/>`; } return `<svg class="ov-svg" viewBox="0 0 ${W} ${H}">${axis(W, H, '计算 Tg (°C)', '预测 Tg (°C)')}<path d="M48 ${H - 34}L${W - 20} 22" stroke="#97a9bf" stroke-dasharray="4 4"/><rect x="40" y="${H - 72}" width="${W - 54}" height="16" fill="#fde7d3" opacity=".7"/><text x="${W - 18}" y="${H - 60}" font-size="9" fill="#c06a1f" text-anchor="end">目标 −50 °C</text>${g}<text x="${W - 16}" y="${H - 40}" font-size="10" fill="#33506f" text-anchor="end">R² = 0.91（演示）</text></svg>`; }
  if (kind === 'isotherm') { const lines = ['#4d8ff0', '#33a99a', '#f08c3a'].map((c, k) => { const q = 0.9 - k * 0.22; const pts = Array.from({ length: 16 }, (_, i) => { const p = i / 15; return `${(48 + p * 190).toFixed(1)},${(H - 34 - (q * p * 9) / (1 + p * 9) * 150).toFixed(1)}`; }).join(' '); return `<polyline points="${pts}" fill="none" stroke="${c}" stroke-width="2.6"/>`; }).join(''); return `<svg class="ov-svg" viewBox="0 0 ${W} ${H}">${axis(W, H, '压力 (bar)', 'CO₂ 吸附量')}${lines}<g font-size="9"><text x="196" y="40" fill="#4d8ff0">MOF-A</text><text x="196" y="66" fill="#33a99a">MOF-B</text><text x="196" y="92" fill="#f08c3a">MOF-C</text></g></svg>`; }
  if (kind === 'heat') { let g = ''; const cols = 14, rows = 9; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const v = Math.max(0, Math.min(1, 0.5 + 0.45 * Math.sin(i / 2.2 + j / 3) * Math.cos(j / 2.5) + (rnd() - .5) * .25)); const lerp = (a, b, t) => a.map((x, k) => Math.round(x + (b[k] - x) * t)); const rgb = v < .5 ? lerp([214, 230, 250], [250, 236, 196], v * 2) : lerp([250, 236, 196], [226, 104, 38], (v - .5) * 2); const c = `rgb(${rgb.join(',')})`; g += `<rect x="${44 + i * 14.5}" y="${18 + j * 16}" width="14" height="15.5" fill="${c}"/>`; } return `<svg class="ov-svg" viewBox="0 0 ${W} ${H}">${g}<text x="44" y="${H - 22}" font-size="10" fill="#8aa0bb">井间距离 →</text><text x="14" y="90" font-size="10" fill="#8aa0bb" transform="rotate(-90 14 90)" text-anchor="middle">深度</text><g font-size="9" fill="#33506f"><text x="${W - 12}" y="${H - 22}" text-anchor="end" fill="#c0662a">■ 甜点概率高</text></g></svg>`; }
  if (kind === 'bars') { const labels = ['湿抓', '耐磨', '滚阻', '拉伸']; const g = labels.map((l, i) => { const a = 0.45 + rnd() * .4, b = a + (rnd() - .3) * .25; return `<rect x="${52 + i * 50}" y="${H - 30 - a * 140}" width="16" height="${a * 140}" rx="2" fill="#b9cde8"/><rect x="${70 + i * 50}" y="${H - 30 - b * 140}" width="16" height="${b * 140}" rx="2" fill="#4d8ff0"/><text x="${69 + i * 50}" y="${H - 16}" font-size="10" text-anchor="middle" fill="#6f88a6">${l}</text>`; }).join(''); return `<svg class="ov-svg" viewBox="0 0 ${W} ${H}"><path d="M40 ${H - 30}H${W - 10}" stroke="#c9d6e6"/>${g}<g font-size="9"><rect x="150" y="16" width="9" height="9" fill="#b9cde8"/><text x="163" y="24" fill="#6f88a6">基线</text><rect x="196" y="16" width="9" height="9" fill="#4d8ff0"/><text x="209" y="24" fill="#6f88a6">候选</text></g></svg>`; }
  if (kind === 'energy') { const v = Array.from({ length: 18 }, (_, i) => -1.2 - 1.1 * (1 - Math.exp(-i / 3.5)) + (rnd() - .5) * .04); const pts = v.map((y, i) => `${(48 + i * 11).toFixed(1)},${(30 + (-y - 1.2) * 110).toFixed(1)}`).join(' '); return `<svg class="ov-svg" viewBox="0 0 ${W} ${H}">${axis(W, H, '优化步数', '吸附能 (eV)')}<polyline points="${pts}" fill="none" stroke="#7a5af0" stroke-width="2.6"/><text x="${W - 16}" y="${30 + 1.05 * 110}" font-size="10" text-anchor="end" fill="#7a5af0">−2.34 eV</text></svg>`; }
  const vals = Array.from({ length: 12 }, (_, i) => 0.3 + 0.5 * (1 - Math.exp(-i / 4)) + (rnd() - .5) * .08); const pts = vals.map((y, i) => `${(48 + i * 17).toFixed(1)},${(H - 34 - y * 150).toFixed(1)}`).join(' ');
  return `<svg class="ov-svg" viewBox="0 0 ${W} ${H}">${axis(W, H, '参数扫描', '综合评分')}<polygon points="48,${H - 34} ${pts} ${48 + 11 * 17},${H - 34}" fill="#cfe2fb" opacity=".6"/><polyline points="${pts}" fill="none" stroke="#2e7be0" stroke-width="2.6"/></svg>`;
}
function doc(name) { return `<svg class="ov-svg" viewBox="0 0 260 200"><rect x="78" y="18" width="104" height="150" rx="8" fill="#fff" stroke="#cfdcea" stroke-width="1.5"/><rect x="92" y="34" width="52" height="10" rx="3" fill="#5f9be6"/>${[56, 68, 80, 92].map((y, i) => `<path d="M92 ${y}H${i === 3 ? 150 : 168}" stroke="#d5e0ec" stroke-width="5" stroke-linecap="round"/>`).join('')}<rect x="92" y="104" width="76" height="42" rx="4" fill="#eef4fc"/><polyline points="96,140 112,126 126,132 142,114 164,110" fill="none" stroke="#4d8ff0" stroke-width="2"/><text x="130" y="186" font-size="10" text-anchor="middle" fill="#8aa0bb">${esc(name.split('.').pop().toUpperCase())} 报告</text></svg>`; }

/* ---------- 分类 ---------- */
function classify(name) {
  const n = name.toLowerCase(), ext = n.split('.').pop();
  if (['pdb', 'cif', 'xyz', 'mol', 'sdf', 'vasp'].includes(ext) || n.includes('poscar')) {
    const kind = n.includes('cell') || n.includes('amorph') || n.includes('无定形') ? 'cell' : n.includes('mof') || ext === 'cif' && n.includes('zif') ? 'mof' : n.includes('isoprene') ? 'iso' : n.includes('cu') || n.includes('slab') || n.includes('表面') ? 'cu' : n.includes('岩') || n.includes('rock') || n.includes('储层') ? 'rock' : ext === 'cif' ? 'mof' : 'sty';
    return { type: '3d', kind, label: kind === 'cell' ? '无定形体系 3D' : kind === 'mof' ? '晶体结构 3D' : kind === 'cu' ? '表面吸附构型 3D' : kind === 'rock' ? '储层结构 3D' : '分子结构 3D' };
  }
  if (['csv', 'xlsx', 'xls', 'json', 'vtk'].includes(ext)) {
    const kind = /等温|isotherm|吸附量/.test(n) ? 'isotherm' : /甜点|剖面|heat|vtk|分布/.test(n) ? 'heat' : /性能|配方|候选/.test(n) ? 'bars' : /tg|预测|parity|对比/.test(n) ? 'parity' : /能|energy|dft/.test(n) ? 'energy' : 'line';
    return { type: 'chart', kind, label: { parity: '预测对比图', isotherm: '吸附等温线', heat: '属性分布热图', bars: '性能对比图', energy: '能量收敛曲线', line: '参数扫描曲线' }[kind] };
  }
  return { type: 'doc', kind: 'doc', label: '文档' };
}
const isVisual = name => classify(name).type !== 'doc';
function preview(name, seed = '') { const c = classify(name); return c.type === '3d' ? mol(c.kind, seed + name) : c.type === 'chart' ? chart(c.kind, seed + name) : doc(name); }

/* ---------- 自动旋转（仅可见的 3D 卡片） ---------- */
let t0 = performance.now(), last = 0;
function tick(now) {
  if (now - last > 60) {
    last = now;
    document.querySelectorAll('svg[data-ov3d]').forEach(svg => {
      const r = svg.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > innerHeight) return;
      if (svg.closest('[data-ov-paused]')) return;
      const a = 0.6 + (now - t0) / 2600 * (svg.dataset.ov3d === 'cell' ? 0.7 : 1);
      const g = svg.querySelector('.ov-scene'); if (g) g.innerHTML = render(svg.dataset.ov3d, a, svg.dataset.ovSeed || '');
    });
  }
  requestAnimationFrame(tick);
}
if (typeof requestAnimationFrame === 'function') requestAnimationFrame(tick);
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('mouseover', e => { const c = e.target.closest?.('.ov-card'); if (c) c.setAttribute('data-ov-paused', ''); });
  document.addEventListener('mouseout', e => { const c = e.target.closest?.('.ov-card'); if (c && !c.contains(e.relatedTarget)) c.removeAttribute('data-ov-paused'); });
}

window.AI4SOutputVisuals = { preview, classify, isVisual };
})();
