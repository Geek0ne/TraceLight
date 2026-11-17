import React, { useState } from 'react';
import { Code2, Eye, Globe, Image as ImageIcon, RotateCcw, ShieldCheck } from 'lucide-react';
import { CodeHighlightTheme, CopyrightLicenseId, CoverMode, ThemeConfig } from '../types/aether';
import { DEFAULT_GALAXY_BG, DEFAULT_THEME_CONFIG, RANDOM_COVER_API_PRESETS } from '../data/demoContent';
import { CODE_THEMES, HighlightedCodeBlock } from '../utils/syntaxHighlight';
import { COPYRIGHT_LICENSES } from '../utils/coverAndShare';
import { applyConfigToFunctionsPhp, applyConfigToHeaderPhp } from '../data/repoFiles';
import functionsPhpRaw from '../../TraceLight/functions.php?raw';
import headerPhpRaw from '../../TraceLight/header.php?raw';

interface ThemeCustomizerProps {
  config: ThemeConfig;
  onChange: (next: ThemeConfig) => void;
  onJumpToPreview: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  config,
  onChange,
  onJumpToPreview
}) => {
  const [previewTab, setPreviewTab] = useState<'header' | 'functions'>('header');

  const updateField = <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const generatedHeaderSnippet = applyConfigToHeaderPhp(headerPhpRaw, config)
    .split('\n')
    .slice(0, 52)
    .join('\n');

  const generatedFunctionsSnippet = applyConfigToFunctionsPhp(functionsPhpRaw, config)
    .split('\n')
    .slice(0, 185)
    .join('\n');

  return (
    <div className="aether-container py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono-tabular text-xs font-medium text-[var(--accent)] mb-1">
            THEMECONFIG &amp; SEO META GENERATOR
          </p>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            可视化主题参数与 SEO 元标签配置器
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            配置站点外观、关键词、搜索引擎作者描述与 Open Graph 分享图；所有修改实时同步至预览视图，并自动注入导出 ZIP 的 header.php 与 functions.php。
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onChange(DEFAULT_THEME_CONFIG)}
            className="aether-control inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>恢复默认</span>
          </button>
          <button
            type="button"
            onClick={onJumpToPreview}
            className="aether-cta-primary inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-sky-400 to-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 cursor-pointer whitespace-nowrap"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>查看实时效果</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form Controls */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onJumpToPreview();
          }}
          className="aether-card rounded-xl p-5 sm:p-6 space-y-6"
        >
          {/* Appearance & Profile */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-mono-tabular">
              基础信息与外观设置
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[var(--text-secondary)]">站点标题 (Blog Title)</span>
                <input
                  type="text"
                  value={config.siteTitle}
                  onChange={(e) => updateField('siteTitle', e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[var(--text-secondary)]">Hero 终端状态标签 (heroTag)</span>
                <input
                  type="text"
                  value={config.heroTag}
                  onChange={(e) => updateField('heroTag', e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[var(--text-secondary)]">首页个人简介 (heroBio)</span>
              <textarea
                rows={2}
                value={config.heroBio}
                onChange={(e) => updateField('heroBio', e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[var(--text-secondary)]">博主头像 URL (avatar)</span>
                <input
                  type="text"
                  value={config.avatar}
                  onChange={(e) => updateField('avatar', e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 font-mono-tabular text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[var(--text-secondary)]">GitHub 主页链接 (githubUrl)</span>
                <input
                  type="url"
                  value={config.githubUrl}
                  onChange={(e) => updateField('githubUrl', e.target.value)}
                  placeholder="留空则不显示 GitHub 按钮"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 font-mono-tabular text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[var(--text-secondary)]">微信打赏码 URL (wechatQr)</span>
                <input
                  type="text"
                  value={config.wechatQr}
                  onChange={(e) => updateField('wechatQr', e.target.value)}
                  placeholder="https://example.com/wechat-qr.png"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 font-mono-tabular text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[var(--text-secondary)]">支付宝打赏码 URL (alipayQr)</span>
                <input
                  type="text"
                  value={config.alipayQr}
                  onChange={(e) => updateField('alipayQr', e.target.value)}
                  placeholder="https://example.com/alipay-qr.png"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 font-mono-tabular text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[var(--text-secondary)]">备案号 / 底部版权补充 (icp)</span>
                <input
                  type="text"
                  value={config.icp}
                  onChange={(e) => updateField('icp', e.target.value)}
                  placeholder="如：京ICP备20260001号"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>

              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-[var(--text-secondary)]">
                  全局文章首字下沉 (enableDropCap)
                </span>
                <div className="inline-flex rounded-lg bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => updateField('enableDropCap', true)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer ${
                      config.enableDropCap
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    开启 (1)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('enableDropCap', false)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer ${
                      !config.enableDropCap
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    关闭 (0)
                  </button>
                </div>
              </div>
            </div>

            {/* Global Default Background, Translucency & Code Highlight Theme */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)] font-mono-tabular">
                  <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>全局默认背景、透明磨砂与代码风格</span>
                </h3>
                <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                  即时预览生效
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    全局默认背景图 (globalBgImage)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateField('globalBgImage', DEFAULT_GALAXY_BG)}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium border cursor-pointer transition-colors ${
                        config.globalBgImage === DEFAULT_GALAXY_BG
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      内置银河星空 (默认)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('globalBgImage', '')}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium border cursor-pointer transition-colors ${
                        !config.globalBgImage
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      关闭背景图
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {config.globalBgImage && (
                    <img
                      src={config.globalBgImage}
                      alt="全局背景缩略图"
                      referrerPolicy="no-referrer"
                      className="h-10 w-16 rounded-lg object-cover border border-[var(--border-subtle)] shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={config.globalBgImage}
                    onChange={(e) => updateField('globalBgImage', e.target.value)}
                    placeholder="填写自定义背景图 URL 或留空关闭..."
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 font-mono-tabular text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-[var(--text-secondary)]">
                    卡片与导航透明磨砂 (globalBgTranslucent)
                  </span>
                  <div className="inline-flex rounded-lg bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => updateField('globalBgTranslucent', true)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer ${
                        config.globalBgTranslucent
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      开启透明 (推荐)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('globalBgTranslucent', false)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer ${
                        !config.globalBgTranslucent
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      关闭 (实色)
                    </button>
                  </div>
                </div>

                <label className="block space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                    <Code2 className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                    <span>文章代码高亮主题（仅后台统一配置 · 10 种可选）</span>
                  </span>
                  <select
                    value={config.codeHighlightTheme}
                    onChange={(e) =>
                      updateField('codeHighlightTheme', e.target.value as CodeHighlightTheme)
                    }
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                  >
                    {(Object.keys(CODE_THEMES) as CodeHighlightTheme[]).map((themeId) => (
                      <option key={themeId} value={themeId}>
                        {CODE_THEMES[themeId].label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Backend Live Code Highlight Preview */}
              {(() => {
                const activeSpec = CODE_THEMES[config.codeHighlightTheme] || CODE_THEMES['tokyo-night'];
                return (
                  <div
                    className="rounded-xl border overflow-hidden shadow-sm"
                    style={{ backgroundColor: activeSpec.bg, borderColor: activeSpec.border }}
                  >
                    <div
                      className="flex items-center justify-between px-3.5 py-1.5 border-b font-mono-tabular text-[11px]"
                      style={{ backgroundColor: activeSpec.headerBg, borderColor: activeSpec.border }}
                    >
                      <span className="font-semibold uppercase" style={{ color: activeSpec.langBadge }}>
                        RUST · {activeSpec.label}
                      </span>
                      <span style={{ color: activeSpec.lineNum }}>后台全局生效预览</span>
                    </div>
                    <HighlightedCodeBlock
                      theme={config.codeHighlightTheme}
                      code={`pub fn trace_light(req: &Request) -> u32 {\n    let latency_us = 18; // zero-overhead eBPF\n    return latency_us;\n}`}
                    />
                  </div>
                );
              })()}
            </div>

            {/* Global Article Cover & Copyright Protocol */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)] font-mono-tabular">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>文章封面模式、随机主图接口与内容版权协议</span>
                </h3>
                <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                  注入 functions.php
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-[var(--text-secondary)]">
                  全局默认封面策略 (defaultCoverMode)
                </span>
                <div className="flex flex-wrap gap-1.5 rounded-lg bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)]">
                  {(
                    [
                      { id: 'auto', label: '自动生成 SVG 几何封面' },
                      { id: 'random', label: '随机接口配图 (自动换图)' },
                      { id: 'none', label: '无封面 (纯文字卡片)' }
                    ] as { id: CoverMode; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateField('defaultCoverMode', opt.id)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                        config.defaultCoverMode === opt.id
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]/50 p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    文章随机主图 API 接口 (randomCoverApi)
                  </span>
                  <span className="font-mono-tabular text-[10px] text-[var(--text-muted)]">
                    支持每篇独立参数与刷新自动换图
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {RANDOM_COVER_API_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => updateField('randomCoverApi', preset.url)}
                      title={preset.desc}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium border cursor-pointer transition-colors ${
                        config.randomCoverApi === preset.url
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={config.randomCoverApi}
                  onChange={(e) => updateField('randomCoverApi', e.target.value)}
                  placeholder="https://picsum.photos/1200/630?random= 或 __LOCAL__"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 font-mono-tabular text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
                <p className="text-[11px] text-[var(--text-muted)]">
                  自动为每篇文章注入独立随机参数（支持 <code className="font-mono-tabular">{'{cid}'}</code> /{' '}
                  <code className="font-mono-tabular">{'{seed}'}</code> 占位符），外网图片加载失败自动回退主题内置高清封面。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    内容版权许可协议 (copyrightLicense)
                  </span>
                  <select
                    value={config.copyrightLicense}
                    onChange={(e) =>
                      updateField('copyrightLicense', e.target.value as CopyrightLicenseId)
                    }
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                  >
                    {(Object.keys(COPYRIGHT_LICENSES) as CopyrightLicenseId[]).map((id) => (
                      <option key={id} value={id}>
                        {COPYRIGHT_LICENSES[id].short} — {COPYRIGHT_LICENSES[id].name.slice(0, 14)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    版权默认作者署名 (copyrightAuthor)
                  </span>
                  <input
                    type="text"
                    value={config.copyrightAuthor}
                    onChange={(e) => updateField('copyrightAuthor', e.target.value)}
                    placeholder="留空则默认使用文章作者昵称"
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Custom SEO Meta Tags Section */}
          <div className="space-y-4 pt-5 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)] font-mono-tabular">
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                <span>SEO 元标签与 Open Graph 分享配置</span>
              </h2>
              <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                注入 header.php
              </span>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                站点关键词 (meta keywords)
              </span>
              <input
                type="text"
                value={config.seoKeywords}
                onChange={(e) => updateField('seoKeywords', e.target.value)}
                placeholder="Typecho, Rust, Go, Cloud Native, 技术博客"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
              />
            </label>

            <label className="block space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  搜索引擎作者与站点摘要 (meta description / og:description)
                </span>
                <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                  {config.seoAuthorBio.length} 字符
                </span>
              </div>
              <textarea
                rows={2}
                value={config.seoAuthorBio}
                onChange={(e) => updateField('seoAuthorBio', e.target.value)}
                placeholder="建议 120–160 字符，简明描述博主背景与博客技术方向..."
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                Open Graph / Twitter 封面图 URL (og:image / twitter:image)
              </span>
              <input
                type="url"
                value={config.ogImageUrl}
                onChange={(e) => updateField('ogImageUrl', e.target.value)}
                placeholder="https://your-domain.com/usr/themes/TraceLight/screenshot.jpg"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 font-mono-tabular text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
              />
            </label>
          </div>
        </form>

        {/* Live Generated PHP Output with Header/Functions Tab Switch */}
        <div className="aether-card rounded-xl overflow-hidden">
          <div className="border-b border-[var(--border-subtle)] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="生成代码预览切换"
              className="inline-flex rounded-lg bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={previewTab === 'header'}
                onClick={() => setPreviewTab('header')}
                className={`rounded-md px-3 py-1 font-mono-tabular text-xs font-medium cursor-pointer transition-colors ${
                  previewTab === 'header'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                header.php (SEO)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={previewTab === 'functions'}
                onClick={() => setPreviewTab('functions')}
                className={`rounded-md px-3 py-1 font-mono-tabular text-xs font-medium cursor-pointer transition-colors ${
                  previewTab === 'functions'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                functions.php
              </button>
            </div>
            <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
              同步注入导出包
            </span>
          </div>

          <pre className="max-h-[600px] overflow-auto bg-[var(--bg-base)] p-4 font-mono-tabular text-xs text-[var(--text-primary)] leading-relaxed">
            <code>
              {previewTab === 'header' ? generatedHeaderSnippet : generatedFunctionsSnippet}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
