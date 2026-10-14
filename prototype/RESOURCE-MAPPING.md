# 科研资源中心原页映射

外层平台保持既有导航与 iframe 容器，不重做资源页面样式。

| 外层菜单 | 同事 10.2 原始路由 |
| --- | --- |
| 知识中心 | `assets/resource-app/index.html#/resource/knowledge` |
| 科研数据集 | `assets/resource-app/index.html#/resource/datasets` |
| 科研模型 | `assets/resource-app/index.html#/resource/models` |
| 科研工具箱 | `assets/resource-app/index.html#/resource/tools?view=科研工具` |
| 科研技能 | `assets/resource-app/index.html#/resource/skills` |
| 科研智能体及应用 | `assets/vendor-frame-3.html` / `assets/vendor-frame-1.html` |

同事最新导航未提供独立智能体/应用资源广场，不将科研活动内的开发列表冒充资源广场。

知识、数据、模型、工具和技能页来自 `online-app`，通过 `npm run build:offline` 打包到 `prototype/assets/resource-app/`。静态主平台可直接打开 `index.html`，不再依赖 3002 开发服务。智能体及应用继续使用随包提供的静态原型页。在线工程开发时仍可单独运行 `npm run dev`。

旧参考原型保存在 `online-app/reference-prototype/`，不参与开发服务或离线构建。前五个菜单仅有上表的新版入口；修改源码后构建脚本会为本地 JS/CSS 写入内容版本号，刷新页面即可加载新文件。

课题空间「科研活动」中的科学计算、模型训练、模型推理列表与详情也复用同一个离线资源包，通过 `postMessage` 与主原型交换演示任务数据。修改 `online-app` 源码后，需要在 `online-app` 目录重新运行 `npm run build:offline`，再刷新主原型。
