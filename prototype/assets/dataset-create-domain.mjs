export const DATASET_OPTIONS = {
  modalities: ['文本', '图像', '音频', '视频', '多模态', '时序'],
  levels: ['L0通用级', 'L1行业级', 'L2课题级'],
  authorizations: ['内部', '课题内共享', '项目内共享'],
  modelTypes: ['用于训练的模型类型', '文本生成', '计算机视觉', '时序预测', '多模态'],
  dataTypes: ['纯文本', '问答对', '表格', '图像', '音频', '视频', '时序'],
  sources: ['对象存储', '数据集管理'],
};

export function normalizeTags(value = '') {
  return [...new Set(String(value).split(/[\s,，]+/).map((item) => item.trim()).filter(Boolean))];
}

export function validateDataset(value = {}) {
  const required = [
    ['name', '请填写数据集名称'], ['modality', '请选择模态类型'], ['level', '请选择数据集层级'],
    ['authorization', '请选择授权类型'], ['dataType', '请选择数据类型'], ['source', '请选择数据源'],
    ['selectedData', '请选择数据'],
  ];
  const errors = required.filter(([field]) => !String(value[field] || '').trim()).map(([field, message]) => ({ field, message }));
  if (String(value.name || '').length > 127) errors.push({ field: 'name', message: '数据集名称不能超过 127 个字符' });
  if (String(value.description || '').length > 500) errors.push({ field: 'description', message: '描述不能超过 500 个字符' });
  return { valid: errors.length === 0, errors };
}

export function buildDatasetAsset(value, context = {}) {
  const now = new Date().toLocaleString('zh-CN', { hour12: false });
  return {
    id: context.id || `dataset-${Date.now()}`,
    name: String(value.name).trim(),
    type: '数据集',
    scope: context.scope || '当前课题空间',
    creator: context.creator || '林夏',
    version: 'V1.0',
    status: context.status || '草稿',
    listing: '未上架',
    creationSource: '数据集创建',
    sourceName: value.selectedData,
    created: now,
    updated: now,
    publishedAt: context.status === '已发布' ? now : '',
    tags: normalizeTags(value.tags),
    versionTags: normalizeTags(value.versionTags),
    boundary: value.description || '按课题空间权限和数据授权范围使用',
    instructions: `使用 ${value.dataType} 数据版本 V1.0；来源：${value.source}`,
    quality: value.versionDescription || '初始版本，等待后续质量检查',
    config: {
      modality: value.modality, level: value.level, authorization: value.authorization,
      modelType: value.modelType || '', stream: value.stream || '否', versionDescription: value.versionDescription || '',
      dataType: value.dataType, source: value.source, selectedData: value.selectedData,
    },
    config0: value.selectedData,
    config1: `${value.dataType} · ${value.modality}`,
    config2: value.versionDescription || '初始版本',
    sources: [{ name: value.selectedData, version: 'V1.0', source: value.source }],
  };
}

if (typeof window !== 'undefined') window.AI4SDatasetCreate = { DATASET_OPTIONS, normalizeTags, validateDataset, buildDatasetAsset };
