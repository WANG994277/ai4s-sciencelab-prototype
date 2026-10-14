import test from 'node:test';
import assert from 'node:assert/strict';
import { MODEL_TYPES, MODEL_SOURCES, buildModelAsset, buildModelVersion, validateModel, validateModelVersion } from './model-create-domain.mjs';

test('exposes all model types shown in the reference form', () => {
  assert.deepEqual(MODEL_TYPES, ['文本生成', '视觉理解', '图像生成', '计算机视觉', '时序', '预测', '重排序', '向量表示', '语音']);
});

test('requires a valid model name and at least one model type', () => {
  assert.deepEqual(validateModel({ name: '', modelTypes: [] }).errors.map((item) => item.field), ['name', 'modelTypes']);
  assert.equal(validateModel({ name: '模型 A', modelTypes: ['文本生成'] }).valid, false);
  assert.equal(validateModel({ name: '模型_A-01', modelTypes: ['文本生成'] }).valid, true);
});

test('creates a model without a version and preserves selected model types', () => {
  const model = buildModelAsset({ name: '科研预测模型', modelTypes: ['文本生成', '预测'], description: '科研模型' }, { scope: '高性能合成橡胶', creator: '林夏' });
  assert.equal(model.version, '--');
  assert.deepEqual(model.modelTypes, ['文本生成', '预测']);
  assert.deepEqual(model.versions, []);
});

test('supports the four model version sources from the reference page', () => {
  assert.deepEqual(MODEL_SOURCES, ['训练任务', '增量预训练', '有监督微调', '对象存储上传']);
});

test('task-sourced versions require a task while object storage requires a path', () => {
  assert.equal(validateModelVersion({ source: '训练任务', task: '' }).valid, false);
  assert.equal(validateModelVersion({ source: '对象存储上传', objectPath: '' }).valid, false);
  assert.equal(validateModelVersion({ source: '训练任务', task: '配方预测训练 #TR-101' }).valid, true);
});

test('builds a system-numbered model version with its source metadata', () => {
  const version = buildModelVersion({ source: '训练任务', task: '配方预测训练 #TR-101', baseModel: 'Qwen3-32B', note: '首个训练版本' }, 0);
  assert.equal(version.number, 'v1.0');
  assert.equal(version.source, '训练任务');
  assert.equal(version.task, '配方预测训练 #TR-101');
  assert.equal(version.status, '导入完成');
});
