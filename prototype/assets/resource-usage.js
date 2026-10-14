/* 资源用量：空间视角汇总 + 单执行任务消耗（演示数据，确定性生成，刷新不变） */
(() => {
'use strict';
const hash = s => { let n = 2166136261; for (const c of String(s)) { n ^= c.charCodeAt(0); n = Math.imul(n, 16777619) >>> 0; } return n; };
const rand = (seed, i) => ((hash(seed + ':' + i) % 10000) / 10000);
const fmt = (v, d = 0) => Number(v).toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d });

/* 建空间时挂载的资源池与配额（演示） */
const POOLS = {
  '高性能合成橡胶': { pool: '材料研发资源池 · A100 × 8 / CPU 512 核', gpu: [1284, 2000], cpu: [18600, 40000], storage: [3.2, 10], mix: { compute: [6, 38], training: [62, 22], inference: [14, 4], analysis: [12, 30], agent: [4, 2], experiment: [6, 6] } },
  '页岩气储层评价': { pool: '油气勘探资源池 · A100 × 4 / CPU 1024 核', gpu: [642, 1500], cpu: [31200, 50000], storage: [6.8, 12], mix: { compute: [10, 58], training: [48, 14], inference: [20, 6], analysis: [16, 18], agent: [4, 2], experiment: [6, 4] } },
  'CO₂ 吸附材料筛选': { pool: '低碳材料资源池 · A100 × 4 / CPU 256 核', gpu: [910, 1200], cpu: [12400, 20000], storage: [2.1, 5], mix: { compute: [22, 52], training: [44, 16], inference: [18, 6], analysis: [10, 20], agent: [4, 2], experiment: [6, 6] } }
};
const DEFAULT_POOL = { pool: '课题默认资源池 · A100 × 2 / CPU 128 核', gpu: [420, 1000], cpu: [9800, 20000], storage: [1.4, 5], mix: { compute: [10, 45], training: [50, 20], inference: [20, 10], analysis: [14, 20], agent: [4, 2], experiment: [6, 5] } };
const pool = name => POOLS[name] || DEFAULT_POOL;

/* 近 14 天每日 GPU 卡时 / CPU 核时 */
function trend(name, days = 14) {
  const p = pool(name), gAvg = p.gpu[0] / 30, cAvg = p.cpu[0] / 30;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
    const wk = [0, 6].includes(d.getDay()) ? 0.45 : 1;
    return { label: `${d.getMonth() + 1}/${d.getDate()}`, gpu: Math.round(gAvg * wk * (0.6 + rand(name, i) * 0.9)), cpu: Math.round(cAvg * wk * (0.55 + rand(name, i + 40) * 0.95)) };
  });
}

/* 单条执行记录的资源消耗 */
const SPEC = {
  compute: { node: 'CPU 计算节点 · 64 核 / 256 GB', gpu: 0, cpu: 64, hours: [2, 14], mem: [96, 220], memUnit: '内存', store: [8, 40] },
  training: { node: 'GPU 节点 · A100 80GB × 4', gpu: 4, cpu: 32, hours: [6, 26], mem: [52, 78], memUnit: '单卡显存', store: [12, 60] },
  inference: { node: 'GPU 节点 · A100 80GB × 1', gpu: 1, cpu: 8, hours: [0.4, 3], mem: [18, 46], memUnit: '单卡显存', store: [1, 6] },
  analysis: { node: '通用节点 · 16 核 + A100 × 1', gpu: 1, cpu: 16, hours: [0.8, 4], mem: [24, 60], memUnit: '内存', store: [2, 12] },
  agent: { node: '智能体评测节点 · A100 × 1', gpu: 1, cpu: 8, hours: [0.5, 3], mem: [20, 48], memUnit: '单卡显存', store: [0.5, 3] },
  experiment: { node: '实验设施排程 + 数据采集节点 8 核', gpu: 0, cpu: 8, hours: [4, 12], mem: [8, 24], memUnit: '内存', store: [0.5, 4] }
};
const factor = r => r.status === '已完成' ? 1 : r.status === '运行中' ? Math.max(0.05, (r.progress || 0) / 100) : r.status === '失败' ? 0.18 : r.status === '已停止' ? 0.4 : 0;
function usage(r) {
  const s = SPEC[r.category] || SPEC.analysis, id = r.id || r.name || '', f = factor(r);
  const full = s.hours[0] + rand(id, 1) * (s.hours[1] - s.hours[0]);
  const wall = full * f, gpuH = wall * s.gpu, cpuH = wall * s.cpu;
  const peak = f ? s.mem[0] + rand(id, 2) * (s.mem[1] - s.mem[0]) : 0;
  const store = f ? s.store[0] + rand(id, 3) * (s.store[1] - s.store[0]) * Math.max(f, 0.3) : 0;
  const estGpu = full * s.gpu, estCpu = full * s.cpu;
  const p = pool(r.scope), share = p.gpu[1] ? (gpuH / p.gpu[1]) * 100 : 0;
  const started = f > 0, running = r.status === '运行中';
  return {
    node: s.node, memUnit: s.memUnit, started, running,
    wallHours: wall, gpuHours: gpuH, cpuHours: cpuH, peakMem: peak, storageGB: store,
    estGpuHours: estGpu, estCpuHours: estCpu, poolShare: share, pool: p.pool,
    gpuUtil: running && s.gpu ? Math.round(68 + rand(id, 4) * 26) : null,
    cpuUtil: running ? Math.round(55 + rand(id, 5) * 35) : null,
    text: {
      wall: started ? fmtDuration(wall) : '—',
      gpu: s.gpu ? (started ? `${fmt(gpuH, 1)} 卡时` : '0 卡时') : '不使用 GPU',
      cpu: started ? `${fmt(cpuH, 0)} 核时` : '0 核时',
      mem: started ? `${fmt(peak, 1)} GB（${s.memUnit}峰值）` : '—',
      storage: started ? `${fmt(store, 1)} GB` : '—',
      estimate: `${s.gpu ? fmt(estGpu, 0) + ' 卡时 / ' : ''}${fmt(estCpu, 0)} 核时`,
      share: started && s.gpu ? `${fmt(share, 2)}%` : '—'
    }
  };
}
function fmtDuration(h) { const m = Math.round(h * 60); return m < 60 ? `${m} 分钟` : `${Math.floor(m / 60)} 小时 ${m % 60} 分钟`; }

/* 写入日志的资源计量事件 */
function logEvents(r) {
  const u = usage(r); if (!u.started) return [];
  const out = [['INFO', '资源计量', `资源分配：${u.node}`]];
  if (u.running) out.push(['INFO', '资源计量', `实时采样：${u.gpuUtil != null ? `GPU 利用率 ${u.gpuUtil}% · ` : ''}CPU 利用率 ${u.cpuUtil}% · ${u.memUnit}峰值 ${fmt(u.peakMem, 1)} GB`]);
  out.push([r.status === '失败' ? 'WARN' : 'INFO', '资源计量', `${u.running ? '截至当前' : '本次合计'}：${u.gpuUtil != null || u.gpuHours ? u.text.gpu + ' · ' : ''}${u.text.cpu} · 存储 ${u.text.storage} · 时长 ${u.text.wall}`]);
  return out;
}

/* 详情卡片（供原生执行详情使用） */
function card(r) {
  const u = usage(r), e = x => String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rows = [['运行资源', u.node], ['运行时长', u.text.wall], ['GPU 消耗', u.text.gpu], ['CPU 消耗', u.text.cpu], ['峰值占用', u.text.mem], ['存储写入', u.text.storage], ['占资源池 GPU 配额', u.text.share], ['预计总消耗', u.text.estimate]];
  return `<section class="sc-card exec-card ru-task-card"><div class="exec-section-head"><h3>资源消耗</h3><span>${u.running ? '运行中 · 实时累计' : u.started ? '按资源池计量' : '尚未开始计量，仅显示预计'}</span></div>${u.running ? `<div class="ru-util">${u.gpuUtil != null ? `<span>GPU 利用率<b>${u.gpuUtil}%</b><i><em style="width:${u.gpuUtil}%"></em></i></span>` : ''}<span>CPU 利用率<b>${u.cpuUtil}%</b><i><em style="width:${u.cpuUtil}%"></em></i></span></div>` : ''}<dl class="exec-facts">${rows.map(([k, v]) => `<dt>${e(k)}</dt><dd>${e(v)}</dd>`).join('')}</dl><p>资源池：${e(u.pool)}（演示计量，不代表真实账单）</p></section>`;
}


/* 紧凑横条（用于嵌入式执行详情上方） */
function strip(r) {
  const u = usage(r), e = x => String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const items = [['运行资源', u.node], ['运行时长', u.text.wall], ['GPU', u.text.gpu], ['CPU', u.text.cpu], ['峰值占用', u.text.mem], ['存储写入', u.text.storage], ['占 GPU 配额', u.text.share]];
  if (u.running) items.splice(2, 0, ['实时利用率', `${u.gpuUtil != null ? `GPU ${u.gpuUtil}% · ` : ''}CPU ${u.cpuUtil}%`]);
  return `<section class="ru-strip" aria-label="资源消耗"><header><strong>资源消耗</strong><span>${u.running ? '运行中 · 实时累计' : u.started ? '本次合计' : '尚未开始计量 · 预计 ' + e(u.text.estimate)}</span></header><dl>${items.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('')}</dl></section>`;
}
window.AI4SResourceUsage = { pool, trend, usage, logEvents, card, strip, fmt };
})();
