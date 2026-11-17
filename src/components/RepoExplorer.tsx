import React, { useMemo, useState } from 'react';
import { Check, Copy, FileCode2, FolderGit2, Search, Terminal } from 'lucide-react';
import { RepoFileEntry, ThemeConfig } from '../types/aether';
import { buildRepoFiles } from '../data/repoFiles';

interface RepoExplorerProps {
  config: ThemeConfig;
  onExportZip: () => void;
  isExporting: boolean;
}

const CATEGORY_TABS: { id: 'all' | RepoFileEntry['category']; label: string }[] = [
  { id: 'all', label: '全部文件' },
  { id: 'core', label: '核心引擎' },
  { id: 'template', label: '页面模板' },
  { id: 'assets', label: '样式脚本' },
  { id: 'docs', label: '项目文档' },
  { id: 'github', label: 'GitHub 工程' }
];

const REPAIR_AUDIT_ITEMS = [
  '修复 comments.php / page-archive.php / style.css / main.js 原始语法错漏与误译标记',
  'URL 白名单协议净化 (escSafeUrl) + AJAX 点赞同源校验 + XML Sitemap (?do=sitemap) 自动生成',
  'PHP 8.2/8.3 null 安全转换与 Typecho 1.2/1.3 版本兼容辅助 (getTypechoVersion)',
  '跨数据库 (MySQL 8 / PostgreSQL / SQLite) 字段并发自增幂等与静态请求内缓存优化',
  '修复短页面页脚上跳问题（flex 列布局 + margin-top: auto）及 sticky 导航兼容 (overflow-x: clip)'
];

export const RepoExplorer: React.FC<RepoExplorerProps> = ({
  config,
  onExportZip,
  isExporting
}) => {
  const files = useMemo(() => buildRepoFiles(config), [config]);
  const [selectedPath, setSelectedPath] = useState<string>('README.md');
  const [categoryFilter, setCategoryFilter] = useState<'all' | RepoFileEntry['category']>('all');
  const [query, setQuery] = useState('');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);

  const filteredFiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return files.filter((file) => {
      const matchCat = categoryFilter === 'all' || file.category === categoryFilter;
      const matchQuery =
        !q ||
        file.path.toLowerCase().includes(q) ||
        file.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [files, categoryFilter, query]);

  const activeFile = useMemo(
    () => files.find((f) => f.path === selectedPath) || filteredFiles[0] || files[0],
    [files, filteredFiles, selectedPath]
  );

  const codeLines = useMemo(() => activeFile.content.split('\n'), [activeFile]);

  const handleCopyFile = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopiedPath(activeFile.path);
      setTimeout(() => setCopiedPath(null), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const gitPushCommands = `unzip TraceLight-typecho-theme-v1.1.0.zip -d TraceLight-repo
cd TraceLight-repo/TraceLight
git init -b main
git add .
git commit -m "feat: release TraceLight Typecho theme v1.1.0"
git remote add origin https://github.com/<your-username>/typecho-theme-tracelight.git
git push -u origin main`;

  const handleCopyGitCmd = async () => {
    try {
      await navigator.clipboard.writeText(gitPushCommands);
      setCopiedGitCmd(true);
      setTimeout(() => setCopiedGitCmd(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="aether-container py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Summary */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono-tabular text-xs font-medium text-[var(--accent)] mb-1">
            GITHUB REPOSITORY READY · {files.length} FILES + SCREENSHOT
          </p>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            溯光 · TraceLight Typecho 主题完整源码仓库
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            已完成全部 PHP / CSS / JavaScript 语法审计与 GitHub 开源工程补全；您在「参数配置」中的修改会实时注入 header.php 与 functions.php。
          </p>
        </div>

        <button
          type="button"
          onClick={onExportZip}
          disabled={isExporting}
          className="aether-control inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FolderGit2 className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
          <span>{isExporting ? '正在生成压缩包...' : '下载完整仓库 ZIP'}</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)]">
          {CATEGORY_TABS.map((tab) => {
            const active = categoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="过滤文件名或功能..."
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 pl-8 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>

      {/* 2-Column File Browser + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start">
        {/* Sidebar File List */}
        <aside className="aether-card rounded-xl overflow-hidden">
          <div className="border-b border-[var(--border-subtle)] px-4 py-3 flex items-center justify-between">
            <span className="font-mono-tabular text-xs font-semibold text-[var(--text-secondary)]">
              TraceLight/
            </span>
            <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
              {filteredFiles.length} 项
            </span>
          </div>

          <div className="max-h-[580px] overflow-y-auto divide-y divide-[var(--border-subtle)]">
            {filteredFiles.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                未找到匹配的文件
              </div>
            ) : (
              filteredFiles.map((file) => {
                const isSelected = activeFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedPath(file.path)}
                    className={`w-full text-left px-4 py-2.5 transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <FileCode2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="font-mono-tabular text-xs truncate">{file.path}</span>
                    </span>
                    <span className="font-mono-tabular text-[11px] text-[var(--text-muted)] shrink-0">
                      {file.content.split('\n').length}L
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Code Viewer Pane */}
        <section className="aether-card rounded-xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-5 py-3.5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono-tabular text-sm font-semibold text-[var(--text-primary)]">
                  TraceLight/{activeFile.path}
                </span>
                <span className="text-xs text-[var(--text-muted)]">·</span>
                <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                  {activeFile.language.toUpperCase()}
                </span>
                <span className="text-xs text-[var(--text-muted)]">·</span>
                <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                  {codeLines.length} lines
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)] truncate">
                {activeFile.description}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyFile}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-1.5 font-mono-tabular text-xs text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedPath === activeFile.path ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>复制源码</span>
                </>
              )}
            </button>
          </div>

          <div className="max-h-[540px] overflow-auto bg-[var(--bg-base)] p-4">
            <table className="w-full border-collapse font-mono-tabular text-xs leading-relaxed">
              <tbody>
                {codeLines.map((line, index) => (
                  <tr key={index} className="hover:bg-[var(--bg-elevated)]/60">
                    <td className="select-none pr-4 text-right text-[var(--text-muted)] align-top w-10">
                      {index + 1}
                    </td>
                    <td className="whitespace-pre text-[var(--text-primary)]">
                      {line || ' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Bottom 2-Column Info: Git Push Guide + Audit Fixes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="aether-card rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Terminal className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              <span>推送至您的 GitHub 仓库</span>
            </h2>
            <button
              type="button"
              onClick={handleCopyGitCmd}
              className="aether-control inline-flex items-center gap-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1 font-mono-tabular text-[11px] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer"
            >
              {copiedGitCmd ? '已复制命令' : '复制命令'}
            </button>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-3">
            工作区本地 <code className="font-mono-tabular text-[var(--accent)]">TraceLight/</code> 已完成 Git 初始化提交。导出 ZIP 后执行以下命令即可推送到您的远程 GitHub 仓库：
          </p>
          <pre className="overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4 font-mono-tabular text-xs text-[var(--text-primary)] leading-relaxed">
            <code>{gitPushCommands}</code>
          </pre>
        </div>

        <div className="aether-card rounded-xl p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            源码静态审计与 Bug 修复清单
          </h2>
          <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
            {REPAIR_AUDIT_ITEMS.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
