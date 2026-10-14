/* 从科研任务上下文沉淀 Skill（2026-10-13）：会话计划 / 工具调用 / 输入输出 → Skill 草稿 → 试运行 → 保存到空间资产（我的 · Skill） */
(() => {
'use strict';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let st = { ctx: null, draft: null, tested: false };

function fromContext(c) {
  const base = String(c.sessionTitle || c.taskTitle || '科研流程').replace(/[（(].*$/, '').replace(/^(首次|候选)/, '').trim();
  const outputs = (c.outputs || []).filter(n => !/阶段报告/.test(n));
  return {
    name: `${base.slice(0, 16)} Skill`,
    trigger: `适用于“${c.taskTitle}”同类场景：${String(c.goal || '').slice(0, 60)}。可被科研中枢与课题智能体直接调用。`,
    steps: (c.steps || []).map((x, i) => `${i + 1}. ${x}`).join('\n'),
    tools: (c.tools || []).join('、'),
    io: `输入：${(c.inputs || []).slice(0, 3).join('、') || '空间文件或数据集引用'}（运行时替换为新的同类输入）；输出：${outputs.slice(0, 3).join('、') || '处理结果与说明'}`
  };
}

function view() {
  const c = st.ctx, d = st.draft;
  return `<div class="modal-wrap sb-wrap"><section class="modal rw-modal sb-modal" role="dialog" aria-modal="true" aria-label="保存为 Skill"><header class="modal-head"><strong>从任务上下文发布 Skill <small>${esc(c.taskId)} / ${esc(c.sessionId)}</small></strong><button class="btn btn-sm" data-sb-close>关闭</button></header><div class="modal-body">
    <div class="sb-source"><small>提取来源</small><strong>${esc(c.taskTitle)} › ${esc(c.sessionTitle)}</strong><div class="sb-source-tags"><span>${(c.steps || []).length} 步会话计划</span><span>${(c.tools || []).length} 个工具 / 能力</span><span>${(c.inputs || []).length} 项输入</span><span>${(c.outputs || []).length} 项产出</span><span>${c.traceCount || 0} 条执行轨迹</span></div><p>已按本次会话的计划、工具调用和输入输出生成 Skill 草稿；具体数据不随 Skill 保存，运行时替换为新的同类输入。</p></div>
    <label>Skill 名称<input id="sb-name" value="${esc(d.name)}"></label>
    <label>适用场景与说明<textarea id="sb-trigger" rows="2">${esc(d.trigger)}</textarea></label>
    <label>执行步骤（来自会话计划，可修改）<textarea id="sb-steps" rows="4">${esc(d.steps)}</textarea></label>
    <div class="sb-grid"><label>依赖工具 / 能力（来自执行轨迹）<input id="sb-tools" value="${esc(d.tools)}"></label><label>输入 / 输出<input id="sb-io" value="${esc(d.io)}"></label></div>
    <div class="sb-test ${st.tested ? 'ok' : ''}">${st.tested ? '✓ 试运行通过（演示）：用本次会话的输入回放，12 秒完成，输出与原会话一致。换用新数据的效果仍需人工验证。' : '尚未试运行。建议先用本次会话的输入回放一遍，再保存。'}</div>
    <p class="task-config-note">发布位置：${esc(c.scope)} · 空间资产 › 科研资产 › Skill（V1.0），保留来源任务与会话。上架到科研资源中心需另行审核。</p>
  </div><footer class="modal-footer"><button class="btn" data-sb-close>取消</button><button class="btn" data-sb-test>试运行（演示）</button><button class="btn btn-primary" data-sb-save>发布为科研资产</button></footer></section></div>`;
}
function render() { const root = document.getElementById('overlay-root'); if (root) root.innerHTML = view(); }
function readDraft() { const v = id => document.getElementById(id)?.value?.trim() || ''; st.draft = { name: v('sb-name'), trigger: v('sb-trigger'), steps: v('sb-steps'), tools: v('sb-tools'), io: v('sb-io') }; }
const toast = (t, d) => (window.AI4SApp?.toast ? window.AI4SApp.toast(t, d) : null);

function open(opts = {}) {
  if (!opts.context) return;
  st = { ctx: opts.context, draft: fromContext(opts.context), tested: false };
  render();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-sb-close],[data-sb-test],[data-sb-save]');
  if (!t || !st.ctx) return;
  if (t.matches('[data-sb-close]')) { document.getElementById('overlay-root').innerHTML = ''; return; }
  if (t.matches('[data-sb-test]')) { readDraft(); st.tested = true; return render(); }
  if (t.matches('[data-sb-save]')) {
    readDraft(); const d = st.draft, c = st.ctx;
    if (!d.name || !d.steps) return toast('请补全 Skill 名称和执行步骤', '');
    window.AI4SResearchWorkflow?.addAsset(c.scope, { name: d.name, type: 'Skill', status: '已发布', version: 'V1.0', creationSource: '任务上下文沉淀', sourceName: `${c.taskTitle} / ${c.sessionId}`, task: c.taskId, session: c.sessionId, sources: [{ name: `${c.taskId} / ${c.sessionId} 会话上下文`, version: '会话快照', task: c.taskId, session: c.sessionId }], config0: d.trigger, config1: d.steps, config2: `${d.tools}；${d.io}`, boundary: '仅在本课题内使用；结果需人工确认', instructions: '在科研中枢或智能体中选择该 Skill，提供同类输入后运行', quality: st.tested ? '已用来源会话输入回放（演示），尚未经新数据验证' : '尚未试运行，需验证后再发布' });
    document.getElementById('overlay-root').innerHTML = '';
    st.ctx = null;
    toast('已发布为 Skill', `${c.scope} › 空间资产 › 科研资产 › Skill`);
  }
}, true);

window.AI4SSkillBuilder = { open, fromContext };
})();
