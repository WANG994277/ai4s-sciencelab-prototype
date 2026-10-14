/* Research project management agent directory. Content is transcribed from the supplied taxonomy. */
(() => {
  'use strict';

  const categories = [
    '立项管理', '过程管理', '外协管理', '成果管理', '人才管理', '考核管理', '日常管理',
  ];

  const agents = [
    { id: 'intelligence', category: '立项管理', name: '科技情报探员', icon: 'book', description: '持续跟踪科技情报动态，提供周度速递与专题深度探索。', capabilities: ['情报周速递', '情报深探索'] },
    { id: 'proposal-review', category: '立项管理', name: '科研立项审查专员', icon: 'file', description: '辅助编制开题报告，并对报告内容开展 AI 审查。', capabilities: ['开题报告编制', '开题报告AI审查'] },
    { id: 'needs-analysis', category: '立项管理', name: '需求分析专员', icon: 'search', description: '澄清科研需求、检查重复研究，并辅助形成可研报告。', capabilities: ['科研需求澄清', '科研查重', '可研报告编制'] },
    { id: 'new-three-review', category: '立项管理', name: '三新审查专员', icon: 'spark', description: '面向“三新”审查场景；具体能力清单尚待提供。', capabilities: [] },
    { id: 'progress-tracking', category: '过程管理', name: '科研进度跟踪', icon: 'tasks', description: '监控项目进度，按层级分类跟踪并形成分析报告。', capabilities: ['项目进度监控', '分级分类跟踪', 'AI分析与报告'] },
    { id: 'funding-alert', category: '过程管理', name: '科研经费预警', icon: 'alert', description: '汇总经费使用情况，识别异常并支持统计分析。', capabilities: ['经费查询与总览', '经费监控与预警', '经费统计与分析'] },
    { id: 'lab-sharing', category: '过程管理', name: '实验室智慧共享专员', icon: 'flask', description: '收集实验室需求，提供共享资源的智能推荐结果。', capabilities: ['实验室需求表单', 'AI推荐结果'] },
    { id: 'external-collaboration', category: '外协管理', name: '科研外协管理专家', icon: 'link', description: '面向科研外协管理场景，具体操作能力以接入信息为准。', capabilities: ['外协管理'] },
    { id: 'outcome-evaluation', category: '成果管理', name: '科技成果评价师', icon: 'asset', description: '围绕科技成果评价，辅助整理并形成成果报告。', capabilities: ['成果报告'] },
    { id: 'ip-architecture', category: '成果管理', name: '知识产权架构师', icon: 'lineage', description: '支持专利导航与知识产权布局策略分析。', capabilities: ['专利导航', '知识产权布局策略'] },
    { id: 'talent-matching', category: '人才管理', name: '科研人才匹配专家', icon: 'users', description: '面向科研人才匹配场景；具体能力清单尚待提供。', capabilities: [] },
    { id: 'management-support', category: '考核管理', name: '管理支撑能力', icon: 'sliders', description: '从管理数据中提炼指标，并支持逐层数据下钻。', capabilities: ['指标提炼', '数据下钻'] },
    { id: 'acceptance-review', category: '考核管理', name: '验收考核', icon: 'check', description: '面向项目验收与考核；具体能力清单尚待提供。', capabilities: [] },
    { id: 'research-schedule', category: '日常管理', name: '科研日程助手', icon: 'plan', description: '汇总工作与计划安排，支持课题周报和动态填报。', capabilities: ['主要落实情况', '工作总览', '计划安排', '课题周报', '周报展示·历史查阅', '周报填报·结构化填写', '动态录入·一键提交'] },
    { id: 'smart-clerk', category: '日常管理', name: '科研智慧文员', icon: 'compute', description: '通过智能问数方式查询科研管理相关数据。', capabilities: ['智能问数'] },
    { id: 'virtual-consultant', category: '日常管理', name: '虚拟咨询顾问', icon: 'help', description: '围绕科研相关问题提供对话式问答与历史查询。', capabilities: ['科研相关问题问答（对话历史、新建对话、对话输入框）'] },
  ];

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);

  const filterAgents = ({ category = '全部', query = '' } = {}) => {
    const term = String(query).trim().toLocaleLowerCase();
    return agents.filter((agent) =>
      (category === '全部' || agent.category === category) &&
      (!term || [agent.name, agent.category, agent.description].some((value) => value.toLocaleLowerCase().includes(term)))
    );
  };

  const markup = (filters = {}, icon = () => '') => {
    const category = categories.includes(filters.category) ? filters.category : '全部';
    const query = String(filters.query ?? '');
    const visible = filterAgents({ category, query });
    const categoryButtons = ['全部', ...categories].map((name) => {
      const count = name === '全部' ? agents.length : agents.filter((agent) => agent.category === name).length;
      return `<button type="button" class="pm-category ${category === name ? 'active' : ''}" data-pm-category="${escapeHtml(name)}" aria-pressed="${category === name}">${escapeHtml(name)} <span>${count}</span></button>`;
    }).join('');
    const cards = visible.map((agent) => `<article class="pm-agent-card">
      <div class="pm-agent-card-head"><span class="pm-agent-mark tone-${categories.indexOf(agent.category)}">${icon(agent.icon, 'icon-sm')}</span><span class="pm-agent-category">${escapeHtml(agent.category)}</span></div>
      <h2>${escapeHtml(agent.name)}</h2>
      <p class="pm-agent-description">${escapeHtml(agent.description)}</p>
      <button type="button" class="pm-card-action" data-pm-agent="${escapeHtml(agent.id)}" aria-label="开始使用${escapeHtml(agent.name)}">开始使用 ${icon('arrow', 'icon-sm')}</button>
    </article>`).join('');

    return `<div class="page project-management-page">
      <header class="pm-heading"><div><span class="pm-eyebrow">科研管理 · 智能体目录</span><h1>科研项目管理</h1><p>按科研管理环节发现智能体，查看能力范围与适用场景。</p></div><span class="pm-catalog-note">目录原型 · 尚未接入实际服务</span></header>
      <section class="pm-filter-panel" aria-label="智能体筛选">
        <form id="pm-search-form" class="pm-search-form"><label for="pm-search">搜索智能体</label><div><span aria-hidden="true">${icon('search', 'icon-sm')}</span><input id="pm-search" aria-label="搜索智能体" type="search" value="${escapeHtml(query)}" placeholder="搜索智能体名称或介绍"><button type="submit">搜索</button></div></form>
        <div class="pm-category-group" role="group" aria-label="管理分类"><strong>管理分类</strong><div class="pm-category-buttons">${categoryButtons}</div></div>
        <div class="pm-filter-footer"><button type="button" class="pm-reset" data-pm-reset>清空筛选</button></div>
      </section>
      <div class="pm-result-heading" role="status"><div><h2>${category === '全部' ? '全部智能体' : escapeHtml(category)}</h2><p>按用户提供的管理分类与能力清单整理</p></div><span>共 ${visible.length} 个智能体</span></div>
      ${visible.length ? `<div class="pm-agent-grid">${cards}</div>` : `<div class="pm-empty"><strong>没有匹配的智能体</strong><p>换个关键词或清空筛选条件再试。</p><button type="button" data-pm-reset>清空筛选</button></div>`}
    </div>`;
  };

  const detailMarkup = (id) => {
    const agent = agents.find((entry) => entry.id === id);
    if (!agent) return '';
    return `<div class="pm-detail"><span class="pm-detail-category">${escapeHtml(agent.category)}</span><p>${escapeHtml(agent.description)}</p><h3>提供资料中的能力</h3>${agent.capabilities.length
      ? `<ul>${agent.capabilities.map((name) => `<li>${escapeHtml(name)}</li>`).join('')}</ul>`
      : '<div class="pm-detail-pending">能力清单待提供</div>'}
      <div class="pm-detail-status"><strong>暂未接入实际智能体服务</strong><span>「开始使用」为原型入口，待提供正式服务地址后才能启动任务。</span></div></div>`;
  };

  window.AI4SProjectManagement = { categories, agents, filterAgents, markup, detailMarkup };
})();
