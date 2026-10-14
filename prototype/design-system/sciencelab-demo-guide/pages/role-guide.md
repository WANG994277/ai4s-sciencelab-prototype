# Role Guide Page Overrides

## 已确定的演示手册设计

以下规则覆盖本文件后方自动生成的推荐，适用于三角色 HTML 演示说明。

- 交付：单个离线 HTML，内联 CSS / JavaScript，无 CDN、字体或图片依赖。现有原型不改动。
- 原生 HTML 的语义元素、details / summary、CSS Grid 与浏览器打印足以完成文档导航与演示，无须引入前端框架或新依赖。后续内容可拆出 JSON；当前维持单文件便于传阅。
- 阅读结构：固定左目录 + 右侧正文；总览、科研人员、科研工具创建人员、科研项目管理人员、会前准备与评审边界。每个角色提供步骤流程、入口、动作、话术、结果与交接。
- 视觉：沿用 ScienceLab 蓝白、深蓝文字。背景 #F5F8FC，表面 #FFFFFF，主色 #085FD7，墨色 #0B2146，正文 #31496E，次要文字 #526782，分割 #D9E5F3。提示使用原型语义色并附文字标签。
- 字体：本地 Avenir Next / PingFang SC / Microsoft YaHei / sans-serif；编号用 SFMono-Regular / Consolas / monospace。取消在线字体。
- 字号：正文 16px / 行高 1.75，辅助 13px，三级标题 19px，二级标题 28px，页面标题 42px；大字模式提升正文至 18px。
- 空间：4 / 8 / 12 / 16 / 24 / 32 / 48px；左栏 244px；顶部 68px；正文最大 1180px。
- 圆角：按钮与输入 6px、内容面板 10px；流程采用线和序号串联。少量阴影仅用于浮层，不做装饰性大卡片堆叠。
- 交互：左目录切换角色、角色流程定位步骤、全文步骤搜索、展开折叠、复制话术、逐步演示、打印全部内容。实际原型操作只在说明中列出。
- 无障碍：skip link、可见焦点、语义按钮、aria-current / aria-expanded、状态文字不只靠颜色、按 Escape 退出演示、尊重 reduced-motion，锚点预留顶栏空间。
- 验证：桌面 1080 / 1280 / 1440px；不增加移动端验收范围。核对横向溢出、长中文、搜索空态、角色与演示模式切换、打印可见性、无外部依赖和 JavaScript 错误。
- 内容：事实与示例区分；管理域跳转仅 toast 明确标为入口示意；本地模拟不可写成真实服务完成。每步给出预期状态与兜底。
- 本文件不采用下方推荐中的营销落地页结构、Contact Sales、橙色 CTA 和移动优先布局。

---

## 自动生成推荐存档

> **PROJECT:** ScienceLab Demo Guide
> **Generated:** 2026-10-09 16:09:17
> **Page Type:** Search Results

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1400px or full-width
- **Grid:** 12-column grid for data flexibility
- **Sections:** 1. Hero (Video/Mission), 2. Solutions by Industry, 3. Solutions by Role, 4. Client Logos, 5. Contact Sales

### Spacing Overrides

- **Content Density:** High — optimize for information display

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Corporate: Navy/Grey. High integrity. Conservative accents.

### Component Overrides

- Avoid: Blank empty screens
- Avoid: Icon buttons without labels
- Avoid: Keyboard traps or illogical tab order

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading
- Feedback: Show helpful message and action
- Accessibility: Add aria-label for icon-only buttons
- Accessibility: Tab order matches visual order
- CTA Placement: Contact Sales (Primary) + Login (Secondary)
