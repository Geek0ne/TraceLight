import React from 'react';
import { BookOpen, Download, Eye, FolderGit2, SlidersHorizontal } from 'lucide-react';
import { WorkspaceMode } from '../types/aether';

interface TopBarProps {
  mode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
  onExportZip: () => void;
  isExporting: boolean;
}

const NAV_ITEMS: { id: WorkspaceMode; label: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { id: 'preview', label: '实时预览', Icon: Eye },
  { id: 'repo', label: '源码仓库', Icon: FolderGit2 },
  { id: 'config', label: '参数配置', Icon: SlidersHorizontal },
  { id: 'docs', label: '部署文档', Icon: BookOpen }
];

export const TopBar: React.FC<TopBarProps> = ({
  mode,
  onModeChange,
  onExportZip,
  isExporting
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-xl">
      <div className="aether-container flex h-14 sm:h-16 items-center justify-between gap-3 sm:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onModeChange('preview')}
          className="text-left text-base sm:text-[18px] font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
        >
          溯光 · TraceLight
        </button>

        {/* Zone 2: 4 clean single-line navigation links with unified monoline icons */}
        <nav aria-label="工作台主导航" className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = mode === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onModeChange(id)}
                className={`relative inline-flex items-center gap-1.5 py-1.5 text-[13px] sm:text-[15px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded ${
                  active
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-[var(--accent)]' : 'opacity-75'}`}
                  strokeWidth={1.85}
                  aria-hidden="true"
                />
                <span>{label}</span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[14px] sm:-bottom-[17px] h-0.5 bg-[var(--accent)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onExportZip}
            disabled={isExporting}
            className="aether-cta-primary inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-gradient-to-b from-slate-800 to-slate-950 dark:from-sky-400 dark:to-sky-500 px-3 sm:px-4 py-2 text-xs font-semibold text-white dark:text-slate-950 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{isExporting ? '正在打包...' : '导出仓库 ZIP'}</span>
            <span className="sm:hidden">{isExporting ? '打包中' : '导出 ZIP'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
