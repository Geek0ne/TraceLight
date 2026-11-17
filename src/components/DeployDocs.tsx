import React from 'react';
import { BookOpen, Layers, Palette, Terminal } from 'lucide-react';
import { THEME_SCREENSHOT_IMG } from '../data/demoContent';

const CUSTOM_PAGES = [
  {
    title: '碎碎念',
    slug: 'moments',
    template: '碎碎念 (Moments)',
    note: '需在编辑页右侧勾选「允许评论」，支持本地选图/图片 URL 多图朋友圈发布与地理坐标标签。'
  },
  {
    title: '时光归档',
    slug: 'archive',
    template: '时光归档 (Archive)',
    note: '自动聚合全站文章并生成 52 周 GitHub 热力图、分类矩阵与年份时间轴。'
  },
  {
    title: '书签库',
    slug: 'bookmarks',
    template: '书签库 (Bookmarks)',
    note: '正文按每行「标题 | URL | 分类 | 推荐短评」填写即可生成可筛选收藏矩阵。'
  },
  {
    title: '实验室',
    slug: 'projects',
    template: '实验室 (Projects)',
    note: '正文按每行「项目名 | URL | 状态 | 技术栈 | 指标 | 简介」填写，支持状态筛选。'
  },
  {
    title: '友邻',
    slug: 'links',
    template: '友邻 (Links)',
    note: '正文按每行「名称 | URL | 头像URL | 简介 | 标签」填写即可生成 Bento 卡片。'
  },
  {
    title: '关于',
    slug: 'about',
    template: '关于 (About)',
    note: '展示个人名片、技术雷达、NOW 近况、工程履历、Uses 装备与精选项目。'
  },
  {
    title: '站点地图',
    slug: 'sitemap',
    template: '站点地图 (Sitemap)',
    note: '自动聚合全站页面、分类、标签与年份文章目录，同时原生支持 ?do=sitemap / sitemap.xml 标准 XML 索引。'
  }
];

const CSS_TOKENS = [
  { token: '--bg-base', dark: '#05070c', light: '#edf1f7', desc: '全局主画布底色' },
  { token: '--bg-surface', dark: 'rgba(17, 22, 34, 0.86)', light: 'rgba(255, 255, 255, 0.94)', desc: 'Bento 卡片立体毛玻璃表面' },
  { token: '--accent', dark: '#38bdf8', light: '#0284c7', desc: '主焦点强调色（链接、目录树、进度条）' },
  { token: '--accent-2', dark: '#818cf8', light: '#4f46e5', desc: '渐变辅助色' },
  { token: '--font-mono', dark: 'JetBrains Mono', light: 'JetBrains Mono', desc: '代码、终端与等宽统计数字' }
];

export const DeployDocs: React.FC = () => {
  return (
    <div className="aether-container py-6 sm:py-8 space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
        <div>
          <p className="font-mono-tabular text-xs font-medium text-[var(--accent)] mb-2">
            DEPLOYMENT &amp; SECONDARY DEVELOPMENT
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mb-3">
            溯光 · TraceLight 安装部署与二次开发文档
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            本主题兼容 Typecho 1.2+ 与 PHP 7.4–8.3。零第三方重型 JS 框架依赖，无需创建任何额外数据库表，直接复用原生 <code className="font-mono-tabular text-[var(--accent)]">table.fields</code> 完成阅读量与点赞持久化。
          </p>
        </div>

        <div className="aether-card rounded-xl overflow-hidden">
          <img
            src={THEME_SCREENSHOT_IMG}
            alt="TraceLight Typecho Theme Preview"
            referrerPolicy="no-referrer"
            className="w-full h-52 object-cover"
          />
        </div>
      </div>

      {/* Step 1: Installation */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
          <Terminal className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
          <span>01. 安装与激活主题</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aether-card rounded-xl p-5">
            <span className="font-mono-tabular text-xs text-[var(--accent)]">STEP 1</span>
            <h3 className="mt-1 text-sm font-semibold text-[var(--text-primary)]">上传或克隆仓库</h3>
            <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              点击右上角「导出仓库 ZIP」，解压后将 <code className="font-mono-tabular">TraceLight</code> 文件夹上传至 Typecho 站点的 <code className="font-mono-tabular">/usr/themes/TraceLight/</code>。
            </p>
          </div>
          <div className="aether-card rounded-xl p-5">
            <span className="font-mono-tabular text-xs text-[var(--accent)]">STEP 2</span>
            <h3 className="mt-1 text-sm font-semibold text-[var(--text-primary)]">后台启用外观</h3>
            <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              进入 Typecho 后台「控制台 → 外观」，启用 <strong className="text-[var(--text-primary)]">TraceLight (溯光)</strong> 并在「设置外观」填入头像、个人简介与打赏码。
            </p>
          </div>
          <div className="aether-card rounded-xl p-5">
            <span className="font-mono-tabular text-xs text-[var(--accent)]">STEP 3</span>
            <h3 className="mt-1 text-sm font-semibold text-[var(--text-primary)]">建立独立页面</h3>
            <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              在「管理 → 独立页面」创建 7 个特色页面（含站点地图），并在编辑器右侧「自定义模板」中选择对应模板即可生效。
            </p>
          </div>
        </div>
      </section>

      {/* Step 2: Custom Pages Matrix */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
          <Layers className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
          <span>02. 七大特色独立页面配置表</span>
        </h2>

        <div className="aether-card overflow-x-auto rounded-xl">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono-tabular">
                <th className="py-3 px-4">页面标题</th>
                <th className="py-3 px-4">缩略名 (Slug)</th>
                <th className="py-3 px-4">右侧自定义模板</th>
                <th className="py-3 px-4">关键配置说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {CUSTOM_PAGES.map((row) => (
                <tr key={row.slug} className="hover:bg-[var(--bg-elevated)]/40">
                  <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">{row.title}</td>
                  <td className="py-3 px-4 font-mono-tabular text-[var(--accent)]">{row.slug}</td>
                  <td className="py-3 px-4 font-mono-tabular text-[var(--text-secondary)]">{row.template}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Step 3: Markdown Enhancements */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
          <BookOpen className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
          <span>03. Markdown 增强语法速查</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aether-card rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Callout 提示框语法</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              支持 <code className="font-mono-tabular text-[var(--accent)]">[!NOTE]</code>、<code className="font-mono-tabular text-[var(--accent)]">[!INFO]</code>、<code className="font-mono-tabular text-[var(--accent)]">[!TIP]</code>、<code className="font-mono-tabular text-[var(--accent)]">[!WARNING]</code>、<code className="font-mono-tabular text-[var(--accent)]">[!DANGER]</code> 五种语义块：
            </p>
            <pre className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3.5 font-mono-tabular text-xs text-[var(--text-primary)] overflow-x-auto">
              <code>{`> [!TIP]
> 在高并发写入场景下优先使用 Per-CPU RingBuffer 聚合。`}</code>
            </pre>
          </div>

          <div className="aether-card rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Nginx / Caddy 伪静态配合 /sitemap.xml 与性能优化</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              主题已内置 <code className="font-mono-tabular text-[var(--accent)]">?do=sitemap</code> 接口（页脚右下角可直达）与无刷新 AJAX 评论提交；若启用了服务器伪静态，可添加重写规则直接响应 <code className="font-mono-tabular text-[var(--accent)]">/sitemap.xml</code>：
            </p>
            <pre className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3.5 font-mono-tabular text-xs text-[var(--text-primary)] overflow-x-auto">
              <code>{`# Nginx 伪静态追加（让搜索引擎直接访问 /sitemap.xml）
rewrite ^/sitemap\\.xml$ /index.php?do=sitemap last;

# 碎碎念多图标记示例（发布器自动生成）
![桌面掠影](https://example.com/desk.jpg)`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Step 4: CSS Tokens */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
          <Palette className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
          <span>04. 二次开发 CSS 设计令牌 (Design Tokens)</span>
        </h2>

        <div className="aether-card overflow-x-auto rounded-xl">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono-tabular">
                <th className="py-3 px-4">变量名</th>
                <th className="py-3 px-4">Dark 默认值</th>
                <th className="py-3 px-4">Light 默认值</th>
                <th className="py-3 px-4">设计用途</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {CSS_TOKENS.map((item) => (
                <tr key={item.token} className="hover:bg-[var(--bg-elevated)]/40">
                  <td className="py-3 px-4 font-mono-tabular text-[var(--accent)]">{item.token}</td>
                  <td className="py-3 px-4 font-mono-tabular text-[var(--text-secondary)]">{item.dark}</td>
                  <td className="py-3 px-4 font-mono-tabular text-[var(--text-secondary)]">{item.light}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
