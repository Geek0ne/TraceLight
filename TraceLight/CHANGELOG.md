# Changelog

All notable changes to the **TraceLight (溯光)** Typecho theme will be documented in this file.

## [V0.35] - 2026-11-17

### Added
- 后台「主题外观设置」新增 10 套代码高亮风格统一切换（Tokyo Night / GitHub Dark / One Dark Pro / Dracula / Nord / Monokai Sublime / Night Owl / Solarized Dark / VS Code Dark+ / GitHub Light），不再需要在单篇文章内单独配置。
- 新增全局默认背景图片开关与内置银河星空背景图 (`assets/bg/galaxy.jpg`)，配合高通透毛玻璃表面 (`rgba(15, 21, 36, 0.56)` / `rgba(255, 255, 255, 0.62)`) 展现绚丽星空质感。
- 新增文章主图随机图片接口 (`randomCoverApi`) 与自动轮换封面能力（支持 `auto` SVG 封面、随机接口动态换图与本地内置封面兜底）。
- 新增文章评论区输入法级表情面板：发送栏左侧独立 `😊 表情` 按钮，支持 5 大分类 120 枚常见表情一键插入光标并兼容 AJAX 无刷新提交。
- 新增内置 XML 站点地图 (`/?do=sitemap`) 与可视化站点地图页面 (`page-sitemap.php`)，右下角页脚直达入口。
- 新增全站内容版权许可协议卡片（CC BY-NC-SA 4.0 / CC BY 4.0 / All Rights Reserved）及国内外 9 大主流社交平台分享栏。

### Changed & Fixed
- 优化顶部主导航栏居中对齐与滚动吸顶固定定位，统一导航菜单图标体系并放大首页标题视觉层级。
- 修正「时光归档」页面年度热力图与外层边框自适应比例（基于 `--hm-cell` / `--hm-gap` 流体尺寸，按年份切换展示）。
- 修正「书签库」等列表页点击筛选后页脚上浮遮挡问题，通过 Sticky Footer 弹性布局固定页脚贴底。
- 强化 PHP 7.4–8.3、Typecho 1.2/1.3 与 MySQL/PostgreSQL/SQLite 安全与兼容性过滤；支持 `v*` 与 `V*` 双标签触发 GitHub Release 自动发版。

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
