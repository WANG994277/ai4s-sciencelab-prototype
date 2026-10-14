# AI4S ScienceLab 科研平台原型

本仓库包含可直接预览的静态原型和新版资源页面的 React 源码。入口是 [prototype/index.html](prototype/index.html)；仓库根目录的 `index.html` 会跳转到该入口。

## 目录

- `prototype/`：主平台静态原型，以及已打包的新版科研资源和科研活动页面。
- `online-app/`：React + TypeScript 源码。`reference-prototype/` 保留早期参考页，不参与运行和构建。
- `knowledge-center-audit/`：知识中心布局审计与截图证据。

## 本地预览

直接打开 `prototype/index.html`，或在 `prototype` 目录运行：

```bash
python3 -m http.server 8766
```

浏览器打开 `http://127.0.0.1:8766/`。科研知识中心、数据集、模型、工具箱、技能及科研活动的计算/训练/推理页面已经打包在 `prototype/assets/resource-app/`，预览无需单独启动 3002 端口。

修改 `online-app` 源码后，运行以下命令更新静态包：

```bash
cd online-app
npm ci
npm run build:offline
```

原型使用演示数据，不连接真实模型、算力、数据或实验设备。产品范围与体验路径见 [原型说明](prototype/README.md)；近期修改见 [CHANGELOG.md](CHANGELOG.md)。
