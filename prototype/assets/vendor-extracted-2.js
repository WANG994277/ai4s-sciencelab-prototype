
// ── Page titles
const pageMeta = {
  workbench:        '科研首页',
  hub:              '科研超级中枢',
  'hub-new':        '科研超级中枢',
  knowledge:        '科研知识中心',
  lab:              '云上实验室',
  assets:           '科研工作台',
  'assets-toolbox': '科学工具箱',
  'assets-model':   '科研模型',
  'assets-skills':  '科研技能',
  'assets-space':   '科研工作台',
  'space-act':      '我的科研活动',
  'space-asset':    '我的科研资产',
  'task-ws':        '我的科研任务',
  'assets-dataset': '科研数据集',
  history:          '历史任务',
  agentcfg:         '新建智能体',
  aicoding:         'AI Coding 工作区',
  'sciapp':         '科研应用',
  'sciskill':       '科研技能',
  'sciagent':       '科研智能体',
  'scimodel':       '科研模型',
  'scitoolbox':     '科学工具箱',
  'scidata':        '科研数据集',
  'toolcfg':        '新建工具',
};

// Some virtual page IDs map to a different nav element
const navMap = {
  'hub-new':        'hub',
  'assets-toolbox': 'assets-toolbox',
  'assets-model':   'assets-model',
  'assets-skills':  'assets-skills',
  'assets-space':   'assets-space',
  'assets-dataset': 'assets-dataset',
};

function switchAssetsTab(panelId, navId) {
  // Show page-assets
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-assets');
  if (pg) pg.classList.add('active');

  // Highlight nav item
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    const icon = n.querySelector('.ni');
    if (icon) icon.style.color = '';
  });
  const navEl = document.getElementById(navId);
  if (navEl) navEl.classList.add('active');

  // Update topbar title and assets hero header
  const titleEl = document.getElementById('page-title');
  const label = pageMeta[navId.replace('nav-','')] || '';
  if (titleEl) titleEl.textContent = label;
  const heroMeta = {
    'sp-panel-toolbox': { icon:'fa-toolbox',     color:'#2563EB', title:'科学工具箱', sub:'汇聚科研软件、算子与通用工具，一键添加到你的科研空间' },
    'sp-panel-model':   { icon:'fa-brain',       color:'#7C3AED', title:'科研模型',   sub:'领域预训练模型与代理模型，覆盖化学、材料、生物与地球科学' },
    'sp-panel-skills':  { icon:'fa-bolt',        color:'#0891B2', title:'科研技能',   sub:'开箱即用的 AI 科研技能，加速文献、数据、实验全流程' },
    'sp-panel-space':   { icon:'fa-layer-group', color:'#2563EB', title:'科研工作台', sub:'管理你的科研活动与科研资产，随时启动工作环境' },
    'sp-panel-dataset': { icon:'fa-database',    color:'#059669', title:'科研数据集', sub:'公开与自建科研数据集，支持跨库检索与领域目录管理' },
    'sp-panel-kspace':  { icon:'fa-diagram-project', color:'#7C3AED', title:'我的知识空间', sub:'关联知识库，围绕课题组织并沉淀你的研究知识' },
  };
  let meta = heroMeta[panelId] || heroMeta['sp-panel-toolbox'];
  if (panelId === 'sp-panel-space') {
    meta = { icon:'fa-wave-square', color:'#2563EB', title:'我的科研活动', sub:'查看你参与的科研活动与最新动态' };
  }
  const hdr = document.getElementById('assets-header-title');
  if (hdr) hdr.textContent = meta.title;
  const sub = document.getElementById('assets-header-sub');
  if (sub) sub.textContent = meta.sub;
  const heroIcon = document.getElementById('assets-hero-icon');
  if (heroIcon) heroIcon.innerHTML = '<i class="fa-solid ' + meta.icon + '" style="font-size:23px;color:' + meta.color + ';"></i>';

  // 资产分类标签栏：仅在「我的科研资产」的分类下展示；「我的科研活动」隐藏
  var catMap = { 'sp-panel-toolbox':'toolbox', 'sp-panel-model':'model', 'sp-panel-skills':'skills', 'sp-panel-dataset':'dataset', 'sp-panel-kspace':'kspace' };
  var catBar = document.getElementById('assets-cat-bar');
  if (catBar) catBar.style.display = catMap[panelId] ? 'flex' : 'none';
  document.querySelectorAll('.asset-cat-chip').forEach(function(c){ c.classList.remove('active'); });
  if (catMap[panelId]) {
    var chip = document.getElementById('acat-' + catMap[panelId]);
    if (chip) chip.classList.add('active');
  }

  // Show correct panel
  ['sp-panel-toolbox','sp-panel-model','sp-panel-skills','sp-panel-space','sp-panel-dataset','sp-panel-kspace'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.display = (id === panelId) ? 'flex' : 'none';
  });
  if (panelId === 'sp-panel-toolbox') {
    tbEnsureItems();
    tbRenderSimpleGrid('tb-software-grid', spSkuData.software);
    tbRenderSimpleGrid('tb-operator-grid', tbOperatorItems);
    tbRenderSimpleGrid('tb-general-grid', tbGeneralItems);
  }
  if (panelId === 'sp-panel-model')   tbRenderSimpleGrid('model-grid',   spSkuData.spmodel);
  if (panelId === 'sp-panel-skills')  tbRenderSimpleGrid('skills-grid',  spSkuData.skills);
  if (panelId === 'sp-panel-dataset') dsRenderDataset();
  if (panelId === 'sp-panel-space' && typeof switchSpSubTab === 'function') {
    switchSpSubTab('sp-space-act-panel', null);
  }
}

// ── 我的科研资产：分类标签切换（工具箱/模型/技能/数据集/知识空间）
function switchAssetCat(cat) {
  var panelMap = { toolbox:'sp-panel-toolbox', model:'sp-panel-model', skills:'sp-panel-skills', dataset:'sp-panel-dataset', kspace:'sp-panel-kspace' };
  var panelId = panelMap[cat] || 'sp-panel-toolbox';
  switchAssetsTab(panelId, 'nav-space-asset');
}

// ── 科学工具箱 3 sub-tabs ──────────────────────────────────────
var tbOperatorItems = null;
var tbGeneralItems = null;
function tbEnsureItems() {
  if (tbOperatorItems !== null) return;
  tbOperatorItems = []; tbGeneralItems = [];
  var generalNames = ['科研数据清洗工具','CoolProp','Cantera','SciPy / NumPy Stack'];
  spSkuData.spoperator.forEach(function(item) {
    if (generalNames.indexOf(item.name) >= 0) tbGeneralItems.push(item);
    else tbOperatorItems.push(item);
  });
}

function switchTbSubTab(panelId, btn) {
  ['tb-software','tb-operator','tb-general'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = (id === panelId) ? 'block' : 'none';
  });
  document.querySelectorAll('[id^="tb-btn-"]').forEach(function(b) {
    b.style.color = '#6B7280'; b.style.fontWeight = '400'; b.style.borderBottomColor = 'transparent';
  });
  btn.style.color = '#2563EB'; btn.style.fontWeight = '700'; btn.style.borderBottomColor = '#2563EB';
}

// ── 科研工作台 sub-tabs：我的科研任务 / 活动 ────────────
function switchSpSubTab(panelId, btn) {
  ['sp-space-tasks-panel','sp-space-act-panel'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = (id === panelId) ? 'block' : 'none';
  });
  document.querySelectorAll('[id^="sp-btn-"]').forEach(function(b) {
    b.style.color = '#6B7280'; b.style.fontWeight = '400'; b.style.borderBottomColor = 'transparent';
  });
  if (btn) { btn.style.color = '#2563EB'; btn.style.fontWeight = '700'; btn.style.borderBottomColor = '#2563EB'; }
}

// ── 科研技能 sub-tabs ──────────────────────────────────────────
function switchSkillsSubTab(panelId, btn) {
  ['skills-all','skills-space'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = (id === panelId) ? 'block' : 'none';
  });
  document.querySelectorAll('[id^="skills-btn-"]').forEach(function(b) {
    b.style.color = '#6B7280'; b.style.fontWeight = '400'; b.style.borderBottomColor = 'transparent';
  });
  btn.style.color = '#2563EB'; btn.style.fontWeight = '700'; btn.style.borderBottomColor = '#2563EB';
}

// ── 科研数据中心 ───────────────────────────────────────────────
var dsDomainData = [
  { icon:'fa-atom', color:'#2563EB', bg:'linear-gradient(135deg,#DBEAFE,#EFF6FF)', name:'分子数据', type:'基础数据',
    desc:'小分子、配合物、量子化学性质与结构表征数据。', tags:['SMILES','HOMO/LUMO','LogP','pKa'],
    cols:['ID','名称','SMILES','分子式','分子量(g/mol)','HOMO(eV)','LUMO(eV)','HOMO-LUMO Gap'],
    rows:[['QM9-001','甲烷','C','CH4','16.043','-10.55','3.186','13.736'],
          ['QM9-002','氨','N','NH3','17.031','-6.993','2.256','9.249'],
          ['QM9-003','水','O','H2O','18.015','-7.967','1.869','9.837'],
          ['QM9-004','乙炔','C#C','C2H2','26.04','-7.742','1.377','9.119'],
          ['QM9-005','氰化氢','C#N','HCN','27.025','-9.807','0.52','10.329']] },
  { icon:'fa-gem', color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'晶体数据集', type:'基础数据',
    desc:'预留晶体结构、空间群、能带、形成能与稳定性数据入口。', tags:['CIF','空间群','形成能','带隙'],
    cols:['ID','名称','空间群','晶系','形成能(eV/atom)','带隙(eV)','体积(Å³)'],
    rows:[['MAT-001','氧化铝','R-3c','三方晶系','-3.43','8.76','85.3'],
          ['MAT-002','氮化硅','P31c','三方晶系','-1.94','5.18','160.2'],
          ['MAT-003','二氧化钛','P42/mnm','四方晶系','-3.72','3.03','62.1']] },
  { icon:'fa-layer-group', color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'聚合物数据', type:'场景数据',
    desc:'聚合物结构、热学、力学、电学与加工性质数据。', tags:['Tg','Tm','拉伸强度','介电常数'],
    cols:['ID','名称','Tg(°C)','Tm(°C)','拉伸强度(MPa)','介电常数'],
    rows:[['POL-001','聚乙烯(HDPE)','-125','137','27','2.3'],
          ['POL-002','聚丙烯(PP)','-15','165','35','2.2'],
          ['POL-003','聚苯乙烯(PS)','100','—','45','2.5']] },
  { icon:'fa-battery-full', color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'电池电解液数据', type:'场景数据',
    desc:'电解液分子、溶剂体系、锂盐、添加剂与电化学性能数据。', tags:['电导率','粘度','库伦效率','循环寿命'],
    cols:['ID','名称','电导率(mS/cm)','粘度(mPa·s)','库伦效率(%)'],
    rows:[['ELY-001','LiPF6/EC-DMC','10.5','2.31','99.2'],
          ['ELY-002','LiFSI/DME','12.1','1.82','99.6'],
          ['ELY-003','LiTFSI/DOL-DME','8.7','1.95','98.8']] }
];

var dsCurrentFilter = 'all';
var dsCurrentPub = 'published';

function dsRenderDomainCards(filter) {
  dsCurrentFilter = filter;
  var el = document.getElementById('ds-domain-cards');
  if (!el) return;
  var items = filter === 'all' ? dsDomainData : dsDomainData.filter(function(d){ return d.type === filter; });
  el.innerHTML = items.map(function(d, i) {
    return '<div onclick="dsOpenDetail(' + i + ')" style="min-width:220px;max-width:240px;background:white;border-radius:12px;border:1px solid #E5E7EB;padding:16px;cursor:pointer;flex-shrink:0;transition:box-shadow 0.15s;" onmouseover="this.style.boxShadow=\'0 4px 16px rgba(0,0,0,0.10)\'" onmouseout="this.style.boxShadow=\'\'">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
        '<div style="width:38px;height:38px;border-radius:9px;background:' + d.bg + ';display:flex;align-items:center;justify-content:center;">' +
          '<i class="fa-solid ' + d.icon + '" style="font-size:16px;color:' + d.color + ';"></i>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span style="font-size:10px;color:#6B7280;background:#F3F4F6;border-radius:4px;padding:2px 7px;">' + d.type + '</span>' +
          '<i class="fa-solid fa-pen-to-square" style="font-size:11px;color:#D1D5DB;cursor:pointer;"></i>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:4px;">' + d.name + '</div>' +
      '<div style="font-size:11px;color:#6B7280;line-height:1.6;margin-bottom:10px;">' + d.desc + '</div>' +
      '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;">' +
        d.tags.map(function(t){ return '<span style="font-size:10px;background:#F3F4F6;color:#374151;padding:2px 7px;border-radius:4px;">' + t + '</span>'; }).join('') +
      '</div>' +
      '<div style="font-size:11px;color:#9CA3AF;display:flex;align-items:center;justify-content:space-between;">' +
        '<span>0 个数据集 · ' + d.rows.length + ' 条记录</span>' +
        '<i class="fa-solid fa-arrow-right" style="font-size:10px;color:#D1D5DB;"></i>' +
      '</div>' +
    '</div>';
  }).join('');
}

function dsRenderDataset() {
  dsRenderDomainCards('all');
  dsRenderDatasetList();
}

function dsRenderDatasetList() {
  var grid = document.getElementById('ds-list-grid');
  var empty = document.getElementById('ds-empty');
  if (!grid) return;
  var items = spSkuData.dataset;
  if (dsCurrentPub === 'draft') { grid.innerHTML = ''; if(empty) empty.style.display = 'block'; return; }
  if(empty) empty.style.display = 'none';
  grid.innerHTML = items.map(function(item) {
    return '<div style="background:white;border-radius:12px;border:1px solid #E5E7EB;padding:16px;cursor:pointer;" onmouseover="this.style.boxShadow=\'0 4px 12px rgba(0,0,0,0.08)\'" onmouseout="this.style.boxShadow=\'\'">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
        '<div style="width:36px;height:36px;border-radius:9px;background:' + item.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
          '<i class="fa-solid ' + item.icon + '" style="font-size:15px;color:' + item.color + ';"></i>' +
        '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:13px;font-weight:700;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + item.name + '</div>' +
          '<div style="font-size:11px;color:#9CA3AF;margin-top:1px;">' + (item.field || '通用') + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:11px;color:#6B7280;line-height:1.6;margin-bottom:10px;">' + item.desc.substring(0,50) + '...</div>' +
      '<div style="display:flex;gap:5px;flex-wrap:wrap;">' +
        (item.tags||[]).slice(0,3).map(function(t){ return '<span style="font-size:10px;background:#EFF6FF;color:#2563EB;padding:2px 7px;border-radius:4px;">' + t + '</span>'; }).join('') +
      '</div>' +
    '</div>';
  }).join('');
}

function dsDomainFilter(type, btn) {
  document.querySelectorAll('.ds-filter-btn').forEach(function(b) {
    b.style.background = '#F3F4F6'; b.style.color = '#374151'; b.style.fontWeight = '400';
  });
  btn.style.background = '#2563EB'; btn.style.color = 'white'; btn.style.fontWeight = '600';
  dsRenderDomainCards(type);
}

function dsPubFilter(type, btn) {
  dsCurrentPub = type;
  document.querySelectorAll('[id^="ds-tab-"]').forEach(function(b) {
    b.style.color = '#6B7280'; b.style.fontWeight = '400'; b.style.borderBottomColor = 'transparent';
  });
  btn.style.color = '#2563EB'; btn.style.fontWeight = '700'; btn.style.borderBottomColor = '#2563EB';
  dsRenderDatasetList();
}

function dsOpenDetail(domainIdx) {
  var d = dsDomainData[domainIdx];
  if (!d) return;
  var drawer = document.getElementById('ds-detail-drawer');
  if (!drawer) return;
  document.getElementById('ds-detail-title').textContent = d.name;
  document.getElementById('ds-detail-sub').textContent = d.type + ' · ' + d.rows.length + ' 条记录';
  var thead = document.getElementById('ds-detail-thead');
  var tbody = document.getElementById('ds-detail-tbody');
  thead.innerHTML = '<tr>' + d.cols.map(function(c){ return '<th style="text-align:left;padding:10px 14px;font-size:12px;font-weight:600;color:#374151;border-bottom:2px solid #E5E7EB;white-space:nowrap;">' + c + '</th>'; }).join('') + '</tr>';
  tbody.innerHTML = d.rows.map(function(row, i){ return '<tr style="' + (i%2===1?'background:#F9FAFB':'') + '">' + row.map(function(cell){ return '<td style="padding:10px 14px;font-size:12px;color:#374151;border-bottom:1px solid #F3F4F6;white-space:nowrap;">' + cell + '</td>'; }).join('') + '</tr>'; }).join('');
  drawer.style.display = 'block';
}

function dsCloseDetail() {
  var drawer = document.getElementById('ds-detail-drawer');
  if (drawer) drawer.style.display = 'none';
}

function addActTask(task) {
  ACT_TASKS.unshift(task);
  try { renderActTasks(); } catch (e) {}
}

function joinMyAssets(category, name) {
  var META = {
    '模型':   { code:true,  icon:'fa-cube',           color:'#7C3AED' },
    '工具':   { code:true,  icon:'fa-toolbox',        color:'#EA580C' },
    '技能':   { code:false, icon:'fa-graduation-cap', color:'#059669' },
    '智能体': { code:false, icon:'fa-robot',          color:'#2563EB' },
    '应用':   { code:false, icon:'fa-grip',           color:'#2563EB' }
  };
  var m = META[category] || { code:false, icon:'fa-box', color:'#2563EB' };
  name = name || '未命名' + category;
  if (m.code) {
    var task = {
      type: category,
      name: '加入资产 · ' + name,
      icon: m.icon,
      color: m.color,
      status: '封装中',
      progress: 30,
      owner: '林夏',
      time: '刚刚',
      note: category + '资产需代码封装处理，正在自动封装…'
    };
    addActTask(task);
    try { wbToast('「' + name + '」需代码封装，已在「我的科研活动」创建处理任务'); } catch (e) {}
    setTimeout(function () {
      task.status = '审批中'; task.progress = 100;
      task.note = '代码封装完成，已提交管理员审核';
      try { renderActTasks(); } catch (e) {}
    }, 1800);
    setTimeout(function () {
      task.status = '已通过';
      task.note = '审核通过 · 已加入我的科研资产';
      try { renderActTasks(); } catch (e) {}
    }, 4200);
  } else {
    try { wbToast('已加入我的科研资产：' + name); } catch (e) {}
  }
}

function openCreateInApp(pageKey) {
  switchPage(pageKey);
  var pg = document.getElementById('page-' + pageKey);
  var f = pg && pg.querySelector('iframe');
  if (!f) return;
  function go() {
    try {
      var doc = f.contentWindow.document;
      var btn = doc.getElementById('open-create');
      if (btn) { btn.click(); return true; }
    } catch (e) {}
    return false;
  }
  if (!go()) { f.addEventListener('load', go, { once: true }); setTimeout(go, 400); }
}

// ── 我的科研活动：创建任务清单 ──────────────────────────────
var ACT_TASKS = [
  { type:'模型',   name:'晶体结构预测模型 v3', icon:'fa-cube',           color:'#7C3AED', status:'训练中', progress:65,  owner:'林夏', time:'2 小时前',   note:'训练进度 65%，预计 3 小时后完成' },
  { type:'技能',   name:'光谱峰位自动标注',     icon:'fa-graduation-cap', color:'#059669', status:'审批中', progress:100, owner:'王工', time:'今天 09:20',  note:'已提交管理员审批，等待通过' },
  { type:'智能体', name:'配方优化助手',         icon:'fa-robot',          color:'#2563EB', status:'已通过', progress:100, owner:'林夏', time:'昨天 16:40',  note:'审批通过 · 已发布到科研广场' },
  { type:'模型',   name:'反应产率预测模型',     icon:'fa-cube',           color:'#7C3AED', status:'已驳回', progress:100, owner:'赵博', time:'2 天前',     note:'驳回原因：训练数据来源需补充合规说明' }
];
function actStatusStyle(s) {
  if (s === '训练中' || s === '进行中' || s === '封装中') return { c:'#2563EB', bg:'#EFF6FF', ic:'fa-spinner' };
  if (s === '审批中') return { c:'#B45309', bg:'#FEF3C7', ic:'fa-hourglass-half' };
  if (s === '已通过') return { c:'#059669', bg:'#ECFDF5', ic:'fa-circle-check' };
  if (s === '已驳回') return { c:'#DC2626', bg:'#FEF2F2', ic:'fa-circle-xmark' };
  return { c:'#6B7280', bg:'#F3F4F6', ic:'fa-circle' };
}
function renderActTasks() {
  var box = document.getElementById('act-task-list');
  if (!box) return;
  if (!ACT_TASKS.length) { box.innerHTML = '<div style="text-align:center;color:#9CA3AF;font-size:13px;padding:32px;background:#fff;border:1px dashed #E5E7EB;border-radius:12px;">暂无创建任务</div>'; return; }
  box.innerHTML = ACT_TASKS.map(function(t) {
    var st = actStatusStyle(t.status);
    var inProg = (t.status === '训练中' || t.status === '进行中' || t.status === '封装中');
    var progressBar = inProg
      ? '<div style="height:5px;background:#F1F5F9;border-radius:20px;overflow:hidden;margin-top:10px;"><div style="height:100%;width:' + t.progress + '%;background:linear-gradient(90deg,#3B82F6,#8B5CF6);border-radius:20px;"></div></div>'
      : '';
    return '<div style="background:#fff;border:1px solid #EEF0F4;border-radius:12px;padding:14px 16px;margin-bottom:10px;">'
      + '<div style="display:flex;align-items:center;gap:12px;">'
      +   '<div style="width:38px;height:38px;border-radius:10px;background:' + st.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid ' + t.icon + '" style="color:' + t.color + ';font-size:15px;"></i></div>'
      +   '<div style="flex:1;min-width:0;">'
      +     '<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:13.5px;font-weight:700;color:#111827;">' + t.name + '</span>'
      +       '<span style="font-size:10px;font-weight:600;background:#F3F4F6;color:#6B7280;padding:2px 8px;border-radius:20px;">新建' + t.type + '</span></div>'
      +     '<div style="font-size:11.5px;color:#9CA3AF;margin-top:3px;">创建人 ' + t.owner + ' · ' + t.time + '</div>'
      +   '</div>'
      +   '<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:' + st.c + ';background:' + st.bg + ';padding:5px 11px;border-radius:20px;flex-shrink:0;"><i class="fa-solid ' + st.ic + '" style="font-size:11px;"></i>' + t.status + '</span>'
      + '</div>'
      + progressBar
      + '<div style="font-size:11.5px;color:' + (t.status === '已驳回' ? '#DC2626' : '#6B7280') + ';margin-top:9px;padding-left:2px;"><i class="fa-solid fa-circle-info" style="font-size:10px;margin-right:5px;opacity:.7;"></i>' + t.note + '</div>'
      + '</div>';
  }).join('');
}
try { renderActTasks(); } catch (e) {}

function switchPage(id) {
  // hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // deactivate all nav items
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    const icon = n.querySelector('.ni');
    if (icon) { icon.style.color = ''; }
  });

  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');

  const navId = 'nav-' + (navMap[id] || id);
  const navEl = document.getElementById(navId);
  if (navEl) navEl.classList.add('active');

  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = pageMeta[id] || id;
}

// ── Filter button groups
document.querySelectorAll('#filter-subject, #filter-use').forEach(group => {
  group.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// ── Skill tabs
document.querySelectorAll('#skill-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#skill-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ══════════════════════════════════════════════════════════
//  科研工作台 INTERACTIONS
// ══════════════════════════════════════════════════════════

var wbCourseData = {
  geo: {
    title: '页岩气储层评价课题',
    overview: '本课题围绕页岩气储层参数预测展开，完成了储层孔隙结构表征与压裂模拟两项前期成果。',
    explore: 3, output: 2,
    sessions: [
      { name: '储层渗透率预测方案探索', count: 4, last: '计划已敲定，切换构建模式产出结果。' },
      { name: '孔隙度测井解释综述草稿生成', count: 7, last: '综述草稿已生成，格式符合期刊要求。' }
    ]
  },
  mat: {
    title: '柔性聚合物材料研究',
    overview: '本课题围绕丁苯橡胶配方优化展开，探索硫化体系与填料体系对力学性能的影响机制。',
    explore: 2, output: 1,
    sessions: [
      { name: '丁苯橡胶配方与性能预测', count: 5, last: '配方优化方案已生成，等待实验验证。' }
    ]
  },
  bio: {
    title: '催化剂优化项目',
    overview: '本课题研究催化剂失活机理及再生策略，目标建立催化活性预测模型指导实验配方设计。',
    explore: 1, output: 0,
    sessions: []
  }
};

var wbCurrentCourse = null;
var wbChatMessages = [];

function openWbNewCourse() {
  // Placeholder - open new course modal
}

function openWbCourse(key) {
  wbCurrentCourse = key;
  var d = wbCourseData[key] || wbCourseData['geo'];

  // Update detail view content
  var el = function(id) { return document.getElementById(id); };
  if (el('wbd-title')) el('wbd-title').textContent = d.title;
  if (el('wbd-overview')) el('wbd-overview').textContent = d.overview;
  if (el('wbd-stat-explore')) el('wbd-stat-explore').textContent = d.explore;
  if (el('wbd-stat-output')) el('wbd-stat-output').textContent = d.output;
  if (el('wbd-tree-name')) el('wbd-tree-name').textContent = d.title;

  // Render sessions list
  var sessEl = el('wbd-sessions');
  if (sessEl) {
    if (d.sessions.length === 0) {
      sessEl.innerHTML = '<div style="text-align:center;padding:32px 0;color:#D1D5DB;"><i class="fa-regular fa-comment-dots" style="font-size:28px;margin-bottom:10px;display:block;"></i><div style="font-size:12.5px;color:#9CA3AF;">还没有对话记录，输入问题开始研究</div></div>';
    } else {
      sessEl.innerHTML = d.sessions.map(function(s) {
        return '<div onclick="openWbdSession()" style="background:white;border:1.5px solid #E5E7EB;border-radius:14px;padding:18px 22px;cursor:pointer;margin-bottom:10px;transition:all 0.14s;" onmouseover="this.style.borderColor=\'#93C5FD\'" onmouseout="this.style.borderColor=\'#E5E7EB\'">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
          '<div style="font-size:13.5px;font-weight:700;color:#111827;">' + s.name + '</div>' +
          '<span style="font-size:11px;color:#9CA3AF;background:#F3F4F6;border-radius:100px;padding:2px 9px;">' + s.count + ' 次问答</span>' +
          '</div><div style="font-size:12.5px;color:#9CA3AF;">上次：' + s.last + '</div></div>';
      }).join('');
    }
  }

  // Reset to single pane
  wbChatMessages = [];
  var sp = el('wb-single-pane'); var tp = el('wb-three-pane');
  if (sp) sp.style.display = 'flex';
  if (tp) tp.style.display = 'none';

  // Show detail, hide homepage
  el('wb-home').style.display = 'none';
  var det = el('wb-detail');
  det.style.display = 'flex';
}

function closeWbDetail() {
  document.getElementById('wb-home').style.display = 'flex';
  document.getElementById('wb-detail').style.display = 'none';
  wbChatMessages = [];
}

function switchWbdTab(tab) {
  ['home','chat','plan','task','asset'].forEach(function(t) {
    var btn = document.getElementById('wbd-tab-' + t);
    if (!btn) return;
    if (t === tab) {
      btn.style.color = '#2563EB';
      btn.style.borderBottom = '2px solid #2563EB';
      btn.style.fontWeight = '600';
    } else {
      btn.style.color = '#6B7280';
      btn.style.borderBottom = '2px solid transparent';
      btn.style.fontWeight = 'normal';
    }
  });
}

function openWbdSession() {
  // Open an existing session → jump to 3-pane with pre-filled messages
  var sp = document.getElementById('wb-single-pane');
  var tp = document.getElementById('wb-three-pane');
  if (sp) sp.style.display = 'none';
  if (tp) { tp.style.display = 'flex'; }

  var d = wbCourseData[wbCurrentCourse] || wbCourseData['geo'];
  var chatArea = document.getElementById('wbd-chat-area');
  var filesCount = document.getElementById('wbd-files-count');
  var filesList = document.getElementById('wbd-files-list');
  var sesName = document.getElementById('wbd-session-name');

  if (sesName) sesName.textContent = d.sessions[0] ? d.sessions[0].name : '历史对话';

  if (chatArea) {
    chatArea.innerHTML =
      '<div style="background:white;border:1.5px solid #FDE68A;border-radius:14px;padding:20px 24px;margin-bottom:16px;">' +
      '<div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:8px;">' + d.title + '</div>' +
      '<div style="font-size:12.5px;color:#6B7280;line-height:1.7;">' + d.overview + '</div></div>' +
      '<div style="background:white;border:1.5px solid #E5E7EB;border-radius:14px;padding:16px 20px;margin-bottom:12px;">' +
      '<div style="font-size:12.5px;font-weight:600;color:#374151;margin-bottom:6px;">' + (d.sessions[0] ? d.sessions[0].name : '') + '</div>' +
      '<div style="font-size:12px;color:#9CA3AF;">上次会话：' + (d.sessions[0] ? d.sessions[0].last : '') + '</div></div>' +
      '<div style="background:white;border:1.5px solid #E5E7EB;border-radius:14px;padding:18px 22px;">' +
      '<div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:12px;">执行计划确认</div>' +
      '<div style="background:#F9FAFB;border-radius:10px;padding:14px 16px;font-size:12.5px;color:#374151;line-height:1.8;margin-bottom:14px;">' +
      '数据准备 → 特征工程 → 模型训练（XGBoost + RF 集成）→ 储层参数预测报告生成<br>' +
      '预计调用 3 个算子、1 个预测模型，输出 HTML 报告与 JSON 摘要。</div>' +
      '<div style="display:flex;gap:8px;">' +
      '<button style="flex:1;padding:9px;background:white;border:1.5px solid #E5E7EB;border-radius:9px;font-size:12.5px;color:#374151;cursor:pointer;font-family:inherit;">修改计划</button>' +
      '<button style="flex:2;padding:9px;background:#2563EB;border:none;border-radius:9px;font-size:12.5px;color:white;font-weight:600;cursor:pointer;font-family:inherit;">确认执行计划 →</button>' +
      '</div></div>';
  }

  if (filesCount) filesCount.textContent = '共 2 个';
  if (filesList) {
    filesList.innerHTML =
      '<div style="display:flex;align-items:center;gap:10px;padding:10px 8px;border-radius:8px;cursor:pointer;border-bottom:1px solid #F1F5F9;" onmouseover="this.style.background=\'#F8FAFF\'" onmouseout="this.style.background=\'\'">' +
      '<div style="width:32px;height:32px;border-radius:7px;background:#DBEAFE;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-folder" style="color:#2563EB;font-size:13px;"></i></div>' +
      '<div><div style="font-size:12.5px;color:#111827;font-weight:500;">_code</div><div style="font-size:10.5px;color:#9CA3AF;">文件夹</div></div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:10px;padding:10px 8px;border-radius:8px;cursor:pointer;" onmouseover="this.style.background=\'#F8FAFF\'" onmouseout="this.style.background=\'\'">' +
      '<div style="width:32px;height:32px;border-radius:7px;background:#EDE9FE;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-file-lines" style="color:#7C3AED;font-size:13px;"></i></div>' +
      '<div><div style="font-size:12.5px;color:#111827;font-weight:500;">PLAN.md</div><div style="font-size:10.5px;color:#9CA3AF;">3 KB</div></div>' +
      '</div>';
  }
}

function wbdSendMsg() {
  var inp = document.getElementById('wbd-input');
  if (!inp || !inp.value.trim()) return;
  var msg = inp.value.trim();
  inp.value = '';

  // Switch to 3-pane
  var sp = document.getElementById('wb-single-pane');
  var tp = document.getElementById('wb-three-pane');
  if (sp) sp.style.display = 'none';
  if (tp) tp.style.display = 'flex';

  var sname = document.getElementById('wbd-session-name');
  if (sname) sname.textContent = msg.length > 16 ? msg.slice(0,16) + '…' : msg;

  var chatArea = document.getElementById('wbd-chat-area');
  if (chatArea) {
    chatArea.innerHTML = '';
    var userDiv = document.createElement('div');
    userDiv.style.cssText = 'background:white;border:1.5px solid #E5E7EB;border-radius:14px;padding:16px 20px;margin-bottom:12px;';
    userDiv.innerHTML = '<div style="font-size:11px;color:#9CA3AF;margin-bottom:6px;">你</div><div style="font-size:13px;color:#111827;">' + msg + '</div>';
    chatArea.appendChild(userDiv);

    var aiDiv = document.createElement('div');
    aiDiv.style.cssText = 'background:white;border:1.5px solid #E5E7EB;border-radius:14px;padding:16px 20px;margin-bottom:12px;';
    aiDiv.innerHTML = '<div style="font-size:11px;color:#9CA3AF;margin-bottom:8px;display:flex;align-items:center;gap:5px;"><i class="fa-solid fa-robot" style="color:#7C3AED;"></i> AI 助手</div>' +
      '<div style="font-size:13px;color:#374151;line-height:1.7;">好的，我已理解你的研究任务。我将为你分析相关文献，制定探索计划并开始执行。</div>' +
      '<div style="margin-top:14px;background:#F9FAFB;border-radius:10px;padding:12px 16px;">' +
      '<div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:10px;">执行计划确认</div>' +
      '<div style="font-size:12.5px;color:#374151;line-height:1.8;margin-bottom:12px;">文献检索 → 内容提取 → 知识整合 → 报告生成</div>' +
      '<div style="display:flex;gap:8px;">' +
      '<button style="flex:1;padding:8px;background:white;border:1.5px solid #E5E7EB;border-radius:9px;font-size:12px;color:#374151;cursor:pointer;font-family:inherit;">修改计划</button>' +
      '<button style="flex:2;padding:8px;background:#2563EB;border:none;border-radius:9px;font-size:12px;color:white;font-weight:600;cursor:pointer;font-family:inherit;">确认执行计划 →</button>' +
      '</div></div>';
    chatArea.appendChild(aiDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  document.getElementById('wbd-files-count').textContent = '共 0 个';
}

function wbdSend3PMsg() {
  var inp = document.getElementById('wbd-input-3');
  if (!inp || !inp.value.trim()) return;
  var msg = inp.value.trim();
  inp.value = '';

  var chatArea = document.getElementById('wbd-chat-area');
  if (!chatArea) return;

  var userDiv = document.createElement('div');
  userDiv.style.cssText = 'background:white;border:1.5px solid #E5E7EB;border-radius:14px;padding:14px 18px;margin-bottom:10px;';
  userDiv.innerHTML = '<div style="font-size:11px;color:#9CA3AF;margin-bottom:5px;">你</div><div style="font-size:13px;color:#111827;">' + msg + '</div>';
  chatArea.appendChild(userDiv);

  var aiDiv = document.createElement('div');
  aiDiv.style.cssText = 'background:white;border:1.5px solid #E5E7EB;border-radius:14px;padding:14px 18px;margin-bottom:10px;';
  aiDiv.innerHTML = '<div style="font-size:11px;color:#9CA3AF;margin-bottom:6px;display:flex;align-items:center;gap:5px;"><i class="fa-solid fa-robot" style="color:#7C3AED;"></i> AI 助手</div>' +
    '<div style="font-size:13px;color:#374151;line-height:1.7;">收到，正在分析你的指令并调度相关智能体执行任务…</div>';
  chatArea.appendChild(aiDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

var wbProjects = {
  geo: {
    name: '页岩气储层评价课题',
    lit: 89, litSub: '+8 本周', note: 24, noteSub: 'AI 辅助 11',
    task: 6, taskSub: '2 个待完成', prog: '72%', progSub: '按计划推进',
    aiSubtitle: '基于页岩气储层评价课题 · 89 篇文献',
    chips: ['总结最新储层文献进展', '生成综述草稿', '分析测井数据趋势', '生成课题进展报告'],
    app1: { name: '储层预测', sub: 'ML 参数智能预测' },
    app2: { name: '实验设计', sub: 'AI 推荐实验方案' },
    tasks: [
      { text: '阅读并标注最新测井解释方法综述文章', due: '明天', hot: true },
      { text: '整理 2024 年孔隙度预测相关文献分类', due: '3 天后', hot: false },
      { text: '生成储层敏感性分析章节综述草稿', due: '本周', hot: false },
      { text: '整理压裂模拟相关参考文献并分组', due: '下周', hot: false }
    ]
  },
  mat: {
    name: '柔性聚合物材料研究',
    lit: 61, litSub: '+4 本周', note: 15, noteSub: 'AI 辅助 7',
    task: 8, taskSub: '3 个待完成', prog: '45%', progSub: '进度略慢',
    aiSubtitle: '基于柔性聚合物材料研究 · 61 篇文献',
    chips: ['总结聚合物配方文献', '生成配方优化建议', '分析材料测试数据', '生成材料研究报告'],
    app1: { name: '配方优化', sub: 'AI 驱动参数优化' },
    app2: { name: '性能预测', sub: '材料性质预测模型' },
    tasks: [
      { text: '整理丁苯橡胶硫化机理相关文献', due: '明天', hot: true },
      { text: '分析配方优化实验数据', due: '本周', hot: false },
      { text: '生成材料性能对比报告草稿', due: '下周', hot: false }
    ]
  },
  bio: {
    name: '催化剂优化项目',
    lit: 47, litSub: '+3 本周', note: 9, noteSub: 'AI 辅助 4',
    task: 4, taskSub: '1 个待完成', prog: '28%', progSub: '刚启动',
    aiSubtitle: '基于催化剂优化项目 · 47 篇文献',
    chips: ['总结催化剂失活机理文献', '生成再生方案建议', '分析催化活性数据', '生成课题进展报告'],
    app1: { name: '催化优化', sub: '活性预测与调优' },
    app2: { name: '实验设计', sub: 'AI 推荐实验方案' },
    tasks: [
      { text: '阅读催化剂失活机理综述文章', due: '本周', hot: false },
      { text: '整理再生技术对比文献', due: '下周', hot: false }
    ]
  }
};

var wbCurrentProject = 'geo';

function selectWbProject(key) {
  wbCurrentProject = key;
  var p = wbProjects[key];

  // Update project card highlight
  ['geo','mat','bio'].forEach(function(k) {
    var card = document.getElementById('wb-proj-' + k);
    if (!card) return;
    if (k === key) {
      card.style.border = '2px solid #2563EB';
      card.style.background = '#F0F7FF';
    } else {
      card.style.border = '1.5px solid #E5E7EB';
      card.style.background = 'white';
    }
  });

  // Update project selector
  var sel = document.getElementById('wb-sel-name');
  if (sel) sel.textContent = p.name;

  // Update stats
  var s = { lit: p.lit, litSub: p.litSub, note: p.note, noteSub: p.noteSub,
            task: p.task, taskSub: p.taskSub, prog: p.prog, progSub: p.progSub };
  var el = function(id) { return document.getElementById(id); };
  if (el('wb-stat-lit')) el('wb-stat-lit').textContent = s.lit;
  if (el('wb-stat-note')) el('wb-stat-note').textContent = s.note;
  if (el('wb-stat-note-sub')) el('wb-stat-note-sub').textContent = s.noteSub;
  if (el('wb-stat-task')) el('wb-stat-task').textContent = s.task;
  if (el('wb-stat-task-sub')) el('wb-stat-task-sub').textContent = s.taskSub;
  if (el('wb-stat-prog')) el('wb-stat-prog').textContent = s.prog;
  if (el('wb-stat-prog-sub')) el('wb-stat-prog-sub').textContent = s.progSub;

  // Update task list
  var tl = el('wb-task-list');
  if (tl) {
    tl.innerHTML = p.tasks.map(function(t, i) {
      var dueStyle = t.hot
        ? 'background:#FEF3C7;color:#92400E;border-radius:100px;padding:2px 9px;font-weight:500;flex-shrink:0;'
        : 'color:#9CA3AF;flex-shrink:0;';
      return '<div style="display:flex;align-items:center;gap:14px;padding:13px 20px;' +
        (i < p.tasks.length - 1 ? 'border-bottom:1px solid #F8FAFF;' : '') +
        'cursor:pointer;" onmouseenter="this.style.background=\'#F8FAFF\'" onmouseleave="this.style.background=\'\'">' +
        '<div style="width:18px;height:18px;border-radius:50%;border:2px solid #D1D5DB;flex-shrink:0;"></div>' +
        '<span style="flex:1;font-size:13px;color:#374151;">' + t.text + '</span>' +
        '<span style="font-size:11px;' + dueStyle + '">' + t.due + '</span>' +
        '</div>';
    }).join('');
  }

  // Update AI subtitle
  var sub = el('wb-ai-subtitle');
  if (sub) sub.textContent = p.aiSubtitle;

  // Update suggestion chips
  var chipsEl = el('wb-ai-chips');
  if (chipsEl && p.chips) {
    chipsEl.innerHTML = p.chips.map(function(c) {
      return '<button onclick="wbQuickPrompt(this)" style="font-size:11px;border:1px solid #BFDBFE;border-radius:100px;padding:4px 12px;background:white;color:#2563EB;cursor:pointer;font-family:inherit;" onmouseover="this.style.background=\'#EFF6FF\'" onmouseout="this.style.background=\'white\'">' + c + '</button>';
    }).join('');
  }

  // Update domain-specific app shortcuts
  var a1n = el('wb-app1-name'), a1s = el('wb-app1-sub');
  var a2n = el('wb-app2-name'), a2s = el('wb-app2-sub');
  if (a1n && p.app1) { a1n.textContent = p.app1.name; }
  if (a1s && p.app1) { a1s.textContent = p.app1.sub; }
  if (a2n && p.app2) { a2n.textContent = p.app2.name; }
  if (a2s && p.app2) { a2s.textContent = p.app2.sub; }

  // Update AI input placeholder
  var inp = el('wb-ai-input');
  if (inp) inp.placeholder = '提问、写作、分析数据...';
}

function wbQuickPrompt(btn) {
  var inp = document.getElementById('wb-ai-input');
  if (inp) { inp.value = btn.textContent; inp.focus(); }
}

function wbSendAiMsg() {
  var inp = document.getElementById('wb-ai-input');
  if (!inp || !inp.value.trim()) return;
  openAiQa();
  var txt = inp.value.trim();
  inp.value = '';
  setTimeout(function() { sendAiQaMsgText(txt); }, 200);
}

// ══════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════
//  科研空间 TAB SWITCHING
// ══════════════════════════════════════════════════════════

// ── 科研空间 SKU Marketplace ─────────────────────────────────────────
var spCurrentTab = 'skills';

var spSkuData = {
  skills: [
    { icon:'fa-magnifying-glass-chart', color:'#2563EB', bg:'linear-gradient(135deg,#DBEAFE,#EFF6FF)', name:'文献自动综述', desc:'基于 LLM 自动检索并生成综述草稿，支持多数据库联合检索', tags:['文献管理','NLP'], rating:4.9, count:'12,340', badge:'热门' },
    { icon:'fa-chart-line', color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'数据趋势分析', desc:'时序数据可视化与异常检测，支持科研实验数据批量分析', tags:['数据分析','统计'], rating:4.7, count:'8,921', badge:'' },
    { icon:'fa-dna', color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'蛋白质结构解析', desc:'AlphaFold2 集成分析，快速预测蛋白质三维结构与功能注释', tags:['生物信息','AI'], rating:4.8, count:'6,552', badge:'新品' },
    { icon:'fa-flask', color:'#EA580C', bg:'linear-gradient(135deg,#FEE2E2,#FFF7ED)', name:'实验方案设计', desc:'基于目标参数智能推荐实验设计方案，减少冗余实验轮次', tags:['实验设计','优化'], rating:4.6, count:'5,103', badge:'' },
    { icon:'fa-atom', color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'分子模拟技能', desc:'GROMACS/LAMMPS 封装调用，自动生成输入文件与后处理脚本', tags:['计算化学','MD'], rating:4.8, count:'4,788', badge:'' },
    { icon:'fa-microscope', color:'#DB2777', bg:'linear-gradient(135deg,#FCE7F3,#FDF4FF)', name:'图像识别分析', desc:'显微镜图像自动标注与特征提取，支持 TEM/SEM 图像分析', tags:['图像AI','材料'], rating:4.5, count:'3,990', badge:'' },
    { icon:'fa-file-pen', color:'#16A34A', bg:'linear-gradient(135deg,#DCFCE7,#F0FDF4)', name:'论文写作辅助', desc:'自动润色、结构建议与参考文献格式化，多语言支持', tags:['写作','论文'], rating:4.9, count:'18,760', badge:'热门' },
    { icon:'fa-code', color:'#B45309', bg:'linear-gradient(135deg,#FEF3C7,#FFFBEB)', name:'代码生成与调试', desc:'科研代码自动生成，支持 Python/R/MATLAB，含注释与单测', tags:['编程','自动化'], rating:4.7, count:'11,200', badge:'' }
  ],
  spmodel: [
    { icon:'fa-brain', color:'#2563EB', bg:'linear-gradient(135deg,#DBEAFE,#EFF6FF)', name:'ChemBERTa-v2', desc:'针对化学分子 SMILES 序列预训练，支持性质预测与分子生成', tags:['化学','分子'], rating:4.8, count:'7,841', badge:'热门' },
    { icon:'fa-cube', color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'材料力学预测模型', desc:'基于 GNN 预测晶体材料弹性模量与热导率，MAE < 3%', tags:['材料','GNN'], rating:4.6, count:'4,230', badge:'' },
    { icon:'fa-dna', color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'ProteinLM 蛋白语言模型', desc:'千亿参数蛋白质语言模型，功能预测准确率 92%+', tags:['生物','Transformer'], rating:4.9, count:'9,120', badge:'新品' },
    { icon:'fa-earth-asia', color:'#EA580C', bg:'linear-gradient(135deg,#FEE2E2,#FFF7ED)', name:'地震波形解释模型', desc:'深度学习地震相分类与储层预测，适配页岩气储层评价', tags:['地球','地震'], rating:4.5, count:'2,998', badge:'' },
    { icon:'fa-wind', color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'CFD 代理模型', desc:'神经网络流体模拟代理，比传统 CFD 快 100x，精度 96%', tags:['流体','仿真'], rating:4.7, count:'3,540', badge:'' },
    { icon:'fa-fire', color:'#DB2777', bg:'linear-gradient(135deg,#FCE7F3,#FDF4FF)', name:'燃烧反应预测', desc:'预测燃烧反应路径与产物分布，支持生物质能源研究', tags:['能源','反应'], rating:4.4, count:'1,870', badge:'' }
  ],
  software: [
    { icon:'fa-atom',         color:'#2563EB', bg:'linear-gradient(135deg,#DBEAFE,#EFF6FF)', name:'GROMACS',             desc:'分子动力学模拟与轨迹分析。支持蛋白质、聚合物体系 NPT/NVT 模拟及 GPU 加速', tags:['分子动力学','开源'], rating:4.8, count:'1,400', badge:'热门', license:'开源', field:'材料科学' },
    { icon:'fa-cube',         color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'VASP',                desc:'第一性原理电子结构计算，输出能带、态密度与电荷密度。已集成并行任务调度', tags:['第一性原理','商业'], rating:4.8, count:'2,600', badge:'推荐', license:'商业', field:'材料科学' },
    { icon:'fa-fire',         color:'#EA580C', bg:'linear-gradient(135deg,#FEE2E2,#FFF7ED)', name:'LAMMPS',              desc:'大规模分子动力学，适用于配方体系长时间轨迹，支持 GPU 加速与力场扩展', tags:['分子动力学','开源'], rating:4.7, count:'1,100', badge:'', license:'开源', field:'材料科学' },
    { icon:'fa-vial',         color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'Gaussian',           desc:'量子化学计算，用于分子结构优化、过渡态搜索与激发态计算（商业授权）', tags:['量子化学','商业'], rating:4.7, count:'1,900', badge:'', license:'商业', field:'材料科学' },
    { icon:'fa-microscope',   color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'AlphaFold2 / ColabFold', desc:'蛋白质三维结构预测，ColabFold 以 MMseqs2 加速多序列比对，支持复合物预测', tags:['结构预测','开源'], rating:4.8, count:'1,100', badge:'新品', license:'开源', field:'合成生物学' },
    { icon:'fa-water',        color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'OpenFOAM',           desc:'有限体积 CFD 工具箱，支持稳态/瞬态流动、传热、多相流与反应流求解', tags:['连续介质','开源'], rating:4.7, count:'1,100', badge:'', license:'开源', field:'通用' },
    { icon:'fa-layer-group',  color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'Materials Studio',  desc:'材料建模与性质模拟套件，Forcite 模块用于聚合物与界面分子动力学（商业授权）', tags:['分子动力学','商业'], rating:4.6, count:'1,700', badge:'', license:'商业', field:'材料科学' },
    { icon:'fa-terminal',     color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'ORCA',               desc:'量子化学程序，支持 DFT、耦合簇、TDDFT 与过渡态搜索；商业用途需授权', tags:['量子化学','学术免费'], rating:4.7, count:'1,100', badge:'', license:'学术免费', field:'材料科学' },
    { icon:'fa-atom',         color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'Quantum ESPRESSO',  desc:'平面波赝势第一性原理套件，计算能带、声子、NEB 路径与 AIMD', tags:['第一性原理','开源'], rating:4.6, count:'450', badge:'', license:'开源', field:'材料科学' },
    { icon:'fa-flask',        color:'#EA580C', bg:'linear-gradient(135deg,#FEE2E2,#FFF7ED)', name:'Aspen Plus',        desc:'化工流程稳态模拟与优化，覆盖反应器、精馏、萃取与灵敏度分析（商业授权）', tags:['流程模拟','商业'], rating:4.6, count:'700', badge:'', license:'商业', field:'通用' },
    { icon:'fa-earth-asia',   color:'#EA580C', bg:'linear-gradient(135deg,#FEE2E2,#FFF7ED)', name:'GeoEast',           desc:'东方物探自主研发的地震数据处理解释一体化系统，覆盖处理、成像、正演与解释', tags:['地震处理','商业'], rating:4.5, count:'500', badge:'', license:'商业', field:'地球科学' },
    { icon:'fa-oil-well',     color:'#B45309', bg:'linear-gradient(135deg,#FEF3C7,#FFFBEB)', name:'ECLIPSE',           desc:'油藏数值模拟器，支持黑油与组分模型的历史拟合和开发方案预测（商业授权）', tags:['油藏工程','商业'], rating:4.6, count:'1,200', badge:'', license:'商业', field:'地球科学' },
    { icon:'fa-cube',         color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'OPM Flow',          desc:'兼容 ECLIPSE deck 的开源油藏模拟器，支持黑油模型与 CO₂ 封存模拟', tags:['油藏工程','开源'], rating:4.5, count:'500', badge:'', license:'开源', field:'地球科学' },
    { icon:'fa-dna',          color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'Rosetta',           desc:'蛋白结构建模与设计套件，用于酶设计、稳定性优化、对接与能量打分（学术免费）', tags:['蛋白建模','学术免费'], rating:4.6, count:'200', badge:'', license:'学术免费', field:'合成生物学' },
    { icon:'fa-microscope',   color:'#DB2777', bg:'linear-gradient(135deg,#FCE7F3,#FDF4FF)', name:'PyMOL',             desc:'蛋白与小分子三维结构可视化和出图，开源版可用，商业版由 Schrödinger 提供', tags:['分子可视化','开源'], rating:4.7, count:'500', badge:'', license:'开源', field:'合成生物学' },
    { icon:'fa-bolt',         color:'#6366F1', bg:'linear-gradient(135deg,#EDE9FE,#F0F0FF)', name:'COMSOL Multiphysics', desc:'多物理场有限元仿真，耦合流动、传热、固体力学、声学与电磁场（商业授权）', tags:['多物理场','商业'], rating:4.6, count:'400', badge:'', license:'商业', field:'通用' },
    { icon:'fa-chart-area',   color:'#16A34A', bg:'linear-gradient(135deg,#DCFCE7,#F0FDF4)', name:'DWSIM',             desc:'兼容 CAPE-OPEN 的开源流程模拟器，支持物性包、单元模块与灵敏度分析', tags:['流程模拟','开源'], rating:4.5, count:'1,100', badge:'', license:'开源', field:'通用' },
    { icon:'fa-water',        color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'Madagascar / Seismic Unix', desc:'地震处理工具集，支持可复现处理流程、SEG-Y 读写与批处理', tags:['地震处理','开源'], rating:4.5, count:'1,000', badge:'', license:'开源', field:'地球科学' }
  ],
  domain: [
    { icon:'fa-flask', color:'#2563EB', bg:'linear-gradient(135deg,#DBEAFE,#EFF6FF)', name:'化学领域知识包', desc:'有机化学、无机化学、物理化学核心知识图谱与数据集', tags:['化学','知识图谱'], rating:4.7, count:'6,210', badge:'' },
    { icon:'fa-layer-group', color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'材料科学领域', desc:'材料基因组学数据、相图数据与材料设计规律知识库', tags:['材料','数据库'], rating:4.8, count:'4,990', badge:'热门' },
    { icon:'fa-dna', color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'生命科学领域', desc:'基因组、蛋白质组与代谢组学标准数据集与分析流程', tags:['生物','组学'], rating:4.9, count:'8,320', badge:'推荐' },
    { icon:'fa-earth-asia', color:'#EA580C', bg:'linear-gradient(135deg,#FEE2E2,#FFF7ED)', name:'地球科学领域', desc:'地震、地层、油气储层数据集与解释方法标准规范', tags:['地质','储层'], rating:4.5, count:'3,440', badge:'' },
    { icon:'fa-bolt', color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'能源与环境', desc:'新能源材料、碳捕集技术数据集与排放计算标准', tags:['能源','碳中和'], rating:4.6, count:'2,780', badge:'新品' }
  ],
  spoperator: [
    { icon:'fa-filter',        color:'#EA580C', bg:'linear-gradient(135deg,#FEE2E2,#FFF7ED)', name:'科研数据清洗工具',  desc:'科研实验数据自动去噪、插值、异常值检测与标准化，适配多格式数据集', tags:['数据处理','开源'], rating:4.8, count:'3,200', badge:'热门', license:'开源', field:'通用' },
    { icon:'fa-flask',         color:'#2563EB', bg:'linear-gradient(135deg,#DBEAFE,#EFF6FF)', name:'RDKit',              desc:'化学信息学与分子描述符计算 Python 库，支持 SMILES/SDF 处理与指纹生成', tags:['化学信息','开源'], rating:4.8, count:'900', badge:'推荐', license:'开源', field:'材料科学' },
    { icon:'fa-dna',           color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'Biopython',          desc:'生物序列解析、BLAST 检索、蛋白质结构分析与路径规划 Python 工具库', tags:['序列分析','开源'], rating:4.7, count:'1,600', badge:'热门', license:'开源', field:'合成生物学' },
    { icon:'fa-code',          color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'COBRApy',            desc:'基于约束的代谢通量平衡分析，支持 FBA/FVA 与代谢网络重建', tags:['代谢通量','开源'], rating:4.7, count:'400', badge:'新品', license:'开源', field:'合成生物学' },
    { icon:'fa-atom',          color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'ASE',                desc:'原子模拟环境，支持结构驰豫、NEB 路径、分子动力学与 DFT 接口封装', tags:['原子模拟','开源'], rating:4.7, count:'600', badge:'', license:'开源', field:'材料科学' },
    { icon:'fa-cube',          color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'pymatgen',           desc:'材料基因组计划 Python 库，处理晶体结构、相图计算与 VASP/ABINIT 接口', tags:['材料基因组','开源'], rating:4.8, count:'700', badge:'推荐', license:'开源', field:'材料科学' },
    { icon:'fa-arrows-left-right', color:'#DB2777', bg:'linear-gradient(135deg,#FCE7F3,#FDF4FF)', name:'Open Babel',    desc:'化学格式转换算子，支持 120+ 格式（SMILES/MOL/PDB/XYZ），内置结构清洗', tags:['格式转换','开源'], rating:4.7, count:'500', badge:'', license:'开源', field:'材料科学' },
    { icon:'fa-thermometer',   color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'CoolProp',           desc:'开源热物性数据库，支持 120+ 纯物质与混合物 EOS，可与 Python/MATLAB 集成', tags:['热物性','开源'], rating:4.7, count:'600', badge:'', license:'开源', field:'通用' },
    { icon:'fa-fire-flame-curved', color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'Cantera',       desc:'化学反应动力学与热力学开源库，支持均相/非均相反应与点火延迟计算', tags:['反应动力学','开源'], rating:4.6, count:'300', badge:'', license:'开源', field:'通用' },
    { icon:'fa-rotate',        color:'#2563EB', bg:'linear-gradient(135deg,#DBEAFE,#EFF6FF)', name:'GemPy',              desc:'开源隐式地质建模库，支持三维地层、断层建模与贝叶斯不确定性分析', tags:['地质建模','开源'], rating:4.5, count:'200', badge:'新品', license:'开源', field:'地球科学' },
    { icon:'fa-chart-area',    color:'#DB2777', bg:'linear-gradient(135deg,#FCE7F3,#FDF4FF)', name:'SciPy / NumPy Stack', desc:'科学计算基础栈：线性代数、FFT、稀疏矩阵、优化与插值，科研数据处理通用算子', tags:['科学计算','开源'], rating:4.9, count:'800', badge:'热门', license:'开源', field:'通用' },
    { icon:'fa-chart-line',    color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'MDAnalysis',         desc:'分子动力学轨迹分析 Python 库，计算 RMSD、RDF、接触距离与结合自由能', tags:['轨迹分析','开源'], rating:4.7, count:'400', badge:'', license:'开源', field:'材料科学' }
  ],
  template: [
    { icon:'fa-file-code', color:'#2563EB', bg:'linear-gradient(135deg,#DBEAFE,#EFF6FF)', name:'文献综述自动化流程', desc:'从检索到写作全流程场景模版，一键启动综述生成任务', tags:['综述','自动化'], rating:4.8, count:'7,230', badge:'热门' },
    { icon:'fa-vials', color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'实验设计-分析模版', desc:'DOE 实验设计 + 数据采集 + 统计分析标准化流程', tags:['实验','DOE'], rating:4.6, count:'4,120', badge:'' },
    { icon:'fa-timeline', color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'项目里程碑模版', desc:'科研项目阶段拆解与进度追踪标准模版，含汇报格式', tags:['项目管理','计划'], rating:4.5, count:'5,880', badge:'推荐' },
    { icon:'fa-robot', color:'#EA580C', bg:'linear-gradient(135deg,#FEE2E2,#FFF7ED)', name:'多智能体协作模版', desc:'文献-实验-分析-写作智能体协同流程，适合完整课题', tags:['智能体','协作'], rating:4.9, count:'3,290', badge:'新品' },
    { icon:'fa-chart-line', color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'数据驱动发现模版', desc:'数据挖掘 → 假设生成 → 验证的科学发现完整流程', tags:['数据驱动','发现'], rating:4.7, count:'2,740', badge:'' }
  ],
  compout: [
    { icon:'fa-chart-bar', color:'#2563EB', bg:'linear-gradient(135deg,#DBEAFE,#EFF6FF)', name:'分子轨道可视化', desc:'DFT 计算结果自动生成分子轨道、电子密度图与能级图', tags:['DFT','可视化'], rating:4.7, count:'3,120', badge:'' },
    { icon:'fa-table', color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'结构优化报告', desc:'自动生成晶体/分子结构优化计算报告，含误差分析', tags:['结构','报告'], rating:4.6, count:'4,560', badge:'热门' },
    { icon:'fa-wave-square', color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'光谱模拟产出物', desc:'红外、拉曼、NMR 光谱模拟结果标准化输出包', tags:['光谱','模拟'], rating:4.8, count:'2,990', badge:'' },
    { icon:'fa-thermometer', color:'#EA580C', bg:'linear-gradient(135deg,#FEE2E2,#FFF7ED)', name:'热力学数据产出', desc:'反应焓、熵变、吉布斯自由能计算产出与可视化图表', tags:['热力学','能量'], rating:4.5, count:'1,870', badge:'' },
    { icon:'fa-cubes', color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'MD 轨迹分析包', desc:'分子动力学模拟轨迹分析：RMSD、RDF、MSD 等指标输出', tags:['MD','轨迹'], rating:4.7, count:'3,210', badge:'' }
  ],
  dataset: [
    { icon:'fa-database',     color:'#2563EB', bg:'linear-gradient(135deg,#DBEAFE,#EFF6FF)', name:'Materials Project', desc:'超过 15 万种无机材料的 DFT 计算数据库，提供能带、弹性模量与生成焓', tags:['材料','结构'], rating:4.9, count:'12,400', badge:'热门', field:'材料科学' },
    { icon:'fa-dna',          color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'PDB 蛋白质数据库', desc:'全球最大蛋白质三维结构数据库，支持 mmCIF/PDB 格式下载与 API 检索', tags:['蛋白质','结构'], rating:4.9, count:'9,800', badge:'热门', field:'合成生物学' },
    { icon:'fa-earth-asia',   color:'#EA580C', bg:'linear-gradient(135deg,#FEE2E2,#FFF7ED)', name:'SEGY 地震数据集', desc:'开放地震勘探原始数据包，含叠前与叠后道集，适配 Madagascar 与 SU 处理流', tags:['地震','原始数据'], rating:4.6, count:'2,100', badge:'', field:'地球科学' },
    { icon:'fa-flask',        color:'#7C3AED', bg:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', name:'NIST 化学数据库 WebBook', desc:'覆盖热力学、光谱与反应动力学的标准化学物性数据，支持 JSON API 访问', tags:['化学','热力学'], rating:4.8, count:'7,300', badge:'推荐', field:'通用' },
    { icon:'fa-chart-area',   color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'ICSD 无机晶体结构数据库', desc:'德国 FIZ 出版的无机晶体结构数据库，收录 21 万+ 晶体结构，支持 CIF 导出', tags:['晶体','结构'], rating:4.7, count:'3,600', badge:'', field:'材料科学' },
    { icon:'fa-leaf',         color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'UniProt 蛋白序列库', desc:'整合 Swiss-Prot 与 TrEMBL 的蛋白序列与功能注释数据库，支持 BLAST 接口', tags:['蛋白质','序列'], rating:4.8, count:'5,500', badge:'', field:'合成生物学' },
    { icon:'fa-oil-well',     color:'#B45309', bg:'linear-gradient(135deg,#FEF3C7,#FFFBEB)', name:'公开油藏测井数据集', desc:'北美公开盆地测井曲线与岩心数据包，LAS 2.0 格式，含 GR/DT/RHOB 曲线', tags:['测井','油藏'], rating:4.5, count:'1,200', badge:'', field:'地球科学' },
    { icon:'fa-atom',         color:'#DB2777', bg:'linear-gradient(135deg,#FCE7F3,#FDF4FF)', name:'AFLOW 材料基因组数据集', desc:'AFLOW 计算框架产生的高通量 DFT 数据集，含合金、氧化物与拓扑材料', tags:['材料','高通量'], rating:4.7, count:'2,800', badge:'新品', field:'材料科学' },
    { icon:'fa-table',        color:'#059669', bg:'linear-gradient(135deg,#D1FAE5,#ECFDF5)', name:'BIGG 代谢网络数据库', desc:'高质量代谢网络重建数据集，支持 SBML 格式与 COBRApy 直接导入', tags:['代谢网络','合成生物'], rating:4.6, count:'900', badge:'', field:'合成生物学' },
    { icon:'fa-cloud',        color:'#0891B2', bg:'linear-gradient(135deg,#CFFAFE,#ECFEFF)', name:'ERA5 气候再分析数据', desc:'ECMWF 全球大气再分析数据集，1940 年至今，支持 NetCDF/GRIB 格式下载', tags:['气候','大气'], rating:4.8, count:'4,100', badge:'热门', field:'地球科学' }
  ]
};

var spFilterConfig = {
  skills:    ['全部','文献管理','数据分析','AI辅助','写作','实验设计','编程'],
  spmodel:   ['全部','化学模型','材料模型','生物模型','地球科学','流体仿真'],
  software:  ['全部','材料科学','地球科学','合成生物学','通用'],
  domain:    ['全部','化学','材料','生命科学','地球科学','能源与环境'],
  spoperator:['全部','通用','材料科学','地球科学','合成生物学'],
  template:  ['全部','文献综述','实验设计','项目管理','智能体流程','数据驱动'],
  compout:   ['全部','可视化','报告输出','光谱','热力学','MD分析'],
  dataset:   ['全部','材料科学','地球科学','合成生物学','通用']
};

var spVtabIds = ['skills','spmodel','software','domain','spoperator','template','compout','dataset'];
var spVtabLabels = { skills:'科研技能', spmodel:'科研模型', software:'科研软件', domain:'领域', spoperator:'科研算子', template:'场景模版', compout:'计算产出物', dataset:'数据集' };
var spSubtabLabel = { skills:'全部技能', spmodel:'全部模型', software:'全部软件', domain:'全部领域', spoperator:'全部算子', template:'全部模版', compout:'全部产出物', dataset:'全部数据集' };

function switchSpTab(tab) {
  spCurrentTab = tab;

  // Update vertical tabs
  spVtabIds.forEach(function(id) {
    var el = document.getElementById('sp-vtab-' + id);
    if (!el) return;
    var icon = el.querySelector('i');
    var label = el.querySelector('span');
    if (id === tab) {
      el.style.background = '#EFF6FF';
      el.dataset.active = '1';
      if (icon) icon.style.color = '#2563EB';
      if (label) { label.style.color = '#2563EB'; label.style.fontWeight = '600'; }
    } else {
      el.style.background = '';
      delete el.dataset.active;
      if (icon) icon.style.color = '#9CA3AF';
      if (label) { label.style.color = '#6B7280'; label.style.fontWeight = '400'; }
    }
  });

  // Update sub-tab label
  var subAll = document.getElementById('sp-subtab-all');
  if (subAll) subAll.textContent = spSubtabLabel[tab] || '全部';

  // Reset sub-tab selection
  var subtabRow = document.getElementById('sp-subtab-row');
  if (subtabRow) {
    subtabRow.querySelectorAll('button').forEach(function(b) {
      b.style.color = '#6B7280';
      b.style.borderBottomColor = 'transparent';
      b.style.fontWeight = '400';
    });
    var firstBtn = subtabRow.querySelector('button');
    if (firstBtn) {
      firstBtn.style.color = '#2563EB';
      firstBtn.style.borderBottomColor = '#2563EB';
      firstBtn.style.fontWeight = '600';
    }
  }

  // Reset chip filters
  ['sp-chip-subject','sp-chip-usage'].forEach(function(rowId) {
    var row = document.getElementById(rowId);
    if (!row) return;
    row.querySelectorAll('button').forEach(function(b, i) {
      if (i === 0) {
        b.style.background = '#2563EB'; b.style.color = 'white'; b.style.border = 'none'; b.style.fontWeight = '600';
      } else {
        b.style.background = 'white'; b.style.color = '#374151'; b.style.border = '1.5px solid #E5E7EB'; b.style.fontWeight = '400';
      }
    });
  });

  // Reset active chip filters and render
  spActiveSubject = '全部';
  spActiveUsage = '全部';
  spRenderGrid(spSkuData[tab] || []);
}

var spActiveSubject = '全部';
var spActiveUsage = '全部';

function spChipSelect(btn, group) {
  var row = document.getElementById('sp-chip-' + group);
  if (!row) return;
  row.querySelectorAll('button').forEach(function(b) {
    b.style.background = 'white'; b.style.color = '#374151'; b.style.border = '1.5px solid #E5E7EB'; b.style.fontWeight = '400';
  });
  btn.style.background = '#2563EB'; btn.style.color = 'white'; btn.style.border = 'none'; btn.style.fontWeight = '600';
  if (group === 'subject') spActiveSubject = btn.textContent.trim();
  if (group === 'usage')   spActiveUsage   = btn.textContent.trim();
  spApplyFilters();
}

function spApplyFilters() {
  var all = spSkuData[spCurrentTab] || [];
  var filtered = all.filter(function(item) {
    var matchSubject = spActiveSubject === '全部' || (item.field && item.field === spActiveSubject);
    var matchUsage   = spActiveUsage   === '全部' || (item.tags && item.tags.some(function(t) { return t === spActiveUsage; }));
    return matchSubject && matchUsage;
  });
  spRenderGrid(filtered);
}

function spSubtabSelect(btn) {
  var row = document.getElementById('sp-subtab-row');
  if (!row) return;
  row.querySelectorAll('button').forEach(function(b) {
    b.style.color = '#6B7280'; b.style.borderBottomColor = 'transparent'; b.style.fontWeight = '400';
  });
  btn.style.color = '#2563EB'; btn.style.borderBottomColor = '#2563EB'; btn.style.fontWeight = '600';
}

function spRenderGrid(items) {
  var grid = document.getElementById('sp-sku-grid');
  if (!grid) return;
  grid.innerHTML = items.map(function(item) {
    var stars = '';
    for (var i = 0; i < 5; i++) {
      stars += '<i class="fa-solid fa-star" style="font-size:10px;color:' + (i < Math.floor(item.rating) ? '#F59E0B' : '#E5E7EB') + ';"></i>';
    }
    var badgeHtml = item.badge ? '<div style="position:absolute;top:10px;right:10px;font-size:10px;font-weight:700;color:white;background:' + (item.badge==='热门'?'#EF4444':item.badge==='新品'?'#10B981':'#F59E0B') + ';border-radius:100px;padding:2px 8px;">' + item.badge + '</div>' : '';
    var tagsHtml = item.tags.map(function(t) { return '<span style="font-size:10px;background:#F3F4F6;color:#6B7280;border-radius:4px;padding:2px 7px;">' + t + '</span>'; }).join('');
    return '<div style="background:white;border:1.5px solid #E5E7EB;border-radius:14px;overflow:hidden;cursor:pointer;transition:all 0.14s;display:flex;flex-direction:column;" onmouseover="this.style.borderColor=\'#93C5FD\';this.style.boxShadow=\'0 4px 16px rgba(37,99,235,0.1)\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.boxShadow=\'\';this.style.transform=\'\'">'
      + '<div style="position:relative;height:100px;' + item.bg + ';display:flex;align-items:center;justify-content:center;">'
      + badgeHtml
      + '<i class="fa-solid ' + item.icon + '" style="font-size:34px;color:' + item.color + ';opacity:0.85;"></i>'
      + '</div>'
      + '<div style="padding:12px 14px 14px;flex:1;display:flex;flex-direction:column;">'
      + '<div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:5px;">' + item.name + '</div>'
      + '<div style="font-size:11px;color:#9CA3AF;line-height:1.55;margin-bottom:8px;flex:1;">' + item.desc + '</div>'
      + '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:9px;">' + tagsHtml + '</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
      + '<div style="display:flex;align-items:center;gap:3px;">' + stars + '<span style="font-size:10.5px;color:#6B7280;margin-left:3px;">' + item.rating + '</span></div>'
      + '<span style="font-size:10px;color:#9CA3AF;">' + item.count + ' 次调用</span>'
      + '</div>'
      + '<button onclick="spRemoveItem(this,\'' + item.name + '\')" style="width:100%;background:#fff;color:#DC2626;border:1px solid #FCA5A5;border-radius:8px;padding:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:5px;transition:background 0.12s;" onmouseover="this.style.background=\'#FEF2F2\';this.style.borderColor=\'#F87171\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'#FCA5A5\'">'
      + '<i class="fa-solid fa-trash-can" style="font-size:11px;"></i>移除'
      + '</button>'
      + '</div>'
      + '</div>';
  }).join('');
}

function spRemoveItem(btn, name) {
  btn.innerHTML = '<i class="fa-solid fa-check" style="font-size:11px;"></i> 已移除';
  btn.style.background = '#F3F4F6';
  btn.style.color = '#9CA3AF';
  btn.style.borderColor = '#E5E7EB';
  btn.disabled = true;
}

// AI Recommendation
var spAiRecs = {
  '蛋白质': [
    { tab:'skills', name:'蛋白质结构解析', icon:'fa-dna', color:'#059669' },
    { tab:'spmodel', name:'ProteinLM 蛋白语言模型', icon:'fa-brain', color:'#2563EB' },
    { tab:'software', name:'GROMACS 分子动力学', icon:'fa-water', color:'#DB2777' }
  ],
  '材料': [
    { tab:'spmodel', name:'材料力学预测模型', icon:'fa-cube', color:'#7C3AED' },
    { tab:'software', name:'Materials Studio', icon:'fa-shapes', color:'#7C3AED' },
    { tab:'spoperator', name:'迭代优化算子', icon:'fa-rotate', color:'#0891B2' }
  ],
  '储层': [
    { tab:'spmodel', name:'地震波形解释模型', icon:'fa-earth-asia', color:'#EA580C' },
    { tab:'skills', name:'数据趋势分析', icon:'fa-chart-line', color:'#7C3AED' },
    { tab:'template', name:'数据驱动发现模版', icon:'fa-chart-line', color:'#0891B2' }
  ],
  'default': [
    { tab:'skills', name:'文献自动综述', icon:'fa-magnifying-glass-chart', color:'#2563EB' },
    { tab:'template', name:'文献综述自动化流程', icon:'fa-file-code', color:'#2563EB' },
    { tab:'software', name:'Origin Pro 数据分析', icon:'fa-chart-area', color:'#EA580C' }
  ]
};

// ══════════════════════════════════════════════════════════
//  ASSETS SECTION NAVIGATION
// ══════════════════════════════════════════════════════════

function switchSpTopTab(btn, panelId) {
  var tabBar = document.getElementById('sp-top-tabs');
  if (tabBar) tabBar.querySelectorAll('button').forEach(function(b) {
    b.style.color = '#6B7280'; b.style.borderBottomColor = 'transparent'; b.style.fontWeight = '400';
    delete b.dataset.active;
  });
  btn.style.color = '#1765e3'; btn.style.borderBottomColor = '#1765e3'; btn.style.fontWeight = '700';
  btn.dataset.active = '1';
  ['sp-panel-toolbox','sp-panel-model','sp-panel-skills','sp-panel-space','sp-panel-dataset'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.display = (id === panelId) ? 'flex' : 'none';
  });
  if (panelId === 'sp-panel-model')   tbRenderSimpleGrid('model-grid', spSkuData.spmodel);
  if (panelId === 'sp-panel-skills')  tbRenderSimpleGrid('skills-grid', spSkuData.skills);
  if (panelId === 'sp-panel-dataset') dsRenderDataset();
}

var tbActiveField = '全部';
var tbActiveType  = '全部工具';

function openAssetsSection(section) {
  ['assets-home','assets-toolbox','assets-model','assets-skills'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.display = (id === 'assets-' + section) ? 'flex' : 'none';
  });
  if (section === 'toolbox') tbInitToolbox();
  if (section === 'model')   tbRenderSimpleGrid('model-grid', spSkuData.spmodel);
  if (section === 'skills')  tbRenderSimpleGrid('skills-grid', spSkuData.skills);
}

function tbInitToolbox() {
  tbActiveField = '全部';
  tbActiveType  = '全部工具';
  tbFilterGrid();
}

// Combine all toolbox-relevant data pools
function tbAllItems() {
  var pools = { '全部工具': spSkuData.software.concat(spSkuData.spoperator).concat(spSkuData.dataset).concat(spSkuData.template).concat(spSkuData.compout),
    '科研软件': spSkuData.software, '算法库': spSkuData.spoperator, '数据集': spSkuData.dataset,
    '场景模版': spSkuData.template };
  return pools[tbActiveType] || pools['全部工具'];
}

function tbChipSelect(btn, group) {
  var row = document.getElementById('tb-chip-' + group);
  if (!row) return;
  row.querySelectorAll('button').forEach(function(b) {
    b.style.background = 'white'; b.style.color = '#374151'; b.style.border = '1.5px solid #E5E7EB'; b.style.fontWeight = '400';
  });
  btn.style.background = '#2563EB'; btn.style.color = 'white'; btn.style.border = 'none'; btn.style.fontWeight = '600';
  if (group === 'field') tbActiveField = btn.textContent.trim();
  if (group === 'type')  { tbActiveType = btn.textContent.trim(); }
  tbFilterGrid();
}

function tbTabSelect(btn) {
  var row = document.getElementById('tb-tab-row');
  if (!row) return;
  row.querySelectorAll('button').forEach(function(b) {
    b.style.color = '#6B7280'; b.style.fontWeight = '400'; b.style.borderBottomColor = 'transparent';
  });
  btn.style.color = '#1356c2'; btn.style.fontWeight = '600'; btn.style.borderBottomColor = '#2563EB';
}

function tbFilterGrid() {
  var q = (document.getElementById('tb-search-q') || {value:''}).value.toLowerCase();
  var items = tbAllItems().filter(function(item) {
    var matchField = tbActiveField === '全部' || (item.field && item.field === tbActiveField);
    var matchQ     = !q || item.name.toLowerCase().indexOf(q) !== -1 || item.desc.toLowerCase().indexOf(q) !== -1;
    return matchField && matchQ;
  });
  var hot = items.filter(function(i) { return i.badge === '热门' || i.badge === '推荐'; });
  var countEl = document.getElementById('tb-count');
  if (countEl) countEl.textContent = '共 ' + items.length + ' 个工具';
  var hotSec = document.getElementById('tb-hot-section');
  if (hotSec) hotSec.style.display = (hot.length && !q) ? 'block' : 'none';
  tbRenderHot(hot.slice(0,6));
  tbRenderMainGrid(items);
}

function tbRenderHot(items) {
  var grid = document.getElementById('tb-hot-grid');
  if (!grid) return;
  grid.innerHTML = items.map(function(item) {
    var licBadge = item.license ? '<span style="font-size:10px;background:' + (item.license==='开源'?'#ECFDF5':'item.license==="商业"?#FEF3C7:#EFF6FF') + ';color:' + (item.license==='开源'?'#065F46':'item.license==="商业"?#92400E:#1D4ED8') + ';border-radius:4px;padding:1px 7px;margin-left:4px;">' + item.license + '</span>' : '';
    return '<div style="background:white;border:1px solid #D5DFEB;border-radius:8px;display:grid;grid-template-columns:40px 1fr;column-gap:12px;padding:14px 16px;cursor:pointer;transition:box-shadow .15s,border-color .15s;" onmouseover="this.style.borderColor=\'#C8D9F1\';this.style.boxShadow=\'0 8px 22px rgba(30,80,150,.07)\'" onmouseout="this.style.borderColor=\'#D5DFEB\';this.style.boxShadow=\'\'">'
      + '<div style="width:40px;height:40px;border-radius:9px;background:' + item.bg + ';display:flex;align-items:center;justify-content:center;"><i class="fa-solid ' + item.icon + '" style="font-size:18px;color:' + item.color + ';"></i></div>'
      + '<div style="min-width:0;">'
      + '<div style="font-size:14px;font-weight:500;color:#15233B;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + item.name + licBadge + '</div>'
      + '<div style="font-size:11.5px;color:#6B7280;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + item.desc + '</div>'
      + '<div style="display:flex;gap:5px;margin-top:7px;flex-wrap:wrap;">' + item.tags.map(function(t){return '<span style="font-size:11px;background:#F1F4F8;color:#637188;border-radius:3px;padding:1px 6px;">'+t+'</span>';}).join('') + '</div>'
      + '</div>'
      + '</div>';
  }).join('');
}

function tbRenderMainGrid(items) {
  var grid = document.getElementById('tb-main-grid');
  if (!grid) return;
  grid.innerHTML = items.map(function(item) {
    var stars = '';
    for (var i = 0; i < 5; i++) stars += '<i class="fa-solid fa-star" style="font-size:10px;color:' + (i < Math.floor(item.rating) ? '#F59E0B' : '#E5E7EB') + ';"></i>';
    var licBg  = {开源:'#ECFDF5',商业:'#FEF3C7','学术免费':'#EFF6FF'}[item.license] || '#F3F4F6';
    var licCol = {开源:'#065F46',商业:'#92400E','学术免费':'#1D4ED8'}[item.license] || '#6B7280';
    var badgeHtml = item.badge ? '<div style="position:absolute;top:9px;right:9px;font-size:10px;font-weight:700;color:white;background:' + (item.badge==='热门'?'#EF4444':item.badge==='新品'?'#10B981':'#F59E0B') + ';border-radius:100px;padding:2px 8px;">' + item.badge + '</div>' : '';
    var licHtml = item.license ? '<span style="font-size:10px;background:'+licBg+';color:'+licCol+';border-radius:4px;padding:1px 7px;">'+item.license+'</span>' : '';
    return '<div style="background:white;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;cursor:pointer;transition:all 0.14s;display:flex;flex-direction:column;" onmouseover="this.style.borderColor=\'#C8D9F1\';this.style.boxShadow=\'0 6px 20px rgba(30,80,150,.09)\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.boxShadow=\'\';this.style.transform=\'\'">'
      + '<div style="position:relative;height:90px;' + item.bg + ';display:flex;align-items:center;justify-content:center;">'
      + badgeHtml + '<i class="fa-solid ' + item.icon + '" style="font-size:30px;color:' + item.color + ';opacity:0.85;"></i></div>'
      + '<div style="padding:12px 14px 14px;flex:1;display:flex;flex-direction:column;">'
      + '<div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:4px;display:flex;align-items:center;gap:6px;">' + item.name + licHtml + '</div>'
      + '<div style="font-size:11px;color:#9CA3AF;line-height:1.55;margin-bottom:7px;flex:1;">' + item.desc + '</div>'
      + '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">' + item.tags.map(function(t){return '<span style="font-size:10px;background:#F3F4F6;color:#6B7280;border-radius:4px;padding:2px 7px;">'+t+'</span>';}).join('') + '</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;">'
      + '<div style="display:flex;align-items:center;gap:2px;">' + stars + '<span style="font-size:10.5px;color:#6B7280;margin-left:2px;">' + item.rating + '</span></div>'
      + '<span style="font-size:10px;color:#9CA3AF;">' + item.count + ' 次调用</span></div>'
      + '<button onclick="spRemoveItem(this,\'' + item.name + '\')" style="width:100%;background:#fff;color:#DC2626;border:1px solid #FCA5A5;border-radius:7px;padding:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:5px;transition:background 0.12s;" onmouseover="this.style.background=\'#FEF2F2\';this.style.borderColor=\'#F87171\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'#FCA5A5\'">'
      + '<i class="fa-solid fa-trash-can" style="font-size:11px;"></i>移除</button>'
      + '</div></div>';
  }).join('');
}

function tbRenderSimpleGrid(gridId, items) {
  var grid = document.getElementById(gridId);
  if (!grid || !items) return;
  grid.innerHTML = items.map(function(item) {
    var stars = '';
    for (var i = 0; i < 5; i++) stars += '<i class="fa-solid fa-star" style="font-size:10px;color:' + (i < Math.floor(item.rating) ? '#F59E0B' : '#E5E7EB') + ';"></i>';
    var badgeHtml = item.badge ? '<div style="position:absolute;top:9px;right:9px;font-size:10px;font-weight:700;color:white;background:' + (item.badge==='热门'?'#EF4444':item.badge==='新品'?'#10B981':'#F59E0B') + ';border-radius:100px;padding:2px 8px;">' + item.badge + '</div>' : '';
    return '<div style="background:white;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;cursor:pointer;transition:all 0.14s;display:flex;flex-direction:column;" onmouseover="this.style.borderColor=\'#C8D9F1\';this.style.boxShadow=\'0 6px 20px rgba(30,80,150,.09)\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.boxShadow=\'\';this.style.transform=\'\'">'
      + '<div style="position:relative;height:90px;' + item.bg + ';display:flex;align-items:center;justify-content:center;">'
      + badgeHtml + '<i class="fa-solid ' + item.icon + '" style="font-size:30px;color:' + item.color + ';opacity:0.85;"></i></div>'
      + '<div style="padding:12px 14px 14px;flex:1;display:flex;flex-direction:column;">'
      + '<div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:4px;">' + item.name + '</div>'
      + '<div style="font-size:11px;color:#9CA3AF;line-height:1.55;margin-bottom:7px;flex:1;">' + item.desc + '</div>'
      + '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">' + item.tags.map(function(t){return '<span style="font-size:10px;background:#F3F4F6;color:#6B7280;border-radius:4px;padding:2px 7px;">'+t+'</span>';}).join('') + '</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;">'
      + '<div style="display:flex;align-items:center;gap:2px;">' + stars + '<span style="font-size:10.5px;color:#6B7280;margin-left:2px;">' + item.rating + '</span></div>'
      + '<span style="font-size:10px;color:#9CA3AF;">' + item.count + ' 次调用</span></div>'
      + '<button onclick="spRemoveItem(this,\'' + item.name + '\')" style="width:100%;background:#fff;color:#DC2626;border:1px solid #FCA5A5;border-radius:7px;padding:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:5px;" onmouseover="this.style.background=\'#FEF2F2\';this.style.borderColor=\'#F87171\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'#FCA5A5\'">'
      + '<i class="fa-solid fa-trash-can" style="font-size:11px;"></i>移除</button>'
      + '</div></div>';
  }).join('');
}

function spAiRecommend() {
  var text = document.getElementById('sp-ai-input').value.trim();
  if (!text) { document.getElementById('sp-ai-input').focus(); return; }
  var recs = spAiRecs.default;
  Object.keys(spAiRecs).forEach(function(k) {
    if (k !== 'default' && text.indexOf(k) !== -1) recs = spAiRecs[k];
  });
  var recsEl = document.getElementById('sp-ai-recs');
  recsEl.innerHTML = recs.map(function(r) {
    return '<div style="display:flex;align-items:center;gap:10px;background:#F8FAFF;border:1.5px solid #DBEAFE;border-radius:10px;padding:10px 14px;cursor:pointer;min-width:200px;" onmouseover="this.style.borderColor=\'#93C5FD\'" onmouseout="this.style.borderColor=\'#DBEAFE\'">'
      + '<div style="width:36px;height:36px;border-radius:9px;background:white;border:1.5px solid #E5E7EB;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
      + '<i class="fa-solid ' + r.icon + '" style="font-size:15px;color:' + r.color + ';"></i></div>'
      + '<div><div style="font-size:12.5px;font-weight:600;color:#1D4ED8;">' + r.name + '</div>'
      + '<div style="font-size:10.5px;color:#9CA3AF;margin-top:1px;">来自 ' + r.tab + ' 分类</div></div>'
      + '</div>';
  }).join('');
  document.getElementById('sp-ai-result').style.display = 'block';
}

function spAiAddAll() {
  document.getElementById('sp-ai-result').style.display = 'none';
  document.getElementById('sp-ai-input').value = '';
  alert('已将推荐工具套餐全部添加到你的科研空间 ✓');
}

function switchTbTab(btn, panelId) {
  // Toggle button states
  btn.closest('div').querySelectorAll('.tb-tab').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
  // Toggle panels
  ['tb-software','tb-operator','tb-tool','tb-template'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('active', id === panelId);
  });
}

// ══════════════════════════════════════════════════════════
//  KNOWLEDGE CENTER INTERACTIONS
// ══════════════════════════════════════════════════════════

// ── Tab switcher
function switchKnTab(tab) {
  ['home','lib'].forEach(t => {
    document.getElementById('kntab-' + t).classList.toggle('active', t === tab);
    document.getElementById('kntab-btn-' + t).classList.toggle('active', t === tab);
  });
}

// ── Toggle classification tree group
function toggleGroup(grpId) {
  const grp = document.getElementById(grpId);
  const item = grp.querySelector('.kn-group-item');
  grp.classList.toggle('open');
  item.classList.toggle('open', grp.classList.contains('open'));
}

// ── Sub-category data
const subcatData = {
  geo: {
    name: '地球科学', graphKey: 'geo',
    color: '#2563EB', bg: '#DBEAFE',
    desc: '涵盖储层地质、地球化学、沉积学、油气地质等方向，重点关注非常规油气储层特性研究',
    subs: [
      { name: '页岩气储层', count: 67, graphKey: 'geo-shale', desc: '非常规储层孔隙结构与渗流特性研究' },
      { name: '沉积学',   count: 52, graphKey: 'geo-sed',   desc: '碎屑岩与碳酸盐岩沉积体系分析' },
      { name: '地球化学', count: 48, graphKey: 'geo-chem',  desc: '有机地球化学及元素地球化学' },
      { name: '油气地质', count: 76, graphKey: 'geo-oil',   desc: '油气成藏机理与资源评价' }
    ]
  },
  bio: {
    name: '合成生物学', graphKey: 'bio',
    color: '#16A34A', bg: '#D1FAE5',
    desc: '代谢工程、基因编辑与蛋白质工程方向，聚焦工业生物技术应用研究',
    subs: [
      { name: '代谢工程',   count: 74, graphKey: 'bio-meta', desc: '代谢通路改造与产物优化研究' },
      { name: '基因编辑',   count: 65, graphKey: 'bio-gene', desc: 'CRISPR 及新型基因编辑技术进展' },
      { name: '蛋白质工程', count: 50, graphKey: 'bio-prot', desc: '蛋白质结构预测与功能改造' }
    ]
  },
  mat: {
    name: '材料科学', graphKey: 'mat',
    color: '#7C3AED', bg: '#F3E8FF',
    desc: '聚合物材料、催化材料、纳米材料前沿方向，重点跟踪高性能功能材料与工程化应用',
    subs: [
      { name: '聚合物材料', count: 89,  graphKey: 'mat-poly', desc: '高性能聚合物合成与应用研究' },
      { name: '催化材料',   count: 112, graphKey: 'mat-cat',  desc: '多相催化与光催化新材料体系' },
      { name: '纳米材料',   count: 111, graphKey: 'mat-nano', desc: '纳米结构制备与功能化研究' }
    ]
  }
};

let currentCatKey = null;

// ── Navigate into a top-level category → show folder cards
function showSubcatView(catKey) {
  var cat = subcatData[catKey];
  if (!cat) return;
  currentCatKey = catKey;

  document.getElementById('lib-overview').style.display = 'none';
  document.getElementById('lib-paper-view').style.display = 'none';
  var sv = document.getElementById('lib-subcat-view');
  sv.style.display = 'flex';

  document.getElementById('subcat-breadcrumb').textContent = cat.name;
  document.getElementById('subcat-desc').textContent = cat.desc;
  var gb = document.getElementById('subcat-graph-btn');
  gb.onclick = function(e) { openGraph(e, cat.graphKey); };

  // Highlight sidebar item
  document.querySelectorAll('.kn-group-item').forEach(function(el) { el.classList.remove('active'); });
  var grp = document.getElementById('grp-' + catKey);
  if (grp) grp.querySelector('.kn-group-item').classList.add('active');

  // Build folder cards
  var grid = document.getElementById('subcat-folder-grid');
  grid.innerHTML = '';
  cat.subs.forEach(function(sub) {
    var card = document.createElement('div');
    card.className = 'kn-folder-card';
    card.innerHTML =
      '<button class="kn-folder-graph-btn" onclick="openGraph(event,\'' + sub.graphKey + '\')">' +
        '<i class="fa-solid fa-diagram-project" style="font-size:9px;"></i>图谱' +
      '</button>' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
        '<div style="width:40px;height:40px;border-radius:12px;background:' + cat.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
          '<i class="fa-solid fa-folder-open" style="color:' + cat.color + ';font-size:18px;"></i>' +
        '</div>' +
        '<div>' +
          '<div style="font-size:14px;font-weight:600;color:#111827;">' + sub.name + '</div>' +
          '<div style="font-size:11px;color:#9CA3AF;margin-top:2px;">' + sub.count + ' 篇文献</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:12px;color:#6B7280;line-height:1.55;">' + sub.desc + '</div>' +
      '<div style="margin-top:14px;display:flex;align-items:center;justify-content:space-between;">' +
        '<span style="font-size:11px;color:#9CA3AF;"><i class="fa-solid fa-clock" style="font-size:10px;margin-right:4px;"></i>上次更新 3 天前</span>' +
        '<span style="font-size:11px;color:' + cat.color + ';font-weight:500;">进入文献列表 <i class="fa-solid fa-arrow-right" style="font-size:10px;"></i></span>' +
      '</div>';
    card.addEventListener('click', (function(s, c) {
      return function(e) {
        if (e.target.closest('.kn-folder-graph-btn')) return;
        showPaperList(s.name, c.name, s.count);
      };
    })(sub, cat));
    grid.appendChild(card);
  });
}

// ── Show paper list for subcategory
function showPaperList(subcat, category, count) {
  document.getElementById('lib-overview').style.display = 'none';
  document.getElementById('lib-subcat-view').style.display = 'none';
  var pv = document.getElementById('lib-paper-view');
  pv.style.display = 'flex';
  document.getElementById('plist-breadcrumb').textContent = subcat;
  document.getElementById('plist-count').textContent = '(' + count + ' 篇)';

  // Wire graph button for this subcategory
  var gb = document.getElementById('plist-graph-btn');
  var typeMap = { '地球科学': 'geo', '合成生物学': 'bio', '材料科学': 'mat' };
  var gt = typeMap[category] || 'geo';
  gb.onclick = function(e) { openGraph(e, gt); };

  // Wire back button → return to subcat view if we came from one
  var backBtn = pv.querySelector('.kn-back-btn');
  if (backBtn) {
    backBtn.onclick = function() {
      if (currentCatKey) showSubcatView(currentCatKey);
      else showLibOverview();
    };
  }
}

// ── Return to overview
function showLibOverview() {
  document.getElementById('lib-paper-view').style.display = 'none';
  document.getElementById('lib-subcat-view').style.display = 'none';
  document.getElementById('lib-overview').style.display = '';
  currentCatKey = null;
  document.querySelectorAll('.kn-group-item').forEach(function(el) { el.classList.remove('active'); });
}

// ── Select a paper row
const paperData = [
  {
    title: '页岩气储层物性分析与评价方法研究',
    authors: '张明, 王磊, 陈伟等', journal: 'Nature Energy', year: '2024',
    doi: '10.1038/nenergy.2024.xxx', cite: '142 次引用',
  },
  {
    title: '低渗透储层敏感性实验综述及机理分析',
    authors: '李华, 王磊等', journal: 'Fuel', year: '2023',
    doi: '10.1016/j.fuel.2023.xxx', cite: '89 次引用',
  },
  {
    title: '页岩气吸附-解吸特性的分子动力学模拟研究',
    authors: '王强等', journal: 'SPE Journal', year: '2024',
    doi: '10.2118/xxx', cite: '56 次引用',
  },
  {
    title: '基于核磁共振的页岩储层孔隙度测量新方法',
    authors: '陈伟等', journal: 'Journal of Petroleum Science', year: '2023',
    doi: '10.1016/j.petrol.2023.xxx', cite: '34 次引用',
  },
  {
    title: '储层岩石力学特性与压裂可行性评价',
    authors: '刘明等', journal: 'Rock Mechanics', year: '2024',
    doi: '10.1007/rock.2024.xxx', cite: '28 次引用',
  },
];

var readerOrigin = 'lib';   // 'lib' = 知识库列表；'kspace' = 我的知识空间任务文献

function fillReader(info) {
  document.getElementById('reader-title').textContent   = info.title;
  document.getElementById('reader-authors').textContent = info.authors || '—';
  document.getElementById('reader-journal').textContent = info.journal || '—';
  document.getElementById('reader-year').textContent    = info.year || '';
  document.getElementById('reader-doi').textContent     = info.doi || '—';
  document.getElementById('reader-cite').textContent    = info.cite || '—';
  const reader = document.getElementById('lib-paper-reader');
  reader.style.display = 'flex';
  // Reset to 解析原文 tab
  switchReaderTab(document.getElementById('rtab-btn-parse'), 'parse');
  const body = reader.querySelector('.reader-body');
  if (body) body.scrollTop = 0;
}

function selectPaper(el, idx) {
  // Highlight the row
  document.querySelectorAll('.kn-paper-item').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  readerOrigin = 'lib';
  fillReader(paperData[idx] || paperData[0]);
}

// 我的知识空间 → 任务文献列表 → 点击文献进入解析原文（复用同一 reader）
function openKspacePaper(idx) {
  var topic = topicDB[currentTopicKey];
  if (!topic) return;
  var task = topic.tasks[currentTaskIdx];
  if (!task) return;
  var p = task.paperList[idx];
  if (!p) return;
  readerOrigin = 'kspace';
  fillReader({
    title: p.title, authors: p.authors, journal: p.journal, year: p.year,
    doi: p.doi || ('10.xxxx/' + (p.journal || 'doc').slice(0,3).toLowerCase() + '.' + (p.year || '')),
    cite: (p.cite != null ? p.cite : Math.floor(20 + Math.random()*120)) + ' 次引用'
  });
}

function closeReader() {
  document.getElementById('lib-paper-reader').style.display = 'none';
  document.querySelectorAll('.kn-paper-item').forEach(p => p.classList.remove('selected'));
  if (readerOrigin === 'lib') {
    document.getElementById('lib-paper-view').style.display = 'flex';
  }
  // origin 'kspace': 覆盖层关闭后，下方任务文献面板保持原样，无需处理
}

// ── Reader tab switch
function switchReaderTab(btn, tabId) {
  document.querySelectorAll('.reader-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  ['parse','meta','guide','evidence','lab','mindmap'].forEach(t => {
    const el = document.getElementById('rtab-' + t);
    if (el) el.classList.toggle('active', t === tabId);
  });
  // Side-effects when switching to specific tabs
  if (tabId === 'evidence') selectConclusion(0);
  if (tabId === 'mindmap')  syncMmTitle && syncMmTitle();
}

// ── Reader mode toggle (原文/翻译/编辑)
function setReaderMode(btn) {
  document.querySelectorAll('.reader-mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── TOC panel toggle
function toggleToc() {
  const toc = document.getElementById('reader-toc-panel');
  if (toc) toc.style.display = toc.style.display === 'none' ? '' : 'none';
}

// ══════════════════════════════════════════════════════════
//  COMPARE MODAL
// ══════════════════════════════════════════════════════════

function openCompare() {
  // Sync the comparison panel with the current paper's title/authors
  const t = document.getElementById('reader-title');
  const a = document.getElementById('reader-authors');
  const j = document.getElementById('reader-journal');
  const y = document.getElementById('reader-year');
  const d = document.getElementById('reader-doi');
  const c = document.getElementById('reader-cite');
  if (t) document.getElementById('cp-title').textContent    = t.textContent;
  if (a) document.getElementById('cp-authors').textContent  = a.textContent;
  if (j && y && d && c) {
    document.getElementById('cp-source').textContent =
      j.textContent + ' · ' + y.textContent + ' · DOI: ' + d.textContent + ' · 引用 ' + c.textContent;
  }
  document.getElementById('compare-modal').classList.add('open');
}

function closeCompare() {
  document.getElementById('compare-modal').classList.remove('open');
}

// ══════════════════════════════════════════════════════════
//  EVIDENCE GRAPH: Conclusion switcher
// ══════════════════════════════════════════════════════════

const conclusionData = [
  {
    label: 'C1 · 作者结论',
    title: '页岩气储层孔隙度-渗透率耦合预测模型精度优于传统方法',
    desc: '新建模型平均相对误差 4.8%，优于传统 Kozeny-Carman 公式（误差 12.3%），可靠性经 12 块样品交叉验证证实。',
    ev: [
      {
        ico: 'fa-chart-line', icoBg: 'bg-blue-100', icoColor: 'text-blue-500',
        title: '多尺度孔隙表征与渗透率对比实验',
        desc: '对 12 块岩心同时进行 CT 扫描、压汞测试和 GCMC 模拟，渗透率实测值与新模型预测值平均偏差 4.8%；与 Kozeny-Carman 对比，新模型误差降低 7.5%。',
        link: '结果与讨论 · 渗透率预测对比 · 点击查看',
      },
      {
        ico: 'fa-flask', icoBg: 'bg-indigo-100', icoColor: 'text-indigo-500',
        title: '交叉验证集渗透率预测测试',
        desc: '留出 4 块样品作为验证集，模型预测相对误差均低于 5%，展示了良好的泛化能力；验证集包含不同岩性和埋深样品。',
        link: '结论 · 模型验证 · 点击查看',
      },
    ],
  },
  {
    label: 'C2 · 作者结论',
    title: '有机质孔是储层孔隙的主要贡献者，占比超过 60%',
    desc: '纳米 CT 三维重建与 FIB-SEM 图像定量分析共同证实，有机质孔占总孔体积 63.2%，远超粒间孔（21.5%）和微裂缝（15.3%）。',
    ev: [
      {
        ico: 'fa-microscope', icoBg: 'bg-purple-100', icoColor: 'text-purple-500',
        title: 'FIB-SEM 三维孔隙类型定量分析',
        desc: '对 3 块代表性样品进行 FIB-SEM 连续切片重建，通过图像分割算法（Otsu）统计各类型孔隙体积占比，有机质孔占比为 63.2 ± 4.8%。',
        link: '结果与讨论 · 孔隙类型分布 · 点击查看',
      },
      {
        ico: 'fa-chart-bar', icoBg: 'bg-green-100', icoColor: 'text-green-500',
        title: 'GCMC 模拟有机孔 CH₄ 吸附量测定',
        desc: '分子模拟结果表明，在 80℃/30 MPa 条件下，有机孔中 CH₄ 吸附量（0.24 mmol/g）是无机孔（0.04 mmol/g）的 6 倍，进一步证实有机孔的储气主导地位。',
        link: '结果与讨论 · 吸附特性 · 点击查看',
      },
    ],
  },
  {
    label: 'C3 · 作者结论',
    title: '孔隙连通率影响渗流行为，低连通区域扩散效应显著',
    desc: 'CT 三维重建显示孔隙连通率为 78.5%，孤立孔（21.5%）中气体输运由扩散机制主导，Knudsen 扩散系数较高连通区域高 3–5 倍。',
    ev: [
      {
        ico: 'fa-arrows-alt', icoBg: 'bg-orange-100', icoColor: 'text-orange-500',
        title: '孔隙连通性三维重建与渗流路径分析',
        desc: 'CT 扫描数据经最大球算法分析，连通孔网络渗透率贡献占 94%，孤立孔区域气体输运完全依赖扩散；Knudsen 扩散系数测定结果支持该结论。',
        link: '结果与讨论 · 孔隙连通性 · 点击查看',
      },
    ],
  },
];

function selectConclusion(idx) {
  // Update sidebar active state
  for (let i = 0; i < 3; i++) {
    document.getElementById('ev-c-' + i).classList.toggle('active', i === idx);
  }
  const d = conclusionData[idx];
  document.getElementById('ev-cn-clabel').textContent = d.label;
  document.getElementById('ev-cn-title').textContent  = d.title;
  document.getElementById('ev-cn-desc').textContent   = d.desc;

  // Rebuild evidence cards
  const row = document.getElementById('ev-evidence-row');
  row.innerHTML = '';
  d.ev.forEach(function(ev, ei) {
    const card = document.createElement('div');
    card.className = 'ev-ev-card';
    card.innerHTML = `
      <div class="ev-ev-card-hd">
        <div class="flex items-center gap-2 flex-1">
          <div class="ev-ev-ico ${ev.icoBg}"><i class="fa-solid ${ev.ico} ${ev.icoColor}"></i></div>
          <div class="ev-ev-title">${ev.title}</div>
        </div>
        <span class="ev-support-badge"><i class="fa-solid fa-check text-xs"></i>直接支持</span>
      </div>
      <div class="ev-ev-desc">${ev.desc}</div>
      <div class="ev-ev-link">
        <i class="fa-regular fa-file-lines text-xs"></i>
        <span>${ev.link}</span>
        <i class="fa-solid fa-chevron-right text-xs"></i>
      </div>`;
    row.appendChild(card);
  });

  // Adjust connector dots to match evidence count
  const ch = document.getElementById('ev-connector-h');
  ch.innerHTML = '';
  d.ev.forEach(function() {
    const dot = document.createElement('div');
    dot.className = 'ev-connector-dot';
    ch.appendChild(dot);
  });
}

// ══════════════════════════════════════════════════════════
//  MINDMAP: toggle/expand branches
// ══════════════════════════════════════════════════════════

function mmToggleBranch(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? '' : 'none';
}

function mmExpandAll() {
  ['mm-b1','mm-b2','mm-b3','mm-b4','mm-b5'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });
}

// Sync mm-root-title with current paper
function syncMmTitle() {
  const t = document.getElementById('reader-title');
  const mm = document.getElementById('mm-root-title');
  if (t && mm) mm.textContent = t.textContent;
}

// ══════════════════════════════════════════════════════════
//  KNOWLEDGE GRAPH MODAL
// ══════════════════════════════════════════════════════════

const graphConfigs = {
  geo: {
    title: '地球科学 · 知识图谱',
    subtitle: '243 篇文献 · 148 个节点 · 312 条关系',
    icoClass: 'fa-solid fa-earth-asia text-blue-600 text-xs',
    icoBg: '#DBEAFE',
  },
  bio: {
    title: '合成生物学 · 知识图谱',
    subtitle: '189 篇文献 · 112 个节点 · 278 条关系',
    icoClass: 'fa-solid fa-dna text-green-600 text-xs',
    icoBg: '#D1FAE5',
  },
  mat: {
    title: '材料科学 · 知识图谱',
    subtitle: '312 篇文献 · 195 个节点 · 431 条关系',
    icoClass: 'fa-solid fa-atom text-purple-600 text-xs',
    icoBg: '#F3E8FF',
  },
  'topic-geo': {
    title: '页岩气储层评价课题 · 图谱',
    subtitle: '28 篇文献 · 52 个节点 · 89 条关系',
    icoClass: 'fa-solid fa-microscope text-blue-600 text-xs',
    icoBg: '#DBEAFE',
  },
  'topic-mat': {
    title: '柔性聚合物材料研究 · 图谱',
    subtitle: '45 篇文献 · 78 个节点 · 131 条关系',
    icoClass: 'fa-solid fa-microscope text-purple-600 text-xs',
    icoBg: '#F3E8FF',
  },
  'topic-bio': {
    title: '催化剂优化项目 · 图谱',
    subtitle: '33 篇文献 · 61 个节点 · 104 条关系',
    icoClass: 'fa-solid fa-microscope text-green-600 text-xs',
    icoBg: '#D1FAE5',
  },
};

function openGraph(event, type) {
  if (event) event.stopPropagation();
  const cfg = graphConfigs[type] || graphConfigs.geo;
  document.getElementById('graph-title').textContent = cfg.title;
  document.getElementById('graph-subtitle').textContent = cfg.subtitle;
  document.getElementById('graph-ico').style.background = cfg.icoBg;
  document.getElementById('graph-ico-i').className = cfg.icoClass;
  document.getElementById('graph-modal').classList.add('open');
  document.getElementById('graph-node-info').classList.remove('show');
}

function closeGraph() {
  document.getElementById('graph-modal').classList.remove('open');
}

function closeGraphOnBackdrop(e) {
  if (e.target === document.getElementById('graph-modal')) closeGraph();
}

// ── Graph node hover / click
function gnodeClick(el) {
  const name  = el.dataset.name  || '—';
  const count = el.dataset.count || '—';
  const cat   = el.dataset.cat   || '—';
  const type  = { core:'大类', concept:'子分类', paper:'论文主题' }[el.dataset.type] || '—';

  document.getElementById('gni-title').textContent = name;
  document.getElementById('gni-type').textContent  = type;
  document.getElementById('gni-count').textContent = count + ' 篇';
  document.getElementById('gni-cat').textContent   = cat || '—';
  document.getElementById('graph-node-info').classList.add('show');

  // Highlight connected edges
  document.querySelectorAll('.gnode').forEach(n => n.classList.toggle('dim', n !== el));
}

// ── Graph node un-dim on canvas click
document.addEventListener('DOMContentLoaded', () => {
  if (typeof knRenderHomeLists === 'function') knRenderHomeLists();
  const canvas = document.getElementById('graph-canvas');
  if (canvas) {
    canvas.addEventListener('click', function(e) {
      if (e.target.closest('.gnode') || e.target.closest('#graph-node-info')) return;
      document.querySelectorAll('.gnode').forEach(n => n.classList.remove('dim'));
      document.getElementById('graph-node-info').classList.remove('show');
    });
  }
});

// ══════════════════════════════════════════════════════════
//  EXTERNAL LITERATURE SEARCH
// ══════════════════════════════════════════════════════════

// ── 统一检索：数据
var KN_SEARCH_SCOPE = new Set();

var KN_RECENT = [
  { q: '溶聚丁苯橡胶 配方 滚动阻力 优化', time: '2 小时前', n: 8 },
  { q: '页岩气储层 渗透率 预测 机器学习', time: '昨天', n: 12 },
  { q: '催化剂 活性位点 反应性能 关联', time: '3 天前', n: 6 },
  { q: 'CRISPR/Cas9 工业微生物 应用', time: '上周', n: 15 }
];

var KN_RECMD = [
  { tag: '文献', tagColor: '#2563EB', tagBg: '#DBEAFE', title: '溶聚丁苯橡胶分子量分布对滚动阻力的影响机制', src: 'Polymer · 2026' },
  { tag: '专利', tagColor: '#DC2626', tagBg: '#FEE2E2', title: '一种低滚动阻力高抗湿滑性能轮胎胶料及其制备方法', src: 'CN2026 · 授权' },
  { tag: '数据集', tagColor: '#059669', tagBg: '#D1FAE5', title: 'SSBR 配方-性能实验数据集（3120 条）', src: '内部实验 · CSV' },
  { tag: '标准', tagColor: '#7C3AED', tagBg: '#EDE9FE', title: 'GB/T 8656 合成橡胶溶聚丁苯橡胶检验规范', src: '国家标准 · 现行' }
];

var KN_SEARCH_RESULTS = [
  { pdf: true, title: 'Effect of molecular weight distribution of SSBR on rolling resistance of tire tread compounds', abstract: '本文系统研究了溶聚丁苯橡胶（SSBR）分子量分布对轮胎胎面胶滚动阻力的影响。通过调控聚合工艺获得不同 Mw/Mn 的样品，结合动态力学分析发现，窄分布 SSBR 在 60°C 下 tanδ 显著降低，滚动阻力下降约 12%…', authors: 'Zhang Y., Li H., Wang M.', journal: 'Polymer', year: '2026', cite: 42 },
  { pdf: true, title: '基于机器学习的橡胶配方-性能预测模型构建与验证', abstract: '针对橡胶配方开发周期长、试错成本高的问题，本文构建了融合梯度提升与图神经网络的配方-性能预测模型。在 3120 条实验数据上，拉伸强度预测 R² 达 0.93，滚动阻力预测误差 ±4.8%…', authors: '陈磊, 刘颖, 张伟', journal: '高分子材料科学与工程', year: '2026', cite: 18 },
  { pdf: true, title: 'Silica dispersion and filler-rubber interaction in green tire compounds', abstract: '综述了白炭黑在绿色轮胎胶料中的分散行为及填料-橡胶界面相互作用机制，讨论了硅烷偶联剂用量、混炼工艺对补强效率与滞后损失的影响…', authors: 'Müller K., Schmidt A.', journal: 'Rubber Chem. Technol.', year: '2025', cite: 67 },
  { pdf: false, title: '溶聚丁苯橡胶末端改性提升抗湿滑性能的研究进展', abstract: '本文评述了 SSBR 链端官能化（氨基、烷氧基硅烷等）改善填料分散、提升抗湿滑性能的最新进展，并对比了不同改性策略的工业化可行性…', authors: '王敏, 赵强', journal: '合成橡胶工业', year: '2026', cite: 9 },
  { pdf: true, title: 'Machine learning accelerated design of low rolling resistance elastomer formulations', abstract: 'We present an active-learning framework that couples Bayesian optimization with a surrogate model to accelerate the discovery of elastomer formulations with reduced rolling resistance while maintaining wet grip…', authors: 'Tanaka R., Park S., Gupta N.', journal: 'npj Computational Materials', year: '2026', cite: 31 }
];

function knSearchIcon(pdf) {
  return pdf
    ? '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:700;color:#059669;background:#D1FAE5;border-radius:6px;padding:3px 9px;"><i class="fa-solid fa-file-pdf" style="font-size:11px;"></i>PDF可获取</span>'
    : '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:700;color:#9CA3AF;background:#F3F4F6;border-radius:6px;padding:3px 9px;"><i class="fa-solid fa-file" style="font-size:11px;"></i>暂无PDF</span>';
}

function knResultCard(r, idx) {
  var esc = (r.title || '').replace(/'/g, "\\'");
  return '<div class="kn-res-card" style="background:#fff;border:1px solid #EAEFF7;border-radius:14px;padding:18px 20px;margin-bottom:14px;">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:9px;">' + knSearchIcon(r.pdf)
    + '<span style="font-size:12px;color:#B6BECB;">#' + (idx + 1) + '</span></div>'
    + '<div style="font-size:16px;font-weight:700;color:#111827;line-height:1.5;margin-bottom:8px;">' + r.title + '</div>'
    + '<div style="font-size:13.5px;color:#5B6472;line-height:1.7;">' + r.abstract
    + ' <a onclick="wbToast&&wbToast(\'展开全文摘要\')" style="color:#2563EB;cursor:pointer;font-weight:600;">展开</a></div>'
    + '<div style="display:flex;align-items:center;gap:14px;margin-top:12px;font-size:12.5px;color:#8A94A6;">'
    + '<span>' + r.authors + '</span><span style="color:#D1D5DB;">·</span>'
    + '<span style="font-style:italic;">' + r.journal + '</span><span style="color:#D1D5DB;">·</span>'
    + '<span>' + r.year + '</span><span style="color:#D1D5DB;">·</span>'
    + '<span style="display:inline-flex;align-items:center;gap:4px;"><i class="fa-solid fa-quote-right" style="font-size:10px;"></i>' + r.cite + ' Citation</span></div>'
    + '<div style="display:flex;gap:10px;margin-top:14px;">'
    + '<button onclick="wbToast&&wbToast(\'正在打开 PDF…\')" style="display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:#374151;background:#fff;border:1px solid #D1D5DB;border-radius:9px;padding:8px 16px;cursor:pointer;font-family:inherit;"' + (r.pdf ? '' : ' disabled') + '><i class="fa-solid fa-download" style="font-size:12px;"></i>PDF</button>'
    + '<button onclick="knJoinLib(\'' + esc + '\',this)" style="display:flex;align-items:center;gap:7px;font-size:13px;font-weight:700;color:#fff;background:linear-gradient(135deg,#7C3AED,#6D28D9);border:none;border-radius:9px;padding:8px 16px;cursor:pointer;font-family:inherit;"><i class="fa-solid fa-download" style="font-size:12px;"></i>加入我的知识库</button>'
    + '</div></div>';
}

function knRenderResults() {
  var box = document.getElementById('kn-results-list');
  if (box) box.innerHTML = KN_SEARCH_RESULTS.map(knResultCard).join('');
  var c = document.getElementById('kn-res-count');
  if (c) c.textContent = KN_SEARCH_RESULTS.length;
}

function runKnSearch() {
  var inpHome = document.getElementById('kn-home-inp');
  var inpRes = document.getElementById('kn-results-inp');
  var q = ((document.activeElement === inpRes ? inpRes.value : inpHome.value) || '').trim();
  if (!q) { if (inpRes && inpRes.value.trim()) q = inpRes.value.trim(); }
  if (!q) return;
  if (inpRes) inpRes.value = q;
  knRenderResults();
  document.getElementById('kn-home-view').style.display = 'none';
  document.getElementById('kn-results-view').style.display = 'flex';
}

function knShowHome() {
  document.getElementById('kn-results-view').style.display = 'none';
  document.getElementById('kn-home-view').style.display = '';
}

function knJoinLib(title, btn) {
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-check" style="font-size:12px;"></i>已加入';
    btn.style.background = '#9CA3AF';
    btn.disabled = true;
  }
  if (window.wbToast) wbToast('已加入我的知识库');
}

function knSetMode(btn, mode) {
  document.querySelectorAll('#kntab-home .kn-mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (window.wbToast) wbToast(mode === 'adv' ? '已切换到高级检索' : '已切换到智能检索');
}

function knToggleCat(el) {
  var cat = el.getAttribute('data-cat');
  if (KN_SEARCH_SCOPE.has(cat)) { KN_SEARCH_SCOPE.delete(cat); el.classList.remove('active'); }
  else { KN_SEARCH_SCOPE.add(cat); el.classList.add('active'); }
}

function knRenderHomeLists() {
  var rec = document.getElementById('kn-recent-list');
  if (rec) rec.innerHTML = KN_RECENT.map(function (x) {
    var esc = (x.q || '').replace(/'/g, "\\'");
    return '<div onclick="document.getElementById(\'kn-home-inp\').value=\'' + esc + '\';runKnSearch()" style="display:flex;align-items:center;gap:11px;padding:11px 4px;border-bottom:1px solid #F3F4F6;cursor:pointer;">'
      + '<i class="fa-solid fa-magnifying-glass" style="color:#C0C7D2;font-size:12px;"></i>'
      + '<div style="flex:1;min-width:0;"><div style="font-size:13.5px;color:#374151;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + x.q + '</div></div>'
      + '<span style="font-size:12px;color:#059669;font-weight:600;flex-shrink:0;">' + x.n + ' 篇</span>'
      + '<span style="font-size:12px;color:#B6BECB;flex-shrink:0;">' + x.time + '</span></div>';
  }).join('');
  var rc = document.getElementById('kn-recmd-list');
  if (rc) rc.innerHTML = KN_RECMD.map(function (x) {
    return '<div onclick="wbToast&&wbToast(\'打开推荐知识\')" style="padding:12px 4px;border-bottom:1px solid #F3F4F6;cursor:pointer;">'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">'
      + '<span style="font-size:11px;font-weight:700;color:' + x.tagColor + ';background:' + x.tagBg + ';border-radius:5px;padding:2px 8px;">' + x.tag + '</span>'
      + '<span style="font-size:12px;color:#B6BECB;">' + x.src + '</span></div>'
      + '<div style="font-size:13.5px;color:#374151;font-weight:600;line-height:1.55;">' + x.title + '</div></div>';
  }).join('');
}

// ── 知识库筛选
function knToggleFilterMenu(ev) {
  if (ev) ev.stopPropagation();
  var m = document.getElementById('kn-lib-filter-menu');
  if (m) m.style.display = (m.style.display === 'none' || !m.style.display) ? 'block' : 'none';
}

function knLibFilter(type, btn) {
  document.querySelectorAll('.kn-libfilter-item').forEach(b => b.style.background = 'none');
  if (btn) btn.style.background = '#EFF6FF';
  var lbl = document.getElementById('kn-lib-filter-label');
  if (lbl) lbl.textContent = type;
  document.querySelectorAll('#kn-lib-recent-list .kn-recent-item').forEach(function (row) {
    var t = row.getAttribute('data-kntype');
    row.style.display = (type === '全部' || t === type) ? '' : 'none';
  });
  var menu = document.getElementById('kn-lib-filter-menu');
  if (menu) menu.style.display = 'none';
  if (window.wbToast) wbToast(type === '全部' ? '显示全部类型' : ('已筛选：' + type));
}

function markAdded(btn) {
  btn.classList.add('added');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-check text-xs"></i>已入库';
}

// ── Mode card selector (hub-new)
function legacySelectMode(mode) {
  ['read','calc','exp'].forEach(m => {
    const card  = document.getElementById('mc-' + m);
    const check = document.getElementById('mc-' + m + '-check');
    if (m === mode) {
      card.classList.add('selected');
      check.innerHTML = '<i class="fa-solid fa-check text-white text-xs"></i>';
      check.className = 'ml-auto w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0';
    } else {
      card.classList.remove('selected');
      check.innerHTML = '';
      check.className = 'ml-auto w-4 h-4 border-2 border-gray-200 rounded-full flex-shrink-0';
    }
  });
}

// ══════════════════════════════════════════════════════════
//  SCIENTIFIC DATASET PAGE
// ══════════════════════════════════════════════════════════

var dsCatalog = [
  {
    key: 'molecule', name: '分子数据集', type: '基础数据', domain: '材料科学',
    icon: 'fa-atom', iconBg: '#EDE9FE', iconColor: '#7C3AED',
    desc: '小分子、配合物、量子化学性质与结构表征数据。',
    tags: ['SMILES', 'HOMO/LUMO', 'LogP', 'pKa'],
    sets: 3, records: '134,000',
    cols: ['ID', '名称', 'SMILES', '分子式', '分子量(g/mol)', 'HOMO(eV)', 'LUMO(eV)', 'HOMO-LUMO Gap(eV)', '偶极矩(D)'],
    rows: [
      ['QM9-001','甲烷','C','CH₄','16.043','-10.55','3.186','13.736','0'],
      ['QM9-002','氨','N','NH₃','17.031','-6.993','2.256','9.249','1.6256'],
      ['QM9-003','水','O','H₂O','18.015','-7.967','1.869','9.837','1.8511'],
      ['QM9-004','乙炔','C#C','C₂H₂','26.04','-7.742','1.377','9.119','0'],
      ['QM9-005','氰化氢','C#N','HCN','27.025','-9.807','0.52','10.329','2.8937'],
      ['QM9-006','甲醛','C=O','CH₂O','30.026','-7.265','-1.105','6.158','2.1089'],
      ['QM9-007','乙烷','CC','C₂H₆','30.07','-9.211','2.833','12.044','0'],
      ['QM9-008','甲醇','CO','CH₄O','32.042','-7.219','2.133','9.353','1.5258']
    ],
    downstream: [
      { name:'分子性质预测', desc:'基于 QSAR/GNN 预测量子化学性质', status:'可用', cls:'ds-status-avail' },
      { name:'分子生成', desc:'条件生成满足目标性质的新分子', status:'即将上线', cls:'ds-status-soon' }
    ]
  },
  {
    key: 'crystal', name: '晶体结构数据集', type: '基础数据', domain: '材料科学',
    icon: 'fa-gem', iconBg: '#DBEAFE', iconColor: '#2563EB',
    desc: '预置晶体结构、空间群、能带、形成能与稳定性数据入口。',
    tags: ['CIF', '空间群', '形成能', '带隙'],
    sets: 2, records: '85,000',
    cols: ['ID', '化学式', '空间群', 'a(Å)', 'b(Å)', 'c(Å)', '形成能(eV/atom)', '带隙(eV)'],
    rows: [
      ['CRY-001','TiO₂','P4₂/mnm','4.594','4.594','2.958','-3.42','3.05'],
      ['CRY-002','SiC','F4̄3m','4.360','4.360','4.360','-0.72','2.39'],
      ['CRY-003','ZnO','P6₃mc','3.253','3.253','5.209','-1.59','3.44'],
      ['CRY-004','BaTiO₃','P4mm','3.996','3.996','4.031','-3.71','1.77'],
      ['CRY-005','Fe₂O₃','R3̄c','5.034','5.034','13.752','-2.83','2.12'],
      ['CRY-006','Al₂O₃','R3̄c','4.762','4.762','13.003','-3.48','6.61'],
      ['CRY-007','MgO','Fm3̄m','4.211','4.211','4.211','-3.18','4.48'],
      ['CRY-008','CdS','F4̄3m','5.832','5.832','5.832','-0.43','1.21']
    ],
    downstream: [
      { name:'晶体性质预测', desc:'预测能带结构与热力学稳定性', status:'可用', cls:'ds-status-avail' },
      { name:'新材料筛选', desc:'多性质约束下的高通量筛选', status:'即将上线', cls:'ds-status-soon' }
    ]
  },
  {
    key: 'shale', name: '页岩气储层数据集', type: '场景数据', domain: '地球科学',
    icon: 'fa-earth-asia', iconBg: '#DBEAFE', iconColor: '#1D4ED8',
    desc: '页岩气储层孔隙结构、物性参数与含气量综合评价数据。',
    tags: ['孔隙度', '渗透率', 'TOC', '含气量'],
    sets: 4, records: '12,800',
    cols: ['ID', '样品编号', '岩性', '深度(m)', '孔隙度(%)', '渗透率(mD)', 'TOC(%)', '含气量(m³/t)'],
    rows: [
      ['SHG-001','YS-23-A','黑色页岩','2340.5','4.82','0.0234','3.67','2.85'],
      ['SHG-002','YS-23-B','硅质页岩','2387.2','3.91','0.0187','4.12','3.21'],
      ['SHG-003','YS-24-A','黑色页岩','2456.8','5.34','0.0312','5.03','4.05'],
      ['SHG-004','LB-12-A','碳质页岩','3102.4','2.76','0.0098','2.89','1.92'],
      ['SHG-005','LB-12-B','黑色页岩','3145.7','3.45','0.0156','3.54','2.67'],
      ['SHG-006','SC-08-A','硅质页岩','1987.3','6.21','0.0421','6.12','5.34'],
      ['SHG-007','SC-08-B','灰质页岩','2021.6','4.07','0.0203','3.28','2.41'],
      ['SHG-008','SC-09-A','黑色页岩','2089.4','5.18','0.0289','4.76','3.87']
    ],
    downstream: [
      { name:'储层物性预测', desc:'基于 ML 预测孔渗参数与含气量', status:'可用', cls:'ds-status-avail' },
      { name:'三维地质建模', desc:'整合测井与地震数据的储层建模', status:'开发中', cls:'ds-status-dev' }
    ]
  },
  {
    key: 'protein', name: '蛋白质结构库', type: '场景数据', domain: '合成生物学',
    icon: 'fa-dna', iconBg: '#D1FAE5', iconColor: '#16A34A',
    desc: '合成生物学蛋白质序列、结构与功能注释综合数据库。',
    tags: ['序列', '结构', '功能', '物种'],
    sets: 2, records: '48,600',
    cols: ['ID', '蛋白质名称', 'UniProt ID', '序列长度(aa)', '功能注释', '来源物种'],
    rows: [
      ['PRO-001','绿色荧光蛋白','P42212','238','荧光报告蛋白','Aequorea victoria'],
      ['PRO-002','T7 RNA 聚合酶','P00573','883','RNA 转录','Enterobacteria phage T7'],
      ['PRO-003','Cas9 核酸酶','Q99ZW2','1368','DNA 剪切与编辑','Streptococcus pyogenes'],
      ['PRO-004','脂肪酸合酶','P49327','2511','脂肪酸合成','Homo sapiens'],
      ['PRO-005','己糖激酶','P19367','917','ATP 依赖磷酸化','Homo sapiens'],
      ['PRO-006','叶绿素合酶','Q9SJE3','359','叶绿素生物合成','Arabidopsis thaliana'],
      ['PRO-007','苯丙氨酸解氨酶','P35510','716','代谢通路催化','Rhodosporidium toruloides'],
      ['PRO-008','谷氨酸脱氢酶','P00366','501','氨基酸代谢','Bos taurus']
    ],
    downstream: [
      { name:'蛋白质功能预测', desc:'基于序列预测结构与生化功能', status:'可用', cls:'ds-status-avail' },
      { name:'蛋白质设计', desc:'定向进化与从头设计新蛋白', status:'即将上线', cls:'ds-status-soon' }
    ]
  }
];

var dsCurrentFilter = 'all';

function renderDsCards() {
  var row = document.getElementById('ds-cards-row');
  if (!row) return;
  row.innerHTML = '';
  dsCatalog.forEach(function(ds) {
    if (dsCurrentFilter === 'basic' && ds.type !== '基础数据') return;
    if (dsCurrentFilter === 'scene' && ds.type !== '场景数据') return;
    var card = document.createElement('div');
    card.className = 'ds-card';
    card.id = 'ds-card-' + ds.key;
    var tagsHtml = ds.tags.map(function(t){ return '<span class="ds-tag">' + t + '</span>'; }).join('');
    card.innerHTML =
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">' +
        '<div style="width:36px;height:36px;border-radius:10px;background:' + ds.iconBg + ';display:flex;align-items:center;justify-content:center;">' +
          '<i class="fa-solid ' + ds.icon + '" style="color:' + ds.iconColor + ';font-size:15px;"></i>' +
        '</div>' +
        '<div style="font-size:10px;color:#9CA3AF;font-weight:500;">' + ds.type + '</div>' +
      '</div>' +
      '<div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:5px;">' + ds.name + '</div>' +
      '<div style="font-size:12px;color:#6B7280;line-height:1.5;margin-bottom:10px;">' + ds.desc + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;">' + tagsHtml + '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid #F1F5F9;padding-top:10px;">' +
        '<span style="font-size:11px;color:#9CA3AF;">' + ds.sets + ' 个数据集 · ' + ds.records + ' 条记录</span>' +
        '<span style="font-size:11px;color:#6B7280;">→</span>' +
      '</div>';
    card.addEventListener('click', (function(k){ return function(){ openDsDetail(k); }; })(ds.key));
    row.appendChild(card);
  });
}

function filterDs(btn, type) {
  document.querySelectorAll('.ds-filter-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  dsCurrentFilter = type;
  renderDsCards();
}

function openDsDetail(key) {
  var ds = null;
  for (var i = 0; i < dsCatalog.length; i++) { if (dsCatalog[i].key === key) { ds = dsCatalog[i]; break; } }
  if (!ds) return;

  // Highlight card
  document.querySelectorAll('.ds-card').forEach(function(c){ c.classList.remove('active'); });
  var activeCard = document.getElementById('ds-card-' + key);
  if (activeCard) activeCard.classList.add('active');

  // Show detail view
  document.getElementById('ds-catalog').style.display = 'none';
  var det = document.getElementById('ds-detail');
  det.style.display = 'flex';

  document.getElementById('ds-detail-title').textContent = ds.name;
  document.getElementById('ds-detail-count').textContent = ds.sets + ' 个数据集 · ' + ds.records + ' 条记录';

  // Tags
  var tagsEl = document.getElementById('ds-detail-tags');
  tagsEl.innerHTML = ds.tags.map(function(t){ return '<span class="ds-tag" style="font-size:11.5px;">' + t + '</span>'; }).join('');

  // Table header
  var thead = document.getElementById('ds-detail-thead');
  thead.innerHTML = '<tr>' + ds.cols.map(function(c){ return '<th>' + c + '</th>'; }).join('') + '</tr>';

  // Table body
  var tbody = document.getElementById('ds-detail-tbody');
  tbody.innerHTML = ds.rows.map(function(row){
    return '<tr>' + row.map(function(cell){ return '<td>' + cell + '</td>'; }).join('') + '</tr>';
  }).join('');

  // Downstream apps
  var dsDiv = document.getElementById('ds-downstream');
  dsDiv.innerHTML = '';
  ds.downstream.forEach(function(app) {
    var appCard = document.createElement('div');
    appCard.style.cssText = 'flex:1;border:1px solid #E5E7EB;border-radius:12px;padding:16px 18px;background:white;display:flex;flex-direction:column;gap:6px;';
    appCard.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<span style="font-size:13px;font-weight:600;color:#111827;">' + app.name + '</span>' +
        '<span class="ds-status-badge ' + app.cls + '">' + app.status + '</span>' +
      '</div>' +
      '<div style="font-size:12px;color:#6B7280;">' + app.desc + '</div>';
    dsDiv.appendChild(appCard);
  });
}

function closeDsDetail() {
  document.getElementById('ds-detail').style.display = 'none';
  document.getElementById('ds-catalog').style.display = 'flex';
  document.querySelectorAll('.ds-card').forEach(function(c){ c.classList.remove('active'); });
}

// Initialize dataset cards + 科研空间 SKU grid on load
document.addEventListener('DOMContentLoaded', function() {
  renderDsCards();
  // assets page starts at home (sections shown/hidden by openAssetsSection)
});

// ══════════════════════════════════════════════════════════
//  TOPIC SPACE DRILL-DOWN
// ══════════════════════════════════════════════════════════

var topicDB = {
  geo: {
    name: '页岩气储层评价课题', status: '运行中', statusCls: 'task-status-active',
    papers: 28, nodes: 186, progress: '65%', graphKey: 'topic-geo',
    tasks: [
      {
        name: '孔隙度-渗透率关联分析', status: '进行中', statusCls: 'task-status-active',
        progress: 70, papers: 12, desc: '建立储层物性参数间的统计关联模型，评价孔渗耦合预测精度。',
        graphKey: 'geo',
        paperList: [
          { title:'页岩气储层物性分析与评价方法研究', journal:'Nature Energy', year:'2024', authors:'张明等', tag:'储层评价' },
          { title:'低渗透储层敏感性实验综述及机理分析', journal:'Fuel', year:'2023', authors:'李华等', tag:'敏感性分析' },
          { title:'基于核磁共振的页岩孔隙结构定量表征', journal:'Marine and Petroleum Geology', year:'2024', authors:'王刚等', tag:'孔隙结构' },
          { title:'川南地区龙马溪组页岩气储层孔隙演化', journal:'石油勘探与开发', year:'2023', authors:'陈伟等', tag:'孔隙演化' },
          { title:'深层页岩气储层渗透率影响因素研究', journal:'中国石油大学学报', year:'2024', authors:'刘洋等', tag:'渗透率' },
        ]
      },
      {
        name: '储层分类体系建立', status: '已完成', statusCls: 'task-status-done',
        progress: 100, papers: 8, desc: '基于孔隙结构与含气量综合指标，建立页岩储层分类评价体系。',
        graphKey: 'geo',
        paperList: [
          { title:'页岩气储层孔隙结构特征及其控制因素分析', journal:'天然气工业', year:'2023', authors:'赵磊等', tag:'孔隙结构' },
          { title:'基于聚类分析的储层岩相分类方法', journal:'石油学报', year:'2022', authors:'周鑫等', tag:'分类方法' },
          { title:'四川盆地页岩储层品质综合评价', journal:'地质学报', year:'2023', authors:'杨帆等', tag:'综合评价' },
        ]
      },
      {
        name: '岩石力学参数整合', status: '进行中', statusCls: 'task-status-active',
        progress: 45, papers: 6, desc: '整合测井解释与室内实验的力学参数，支撑压裂方案设计。',
        graphKey: 'geo',
        paperList: [
          { title:'页岩岩石力学特性与天然裂缝分布研究', journal:'Geophysics', year:'2024', authors:'吴明等', tag:'岩石力学' },
          { title:'基于成像测井的脆性指数预测方法', journal:'测井技术', year:'2023', authors:'孙坤等', tag:'脆性评价' },
        ]
      },
      {
        name: 'AI 预测模型验证', status: '待启动', statusCls: 'task-status-pending',
        progress: 0, papers: 2, desc: '基于已整合数据构建机器学习预测模型，开展交叉验证。',
        graphKey: 'geo',
        paperList: [
          { title:'深度学习在储层物性参数预测中的应用', journal:'Journal of Petroleum Science', year:'2024', authors:'陈刚等', tag:'深度学习' },
        ]
      },
    ]
  },
  mat: {
    name: '柔性聚合物材料研究', status: '运行中', statusCls: 'task-status-active',
    papers: 45, nodes: 312, progress: '80%', graphKey: 'topic-mat',
    tasks: [
      {
        name: '丁苯橡胶配方优化', status: '已完成', statusCls: 'task-status-done',
        progress: 100, papers: 14, desc: '系统研究丁苯橡胶配方中各组分比例对力学性能的影响。',
        graphKey: 'mat',
        paperList: [
          { title:'丁苯橡胶/白炭黑复合材料补强机理研究', journal:'Polymer', year:'2023', authors:'张红等', tag:'配方优化' },
          { title:'橡胶配方中偶联剂用量对动态性能的影响', journal:'橡胶工业', year:'2024', authors:'李明等', tag:'动态性能' },
          { title:'SSBR 微观结构与物理性能关联研究', journal:'Journal of Applied Polymer', year:'2023', authors:'王芳等', tag:'微观结构' },
        ]
      },
      {
        name: '柔性基底与界面研究', status: '进行中', statusCls: 'task-status-active',
        progress: 65, papers: 11, desc: '研究聚合物柔性基底与功能层界面的粘附性与稳定性。',
        graphKey: 'mat',
        paperList: [
          { title:'柔性电子器件基底材料界面粘附研究', journal:'ACS Applied Materials', year:'2024', authors:'赵磊等', tag:'界面研究' },
          { title:'聚合物薄膜拉伸形变机制与失效分析', journal:'Macromolecules', year:'2023', authors:'刘强等', tag:'形变机制' },
        ]
      },
      {
        name: '热老化性能评价', status: '进行中', statusCls: 'task-status-active',
        progress: 50, papers: 9, desc: '评价聚合物材料在高温长期服役条件下的性能衰减规律。',
        graphKey: 'mat',
        paperList: [
          { title:'橡胶材料热氧老化动力学模型', journal:'Polymer Degradation', year:'2022', authors:'吴静等', tag:'热老化' },
          { title:'抗老化剂对弹性体老化性能的保护机制', journal:'中国橡胶', year:'2023', authors:'孙磊等', tag:'防老化' },
        ]
      },
      {
        name: '动态力学性能测试', status: '进行中', statusCls: 'task-status-active',
        progress: 80, papers: 8, desc: '开展 DMA 测试分析聚合物黏弹性与玻璃化转变行为。',
        graphKey: 'mat',
        paperList: [
          { title:'丁苯橡胶动态力学分析与玻璃化转变', journal:'Journal of Polymer Science', year:'2024', authors:'周建等', tag:'DMA测试' },
        ]
      },
      {
        name: '多尺度模拟研究', status: '待启动', statusCls: 'task-status-pending',
        progress: 0, papers: 3, desc: '利用分子动力学与有限元方法从多尺度理解聚合物力学行为。',
        graphKey: 'mat',
        paperList: [
          { title:'聚合物链段运动的分子动力学模拟', journal:'Macromolecules', year:'2023', authors:'陈旭等', tag:'分子模拟' },
        ]
      },
    ]
  },
  bio: {
    name: '催化剂优化项目', status: '已完成', statusCls: 'task-status-done',
    papers: 33, nodes: 241, progress: '100%', graphKey: 'topic-bio',
    tasks: [
      {
        name: '活性位点表征', status: '已完成', statusCls: 'task-status-done',
        progress: 100, papers: 10, desc: '利用原位 XPS/XANES 表征催化剂活性位点的电子结构。',
        graphKey: 'bio',
        paperList: [
          { title:'Pt/Al₂O₃ 催化剂活性位点分布与反应活性', journal:'ACS Catalysis', year:'2023', authors:'王磊等', tag:'活性位点' },
          { title:'原位 XANES 表征催化剂结构演变', journal:'Journal of Catalysis', year:'2022', authors:'赵聪等', tag:'原位表征' },
          { title:'MOF 衍生碳催化剂活性位点工程', journal:'Nature Catalysis', year:'2024', authors:'李阳等', tag:'MOF催化' },
        ]
      },
      {
        name: '反应条件优化', status: '已完成', statusCls: 'task-status-done',
        progress: 100, papers: 12, desc: '系统优化温度、压力、进料比等反应工艺条件。',
        graphKey: 'bio',
        paperList: [
          { title:'加氢脱硫催化剂操作条件优化研究', journal:'Applied Catalysis A', year:'2023', authors:'陈云等', tag:'条件优化' },
          { title:'光催化反应动力学与量子效率提升', journal:'Chemical Engineering Journal', year:'2023', authors:'刘静等', tag:'光催化' },
        ]
      },
      {
        name: '失活机理研究', status: '已完成', statusCls: 'task-status-done',
        progress: 100, papers: 7, desc: '研究积碳、中毒与烧结等失活机制及再生方法。',
        graphKey: 'bio',
        paperList: [
          { title:'Ni 基催化剂积碳失活机理与再生', journal:'Applied Surface Science', year:'2022', authors:'孙亮等', tag:'失活机理' },
          { title:'催化剂硫中毒影响规律与防护策略', journal:'Fuel', year:'2023', authors:'周力等', tag:'硫中毒' },
        ]
      },
      {
        name: '工业放大验证', status: '已完成', statusCls: 'task-status-done',
        progress: 100, papers: 4, desc: '在中试规模验证实验室优化结果的工程可行性。',
        graphKey: 'bio',
        paperList: [
          { title:'催化加氢装置工业放大设计与验证', journal:'化工进展', year:'2023', authors:'张伟等', tag:'工业化' },
        ]
      },
    ]
  }
};

var currentTopicKey = null;
var currentTaskIdx  = null;

function openTopic(key) {
  var t = topicDB[key];
  if (!t) return;
  currentTopicKey = key;
  document.getElementById('topic-overview').style.display = 'none';
  var det = document.getElementById('topic-detail');
  det.style.display = 'flex';

  document.getElementById('tp-detail-name').textContent = t.name;
  var badge = document.getElementById('tp-detail-status-badge');
  badge.textContent = t.status;
  badge.className = 'task-status-badge ' + t.statusCls;
  document.getElementById('tp-stat-papers').textContent = t.papers;
  document.getElementById('tp-stat-tasks').textContent  = t.tasks.length;
  document.getElementById('tp-stat-nodes').textContent  = t.nodes;
  document.getElementById('tp-stat-progress').textContent = t.progress;

  var graphBtn = document.getElementById('tp-graph-btn');
  graphBtn.onclick = function(e) { openGraph(e, t.graphKey); };

  renderTaskCards(t);
  document.getElementById('tp-task-grid').style.display  = '';
  document.getElementById('tp-paper-panel').style.display = 'none';
}

function closeTopic() {
  document.getElementById('topic-detail').style.display = 'none';
  document.getElementById('topic-overview').style.display = 'flex';
  currentTopicKey = null;
}

function renderTaskCards(topic) {
  var grid = document.getElementById('tp-task-cards');
  grid.innerHTML = '';
  topic.tasks.forEach(function(task, idx) {
    var card = document.createElement('div');
    card.className = 'task-card';
    var pct = task.progress;
    var barColor = task.statusCls === 'task-status-done' ? '#059669'
                 : task.statusCls === 'task-status-active' ? '#2563EB' : '#D1D5DB';
    card.innerHTML =
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">' +
        '<div style="font-size:14px;font-weight:700;color:#111827;line-height:1.35;flex:1;margin-right:8px;">' + task.name + '</div>' +
        '<span class="task-status-badge ' + task.statusCls + '">' + task.status + '</span>' +
      '</div>' +
      '<div style="font-size:12px;color:#6B7280;line-height:1.55;margin-bottom:12px;">' + task.desc + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">' +
        '<div style="flex:1;height:4px;background:#E5E7EB;border-radius:2px;overflow:hidden;">' +
          '<div style="height:100%;width:' + pct + '%;background:' + barColor + ';border-radius:2px;transition:width .4s;"></div>' +
        '</div>' +
        '<span style="font-size:11px;font-weight:600;color:' + barColor + ';flex-shrink:0;">' + pct + '%</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<span style="font-size:11.5px;color:#9CA3AF;"><i class="fa-solid fa-file-lines" style="margin-right:4px;"></i>' + task.papers + ' 篇关联文献</span>' +
        '<div style="display:flex;gap:6px;">' +
          '<button style="font-size:11.5px;border:1px solid #E5E7EB;border-radius:7px;padding:4px 10px;background:white;color:#374151;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;" onclick="openTaskPapers(' + idx + ',event)">' +
            '<i class="fa-solid fa-file-lines" style="font-size:10px;color:#6B7280;"></i>关联文献' +
          '</button>' +
          '<button style="font-size:11.5px;border:1px solid #C7D2FE;border-radius:7px;padding:4px 10px;background:#EEF2FF;color:#4338CA;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;" onclick="openTaskGraph(' + idx + ',event)">' +
            '<i class="fa-solid fa-diagram-project" style="font-size:10px;"></i>任务图谱' +
          '</button>' +
        '</div>' +
      '</div>';
    grid.appendChild(card);
  });
}

function openTaskPapers(idx, e) {
  if (e) e.stopPropagation();
  var topic = topicDB[currentTopicKey];
  var task  = topic.tasks[idx];
  currentTaskIdx = idx;

  document.getElementById('tp-task-name').textContent  = task.name;
  document.getElementById('tp-task-paper-count').textContent = '（' + task.paperList.length + ' 篇）';

  var taskGraphBtn = document.getElementById('tp-task-graph-btn');
  taskGraphBtn.onclick = function(ev) { openGraph(ev, task.graphKey); };

  var list = document.getElementById('tp-paper-list');
  list.style.padding = '18px 24px';
  list.innerHTML = '';
  task.paperList.forEach(function(p, i) {
    var isPdf = (i % 2 === 0);
    var icoWrap = isPdf ? 'background:#FEE2E2;' : 'background:#DBEAFE;';
    var ico = isPdf
      ? '<i class="fa-solid fa-file-pdf" style="color:#EF4444;font-size:14px;"></i>'
      : '<i class="fa-solid fa-file-lines" style="color:#3B82F6;font-size:14px;"></i>';
    var doiStr = p.doi || ('10.' + (1000 + i * 111) + '/' + (p.journal || 'doc').replace(/[^A-Za-z]/g,'').slice(0,4).toLowerCase() + '.' + (p.year || '2024'));
    var doi = ' · DOI: ' + doiStr;
    var cite = (p.cite != null ? p.cite : Math.floor(20 + Math.random()*120));
    var date = p.date || (p.year + '-0' + (1 + (i % 9)));
    // 标签：主标签(蓝) + 可选副标签(灰) + 已引用(绿, 前两条)
    var tags = '<span style="font-size:10.5px;background:#EFF6FF;color:#2563EB;border-radius:6px;padding:2px 8px;">' + p.tag + '</span>';
    if (p.tag2) tags += '<span style="font-size:10.5px;background:#F3F4F6;color:#6B7280;border-radius:6px;padding:2px 8px;">' + p.tag2 + '</span>';
    if (i < 2) tags += '<span style="font-size:10.5px;background:#DCFCE7;color:#16A34A;border-radius:6px;padding:2px 8px;">已引用</span>';

    var item = document.createElement('div');
    item.className = 'tp-paper-item';
    item.onclick = (function(k){ return function(){ openKspacePaper(k); }; })(i);
    item.innerHTML =
      '<div class="tp-paper-ico" style="' + icoWrap + '">' + ico + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:13.5px;font-weight:600;color:#1F2937;line-height:1.45;margin-bottom:5px;">' + p.title + '</div>' +
        '<div style="font-size:11.5px;color:#9CA3AF;margin-bottom:8px;">' + p.authors + ' · ' + p.journal + ' · ' + p.year + doi + '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">' + tags + '</div>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">' +
        '<span style="font-size:11px;color:#9CA3AF;">' + date + '</span>' +
        '<span style="font-size:11.5px;color:#2563EB;">引用 ' + cite + '</span>' +
      '</div>';
    list.appendChild(item);
  });

  document.getElementById('tp-task-grid').style.display  = 'none';
  document.getElementById('tp-paper-panel').style.display = 'flex';
}

function openTaskGraph(idx, e) {
  if (e) e.stopPropagation();
  var topic = topicDB[currentTopicKey];
  var task  = topic.tasks[idx];
  openGraph(e, task.graphKey);
}

function closeTaskPapers() {
  document.getElementById('tp-paper-panel').style.display = 'none';
  document.getElementById('tp-task-grid').style.display   = '';
}

// ══════════════════════════════════════════════════════════
//  AI Q&A MODAL
// ══════════════════════════════════════════════════════════

var aiqaSuggestions = [
  '这篇文献的核心结论是什么',
  '帮我对比几篇文献的实验方法',
  '文献中有哪些关键实验数据',
  '推荐相关领域的后续研究方向',
  '这篇文献的研究方法有何创新点',
  '实验结果的局限性是什么',
  '文献中引用了哪些重要参考文献',
  '这个研究与工业应用有何关联',
];

var aiqaMsgCount = 0;

function wbSearchSend(preset) {
  var inp = document.getElementById('wb-search-input');
  var q = preset || (inp ? inp.value.trim() : '');
  if (!q) return;
  var msgs = document.getElementById('wb-search-msgs');
  if (msgs) {
    msgs.innerHTML += '<div style="display:flex;justify-content:flex-end;margin-top:8px;"><div style="background:#EFF6FF;border-radius:10px 10px 0 10px;padding:7px 12px;font-size:12px;color:#1D4ED8;max-width:80%;">' + q + '</div></div>';
    msgs.innerHTML += '<div style="display:flex;gap:8px;align-items:flex-start;margin-top:8px;"><div style="width:24px;height:24px;border-radius:6px;background:linear-gradient(135deg,#2563EB,#7C3AED);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-robot" style="font-size:10px;color:white;"></i></div><div style="background:#F4F7FC;border-radius:0 10px 10px 10px;padding:7px 12px;font-size:12px;color:#374151;line-height:1.6;">正在搜索「' + q + '」的相关内容，请稍候...</div></div>';
    msgs.scrollTop = msgs.scrollHeight;
  }
  if (inp) inp.value = '';
}

function openAiQa() {
  document.getElementById('aiqa-backdrop').classList.add('open');
  document.getElementById('aiqa-input').focus();
}

function closeAiQa() {
  document.getElementById('aiqa-backdrop').classList.remove('open');
}

function closeAiQaOnBackdrop(e) {
  if (e.target === document.getElementById('aiqa-backdrop')) closeAiQa();
}

function shuffleAiqaSuggestions() {
  var shuffled = aiqaSuggestions.slice().sort(function() { return Math.random() - 0.5; });
  var boxes = document.querySelectorAll('.aiqa-sug');
  boxes.forEach(function(btn, i) {
    var text = shuffled[i] || '';
    btn.innerHTML = text + '<span class="aiqa-sug-arrow">→</span>';
    btn.onclick = function() { sendAiqaSuggestion(btn); };
  });
}

function sendAiqaSuggestion(btn) {
  var text = btn.childNodes[0].textContent.trim();
  if (text) sendAiQaMsgText(text);
}

function aiQaKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAiQaMsg(); }
}

function sendAiQaMsg() {
  var input = document.getElementById('aiqa-input');
  var text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = 'auto';
  sendAiQaMsgText(text);
}

function sendAiQaMsgText(text) {
  var body = document.getElementById('aiqa-body');
  // Hide welcome block after first message
  var welcome = document.getElementById('aiqa-welcome');
  if (welcome) { welcome.style.display = 'none'; }

  // User message
  var userDiv = document.createElement('div');
  userDiv.className = 'aiqa-msg-user';
  userDiv.textContent = text;
  body.appendChild(userDiv);

  // Simulate AI response
  var aiDiv = document.createElement('div');
  aiDiv.className = 'aiqa-msg-ai';
  aiqaMsgCount++;
  var responses = [
    '根据当前文献的分析，核心结论是：<b>页岩气储层的孔隙度-渗透率耦合预测模型</b>在多组实验中表现出显著优于传统单参数方法的预测精度（R² = 0.94），特别是在低渗透率区间（&lt;0.01 mD）的预测稳定性提高了 37%。',
    '对比当前文献库中的实验方法，发现三篇文献均采用了<b>岩心压汞实验</b>与<b>核磁共振</b>相结合的方式表征孔喉分布。主要区别在于：Zhang et al. 额外引入了 μCT 三维重建，而 Li et al. 侧重于原位条件下的渗流模拟。',
    '文献中报告的关键实验数据包括：\n• 孔隙度范围：2.76%–6.21%\n• 渗透率范围：0.009–0.042 mD\n• TOC 含量：2.89%–6.12%\n• 含气量均值：3.16 m³/t\n\n样本来自四个产区，共 128 个岩心样本。',
    '基于文献的研究空白与当前技术趋势，建议关注：\n1. <b>多尺度孔隙网络建模</b>（纳米级 + 微米级耦合）\n2. <b>地质力学与渗流的动态耦合</b>模拟研究\n3. 基于深度学习的储层参数<b>端到端预测框架</b>',
  ];
  var resp = responses[(aiqaMsgCount - 1) % responses.length];
  aiDiv.innerHTML =
    '<div class="aiqa-msg-ai-label"><i class="fa-solid fa-robot" style="font-size:10px;"></i>文献问答助手</div>' +
    '<div>' + resp.replace(/\n/g, '<br>') + '</div>';
  body.appendChild(aiDiv);
  body.scrollTop = body.scrollHeight;
}

// ── HUB (科研超级中枢) ──────────────────────────────────────────────
var hubCourseData = {
  geo: {
    title: '页岩气储层评价课题',
    overview: '本课题围绕页岩气储层参数预测展开，完成了储层孔隙结构表征与压裂模拟两项前期成果。',
    detail: '<strong>已完成：</strong>整理 89 篇核心文献并建立分类体系，完成页岩储层孔隙度测井解释综述草稿。<br><strong>进行中：</strong>目标为预测储层渗透率，结合核磁共振数据与岩心实验构建 ML 预测模型，预计本周完成初版评估。',
    explore: 3, output: 2,
    sessions: [
      { name: '储层渗透率预测方案探索', count: 4, last: '12 分钟前' },
      { name: '压裂段选取优化讨论', count: 7, last: '昨天' }
    ]
  },
  mat: {
    title: '柔性聚合物材料研究',
    overview: '探索高柔韧性聚合物配方，通过 AI 优化配方参数与力学性能，目标交付 3 份配方优化报告。',
    detail: '<strong>已完成：</strong>完成 62 篇聚合物弹性体文献整理，建立拉伸模量数据集。<br><strong>进行中：</strong>使用贝叶斯优化搜索最优增塑剂配比，计划下周完成第一轮实验验证。',
    explore: 5, output: 3,
    sessions: [
      { name: '橡胶配方与性能预测', count: 9, last: '3 小时前' },
      { name: '增塑剂用量优化', count: 5, last: '2 天前' }
    ]
  },
  bio: {
    title: '催化剂优化项目',
    overview: '针对氢能燃料电池催化剂活性位点进行计算筛选与实验验证，目标降低 30% 铂用量。',
    detail: '<strong>已完成：</strong>完成 DFT 计算筛选初步候选材料 12 种，文献综述已提交。<br><strong>进行中：</strong>开展 Pt-Co 合金催化剂结构优化计算，预计两周内完成活性对比实验。',
    explore: 6, output: 4,
    sessions: [
      { name: 'Pt-Co 合金结构优化分析', count: 11, last: '1 小时前' },
      { name: 'DFT 计算参数调整', count: 3, last: '4 天前' }
    ]
  }
};

function openHubCourse(key) {
  var d = hubCourseData[key] || hubCourseData.geo;
  document.getElementById('hubd-title').textContent = d.title;
  document.getElementById('hubd-overview').textContent = d.overview;
  document.getElementById('hubd-detail-text').innerHTML = d.detail;
  document.getElementById('hubd-stat-explore').textContent = d.explore;
  document.getElementById('hubd-stat-output').textContent = d.output;
  document.getElementById('hub-tree-name').textContent = d.title;

  // render session history
  var sEl = document.getElementById('hubd-sessions');
  sEl.innerHTML = '';
  d.sessions.forEach(function(s) {
    var c = document.createElement('div');
    c.style.cssText = 'background:white;border:1.5px solid #E5E7EB;border-radius:12px;padding:14px 18px;margin-bottom:10px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;';
    c.onmouseover = function(){ this.style.borderColor='#93C5FD'; };
    c.onmouseout = function(){ this.style.borderColor='#E5E7EB'; };
    c.innerHTML = '<div><div style="font-size:13px;font-weight:600;color:#111827;margin-bottom:3px;">' + s.name + '</div>'
      + '<div style="font-size:11px;color:#9CA3AF;">' + s.count + ' 次问答 · 最后更新 ' + s.last + '</div></div>'
      + '<i class="fa-solid fa-chevron-right" style="font-size:11px;color:#D1D5DB;"></i>';
    c.onclick = function() { openHubdSession(s.name, s.count); };
    sEl.appendChild(c);
  });

  // show detail, hide home
  document.getElementById('hub-home').style.display = 'none';
  var det = document.getElementById('hub-detail');
  det.style.display = 'flex';

  // reset to single pane
  document.getElementById('hub-single-pane').style.display = 'flex';
  document.getElementById('hub-three-pane').style.display = 'none';
  document.getElementById('hubd-input').value = '';
  switchHubdTab('home');
}

function closeHubDetail() {
  document.getElementById('hub-detail').style.display = 'none';
  document.getElementById('hub-home').style.display = 'flex';
  if (typeof switchPage === 'function') switchPage('hub'); // 返回中枢首页，恢复面包屑/导航
}

// ── 科研超级中枢（入口首页）───────────────────────────────────────
function enterHub() {
  document.getElementById('hub-detail').style.display = 'none';
  document.getElementById('hub-home').style.display = 'flex';
  switchPage('hub');
}

// ── 我的科研任务 = 三栏对话工作区（图3），复用 page-hub 的 hub-detail 三栏视图 ──
var hubTaskInited = false;
function hubTaskChrome() {
  document.querySelectorAll('.nav-item').forEach(function (n) {
    n.classList.remove('active');
    var ic = n.querySelector('.ni'); if (ic) ic.style.color = '';
  });
  var nv = document.getElementById('nav-task-ws'); if (nv) nv.classList.add('active');
  var t = document.getElementById('page-title'); if (t) t.textContent = '我的科研任务';
  document.body.classList.remove('sb-collapsed');
  if (typeof v2SbManual !== 'undefined') v2SbManual = null;
  var k = document.getElementById('scope-key'), v = document.getElementById('space-label');
  if (k && v) { k.textContent = '课题空间：'; v.textContent = (typeof wbCurrentSpace !== 'undefined' ? wbCurrentSpace : '配方优化课题'); }
}
function enterTaskWorkspace() {
  document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
  var pg = document.getElementById('page-hub'); if (pg) pg.classList.add('active');
  document.getElementById('hub-home').style.display = 'none';
  document.getElementById('hub-detail').style.display = 'flex';
  if (!hubTaskInited) {
    if (typeof openHubdSession === 'function') openHubdSession('橡胶配方与性能预测', 5);
    hubTaskInited = true;
  }
  document.getElementById('hub-single-pane').style.display = 'none';
  document.getElementById('hub-three-pane').style.display = 'flex';
  hubTaskChrome();
}
// 在中枢入口提问 → 进入我的科研任务工作区并发起对话
function hubAskToTask(text) {
  enterTaskWorkspace();
  var hi = document.getElementById('hubd-input'); if (hi) hi.value = text || '';
  if (typeof hubdSendMsg === 'function') hubdSendMsg();
  hubTaskChrome();
}

// ── 中枢对话「关联子任务」选择器（子任务 = 我的科研任务里的任务） ──
var hubLinkedTask = null;

// 从左侧任务树动态收集「课题 → 子任务」，保持与新建任务同步
function hubCollectTasks() {
  var groups = [];
  document.querySelectorAll('.hub-folder').forEach(function (f) {
    var hdr = f.querySelector('[data-open]');
    var nameEl = hdr ? hdr.querySelector('span[id], span') : null;
    var fname = nameEl ? nameEl.textContent.trim() : '任务';
    var tasks = [];
    f.querySelectorAll('.hub-sess .hub-sess-lbl').forEach(function (s) {
      var v = s.textContent.trim(); if (v) tasks.push(v);
    });
    if (tasks.length) groups.push({ folder: fname, tasks: tasks });
  });
  return groups;
}

function hubMenuRow(label, val, active) {
  var d = document.createElement('div');
  d.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:12.5px;color:' + (active ? '#2563EB' : '#374151') + ';font-weight:' + (active ? '600' : '400') + ';';
  d.onmouseover = function () { d.style.background = '#F3F7FF'; };
  d.onmouseout = function () { d.style.background = ''; };
  d.innerHTML = (active
      ? '<i class="fa-solid fa-check" style="font-size:10px;color:#2563EB;width:12px;"></i>'
      : '<i style="display:inline-block;width:12px;"></i>')
    + '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + label + '</span>';
  d.onclick = function (e) { e.stopPropagation(); hubPickTask(val); };
  return d;
}

function hubToggleTaskMenu(ev) {
  if (ev) ev.stopPropagation();
  var old = document.getElementById('hb2-link-pop');
  if (old) { hubCloseTaskMenu(); return; }
  var btn = document.getElementById('hb2-link-btn');
  if (!btn) return;
  var r = btn.getBoundingClientRect();
  var pop = document.createElement('div');
  pop.id = 'hb2-link-pop';
  pop.style.cssText = 'position:fixed;z-index:9999;width:270px;max-height:340px;overflow-y:auto;background:#fff;border:1px solid #E5E7EB;border-radius:12px;box-shadow:0 14px 34px rgba(15,23,42,.18);padding:6px;';

  // 默认项：新建任务
  pop.appendChild(hubMenuRow('＋ 新建任务（默认）', '__new__', hubLinkedTask === null));
  var groups = hubCollectTasks();
  if (groups.length) {
    var div = document.createElement('div');
    div.style.cssText = 'height:1px;background:#F1F3F7;margin:5px 6px;';
    pop.appendChild(div);
  }
  groups.forEach(function (g) {
    var h = document.createElement('div');
    h.style.cssText = 'font-size:11px;color:#9CA3AF;padding:7px 10px 3px;';
    h.textContent = g.folder;
    pop.appendChild(h);
    g.tasks.forEach(function (tName) { pop.appendChild(hubMenuRow(tName, tName, hubLinkedTask === tName)); });
  });

  document.body.appendChild(pop);
  // 工具条靠底部：优先向上弹出
  var top = r.top - pop.offsetHeight - 6;
  if (top < 8) top = r.bottom + 6;
  pop.style.top = top + 'px';
  pop.style.left = Math.max(8, Math.min(r.left, window.innerWidth - pop.offsetWidth - 8)) + 'px';
  setTimeout(function () { document.addEventListener('click', hubCloseTaskMenu); }, 0);
}

function hubPickTask(val) {
  hubLinkedTask = (val === '__new__') ? null : val;
  var lbl = document.getElementById('hb2-link-label');
  if (lbl) lbl.textContent = hubLinkedTask ? hubLinkedTask : '关联子任务';
  var btn = document.getElementById('hb2-link-btn');
  if (btn) { btn.classList.toggle('active', !!hubLinkedTask); btn.title = hubLinkedTask ? ('已关联子任务：' + hubLinkedTask + '（点击可切换/取消）') : '关联到「我的科研任务」中的子任务；不选则默认新建任务'; }
  hubCloseTaskMenu();
}

function hubCloseTaskMenu() {
  var p = document.getElementById('hb2-link-pop');
  if (p) p.remove();
  document.removeEventListener('click', hubCloseTaskMenu);
}

// 关联到已有子任务：进入该子任务并把消息作为追问发出
function hubAskInTask(taskName, text) {
  enterTaskWorkspace();
  if (typeof openHubdSession === 'function') openHubdSession(taskName);
  document.querySelectorAll('.hub-sess').forEach(function (r) {
    r.classList.toggle('active', r.getAttribute('data-sess') === taskName);
  });
  hubTaskChrome();
  var input = document.getElementById('hubd-input-3');
  if (input) { input.value = text || ''; if (typeof hubdSend3PMsg === 'function') hubdSend3PMsg(); }
}

function switchHubdTab(tab) {
  var tabs = ['home','plan','task','asset'];
  tabs.forEach(function(t) {
    var btn = document.getElementById('hubd-tab-' + t);
    if (!btn) return;
    if (t === tab) {
      btn.style.color = '#2563EB';
      btn.style.borderBottomColor = '#2563EB';
      btn.style.fontWeight = '600';
    } else {
      btn.style.color = '#6B7280';
      btn.style.borderBottomColor = 'transparent';
      btn.style.fontWeight = '400';
    }
  });
}

function openHubdSession(name, count) {
  var sName = name || '储层渗透率预测方案';
  // 切到三栏工作区
  document.getElementById('hub-single-pane').style.display = 'none';
  document.getElementById('hub-three-pane').style.display = 'flex';
  if (typeof hubTaskChrome === 'function') { hubTaskInited = true; hubTaskChrome(); }
  // 五视图（对话/轨迹/目标规划/沙盒文件/执行日志）随子对话动态渲染
  renderHubSession(sName);
}

function hubdSendMsg() {
  var input = document.getElementById('hubd-input');
  var text = (input.value || '').trim();
  if (!text) text = '分析本课题的研究进展，给出下一步建议';

  document.getElementById('hub-session-name').textContent = text.slice(0, 18) + (text.length > 18 ? '…' : '');
  if (typeof renderHubSandbox === 'function') renderHubSandbox([]);

  // build initial chat
  var area = document.getElementById('hub-chat-area');
  area.innerHTML = '<div style="display:flex;justify-content:flex-end;margin-bottom:16px;"><div style="max-width:70%;background:#2563EB;color:white;border-radius:14px 14px 4px 14px;padding:11px 16px;font-size:13px;line-height:1.6;">' + text + '</div></div>'
    + '<div style="display:flex;gap:10px;"><div style="width:28px;height:28px;border-radius:50%;background:#EFF6FF;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-robot" style="font-size:11px;color:#2563EB;"></i></div><div style="max-width:78%;background:white;border:1.5px solid #E5E7EB;border-radius:14px 14px 14px 4px;padding:11px 16px;font-size:13px;line-height:1.7;color:#374151;">正在分析你的研究课题，检索相关文献与数据……<br><br>建议下一步：梳理现有文献、明确关键实验参数、建立数据分析流程。是否需要我帮你制定详细研究计划？</div></div>';

  document.getElementById('hub-single-pane').style.display = 'none';
  document.getElementById('hub-three-pane').style.display = 'flex';
  input.value = '';
}

function hubdSend3PMsg() {
  var input = document.getElementById('hubd-input-3');
  var text = (input.value || '').trim();
  if (!text) return;
  var area = document.getElementById('hub-chat-area');
  var userDiv = document.createElement('div');
  userDiv.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:16px;';
  var hl = text.replace(/@([^\s@]+)/g, '<span style="color:#BFDBFE;font-weight:700;">@$1</span>');
  userDiv.innerHTML = '<div style="max-width:70%;background:#2563EB;color:white;border-radius:14px 14px 4px 14px;padding:11px 16px;font-size:13px;line-height:1.6;">' + hl + '</div>';
  area.appendChild(userDiv);
  // 识别 @ 协同：拉入被艾特成员 / 触发评审送审
  var mentioned = HUB_PEOPLE.filter(function (p) { return p.in && !p.fixed && text.indexOf('@' + p.name) > -1; });
  if (mentioned.length) {
    var note = document.createElement('div');
    note.style.cssText = 'display:flex;justify-content:center;margin-bottom:14px;';
    var collab = mentioned.filter(function (p) { return p.role !== '评审人'; });
    var reviewers = mentioned.filter(function (p) { return p.role === '评审人'; });
    var lines = [];
    if (collab.length) lines.push('已通知 ' + collab.map(function (p) { return '@' + p.name; }).join('、') + '：其个人智能体已加入本任务，进入多人多智能体协同');
    reviewers.forEach(function (p) { var rv = p.review || {}; lines.push('已将当前成果送 @' + p.name + ' Review（' + (rv.freq || '每周') + '·' + (rv.content || '阶段成果') + '）'); });
    note.innerHTML = '<div style="max-width:80%;background:#F0F7FF;border:1px solid #DBEAFE;border-radius:10px;padding:8px 14px;font-size:12px;color:#1D4ED8;line-height:1.7;"><i class="fa-solid fa-users-gear" style="font-size:11px;margin-right:6px;"></i>' + lines.join('<br>') + '</div>';
    area.appendChild(note);
  }
  var aiDiv = document.createElement('div');
  aiDiv.style.cssText = 'display:flex;gap:10px;margin-bottom:16px;';
  aiDiv.innerHTML = '<div style="width:28px;height:28px;border-radius:50%;background:#EFF6FF;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-robot" style="font-size:11px;color:#2563EB;"></i></div>'
    + '<div style="max-width:78%;background:white;border:1.5px solid #E5E7EB;border-radius:14px 14px 14px 4px;padding:11px 16px;font-size:13px;line-height:1.7;color:#374151;">' + (mentioned.length ? '已收到指令，正在协调各方智能体协同处理，结果将同步到右侧面板与相关成员。' : '已收到你的指令，正在执行相关分析任务。稍后将输出结果到右侧文件面板。') + '</div>';
  area.appendChild(aiDiv);
  area.scrollTop = area.scrollHeight;
  input.value = '';
}

function openHubNewCourse() {
  var name = prompt('请输入新研究课题名称：', '');
  if (!name) return;
  alert('课题「' + name + '」已创建，进入课题详情页。');
}

// ── UPLOAD & REVIEW MODAL ─────────────────────────────────────────────
var uploadCurrentStep = 1;
var uploadSelectedType = '科研技能';

function openUploadModal() {
  uploadCurrentStep = 1;
  uploadSelectedType = '科研技能';
  // Reset form
  var nameEl = document.getElementById('upload-name');
  var descEl = document.getElementById('upload-desc');
  if (nameEl) nameEl.value = '';
  if (descEl) descEl.value = '';
  document.getElementById('upload-file-list').innerHTML = '';
  // Reset type buttons
  document.querySelectorAll('.upload-type-btn').forEach(function(b, i) {
    if (i === 0) {
      b.style.borderColor = '#2563EB'; b.style.background = '#EFF6FF'; b.style.color = '#2563EB'; b.style.fontWeight = '600';
    } else {
      b.style.borderColor = '#E5E7EB'; b.style.background = 'white'; b.style.color = '#6B7280'; b.style.fontWeight = '400';
    }
  });
  // Show step 1
  showUploadStep(1);
  document.getElementById('upload-backdrop').style.display = 'flex';
}

function closeUploadModal() {
  document.getElementById('upload-backdrop').style.display = 'none';
}

function closeUploadOnBackdrop(e) {
  if (e.target === document.getElementById('upload-backdrop')) closeUploadModal();
}

function selectUploadType(btn, type) {
  uploadSelectedType = type;
  document.querySelectorAll('.upload-type-btn').forEach(function(b) {
    b.style.borderColor = '#E5E7EB'; b.style.background = 'white'; b.style.color = '#6B7280'; b.style.fontWeight = '400';
  });
  btn.style.borderColor = '#2563EB'; btn.style.background = '#EFF6FF'; btn.style.color = '#2563EB'; btn.style.fontWeight = '600';
}

function uploadFileSelected(input) {
  var list = document.getElementById('upload-file-list');
  var files = Array.from(input.files);
  list.innerHTML = '';
  files.forEach(function(f) {
    var ext = f.name.split('.').pop().toLowerCase();
    var iconMap = { py:'fa-brands fa-python', ipynb:'fa-solid fa-book-open', json:'fa-solid fa-brackets-curly', yaml:'fa-solid fa-sliders', pt:'fa-solid fa-cube', zip:'fa-solid fa-file-zipper' };
    var icon = iconMap[ext] || 'fa-solid fa-file';
    var size = f.size > 1024*1024 ? (f.size/1024/1024).toFixed(1)+' MB' : (f.size/1024).toFixed(0)+' KB';
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:9px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:8px 12px;';
    row.innerHTML = '<i class="' + icon + '" style="font-size:16px;color:#6366F1;flex-shrink:0;"></i>'
      + '<div style="flex:1;min-width:0;"><div style="font-size:12.5px;font-weight:600;color:#374151;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + f.name + '</div>'
      + '<div style="font-size:10.5px;color:#9CA3AF;margin-top:1px;">' + size + '</div></div>'
      + '<i class="fa-solid fa-check-circle" style="font-size:14px;color:#10B981;flex-shrink:0;"></i>';
    list.appendChild(row);
  });
}

function showUploadStep(step) {
  uploadCurrentStep = step;
  [1,2,3].forEach(function(n) {
    var panel = document.getElementById('upload-step' + n);
    if (panel) panel.style.display = (n === step) ? 'flex' : 'none';
  });
  // Update step indicator styling
  [1,2,3].forEach(function(n) {
    var el = document.getElementById('ustep-' + n);
    if (!el) return;
    var circle = el.querySelector('div');
    var label = el.querySelector('span');
    if (n < step) {
      el.style.opacity = '1';
      circle.style.background = '#10B981';
      circle.innerHTML = '<i class="fa-solid fa-check" style="font-size:9px;color:white;"></i>';
      label.style.color = '#10B981';
    } else if (n === step) {
      el.style.opacity = '1';
      circle.style.background = '#2563EB';
      circle.innerHTML = n;
      label.style.color = '#2563EB';
    } else {
      el.style.opacity = '0.4';
      circle.style.background = '#D1D5DB';
      circle.innerHTML = n;
      label.style.color = '#6B7280';
    }
  });
  // Footer buttons
  var backBtn = document.getElementById('upload-btn-back');
  var nextBtn = document.getElementById('upload-btn-next');
  if (backBtn) backBtn.style.display = (step > 1 && step < 3) ? 'block' : 'none';
  if (nextBtn) {
    if (step === 1) {
      nextBtn.style.display = 'flex';
      nextBtn.innerHTML = 'AI 合规检测 <i class="fa-solid fa-arrow-right" style="font-size:10px;"></i>';
      nextBtn.onclick = uploadNext;
    } else if (step === 2) {
      nextBtn.style.display = 'flex';
      nextBtn.innerHTML = '提交审核 <i class="fa-solid fa-paper-plane" style="font-size:10px;"></i>';
      nextBtn.onclick = uploadSubmit;
    } else {
      nextBtn.style.display = 'flex';
      nextBtn.innerHTML = '完成';
      nextBtn.onclick = closeUploadModal;
    }
  }
}

function uploadNext() {
  var name = (document.getElementById('upload-name').value || '').trim();
  if (!name) {
    document.getElementById('upload-name').style.borderColor = '#EF4444';
    document.getElementById('upload-name').focus();
    return;
  }
  // Run AI check animation
  showUploadStep(2);
  var checks = [
    { label:'资产信息完整性', ok: true },
    { label:'描述清晰度与规范性', ok: true },
    { label:'文件格式合规', ok: true },
    { label:'知识产权风险扫描', ok: true },
    { label:'功能说明与实际一致性', ok: (document.getElementById('upload-desc').value.length > 10) },
    { label:'安全漏洞初步扫描', ok: true }
  ];
  var container = document.getElementById('upload-check-items');
  var summary = document.getElementById('upload-check-summary');
  container.innerHTML = '';
  summary.innerHTML = '';
  var allPassed = checks.every(function(c) { return c.ok; });
  // Animate items one by one
  checks.forEach(function(c, i) {
    setTimeout(function() {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:white;border-radius:9px;border:1px solid #E5E7EB;';
      row.innerHTML = '<div style="display:flex;align-items:center;gap:8px;">'
        + '<i class="fa-solid fa-spinner fa-spin" style="font-size:13px;color:#9CA3AF;width:16px;"></i>'
        + '<span style="font-size:12.5px;color:#374151;">' + c.label + '</span></div>'
        + '<span style="font-size:11px;color:#9CA3AF;">检测中…</span>';
      container.appendChild(row);
      // Resolve after delay
      setTimeout(function() {
        row.innerHTML = '<div style="display:flex;align-items:center;gap:8px;">'
          + '<i class="fa-solid ' + (c.ok ? 'fa-circle-check' : 'fa-circle-exclamation') + '" style="font-size:13px;color:' + (c.ok ? '#10B981' : '#F59E0B') + ';width:16px;"></i>'
          + '<span style="font-size:12.5px;color:#374151;">' + c.label + '</span></div>'
          + '<span style="font-size:11px;font-weight:600;color:' + (c.ok ? '#10B981' : '#F59E0B') + ';">' + (c.ok ? '通过' : '建议完善') + '</span>';
        // Show summary after last item
        if (i === checks.length - 1) {
          summary.style.background = allPassed ? '#F0FDF4' : '#FFFBEB';
          summary.style.border = '1.5px solid ' + (allPassed ? '#A7F3D0' : '#FDE68A');
          summary.innerHTML = '<i class="fa-solid ' + (allPassed ? 'fa-circle-check' : 'fa-triangle-exclamation') + '" style="font-size:22px;color:' + (allPassed ? '#10B981' : '#F59E0B') + ';flex-shrink:0;"></i>'
            + '<div><div style="font-size:13.5px;font-weight:700;color:#111827;">' + (allPassed ? '检测通过，可提交审核' : '存在建议项，建议完善后提交') + '</div>'
            + '<div style="font-size:11.5px;color:#6B7280;margin-top:2px;">' + (allPassed ? '全部 ' + checks.length + ' 项检测均通过，资产质量良好' : '部分项目建议完善，提交后审核员会重点关注') + '</div></div>';
        }
      }, 600 + i * 200);
    }, i * 120);
  });
}

function uploadBack() {
  showUploadStep(uploadCurrentStep - 1);
}

function uploadSubmit() {
  var name = (document.getElementById('upload-name').value || '').trim() || '未命名资产';
  var now = new Date();
  var timeStr = now.getFullYear() + '/' + (now.getMonth()+1) + '/' + now.getDate()
    + ' ' + now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  var reviewNo = 'REV-' + Math.floor(Math.random()*900000+100000);
  document.getElementById('review-name-display').textContent = name;
  document.getElementById('review-type-display').textContent = uploadSelectedType;
  document.getElementById('review-time-display').textContent = timeStr;
  document.getElementById('review-no-display').textContent = reviewNo;
  document.getElementById('review-submit-time').textContent = timeStr;
  showUploadStep(3);
}

// ══════════════════════════════════════════════════════════
//  V2 DESIGN SHELL — sidebar / header / workbench / hub
// ══════════════════════════════════════════════════════════
var V2_IC = {"home": "<path d=\"M3 10.5 12 3l9 7.5\"/><path d=\"M5 9.5V20h5v-6h4v6h5V9.5\"/>", "hub": "<circle cx=\"12\" cy=\"12\" r=\"2.6\"/><path d=\"M19.6 13.2A7.7 7.7 0 1 1 16.9 6\"/><circle cx=\"18.6\" cy=\"6.6\" r=\"1.4\"/>", "book": "<path d=\"M2.5 5.5C4.5 4.4 7.5 4.3 12 6c4.5-1.7 7.5-1.6 9.5-.5V19c-2-1-5-1.1-9.5.6-4.5-1.7-7.5-1.6-9.5-.6z\"/><path d=\"M12 6v13.6\"/>", "layers": "<path d=\"m12 3 9 5-9 5-9-5z\"/><path d=\"m3 12.2 9 5 9-5\"/><path d=\"m3 16.2 9 5 9-5\"/>", "box": "<path d=\"M21 7.8 12 3 3 7.8v8.4L12 21l9-4.8z\"/><path d=\"m3 7.8 9 4.9 9-4.9\"/><path d=\"M12 12.7V21\"/>", "wrench": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"/>", "flask": "<path d=\"M9 3h6\"/><path d=\"M10 3v6.2L4.6 18.8A1.5 1.5 0 0 0 5.9 21h12.2a1.5 1.5 0 0 0 1.3-2.2L14 9.2V3\"/><path d=\"M7.2 15h9.6\"/>", "assets": "<path d=\"M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z\"/><circle cx=\"13.5\" cy=\"13.5\" r=\"2.4\"/><path d=\"m15.3 15.3 2 2\"/>", "history": "<path d=\"M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5\"/><path d=\"M3.5 3.5v5h5\"/><path d=\"M12 7.5V12l3 2\"/>", "db": "<ellipse cx=\"12\" cy=\"5.5\" rx=\"8\" ry=\"2.8\"/><path d=\"M4 5.5v13c0 1.6 3.6 2.8 8 2.8s8-1.2 8-2.8v-13\"/><path d=\"M4 12c0 1.6 3.6 2.8 8 2.8s8-1.2 8-2.8\"/>", "grid": "<rect x=\"3.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"1.6\"/><rect x=\"13.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"1.6\"/><rect x=\"3.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"1.6\"/><rect x=\"13.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"1.6\"/>", "chev-r": "<path d=\"m9 6 6 6-6 6\"/>", "chev-d": "<path d=\"m6 9 6 6 6-6\"/>", "panel": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2.5\"/><path d=\"M9 4v16\"/>", "search": "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/>", "bell": "<path d=\"M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z\"/><path d=\"M10 20.5a2 2 0 0 0 4 0\"/>", "help": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6\"/><circle cx=\"12\" cy=\"17\" r=\".6\" fill=\"currentColor\"/>", "sparkle": "<path d=\"M12 3v3M12 18v3M3 12h3M18 12h3\"/><path d=\"M12 7.5 13.4 10.6 16.5 12 13.4 13.4 12 16.5 10.6 13.4 7.5 12 10.6 10.6z\"/><path d=\"m5.6 5.6 1.6 1.6M16.8 16.8l1.6 1.6\"/>", "pulse": "<path d=\"M3 12h4l2.6-6.5L14 19l2.6-7H21\"/>", "cpu": "<rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"2\"/><rect x=\"9.5\" y=\"9.5\" width=\"5\" height=\"5\" rx=\"1\"/><path d=\"M9.5 2.5v3.5M14.5 2.5v3.5M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5\"/>", "play": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m10 8.5 5 3.5-5 3.5z\"/>", "stack": "<rect x=\"8\" y=\"8\" width=\"12.5\" height=\"12.5\" rx=\"2\"/><path d=\"M16 8V5.5A2 2 0 0 0 14 3.5H5.5a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2H8\"/>", "chart": "<path d=\"M4 20V4\"/><path d=\"M4 20h16\"/><path d=\"M8.5 16v-4M12.5 16V8M16.5 16v-6\"/>", "file": "<path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z\"/><path d=\"M14 3v5h5\"/><path d=\"M8.5 13h7M8.5 16.5h5\"/>", "bulb": "<path d=\"M9 18h6M10 21h4\"/><path d=\"M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z\"/>", "scroll": "<path d=\"M8 3.5h10.5a2 2 0 0 1 2 2V17\"/><path d=\"M5.5 7H3.5V5.5a2 2 0 0 1 2-2 2 2 0 0 1 2 2V18.5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V17H11.5\"/><path d=\"M11 8h6M11 11.5h6\"/>", "pin": "<path d=\"M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.3\"/>", "plus": "<path d=\"M12 5v14M5 12h14\"/>", "up": "<path d=\"M12 19V5M6 11l6-6 6 6\"/>", "laptop": "<rect x=\"4\" y=\"5\" width=\"16\" height=\"11\" rx=\"1.5\"/><path d=\"M2 19.5h20\"/>", "more": "<circle cx=\"5.5\" cy=\"12\" r=\"1.3\" fill=\"currentColor\"/><circle cx=\"12\" cy=\"12\" r=\"1.3\" fill=\"currentColor\"/><circle cx=\"18.5\" cy=\"12\" r=\"1.3\" fill=\"currentColor\"/>", "check": "<path d=\"m5 12.5 4.5 4.5L19 7.5\"/>", "calc": "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M8.5 7h7\"/><path d=\"M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15h.01M8.5 18h.01M12 18h.01\" stroke-width=\"2.4\"/>", "target": "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"4.5\"/><circle cx=\"12\" cy=\"12\" r=\".8\" fill=\"currentColor\"/>", "quote": "<path d=\"M8 7H5.5A1.5 1.5 0 0 0 4 8.5V12h4v5H4\"/><path d=\"M19 7h-2.5A1.5 1.5 0 0 0 15 8.5V12h4v5h-4\"/>", "list": "<path d=\"M9 6h11M9 12h11M9 18h11\"/><circle cx=\"4.5\" cy=\"6\" r=\".9\" fill=\"currentColor\"/><circle cx=\"4.5\" cy=\"12\" r=\".9\" fill=\"currentColor\"/><circle cx=\"4.5\" cy=\"18\" r=\".9\" fill=\"currentColor\"/>"};
function v2ic(name, size, sw, color) {
  size = size || 16; sw = sw || 1.7;
  return '<svg class="svg-ic" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + sw
    + '" stroke-linecap="round" stroke-linejoin="round"' + (color ? ' style="color:' + color + '"' : '') + '>' + (V2_IC[name] || '') + '</svg>';
}

// ── Sidebar collapse / groups
var v2SbManual = null;   // null = auto (hub collapses), true/false = user override
function toggleSidebar() {
  var c = !document.body.classList.contains('sb-collapsed');
  document.body.classList.toggle('sb-collapsed', c);
  v2SbManual = c;
}
function toggleNavGroup(key) {
  var sub = document.getElementById('sb-sub-' + key);
  if (!sub) return;
  if (document.body.classList.contains('sb-collapsed')) {
    document.body.classList.remove('sb-collapsed'); v2SbManual = false;
    sub.classList.add('open');
    return;
  }
  sub.classList.toggle('open');
}

function v2AfterNav(id) {
  // collapse the sidebar on 科研超级中枢, expand elsewhere (unless the user toggled it)
  var isHub = (id === 'hub' || id === 'hub-new');
  if (v2SbManual === null || isHub) document.body.classList.toggle('sb-collapsed', isHub);
  if (!isHub) v2SbManual = null;

  // header scope label
  var k = document.getElementById('scope-key'), v = document.getElementById('space-label');
  if (k && v) {
    if (isHub || id === 'workbench' || id === 'nav-space-act' || id === 'nav-space-asset') { k.textContent = '课题空间：'; v.textContent = wbCurrentSpace; }
    else { k.textContent = '工作范围：'; v.textContent = '全部项目'; }
  }

  // 科研资产 parent state
  var inAssets = ['nav-assets-dataset', 'nav-assets-space', 'assets-dataset', 'assets-space', 'assets'].indexOf(id) > -1;
  var p = document.getElementById('nav-assets');
  if (p) p.classList.toggle('parent-active', inAssets);
  if (inAssets) { var s = document.getElementById('sb-sub-assets'); if (s) s.classList.add('open'); }
}
(function () {
  var _sp = switchPage, _sa = switchAssetsTab;
  switchPage = function (id) {
    if (id === 'hub-new') id = 'hub';
    _sp(id);
    v2AfterNav(id);
  };
  switchAssetsTab = function (panelId, navId) { _sa(panelId, navId); v2AfterNav(navId); };
})();

// ── Composer (shared)
function cmpSync(prefix) {
  var t = document.getElementById(prefix + '-input'), b = document.getElementById(prefix + '-send');
  if (t && b) b.classList.toggle('ready', !!t.value.trim());
}
function cmpSend(prefix) {
  var t = document.getElementById(prefix + '-input');
  var text = t ? t.value.trim() : '';
  if (!text) { if (t) t.focus(); return; }
  // 首页对话入口：识别到定时任务意图 → 创建定时任务而非直接执行
  if (prefix === 'wb2' && typeof wbLooksLikeSchedule === 'function' && wbLooksLikeSchedule(text)) {
    t.value = ''; cmpSync(prefix);
    wbCreateScheduledTask(text);
    return;
  }
  // 科研超级中枢是入口：在中枢提问 → 跳转到「我的科研任务」三栏工作区并发起对话
  if (prefix === 'hb2' && typeof hubAskToTask === 'function') {
    t.value = ''; cmpSync(prefix);
    if (typeof hubClearAttach === 'function') hubClearAttach();
    if (hubLinkedTask) { hubAskInTask(hubLinkedTask, text); }  // 关联到已有子任务
    else { hubAskToTask(text); }                                // 未选择 → 默认新建
    return;
  }
  t.value = ''; cmpSync(prefix);
  v2StartTask(text);
}
function v2StartTask(text) {
  switchPage('hub');
  openHubCourse('mat');
  document.getElementById('hubd-input').value = text;
  hubdSendMsg();
  v2AddHubTask(text);
}
function v2AddHubTask(text) {
  var list = document.getElementById('hb2-task-list');
  if (!list) return;
  var name = text.length > 22 ? text.slice(0, 22) + '…' : text;
  var el = document.createElement('div');
  el.className = 'hb2-task active';
  el.innerHTML = '<div style="min-width:0;flex:1;"><div class="t"></div><div class="s">运行中</div></div>'
    + '<button class="m" onclick="event.stopPropagation()" title="更多"><svg class="svg-ic" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg></button>';
  el.querySelector('.t').textContent = name;
  el.onclick = function () { hubOpenTask(el, name, 1); };
  list.querySelectorAll('.hb2-task').forEach(function (n) { n.classList.remove('active'); });
  list.insertBefore(el, list.firstChild);
}

// ── 中枢 → 课题空间联动：上传数据 · 发起科研任务 ───────────────────────────
var hubAttachedFile = null;
function hubAttachFile() {
  hubAttachedFile = 'PPE配方数据_0922.xlsx';
  var box = document.getElementById('hb2-attach');
  if (box) { box.style.display = 'flex'; var n = box.querySelector('.name'); if (n) n.textContent = hubAttachedFile; }
  cmpSync('hb2');
  wbToast('已上传数据「' + hubAttachedFile + '」，描述任务即可在课题空间发起');
}
function hubClearAttach() {
  hubAttachedFile = null;
  var box = document.getElementById('hb2-attach');
  if (box) box.style.display = 'none';
}
var HUB_TASK_RE = /性能预测|性质预测|配方(建模|预测|模型|优化建模)|建模|模型构建|构建.*模型|预测模型|回归预测/;
function hubLooksLikeSpaceTask(text) { return HUB_TASK_RE.test(text); }

// 课题空间 · 科研任务数据（默认种子 + 新发起的任务）
var SP_SPACE_TASKS = [
  { t: '柔性丁苯橡胶配方参数计算', src: '配方数据表_v3.xlsx', badge: '运行中', bc: 'run', icon: 'fa-calculator', color: '#2563EB', bg: '#EFF6FF', time: '今天 10:20' },
  { t: '推荐配方实验验证方案', src: '候选配方_Top20.csv', badge: '已完成', bc: 'done', icon: 'fa-flask', color: '#059669', bg: '#ECFDF5', time: '昨天 16:40' }
];
var SP_BADGE = { run: ['运行中', '#1D4ED8', '#DBEAFE'], done: ['已完成', '#047857', '#D1FAE5'], wait: ['待确认', '#B45309', '#FEF3C7'], todo: ['待开始', '#6D28D9', '#EDE9FE'] };
function spRenderTasks() {
  var box = document.getElementById('sp-space-tasks');
  if (!box) return;
  box.innerHTML = SP_SPACE_TASKS.map(function (k) {
    var b = SP_BADGE[k.bc] || SP_BADGE.run;
    var ring = k.isNew ? 'border:1.5px solid #C4B5FD;box-shadow:0 4px 14px rgba(124,58,237,.12);' : 'border:1px solid #E5E7EB;';
    return '<div style="background:white;border-radius:13px;padding:16px;' + ring + 'cursor:pointer;" '
      + 'onmouseover="this.style.boxShadow=\'0 4px 12px rgba(0,0,0,0.07)\'" onmouseout="this.style.boxShadow=\'' + (k.isNew ? '0 4px 14px rgba(124,58,237,.12)' : '') + '\'">'
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">'
      + '<div style="width:36px;height:36px;border-radius:9px;background:' + k.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid ' + k.icon + '" style="color:' + k.color + ';font-size:15px;"></i></div>'
      + '<div style="min-width:0;flex:1;"><div style="font-size:13px;font-weight:700;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + k.t + (k.isNew ? ' <span style="font-size:10px;font-weight:700;color:#7C3AED;background:#F5F3FF;border-radius:20px;padding:1px 7px;margin-left:2px;">新</span>' : '') + '</div><div style="font-size:11px;color:#9CA3AF;margin-top:1px;">' + k.time + '</div></div>'
      + '<span style="font-size:10px;font-weight:600;color:' + b[1] + ';background:' + b[2] + ';border-radius:20px;padding:2px 9px;flex-shrink:0;">' + b[0] + '</span>'
      + '</div>'
      + '<div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#6B7280;background:#F9FAFB;border-radius:8px;padding:7px 10px;"><i class="fa-solid fa-paperclip" style="font-size:10px;color:#9CA3AF;"></i>关联数据：' + k.src + '</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:11px;padding-top:11px;border-top:1px solid #F1F3F7;">'
      + '<div style="display:flex;align-items:center;">' + (typeof memAvatarStack === 'function' ? memAvatarStack(24) : '') + '</div>'
      + '<button onclick="event.stopPropagation();openMembersModal()" style="font-size:11px;font-weight:600;color:#2563EB;border:1px solid #DBEAFE;background:#EFF6FF;border-radius:7px;padding:4px 10px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;"><i class="fa-solid fa-user-plus" style="font-size:9px;"></i>成员与协作</button>'
      + '</div>'
      + '</div>';
  }).join('');
}
function hubLaunchSpaceTask(text) {
  var file = hubAttachedFile || '对话发起';
  var title = (typeof wbCleanTitle === 'function' ? wbCleanTitle(text) : text) || '配方数据性能预测';
  if (title.length > 24) title = title.slice(0, 24) + '…';
  SP_SPACE_TASKS.unshift({ t: title, src: file, badge: '运行中', bc: 'run', icon: 'fa-chart-line', color: '#7C3AED', bg: '#F5F3FF', time: '刚刚', isNew: true });
  hubClearAttach();
  if (typeof hubAskToTask === 'function') hubAskToTask(text);
  if (typeof wbToast === 'function') wbToast('已在课题空间 · 我的科研任务创建科研任务');
}

// 从模板一键创建：项目空间即生成一个初始科研任务并跳转
function hubCreateFromTemplate(name) {
  var map = {
    '计算生物学研究任务': ['fa-dna', '#2563EB', '#EFF6FF'],
    '计算化学研究任务': ['fa-flask', '#059669', '#ECFDF5'],
    '机器学习研究任务': ['fa-robot', '#7C3AED', '#F5F3FF'],
    '计算物理学研究任务': ['fa-atom', '#DB2777', '#FCE7F3'],
    '通用科研任务': ['fa-microscope', '#B45309', '#FEF3C7'],
    '橡胶研发任务 test': ['fa-folder', '#2563EB', '#EFF6FF']
  };
  var m = map[name] || ['fa-flask', '#2563EB', '#EFF6FF'];
  SP_SPACE_TASKS.unshift({ t: name + ' · 初始科研任务', src: '模板预置数据集', badge: '待开始', bc: 'todo', icon: m[0], color: m[1], bg: m[2], time: '刚刚', isNew: true });
  if (typeof enterTaskWorkspace === 'function') enterTaskWorkspace();
  if (typeof wbToast === 'function') wbToast('已从模板创建「' + name + '」，已进入科研任务工作区');
}

// 打开示例研究：进入对话空间演示对话
function hubOpenExample(name) {
  if (typeof v2StartTask === 'function') v2StartTask(name);
}

// ── 模板 → 新建项目配置弹窗 → 基于模板的智能体对话 ─────────────────────────
var HUB_TEMPLATES = {
  '计算生物学研究任务': {
    emoji: '🧬', iconBg: '#2563EB',
    desc: '计算生物学项目 —— 查真实数据库、沙箱分析、带来源作答。',
    md: '## 项目目标（计算生物学）\n针对给定的生物学问题或数据，开展系统化的 data-to-answer 分析，产出可追溯来源、可复现的结论。\n\n## 领域补充\n- **生物事实**：绝不编造序列 / 通路 / 亲和力 / 坐标 / accession；对照 UniProt / KEGG / Ensembl / NCBI / STRING / PDB。\n- **入口 skill**：在 `research-methodology` 之上加载 `computational-biology` 做生信 / 生物库路由。\n- **Real Data Only** / Skill-First / 交付审查：以专家 Agent 基座与预绑定 skill 为准。',
    agents: ['计算生物学主智能体', '生信分析 Agent'],
    sims: ['AlphaFold', 'GROMACS'],
    apps: ['UniProt', 'KEGG', 'NCBI BLAST', 'PDB'],
    experts: ['计算生物学专家'],
    skills: ['科研方法论', '学术研究', '数据分析', '计算生物学'],
    kb: [],
    welcome: {
      title: '计算生物学研究助手',
      intro: '你好！我可以从数据库检索、序列/结构分析到通路解读，帮你完成端到端的计算生物学研究。请描述你的问题，或上传数据开始分析。',
      paths: [
        ['数据库检索 · 真实来源', '对接 UniProt / KEGG / NCBI / PDB，检索并核对序列、通路与结构，全部带来源'],
        ['序列与结构分析', '比对、注释、结构预测与功能推断，沙箱内可复现执行'],
        ['通路与网络解读', '基于 KEGG / STRING 做富集与网络分析，输出可解释结论'],
        ['报告生成', '汇总分析过程与证据，生成可追溯的研究报告']
      ],
      chips: ['检索某蛋白的功能注释', '预测该序列的三级结构', '做通路富集分析', '生成分析报告']
    }
  },
  '计算化学研究任务': {
    emoji: '🧪', iconBg: '#059669',
    desc: '化学信息学、分子设计、对接、ADMET，与系统化的化学 data-to-answer 工作流。',
    md: '## 项目目标（计算化学）\n围绕分子设计与性质预测，开展系统化的 data-to-answer 分析，产出可追溯、可复现的结论。\n\n## 领域补充\n- **化学事实**：绝不编造 SMILES / 活性 / 物性；对照 PubChem / ChEMBL / RCSB。\n- **入口 skill**：在 `research-methodology` 之上加载 `computational-chemistry` 做化学信息学 / 对接路由。\n- **Real Data Only** / Skill-First / 交付审查：以专家 Agent 基座与预绑定 skill 为准。',
    agents: ['计算化学主智能体', '分子对接 Agent'],
    sims: ['RDKit', 'AutoDock Vina', 'Gaussian'],
    apps: ['PubChem', 'ChEMBL', 'RCSB PDB'],
    experts: ['计算化学专家'],
    skills: ['科研方法论', '分子设计', '对接与筛选', 'ADMET 预测'],
    kb: [],
    welcome: {
      title: '计算化学研究助手',
      intro: '你好！我支持分子设计、虚拟筛选、对接与 ADMET 预测的全流程分析。请描述你的目标，或上传分子/靶点数据开始。',
      paths: [
        ['分子设计与生成', '基于骨架跃迁 / 生成模型给出候选分子并评估可合成性'],
        ['虚拟筛选与对接', '对接打分与结合模式分析，输出 Top 候选'],
        ['ADMET 与性质预测', '预测溶解度、毒性、代谢稳定性等关键性质'],
        ['报告生成', '汇总证据与来源，生成可追溯的研究报告']
      ],
      chips: ['为该靶点做虚拟筛选', '预测这批分子的 ADMET', '优化先导化合物', '生成分析报告']
    }
  },
  '机器学习研究任务': {
    emoji: '🤖', iconBg: '#7C3AED',
    desc: '端到端机器学习研究 —— 训练、评估，与系统化的 data-to-answer 工作流。',
    md: '## 项目目标（机器学习）\n围绕给定任务开展端到端建模：数据准备 → 训练 → 评估 → 解释，产出可复现、可追溯的结论。\n\n## 领域补充\n- **可复现**：固定随机种子、记录数据版本与超参；实验以沙箱脚本为准。\n- **入口 skill**：在 `research-methodology` 之上加载 `machine-learning` 做建模 / 评估路由。\n- **Real Data Only** / Skill-First / 交付审查：以专家 Agent 基座与预绑定 skill 为准。',
    agents: ['机器学习主智能体', '实验跟踪 Agent'],
    sims: ['PyTorch', 'scikit-learn'],
    apps: ['Weights & Biases', 'Hugging Face'],
    experts: ['机器学习专家'],
    skills: ['科研方法论', '数据分析', '模型训练', '模型评估'],
    kb: [],
    welcome: {
      title: '机器学习研究助手',
      intro: '你好！我可以帮你完成从数据准备到模型训练、评估与解释的端到端建模。请描述任务，或上传数据集开始。',
      paths: [
        ['数据准备与探索', '清洗、特征工程与数据划分，记录数据版本'],
        ['模型训练', '在沙箱中训练并跟踪实验，固定种子保证可复现'],
        ['评估与解释', '交叉验证、指标对比与可解释性分析'],
        ['报告生成', '汇总实验与结论，生成可追溯的研究报告']
      ],
      chips: ['探索这份数据集', '训练一个基线模型', '做交叉验证对比', '生成分析报告']
    }
  },
  '计算物理学研究任务': {
    emoji: '⚛️', iconBg: '#DB2777',
    desc: '仿真、PDE 求解、动力系统，与系统化的物理 data-to-answer 工作流。',
    md: '## 项目目标（计算物理学）\n围绕仿真与数值求解开展系统化分析，产出可复现、可追溯的结论。\n\n## 领域补充\n- **数值可靠**：记录网格 / 步长 / 收敛判据；结果以沙箱脚本复现为准。\n- **入口 skill**：在 `research-methodology` 之上加载 `computational-physics` 做仿真 / 求解路由。\n- **Real Data Only** / Skill-First / 交付审查：以专家 Agent 基座与预绑定 skill 为准。',
    agents: ['计算物理主智能体', '数值仿真 Agent'],
    sims: ['COMSOL', 'OpenFOAM', 'FEniCS'],
    apps: ['Materials Project'],
    experts: ['计算物理学专家'],
    skills: ['科研方法论', '数值仿真', 'PDE 求解', '动力系统'],
    kb: [],
    welcome: {
      title: '计算物理学研究助手',
      intro: '你好！我支持仿真建模、PDE 数值求解与动力系统分析。请描述物理问题，或上传模型参数开始。',
      paths: [
        ['建模与离散', '建立控制方程并选择合适的离散方案'],
        ['数值求解', '在沙箱中求解并检查网格无关性与收敛'],
        ['结果分析', '可视化场量、提取关键指标并做误差评估'],
        ['报告生成', '汇总方法与结论，生成可追溯的研究报告']
      ],
      chips: ['建立该问题的控制方程', '做网格无关性分析', '可视化仿真结果', '生成分析报告']
    }
  },
  '通用科研任务': {
    emoji: '🔬', iconBg: '#B45309',
    desc: '跨学科科研：文献、沙箱分析与带来源作答。',
    md: '## 项目目标（通用科研）\n针对研究问题，开展文献调研 + 沙箱分析的 data-to-answer 流程，产出带来源、可复现的结论。\n\n## 领域补充\n- **来源可追溯**：结论均标注文献 / 数据来源。\n- **入口 skill**：加载 `research-methodology` 统筹检索、分析与作答。\n- **Real Data Only** / Skill-First / 交付审查：以专家 Agent 基座与预绑定 skill 为准。',
    agents: ['科研主智能体'],
    sims: ['Python 沙箱'],
    apps: ['Google Scholar', 'Semantic Scholar'],
    experts: ['科研方法论专家'],
    skills: ['科研方法论', '文献调研', '数据分析'],
    kb: [],
    welcome: {
      title: '通用科研助手',
      intro: '你好！我可以帮你完成文献调研、数据分析与带来源作答。请描述你的研究问题开始。',
      paths: [
        ['文献调研', '系统检索并归纳相关工作，标注来源'],
        ['沙箱分析', '在沙箱中分析数据，结果可复现'],
        ['证据作答', '基于证据给出结论，全部可追溯'],
        ['报告生成', '汇总过程与结论，生成研究报告']
      ],
      chips: ['调研这个方向的最新进展', '分析这份数据', '总结关键结论', '生成分析报告']
    }
  },
  '橡胶研发任务 test': {
    emoji: '📁', iconBg: '#2563EB', custom: true,
    desc: '复用你保存的橡胶配方研发流程模板，一键生成初始科研任务。',
    md: '## 项目目标（橡胶研发）\n面向橡胶配方从新品开发到降本优化的全流程决策，结合实验数据构建性能预测模型。\n\n## 领域补充\n- **配方事实**：以真实实验/物料数据为准，记录牌号、配比与管控规格。\n- **入口 skill**：加载 `formulation-modeling` 做配方建模 / 降本路由。\n- **Real Data Only** / Skill-First / 交付审查：以专家 Agent 基座与预绑定 skill 为准。',
    agents: ['配方优化主智能体', '性能预测 Agent'],
    sims: ['贝叶斯优化器', 'DOE 实验设计'],
    apps: ['实验数据平台 ELN', '物料价格库'],
    experts: ['高分子材料专家', '橡胶工艺专家'],
    skills: ['科研方法论', '配方建模', '性能预测', '降本分析'],
    kb: ['橡胶配方知识库'],
    welcome: {
      title: '共混配方优化',
      intro: '你好！我支持从新品开发到降本优化的全流程配方决策，可根据你的数据现状自动匹配最适合的分析路径。请描述你的配方需求，或上传已有实验数据开始建模。',
      paths: [
        ['新产品设计 · 无历史数据', '针对全新体系，通过 DOE 模拟生成训练集，构建 f(x₁…xₙ) 预测模型，寻找最佳性能配方'],
        ['新产品设计 · 已有数据重建模', '基于客户实验数据或已积累的体系数据，重新拟合或优化预测模型'],
        ['降本优化', '原材料组分不变，仅调整各组分比例，以最低原料成本为目标重新计算最优配比'],
        ['配方库查询', '已建模体系直接检索，输出满足性能约束的最优配方与预测结果']
      ],
      chips: ['PBT 201 系列降本分析', '更新 MI 管控规格', '查看候选推荐结果', '生成分析报告']
    }
  }
};
var npCurrent = null;
function openNewProjectModal(key) {
  var tpl = HUB_TEMPLATES[key];
  if (!tpl) return;
  npCurrent = key;
  var setTx = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
  var setVal = function (id, v) { var e = document.getElementById(id); if (e) e.value = v; };
  document.getElementById('np-tpl-name').innerHTML = '<span>' + tpl.emoji + '  ' + key + '</span><i class="fa-solid fa-chevron-down" style="font-size:11px;color:#9CA3AF;"></i>';
  var ico = document.getElementById('np-icon');
  if (ico) { ico.textContent = tpl.emoji; ico.style.background = tpl.iconBg; ico.style.color = '#fff'; }
  setVal('np-name', key);
  setVal('np-desc', tpl.desc);
  setVal('np-md', tpl.md);
  npDescCount();
  // 预置智能体与工具
  var caps = '';
  var grp = function (label, arr, icon) {
    if (!arr || !arr.length) return '';
    return '<div class="np-capgrp"><div class="l">' + label + '</div>' + arr.map(function (x) {
      return '<span class="np-chip"><i class="fa-solid ' + icon + '" style="font-size:10px;"></i>' + x + '</span>';
    }).join('') + '</div>';
  };
  caps += grp('智能体', tpl.agents, 'fa-robot');
  caps += grp('仿真软件', tpl.sims, 'fa-cube');
  caps += grp('接入应用', tpl.apps, 'fa-plug');
  document.getElementById('np-caps').innerHTML = caps || '<div class="np-hint">该模板暂无预置智能体与工具</div>';
  // 专家 / 技能 / 知识库
  var tags = function (arr) {
    if (!arr || !arr.length) return '<div class="np-hint">暂无</div>';
    return arr.map(function (x) { return '<span class="np-tag">' + x + '<i class="fa-solid fa-xmark"></i></span>'; }).join('');
  };
  document.getElementById('np-experts').innerHTML = tags(tpl.experts);
  document.getElementById('np-skills').innerHTML = tags(tpl.skills);
  document.getElementById('np-kb').innerHTML = tags(tpl.kb);
  document.getElementById('np-bd').classList.add('open');
}
function closeNewProject() { document.getElementById('np-bd').classList.remove('open'); }
function npDescCount() {
  var e = document.getElementById('np-desc'), c = document.getElementById('np-desc-count');
  if (e && c) c.textContent = (e.value || '').length + ' / 500';
}
function npInsertRule() {
  var e = document.getElementById('np-md');
  if (!e) return;
  e.value += (e.value.trim() ? '\n\n' : '') + '## 干活规则\n- 结论必须带来源，禁止编造数据。\n- 分析在沙箱中执行并可复现。\n- 交付前自检：目标是否达成、证据是否充分。';
}
function createProjectFromModal() {
  var name = (document.getElementById('np-name').value || '').trim() || npCurrent || '新项目';
  var tpl = HUB_TEMPLATES[npCurrent] || HUB_TEMPLATES['通用科研任务'];
  closeNewProject();
  enterTemplateChat(name, tpl);
  if (typeof wbToast === 'function') wbToast('项目「' + name + '」已创建，进入智能体对话');
}
function enterTemplateChat(name, tpl) {
  switchPage('hub');
  var home = document.getElementById('hub-home'); if (home) home.style.display = 'none';
  var det = document.getElementById('hub-detail'); if (det) det.style.display = 'flex';
  document.getElementById('hub-single-pane').style.display = 'none';
  document.getElementById('hub-three-pane').style.display = 'flex';
  if (typeof hubTaskChrome === 'function') { hubTaskInited = true; hubTaskChrome(); }
  if (typeof switchHubcTab === 'function') switchHubcTab('chat');
  if (typeof switchHubdTab === 'function') switchHubdTab('home');
  if (typeof switchHubrTab === 'function') switchHubrTab('traj');
  // 左侧项目树
  var tree = document.getElementById('hub-tree-name'); if (tree) tree.textContent = name;
  var sName = document.getElementById('hub-session-name'); if (sName) sName.textContent = '新对话';
  // 右侧沙盒文件（参考图3设计）
  if (typeof renderHubSandbox === 'function') renderHubSandbox();
  // 中间：模板欢迎卡 + 路径 + 建议问法
  var w = tpl.welcome || { title: name, intro: '', paths: [], chips: [] };
  var dots = ['#2563EB', '#059669', '#7C3AED', '#EA580C', '#0891B2'];
  var paths = (w.paths || []).map(function (p, i) {
    var c = dots[i % dots.length];
    return '<div style="display:flex;gap:14px;align-items:flex-start;padding:10px 12px;border-radius:12px;transition:background .15s;" onmouseover="this.style.background=\'#F6F8FC\'" onmouseout="this.style.background=\'\'">'
      + '<span style="width:9px;height:9px;border-radius:50%;background:' + c + ';margin-top:6px;flex-shrink:0;box-shadow:0 0 0 4px ' + c + '1F;"></span>'
      + '<div style="min-width:0;"><div style="font-size:13.5px;font-weight:700;color:#1F2937;margin-bottom:3px;">' + p[0] + '</div>'
      + '<div style="font-size:12.5px;color:#8A94A6;line-height:1.65;">' + p[1] + '</div></div></div>';
  }).join('');
  var chips = (w.chips || []).map(function (c) {
    return '<button onclick="hubTemplateChip(this)" style="font-size:12.5px;color:#475467;border:none;border-radius:10px;padding:8px 14px;background:#F3F5F9;cursor:pointer;font-family:inherit;transition:background .15s;" onmouseover="this.style.background=\'#E7ECF4\'" onmouseout="this.style.background=\'#F3F5F9\'">' + c + '</button>';
  }).join('');
  var eyebrow = function (t) { return '<div style="font-size:11.5px;font-weight:600;color:#AEB6C4;letter-spacing:.05em;margin-bottom:8px;">' + t + '</div>'; };
  var area = document.getElementById('hub-chat-area');
  area.innerHTML =
    '<div style="max-width:720px;">'
    + '<div style="position:relative;overflow:hidden;background:linear-gradient(120deg,#2563EB 0%,#1D4ED8 58%,#1E40AF 100%);border-radius:18px;padding:22px 26px;margin-bottom:26px;box-shadow:0 10px 26px rgba(37,99,235,.20);">'
    +   '<div style="position:absolute;right:-40px;top:-40px;width:200px;height:200px;background:radial-gradient(circle,rgba(255,255,255,.16),transparent 70%);pointer-events:none;"></div>'
    +   '<div style="position:relative;display:flex;gap:14px;align-items:flex-start;">'
    +     '<div style="width:46px;height:46px;border-radius:13px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:23px;flex-shrink:0;">' + tpl.emoji + '</div>'
    +     '<div style="min-width:0;padding-top:1px;"><div style="font-size:18px;font-weight:800;color:#fff;letter-spacing:-.01em;margin-bottom:7px;">' + w.title + '</div>'
    +     '<div style="font-size:13px;color:rgba(255,255,255,.92);line-height:1.7;">' + w.intro + '</div></div>'
    +   '</div>'
    + '</div>'
    + (paths ? eyebrow('我可以帮你') + '<div style="margin-bottom:28px;margin-left:-4px;">' + paths + '</div>' : '')
    + (chips ? eyebrow('试试这样开始') + '<div style="display:flex;flex-wrap:wrap;gap:8px;">' + chips + '</div>' : '')
    + '</div>';
  area.scrollTop = 0;
  if (typeof renderMemberAvatars === 'function') renderMemberAvatars();
}
function hubTemplateChip(btn) {
  var el = document.getElementById('hubd-input-3');
  if (el) { el.value = btn.textContent; el.focus(); }
}

// ── 协作成员 · @艾特 · 送审 Review ───────────────────────────────────────
var HUB_PEOPLE = [
  { id: 'me', name: '我', ini: '我', color: '#2563EB', team: '配方优化课题', role: '负责人', in: true, fixed: true },
  { id: 'p1', name: '张伟', ini: '张', color: '#059669', team: '配方组', role: '成员', in: true },
  { id: 'p2', name: '李娜', ini: '李', color: '#7C3AED', team: '表征组', role: '成员', in: false },
  { id: 'p3', name: '王强', ini: '王', color: '#DB2777', team: '仿真组', role: '成员', in: false },
  { id: 'p4', name: '陈敏', ini: '陈', color: '#B45309', team: '数据组', role: '成员', in: false },
  { id: 'r1', name: '刘教授', ini: '刘', color: '#0891B2', team: '评审委员会', role: '评审人', in: false, review: { freq: '每周', content: '阶段成果' } },
  { id: 'r2', name: '赵主任', ini: '赵', color: '#EA580C', team: '项目管理', role: '评审人', in: false, review: { freq: '每两周', content: '分析报告' } }
];
function memBy(id) { for (var i = 0; i < HUB_PEOPLE.length; i++) if (HUB_PEOPLE[i].id === id) return HUB_PEOPLE[i]; return null; }
function memAva(p, sz) { sz = sz || 26; return '<span style="width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:' + p.color + ';color:#fff;font-size:' + (sz * 0.42) + 'px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">' + p.ini + '</span>'; }
function renderMemberAvatars() {
  var box = document.getElementById('hubd-member-avatars');
  if (!box) return;
  var ins = HUB_PEOPLE.filter(function (p) { return p.in; });
  var show = ins.slice(0, 4);
  var html = show.map(function (p, i) { return '<span style="margin-left:' + (i ? -8 : 0) + 'px;border:2px solid #fff;border-radius:50%;">' + memAva(p, 26) + '</span>'; }).join('');
  if (ins.length > 4) html += '<span style="margin-left:-8px;border:2px solid #fff;width:26px;height:26px;border-radius:50%;background:#E5E7EB;color:#6B7280;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;">+' + (ins.length - 4) + '</span>';
  box.innerHTML = html;
}
// 头像堆叠（返回 HTML 字符串，供任务卡片等复用）
function memAvatarStack(sz) {
  sz = sz || 24;
  var ins = HUB_PEOPLE.filter(function (p) { return p.in; });
  var show = ins.slice(0, 4);
  var html = show.map(function (p, i) { return '<span style="margin-left:' + (i ? -8 : 0) + 'px;border:2px solid #fff;border-radius:50%;display:inline-flex;">' + memAva(p, sz) + '</span>'; }).join('');
  if (ins.length > 4) html += '<span style="margin-left:-8px;border:2px solid #fff;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:#EEF1F6;color:#6B7280;font-size:' + (sz * 0.4) + 'px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;">+' + (ins.length - 4) + '</span>';
  return html;
}
// 右栏切换：目标规划 / 沙盒文件
function switchHubrTab(tab) {
  if (tab === 'log') tab = 'traj';
  ['traj', 'files'].forEach(function (t) {
    var pane = document.getElementById('hubr-pane-' + t);
    var btn = document.getElementById('hubr-tab-' + t);
    if (pane) pane.style.display = (t === tab) ? 'flex' : 'none';
    if (btn) {
      var on = (t === tab);
      btn.style.color = on ? '#2563EB' : '#8A94A6';
      btn.style.borderBottomColor = on ? '#2563EB' : 'transparent';
      btn.style.fontWeight = on ? '700' : '500';
    }
  });
}

// ── 对话轨迹（对话内执行日志）──────────────────────────────────────
var TRAJ_META = {
  user:      { label: '用户', badgeBg: '#EFF6FF', badgeColor: '#2563EB', lane: 0, laneColor: '#3B5573' },
  assistant: { label: '助手', badgeBg: '#F5F3FF', badgeColor: '#7C3AED', lane: 1, laneColor: '#A78BFA' },
  tool:      { label: '工具', badgeBg: '#FEF3C7', badgeColor: '#B45309', lane: 2, laneColor: '#F59E0B' }
};
var TRAJ_EVENTS = [
  { type: 'user', round: 1, dur: '—', text: '帮我构建石墨烯吸附锂原子的结构，并预测最稳定的吸附位点。' },
  { type: 'tool', round: 1, dur: '0.8s', tool: 'bash', args: '{"command":"find workflows -name \'*.yaml\'"}', result: 'workflows/adsorption_modeling/spec.yaml, workflows/dft_relax/spec.yaml …' },
  { type: 'tool', round: 1, dur: '1.1s', tool: 'grep', args: '{"pattern":"supercell","path":"backend/src"}', result: 'test_adsorption_modeling_tool.py:40, structure_builder.py:118 …' },
  { type: 'assistant', round: 1, dur: '2.3s', text: '项目里已经具备完整的吸附建模能力（AdsorptionModelingService），并有石墨烯基底与 Li 原子的现成结构，我先检索已有数据。' },
  { type: 'tool', round: 2, dur: '0.6s', tool: 'bash', args: '{"command":"sqlite3 aisim.sqlite \'SELECT id,name FROM structures WHERE name LIKE \\"%graphene%\\"\'"}', result: 'mp_1018134|graphene_2x2, mp_48|graphene_prim …' },
  { type: 'tool', round: 2, dur: '0.5s', tool: 'bash', args: '{"command":"sqlite3 aisim.sqlite \'SELECT id,name FROM structures WHERE name=\\"li_atom\\"\'"}', result: 'li_atom|Li atom (isolated)' },
  { type: 'assistant', round: 2, dur: '1.9s', text: '已找到 graphene_2x2 基底与 Li 原子结构。接下来枚举 top / bridge / hollow 三类吸附位点并各生成一个初始构型。' },
  { type: 'tool', round: 3, dur: '3.4s', tool: 'ask_user_question', args: '{"question":"选择石墨烯基底类型","options":["单层石墨烯","双层石墨烯","带缺陷石墨烯"]}', result: '{"answers":[{"id":"slab_type","selected":["单层石墨烯"]}]}' },
  { type: 'user', round: 3, dur: '—', text: '用单层石墨烯，吸附位点先算 hollow 位。' },
  { type: 'tool', round: 4, dur: '2.7s', tool: 'read', args: '{"path":"backend/src/aisim/services/adsorption_modeling.py"}', result: 'class AdsorptionModelingService: def build_adsorbed_slab(self, slab, adsorbate, site) …' },
  { type: 'assistant', round: 4, dur: '2.1s', text: '调用 build_adsorbed_slab，在 hollow 位放置 Li，构建 4×4 超胞并设置 15Å 真空层。' },
  { type: 'tool', round: 5, dur: '5.6s', tool: 'python', args: '{"code":"svc.build_adsorbed_slab(slab=graphene_2x2, adsorbate=li_atom, site=\'hollow\')"}', result: '== structures/model-17bce.cif 已生成（56 原子，含 1 个 Li） ==' },
  { type: 'tool', round: 6, dur: '48.2s', tool: 'submit_job', args: '{"workflow":"dft_relax","structure":"model-17bce","calc":"PBE+D3"}', result: 'job-579c 已提交 → 结构弛豫完成，E_ads = -1.62 eV' },
  { type: 'assistant', round: 6, dur: '2.4s', text: 'hollow 位吸附能 E_ads = -1.62 eV，较 top(-0.71 eV)、bridge(-0.88 eV) 更稳定，与文献报道一致。已将结构与结果存入沙盒。' },
  { type: 'user', round: 7, dur: '—', text: '把三个位点的吸附能整理成一张对比表。' },
  { type: 'tool', round: 7, dur: '1.3s', tool: 'python', args: '{"code":"df.to_csv(\'Eads_compare.csv\')"}', result: '== Eads_compare.csv 已生成（3 行：top/bridge/hollow）==' },
  { type: 'assistant', round: 7, dur: '1.6s', text: '对比表已生成并保存为 Eads_compare.csv，最稳定吸附位点为 hollow（-1.62 eV）。是否继续做扩散路径（NEB）分析？' }
];
var trajFilter = 'all';
var trajView = 'dur';
function trajSearchText(e) {
  var m = TRAJ_META[e.type] || {};
  return [m.label, e.text || '', e.tool || '', e.args || '', e.result || ''].join(' ');
}
function switchHubcTab(tab) {
  var chat = document.getElementById('hubc-pane-chat');
  var traj = document.getElementById('hubc-pane-traj');
  if (chat) chat.style.display = (tab === 'chat') ? 'flex' : 'none';
  if (traj) traj.style.display = (tab === 'traj') ? 'flex' : 'none';
  [['hubc-tab-chat', tab === 'chat'], ['hubc-tab-traj', tab === 'traj']].forEach(function (p) {
    var b = document.getElementById(p[0]); if (!b) return;
    b.style.color = p[1] ? '#2563EB' : '#8A94A6';
    b.style.fontWeight = p[1] ? '700' : '500';
    b.style.borderBottomColor = p[1] ? '#2563EB' : 'transparent';
  });
  if (tab === 'traj') renderTraj();
}
function trajSetFilter(f) {
  trajFilter = f;
  document.querySelectorAll('.traj-fchip').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-f') === f); });
  renderTraj();
}
function trajSetView(v) {
  trajView = v;
  ['dur', 'round', 'call'].forEach(function (k) {
    var b = document.getElementById('traj-view-' + k); if (!b) return;
    var on = (k === v);
    b.style.background = on ? 'white' : 'transparent';
    b.style.color = on ? '#2563EB' : '#6B7280';
    b.style.fontWeight = on ? '600' : '500';
    b.style.boxShadow = on ? '0 1px 2px rgba(0,0,0,.06)' : 'none';
  });
  renderTraj();
}
function trajEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function trajMeta(e) {
  var m = TRAJ_META[e.type] || TRAJ_META.assistant;
  if (trajView === 'round') return '轮次 ' + (e.round || '-');
  if (trajView === 'call') return e.type === 'tool' ? (e.tool || 'tool') : m.label;
  return e.dur || '—';
}
function trajRow(e) {
  var m = TRAJ_META[e.type] || TRAJ_META.assistant;
  var badge = '<span class="traj-badge" style="background:' + m.badgeBg + ';color:' + m.badgeColor + ';">' + m.label + '</span>';
  var meta = '<span style="font-size:10.5px;color:#B4BAC6;flex-shrink:0;margin-left:auto;padding-left:8px;">' + trajEsc(trajMeta(e)) + '</span>';
  var body;
  if (e.type === 'tool') {
    var args = e.args ? ' <span style="color:#9CA3AF;">' + trajEsc(e.args) + '</span>' : '';
    var res = e.result ? '<div style="margin-top:4px;font-size:11.5px;color:#6B7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><span style="color:#22A06B;">→</span> ' + trajEsc(e.result) + '</div>' : '';
    body = '<div style="min-width:0;flex:1;">'
      + '<div class="traj-mono" style="color:#1F2937;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + trajEsc(e.tool) + args + '</div>'
      + res + '</div>';
  } else {
    body = '<div style="min-width:0;flex:1;font-size:12.5px;line-height:1.55;color:' + (e.type === 'user' ? '#1F2937' : '#374151') + ';' + (e.type === 'user' ? 'font-weight:600;' : '') + '">' + trajEsc(e.text) + '</div>';
  }
  return '<div class="traj-row">' + badge + body + meta + '</div>';
}
function renderTrajTimeline(events) {
  var box = document.getElementById('traj-timeline'); if (!box) return;
  box.innerHTML = events.map(function (e) {
    var m = TRAJ_META[e.type] || TRAJ_META.assistant;
    function cell(i) { return '<span style="flex:1;border-radius:1px;background:' + (i === m.lane ? m.laneColor : '#F0F2F6') + ';"></span>'; }
    return '<div title="' + trajEsc(m.label + '：' + (e.text || e.tool || '')) + '" style="flex:1 1 0;min-width:2px;display:flex;flex-direction:column;gap:2px;">' + cell(0) + cell(1) + cell(2) + '</div>';
  }).join('');
}
function renderTraj() {
  var qEl = document.getElementById('traj-search');
  var q = (qEl && qEl.value ? qEl.value : '').trim().toLowerCase();
  var searched = TRAJ_EVENTS.filter(function (e) { return !q || trajSearchText(e).toLowerCase().indexOf(q) > -1; });
  var counts = { all: searched.length, user: 0, assistant: 0, tool: 0 };
  searched.forEach(function (e) { if (counts[e.type] != null) counts[e.type]++; });
  ['all', 'user', 'assistant', 'tool'].forEach(function (k) {
    var el = document.getElementById('traj-c-' + k); if (el) el.textContent = counts[k];
  });
  var totalDur = TRAJ_EVENTS.reduce(function (s, e) { var n = parseFloat(e.dur); return s + (isNaN(n) ? 0 : n); }, 0);
  var rounds = TRAJ_EVENTS.reduce(function (mx, e) { return Math.max(mx, e.round || 0); }, 0);
  var calls = TRAJ_EVENTS.filter(function (e) { return e.type === 'tool'; }).length;
  var sm = document.getElementById('traj-summary');
  if (sm) sm.textContent = '时长 ' + totalDur.toFixed(1) + 's · 轮次 ' + rounds + ' · 调用 ' + calls;
  renderTrajTimeline(searched);
  var list = searched.filter(function (e) { return trajFilter === 'all' || e.type === trajFilter; });
  var box = document.getElementById('traj-list'); if (!box) return;
  if (!list.length) {
    box.innerHTML = '<div style="text-align:center;color:#9CA3AF;font-size:12.5px;padding:40px 0;">没有匹配的轨迹</div>';
    return;
  }
  box.innerHTML = list.map(trajRow).join('');
}
function trajExport() {
  var sn = (document.getElementById('hub-session-name') || {}).textContent || '对话';
  var lines = ['# 对话轨迹导出', '', '会话：' + sn, '导出时间：' + new Date().toLocaleString(), '总轮次：' + TRAJ_EVENTS.reduce(function (mx, e) { return Math.max(mx, e.round || 0); }, 0), ''];
  TRAJ_EVENTS.forEach(function (e, i) {
    var m = TRAJ_META[e.type] || {};
    if (e.type === 'tool') {
      lines.push((i + 1) + '. [工具] ' + e.tool + (e.args ? ' ' + e.args : ''));
      if (e.result) lines.push('   → ' + e.result);
    } else {
      lines.push((i + 1) + '. [' + (m.label || '') + '] ' + (e.text || ''));
    }
  });
  var blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = '对话轨迹_' + Date.now() + '.md';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  if (typeof wbToast === 'function') wbToast('轨迹已导出为 Markdown 文件');
}

// ── 子对话数据模型：对话/轨迹/目标规划/沙盒文件/执行日志 随子对话动态变化 ──
var HUB_SESSIONS = {
  '橡胶配方与性能预测': {
    chat: [
      { role: 'user', text: '为运动型乘用车轮胎开发锡偶联 SSBR 新牌号，设计一批分子结构使纯胶 Tg 达到 -35±5℃，串行迭代用分子动力学预测 Tg。' },
      { role: 'ai', text: '已读取项目记忆与 17 个专利配方。将按串行策略：设计候选 → RDKit 校验 → RadonPy MD 预测 Tg，不达标自动规划下一候选。先给出候选 C1/C2/C3。' },
      { role: 'user', text: '先按方案 A 覆盖策略推进，禁用 Fox 方程。' },
      { role: 'ai', text: '已确认方案 A、禁用 Fox。C1/C2/C3 已建链校验，正在提交 MD 预测；当前推荐 Top5，最高分 81.04。' }
    ],
    traj: [
      { type: 'user', round: 1, dur: '—', text: '设计一批 SSBR 分子结构，使纯胶 Tg 达到 -35±5℃。' },
      { type: 'tool', round: 1, dur: '0.7s', tool: 'bash', args: '{"command":"sqlite3 aisim.sqlite \'SELECT id,tg FROM recipes\'"}', result: '17 条专利配方与历史 Tg 已载入' },
      { type: 'assistant', round: 1, dur: '2.1s', text: '已加载专利配方与历史 Tg 数据，按苯乙烯结合量与 1,2-乙烯基比例设计候选 C1/C2/C3。' },
      { type: 'tool', round: 2, dur: '3.2s', tool: 'python', args: '{"code":"rdkit.build([C1,C2,C3]); Chem.SanitizeMol()"}', result: 'C1/C2/C3 SMILES 校验通过，Fox Tg ≈ -36.5 / -30.1 / -39.8℃' },
      { type: 'assistant', round: 2, dur: '1.8s', text: 'RDKit 校验通过。注意 MD 单次 Tg 不确定度远超 ±5℃，仅作趋势筛选。' },
      { type: 'tool', round: 3, dur: '52.4s', tool: 'submit_job', args: '{"workflow":"radonpy_md","structure":"C1"}', result: 'job-17bce 完成 → C1 Tg(MD) ≈ -38.2℃' },
      { type: 'user', round: 4, dur: '—', text: '先按方案 A 覆盖策略推进，禁用 Fox 方程。' },
      { type: 'tool', round: 4, dur: '2.9s', tool: 'ask_user_question', args: '{"question":"确认覆盖策略","options":["方案A","方案B"]}', result: '{"answers":[{"selected":["方案A"]}]}' },
      { type: 'assistant', round: 4, dur: '2.3s', text: '已按方案 A 生成 Top5 推荐（最高分 81.04），均满足拉伸强度 >13 MPa。' }
    ],
    plan: {
      agent: '认知智能体', agentId: 'builtin:matl_coordinator', bindLabel: '绑定实验', bindSub: '5 个 · 下一批 1 项',
      steps: [
        { t: '候选筛选与预测', id: 7, state: 'done' },
        { t: '聚合物选材（数字研发）', id: 3, state: 'run' },
        { t: '配方优化（数字小试）', id: 4, state: 'wait' },
        { t: '模流分析（数字试模）', id: 5, state: 'wait' },
        { t: '结论与决策', id: 6, state: 'wait' }
      ]
    },
    files: [
      { type: 'folder', name: 'results' },
      { type: 'file', name: 'PLAN.md', size: '6 KB', ext: 'DOC' },
      { type: 'file', name: 'candidate_C2.json', size: '12 KB', ext: 'JSON' },
      { type: 'file', name: 'Tg_trend_summary.csv', size: '4 KB', ext: 'CSV' },
      { type: 'file', name: 'cell.cif', size: '48 KB', ext: 'CSV' }
    ],
    log: [
      { time: '10:20:03', tag: 'OK', msg: '任务已创建：柔性丁苯橡胶配方参数计算' },
      { time: '10:20:11', tag: 'RUN', msg: 'RadonPy MD 环境初始化…' },
      { time: '10:21:47', tag: 'RUN', msg: '候选 C1 建链中（RDKit 校验通过）' },
      { time: '10:24:02', tag: 'WARN', msg: 'MD 单次 Tg 不确定度 &gt; ±5℃，转趋势筛选' },
      { time: '10:26:35', tag: 'RUN', msg: '候选 C2 / C3 派发至 UCX 环境' },
      { time: '10:29:18', tag: 'ERR', msg: 'C1 POLYMER_BUILD_FAILED，疑似 SMILES 问题' }
    ]
  },
  '储层渗透率预测方案': {
    chat: [
      { role: 'user', text: '基于核磁共振与测井曲线数据，构建页岩储层渗透率的机器学习预测模型，并评估盲测井段泛化能力。' },
      { role: 'ai', text: '已检索相关文献 89 篇并载入岩心与测井数据集。建议先做特征相关性分析与数据预处理，再进入建模。你希望从哪个维度优先展开？' }
    ],
    traj: [
      { type: 'user', round: 1, dur: '—', text: '构建页岩储层渗透率的机器学习预测模型。' },
      { type: 'tool', round: 1, dur: '1.4s', tool: 'search', args: '{"query":"shale permeability NMR logging ML"}', result: '命中 89 篇核心文献，已建立分类体系' },
      { type: 'assistant', round: 1, dur: '2.0s', text: '已整理 89 篇文献并完成孔隙度测井解释综述草稿，建议先做特征相关性分析。' },
      { type: 'tool', round: 2, dur: '2.6s', tool: 'python', args: '{"code":"df.corr(); preprocess(nmr, logs)"}', result: '生成相关性矩阵；剔除 3 个高共线特征' },
      { type: 'assistant', round: 2, dur: '1.7s', text: '数据预处理完成，进入初版模型评估（RandomForest / XGBoost 对比）。' }
    ],
    plan: {
      agent: '认知智能体', agentId: 'builtin:geo_coordinator', bindLabel: '预测流程', bindSub: '5 步 · 当前第 2 步',
      steps: [
        { t: '文献调研与数据整理', id: 11, state: 'done' },
        { t: '特征相关性分析与预处理', id: 12, state: 'run' },
        { t: '特征工程', id: 13, state: 'wait' },
        { t: '模型训练与调参', id: 14, state: 'wait' },
        { t: '盲测井段泛化评估', id: 15, state: 'wait' }
      ]
    },
    files: [
      { type: 'folder', name: 'results' },
      { type: 'file', name: '核磁共振数据集.xlsx', size: '1.2 MB', ext: 'CSV' },
      { type: 'file', name: '测井曲线.csv', size: '340 KB', ext: 'CSV' },
      { type: 'file', name: '储层分析报告草稿.docx', size: '88 KB', ext: 'DOC' }
    ],
    log: [
      { time: '09:12:40', tag: 'OK', msg: '任务已创建：储层渗透率预测方案' },
      { time: '09:13:05', tag: 'RUN', msg: '载入核磁共振与测井数据集…' },
      { time: '09:15:22', tag: 'OK', msg: '特征相关性矩阵已生成' },
      { time: '09:16:01', tag: 'WARN', msg: '检测到 3 个高共线特征，已剔除' },
      { time: '09:18:33', tag: 'RUN', msg: 'RandomForest / XGBoost 初版训练中…' }
    ]
  }
};
var hubCurrentSession = '橡胶配方与性能预测';
function hubNow() {
  var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
  return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
}
function hubGenericSession(name) {
  return {
    chat: [
      { role: 'user', text: name },
      { role: 'ai', text: '已创建「' + name + '」子对话，正在理解目标并规划执行步骤……' }
    ],
    traj: [
      { type: 'user', round: 1, dur: '—', text: name },
      { type: 'assistant', round: 1, dur: '1.2s', text: '已理解任务目标，开始拆解与规划。' }
    ],
    plan: {
      agent: '认知智能体', agentId: 'builtin:matl_coordinator', bindLabel: '目标节点', bindSub: '规划中',
      steps: [
        { t: '任务拆解与规划', state: 'run' },
        { t: '执行与验证', state: 'wait' },
        { t: '结论与决策', state: 'wait' }
      ]
    },
    files: [],
    log: [{ time: hubNow(), tag: 'OK', msg: '子对话已创建：' + name }]
  };
}
function renderHubChat(chat) {
  var area = document.getElementById('hub-chat-area');
  if (!area) return;
  if (!chat || !chat.length) { area.innerHTML = ''; return; }
  area.innerHTML = chat.map(function (m) {
    if (m.role === 'user') return '<div style="display:flex;justify-content:flex-end;margin-bottom:16px;"><div style="max-width:70%;background:#2563EB;color:white;border-radius:14px 14px 4px 14px;padding:11px 16px;font-size:13px;line-height:1.6;">' + m.text + '</div></div>';
    return '<div style="display:flex;gap:10px;margin-bottom:16px;"><div style="width:28px;height:28px;border-radius:50%;background:#EFF6FF;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-robot" style="font-size:11px;color:#2563EB;"></i></div><div style="max-width:78%;background:white;border:1.5px solid #E5E7EB;border-radius:14px 14px 14px 4px;padding:11px 16px;font-size:13px;line-height:1.7;color:#374151;">' + m.text + '</div></div>';
  }).join('');
}
function renderHubPlan(plan) {
  var box = document.getElementById('hub-plan-body');
  if (!box) return;
  if (!plan || !plan.steps || !plan.steps.length) {
    box.innerHTML = '<div style="text-align:center;padding:48px 16px;color:#C4CAD4;"><i class="fa-solid fa-diagram-project" style="font-size:26px;margin-bottom:10px;display:block;"></i><div style="font-size:12px;color:#9CA3AF;">发起任务后将在此生成目标规划</div></div>';
    return;
  }
  var STY = { done: ['#059669', '已完成'], run: ['#2563EB', '进行中'], wait: ['#9CA3AF', '待执行'] };
  var head = '<div style="display:flex;gap:11px;align-items:center;padding:16px 16px 14px;">'
    + '<div style="width:38px;height:38px;border-radius:11px;background:#F0F4FA;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-robot" style="font-size:16px;color:#5B6B85;"></i></div>'
    + '<div style="min-width:0;"><div style="font-size:14px;font-weight:700;color:#1F2937;">' + (plan.agent || '认知智能体') + '</div>'
    + '<div style="font-size:11px;color:#9CA3AF;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">' + (plan.agentId || 'builtin:coordinator') + '</div></div></div>'
    + '<div style="padding:0 16px 10px;display:flex;align-items:baseline;gap:8px;"><span style="font-size:12.5px;font-weight:700;color:#374151;">' + (plan.bindLabel || '目标节点') + '</span><span style="font-size:11px;color:#9CA3AF;">' + (plan.bindSub || '') + '</span></div>';
  var body = '<div style="position:relative;padding:2px 14px 18px;"><div style="position:absolute;left:26px;top:14px;bottom:30px;width:2px;background:#EAEEF4;"></div>';
  plan.steps.forEach(function (s, i) {
    var st = STY[s.state] || STY.wait, active = (s.state === 'run');
    var num = active
      ? '<div style="width:26px;height:26px;border-radius:50%;background:#2563EB;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;box-shadow:0 0 0 4px #2563EB1A;">' + (i + 1) + '</div>'
      : '<div style="width:26px;height:26px;border-radius:50%;background:#EEF3FB;color:#2563EB;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;">' + (i + 1) + '</div>';
    var card = '<div style="flex:1;min-width:0;background:' + (active ? '#fff' : '#F8FAFD') + ';border:' + (active ? '1.5px solid #2563EB' : '1px solid #EDEFF4') + ';' + (active ? 'box-shadow:0 4px 12px rgba(37,99,235,.13);' : '') + 'border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:8px;cursor:pointer;">'
      + '<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:700;color:#1F2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + s.t + '</div><div style="font-size:11px;color:#9CA3AF;margin-top:2px;">' + (s.id ? ('ID:' + s.id + ' ') : '') + '<span style="color:' + st[0] + ';font-weight:600;margin-left:4px;">' + st[1] + '</span></div></div>'
      + (active ? '<span style="font-size:10.5px;font-weight:700;color:#fff;background:#2563EB;border-radius:20px;padding:3px 9px;flex-shrink:0;white-space:nowrap;">» 当前</span>' : '<i class="fa-solid fa-chevron-right" style="font-size:10px;color:#C4CAD4;flex-shrink:0;"></i>')
      + '</div>';
    body += '<div style="display:flex;gap:12px;margin-bottom:9px;position:relative;">' + num + card + '</div>';
  });
  body += '</div>';
  box.innerHTML = head + body;
}
function renderHubLog(log) {
  var box = document.getElementById('hub-log-body');
  if (!box) return;
  var TAG = { OK: '#059669', RUN: '#2563EB', WARN: '#D97706', ERR: '#DC2626' };
  if (!log || !log.length) { box.innerHTML = '<div style="color:#9CA3AF;">暂无执行日志</div>'; return; }
  box.innerHTML = log.map(function (l) {
    return '<div><span style="color:#B6BECB;">' + l.time + '</span> <span style="color:' + (TAG[l.tag] || '#6B7280') + ';font-weight:600;">[' + l.tag + ']</span> ' + l.msg + '</div>';
  }).join('');
}
function hubSetActiveRow(name) {
  document.querySelectorAll('.hub-sess').forEach(function (r) { r.classList.toggle('active', r.getAttribute('data-sess') === name); });
}
// 渲染某个子对话的全部视图（对话/轨迹/目标规划/沙盒文件/执行日志）
function renderHubSession(name) {
  var s = HUB_SESSIONS[name] || hubGenericSession(name);
  hubCurrentSession = name;
  var nm = document.getElementById('hub-session-name'); if (nm) nm.textContent = name;
  renderHubChat(s.chat);
  TRAJ_EVENTS = s.traj || [];
  if (typeof trajFilter !== 'undefined') trajFilter = 'all';
  renderHubPlan(s.plan);
  if (typeof renderHubSandbox === 'function') renderHubSandbox(s.files || []);
  hubSetActiveRow(name);
  if (typeof switchHubcTab === 'function') switchHubcTab('chat');
  if (typeof switchHubrTab === 'function') switchHubrTab('traj');
}
// 点击左侧子对话行 → 切换该子对话的全部视图
function hubOpenSession(el) {
  var name = el.getAttribute('data-sess');
  if (!name) return;
  renderHubSession(name);
}

// ── 沙盒文件（参考图3设计）────────────────────────────────────────
var HUB_SANDBOX_SEED = [
  { type: 'folder', name: 'results' },
  { type: 'file', name: 'remote_recover-r5c_run.sh', size: '682 B', ext: 'SH' },
  { type: 'file', name: 'remote_recover-r5c_job_cmd.sh', size: '2 KB', ext: 'SH' },
  { type: 'file', name: 'remote_recover-r5b_job_cmd.sh', size: '2 KB', ext: 'SH' },
  { type: 'file', name: 'remote_recover-r5b_run.sh', size: '682 B', ext: 'SH' },
  { type: 'file', name: 'remote_recover-r5_run.sh', size: '681 B', ext: 'SH' },
  { type: 'file', name: 'remote_recover-r5_job_cmd.sh', size: '3 KB', ext: 'SH' },
  { type: 'file', name: 'candidate_C2.json', size: '12 KB', ext: 'JSON' },
  { type: 'file', name: 'Tg_trend_summary.csv', size: '4 KB', ext: 'CSV' },
  { type: 'file', name: 'analysis_report.docx', size: '88 KB', ext: 'DOC' }
];
var HUB_SBX_STYLE = {
  SH:   { ic: 'fa-code',       clr: '#7C3AED', bg: '#F3E8FF' },
  JSON: { ic: 'fa-brackets-curly', clr: '#D97706', bg: '#FEF3C7' },
  CSV:  { ic: 'fa-file-csv',   clr: '#059669', bg: '#D1FAE5' },
  DOC:  { ic: 'fa-file-word',  clr: '#2563EB', bg: '#DBEAFE' },
  _def: { ic: 'fa-file',       clr: '#6B7280', bg: '#F3F4F6' }
};
function hubSbxActBtn(icon, title, onclick) {
  return '<button class="sbx-tip" data-tip="' + title + '" aria-label="' + title + '" onclick="event.stopPropagation();' + (onclick || '') + '" style="position:relative;width:24px;height:24px;border-radius:6px;border:none;background:transparent;cursor:pointer;color:#9CA3AF;display:flex;align-items:center;justify-content:center;" '
    + 'onmouseover="this.style.background=\'#EEF2F7\';this.style.color=\'#2563EB\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'#9CA3AF\'"><i class="fa-solid ' + icon + '" style="font-size:11px;"></i></button>';
}
function hubSbxRow(f) {
  if (f.type === 'folder') {
    return '<div style="display:flex;align-items:center;gap:12px;padding:11px 13px;border:1px solid #EEF0F4;border-radius:12px;margin-bottom:10px;cursor:pointer;background:#fff;transition:box-shadow .15s;" onmouseover="this.style.boxShadow=\'0 2px 10px rgba(0,0,0,.06)\'" onmouseout="this.style.boxShadow=\'\'">'
      + '<div style="width:40px;height:40px;border-radius:10px;background:#DBEAFE;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-folder" style="font-size:16px;color:#2563EB;"></i></div>'
      + '<div style="flex:1;min-width:0;"><div style="font-size:13.5px;color:#1F2937;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + f.name + '</div></div>'
      + '<i class="fa-solid fa-chevron-right" style="font-size:12px;color:#C3C9D4;flex-shrink:0;"></i>'
      + '</div>';
  }
  var st = HUB_SBX_STYLE[f.ext] || HUB_SBX_STYLE._def;
  return '<div style="display:flex;align-items:center;gap:12px;padding:11px 13px;border:1px solid #EEF0F4;border-radius:12px;margin-bottom:10px;cursor:pointer;background:#fff;transition:box-shadow .15s;" onmouseover="this.style.boxShadow=\'0 2px 10px rgba(0,0,0,.06)\';this.querySelector(\'.hub-sbx-act\').style.opacity=\'1\'" onmouseout="this.style.boxShadow=\'\';this.querySelector(\'.hub-sbx-act\').style.opacity=\'0\'">'
    + '<div style="width:40px;height:40px;border-radius:10px;background:' + st.bg + ';display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;flex-shrink:0;">'
    +   '<i class="fa-solid ' + st.ic + '" style="font-size:13px;color:' + st.clr + ';"></i>'
    +   '<span style="font-size:7.5px;font-weight:800;color:' + st.clr + ';letter-spacing:.4px;">' + f.ext + '</span>'
    + '</div>'
    + '<div style="flex:1;min-width:0;">'
    +   '<div style="font-size:13px;color:#1F2937;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + f.name + '</div>'
    +   '<div style="font-size:12px;color:#9CA3AF;margin-top:2px;">' + (f.size || '') + '</div>'
    + '</div>'
    + '<div class="hub-sbx-act" style="display:flex;gap:1px;opacity:0;transition:opacity .15s;flex-shrink:0;">'
    +   hubSbxActBtn('fa-folder-plus', '共享到空间') + hubSbxActBtn('fa-code-branch', '血缘链', 'openProvenance(\'' + (f.name || '').replace(/'/g, "\\'") + '\')') + hubSbxActBtn('fa-download', '下载') + hubSbxActBtn('fa-trash-can', '删除')
    + '</div>'
    + '</div>';
}
function renderHubSandbox(list) {
  var files = list || HUB_SANDBOX_SEED;
  var box = document.getElementById('hub-files-list');
  var cnt = document.getElementById('hub-files-count');
  if (cnt) cnt.textContent = '共 ' + files.length + ' 个';
  if (!box) return;
  if (!files.length) {
    box.innerHTML = '<div style="text-align:center;padding-top:40px;color:#D1D5DB;"><i class="fa-solid fa-folder-open" style="font-size:28px;margin-bottom:10px;display:block;"></i><div style="font-size:12px;color:#9CA3AF;">发起提问后将自动生成</div></div>';
    return;
  }
  box.innerHTML = files.map(hubSbxRow).join('');
}

// ── 文件溯源（血缘链 / Reproduce / 修改历史）─────────────────────────────
function provEsc(t) { return (t == null ? '' : String(t)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
// 血缘链一行：kind = 'file' | 'gen' | 'from'，indent 层级
function provLineRow(node) {
  var pad = 12 + (node.indent || 0) * 22;
  if (node.kind === 'file') {
    return '<div style="display:flex;align-items:center;gap:7px;padding:3px 0;padding-left:' + pad + 'px;"><i class="fa-regular fa-file-lines" style="font-size:12px;color:#2563EB;"></i><span class="traj-mono" style="font-size:12.5px;color:#1F2937;font-weight:600;">' + provEsc(node.text) + '</span></div>';
  }
  var tag = node.kind === 'from'
    ? '<span style="font-size:11px;font-weight:700;color:#7C3AED;background:#F5F3FF;border-radius:5px;padding:1px 6px;flex-shrink:0;">派生自</span>'
    : '<span style="font-size:11px;font-weight:700;color:#059669;background:#ECFDF5;border-radius:5px;padding:1px 6px;flex-shrink:0;">生成</span>';
  var icon = node.kind === 'from'
    ? '<i class="fa-regular fa-file-lines" style="font-size:11px;color:#9CA3AF;flex-shrink:0;"></i>'
    : '<i class="fa-solid fa-terminal" style="font-size:10px;color:#9CA3AF;flex-shrink:0;"></i>';
  return '<div style="display:flex;align-items:center;gap:7px;padding:3px 0;padding-left:' + pad + 'px;color:#6B7280;">'
    + '<span style="color:#C7CDD8;flex-shrink:0;">└</span>' + tag + icon
    + '<span class="traj-mono" style="font-size:12px;color:#6B7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + provEsc(node.text) + '</span></div>';
}
function provHistRow(h) {
  return '<div style="border:1px solid #EEF0F4;border-radius:12px;padding:13px 15px;margin-bottom:12px;background:#fff;">'
    + '<div style="display:flex;align-items:center;gap:7px;margin-bottom:9px;">'
    +   '<span style="font-size:11px;font-weight:600;color:#6B7280;background:#F3F4F6;border-radius:6px;padding:2px 9px;">' + provEsc(h.type || '代码执行') + '</span>'
    +   '<span style="font-size:11px;font-weight:600;color:#6B7280;background:#F3F4F6;border-radius:6px;padding:2px 9px;">' + provEsc(h.op || '修改') + '</span>'
    +   (h.current ? '<span style="font-size:11px;font-weight:700;color:#fff;background:#2563EB;border-radius:6px;padding:2px 9px;">当前</span>' : '')
    +   '<span style="margin-left:auto;font-size:12px;color:#9CA3AF;">' + provEsc(h.time) + '</span>'
    + '</div>'
    + '<div class="traj-mono" style="font-size:12px;color:#374151;line-height:1.6;word-break:break-all;margin-bottom:9px;">' + provEsc(h.cmd) + '</div>'
    + '<a onclick="wbToast&&wbToast(\'已跳转到对应会话位置\')" style="display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:#2563EB;cursor:pointer;"><i class="fa-regular fa-comment-dots" style="font-size:11px;"></i>在对话中定位</a>'
    + '</div>';
}
function provData(name) {
  var proj = '/app/ekc_sandbox/projects/aipw_1788332854248_5i7k5wp08';
  return {
    file: name || 'PLAN.md',
    lineage: [
      { kind: 'file', indent: 0, text: name || 'PLAN.md' },
      { kind: 'gen', indent: 1, text: "sh -c cat > " + (name || 'PLAN.md') + " << 'PLANEOF' # 计划：运动型乘用车轮胎 SSBR" },
      { kind: 'from', indent: 1, text: '20260913_081157_execute_command_call_5f567717234a4a56a5d4d' },
      { kind: 'gen', indent: 2, text: "sh -c cat > " + (name || 'PLAN.md') + " << 'PLANEOF' # 计划：运动型乘用车轮胎 SSBR" },
      { kind: 'gen', indent: 1, text: 'sh -c cat > ' + proj + '/5i…' },
      { kind: 'from', indent: 1, text: '20260914_071612_execute_command_call_8909d9269f0c4a4890f96' },
      { kind: 'gen', indent: 2, text: 'sh -c cat > ' + proj + '/…' },
      { kind: 'gen', indent: 1, text: 'sh -c echo "Waiting 5 minutes before first poll... $(date)"' },
      { kind: 'from', indent: 1, text: '20260913_102453_execute_command_call_35dcd99db86d41109331b' },
      { kind: 'gen', indent: 2, text: 'sh -c echo "Waiting 5 minutes before first poll... $(date)"' },
      { kind: 'gen', indent: 1, text: "sh -c cat > /tmp/" + (name || 'PLAN.md') + " << 'PLAN_EOF' # 运动型乘用车轮胎用锡偶联" },
      { kind: 'from', indent: 1, text: '20260914_024417_execute_command_call_32ab1bd752c74ebb894e5' },
      { kind: 'gen', indent: 2, text: "sh -c cat > /tmp/" + (name || 'PLAN.md') + " << 'PLAN_EOF' # 运动型乘用车轮胎用锡偶" }
    ],
    codeFile: '_code/20260913_081157_execute_command_call_5f567717234a4a5…',
    reproCmd: 'uv run --python ' + proj + '/…',
    history: [
      { type: '代码执行', op: '修改', current: true, time: '2026/9/14 18:10:40', cmd: 'uv run --python ' + proj + '/5i7k5wp08/…' },
      { type: '代码执行', op: '修改', time: '2026/9/14 16:34:42', cmd: 'uv run --python ' + proj + '/5i7k5wp08/…' },
      { type: '命令执行', op: '修改', time: '2026/9/14 16:09:48', cmd: "sh -c cat > /tmp/" + (name || 'PLAN.md') + " << 'PLAN_EOF'" },
      { type: '代码执行', op: '修改', time: '2026/9/13 10:24:53', cmd: 'sh -c echo "Waiting 5 minutes before first poll..."' },
      { type: '命令执行', op: '修改', time: '2026/9/13 08:11:57', cmd: "sh -c cat > " + (name || 'PLAN.md') + " << 'PLANEOF'" }
    ],
    histCount: 8, histSessions: 8
  };
}
function openProvenance(name) {
  var d = provData(name);
  var old = document.getElementById('prov-backdrop'); if (old) old.remove();
  var bd = document.createElement('div');
  bd.id = 'prov-backdrop';
  bd.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(3px);z-index:9500;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:40px 20px;';
  bd.onclick = function (e) { if (e.target === bd) closeProvenance(); };
  var lineage = d.lineage.map(provLineRow).join('');
  var hist = d.history.map(provHistRow).join('');
  bd.innerHTML = '<div style="width:640px;max-width:100%;background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(15,23,42,.28);overflow:hidden;">'
    + '<div style="display:flex;align-items:flex-start;gap:10px;padding:22px 26px 14px;position:relative;">'
    +   '<i class="fa-solid fa-clock-rotate-left" style="font-size:17px;color:#2563EB;margin-top:2px;"></i>'
    +   '<div style="min-width:0;"><div style="font-size:18px;font-weight:800;color:#111827;">文件溯源</div>'
    +     '<div style="font-size:13px;color:#9CA3AF;margin-top:3px;" class="traj-mono">' + provEsc(d.file) + '</div></div>'
    +   '<button onclick="closeProvenance()" style="position:absolute;top:18px;right:18px;width:30px;height:30px;border:none;border-radius:8px;background:#F3F4F6;color:#6B7280;cursor:pointer;font-size:14px;">✕</button>'
    + '</div>'
    + '<div style="max-height:70vh;overflow-y:auto;padding:0 26px 26px;">'
    // 血缘链
    +   '<div style="font-size:15px;font-weight:700;color:#111827;margin:8px 0 12px;">血缘链</div>'
    +   '<div style="border:1px solid #EEF0F4;border-radius:12px;padding:12px 14px;background:#FAFBFD;">' + lineage + '</div>'
    // Reproduce
    +   '<div style="font-size:15px;font-weight:700;color:#111827;margin:24px 0 8px;">Reproduce</div>'
    +   '<div style="font-size:12.5px;color:#8A94A6;line-height:1.7;margin-bottom:14px;">跳转到产生该文件的会话，编辑复现提示词并确认后自动发送（不会静默执行）。best-effort，未钉死环境锁。</div>'
    +   '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="font-size:12.5px;color:#6B7280;flex-shrink:0;">对应代码文件：</span><span class="traj-mono" style="font-size:12px;color:#374151;background:#F3F4F6;border-radius:7px;padding:5px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + provEsc(d.codeFile) + '</span></div>'
    +   '<div class="traj-mono" style="font-size:12.5px;color:#374151;border:1px solid #E5E7EB;border-radius:9px;padding:11px 13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:12px;">' + provEsc(d.reproCmd) + '</div>'
    +   '<button onclick="wbToast&&wbToast(\'已跳转到对应会话，请确认复现提示词后发送\')" style="display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:#374151;border:1px solid #E5E7EB;background:#fff;border-radius:9px;padding:9px 16px;cursor:pointer;" onmouseover="this.style.background=\'#F9FAFB\'" onmouseout="this.style.background=\'#fff\'"><i class="fa-solid fa-rotate-left" style="font-size:12px;"></i>Reproduce</button>'
    // 修改历史
    +   '<div style="font-size:15px;font-weight:700;color:#111827;margin:26px 0 6px;">修改历史</div>'
    +   '<div style="font-size:12.5px;color:#8A94A6;margin-bottom:14px;">共 ' + d.histCount + ' 次修改，涉及 ' + d.histSessions + ' 个会话</div>'
    +   hist
    + '</div>'
    + '</div>';
  document.body.appendChild(bd);
}
function closeProvenance() {
  var bd = document.getElementById('prov-backdrop'); if (bd) bd.remove();
}

// 新建任务文件夹（左侧树追加一个空文件夹）
var hubFolderSeq = 2;
// 展开/收起文件夹
function hubToggleFolder(hdr) {
  var open = hdr.getAttribute('data-open') === '1';
  var body = hdr.parentNode.querySelector('.hub-fold-body');
  var chev = hdr.querySelector('.hub-fold-chev');
  var folderIco = hdr.querySelector('i.fa-regular');
  if (open) {
    if (body) body.style.display = 'none';
    hdr.setAttribute('data-open', '0');
    if (chev) { chev.className = 'fa-solid fa-chevron-right hub-fold-chev'; chev.style.color = '#9CA3AF'; }
    if (folderIco) folderIco.className = 'fa-regular fa-folder';
  } else {
    if (body) body.style.display = '';
    hdr.setAttribute('data-open', '1');
    if (chev) { chev.className = 'fa-solid fa-chevron-down hub-fold-chev'; chev.style.color = '#2563EB'; }
    if (folderIco) folderIco.className = 'fa-regular fa-folder-open';
  }
}
// 在当前文件夹内新建对话，插到「+ 新建对话」之前；作为独立子对话，可切换五视图
var hubNewChatSeq = 0;
function hubNewChat(el, ev) {
  if (ev) ev.stopPropagation();
  hubNewChatSeq++;
  var name = '新对话 ' + hubNewChatSeq;
  // 注册一个空白子对话数据（对话/轨迹/规划/文件随之动态）
  HUB_SESSIONS[name] = hubGenericSession(name);
  var row = document.createElement('div');
  row.className = 'hub-sess';
  row.setAttribute('data-sess', name);
  row.setAttribute('onclick', 'hubOpenSession(this)');
  row.innerHTML = '<span class="hub-sess-dot"></span><span class="hub-sess-lbl">' + name + '</span>';
  // 从文件夹头部的「+」触发：展开该文件夹并把新对话追加到其列表末尾
  var folder = el.closest ? el.closest('.hub-folder') : null;
  var body = folder ? folder.querySelector('.hub-fold-body') : null;
  if (body) {
    var hdr = folder.querySelector('[data-open]');
    if (hdr && hdr.getAttribute('data-open') !== '1') hubToggleFolder(hdr);
    body.appendChild(row);
  } else if (el.parentNode) {
    el.parentNode.insertBefore(row, el);
  }
  renderHubSession(name);
}
// 新建任务文件夹（image-4 风格，可折叠；产出视图/成员菜单在文件夹层级）
function hubAddFolder() {
  var list = document.getElementById('hub-tree-list');
  if (!list) return;
  hubFolderSeq++;
  var name = '新建任务 ' + hubFolderSeq;
  var folder = document.createElement('div');
  folder.className = 'hub-folder';
  folder.style.cssText = 'margin-top:4px;';
  var nameEsc = name.replace(/'/g, "\\'");
  folder.innerHTML =
    '<div onclick="hubToggleFolder(this)" data-open="1" style="display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;background:#EFF5FF;border-radius:9px;margin-bottom:2px;" onmouseover="this.querySelector(\'.hub-fold-actions\').style.opacity=\'1\'" onmouseout="this.querySelector(\'.hub-fold-actions\').style.opacity=\'0\'">'
    + '<i class="fa-solid fa-chevron-down hub-fold-chev" style="font-size:9px;color:#2563EB;flex-shrink:0;"></i>'
    + '<i class="fa-regular fa-folder-open" style="font-size:13px;color:#2563EB;flex-shrink:0;"></i>'
    + '<span style="font-size:12.5px;font-weight:700;color:#1D4ED8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;">' + name + '</span>'
    + '<span style="font-size:10px;font-weight:700;color:#7C3AED;background:#F5F3FF;border-radius:20px;padding:1px 7px;flex-shrink:0;">新</span>'
    + '<div class="hub-fold-actions" style="display:flex;gap:1px;opacity:0;transition:opacity .15s;flex-shrink:0;">'
    +   '<i class="fa-solid fa-plus" title="新建对话" onclick="hubNewChat(this,event)" style="font-size:12px;color:#2563EB;padding:4px;cursor:pointer;border-radius:5px;" onmouseover="this.style.background=\'#DCEAFE\'" onmouseout="this.style.background=\'\'"></i>'
    +   '<i class="fa-solid fa-table-columns" title="任务产出视图" onclick="event.stopPropagation();openTaskOutput(\'' + nameEsc + '\')" style="font-size:11px;color:#2563EB;padding:4px;cursor:pointer;border-radius:5px;" onmouseover="this.style.background=\'#DCEAFE\'" onmouseout="this.style.background=\'\'"></i>'
    +   '<i class="fa-solid fa-ellipsis" title="任务成员与协作" onclick="hubFolderMenu(event,this,\'' + nameEsc + '\')" style="font-size:13px;color:#2563EB;padding:4px;cursor:pointer;border-radius:5px;" onmouseover="this.style.background=\'#DCEAFE\'" onmouseout="this.style.background=\'\'"></i>'
    + '</div>'
    + '</div>'
    + '<div class="hub-fold-body" style="padding-left:9px;"></div>';
  list.appendChild(folder);
  if (typeof wbToast === 'function') wbToast('已新建任务「' + name + '」');
}
// 文件夹（任务）右侧 ⋯ 菜单：查看任务成员与协作，可展开选择更多协作人
function hubFolderMenu(ev, anchor, folderName) {
  ev.stopPropagation();
  var old = document.getElementById('hub-folder-pop');
  var reopen = old && old.getAttribute('data-for') === folderName;
  if (old) old.remove();
  if (reopen) return;
  var ins = HUB_PEOPLE.filter(function (p) { return p.in; });
  var rows = ins.map(function (p) {
    var rc = p.role === '负责人' ? ['#1D4ED8', '#DBEAFE'] : (p.role === '评审人' ? ['#B45309', '#FEF3C7'] : ['#047857', '#D1FAE5']);
    return '<div style="display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:8px;" onmouseover="this.style.background=\'#F5F7FA\'" onmouseout="this.style.background=\'\'">'
      + memAva(p, 28)
      + '<div style="flex:1;min-width:0;"><div style="font-size:12.5px;font-weight:600;color:#1F2937;">' + p.name + '</div><div style="font-size:10.5px;color:#9CA3AF;">' + p.team + '</div></div>'
      + '<span style="font-size:10px;color:' + rc[0] + ';background:' + rc[1] + ';border-radius:20px;padding:2px 8px;flex-shrink:0;">' + p.role + '</span>'
      + '</div>';
  }).join('');
  var pop = document.createElement('div');
  pop.id = 'hub-folder-pop';
  pop.setAttribute('data-for', folderName);
  pop.style.cssText = 'position:fixed;z-index:9999;width:262px;background:#fff;border:1px solid #E5E7EB;border-radius:12px;box-shadow:0 14px 34px rgba(15,23,42,.18);padding:8px;';
  pop.innerHTML = '<div style="font-size:11px;font-weight:700;color:#9CA3AF;letter-spacing:.4px;padding:6px 10px 8px;">任务成员与协作 · ' + folderName + '</div>'
    + rows
    + '<div style="height:1px;background:#F1F3F7;margin:6px 4px;"></div>'
    + '<div onclick="var p=document.getElementById(\'hub-folder-pop\');if(p)p.remove();openMembersModal();" style="display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:8px;cursor:pointer;color:#2563EB;font-size:12.5px;font-weight:600;" onmouseover="this.style.background=\'#F0F7FF\'" onmouseout="this.style.background=\'\'"><i class="fa-solid fa-user-plus" style="font-size:11px;"></i>选择更多协作人</div>';
  document.body.appendChild(pop);
  var r = anchor.getBoundingClientRect();
  var left = r.right - 262; if (left < 8) left = 8;
  var top = r.bottom + 6;
  var ph = pop.offsetHeight;
  if (top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 6);
  pop.style.left = left + 'px';
  pop.style.top = top + 'px';
  setTimeout(function () {
    document.addEventListener('click', function handler(e) {
      var p = document.getElementById('hub-folder-pop');
      if (p && !p.contains(e.target)) { p.remove(); document.removeEventListener('click', handler); }
    });
  }, 0);
}
function openMembersModal() { renderMemList(); renderMemCandidates(); document.getElementById('mem-bd').classList.add('open'); }
function closeMembersModal() { document.getElementById('mem-bd').classList.remove('open'); renderMemberAvatars(); }
var MEM_FREQ = ['每周', '每两周', '每月'];
var MEM_CONTENT = ['阶段成果', '分析报告', '全部产出'];
function renderMemList() {
  var box = document.getElementById('mem-list');
  var ins = HUB_PEOPLE.filter(function (p) { return p.in; });
  box.innerHTML = ins.map(function (p) {
    var badge = p.role === '负责人' ? ['#1D4ED8', '#DBEAFE'] : (p.role === '评审人' ? ['#B45309', '#FEF3C7'] : ['#047857', '#D1FAE5']);
    var review = '';
    if (p.role === '评审人') {
      var rv = p.review || { freq: '每周', content: '阶段成果' };
      review = '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:7px 10px;">'
        + '<i class="fa-solid fa-calendar-check" style="font-size:11px;color:#B45309;"></i><span style="font-size:11.5px;color:#92400E;">定期送审</span>'
        + '<select onchange="memSetReview(\'' + p.id + '\',\'freq\',this.value)" style="font-size:11.5px;border:1px solid #FDE68A;border-radius:6px;padding:2px 6px;color:#92400E;background:#fff;font-family:inherit;">' + MEM_FREQ.map(function (f) { return '<option ' + (f === rv.freq ? 'selected' : '') + '>' + f + '</option>'; }).join('') + '</select>'
        + '<select onchange="memSetReview(\'' + p.id + '\',\'content\',this.value)" style="font-size:11.5px;border:1px solid #FDE68A;border-radius:6px;padding:2px 6px;color:#92400E;background:#fff;font-family:inherit;">' + MEM_CONTENT.map(function (c) { return '<option ' + (c === rv.content ? 'selected' : '') + '>' + c + '</option>'; }).join('') + '</select>'
        + '<span style="font-size:11px;color:#B45309;">送 Review</span></div>';
    }
    return '<div style="border:1px solid var(--line);border-radius:10px;padding:11px 13px;margin-bottom:8px;">'
      + '<div style="display:flex;align-items:center;gap:10px;">' + memAva(p, 32)
      + '<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:700;color:var(--ink);">' + p.name + '</div><div style="font-size:11px;color:var(--muted);">' + p.team + '</div></div>'
      + '<select ' + (p.fixed ? 'disabled' : '') + ' onchange="memSetRole(\'' + p.id + '\',this.value)" style="font-size:11.5px;border:1px solid var(--line);border-radius:7px;padding:3px 8px;color:' + badge[0] + ';background:' + badge[1] + ';font-family:inherit;font-weight:600;">'
      + ['负责人', '成员', '评审人'].map(function (r) { return '<option ' + (r === p.role ? 'selected' : '') + '>' + r + '</option>'; }).join('') + '</select>'
      + (p.fixed ? '' : '<i class="fa-solid fa-xmark" onclick="memRemove(\'' + p.id + '\')" style="font-size:13px;color:#C4C9D2;cursor:pointer;margin-left:4px;" title="移出"></i>')
      + '</div>' + review + '</div>';
  }).join('');
}
function renderMemCandidates() {
  var box = document.getElementById('mem-cands');
  var q = (document.getElementById('mem-search').value || '').trim();
  var outs = HUB_PEOPLE.filter(function (p) { return !p.in && (!q || p.name.indexOf(q) > -1 || p.team.indexOf(q) > -1); });
  box.innerHTML = outs.length ? outs.map(function (p) {
    return '<div style="display:flex;align-items:center;gap:10px;border:1px solid var(--line);border-radius:10px;padding:9px 13px;margin-bottom:7px;">' + memAva(p, 30)
      + '<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;color:var(--ink);">' + p.name + '<span style="font-size:10.5px;font-weight:600;color:' + (p.role === '评审人' ? '#B45309' : '#6B7280') + ';background:' + (p.role === '评审人' ? '#FEF3C7' : '#F3F4F6') + ';border-radius:20px;padding:1px 7px;margin-left:6px;">' + p.role + '</span></div><div style="font-size:11px;color:var(--muted);">' + p.team + '</div></div>'
      + '<button onclick="memAdd(\'' + p.id + '\')" class="np-btn pri" style="padding:5px 14px;font-size:12px;">添加</button></div>';
  }).join('') : '<div class="np-hint">未找到匹配的人员</div>';
}
function memAdd(id) { var p = memBy(id); if (!p) return; p.in = true; renderMemList(); renderMemCandidates(); renderMemberAvatars(); if (typeof wbToast === 'function') wbToast('已把 ' + p.name + ' 加入该分类，可共享科研入口并 @ 协同'); }
function memRemove(id) { var p = memBy(id); if (!p || p.fixed) return; p.in = false; renderMemList(); renderMemCandidates(); renderMemberAvatars(); }
function memSetRole(id, role) { var p = memBy(id); if (!p) return; p.role = role; if (role === '评审人' && !p.review) p.review = { freq: '每周', content: '阶段成果' }; renderMemList(); }
function memSetReview(id, field, val) { var p = memBy(id); if (!p) return; if (!p.review) p.review = { freq: '每周', content: '阶段成果' }; p.review[field] = val; if (typeof wbToast === 'function') wbToast('已设置：' + p.review.freq + '将' + p.review.content + '送 ' + p.name + ' Review'); }

// 可 @ 的关联智能体（对话入口直接 @ 选择人或智能体）
var HUB_AGENTS = [
  { name: 'Tg 预测智能体', desc: 'RadonPy 分子动力学 · 串行迭代预测 Tg' },
  { name: '文献配方对比智能体', desc: '专利/文献配方提取与横向对比' },
  { name: '性能预测智能体', desc: '拉伸强度等力学性能预测' },
  { name: '配方推荐智能体', desc: '候选打分与 Top-N 推荐' }
];
function mentionLabel(t) {
  return '<div style="font-size:10.5px;font-weight:600;color:#9CA3AF;padding:6px 8px 3px;">' + t + '</div>';
}
function mentionAgentRow(a) {
  return '<div onclick="hubMention(\'' + a.name + '\')" style="display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:8px;cursor:pointer;" onmouseover="this.style.background=\'#F3F7FF\'" onmouseout="this.style.background=\'\'">'
    + '<span style="width:26px;height:26px;border-radius:8px;background:#EEF2FF;color:#4F46E5;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-robot" style="font-size:12px;"></i></span>'
    + '<div style="flex:1;min-width:0;"><div style="font-size:12.5px;font-weight:600;color:#374151;">' + a.name + '</div><div style="font-size:10.5px;color:#9CA3AF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">智能体 · ' + a.desc + '</div></div></div>';
}
function mentionPersonRow(p) {
  return '<div onclick="hubMention(\'' + p.name + '\')" style="display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:8px;cursor:pointer;" onmouseover="this.style.background=\'#F3F7FF\'" onmouseout="this.style.background=\'\'">' + memAva(p, 26)
    + '<div style="flex:1;min-width:0;"><div style="font-size:12.5px;font-weight:600;color:#374151;">' + p.name + '</div><div style="font-size:10.5px;color:#9CA3AF;">' + p.role + ' · ' + p.team + '</div></div></div>';
}
function showMentionPop(query) {
  var pop = document.getElementById('hubd-mention-pop');
  if (!pop) return;
  query = (query || '').toLowerCase();
  var agents = HUB_AGENTS.filter(function (a) { return !query || a.name.toLowerCase().indexOf(query) > -1; });
  var people = HUB_PEOPLE.filter(function (p) { return p.in && !p.fixed && (!query || p.name.toLowerCase().indexOf(query) > -1); });
  var html = '';
  if (agents.length) html += mentionLabel('关联智能体') + agents.map(mentionAgentRow).join('');
  if (people.length) html += mentionLabel('协作者 / 评审人') + people.map(mentionPersonRow).join('');
  if (!html) html = '<div style="padding:10px 8px;font-size:12px;color:#9CA3AF;">未找到匹配的人或智能体</div>';
  pop.innerHTML = html;
  pop.style.display = 'block';
}
// 对话入口输入 @ 时唤起选择面板，并按 @ 后文字过滤
function hubdInputMention() {
  var el = document.getElementById('hubd-input-3');
  if (!el) return;
  var pos = (el.selectionStart != null) ? el.selectionStart : el.value.length;
  var m = /@([^@\s]*)$/.exec(el.value.slice(0, pos));
  if (m) { showMentionPop(m[1]); }
  else { var pop = document.getElementById('hubd-mention-pop'); if (pop) pop.style.display = 'none'; }
}
function toggleMentionPop() {
  var pop = document.getElementById('hubd-mention-pop');
  if (!pop) return;
  if (pop.style.display === 'block') { pop.style.display = 'none'; return; }
  showMentionPop('');
}
function hubMention(name) {
  var el = document.getElementById('hubd-input-3');
  if (el) {
    var pos = (el.selectionStart != null) ? el.selectionStart : el.value.length;
    var before = el.value.slice(0, pos), after = el.value.slice(pos);
    if (/@([^@\s]*)$/.test(before)) before = before.replace(/@([^@\s]*)$/, '@' + name + ' ');
    else before += (before && !/\s$/.test(before) ? ' ' : '') + '@' + name + ' ';
    el.value = before + after;
    el.focus();
    var np = before.length; if (el.setSelectionRange) el.setSelectionRange(np, np);
  }
  var pop = document.getElementById('hubd-mention-pop'); if (pop) pop.style.display = 'none';
}
function hubShareResearch() {
  var ins = HUB_PEOPLE.filter(function (p) { return p.in && !p.fixed; });
  if (typeof wbToast === 'function') wbToast(ins.length ? '科研入口已共享给 ' + ins.length + ' 位成员，链接已复制' : '请先在「成员与协作」中添加可见成员');
}

// ── Hub: 任务产出视图（点击任务旁「布局」图标打开）
// 分子球棍示意 SVG（占位可视化，用于产出画廊）
function outMolSvg(kind) {
  var A = function (x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '" stroke="#fff" stroke-width="1.4"/>'; };
  var B = function (a, b, c, d, w) { return '<line x1="' + a + '" y1="' + b + '" x2="' + c + '" y2="' + d + '" stroke="#C2C8D2" stroke-width="' + (w || 4) + '" stroke-linecap="round"/>'; };
  var C = '#7C8492', O = '#DC2626', H = '#DCE1E9';
  var g = '';
  if (kind === 'iso') {
    [[54, 104, 84, 90], [84, 90, 84, 62], [84, 90, 116, 104], [116, 104, 146, 90]].forEach(function (b) { g += B(b[0], b[1], b[2], b[3]); });
    [[54, 104], [84, 90], [84, 62], [116, 104], [146, 90]].forEach(function (p) { g += A(p[0], p[1], 8, C); });
    [[38, 114], [40, 92], [70, 50], [98, 52], [132, 116], [162, 80]].forEach(function (p) { g += A(p[0], p[1], 4.4, H); });
    return g;
  }
  if (kind === 'cell') {
    var seed = 7; var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var pts = []; for (var i = 0; i < 46; i++) pts.push([20 + rnd() * 160, 16 + rnd() * 128]);
    for (var a = 0; a < pts.length; a++) for (var b = a + 1; b < pts.length; b++) {
      var dx = pts[a][0] - pts[b][0], dy = pts[a][1] - pts[b][1];
      if (dx * dx + dy * dy < 360) g += '<line x1="' + pts[a][0].toFixed(1) + '" y1="' + pts[a][1].toFixed(1) + '" x2="' + pts[b][0].toFixed(1) + '" y2="' + pts[b][1].toFixed(1) + '" stroke="#CDD3DC" stroke-width="2.2"/>';
    }
    for (var k = 0; k < pts.length; k++) { var isO = (k % 11 === 0); g += A(pts[k][0].toFixed(1), pts[k][1].toFixed(1), isO ? 5.4 : (k % 3 ? 3.4 : 4.8), isO ? O : C); }
    return g;
  }
  // 默认 sty：苯环 + 乙烯基 + 乙氧基（含 O）
  [[120, 64, 146, 72], [146, 72, 150, 98], [150, 98, 128, 114], [128, 114, 102, 106], [102, 106, 98, 80], [98, 80, 120, 64],
   [120, 64, 120, 40], [120, 40, 142, 30], [102, 106, 80, 120], [80, 120, 58, 112], [58, 112, 42, 124]].forEach(function (b) { g += B(b[0], b[1], b[2], b[3]); });
  [[120, 64], [146, 72], [150, 98], [128, 114], [102, 106], [98, 80], [120, 40], [142, 30], [58, 112], [42, 124]].forEach(function (p) { g += A(p[0], p[1], 7.5, C); });
  g += A(80, 120, 7, O);
  [[168, 66], [164, 110], [136, 132], [86, 44]].forEach(function (p) { g += A(p[0], p[1], 4.2, H); });
  return g;
}
var SSBR_GALLERY = {
  title: 'Low-Tg SSBR Monomer Design',
  items: [
    { name: '4-ethoxystyrene.pdb', kind: 'sty' },
    { name: 'cis-1,4-isoprene.pdb', kind: 'iso' },
    { name: 'cell.cif', kind: 'cell' }
  ]
};
var HUB_RUBBER_OUTPUT = {
  title: '橡胶研发项目',
  desc: '项目面向运动型乘用车轮胎用锡偶联 SSBR 新牌号开发，目标替代进口牌号并支撑湿实验验证，核心 Tg 指标为 -35±5℃；同时探索苯乙烯对位官能团使 Tg&lt;-50℃。项目采用主智能体调度子智能体的协同工作流，通过 <code>consult_*</code> 工具按专长路由 Tg 预测、文献配方对比、性能预测与推荐等子智能体，以 RadonPy 分子动力学串行迭代预测 Tg，禁用 Fox 方程。prepare 阶段已通过：结构校验通过，8 GPU 通道就绪，覆盖策略定为方案 A。文献侧从 3 份专利提取 17 个配方，模型预测均满足拉伸强度 &gt;13 MPa，推荐 Top5（最高分 81.04）。四元共聚体系已生成 3D 可视化，Tg 预测 -42.57℃，未达 &lt; -50℃ 目标，且为 POC Mock 数据。后续需修复报告模板并输出最终 HTML/DOCX/JSON 成果。',
  explore: 6, output: 100, viz: 10,
  gallery: SSBR_GALLERY,
  qa: []
};
var HUB_TASK_OUTPUTS = {
  '橡胶研发项目': HUB_RUBBER_OUTPUT,
  '橡胶配方与性能预测': {
    desc: '本任务开发运动型乘用车轮胎用锡偶联 SSBR 新牌号，目标纯胶 Tg=-35±5℃，替代进口牌号。采用串行迭代：设计苯乙烯结合量、丁二烯 1,2-乙烯基比例与序列分布，由 RadonPy MD 逐候选预测 Tg。已敲定 <code>PLAN.md</code>，完成候选设计 C1/C2/C3 经 RDKit 校验，Fox Tg 约 -36.5/-30.1/-39.8℃。主要发现：MD 单次 Tg 不确定度远超 ±5℃，仅能做趋势筛选；当前处于 build/执行与故障排除阶段。',
    explore: 14, output: 100, viz: 10,
    gallery: SSBR_GALLERY,
    qa: [{
      q: '为运动型乘用车轮胎开发一款锡偶联溶聚丁苯橡胶（SSBR）新牌号：通过设计一批分子结构——丁二烯链段中 1,2-结构（乙烯基）比例、苯乙烯结合量与序列分布——使纯胶的玻璃化转变温度达到 -35±5℃，用于湿实验验证，替代现用进口牌号；方案执行过程中采用串行模型，一个方案评估后不符合目标要求则自动规划下一个方案并再次评估，每次都采用分子动力学进行 Tg 预测。',
      a: '已读取全部相关项目记忆。本任务与项目已沉淀的 SSBR Tg 串行迭代经验高度吻合，关键约束我已掌握。下面先说明两个会直接决定计划框架的科学边界，再给出结构化计划草案供你确认。'
    }]
  },
  '储层渗透率预测方案': {
    desc: '本任务围绕页岩气储层渗透率预测展开，结合核磁共振数据与岩心实验构建 ML 预测模型。已整理 89 篇核心文献并建立分类体系，完成孔隙度测井解释综述草稿；进行中为初版模型评估。',
    explore: 7, output: 12, viz: 3,
    qa: [{
      q: '基于核磁共振与测井曲线数据，构建页岩储层渗透率的机器学习预测模型，并评估其在盲测井段的泛化能力。',
      a: '已检索相关文献并载入岩心与测井数据集。建议先做特征相关性分析与数据预处理，再进入建模；下面给出方案草案。'
    }]
  }
};

function openTaskOutput(name) {
  var d = HUB_TASK_OUTPUTS[name] || HUB_RUBBER_OUTPUT;
  var heading = d.title || name;
  var mt = function (v, l, hot) {
    return '<div style="flex:1;text-align:center;background:' + (hot ? '#FFF7ED' : '#F9FAFB') + ';border:1.5px solid ' + (hot ? '#FDE68A' : '#E5E7EB') + ';border-radius:12px;padding:16px 12px;">'
      + '<div style="font-size:28px;font-weight:800;color:' + (hot ? '#D97706' : '#374151') + ';">' + v + '</div>'
      + '<div style="font-size:11.5px;color:#9CA3AF;margin-top:2px;">' + l + '</div></div>';
  };
  var qaHtml = (d.qa || []).map(function (x) {
    return '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:22px 26px;margin-top:18px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><div style="font-size:15px;font-weight:700;color:#111827;">新会话</div><span style="font-size:11px;font-weight:600;color:#D97706;background:#FEF3C7;border-radius:100px;padding:3px 11px;">1 次问答</span></div>'
      + '<div style="font-size:13px;color:#374151;line-height:1.8;margin-bottom:14px;"><span style="color:#9CA3AF;">问题</span> ' + x.q + '</div>'
      + '<div style="font-size:13px;color:#374151;line-height:1.8;">' + x.a + '</div></div>';
  }).join('');
  var galHtml = '';
  if (d.gallery && d.gallery.items && d.gallery.items.length) {
    galHtml = '<div style="margin-top:22px;">'
      + '<div class="traj-mono" style="font-size:13px;color:#8A94A6;margin-bottom:12px;">' + d.gallery.title + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">'
      + d.gallery.items.map(function (it) {
        return '<div>'
          + '<div style="background:linear-gradient(160deg,#FBFCFF,#EDF1F9);border:1px solid #E8ECF3;border-radius:16px;height:210px;display:flex;align-items:center;justify-content:center;overflow:hidden;">'
          + '<svg viewBox="0 0 200 160" style="width:88%;height:88%;">' + outMolSvg(it.kind) + '</svg>'
          + '</div>'
          + '<div style="font-size:13.5px;color:#374151;margin-top:9px;">' + it.name + '</div>'
          + '</div>';
      }).join('')
      + '</div></div>';
  }
  document.getElementById('hub-output-body').innerHTML = ''
    + '<div style="background:white;border:1.5px solid #FDE68A;border-radius:16px;padding:24px 28px;">'
    + '  <div style="margin-bottom:12px;"><span style="font-size:11px;font-weight:600;color:#D97706;background:#FEF3C7;border-radius:100px;padding:3px 11px;"><i class="fa-solid fa-star" style="font-size:9px;margin-right:4px;"></i>成果汇总</span></div>'
    + '  <div style="font-size:20px;font-weight:800;color:#111827;margin-bottom:14px;">' + heading + '</div>'
    + '  <div style="font-size:13px;color:#6B7280;line-height:1.8;margin-bottom:20px;">' + d.desc + '</div>'
    + '  <div style="display:flex;gap:14px;">' + mt(d.explore, '次探索', true) + mt(d.output, '产出') + mt(d.viz, '可视化') + '</div>'
    + '</div>'
    + galHtml
    + qaHtml;
  document.getElementById('hub-single-pane').style.display = 'none';
  document.getElementById('hub-three-pane').style.display = 'none';
  document.getElementById('hub-output-pane').style.display = 'flex';
}
function closeTaskOutput() {
  document.getElementById('hub-output-pane').style.display = 'none';
  document.getElementById('hub-three-pane').style.display = 'flex';
}

// ── Hub: task list & new task
function hubOpenTask(el, name, n) {
  document.querySelectorAll('#hb2-task-list .hb2-task').forEach(function (x) { x.classList.remove('active'); });
  if (el) el.classList.add('active');
  if (!document.getElementById('page-hub').classList.contains('active')) switchPage('hub');
  openHubCourse('mat');
  openHubdSession(name, n);
}
function hubNewTask() {
  document.querySelectorAll('#hb2-task-list .hb2-task').forEach(function (x) { x.classList.remove('active'); });
  if (!document.getElementById('page-hub').classList.contains('active')) switchPage('hub');
  closeHubDetail();
  var t = document.getElementById('hb2-input'); if (t) t.focus();
}

// ── Hub: mode cards
var V2_MODES = {
  read: { chips: ['文献调研', '研究空白识别', '证据提取', '综述梳理'], ph: '描述研究目标、科研问题，或上传文献材料开始研究......' },
  calc: { chips: ['数据分析', '参数计算', '模型训练', '性质预测'], ph: '描述要分析的数据、计算目标或需要调用的科研模型......' },
  exp:  { chips: ['实验设计', '方案生成', '配方推荐', '执行清单'], ph: '描述实验目标与约束条件，AI 将生成可执行的实验方案......' }
};
function selectMode(mode) {
  // 读 / 算 / 做 仅作展示、不可选；此处只据默认模式初始化快捷提示 chips 与输入占位
  var cfg = V2_MODES[mode] || V2_MODES.read;
  var box = document.getElementById('hb2-chips');
  if (box) box.innerHTML = cfg.chips.map(function (c) {
    return '<button class="qchip" style="display:inline-flex;align-items:center;cursor:pointer;font-family:inherit;" data-q="' + c + '" onclick="v2Chip(\'hb2\', this.dataset.q)">' + v2ic('sparkle', 15, 1.7) + c + '</button>';
  }).join('');
  var t = document.getElementById('hb2-input'); if (t) t.placeholder = cfg.ph;
}
function v2Chip(prefix, q) {
  var t = document.getElementById(prefix + '-input');
  if (!t) return;
  t.value = '【' + q + '】' + t.value.replace(/^【[^】]*】/, '');
  t.focus(); cmpSync(prefix);
}
function wbQuick(el) { v2Chip('wb2', el.dataset.q); }

// ════════ Workbench: 按科研空间联动的数据模型 ════════
var WB_SPACES = {
  '配方优化课题': {
    dot: '#2563EB', tagline: '高分子材料 · 进行中',
    goal: '优化新能源汽车轮胎用柔性丁苯橡胶配方，兼顾滚阻与耐久性能',
    lead: '张工', members: ['张', '刘', '陈', '杨'], progress: 62,
    metrics: [
      { n: '3', l: '进行中任务' },
      { n: '1', l: '待确认产出', warn: true },
      { n: '8', l: '本周新增情报' },
      { n: 'T-3', l: '距下一里程碑', warn: true }
    ],
    intel: [
      { cat: 'exp', need: true, icon: 'flask', bg: '#FDECEC', fg: '#E5383B', t: '实验结果异动提醒', d: '实验 GB-2026-0915 的催化活性均值下降 35%，建议复核反应条件与样品批次。', meta: '来源 电子实验记录 · 今天 09:20', chips: [['实验', '#FDECEC', '#E5383B'], ['需决策', '#FDECEC', '#E5383B']], btn: '查看详情' },
      { cat: 'exp', need: true, icon: 'target', bg: '#FFF4E5', fg: '#D97706', t: '课题里程碑即将到期', d: '下一节点（中期评审材料）3 天后到期，建议尽快汇总阶段性成果。', meta: '来源 课题计划 · 昨天 18:40', chips: [['提醒', '#FFF4E5', '#D97706'], ['需处理', '#FDECEC', '#E5383B']], btn: '去处理' },
      { cat: 'patent', need: true, icon: 'list', bg: '#F3EEFF', fg: '#7C3AED', t: '标准更新：GB/T 轮胎橡胶试验方法修订', d: '拉伸性能测试条件调整，需同步更新实验 SOP 与验证方案。', meta: '来源 标准法规 · 全国橡胶标委会 · 昨天', chips: [['标准', '#F3EEFF', '#7C3AED'], ['需处理', '#FDECEC', '#E5383B']], btn: '去更新' },
      { cat: 'lit', need: false, icon: 'book', bg: '#EDF7F1', fg: '#16A34A', t: '文献推荐：柔性丁苯橡胶补强体系新进展', d: '《Nature Catalysis》最新研究与当前配方方向高度相关，已加入「待读」。', meta: '来源 文献订阅 · Nature Catalysis · 今天 08:30', chips: [['文献', '#EDF7F1', '#16A34A'], ['高相关', '#EAF2FF', '#2563EB']], btn: '加入待读' },
      { cat: 'patent', need: false, icon: 'scroll', bg: '#FFF4E5', fg: '#D97706', t: '专利动态：一种高弹性丁苯橡胶配方', d: 'CN2026XXXXXX A 公布，权利要求涉及相近填料配比，建议评估规避风险。', meta: '来源 专利监测 · CNIPA · 今天 07:50', chips: [['专利', '#FFF4E5', '#D97706']], btn: '查看专利' },
      { cat: 'field', need: false, icon: 'sparkle', bg: '#EAF2FF', fg: '#2563EB', t: '领域动态：绿色轮胎材料受资本关注', d: '近一月 3 家头部厂商发布低滚阻配方进展，行业竞争加剧。', meta: '来源 领域热点 · 行业资讯 · 昨天', chips: [['动态', '#EAF2FF', '#2563EB']], btn: '查看' },
      { cat: 'exp', need: false, icon: 'cpu', bg: '#EAF2FF', fg: '#2563EB', t: '计算任务已完成', d: 'VASP 电子结构计算（任务 #1024）已完成，生成 12 个结果文件。', meta: '来源 计算平台 · 今天 08:50', chips: [['计算', '#EAF2FF', '#2563EB']], btn: '查看结果' },
      { cat: 'lit', need: false, icon: 'quote', bg: '#EDF7F1', fg: '#16A34A', t: '被引提醒：你的相关综述新增 4 次引用', d: '《丁苯橡胶配方优化综述》近一周被 4 篇新文献引用。', meta: '来源 文献订阅 · 本周', chips: [['文献', '#EDF7F1', '#16A34A']], btn: '查看' }
    ],
    activity: {
      proj: [
        ['10:30', '', '实验数据已同步', '实验 GB-2026-0915 数据已同步至 ELN', '成功', ''],
        ['09:41', '', '计算任务开始运行', 'GROMACS 分子动力学模拟（任务 #1025）', '运行中', 'run'],
        ['09:15', '', '新文献已加入知识库', '《Nature Catalysis》最新文献已收录', '成功', ''],
        ['18:20', '昨天', '课题进展更新', '《功能性 PE 配方优化》已更新周报', '更新', ''],
        ['16:05', '昨天', '实验预约成功', '预约 10 月 8 日 10:00–12:00 普通仪器', '成功', '']
      ],
      exp: [
        ['10:30', '', '实验数据已同步', '实验 GB-2026-0915 数据已同步至 ELN', '成功', ''],
        ['09:02', '', '样品表征完成', 'SBR-07 批次 DMA 动态力学测试完成', '成功', ''],
        ['17:40', '昨天', '实验异常', '拉伸测试机 #2 温控偏差超出阈值', '异常', 'fail'],
        ['16:05', '昨天', '实验预约成功', '预约 10 月 8 日 10:00–12:00 普通仪器', '成功', '']
      ],
      calc: [
        ['09:41', '', '计算任务开始运行', 'GROMACS 分子动力学模拟（任务 #1025）', '运行中', 'run'],
        ['08:50', '', '计算任务已完成', 'VASP 电子结构计算（任务 #1024）', '成功', ''],
        ['21:10', '昨天', '参数寻优完成', '柔性丁苯橡胶配方参数贝叶斯优化 · 120 轮', '成功', '']
      ],
      out: [
        ['11:05', '', '新产出待确认', '推荐配方实验验证方案 V1.0', '待确认', 'run'],
        ['18:20', '昨天', '报告已确认', '柔性丁苯橡胶研究空白分析报告', '成功', ''],
        ['15:32', '昨天', '结果集已归档', '丁苯橡胶配方参数计算结果集', '更新', '']
      ]
    },
    tasks: [
      { t: '新能源汽车轮胎用柔性丁苯橡胶文献调研', m: '文献研究 · 配方优化课题 · 今天 10:12', st: '已完成', c: 'b-done', icon: 'book',  btn: '查看', n: 6 },
      { t: '柔性丁苯橡胶配方参数计算',             m: '建模计算 · 配方优化课题 · 今天 09:41', st: '运行中', c: 'b-run',  icon: 'cpu',   btn: '继续', n: 4 },
      { t: '推荐配方实验验证方案',                 m: '实验方案 · 配方优化课题 · 昨天 17:26', st: '已完成', c: 'b-done', icon: 'flask', btn: '查看', n: 7 }
    ],
    outs: [
      { t: '推荐配方实验验证方案',         m: '研究产出 · 研究方案 · V1.0 · 今天 11:05',    st: '待确认', c: 'b-wait', icon: 'file' },
      { t: '柔性丁苯橡胶研究空白分析报告', m: '研究产出 · 分析报告 · V1.2 · 昨天 18:20',    st: '已确认', c: 'b-done', icon: 'chart' },
      { t: '丁苯橡胶配方参数计算结果集',   m: '数据产出 · 结果集 · 12 个文件 · 昨天 15:32', st: '已确认', c: 'b-done', icon: 'db' }
    ],
    nextSteps: [
      { icon: 'flask', bg: '#FDECEC', fg: '#E5383B', t: '完成推荐配方实验验证', d: '按验证方案 V1.0 执行 3 组对照实验并记录数据', due: 'T-3天', dueBg: '#FDECEC', dueFg: '#E5383B' },
      { icon: 'chart', bg: '#FFF4E5', fg: '#D97706', t: '准备中期评审材料', d: '汇总配方优化阶段成果，形成评审 PPT 与数据附录', due: '10-15', dueBg: '#FFF4E5', dueFg: '#D97706' },
      { icon: 'cpu', bg: '#EAF2FF', fg: '#2563EB', t: '补充分子动力学模拟', d: '针对新配方补跑 2 组 GROMACS，验证界面结合能', due: '待排期', dueBg: '#F2F5FA', dueFg: '#5E6B7E' }
    ],
    jobs: [
      { icon: 'search', bg: '#EDF7F1', fg: '#16A34A', t: '橡胶材料研究进展', sched: '每日 08:00', badge: '5 条新', hot: true, filter: 'lit' },
      { icon: 'scroll', bg: '#FFF4E5', fg: '#D97706', t: '专利·标准监测', sched: '每日 07:30', badge: '2 条新', hot: true, filter: 'patent' },
      { icon: 'pulse', bg: '#EAF2FF', fg: '#2563EB', t: '实验/计算状态巡检', sched: '每 2 小时', badge: '运行中', hot: false, filter: 'exp' },
      { icon: 'chart', bg: '#F3EEFF', fg: '#7C3AED', t: '课题周报自动汇总', sched: '每周一 09:00', badge: '待生成', hot: false, filter: 'all' }
    ],
    mentions: [
      { ava: '刘', color: '#2563EB', name: '刘工', act: '在《推荐配方验证方案》@了你', snip: '验证方案的对照组设置，麻烦帮忙确认下', time: '2 小时前' },
      { ava: '陈', color: '#16A34A', name: '陈工', act: '在评论中 @了你', snip: 'GB-2026-0915 的异常数据，要不要安排复测？', time: '今天 09:30' }
    ]
  },
  '页岩气储层评价课题': {
    dot: '#16A34A', tagline: '油气地质 · 进行中',
    goal: '构建测井–岩心一体化含气量评价方法，提升页岩气储层预测精度',
    lead: '李工', members: ['李', '赵', '孙'], progress: 45,
    metrics: [
      { n: '2', l: '进行中任务' },
      { n: '2', l: '待确认产出', warn: true },
      { n: '5', l: '本周新增情报' },
      { n: 'T-9', l: '距下一里程碑' }
    ],
    intel: [
      { cat: 'exp', need: true, icon: 'flask', bg: '#FDECEC', fg: '#E5383B', t: '岩心实验数据待复核', d: 'S-3 井岩心孔隙度测试与测井解释偏差偏大，建议复核。', meta: '来源 实验记录 · 今天', chips: [['实验', '#FDECEC', '#E5383B'], ['需决策', '#FDECEC', '#E5383B']], btn: '查看' },
      { cat: 'exp', need: true, icon: 'target', bg: '#FFF4E5', fg: '#D97706', t: '阶段汇报临近', d: '储层评价中期汇报 9 天后进行，需准备含气量评价方法与初步结果。', meta: '来源 课题计划 · 昨天', chips: [['提醒', '#FFF4E5', '#D97706'], ['需处理', '#FDECEC', '#E5383B']], btn: '去处理' },
      { cat: 'lit', need: false, icon: 'book', bg: '#EDF7F1', fg: '#16A34A', t: '文献推荐：页岩含气量测井解释新模型', d: '《SPE Journal》提出基于机器学习的含气量预测方法，精度提升明显。', meta: '来源 文献订阅 · SPE Journal · 今天', chips: [['文献', '#EDF7F1', '#16A34A']], btn: '加入待读' },
      { cat: 'patent', need: false, icon: 'scroll', bg: '#FFF4E5', fg: '#D97706', t: '标准：页岩含气量测定方法', d: 'GB/T 相关测定方法征求意见稿发布，建议关注取样规范变化。', meta: '来源 标准法规 · 前天', chips: [['标准', '#FFF4E5', '#D97706']], btn: '查看' },
      { cat: 'field', need: false, icon: 'sparkle', bg: '#EAF2FF', fg: '#2563EB', t: '领域动态：深层页岩气勘探提速', d: '川南深层页岩气区块新增探明储量，评价方法需求上升。', meta: '来源 领域热点 · 昨天', chips: [['动态', '#EAF2FF', '#2563EB']], btn: '查看' }
    ],
    activity: {
      proj: [
        ['11:20', '', '测井数据已导入', 'S-3 井测井曲线导入解释平台', '成功', ''],
        ['09:30', '', '岩心测试排期', '安排 S-3 井岩心物性测试', '运行中', 'run'],
        ['16:40', '昨天', '周报已更新', '储层评价课题周报', '更新', '']
      ],
      exp: [
        ['10:10', '', '岩心孔隙度测试完成', 'S-2 井岩心氦孔隙度测试', '成功', ''],
        ['15:00', '昨天', '测试异常', 'S-3 井渗透率测试重复性差', '异常', 'fail']
      ],
      calc: [
        ['09:50', '', '含气量反演运行中', '机器学习含气量预测模型训练', '运行中', 'run'],
        ['20:30', '昨天', '测井解释完成', 'S-1 井多矿物模型解释', '成功', '']
      ],
      out: [
        ['14:20', '', '评价报告待确认', '页岩气储层含气量评价初稿', '待确认', 'run'],
        ['17:10', '昨天', '数据集归档', 'S 区块测井解释结果集', '更新', '']
      ]
    },
    tasks: [
      { t: '页岩储层孔隙度测井解释综述', m: '文献研究 · 页岩气储层评价课题 · 今天', st: '已完成', c: 'b-done', icon: 'book', btn: '查看', n: 5 },
      { t: '含气量机器学习预测建模',     m: '建模计算 · 页岩气储层评价课题 · 今天', st: '运行中', c: 'b-run', icon: 'cpu', btn: '继续', n: 4 }
    ],
    outs: [
      { t: '页岩气储层含气量评价初稿', m: '研究产出 · 评价报告 · V0.9 · 今天', st: '待确认', c: 'b-wait', icon: 'file' },
      { t: 'S 区块测井解释结果集',     m: '数据产出 · 结果集 · 8 口井 · 昨天', st: '待确认', c: 'b-wait', icon: 'db' }
    ],
    nextSteps: [
      { icon: 'flask', bg: '#EDF7F1', fg: '#16A34A', t: '复核岩心–测井偏差', d: '核对 S-3 井岩心与测井解释一致性', due: 'T-2天', dueBg: '#FDECEC', dueFg: '#E5383B' },
      { icon: 'chart', bg: '#FFF4E5', fg: '#D97706', t: '储层评价中期汇报', d: '汇总含气量评价方法与初步结果', due: 'T-9天', dueBg: '#FFF4E5', dueFg: '#D97706' }
    ],
    jobs: [
      { icon: 'search', bg: '#EDF7F1', fg: '#16A34A', t: '获取储层评价资讯', sched: '每日 08:00', badge: '3 条新', hot: true, filter: 'lit' },
      { icon: 'scroll', bg: '#FFF4E5', fg: '#D97706', t: '行业标准监测', sched: '每日 07:30', badge: '1 条新', hot: true, filter: 'patent' },
      { icon: 'pulse', bg: '#EAF2FF', fg: '#2563EB', t: '含气量反演任务巡检', sched: '每小时', badge: '运行中', hot: false, filter: 'exp' }
    ],
    mentions: [
      { ava: '李', color: '#16A34A', name: '李工', act: '在《S-3 井复核》@了你', snip: '岩心与测井偏差较大，帮忙一起看下原因', time: '1 小时前' }
    ]
  },
  '催化剂优化项目': {
    dot: '#D97706', tagline: '多相催化 · 早期',
    goal: '面向 CO₂ 加氢制甲醇，筛选并优化高活性催化剂配方',
    lead: '王工', members: ['王', '陈'], progress: 20,
    metrics: [
      { n: '1', l: '进行中任务' },
      { n: '1', l: '待确认产出' },
      { n: '3', l: '本周新增情报' },
      { n: 'T-14', l: '距下一里程碑' }
    ],
    intel: [
      { cat: 'exp', need: true, icon: 'bulb', bg: '#F3EEFF', fg: '#7C3AED', t: '智能体建议：优化实验方案', d: '建议将反应温度从 200 ℃ 调整至 220 ℃，预计可提升转化率 12%。', meta: '来源 AI 助手 · 昨天', chips: [['建议', '#F3EEFF', '#7C3AED'], ['需处理', '#FDECEC', '#E5383B']], btn: '查看建议' },
      { cat: 'lit', need: false, icon: 'book', bg: '#EDF7F1', fg: '#16A34A', t: '文献：Cu 基催化剂选择性调控', d: '最新研究提出助剂调控甲醇选择性策略，可用于配方设计。', meta: '来源 文献订阅 · 今天', chips: [['文献', '#EDF7F1', '#16A34A']], btn: '加入待读' },
      { cat: 'field', need: false, icon: 'sparkle', bg: '#EAF2FF', fg: '#2563EB', t: '领域动态：CCU 政策利好', d: 'CO₂ 资源化利用获新一轮政策支持，赛道热度上升。', meta: '来源 领域热点 · 前天', chips: [['动态', '#EAF2FF', '#2563EB']], btn: '查看' }
    ],
    activity: {
      proj: [
        ['10:00', '', '项目立项完成', 'CO₂ 加氢制甲醇催化剂项目启动', '成功', ''],
        ['14:30', '昨天', '文献调研中', '催化剂失活机理综述', '运行中', 'run']
      ],
      exp: [['11:00', '', '首批样品制备', '5 组 Cu-Zn-Al 催化剂样品', '成功', '']],
      calc: [['09:00', '', 'DFT 建模排期', '活性位点吸附能计算', '运行中', 'run']],
      out: [['15:00', '昨天', '综述草稿', '催化剂失活机理文献综述', '草稿', '']]
    },
    tasks: [
      { t: '催化剂失活机理文献综述', m: '文献研究 · 催化剂优化项目 · 昨天', st: '草稿', c: 'b-gray', icon: 'book', btn: '继续', n: 3 }
    ],
    outs: [
      { t: '催化剂失活机理文献综述', m: '研究产出 · 文献综述 · V0.3 · 09-26', st: '草稿', c: 'b-gray', icon: 'scroll' }
    ],
    nextSteps: [
      { icon: 'flask', bg: '#FFF4E5', fg: '#D97706', t: '完成首批活性评价实验', d: '对 5 组样品进行活性与选择性测试', due: 'T-14天', dueBg: '#F2F5FA', dueFg: '#5E6B7E' }
    ],
    jobs: [
      { icon: 'search', bg: '#EDF7F1', fg: '#16A34A', t: '获取催化剂领域资讯', sched: '每日 08:00', badge: '2 条新', hot: true, filter: 'lit' },
      { icon: 'bulb', bg: '#F3EEFF', fg: '#7C3AED', t: 'AI 实验方案建议', sched: '每日 12:00', badge: '1 条新', hot: true, filter: 'exp' }
    ],
    mentions: []
  },
  '全部空间': {
    dot: '#7C3AED', tagline: '聚合视图',
    goal: '汇总全部科研空间的关键情报、进展与待办',
    lead: '', members: [], progress: 37,
    metrics: [
      { n: '6', l: '进行中任务' },
      { n: '4', l: '待确认产出', warn: true },
      { n: '16', l: '本周新增情报' },
      { n: '3', l: '活跃空间' }
    ],
    intel: [
      { cat: 'exp', need: true, icon: 'flask', bg: '#FDECEC', fg: '#E5383B', t: '实验结果异动提醒', d: '配方优化课题：GB-2026-0915 催化活性下降 35%，需复核。', meta: '配方优化课题 · 今天 09:20', chips: [['实验', '#FDECEC', '#E5383B'], ['需决策', '#FDECEC', '#E5383B']], btn: '查看' },
      { cat: 'exp', need: true, icon: 'target', bg: '#FFF4E5', fg: '#D97706', t: '储层评价中期汇报临近', d: '页岩气储层评价课题：9 天后中期汇报，需准备材料。', meta: '页岩气储层评价课题 · 昨天', chips: [['提醒', '#FFF4E5', '#D97706'], ['需处理', '#FDECEC', '#E5383B']], btn: '去处理' },
      { cat: 'lit', need: false, icon: 'book', bg: '#EDF7F1', fg: '#16A34A', t: '文献推荐（跨课题 6 篇）', d: '本周各课题新增高相关文献 6 篇，已归入各待读列表。', meta: '文献订阅 · 今天', chips: [['文献', '#EDF7F1', '#16A34A']], btn: '查看' },
      { cat: 'patent', need: false, icon: 'scroll', bg: '#FFF4E5', fg: '#D97706', t: '专利·标准动态（3 项）', d: '涉及橡胶配方与页岩测定方法，建议关注。', meta: '专利/标准监测 · 昨天', chips: [['专利', '#FFF4E5', '#D97706']], btn: '查看' }
    ],
    activity: {
      proj: [
        ['10:30', '', '实验数据已同步', '配方优化：GB-2026-0915 同步至 ELN', '成功', ''],
        ['11:20', '', '测井数据已导入', '页岩气：S-3 井测井曲线导入', '成功', ''],
        ['10:00', '', '项目立项完成', '催化剂优化项目启动', '成功', '']
      ],
      exp: [['10:30', '', '样品表征完成', '配方优化：SBR-07 DMA 测试完成', '成功', '']],
      calc: [['09:41', '', '计算任务运行', '配方优化：GROMACS 分子动力学模拟', '运行中', 'run']],
      out: [['11:05', '', '新产出待确认', '配方优化：推荐配方验证方案 V1.0', '待确认', 'run']]
    },
    tasks: [
      { t: '柔性丁苯橡胶配方参数计算', m: '建模计算 · 配方优化课题 · 今天', st: '运行中', c: 'b-run', icon: 'cpu', btn: '继续', n: 4 },
      { t: '含气量机器学习预测建模',   m: '建模计算 · 页岩气储层评价课题 · 今天', st: '运行中', c: 'b-run', icon: 'cpu', btn: '继续', n: 4 },
      { t: '催化剂失活机理文献综述',   m: '文献研究 · 催化剂优化项目 · 昨天', st: '草稿', c: 'b-gray', icon: 'book', btn: '继续', n: 3 }
    ],
    outs: [
      { t: '推荐配方实验验证方案',       m: '配方优化课题 · 研究方案 · 今天', st: '待确认', c: 'b-wait', icon: 'file' },
      { t: '页岩气储层含气量评价初稿',   m: '页岩气储层评价课题 · 评价报告 · 今天', st: '待确认', c: 'b-wait', icon: 'file' }
    ],
    nextSteps: [
      { icon: 'target', bg: '#EAF2FF', fg: '#2563EB', t: '查看各空间里程碑', d: '切换到具体课题查看下一步计划与建议动作', due: '—', dueBg: '#F2F5FA', dueFg: '#5E6B7E' }
    ],
    jobs: [
      { icon: 'search', bg: '#EDF7F1', fg: '#16A34A', t: '跨课题资讯汇总', sched: '每日 08:00', badge: '10 条新', hot: true, filter: 'lit' },
      { icon: 'pulse', bg: '#EAF2FF', fg: '#2563EB', t: '全部任务状态巡检', sched: '每小时', badge: '运行中', hot: false, filter: 'exp' }
    ],
    mentions: [
      { ava: '刘', color: '#2563EB', name: '刘工', act: '配方优化课题 · @了你', snip: '验证方案对照组设置确认', time: '2 小时前' },
      { ava: '李', color: '#16A34A', name: '李工', act: '页岩气储层评价课题 · @了你', snip: '岩心与测井偏差，一起看下', time: '1 小时前' }
    ]
  }
};
var WB_ORDER = ['配方优化课题', '页岩气储层评价课题', '催化剂优化项目', '全部空间'];
var wbCurrentSpace = '配方优化课题';
var wbActK = 'proj';
var wbIntelF = 'all';
function wbSpace() { return WB_SPACES[wbCurrentSpace] || WB_SPACES['配方优化课题']; }

// 切换当前科研空间 → 整页联动重渲染
function wbSetSpace(key) {
  if (!WB_SPACES[key]) key = '配方优化课题';
  wbCurrentSpace = key;
  var sk = document.getElementById('scope-key'), sl = document.getElementById('space-label');
  if (sk) sk.textContent = '课题空间：';
  if (sl) sl.textContent = key;
  var ht = document.getElementById('wb2-hero-title');
  if (ht) ht.textContent = '在「' + key + '」里，今天想推进什么？';
  var bn = document.getElementById('wb2-bn-name');
  if (bn) bn.textContent = key;
  var ctx = document.getElementById('wb2-ctx');
  if (ctx) { for (var i = 0; i < ctx.options.length; i++) { if (ctx.options[i].value === key || ctx.options[i].text === key) { ctx.selectedIndex = i; break; } } }
  wbRenderBanner();
  wbRenderIntel('all');
  v2RenderAct('proj');
  v2RenderLists();
  wbRenderMilestones();
  wbRenderRail();
  wbRenderSpaceMenu();
}

// 右侧 rail：定时任务 + 队友提醒（@我的），均随空间联动
function wbRenderRail() {
  var sp = wbSpace();
  var jobs = sp.jobs || [], mentions = sp.mentions || [];
  var jl = document.getElementById('wb2-job-list');
  if (jl) jl.innerHTML = jobs.length ? jobs.map(function (j, i) {
    return '<div class="wb2-job" onclick="wbOpenJob(' + i + ')"><div class="wb2-job-ico" style="background:' + j.bg + ';color:' + j.fg + ';">' + v2ic(j.icon, 16, 1.8) + '</div>'
      + '<div class="wb2-job-main"><div class="wb2-job-t">' + j.t + '</div><div class="wb2-job-s">' + (j.hot ? '' : '<span class="wb2-job-dot"></span>') + j.sched + '</div></div>'
      + '<span class="wb2-jbadge ' + (j.hot ? 'hot' : 'gray') + '">' + j.badge + '</span></div>';
  }).join('') : '<div class="wb2-rail-empty">暂无已创建任务</div>';
  var mc = document.getElementById('wb2-mention-count');
  if (mc) mc.innerHTML = mentions.length ? '<span style="margin-left:6px;font-size:11px;font-weight:700;color:#E5383B;background:#FDECEC;padding:1px 7px;border-radius:100px;">' + mentions.length + '</span>' : '';
  var ml = document.getElementById('wb2-mention-list');
  if (ml) ml.innerHTML = mentions.length ? mentions.map(function (m, i) {
    return '<div class="wb2-mention" onclick="wbOpenMention(' + i + ')"><div class="wb2-mava" style="background:' + m.color + ';">' + m.ava + '</div>'
      + '<div class="wb2-mention-main"><div class="wb2-mention-t"><b>' + m.name + '</b> ' + m.act + '</div>'
      + '<div class="wb2-mention-s">' + m.snip + '</div><div class="wb2-mention-time">' + m.time + '</div></div></div>';
  }).join('') : '<div class="wb2-rail-empty">暂无队友提醒</div>';
}
// 单条情报的卡片 HTML（抽屉与情报页复用）
function wbIntelItemHTML(r) {
  var chips = (r.chips || []).map(function (c) { return '<span class="wb2-chip" style="background:' + c[1] + ';color:' + c[2] + ';">' + c[0] + '</span>'; }).join('');
  return '<div class="wb2-intel"><div class="wb2-ico" style="background:' + r.bg + ';color:' + r.fg + ';">' + v2ic(r.icon, 18, 1.8) + '</div>'
    + '<div class="wb2-intel-main"><div class="wb2-intel-t">' + r.t + chips + '</div>'
    + '<div class="wb2-intel-d">' + r.d + '</div><div class="wb2-intel-meta">' + r.meta + '</div></div>'
    + '<div class="wb2-intel-act"><button class="wb2-obtn">' + (r.btn || '查看') + '</button></div></div>';
}

// 点击定时任务 → 打开情报详情抽屉（展示该任务抓取到的情报清单）
function wbOpenJob(i) {
  var j = (wbSpace().jobs || [])[i];
  if (!j) return;
  var results = j.custom ? [] : (wbSpace().intel || []).filter(function (r) { return j.filter === 'all' || r.cat === j.filter; });
  var body = results.length
    ? results.map(wbIntelItemHTML).join('')
    : '<div class="wb2-rail-empty" style="padding:38px 6px;line-height:1.8;">' + (j.custom ? '定时任务已创建，预计首次运行：<b style="color:#2563EB;">明日 08:00</b><br>运行后将在这里展示自动抓取到的定向情报' : '暂无最新情报') + '</div>';
  document.getElementById('wb2-jd').innerHTML =
    '<div class="wb2-jd-hd"><div style="display:flex;align-items:flex-start;gap:12px;">'
    + '<div class="wb2-job-ico" style="background:' + j.bg + ';color:' + j.fg + ';">' + v2ic(j.icon, 16, 1.8) + '</div>'
    + '<div style="flex:1;min-width:0;"><div class="wb2-jd-eyebrow">' + v2ic('history', 13, 1.8) + '定时任务 · ' + wbCurrentSpace + '</div>'
    + '<div class="wb2-jd-title">' + j.t + '</div></div>'
    + '<button class="wb2-more" onclick="wbCloseJobDetail()" style="flex-shrink:0;">关闭</button></div>'
    + '<div class="wb2-jd-sub"><span>' + v2ic('history', 13, 1.7) + j.sched + '</span><span>状态：' + (j.custom ? '已排期' : '运行中') + '</span></div></div>'
    + '<div class="wb2-jd-body"><div class="wb2-jd-sec">' + (j.custom ? '首次运行结果' : '最新情报（' + results.length + '）') + '</div>' + body + '</div>';
  document.getElementById('wb2-jd-bd').classList.add('open');
}
function wbCloseJobDetail() {
  var bd = document.getElementById('wb2-jd-bd');
  if (bd) bd.classList.remove('open');
}

// ── 首页对话入口：自然语言配置定时任务 ──
var WB_SCHED_RE = /每\s*(日|天|周[一二三四五六日天]?|月|晚|个?\s*小时|\d+\s*小时|\d+\s*分钟)|定时|每隔/;
function wbLooksLikeSchedule(text) { return WB_SCHED_RE.test(text); }
function wbClassifyIntel(text) {
  if (/专利|标准|法规/.test(text)) return { filter: 'patent', icon: 'scroll', bg: '#FFF4E5', fg: '#D97706' };
  if (/实验|计算|仿真|模拟|表征|测试/.test(text)) return { filter: 'exp', icon: 'pulse', bg: '#EAF2FF', fg: '#2563EB' };
  if (/行业|热点|动态|趋势|竞品|市场/.test(text)) return { filter: 'field', icon: 'sparkle', bg: '#EAF2FF', fg: '#2563EB' };
  return { filter: 'lit', icon: 'search', bg: '#EDF7F1', fg: '#16A34A' };
}
function wbParseSched(text) {
  var base = '每日', m;
  if (/每周/.test(text)) { m = text.match(/每周([一二三四五六日天])/); base = m ? '每周' + m[1] : '每周'; }
  else if (/每月/.test(text)) base = '每月';
  else if (/每晚/.test(text)) base = '每晚';
  else if ((m = text.match(/每隔?\s*(\d+)\s*小时/))) base = '每 ' + m[1] + ' 小时';
  else if (/每个?\s*小时/.test(text)) base = '每小时';
  else if ((m = text.match(/每隔?\s*(\d+)\s*分钟/))) base = '每 ' + m[1] + ' 分钟';
  var time = '', tm = text.match(/(\d{1,2})\s*[:：]\s*(\d{2})/), t2 = text.match(/(\d{1,2})\s*点(半|\d{1,2})?/);
  if (tm) time = ('0' + tm[1]).slice(-2) + ':' + tm[2];
  else if (t2) { var hh = ('0' + t2[1]).slice(-2), mn = '00'; if (t2[2] === '半') mn = '30'; else if (t2[2]) mn = ('0' + t2[2]).slice(-2); time = hh + ':' + mn; }
  return time ? base + ' ' + time : base;
}
function wbCleanTitle(text) {
  var s = text.replace(/每\s*(日|天|周[一二三四五六日天]?|月|晚)/g, '').replace(/每隔?\s*\d+\s*(小时|分钟)/g, '').replace(/每个?\s*小时/g, '').replace(/定时/g, '').replace(/(\d{1,2})\s*[:：]\s*\d{2}/g, '').replace(/(\d{1,2})\s*点(半|\d{1,2})?/g, '').replace(/^[，,、\s]+/, '').trim();
  return s.length >= 3 ? s : text.trim();
}
function wbCreateScheduledTask(text) {
  var cls = wbClassifyIntel(text), sp = wbSpace();
  sp.jobs = sp.jobs || [];
  var job = { icon: cls.icon, bg: cls.bg, fg: cls.fg, t: wbCleanTitle(text), sched: wbParseSched(text), badge: '已排期', hot: false, filter: cls.filter, custom: true };
  sp.jobs.unshift(job);
  wbRenderRail();
  wbToast('已创建定时任务：' + job.t + '（' + job.sched + '）· 首次结果预计明日呈现');
  wbOpenJob(0);
}
function wbToast(msg) {
  var el = document.getElementById('wb2-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'wb2-toast';
    el.style.cssText = 'position:fixed;left:50%;bottom:32px;transform:translateX(-50%) translateY(20px);background:#0F2340;color:#fff;font-size:13px;padding:11px 18px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.22);z-index:400;opacity:0;transition:all .25s;max-width:80vw;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(function () { el.style.opacity = '1'; el.style.transform = 'translateX(-50%) translateY(0)'; });
  clearTimeout(el._t);
  el._t = setTimeout(function () { el.style.opacity = '0'; el.style.transform = 'translateX(-50%) translateY(20px)'; }, 3200);
}
function wbOpenMention(i) {
  var m = (wbSpace().mentions || [])[i];
  if (!m) return;
  var el = document.getElementById('wb2-act-list'); // 原型：定位到空间动态；真实场景跳到对应评论/任务
  if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function wbRenderBanner() {
  var sp = wbSpace();
  var goal = document.getElementById('wb2-bn-goal'); if (goal) goal.textContent = sp.goal || '';
  var mem = document.getElementById('wb2-bn-members');
  if (mem) mem.innerHTML = (sp.members || []).map(function (m) { return '<span class="wb2-ava">' + m + '</span>'; }).join('')
    + (sp.lead ? '<span style="font-size:11.5px;color:#5E6B7E;margin-left:10px;">负责人 ' + sp.lead + '</span>' : '');
  var pt = document.getElementById('wb2-bn-progtxt'); if (pt) pt.textContent = (sp.progress || 0) + '%';
  var pb = document.getElementById('wb2-bn-prog'); if (pb) pb.style.width = (sp.progress || 0) + '%';
  var mt = document.getElementById('wb2-bn-metrics');
  if (mt) mt.innerHTML = (sp.metrics || []).map(function (m) {
    return '<div class="wb2-metric' + (m.warn ? ' warn' : '') + '"><div class="n">' + m.n + (m.small ? '<small>' + m.small + '</small>' : '') + '</div><div class="l">' + m.l + '</div></div>';
  }).join('');
}

// 科研情报（融合外部文献/专利 + 内部待办），可按标签筛选
var WB_INTEL_F = [['all', '全部'], ['need', '需处理'], ['lit', '文献情报'], ['patent', '专利·标准'], ['field', '领域动态'], ['exp', '实验·计算']];
function wbRenderIntel(f) {
  wbIntelF = f || 'all';
  var pillsEl = document.getElementById('wb2-intel-pills');
  var listEl = document.getElementById('wb2-intel-list');
  if (!pillsEl || !listEl) return; // 情报卡已从首页移除时静默跳过
  var items = wbSpace().intel || [];
  var cnt = function (k) { return k === 'all' ? items.length : k === 'need' ? items.filter(function (r) { return r.need; }).length : items.filter(function (r) { return r.cat === k; }).length; };
  pillsEl.innerHTML = WB_INTEL_F.map(function (p) {
    return '<button class="wb2-pill' + (p[0] === wbIntelF ? ' active' : '') + '" onclick="wbRenderIntel(\'' + p[0] + '\')">' + p[1] + '(' + cnt(p[0]) + ')</button>';
  }).join('');
  var list = items.filter(function (r) { return wbIntelF === 'all' || (wbIntelF === 'need' ? r.need : r.cat === wbIntelF); });
  document.getElementById('wb2-intel-list').innerHTML = list.length ? list.map(function (r) {
    var chips = (r.chips || []).map(function (c) { return '<span class="wb2-chip" style="background:' + c[1] + ';color:' + c[2] + ';">' + c[0] + '</span>'; }).join('');
    return '<div class="wb2-intel"><div class="wb2-ico" style="background:' + r.bg + ';color:' + r.fg + ';">' + v2ic(r.icon, 18, 1.8) + '</div>'
      + '<div class="wb2-intel-main"><div class="wb2-intel-t">' + r.t + chips + '</div>'
      + '<div class="wb2-intel-d">' + r.d + '</div><div class="wb2-intel-meta">' + r.meta + '</div></div>'
      + '<div class="wb2-intel-act"><button class="wb2-obtn">' + (r.btn || '查看') + '</button></div></div>';
  }).join('') : '<div style="padding:24px;text-align:center;color:#9AA3AF;font-size:12.5px;">当前筛选下暂无情报</div>';
}

// 里程碑与下一步
function wbRenderMilestones() {
  var items = wbSpace().nextSteps || [];
  document.getElementById('wb2-ms-list').innerHTML = items.length ? items.map(function (s) {
    return '<div class="wb2-ms-row"><div class="wb2-ms-node" style="background:' + s.bg + ';color:' + s.fg + ';">' + v2ic(s.icon, 15, 1.8) + '</div>'
      + '<div class="wb2-ms-main"><div class="wb2-ms-t">' + s.t + '</div><div class="wb2-ms-d">' + s.d + '</div></div>'
      + '<span class="wb2-ms-due" style="background:' + s.dueBg + ';color:' + s.dueFg + ';">' + s.due + '</span></div>';
  }).join('') : '<div style="padding:16px;text-align:center;color:#9AA3AF;font-size:12.5px;">暂无里程碑</div>';
}

// 顶部「课题空间」下拉切换
function wbToggleSpaceMenu(e) {
  if (e) e.stopPropagation();
  var m = document.getElementById('wb2-space-menu');
  if (!m) return;
  if (m.classList.contains('open')) { m.classList.remove('open'); }
  else { wbRenderSpaceMenu(); m.classList.add('open'); }
}
function wbRenderSpaceMenu() {
  var m = document.getElementById('wb2-space-menu');
  if (!m) return;
  m.innerHTML = '<div class="mh">切换课题空间</div>' + WB_ORDER.map(function (k) {
    var sp = WB_SPACES[k];
    return '<div class="wb2-space-item' + (k === wbCurrentSpace ? ' active' : '') + '" onclick="wbSelectSpace(\'' + k + '\')">'
      + '<span class="wb2-space-dot" style="background:' + sp.dot + ';"></span>'
      + '<div style="flex:1;min-width:0;"><div class="t">' + k + '</div><div class="s">' + sp.tagline + '</div></div>'
      + (k === wbCurrentSpace ? v2ic('check', 15, 2, '#2563EB') : '') + '</div>';
  }).join('');
}
function wbSelectSpace(k) {
  var m = document.getElementById('wb2-space-menu');
  if (m) m.classList.remove('open');
  wbSetSpace(k);
}

// ── Workbench: 空间动态（按课题空间取数）  [time, day, title, desc, status, statusClass]
var V2_ACT_T = [['proj', '项目动态'], ['exp', '实验动态'], ['calc', '计算动态'], ['out', '成果动态']];
function v2RenderAct(k) {
  k = k || 'proj';
  wbActK = k;
  var act = wbSpace().activity || {};
  document.getElementById('wb2-act-pills').innerHTML = V2_ACT_T.map(function (p) {
    return '<button class="wb2-pill' + (p[0] === k ? ' active' : '') + '" onclick="v2RenderAct(\'' + p[0] + '\')">' + p[1] + '</button>';
  }).join('');
  var rows = act[k] || [];
  document.getElementById('wb2-act-list').innerHTML = rows.length ? rows.map(function (a) {
    return '<div class="wb2-tl-row"><div class="wb2-tl-time">' + (a[1] ? a[1] + '<br>' : '') + a[0] + '</div><span class="wb2-tl-dot"></span>'
      + '<div style="flex:1;min-width:0;"><div style="font-size:13.5px;font-weight:600;color:#0F2340;">' + a[2] + '</div>'
      + '<div class="wb2-rec-d" style="margin-top:3px;">' + a[3] + '</div></div>'
      + '<span class="wb2-st ' + a[5] + '">' + a[4] + '</span></div>';
  }).join('') : '<div style="padding:18px;text-align:center;color:#9AA3AF;font-size:12.5px;">暂无动态</div>';
}

// ── Workbench: 进行中的任务 / 最近产出（按课题空间取数）
function v2RenderLists() {
  var sp = wbSpace();
  var tasks = sp.tasks || [], outs = sp.outs || [];
  document.getElementById('wb2-task-list').innerHTML = tasks.length ? tasks.map(function (r, i) {
    return '<div class="wb2-row" onclick="v2OpenRecent(' + i + ')"><div class="wb2-ico" style="background:#EEF4FF;color:#2563EB;">' + v2ic(r.icon, 17, 1.8) + '</div>'
      + '<div style="flex:1;min-width:0;"><div class="wb2-rec-t">' + r.t + '</div><div class="wb2-rec-d">' + r.m + '</div></div>'
      + '<span class="wb2-badge ' + r.c + '">' + r.st + '</span><button class="wb2-more" style="font-size:12.5px;">' + r.btn + '</button></div>';
  }).join('') : '<div style="padding:22px;text-align:center;color:#9AA3AF;font-size:12.5px;">暂无进行中的任务</div>';
  document.getElementById('wb2-out-list').innerHTML = outs.length ? outs.map(function (r) {
    return '<div class="wb2-row"><div class="wb2-ico" style="background:#F2F5FA;color:#5E6B7E;">' + v2ic(r.icon, 17, 1.8) + '</div>'
      + '<div style="flex:1;min-width:0;"><div class="wb2-rec-t">' + r.t + '</div><div class="wb2-rec-d">' + r.m + '</div></div>'
      + '<span class="wb2-badge ' + r.c + '">' + r.st + '</span><button class="wb2-more" style="font-size:12.5px;">查看</button></div>';
  }).join('') : '<div style="padding:22px;text-align:center;color:#9AA3AF;font-size:12.5px;">暂无产出</div>';
}
function v2OpenRecent(i) {
  var r = (wbSpace().tasks || [])[i];
  if (!r) return;
  var match = null;
  document.querySelectorAll('#hb2-task-list .hb2-task').forEach(function (x) {
    var t = x.querySelector('.t');
    if (t && t.textContent === r.t) match = x;
  });
  hubOpenTask(match, r.t, r.n);
}

// ── Init
document.addEventListener('DOMContentLoaded', function () {
  wbSetSpace(wbCurrentSpace);
  selectMode('read');
  switchPage('workbench');
  if (typeof spRenderTasks === 'function') spRenderTasks();
  if (typeof renderMemberAvatars === 'function') renderMemberAvatars();
});
// 点击空白处关闭「课题空间」下拉
document.addEventListener('click', function () {
  var m = document.getElementById('wb2-space-menu');
  if (m) m.classList.remove('open');
});

