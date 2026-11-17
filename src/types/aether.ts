export type WorkspaceMode = 'preview' | 'repo' | 'config' | 'docs';

export type PreviewRoute =
  | 'home'
  | 'post'
  | 'moments'
  | 'archive'
  | 'bookmarks'
  | 'projects'
  | 'links'
  | 'about'
  | 'sitemap';

export type CoverMode = 'auto' | 'random' | 'none';

export type CodeHighlightTheme =
  | 'tokyo-night'
  | 'github-dark'
  | 'one-dark'
  | 'dracula'
  | 'nord'
  | 'monokai-sublime'
  | 'night-owl'
  | 'solarized-dark'
  | 'vs2015'
  | 'github-light';

export type CopyrightLicenseId =
  | 'CC BY-NC-SA 4.0'
  | 'CC BY 4.0'
  | 'CC BY-NC 4.0'
  | 'CC BY-ND 4.0'
  | 'ALL_RIGHTS_RESERVED';

export interface ThemeConfig {
  siteTitle: string;
  siteDescription: string;
  avatar: string;
  heroTag: string;
  heroBio: string;
  githubUrl: string;
  wechatQr: string;
  alipayQr: string;
  enableDropCap: boolean;
  defaultCoverMode: CoverMode;
  randomCoverApi: string;
  globalBgImage: string;
  globalBgTranslucent: boolean;
  codeHighlightTheme: CodeHighlightTheme;
  copyrightLicense: CopyrightLicenseId;
  copyrightAuthor: string;
  icp: string;
  seoKeywords: string;
  seoAuthorBio: string;
  ogImageUrl: string;
}

export type CalloutType = 'note' | 'info' | 'tip' | 'warning' | 'danger';

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; id: string; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'callout'; variant: CalloutType; title: string; body: string }
  | { type: 'gallery'; images: { src: string; alt: string }[] }
  | { type: 'blockquote'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'footnotes'; items: { id: string; text: string }[] };

export interface DemoArticle {
  cid: number;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  excerpt: string;
  views: number;
  likes: number;
  words: number;
  minutes: number;
  coverMode?: CoverMode;
  coverSeed?: number;
  dropcapOverride?: boolean;
  blocks: ContentBlock[];
}

export interface DemoComment {
  id: string;
  articleCid: number;
  author: string;
  isBlogger?: boolean;
  os: string;
  osIcon: string;
  browser: string;
  date: string;
  content: string;
  parentId?: string;
}

export interface DemoMoment {
  id: string;
  author: string;
  isHost: boolean;
  date: string;
  os: string;
  location?: string;
  content: string;
  images?: string[];
  likes?: number;
}

export interface DemoLink {
  name: string;
  url: string;
  avatar: string;
  bio: string;
  tag: string;
  latencyMs: number;
}

export interface DemoBookmark {
  title: string;
  url: string;
  cat: string;
  note: string;
}

export interface DemoProject {
  name: string;
  url: string;
  status: 'Active' | 'Beta' | 'Archived';
  stack: string;
  metric: string;
  desc: string;
  langDot?: string;
}

export interface DemoCareerItem {
  period: string;
  role: string;
  org: string;
  summary: string;
}

export interface DemoGearItem {
  category: string;
  name: string;
  detail: string;
}

export interface DemoRadarItem {
  label: string;
  pct: number;
}

export interface RepoFileEntry {
  path: string;
  category: 'core' | 'template' | 'assets' | 'docs' | 'github';
  language: string;
  description: string;
  content: string;
}
