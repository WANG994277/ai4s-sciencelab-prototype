import test from 'node:test';
import assert from 'node:assert/strict';
import { DATASET_OPTIONS, buildDatasetAsset, normalizeTags, validateDataset } from './dataset-create-domain.mjs';

test('dataset form exposes the reference-page options without floating service controls', () => {
  assert.deepEqual(DATASET_OPTIONS.modalities, ['文本', '图像', '音频', '视频', '多模态', '时序']);
  assert.deepEqual(DATASET_OPTIONS.levels, ['L0通用级', 'L1行业级', 'L2课题级']);
  assert.deepEqual(DATASET_OPTIONS.sources, ['对象存储', '数据集管理']);
  assert.equal('floatingSupport' in DATASET_OPTIONS, false);
});

test('normalizes comma and whitespace separated tags without duplicates', () => {
  assert.deepEqual(normalizeTags('橡胶, 实验  橡胶，配方'), ['橡胶', '实验', '配方']);
});

test('requires name, modality, level, authorization, data type, source and selected data', () => {
  const result = validateDataset({ name: '', modality: '', level: '', authorization: '', dataType: '', source: '', selectedData: '' });
  assert.deepEqual(result.errors.map((item) => item.field), ['name', 'modality', 'level', 'authorization', 'dataType', 'source', 'selectedData']);
});

test('builds a V1 dataset asset using the submitted form values', () => {
  const asset = buildDatasetAsset({
    name: '配方实验数据集', modality: '文本', level: 'L2课题级', tags: '橡胶,配方',
    description: '课题实验数据', authorization: '内部', modelType: '文本生成', stream: '否',
    versionDescription: '初始导入', versionTags: '原始,已脱敏', dataType: '纯文本',
    source: '对象存储', selectedData: '/rubber/formula-v1/',
  }, { scope: '高性能合成橡胶', creator: '林夏', status: '已发布' });
  assert.equal(asset.name, '配方实验数据集');
  assert.equal(asset.version, 'V1.0');
  assert.equal(asset.type, '数据集');
  assert.deepEqual(asset.tags, ['橡胶', '配方']);
  assert.equal(asset.config.source, '对象存储');
  assert.equal(asset.config.selectedData, '/rubber/formula-v1/');
});
