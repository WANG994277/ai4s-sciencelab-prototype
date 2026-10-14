// Only the supplier hub homepage markup and its research template content; no supplier app shell or runtime.
window.AI4SScienceHub = {
markup: "<div id=\"hub-home\" class=\"hb2-home mnt-bg\">\n      <div class=\"hb2-eyebrow\">AI FOR SCIENCE</div>\n      <h1 class=\"hb2-title\">从一个科研任务开始</h1>\n      <p class=\"hb2-sub\">描述你的研究目标、问题或材料，AI 将规划并推进后续工作</p>\n\n      <div class=\"hb2-modes\">\n        <div class=\"mode-card mode-static\" id=\"mc-read\"><div class=\"mode-ico\"><svg class=\"svg-ic \" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"\" aria-hidden=\"true\"><path d=\"M2.5 5.5C4.5 4.4 7.5 4.3 12 6c4.5-1.7 7.5-1.6 9.5-.5V19c-2-1-5-1.1-9.5.6-4.5-1.7-7.5-1.6-9.5-.6z\"/><path d=\"M12 6v13.6\"/></svg></div><div style=\"min-width:0;\"><div class=\"mode-t\">读 · 文献与知识</div><div class=\"mode-d\">检索、研读并组织可信科研证据</div></div></div><div class=\"mode-card mode-static\" id=\"mc-calc\"><div class=\"mode-ico\"><svg class=\"svg-ic \" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"\" aria-hidden=\"true\"><rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"2\"/><rect x=\"9.5\" y=\"9.5\" width=\"5\" height=\"5\" rx=\"1\"/><path d=\"M9.5 2.5v3.5M14.5 2.5v3.5M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5\"/></svg></div><div style=\"min-width:0;\"><div class=\"mode-t\">算 · 建模与计算</div><div class=\"mode-d\">分析数据、计算参数并运行科研模型</div></div></div><div class=\"mode-card mode-static\" id=\"mc-exp\"><div class=\"mode-ico\"><svg class=\"svg-ic \" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"\" aria-hidden=\"true\"><path d=\"M9 3h6\"/><path d=\"M10 3v6.2L4.6 18.8A1.5 1.5 0 0 0 5.9 21h12.2a1.5 1.5 0 0 0 1.3-2.2L14 9.2V3\"/><path d=\"M7.2 15h9.6\"/></svg></div><div style=\"min-width:0;\"><div class=\"mode-t\">做 · 实验与方案</div><div class=\"mode-d\">设计实验、生成方案并形成执行材料</div></div></div>\n      </div>\n\n      <div class=\"hb2-chips\" id=\"hb2-chips\"></div>\n\n      <div class=\"hb2-cmp\">\n        <div class=\"cmp-card\">\n          <div style=\"padding:16px 18px 6px;\">\n            <textarea id=\"hb2-input\" rows=\"5\" placeholder=\"描述研究目标、科研问题，或上传数据发起科研任务（如「对该部分配方数据做性能预测」）......\"></textarea>\n            <div id=\"hb2-attach\" style=\"display:none;align-items:center;gap:8px;margin-top:8px;\">\n              <span style=\"display:inline-flex;align-items:center;gap:7px;background:#EFF6FF;border:1px solid #DBEAFE;border-radius:8px;padding:5px 10px;font-size:12px;color:#2563EB;font-weight:600;\">\n                <i class=\"fa-solid fa-file-excel\" style=\"font-size:12px;color:#059669;\"></i><span class=\"name\">PPE配方数据_0922.xlsx</span>\n                <i class=\"fa-solid fa-xmark\" style=\"font-size:11px;color:#93C5FD;cursor:pointer;\"></i>\n              </span>\n            </div>\n          </div>\n          <div class=\"cmp-bar\">\n            <button class=\"cmp-btn sq\" title=\"上传材料\" data-action=\"material-picker\"><svg class=\"svg-ic \" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"\" aria-hidden=\"true\"><path d=\"M12 5v14M5 12h14\"/></svg></button><button class=\"cmp-btn\" id=\"hb2-link-btn\" title=\"关联到「我的科研任务」中的子任务；不选则默认新建任务\" data-action=\"hub-link-task\"><svg class=\"svg-ic \" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"\" aria-hidden=\"true\"><path d=\"M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/></svg><span id=\"hb2-link-label\">关联子任务</span><svg class=\"svg-ic \" width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"\" aria-hidden=\"true\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n            <div style=\"margin-left:auto;display:flex;align-items:center;gap:8px;\">\n              <select class=\"cmp-select\"><option>deepseekV4Pro</option><option>Claude Sonnet</option><option>GPT-4o</option></select>\n              <button class=\"cmp-send\" id=\"hb2-send\" data-action=\"start-hub-research\" title=\"发送（⌘/Ctrl + Enter）\"><svg class=\"svg-ic \" width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"\" aria-hidden=\"true\"><path d=\"M12 19V5M6 11l6-6 6 6\"/></svg></button>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- ══ 从模板创建 ══ -->\n      <div class=\"hb2-gallery\">\n        <div class=\"hb2-gtitle\"><span class=\"hb2-gico\" style=\"background:#EEF2FF;color:#4F46E5;\"><i class=\"fa-solid fa-table-cells-large\"></i></span>从模板创建</div>\n        <div class=\"hb2-tgrid\">\n          <div class=\"hb2-tcard\" data-hub-template=\"计算生物学研究任务\"><div class=\"hb2-ticon\" style=\"background:#EFF6FF;\">🧬</div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">计算生物学研究任务</div><div class=\"hb2-td\">生物信息分析、生物数据库集成，与系统化的 data-to-answer 工作流。</div></div></div>\n          <div class=\"hb2-tcard\" data-hub-template=\"计算化学研究任务\"><div class=\"hb2-ticon\" style=\"background:#ECFDF5;\">🧪</div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">计算化学研究任务</div><div class=\"hb2-td\">化学信息学、分子设计、对接、ADMET，与系统化的化学 data-to-answer 工作流。</div></div></div>\n          <div class=\"hb2-tcard\" data-hub-template=\"机器学习研究任务\"><div class=\"hb2-ticon\" style=\"background:#F5F3FF;\">🤖</div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">机器学习研究任务</div><div class=\"hb2-td\">端到端机器学习研究 —— 训练、评估，与系统化的 data-to-answer 工作流。</div></div></div>\n          <div class=\"hb2-tcard\" data-hub-template=\"计算物理学研究任务\"><div class=\"hb2-ticon\" style=\"background:#F5F3FF;\">⚛️</div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">计算物理学研究任务</div><div class=\"hb2-td\">仿真、PDE 求解、动力系统，与系统化的物理 data-to-answer 工作流。</div></div></div>\n          <div class=\"hb2-tcard\" data-hub-template=\"通用科研任务\"><div class=\"hb2-ticon\" style=\"background:#F9FAFB;\">🔬</div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">通用科研任务</div><div class=\"hb2-td\">跨学科科研：文献、沙箱分析与带来源作答。</div></div></div>\n          <div class=\"hb2-tcard\" data-hub-template=\"橡胶研发任务 test\"><div class=\"hb2-ticon\" style=\"background:#EFF6FF;\">📁</div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">橡胶研发任务 test <span class=\"hb2-tbadge\">自定义</span></div><div class=\"hb2-td\">复用你保存的橡胶配方研发流程模板，一键生成初始科研任务。</div></div></div>\n        </div>\n\n        <!-- ══ 示例研究 ══ -->\n        <div class=\"hb2-gtitle\" style=\"margin-top:38px;\"><span class=\"hb2-gico\" style=\"background:#EEF2FF;color:#4F46E5;\"><i class=\"fa-solid fa-wand-magic-sparkles\"></i></span>示例研究</div>\n        <div class=\"hb2-tgrid\">\n          <div class=\"hb2-tcard\" data-hub-example=\"科学附件预览样例库\"><div class=\"hb2-ticon\" style=\"background:#10B981;color:#fff;\"><i class=\"fa-solid fa-graduation-cap\"></i></div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">科学附件预览样例库 <span class=\"hb2-tbadge demo\">Demo</span></div><div class=\"hb2-td\">用于分析和渲染展示科研文件。</div></div></div>\n          <div class=\"hb2-tcard\" data-hub-example=\"极端微生物未知功能蛋白推演\"><div class=\"hb2-ticon\" style=\"background:#F59E0B;color:#fff;\"><i class=\"fa-solid fa-viruses\"></i></div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">极端微生物未知功能蛋白推演 <span class=\"hb2-tbadge demo\">Demo</span></div><div class=\"hb2-td\">计算生物学项目 —— 查真实数据库、沙箱分析、带来源作答。</div></div></div>\n          <div class=\"hb2-tcard\" data-hub-example=\"全基因组激酶 CRISPR 敲除筛选设计\"><div class=\"hb2-ticon\" style=\"background:#7C3AED;color:#fff;\"><i class=\"fa-solid fa-chart-column\"></i></div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">全基因组激酶 CRISPR 敲除筛选设... <span class=\"hb2-tbadge demo\">Demo</span></div><div class=\"hb2-td\">计算生物学项目 —— 查真实数据库、沙箱分析、带来源作答。</div></div></div>\n          <div class=\"hb2-tcard\" data-hub-example=\"重组酶序列解析与活性改造\"><div class=\"hb2-ticon\" style=\"background:#06B6D4;color:#fff;\"><i class=\"fa-solid fa-dna\"></i></div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">重组酶序列解析与活性改造 <span class=\"hb2-tbadge demo\">Demo</span></div><div class=\"hb2-td\">计算生物学项目 —— 查真实数据库、沙箱分析、带来源作答。</div></div></div>\n          <div class=\"hb2-tcard\" data-hub-example=\"免疫治疗前后肿瘤 scRNA-seq 对比\"><div class=\"hb2-ticon\" style=\"background:#EC4899;color:#fff;\"><i class=\"fa-solid fa-atom\"></i></div><div class=\"hb2-tmain\"><div class=\"hb2-tt\">免疫治疗前后肿瘤 scRNA-seq 对... <span class=\"hb2-tbadge demo\">Demo</span></div><div class=\"hb2-td\">计算生物学项目 —— 查真实数据库、沙箱分析、带来源作答。</div></div></div>\n        </div>\n      </div>\n    </div>",
templates: {
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
}
};
