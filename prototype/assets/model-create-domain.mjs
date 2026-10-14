export const MODEL_TYPES = ['文本生成', '视觉理解', '图像生成', '计算机视觉', '时序', '预测', '重排序', '向量表示', '语音'];
export const MODEL_SOURCES = ['训练任务', '增量预训练', '有监督微调', '对象存储上传'];

export function validateModel(value = {}) {
  const errors = [];
  const name = String(value.name || '').trim();
  if (!name) errors.push({ field: 'name', message: '请填写模型名称' });
  else if (name.length > 30) errors.push({ field: 'name', message: '模型名称不能超过 30 个字符' });
  else if (!/^[\u4e00-\u9fa5A-Za-z0-9][\u4e00-\u9fa5A-Za-z0-9_-]*$/.test(name)) errors.push({ field: 'name', message: '模型名称仅支持中英文、数字、下划线和中划线' });
  if (!Array.isArray(value.modelTypes) || value.modelTypes.length === 0) errors.push({ field: 'modelTypes', message: '请至少选择一种模型类型' });
  return { valid: errors.length === 0, errors };
}

export function buildModelAsset(value, context = {}) {
  const now = new Date().toLocaleString('zh-CN', { hour12: false });
  return {
    id: context.id || `model-${Date.now()}`,
    name: String(value.name).trim(),
    type: '模型',
    modelTypes: [...value.modelTypes],
    description: value.description || '',
    scope: context.scope || '当前课题空间',
    creator: context.creator || '林夏',
    version: '--',
    status: '已发布',
    listing: '未上架',
    creationSource: '模型创建',
    sourceName: '空间模型管理',
    created: now,
    updated: now,
    publishedAt: now,
    versions: [],
    sources: [],
    boundary: value.description || '按模型版本能力与课题权限使用',
    instructions: '创建模型版本后可用于训练、调优、评估与推理。',
    quality: '尚无模型版本，暂不可执行。',
    config0: value.modelTypes.join('、'),
    config1: value.description || '—',
    config2: '尚无版本',
  };
}

export function validateModelVersion(value = {}) {
  const errors = [];
  if (!MODEL_SOURCES.includes(value.source)) errors.push({ field: 'source', message: '请选择模型来源' });
  if (value.source === '对象存储上传' && !String(value.objectPath || '').trim()) errors.push({ field: 'objectPath', message: '请选择对象存储路径' });
  if (value.source !== '对象存储上传' && !String(value.task || '').trim()) errors.push({ field: 'task', message: '请选择任务' });
  return { valid: errors.length === 0, errors };
}

export function buildModelVersion(value, existingCount = 0) {
  const now = new Date().toLocaleString('zh-CN', { hour12: false });
  return {
    id: `model-version-${Date.now()}`,
    number: `v${existingCount + 1}.0`,
    description: value.note || '新模型版本',
    baseModel: value.baseModel || '—',
    source: value.source,
    task: value.source === '对象存储上传' ? '—' : value.task,
    objectPath: value.source === '对象存储上传' ? value.objectPath : '',
    creator: value.creator || '林夏',
    createdAt: now,
    status: '导入完成',
  };
}

if (typeof window !== 'undefined') window.AI4SModelCreate = { MODEL_TYPES, MODEL_SOURCES, validateModel, buildModelAsset, validateModelVersion, buildModelVersion };
