import JSZip from 'jszip';
import { RepoFileEntry, ThemeConfig } from '../types/aether';
import {
  COVER_CLOUD_TOPOLOGY,
  COVER_CRAFT_MINIMAL,
  COVER_SYSTEMS_OBSIDIAN,
  DEFAULT_GALAXY_BG,
  THEME_SCREENSHOT_IMG
} from './demoContent';

import functionsPhpRaw from '../../TraceLight/functions.php?raw';
import headerPhpRaw from '../../TraceLight/header.php?raw';
import footerPhpRaw from '../../TraceLight/footer.php?raw';
import indexPhpRaw from '../../TraceLight/index.php?raw';
import postPhpRaw from '../../TraceLight/post.php?raw';
import commentsPhpRaw from '../../TraceLight/comments.php?raw';
import pagePhpRaw from '../../TraceLight/page.php?raw';
import pageMomentsPhpRaw from '../../TraceLight/page-moments.php?raw';
import pageArchivePhpRaw from '../../TraceLight/page-archive.php?raw';
import pageBookmarksPhpRaw from '../../TraceLight/page-bookmarks.php?raw';
import pageProjectsPhpRaw from '../../TraceLight/page-projects.php?raw';
import pageLinksPhpRaw from '../../TraceLight/page-links.php?raw';
import pageAboutPhpRaw from '../../TraceLight/page-about.php?raw';
import pageSitemapPhpRaw from '../../TraceLight/page-sitemap.php?raw';
import styleCssRaw from '../../TraceLight/assets/css/style.css?raw';
import mainJsRaw from '../../TraceLight/assets/js/main.js?raw';
import readmeMdRaw from '../../TraceLight/README.md?raw';
import licenseRaw from '../../TraceLight/LICENSE?raw';
import gitignoreRaw from '../../TraceLight/.gitignore?raw';
import changelogMdRaw from '../../TraceLight/CHANGELOG.md?raw';
import contributingMdRaw from '../../TraceLight/CONTRIBUTING.md?raw';
import releaseYmlRaw from '../../TraceLight/.github/workflows/release.yml?raw';
import bugReportMdRaw from '../../TraceLight/.github/ISSUE_TEMPLATE/bug_report.md?raw';

function escapePhpSingleQuote(val: string): string {
  return val.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export function applyConfigToFunctionsPhp(raw: string, config: ThemeConfig): string {
  let out = raw;
  const replaceDefault = (field: string, value: string) => {
    const safe = escapePhpSingleQuote(value);
    const regex = new RegExp(
      `(\\$${field}\\s*=\\s*new\\s+Typecho_Widget_Helper_Form_Element_(?:Text|Textarea)\\(\\s*'${field}',\\s*NULL,\\s*)'[^']*'`,
      'm'
    );
    out = out.replace(regex, `$1'${safe}'`);
  };

  replaceDefault('avatar', config.avatar.startsWith('/src/') ? 'https://avatars.githubusercontent.com/u/9919?v=4' : config.avatar);
  replaceDefault('heroTag', config.heroTag);
  replaceDefault('heroBio', config.heroBio);
  replaceDefault('githubUrl', config.githubUrl);
  replaceDefault('wechatQr', config.wechatQr);
  replaceDefault('alipayQr', config.alipayQr);
  replaceDefault('copyrightAuthor', config.copyrightAuthor);
  replaceDefault('icp', config.icp);
  replaceDefault('seoKeywords', config.seoKeywords);
  replaceDefault('seoAuthorBio', config.seoAuthorBio);
  replaceDefault('ogImageUrl', config.ogImageUrl);
  replaceDefault('randomCoverApi', config.randomCoverApi || '__LOCAL__');

  const bgValue = !config.globalBgImage.trim()
    ? 'none'
    : config.globalBgImage === DEFAULT_GALAXY_BG
    ? '__DEFAULT_GALAXY__'
    : config.globalBgImage.startsWith('/src/')
    ? '__DEFAULT_GALAXY__'
    : config.globalBgImage.trim();

  replaceDefault('globalBgImage', bgValue);

  out = out.replace(
    /(\$globalBgTranslucent\s*=\s*new\s+Typecho_Widget_Helper_Form_Element_Radio\([\s\S]*?array\([^\)]+\),\s*)'[01]'/,
    `$1'${config.globalBgTranslucent ? '1' : '0'}'`
  );

  out = out.replace(
    /(\$codeHighlightTheme\s*=\s*new\s+Typecho_Widget_Helper_Form_Element_Select\([\s\S]*?array\([\s\S]*?\),\s*)'[^']*'/,
    `$1'${escapePhpSingleQuote(config.codeHighlightTheme)}'`
  );

  out = out.replace(
    /(\$enableDropCap\s*=\s*new\s+Typecho_Widget_Helper_Form_Element_Radio\([\s\S]*?array\([^\)]+\),\s*)'[01]'/,
    `$1'${config.enableDropCap ? '1' : '0'}'`
  );

  out = out.replace(
    /(\$defaultCoverMode\s*=\s*new\s+Typecho_Widget_Helper_Form_Element_Radio\([\s\S]*?array\([\s\S]*?\),\s*)'[^']*'/,
    `$1'${escapePhpSingleQuote(config.defaultCoverMode)}'`
  );

  out = out.replace(
    /(\$copyrightLicense\s*=\s*new\s+Typecho_Widget_Helper_Form_Element_Select\([\s\S]*?array\([\s\S]*?\),\s*)'[^']*'/,
    `$1'${escapePhpSingleQuote(config.copyrightLicense)}'`
  );

  return out;
}

export function applyConfigToHeaderPhp(raw: string, config: ThemeConfig): string {
  let out = raw;
  const keywordsSafe = escapePhpSingleQuote(config.seoKeywords || 'Typecho, 溯光, TraceLight, Engineering Blog');
  const bioSafe = escapePhpSingleQuote(config.seoAuthorBio || config.heroBio);
  const ogImgSafe = escapePhpSingleQuote(config.ogImageUrl);

  out = out.replace(
    /(\$seoDesc\s*=\s*\$this->is\('single'\)[\s\S]*?:\s*)(?:\(string\))?\(\$this->options->seoAuthorBio\s*\?:\s*\$this->options->description\);/,
    `$1(string)(\$this->options->seoAuthorBio ?: '${bioSafe}');`
  );
  out = out.replace(
    /(\$seoKeywords\s*=\s*)(?:\(string\))?\(?\$this->options->seoKeywords\s*\?:\s*'[^']*'\)*;/,
    `$1(string)(\$this->options->seoKeywords ?: '${keywordsSafe}');`
  );
  out = out.replace(
    /(\$ogImage\s*=\s*)(?:\(string\))?\(?\$this->options->ogImageUrl\s*\?:\s*[^;]+\)*;/,
    ogImgSafe
      ? `$1(string)(\$this->options->ogImageUrl ?: '${ogImgSafe}');`
      : `$1(string)(\$this->options->ogImageUrl ?: \$this->options->themeUrl('screenshot.jpg', true));`
  );

  return out;
}

export function buildRepoFiles(config: ThemeConfig): RepoFileEntry[] {
  const customizedFunctions = applyConfigToFunctionsPhp(functionsPhpRaw, config);
  const customizedHeader = applyConfigToHeaderPhp(headerPhpRaw, config);

  return [
    {
      path: 'README.md',
      category: 'docs',
      language: 'markdown',
      description: '完整安装指南、7 个自定义页面配置、全局银河背景与 Sitemap 文档',
      content: readmeMdRaw
    },
    {
      path: 'functions.php',
      category: 'core',
      language: 'php',
      description: '核心引擎：themeConfig、原生 fields 计数持久化、Callout/画廊解析与热力图聚合',
      content: customizedFunctions
    },
    {
      path: 'index.php',
      category: 'template',
      language: 'php',
      description: '特色首页：诗意 Hero + 拟真 fastfetch 终端面板 + Bento 文章卡片流',
      content: indexPhpRaw
    },
    {
      path: 'header.php',
      category: 'core',
      language: 'php',
      description: '全局头部：自定义 SEO 元标签、Open Graph / Twitter Card、流光网格与玻璃态导航',
      content: customizedHeader
    },
    {
      path: 'footer.php',
      category: 'core',
      language: 'php',
      description: '全局页脚：Cmd/Ctrl+K 搜索模态框与图片灯箱',
      content: footerPhpRaw
    },
    {
      path: 'post.php',
      category: 'template',
      language: 'php',
      description: '文章详情页：首字下沉、右侧悬浮 TOC、点赞打赏互动与上下篇导航',
      content: postPhpRaw
    },
    {
      path: 'comments.php',
      category: 'template',
      language: 'php',
      description: '嵌套评论区：BLOGGER 博主徽章、UA 标识、轻量表情自选框与即时回复',
      content: commentsPhpRaw
    },
    {
      path: 'page.php',
      category: 'template',
      language: 'php',
      description: '默认独立页面模板',
      content: pagePhpRaw
    },
    {
      path: 'page-moments.php',
      category: 'template',
      language: 'php',
      description: '特色模板：碎碎念 (Moments) 现场发布动态页',
      content: pageMomentsPhpRaw
    },
    {
      path: 'page-archive.php',
      category: 'template',
      language: 'php',
      description: '特色模板：时光归档 (52 周 GitHub 热力图 + 分类矩阵 + 时间轴)',
      content: pageArchivePhpRaw
    },
    {
      path: 'page-bookmarks.php',
      category: 'template',
      language: 'php',
      description: '特色模板：书签库 (Bookmarks) 技术资源与灵感收藏矩阵',
      content: pageBookmarksPhpRaw
    },
    {
      path: 'page-projects.php',
      category: 'template',
      language: 'php',
      description: '特色模板：实验室 (Projects) 开源作品与状态筛选矩阵',
      content: pageProjectsPhpRaw
    },
    {
      path: 'page-links.php',
      category: 'template',
      language: 'php',
      description: '特色模板：友邻 (Links) Bento 卡片 + 延迟状态检测 + 申请规范',
      content: pageLinksPhpRaw
    },
    {
      path: 'page-about.php',
      category: 'template',
      language: 'php',
      description: '特色模板：关于 (About) 个人档案 + 技术雷达 + 履历时间线 + Uses 装备',
      content: pageAboutPhpRaw
    },
    {
      path: 'page-sitemap.php',
      category: 'template',
      language: 'php',
      description: '特色模板：站点地图 (Sitemap) 全站目录树与 XML 索引',
      content: pageSitemapPhpRaw
    },
    {
      path: 'assets/css/style.css',
      category: 'assets',
      language: 'css',
      description: '全局样式系统：暗/亮双主题变量、Bento 卡片与 Markdown 排版',
      content: styleCssRaw
    },
    {
      path: 'assets/js/main.js',
      category: 'assets',
      language: 'javascript',
      description: '纯原生 ES6+ 交互脚本：追光背景、TOC 监听、评论表情插入与 AJAX 提交、代码复制与热力图',
      content: mainJsRaw
    },
    {
      path: 'CHANGELOG.md',
      category: 'docs',
      language: 'markdown',
      description: '版本更新与修复记录',
      content: changelogMdRaw
    },
    {
      path: 'CONTRIBUTING.md',
      category: 'docs',
      language: 'markdown',
      description: '二次开发规范与本地调试指引',
      content: contributingMdRaw
    },
    {
      path: 'LICENSE',
      category: 'docs',
      language: 'text',
      description: 'MIT 开源许可协议',
      content: licenseRaw
    },
    {
      path: '.gitignore',
      category: 'github',
      language: 'text',
      description: 'Git 版本控制忽略配置',
      content: gitignoreRaw
    },
    {
      path: '.github/workflows/release.yml',
      category: 'github',
      language: 'yaml',
      description: 'GitHub Actions：推送 v* / V* 标签自动语法检查并打包 Release ZIP',
      content: releaseYmlRaw
    },
    {
      path: '.github/ISSUE_TEMPLATE/bug_report.md',
      category: 'github',
      language: 'markdown',
      description: 'GitHub Issue Bug 反馈模板',
      content: bugReportMdRaw
    }
  ];
}

export async function exportAetherDevZip(config: ThemeConfig): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('TraceLight');
  if (!rootFolder) throw new Error('Unable to initialize ZIP root folder');

  const files = buildRepoFiles(config);
  for (const file of files) {
    rootFolder.file(file.path, file.content);
  }

  const binaryAssets: { path: string; url: string }[] = [
    { path: 'screenshot.jpg', url: THEME_SCREENSHOT_IMG },
    { path: 'assets/bg/galaxy.jpg', url: DEFAULT_GALAXY_BG },
    { path: 'assets/covers/cover-1.jpg', url: COVER_SYSTEMS_OBSIDIAN },
    { path: 'assets/covers/cover-2.jpg', url: COVER_CLOUD_TOPOLOGY },
    { path: 'assets/covers/cover-3.jpg', url: COVER_CRAFT_MINIMAL }
  ];

  await Promise.all(
    binaryAssets.map(async (asset) => {
      try {
        const res = await fetch(asset.url);
        if (res.ok) {
          const blob = await res.blob();
          rootFolder.file(asset.path, blob);
        }
      } catch {
        // Non-fatal if preview binary asset fetch fails
      }
    })
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'TraceLight-typecho-theme-V0.35.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
