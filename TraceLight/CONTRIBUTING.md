# 贡献与二次开发指南 (Contributing Guide)

欢迎为 **溯光 · TraceLight** 主题提交 Pull Request、性能优化建议或 Bug 修复！

## 本地开发调试建议

1. 在本地搭建 PHP 8.x + Typecho 1.2+ 测试环境（可使用 Docker、ServBay 或 PHP 内置服务器 `php -S 127.0.0.1:8080`）。
2. 将本仓库软链接或放置到 Typecho 的 `usr/themes/TraceLight` 目录：
   ```bash
   ln -s /path/to/your/TraceLight /path/to/typecho/usr/themes/TraceLight
   ```
3. 修改样式或脚本时无需构建步骤，直接刷新浏览器（建议禁用浏览器缓存）即可实时查看效果。

## 代码规范

- **PHP**：遵循 PSR-12 基础缩进（4 空格），输出用户数据必须使用 `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')` 或 Typecho 内置转义方法，防止 XSS。
- **CSS**：新增颜色或间距请优先复用 `assets/css/style.css` 顶部的 `:root` 与 `[data-theme="light"]` 变量，确保亮暗双模式对比度达标。
- **JavaScript**：保持零第三方构建依赖的原生 ES6+ 风格，注意判断 DOM 元素是否存在（使用可选链 `?.`），避免非当前页面模板报错。

## 提交规范 (Conventional Commits)

- `feat:` 新增特性或自定义模板
- `fix:` 修复 PHP 兼容问题、样式错位或 JS 逻辑缺陷
- `docs:` 完善 `README.md` 或注释说明
- `style:` 纯样式微调（不影响逻辑）
