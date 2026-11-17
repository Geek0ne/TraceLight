import { useEffect, useState } from 'react';
import { WorkspaceMode, ThemeConfig } from './types/aether';
import { DEFAULT_THEME_CONFIG } from './data/demoContent';
import { exportAetherDevZip } from './data/repoFiles';
import { TopBar } from './components/TopBar';
import { ThemePreview } from './components/ThemePreview';
import { RepoExplorer } from './components/RepoExplorer';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { DeployDocs } from './components/DeployDocs';

export default function App() {
  const [mode, setMode] = useState<WorkspaceMode>('preview');
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved =
        localStorage.getItem('tracelight_studio_theme') ||
        localStorage.getItem('aether_studio_theme');
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('tracelight_studio_config');
      return saved ? { ...DEFAULT_THEME_CONFIG, ...JSON.parse(saved) } : DEFAULT_THEME_CONFIG;
    } catch {
      return DEFAULT_THEME_CONFIG;
    }
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('tracelight_studio_theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  const handleConfigChange = (next: ThemeConfig) => {
    setConfig(next);
    try {
      localStorage.setItem('tracelight_studio_config', JSON.stringify(next));
    } catch {}
  };

  const handleExportZip = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportNotice(null);
    try {
      await exportAetherDevZip(config);
      setExportNotice('已导出 TraceLight-typecho-theme-v1.1.0.zip（含完整主题与 GitHub 仓库文件）');
      setTimeout(() => setExportNotice(null), 4000);
    } catch {
      setExportNotice('打包导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className={`min-h-screen text-[var(--text-primary)] ${
        mode === 'preview' ? 'bg-transparent' : 'bg-[var(--bg-base)]'
      }`}
    >
      <TopBar
        mode={mode}
        onModeChange={setMode}
        onExportZip={handleExportZip}
        isExporting={isExporting}
      />

      {exportNotice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-medium text-[var(--text-primary)] shadow-lg"
        >
          {exportNotice}
        </div>
      )}

      <main>
        {mode === 'preview' && (
          <ThemePreview
            config={config}
            isDark={isDark}
            onToggleTheme={() => setIsDark((prev) => !prev)}
          />
        )}
        {mode === 'repo' && (
          <RepoExplorer
            config={config}
            onExportZip={handleExportZip}
            isExporting={isExporting}
          />
        )}
        {mode === 'config' && (
          <ThemeCustomizer
            config={config}
            onChange={handleConfigChange}
            onJumpToPreview={() => setMode('preview')}
          />
        )}
        {mode === 'docs' && <DeployDocs />}
      </main>
    </div>
  );
}
