# Changelog

All notable changes to the **TraceLight (溯光)** Typecho theme will be documented in this file.

## [1.1.0] - 2026-11-17

### Changed
- 主题正式更名为 **溯光 · TraceLight**，寓意“溯光而行，以码载道”。
- 升级首页右侧终端为拟真 `fastfetch + zsh` 会话面板，新增 ASCII 徽标、ANSI 色块条与 Git 提交记录。
- 优化 Hero 底部 4 栏数据指标条排版，改为标签与数字紧凑上下对齐，消除视觉空洞感。
- 强化全局背景层与卡片之间的色彩对比度及 3D 顶部高光立体质感，完善移动端与平板响应式适配。
- 修正文章正文 Markdown 表格仅显示横线的问题，补全横纵全网格框线与表头对比度；增强文章代码块彩色高亮呈现。
- 全面丰富「关于 (About)」页面模块：新增技术雷达能力条、工程履历时间线、常用装备工作流 (`Uses`) 与联系入口。

### Added
- 新增两大特色独立页面模板：`page-bookmarks.php`（书签与灵感库）与 `page-projects.php`（开源项目实验室）。

## [1.0.0] - 2026-11-17

### Added
- 初始完整版本发布，采用 Linear / Vercel / Raycast 工程美学设计系统。
- 暗黑 / 亮色双模式无缝切换与防闪烁脚本（`localStorage` 持久化）。
- `functions.php`：主题后台配置项、原生 `table.fields` 浏览量与点赞持久化、字数/阅读时长统计、Obsidian/GitHub Callout 解析、双图画廊解析、User-Agent 解析及热力图 JSON 聚合。
- 四大基础特色独立页面模板：`page-moments.php`、`page-archive.php`、`page-links.php`、`page-about.php`。
- 完善的 `README.md`、MIT `LICENSE`、`CONTRIBUTING.md` 及 GitHub Actions 自动 Release 打包流程。
