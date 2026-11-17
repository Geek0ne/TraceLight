import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  Bookmark,
  Calendar,
  Check,
  Coffee,
  Compass,
  Copy,
  ExternalLink,
  FileText,
  FlaskConical,
  Heart,
  Home,
  ImageOff,
  ImagePlus,
  Map as MapIcon,
  MapPin,
  Menu,
  MessageSquare,
  Moon,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Smile,
  Sparkles,
  Sun,
  User,
  X
} from 'lucide-react';
import {
  ContentBlock,
  CoverMode,
  DemoArticle,
  DemoComment,
  DemoMoment,
  PreviewRoute,
  ThemeConfig
} from '../types/aether';
import {
  buildDemoHeatmap,
  DEFAULT_GALAXY_BG,
  DEMO_ARTICLES,
  DEMO_BOOKMARKS,
  DEMO_CAREER_TIMELINE,
  DEMO_COMMENTS,
  DEMO_GEAR_ITEMS,
  DEMO_LINKS,
  DEMO_MOMENTS,
  DEMO_PROJECTS,
  DEMO_TECH_RADAR,
  EMOJI_CATEGORIES,
  MOMENT_DESK_SETUP
} from '../data/demoContent';
import { CODE_THEMES, HighlightedCodeBlock } from '../utils/syntaxHighlight';
import { ArticleCover, COPYRIGHT_LICENSES, SocialShareStrip } from '../utils/coverAndShare';

interface ThemePreviewProps {
  config: ThemeConfig;
  isDark: boolean;
  onToggleTheme: () => void;
}

const PREVIEW_ROUTES: {
  id: PreviewRoute;
  label: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { id: 'home', label: '首页', Icon: Home },
  { id: 'moments', label: '碎碎念', Icon: MessageSquare },
  { id: 'archive', label: '时光归档', Icon: Calendar },
  { id: 'bookmarks', label: '书签库', Icon: Bookmark },
  { id: 'projects', label: '实验室', Icon: FlaskConical },
  { id: 'links', label: '友邻', Icon: Compass },
  { id: 'about', label: '关于', Icon: User }
];

function renderSafeAvatar(src: string, alt: string, className: string) {
  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = 'none';
        const sibling = target.nextElementSibling as HTMLElement | null;
        if (sibling) sibling.style.display = 'flex';
      }}
    />
  );
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({
  config,
  isDark,
  onToggleTheme
}) => {
  const [route, setRoute] = useState<PreviewRoute>('home');
  const [activeCid, setActiveCid] = useState<number>(DEMO_ARTICLES[0].cid);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Persisted Likes
  const [likedIds, setLikedIds] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('aether_preview_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persisted Moments with multi-image & location support
  const [moments, setMoments] = useState<DemoMoment[]>(() => {
    try {
      const saved = localStorage.getItem('aether_preview_moments_v2');
      return saved ? JSON.parse(saved) : DEMO_MOMENTS;
    } catch {
      return DEMO_MOMENTS;
    }
  });
  const [momentDraft, setMomentDraft] = useState('');
  const [momentLocation, setMomentLocation] = useState('');
  const [momentImages, setMomentImages] = useState<string[]>([]);
  const [momentUrlInput, setMomentUrlInput] = useState('');
  const [likedMomentIds, setLikedMomentIds] = useState<Record<string, boolean>>({});
  const momentFileInputRef = useRef<HTMLInputElement>(null);

  // Per-article cover mode/seed overrides (auto / random / none)
  const [articleCoverOverrides, setArticleCoverOverrides] = useState<
    Record<number, { mode?: CoverMode; seed?: number }>
  >({});

  // Persisted Comments
  const [comments, setComments] = useState<DemoComment[]>(() => {
    try {
      const saved = localStorage.getItem('aether_preview_comments');
      return saved ? JSON.parse(saved) : DEMO_COMMENTS;
    } catch {
      return DEMO_COMMENTS;
    }
  });
  const [replyTarget, setReplyTarget] = useState<DemoComment | null>(null);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentMail, setCommentMail] = useState('');
  const [commentText, setCommentText] = useState('');

  // Search Modal (Cmd+K)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reward Modal & Tabs
  const [rewardOpen, setRewardOpen] = useState(false);
  const [rewardTab, setRewardTab] = useState<'wechat' | 'alipay'>('wechat');

  // Lightbox
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  // Copy feedback states
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [copiedSiteInfo, setCopiedSiteInfo] = useState(false);
  const [copiedTerminal, setCopiedTerminal] = useState(false);

  // Interactive Hero Terminal tab & Bookmarks/Projects filters
  const [terminalTab, setTerminalTab] = useState<'fastfetch' | 'git' | 'sysstat'>('fastfetch');
  const [bookmarkCat, setBookmarkCat] = useState<string>('全部');
  const [bookmarkSearch, setBookmarkSearch] = useState<string>('');
  const [projectStatus, setProjectStatus] = useState<'all' | 'Active' | 'Beta' | 'Archived'>('all');

  // Random cover session salt so refreshes rotate random API images
  const [coverSessionSalt] = useState<number>(() => Math.floor(Math.random() * 900) + 100);

  // Comment textarea & IME-style emoji popover state
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [activeEmojiCatId, setActiveEmojiCatId] = useState<string>(EMOJI_CATEGORIES[0].id);

  // XML Sitemap drawer state
  const [showXmlPreview, setShowXmlPreview] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);

  // Reading progress & active heading
  const [scrollPct, setScrollPct] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  // Mouse spotlight coords
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 18 });

  // Heatmap year selector & tooltip
  const heatmapData = useMemo(() => buildDemoHeatmap(), []);
  const [heatmapYear, setHeatmapYear] = useState<'rolling' | '2026' | '2025' | '2024'>('2026');
  const [heatmapTooltip, setHeatmapTooltip] = useState('悬停格子查看当日创作详情');

  const activeArticle = useMemo(
    () => DEMO_ARTICLES.find((a) => a.cid === activeCid) || DEMO_ARTICLES[0],
    [activeCid]
  );

  const activeArticleIndex = DEMO_ARTICLES.findIndex((a) => a.cid === activeArticle.cid);
  const prevArticle = activeArticleIndex > 0 ? DEMO_ARTICLES[activeArticleIndex - 1] : null;
  const nextArticle =
    activeArticleIndex >= 0 && activeArticleIndex < DEMO_ARTICLES.length - 1
      ? DEMO_ARTICLES[activeArticleIndex + 1]
      : null;

  const categories = useMemo(
    () => ['全部', ...Array.from(new Set(DEMO_ARTICLES.map((a) => a.category)))],
    []
  );

  const filteredArticles = useMemo(() => {
    if (selectedCategory === '全部') return DEMO_ARTICLES;
    return DEMO_ARTICLES.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const totalWords = useMemo(
    () => DEMO_ARTICLES.reduce((sum, a) => sum + a.words, 0),
    []
  );

  const totalViews = useMemo(
    () => DEMO_ARTICLES.reduce((sum, a) => sum + a.views, 0),
    []
  );

  // Cmd/Ctrl + K, ESC, and click-outside emoji popover dismissal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 40);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setRewardOpen(false);
        setLightboxImg(null);
        setMobileNavOpen(false);
        setEmojiPickerOpen(false);
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        e.target instanceof Node &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setEmojiPickerOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  // Scroll tracking for article detail
  useEffect(() => {
    if (route !== 'post') {
      setScrollPct(0);
      return;
    }

    const headings = activeArticle.blocks.filter(
      (b): b is Extract<ContentBlock, { type: 'heading' }> => b.type === 'heading'
    );
    if (headings.length > 0) {
      setActiveHeadingId(headings[0].id);
    }

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.round((window.scrollY / docHeight) * 100)) : 0;
      setScrollPct(pct);

      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(`preview-${headings[i].id}`);
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveHeadingId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [route, activeArticle]);

  const openArticle = (cid: number) => {
    setActiveCid(cid);
    setRoute('post');
    setReplyTarget(null);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLike = (cid: number) => {
    if (likedIds[cid]) return;
    const next = { ...likedIds, [cid]: true };
    setLikedIds(next);
    try {
      localStorage.setItem('aether_preview_likes', JSON.stringify(next));
    } catch {}
  };

  const getEffectiveCover = (article: DemoArticle) => {
    const ov = articleCoverOverrides[article.cid];
    const mode: CoverMode =
      ov?.mode ??
      (config.defaultCoverMode !== 'auto'
        ? config.defaultCoverMode
        : article.coverMode ?? config.defaultCoverMode);
    const seed = ov?.seed ?? (article.coverSeed ?? 0) + coverSessionSalt;
    return { mode, seed };
  };

  const setArticleCoverMode = (cid: number, mode: CoverMode) => {
    setArticleCoverOverrides((prev) => ({
      ...prev,
      [cid]: { ...prev[cid], mode }
    }));
  };

  const shuffleArticleCoverSeed = (cid: number) => {
    setArticleCoverOverrides((prev) => ({
      ...prev,
      [cid]: {
        mode: 'random',
        seed: (prev[cid]?.seed ?? coverSessionSalt) + 1
      }
    }));
  };

  const handleMomentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = Math.max(0, 9 - momentImages.length);
    files.slice(0, remaining).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setMomentImages((prev) => (prev.length < 9 ? [...prev, reader.result as string] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddMomentUrl = () => {
    const trimmed = momentUrlInput.trim();
    if (!trimmed || momentImages.length >= 9) return;
    setMomentImages((prev) => [...prev, trimmed]);
    setMomentUrlInput('');
  };

  const handlePublishMoment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = momentDraft.trim();
    if (!trimmed && momentImages.length === 0) return;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newItem: DemoMoment = {
      id: `m-${Date.now()}`,
      author: config.copyrightAuthor || 'TraceLight',
      isHost: false,
      date: dateStr,
      os: 'Web Sandbox',
      location: momentLocation.trim() || undefined,
      content: trimmed || '分享瞬间照片',
      images: momentImages.length > 0 ? [...momentImages] : undefined,
      likes: 0
    };

    const next = [newItem, ...moments];
    setMoments(next);
    setMomentDraft('');
    setMomentLocation('');
    setMomentImages([]);
    try {
      localStorage.setItem('aether_preview_moments_v2', JSON.stringify(next));
    } catch {}
  };

  const insertEmojiIntoComment = (emoji: string) => {
    const el = commentInputRef.current;
    if (!el) {
      setCommentText((prev) => prev + emoji);
      return;
    }
    const start = el.selectionStart ?? commentText.length;
    const end = el.selectionEnd ?? commentText.length;
    const next = commentText.slice(0, start) + emoji + commentText.slice(end);
    setCommentText(next);
    requestAnimationFrame(() => {
      el.focus();
      const caret = start + emoji.length;
      el.setSelectionRange(caret, caret);
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const author = commentAuthor.trim() || 'Guest Engineer';
    const text = commentText.trim();
    if (!text) return;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newComment: DemoComment = {
      id: `c-${Date.now()}`,
      articleCid: activeArticle.cid,
      author,
      os: 'macOS',
      osIcon: '🍎',
      browser: 'Chrome',
      date: dateStr,
      content: text,
      parentId: replyTarget?.id
    };

    const next = [...comments, newComment];
    setComments(next);
    setCommentText('');
    setReplyTarget(null);
    try {
      localStorage.setItem('aether_preview_comments', JSON.stringify(next));
    } catch {}
  };

  const handleCopyCode = async (key: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeKey(key);
      setTimeout(() => setCopiedCodeKey(null), 1800);
    } catch {}
  };

  const handleCopyTerminal = async () => {
    const snippet = `HOST: ${config.siteTitle} (v1.1.0)\nOS: Darwin 24.3.0 arm64\nKERNEL: Typecho 1.2.1 · PHP 8.3\nSHELL: zsh 5.9 + starship\nSTACK: Rust · Go · TS · K8s\nSTATS: ${DEMO_ARTICLES.length} posts · ${totalWords.toLocaleString()} words`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedTerminal(true);
      setTimeout(() => setCopiedTerminal(false), 1800);
    } catch {}
  };

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DEMO_ARTICLES;
    return DEMO_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const heatmapView = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatLocal = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

    let startDate: Date;
    let endDate: Date;
    if (heatmapYear === 'rolling') {
      endDate = new Date(today);
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 364);
    } else {
      const yr = parseInt(heatmapYear, 10);
      startDate = new Date(yr, 0, 1);
      endDate = new Date(yr, 11, 31);
    }

    // Pad backwards to Sunday for clean 7-row GitHub calendar columns
    const gridStart = new Date(startDate);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());

    const gridEnd = new Date(endDate);
    gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()));

    const weeks: {
      weekStart: Date;
      cells: {
        dateStr: string;
        inRange: boolean;
        count: number;
        words: number;
        level: number;
      }[];
    }[] = [];

    let totalPostsInRange = 0;
    let totalWordsInRange = 0;
    const cursor = new Date(gridStart);

    while (cursor <= gridEnd) {
      const weekStart = new Date(cursor);
      const cells = [];
      for (let row = 0; row < 7; row++) {
        const d = new Date(cursor);
        const dateStr = formatLocal(d);
        const inRange = d >= startDate && d <= endDate;
        const info = inRange ? heatmapData[dateStr] : undefined;
        let level = 0;
        if (info) {
          totalPostsInRange += info.count;
          totalWordsInRange += info.words;
          if (info.words > 3000 || info.count >= 3) level = 4;
          else if (info.words > 1500 || info.count === 2) level = 3;
          else if (info.words > 500) level = 2;
          else level = 1;
        }
        cells.push({
          dateStr,
          inRange,
          count: info?.count || 0,
          words: info?.words || 0,
          level
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push({ weekStart, cells });
    }

    // Extract month markers aligned to week column indices
    const monthLabels: { colIndex: number; label: string }[] = [];
    let lastMonthKey = '';
    weeks.forEach((wk, colIndex) => {
      const sample = new Date(wk.weekStart);
      sample.setDate(sample.getDate() + 3);
      if (sample < startDate || sample > endDate) return;
      const mk = `${sample.getFullYear()}-${sample.getMonth()}`;
      if (mk !== lastMonthKey) {
        lastMonthKey = mk;
        monthLabels.push({
          colIndex,
          label: `${sample.getMonth() + 1}月`
        });
      }
    });

    return {
      weeks,
      monthLabels,
      rangeLabel:
        heatmapYear === 'rolling'
          ? `最近一年 (${formatLocal(startDate)} ~ ${formatLocal(endDate)})`
          : `${heatmapYear} 年度 (${formatLocal(startDate)} ~ ${formatLocal(endDate)})`,
      totalPostsInRange,
      totalWordsInRange
    };
  }, [heatmapData, heatmapYear]);

  const articleComments = useMemo(
    () => comments.filter((c) => c.articleCid === activeArticle.cid),
    [comments, activeArticle.cid]
  );

  const rootComments = useMemo(
    () => articleComments.filter((c) => !c.parentId),
    [articleComments]
  );

  const tocHeadings = useMemo(
    () =>
      activeArticle.blocks.filter(
        (b): b is Extract<ContentBlock, { type: 'heading' }> => b.type === 'heading'
      ),
    [activeArticle]
  );

  const siteInfoSnippet = `名称: ${config.siteTitle}
链接: https://your-domain.com/
头像: ${config.avatar}
描述: ${config.heroBio}`;

  const resolvedGlobalBg =
    config.globalBgImage && config.globalBgImage.trim() !== 'none'
      ? config.globalBgImage.trim() === '__DEFAULT_GALAXY__'
        ? DEFAULT_GALAXY_BG
        : config.globalBgImage.trim()
      : '';
  const hasGlobalBg = Boolean(resolvedGlobalBg);
  const isTranslucent = hasGlobalBg && config.globalBgTranslucent;

  const xmlSitemapContent = useMemo(() => {
    const pagesXml = PREVIEW_ROUTES.filter((r) => r.id !== 'home')
      .map(
        (r) =>
          `  <url>\n    <loc>https://your-domain.com/${r.id}.html</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
      )
      .join('\n');
    const postsXml = DEMO_ARTICLES.map(
      (a) =>
        `  <url>\n    <loc>https://your-domain.com/archives/${a.slug}.html</loc>\n    <lastmod>${a.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    ).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://your-domain.com/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n${pagesXml}\n${postsXml}\n</urlset>`;
  }, []);

  return (
    <div
      ref={previewContainerRef}
      onMouseMove={(e) => {
        const rect = previewContainerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setSpotlightPos({ x, y });
      }}
      className={`relative flex flex-col min-h-[calc(100vh-64px)] overflow-x-clip ${
        isTranslucent ? 'aether-translucent' : ''
      }`}
    >
      {/* Multi-layered Luminous Architectural Canvas + Built-In / Custom Global Galaxy Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--bg-base)]"
      >
        {hasGlobalBg && (
          <>
            <img
              src={resolvedGlobalBg}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover opacity-95 dark:opacity-92 transition-opacity duration-300"
            />
            <div
              className={
                isDark
                  ? 'absolute inset-0 bg-gradient-to-b from-[#05070c]/8 via-[#05070c]/20 to-[#05070c]/34'
                  : 'absolute inset-0 bg-gradient-to-b from-[#edf1f7]/20 via-[#edf1f7]/34 to-[#edf1f7]/48'
              }
            />
          </>
        )}
        <div
          className="aether-grid-bg absolute inset-0 opacity-45 dark:opacity-40"
          style={{
            maskImage: 'radial-gradient(ellipse 85% 65% at 50% 0%, #000 35%, transparent 100%)'
          }}
        />
        {/* Soft Atmospheric Aurora Orbs */}
        <div
          className="absolute -top-44 -left-32 h-[520px] w-[520px] rounded-full blur-[120px] opacity-25 dark:opacity-20"
          style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
        />
        <div
          className="absolute -top-36 -right-24 h-[460px] w-[460px] rounded-full blur-[120px] opacity-20 dark:opacity-18"
          style={{ background: 'radial-gradient(circle, var(--accent-2), transparent 70%)' }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(640px circle at ${spotlightPos.x}% ${spotlightPos.y}%, var(--accent-soft), transparent 65%)`
          }}
        />
      </div>

      {/* Reading Progress Bar on Post Detail */}
      {route === 'post' && (
        <div aria-hidden="true" className="fixed top-14 sm:top-16 left-0 right-0 z-40 h-[3px] bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-all duration-100"
            style={{ width: `${scrollPct}%` }}
          />
        </div>
      )}

      {/* TraceLight Sticky Sub-Navigation Bar with Centered Menu */}
      <div className="sticky top-14 sm:top-16 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-xl">
        <div className="aether-container flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] gap-4 py-2.5 sm:py-3">
          <button
            type="button"
            onClick={() => {
              setRoute('home');
              setMobileNavOpen(false);
            }}
            className="justify-self-start font-mono-tabular text-base sm:text-[17px] font-bold text-[var(--text-primary)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="text-[var(--accent)]">&gt;_</span> {config.siteTitle}
          </button>

          {/* Desktop Centered Nav with Unified Monoline Icons & Larger Readable Text */}
          <nav
            aria-label="主题预览页面切换"
            className="hidden lg:flex items-center justify-center justify-self-center gap-1"
          >
            {PREVIEW_ROUTES.map(({ id, label, Icon }) => {
              const active = route === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setRoute(id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] sm:text-[14px] font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'aether-control bg-[var(--bg-base)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/60'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${active ? 'text-[var(--accent)]' : 'opacity-80'}`}
                    strokeWidth={1.85}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0 justify-self-end">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 40);
              }}
              className="aether-control inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono-tabular text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer min-h-[36px]"
              title="搜索文章 (Ctrl/Cmd + K)"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>⌘K</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="切换亮暗主题"
              className="aether-control inline-flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer min-h-[36px] min-w-[36px]"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="展开主题导航"
              aria-expanded={mobileNavOpen}
              className="aether-control lg:hidden inline-flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer min-h-[36px] min-w-[36px]"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Drawer Nav */}
        {mobileNavOpen && (
          <nav
            aria-label="移动端页面切换"
            className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 grid grid-cols-3 sm:grid-cols-5 gap-2"
          >
            {PREVIEW_ROUTES.map(({ id, label, Icon }) => {
              const active = route === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setRoute(id);
                    setMobileNavOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold border border-[var(--accent)]/30'
                      : 'bg-[var(--bg-elevated)]/60 text-[var(--text-secondary)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.85} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Main Content Viewport (Fluid 2K/4K Adaptive + flex-1 for Sticky Footer) */}
      <div className="relative z-10 aether-container flex-1 py-8 sm:py-12">
        {/* ================= 1. HOME VIEW ================= */}
        {route === 'home' && (
          <div className="space-y-12 sm:space-y-14">
            {/* Hero Bento Split */}
            <section className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-[1.38fr_1fr] gap-5 sm:gap-6 items-stretch">
                {/* Left Hero Visual Anchor Card */}
                <div className="aether-card relative overflow-hidden rounded-2xl p-6 sm:p-10 flex flex-col justify-between">
                  {/* Subtle Interior Luminous Mesh */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-35 dark:opacity-25"
                    style={{
                      background:
                        'radial-gradient(circle, var(--accent) 0%, var(--accent-2) 45%, transparent 75%)'
                    }}
                  />

                  <div className="relative z-10">
                    {/* Author Identity Lockup */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-[var(--border-strong)] shadow-sm bg-[var(--bg-elevated)] shrink-0">
                        {renderSafeAvatar(config.avatar, config.siteTitle, 'h-full w-full object-cover')}
                        <div className="hidden h-full w-full items-center justify-center font-mono-tabular text-xs font-bold text-[var(--accent)]">
                          A
                        </div>
                      </div>
                      <p className="font-mono-tabular text-xs sm:text-[13px] font-semibold tracking-tight text-[var(--accent)]">
                        {config.heroTag}
                      </p>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-[2.95rem] font-extrabold tracking-[-0.035em] leading-[1.14] text-[var(--text-primary)] mb-5 [text-wrap:balance]">
                      Code, Architecture{' '}
                      <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-500 dark:from-sky-300 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
                        &amp; Engineering Notes.
                      </span>
                    </h1>

                    <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl leading-relaxed mb-7">
                      {config.heroBio}
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 sm:gap-5">
                    <a
                      href="#preview-articles"
                      className="aether-cta-primary inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 dark:from-sky-400 dark:to-sky-500 px-5 py-3 text-sm font-semibold text-white dark:text-slate-950 min-h-[44px]"
                    >
                      <span>探索技术文章</span>
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </a>

                    {config.githubUrl && (
                      <a
                        href={config.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aether-control inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]/80 px-5 py-3 text-sm font-medium text-[var(--text-primary)] min-h-[44px]"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Realistic Interactive macOS/Ghostty Terminal Card */}
                <div className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-[#090d16] text-slate-200 shadow-[0_20px_50px_-14px_rgba(2,132,199,0.24),0_8px_20px_-6px_rgba(15,23,42,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]">
                  {/* Subtle Top Screen Sheen */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky-400/[0.08] to-transparent"
                  />

                  {/* Window Chrome + Interactive Shell Tabs */}
                  <div className="relative flex items-center justify-between gap-2 border-b border-slate-800/90 bg-[#0d1320] px-4 py-2.5">
                    <div className="flex items-center gap-2 shrink-0" aria-hidden="true">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                    </div>

                    <div
                      role="tablist"
                      aria-label="终端视图切换"
                      className="flex items-center gap-1 rounded-md bg-slate-900/90 p-0.5 border border-slate-800 font-mono-tabular text-[11px]"
                    >
                      {(
                        [
                          { id: 'fastfetch', label: 'fastfetch' },
                          { id: 'git', label: 'git log' },
                          { id: 'sysstat', label: 'sysstat' }
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={terminalTab === tab.id}
                          onClick={() => setTerminalTab(tab.id)}
                          className={`rounded px-2 py-0.5 transition-colors cursor-pointer ${
                            terminalTab === tab.id
                              ? 'bg-slate-800 text-sky-300 font-semibold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyTerminal}
                      aria-label="复制终端摘要"
                      className="rounded border border-slate-700/80 bg-slate-800/60 px-2 py-0.5 font-mono-tabular text-[11px] text-slate-300 hover:border-sky-400/60 hover:text-sky-300 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedTerminal ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Terminal Body */}
                  <div className="relative p-4 sm:p-5 font-mono-tabular text-[12px] leading-6 flex-1 flex flex-col justify-between gap-3">
                    {terminalTab === 'fastfetch' && (
                      <>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11.5px]">
                          <span className="text-emerald-400">➜</span>
                          <span className="text-sky-400 font-semibold">~/tracelight</span>
                          <span className="text-slate-400">
                            git:(<span className="text-pink-400">main</span>)
                          </span>
                          <span className="text-slate-100">fastfetch --minimal</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)] gap-4 items-center">
                          <pre
                            aria-hidden="true"
                            className="hidden sm:block text-[10.5px] leading-[1.25] text-sky-400 select-none"
                          >
{`  _____
 |_   _| __ __ _  ___ ___
   | || '__/ _\` |/ __/ _ \\
   | || | | (_| | (_|  __/
   |_||_|  \\__,_|\\___\\___|
        TRACELIGHT`}
                          </pre>

                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-baseline gap-2 truncate">
                              <span className="w-14 shrink-0 text-sky-400 font-semibold">Host</span>
                              <span className="text-slate-500">:</span>
                              <span className="text-slate-100 truncate">{config.siteTitle}</span>
                            </div>
                            <div className="flex items-baseline gap-2 truncate">
                              <span className="w-14 shrink-0 text-sky-400 font-semibold">Kernel</span>
                              <span className="text-slate-500">:</span>
                              <span className="text-slate-300 truncate">Typecho 1.2.1 · PHP 8.2</span>
                            </div>
                            <div className="flex items-baseline gap-2 truncate">
                              <span className="w-14 shrink-0 text-sky-400 font-semibold">Corpus</span>
                              <span className="text-slate-500">:</span>
                              <span className="text-slate-300">
                                {DEMO_ARTICLES.length} Posts · {totalWords.toLocaleString()} Words
                              </span>
                            </div>
                            <div className="flex items-baseline gap-2 truncate">
                              <span className="w-14 shrink-0 text-sky-400 font-semibold">Traffic</span>
                              <span className="text-slate-500">:</span>
                              <span className="text-emerald-300">
                                {totalViews.toLocaleString()} Views · 99.98% Uptime
                              </span>
                            </div>
                            <div className="flex items-baseline gap-2 truncate">
                              <span className="w-14 shrink-0 text-sky-400 font-semibold">Stack</span>
                              <span className="text-slate-500">:</span>
                              <span className="text-indigo-300 truncate">Rust · Go · TS · K8s</span>
                            </div>
                            <div className="flex items-baseline gap-2 truncate">
                              <span className="w-14 shrink-0 text-sky-400 font-semibold">Store</span>
                              <span className="text-slate-500">:</span>
                              <span className="text-slate-300 truncate">Native table.fields (0 Extra)</span>
                            </div>
                            <div className="flex items-center gap-1 pt-1.5" aria-hidden="true">
                              <span className="h-2.5 w-3.5 rounded-[2px] bg-red-500" />
                              <span className="h-2.5 w-3.5 rounded-[2px] bg-amber-500" />
                              <span className="h-2.5 w-3.5 rounded-[2px] bg-emerald-500" />
                              <span className="h-2.5 w-3.5 rounded-[2px] bg-cyan-500" />
                              <span className="h-2.5 w-3.5 rounded-[2px] bg-sky-400" />
                              <span className="h-2.5 w-3.5 rounded-[2px] bg-indigo-400" />
                              <span className="h-2.5 w-3.5 rounded-[2px] bg-purple-400" />
                              <span className="h-2.5 w-3.5 rounded-[2px] bg-slate-100" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {terminalTab === 'git' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[11.5px]">
                          <span className="text-emerald-400">➜</span>
                          <span className="text-sky-400 font-semibold">~/tracelight</span>
                          <span className="text-slate-100">git log -n 4 --oneline --decorate</span>
                        </div>
                        <div className="space-y-1.5 text-[11.5px] pl-1">
                          <div className="truncate">
                            <span className="text-amber-400">a9f31d2</span>{' '}
                            <span className="text-emerald-400">(HEAD -&gt; main, tag: v1.1.0)</span>{' '}
                            <span className="text-slate-200">feat: rename to TraceLight &amp; add bookmarks/lab</span>
                          </div>
                          <div className="truncate">
                            <span className="text-amber-400">8e71b92</span>{' '}
                            <span className="text-slate-200">style: 3D bento depth &amp; responsive grid</span>
                          </div>
                          <div className="truncate">
                            <span className="text-amber-400">4c12f08</span>{' '}
                            <span className="text-slate-200">feat: custom SEO meta &amp; Open Graph injector</span>
                          </div>
                          <div className="truncate">
                            <span className="text-amber-400">1b90e44</span>{' '}
                            <span className="text-slate-200">init: zero-table native fields persistence</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {terminalTab === 'sysstat' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[11.5px]">
                          <span className="text-emerald-400">➜</span>
                          <span className="text-sky-400 font-semibold">~/tracelight</span>
                          <span className="text-slate-100">php bin/telemetry --check</span>
                        </div>
                        <div className="space-y-1.5 text-[11.5px]">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">SQLite / MySQL Fields</span>
                            <span className="text-emerald-400">● CONNECTED (0ms)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Bundle Payload (JS + CSS)</span>
                            <span className="text-sky-300">26.4 KB gzipped</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Extra DB Tables Created</span>
                            <span className="text-indigo-300">0 (Zero-Invasion)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Custom Page Templates</span>
                            <span className="text-slate-200">7 Ready (incl. Sitemap)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2.5 border-t border-dashed border-slate-800 flex items-center justify-between gap-2 text-[11.5px]">
                      <div className="truncate">
                        <span className="text-emerald-400 mr-1.5">➜</span>
                        <span className="text-sky-400 font-semibold mr-1.5">~/tracelight</span>
                        <span className="text-slate-200">echo &quot;溯光而行，以码载道。&quot;</span>
                        <span className="inline-block w-1.5 h-3.5 align-middle ml-1 bg-sky-400 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Stacked 4-Column Architectural Metrics Bar (Larger, High-Contrast Labels) */}
              <div className="aether-card rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
                <div className="px-6 py-5 flex flex-col items-start justify-center gap-1.5 border-b sm:border-r lg:border-b-0 border-[var(--border-subtle)]">
                  <span className="font-mono-tabular text-sm sm:text-[15px] font-semibold tracking-normal text-[var(--text-secondary)]">
                    技术文章 · ARTICLES
                  </span>
                  <span className="font-mono-tabular text-2xl sm:text-[26px] font-extrabold text-[var(--text-primary)]">
                    0{DEMO_ARTICLES.length} 篇
                  </span>
                </div>
                <div className="px-6 py-5 flex flex-col items-start justify-center gap-1.5 border-b lg:border-r lg:border-b-0 border-[var(--border-subtle)]">
                  <span className="font-mono-tabular text-sm sm:text-[15px] font-semibold tracking-normal text-[var(--text-secondary)]">
                    累计创作 · WORDS
                  </span>
                  <span className="font-mono-tabular text-2xl sm:text-[26px] font-extrabold text-[var(--text-primary)]">
                    {totalWords.toLocaleString()} 字
                  </span>
                </div>
                <div className="px-6 py-5 flex flex-col items-start justify-center gap-1.5 border-b sm:border-b-0 sm:border-r border-[var(--border-subtle)]">
                  <span className="font-mono-tabular text-sm sm:text-[15px] font-semibold tracking-normal text-[var(--text-secondary)]">
                    累计阅读 · VIEWS
                  </span>
                  <span className="font-mono-tabular text-2xl sm:text-[26px] font-extrabold text-[var(--accent)]">
                    {totalViews.toLocaleString()} 次
                  </span>
                </div>
                <div className="px-6 py-5 flex flex-col items-start justify-center gap-1.5">
                  <span className="font-mono-tabular text-sm sm:text-[15px] font-semibold tracking-normal text-[var(--text-secondary)]">
                    表结构侵入 · SCHEMA
                  </span>
                  <span className="font-mono-tabular text-2xl sm:text-[26px] font-extrabold text-[var(--text-primary)]">
                    0 表新增
                  </span>
                </div>
              </div>
            </section>

            {/* Articles Section */}
            <section id="preview-articles" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  <span className="font-mono-tabular text-[var(--accent)] mr-2">01.</span>
                  最新技术日志
                </h2>

                <div
                  role="tablist"
                  aria-label="分类筛选"
                  className="flex flex-wrap items-center gap-1 rounded-xl bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)]"
                >
                  {categories.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                          active
                            ? 'aether-control bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredArticles.map((article) => {
                  const likeCount = article.likes + (likedIds[article.cid] ? 1 : 0);
                  const cover = getEffectiveCover(article);
                  return (
                    <article
                      key={article.cid}
                      className="aether-card aether-card-interactive group rounded-2xl p-6 flex flex-col"
                    >
                      <ArticleCover
                        cid={article.cid}
                        title={article.title}
                        category={article.category}
                        minutes={article.minutes}
                        mode={cover.mode}
                        seed={cover.seed}
                        randomCoverApi={config.randomCoverApi}
                        variant="card"
                      />

                      <div className="flex items-center justify-between gap-2 font-mono-tabular text-xs mb-3">
                        <span className="text-[var(--accent)] font-semibold">{article.category}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[var(--text-muted)] mr-1">{article.date}</span>
                          <button
                            type="button"
                            onClick={() => setArticleCoverMode(article.cid, 'auto')}
                            title="切换为自动 SVG 封面"
                            className={`rounded px-1.5 py-0.5 text-[10px] cursor-pointer transition-colors ${
                              cover.mode === 'auto'
                                ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            自动
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              cover.mode === 'random'
                                ? shuffleArticleCoverSeed(article.cid)
                                : setArticleCoverMode(article.cid, 'random')
                            }
                            title="随机配图 / 点击换图"
                            className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] cursor-pointer transition-colors ${
                              cover.mode === 'random'
                                ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            {cover.mode === 'random' ? (
                              <>
                                <RefreshCw className="h-2.5 w-2.5" aria-hidden="true" />
                                <span>换图</span>
                              </>
                            ) : (
                              <span>随机图</span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setArticleCoverMode(article.cid, 'none')}
                            title="隐藏封面"
                            className={`rounded px-1.5 py-0.5 text-[10px] cursor-pointer transition-colors ${
                              cover.mode === 'none'
                                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            无图
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-[21px] font-bold leading-snug text-[var(--text-primary)] mb-2.5 group-hover:text-[var(--accent)] transition-colors">
                        <button
                          type="button"
                          onClick={() => openArticle(article.cid)}
                          className="text-left cursor-pointer"
                        >
                          {article.title}
                        </button>
                      </h3>

                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5 flex-1">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3.5 font-mono-tabular text-xs">
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                          <span>{article.minutes} min read</span>
                          <span aria-hidden="true">·</span>
                          <span>{article.views.toLocaleString()} views</span>
                          <span aria-hidden="true">·</span>
                          <span>♥ {likeCount}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openArticle(article.cid)}
                          className="font-semibold text-[var(--accent)] hover:underline cursor-pointer whitespace-nowrap"
                        >
                          阅读全文 →
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ================= 2. POST DETAIL TEMPLATE PREVIEW ================= */}
        {route === 'post' && (() => {
          const activeCover = getEffectiveCover(activeArticle);
          const activeLicense = COPYRIGHT_LICENSES[config.copyrightLicense];
          const postShareUrl = `https://your-domain.com/archives/${activeArticle.slug}.html`;
          return (
          <div className="space-y-6">
            {/* Template Explainer & Quick Post + Cover Switcher */}
            <div className="aether-card rounded-2xl px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[var(--text-secondary)] flex flex-wrap items-center gap-2">
                <span className="font-mono-tabular font-semibold text-[var(--accent)]">
                  post.php 模板预览
                </span>
                <span>包含自动/随机封面、版权协议、国内外社交分享、悬浮 TOC 与讨论区</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-lg bg-[var(--bg-elevated)] p-0.5 border border-[var(--border-subtle)] font-mono-tabular text-[11px]">
                  <button
                    type="button"
                    onClick={() => setArticleCoverMode(activeArticle.cid, 'auto')}
                    className={`rounded px-2 py-1 cursor-pointer ${
                      activeCover.mode === 'auto'
                        ? 'bg-[var(--bg-surface)] text-[var(--accent)] font-semibold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    自动封面
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      activeCover.mode === 'random'
                        ? shuffleArticleCoverSeed(activeArticle.cid)
                        : setArticleCoverMode(activeArticle.cid, 'random')
                    }
                    className={`inline-flex items-center gap-1 rounded px-2 py-1 cursor-pointer ${
                      activeCover.mode === 'random'
                        ? 'bg-[var(--bg-surface)] text-[var(--accent)] font-semibold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    <RefreshCw className="h-2.5 w-2.5" aria-hidden="true" />
                    <span>{activeCover.mode === 'random' ? '换一张随机图' : '随机配图'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setArticleCoverMode(activeArticle.cid, 'none')}
                    className={`rounded px-2 py-1 cursor-pointer ${
                      activeCover.mode === 'none'
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    无封面
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {DEMO_ARTICLES.map((art, idx) => (
                    <button
                      key={art.cid}
                      type="button"
                      onClick={() => setActiveCid(art.cid)}
                      className={`rounded-lg px-2.5 py-1 font-mono-tabular text-xs transition-colors cursor-pointer ${
                        art.cid === activeArticle.cid
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold border border-[var(--accent)]/30'
                          : 'bg-[var(--bg-elevated)]/70 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      #{idx + 1} {art.category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-8 lg:gap-10 items-start">
              <article className="aether-card rounded-2xl p-5 sm:p-8 lg:p-10 min-w-0">
              <ArticleCover
                cid={activeArticle.cid}
                title={activeArticle.title}
                category={activeArticle.category}
                minutes={activeArticle.minutes}
                mode={activeCover.mode}
                seed={activeCover.seed}
                randomCoverApi={config.randomCoverApi}
                variant="hero"
              />

              <header className="pb-6 mb-8 border-b border-[var(--border-subtle)]">
                <div className="font-mono-tabular text-xs text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRoute('home')}
                    className="hover:text-[var(--accent)] cursor-pointer"
                  >
                    ~/home
                  </button>
                  <span>/</span>
                  <span className="text-[var(--text-secondary)]">{activeArticle.category}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)] mb-4">
                  {activeArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 font-mono-tabular text-xs text-[var(--text-secondary)]">
                  <div className="inline-flex items-center gap-2">
                    <div className="relative h-6 w-6 rounded-full overflow-hidden bg-[var(--bg-elevated)] shrink-0">
                      {renderSafeAvatar(config.avatar, config.siteTitle, 'h-full w-full object-cover')}
                      <div className="hidden h-full w-full items-center justify-center text-[10px] font-bold text-[var(--text-primary)]">
                        A
                      </div>
                    </div>
                    <span>{config.siteTitle}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <time>{activeArticle.date}</time>
                  <span aria-hidden="true">·</span>
                  <span>
                    {activeArticle.words.toLocaleString()} 字 / {activeArticle.minutes} min read
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{(activeArticle.views + 1).toLocaleString()} views</span>
                </div>
              </header>

              {/* Enhanced Markdown Content */}
              <div className="space-y-5 text-[15.5px] leading-[1.85] text-[var(--text-primary)]">
                {activeArticle.blocks.map((block, idx) => {
                  if (block.type === 'paragraph') {
                    const applyDropCap =
                      idx === 0 && config.enableDropCap && activeArticle.dropcapOverride !== false;
                    return (
                      <p key={idx} className={applyDropCap ? 'aether-dropcap' : ''}>
                        {block.text}
                      </p>
                    );
                  }

                  if (block.type === 'heading') {
                    return block.level === 2 ? (
                      <h2
                        key={idx}
                        id={`preview-${block.id}`}
                        className="pt-4 pb-2 text-xl font-bold border-b border-[var(--border-subtle)] scroll-mt-24"
                      >
                        {block.text}
                      </h2>
                    ) : (
                      <h3
                        key={idx}
                        id={`preview-${block.id}`}
                        className="pt-2 text-lg font-semibold scroll-mt-24"
                      >
                        {block.text}
                      </h3>
                    );
                  }

                  if (block.type === 'code') {
                    const codeKey = `${activeArticle.cid}-${idx}`;
                    const copied = copiedCodeKey === codeKey;
                    const codeSpec =
                      CODE_THEMES[config.codeHighlightTheme] || CODE_THEMES['tokyo-night'];
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border overflow-hidden shadow-md transition-colors"
                        style={{ backgroundColor: codeSpec.bg, borderColor: codeSpec.border }}
                      >
                        <div
                          className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2 font-mono-tabular text-xs"
                          style={{ backgroundColor: codeSpec.headerBg, borderColor: codeSpec.border }}
                        >
                          <span
                            className="uppercase font-semibold"
                            style={{ color: codeSpec.langBadge }}
                          >
                            {block.lang}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(codeKey, block.code)}
                            className="inline-flex items-center gap-1 rounded border px-2.5 py-0.5 text-[11px] cursor-pointer transition-colors hover:opacity-85"
                            style={{
                              borderColor: codeSpec.border,
                              color: codeSpec.plain
                            }}
                          >
                            {copied ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span>已复制</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>复制</span>
                              </>
                            )}
                          </button>
                        </div>
                        <HighlightedCodeBlock code={block.code} theme={config.codeHighlightTheme} />
                      </div>
                    );
                  }

                  if (block.type === 'callout') {
                    const variantStyles: Record<string, string> = {
                      note: 'border-sky-500/30 bg-sky-500/[0.07]',
                      info: 'border-sky-500/30 bg-sky-500/[0.07]',
                      tip: 'border-emerald-500/30 bg-emerald-500/[0.07]',
                      warning: 'border-amber-500/30 bg-amber-500/[0.07]',
                      danger: 'border-red-500/30 bg-red-500/[0.07]'
                    };
                    const variantIcons: Record<string, string> = {
                      note: 'ℹ️',
                      info: '💡',
                      tip: '✨',
                      warning: '⚠️',
                      danger: '🔥'
                    };
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-4 ${variantStyles[block.variant]}`}
                      >
                        <div className="flex items-center gap-2 text-sm font-bold mb-1">
                          <span aria-hidden="true">{variantIcons[block.variant]}</span>
                          <span>{block.title}</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">{block.body}</p>
                      </div>
                    );
                  }

                  if (block.type === 'gallery') {
                    return (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                        {block.images.map((img, iIdx) => (
                          <figure key={iIdx} className="space-y-2">
                            <button
                              type="button"
                              onClick={() => setLightboxImg(img)}
                              className="group relative block w-full overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm cursor-zoom-in"
                            >
                              <img
                                src={img.src}
                                alt={img.alt}
                                referrerPolicy="no-referrer"
                                className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                                  if (next) next.style.display = 'flex';
                                }}
                              />
                              <div className="hidden h-56 w-full flex-col items-center justify-center gap-2 bg-[var(--bg-elevated)] text-xs text-[var(--text-muted)]">
                                <ImageOff className="h-5 w-5" />
                                <span>{img.alt}</span>
                              </div>
                            </button>
                            <figcaption className="text-center font-mono-tabular text-xs text-[var(--text-muted)]">
                              {img.alt}
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    );
                  }

                  if (block.type === 'table') {
                    return (
                      <div
                        key={idx}
                        className="overflow-x-auto rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)]"
                      >
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-[var(--bg-elevated)]/85 font-semibold text-[var(--text-primary)]">
                              {block.headers.map((h, hIdx) => (
                                <th
                                  key={hIdx}
                                  className="px-4 py-2.5 border-b border-r last:border-r-0 border-[var(--border-subtle)]"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="font-mono-tabular">
                            {block.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="odd:bg-transparent even:bg-[var(--bg-elevated)]/25 hover:bg-[var(--accent-soft)]/40 transition-colors"
                              >
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="px-4 py-2.5 text-[var(--text-secondary)] border-b border-r last:border-r-0 border-[var(--border-subtle)]"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  if (block.type === 'footnotes') {
                    return (
                      <div
                        key={idx}
                        className="mt-8 pt-4 border-t border-dashed border-[var(--border-subtle)] space-y-1.5 text-xs text-[var(--text-secondary)] font-mono-tabular"
                      >
                        {block.items.map((fn) => (
                          <div key={fn.id}>
                            <span className="text-[var(--accent)] mr-2">[{fn.id}]</span>
                            <span>{fn.text}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Clean Unboxed Tags */}
              <div className="mt-8 flex flex-wrap items-center gap-3 font-mono-tabular text-xs text-[var(--text-muted)]">
                {activeArticle.tags.map((tag, i) => (
                  <React.Fragment key={tag}>
                    {i > 0 && <span aria-hidden="true">·</span>}
                    <span className="text-[var(--text-secondary)]">#{tag}</span>
                  </React.Fragment>
                ))}
              </div>

              {/* Copyright Protocol & Multi-Platform Social Share */}
              <section className="my-7 space-y-4">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/45 p-5 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                      <ShieldCheck className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                      <span>版权协议声明 · {activeLicense.short}</span>
                    </span>
                    {activeLicense.url && (
                      <a
                        href={activeLicense.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-tabular text-xs text-[var(--accent)] hover:underline"
                      >
                        查看协议文本 ↗
                      </a>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-[var(--text-secondary)] font-mono-tabular">
                    <div>
                      <span className="text-[var(--text-muted)]">本文作者：</span>
                      <span className="text-[var(--text-primary)] font-medium">
                        {config.copyrightAuthor || config.siteTitle}
                      </span>
                    </div>
                    <div className="truncate">
                      <span className="text-[var(--text-muted)]">许可协议：</span>
                      <span className="text-[var(--text-primary)]">{activeLicense.name}</span>
                    </div>
                    <div className="sm:col-span-2 truncate">
                      <span className="text-[var(--text-muted)]">原文链接：</span>
                      <span className="text-[var(--accent)]">{postShareUrl}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-1 border-t border-dashed border-[var(--border-subtle)]">
                    {activeLicense.summary}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/35 p-5">
                  <SocialShareStrip
                    title={activeArticle.title}
                    excerpt={activeArticle.excerpt}
                    url={postShareUrl}
                  />
                </div>
              </section>

              {/* Interaction Card: Like & Reward */}
              <section className="my-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/45 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    觉得这篇文章有帮助？
                  </h3>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                    点击点赞将本地模拟写入 Typecho table.fields 计数。
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleLike(activeArticle.cid)}
                    className={`aether-control inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer min-h-[40px] ${
                      likedIds[activeArticle.cid]
                        ? 'border-pink-500/60 text-pink-500 bg-pink-500/10'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-pink-500/60 hover:text-pink-500'
                    }`}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${likedIds[activeArticle.cid] ? 'fill-current' : ''}`}
                    />
                    <span>{likedIds[activeArticle.cid] ? '已点赞' : '点赞'}</span>
                    <span className="font-mono-tabular">
                      {activeArticle.likes + (likedIds[activeArticle.cid] ? 1 : 0)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRewardOpen(true)}
                    className="aether-control inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-amber-500/60 hover:text-amber-500 transition-colors cursor-pointer min-h-[40px]"
                  >
                    <Coffee className="h-3.5 w-3.5" />
                    <span>打赏支持</span>
                  </button>
                </div>
              </section>

              {/* Sibling Navigation */}
              <nav aria-label="文章上下篇" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="aether-control rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4">
                  <span className="block font-mono-tabular text-[11px] text-[var(--text-muted)] mb-1">
                    ← PREVIOUS
                  </span>
                  {prevArticle ? (
                    <button
                      type="button"
                      onClick={() => openArticle(prevArticle.cid)}
                      className="text-left text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] cursor-pointer"
                    >
                      {prevArticle.title}
                    </button>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">已经是第一篇了</span>
                  )}
                </div>

                <div className="aether-control rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4 sm:text-right">
                  <span className="block font-mono-tabular text-[11px] text-[var(--text-muted)] mb-1">
                    NEXT →
                  </span>
                  {nextArticle ? (
                    <button
                      type="button"
                      onClick={() => openArticle(nextArticle.cid)}
                      className="sm:text-right text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] cursor-pointer"
                    >
                      {nextArticle.title}
                    </button>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">已经是最后一篇了</span>
                  )}
                </div>
              </nav>

              {/* Comments Section */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  <span className="font-mono-tabular text-[var(--accent)] mr-2">#</span>
                  讨论与交流 ({articleComments.length})
                </h3>

                {/* Comment Composer */}
                <form
                  onSubmit={handleSubmitComment}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono-tabular">
                    <span>
                      {replyTarget
                        ? `正在回复 @${replyTarget.author}`
                        : '发表评论 · 支持基础讨论交互'}
                    </span>
                    {replyTarget && (
                      <button
                        type="button"
                        onClick={() => setReplyTarget(null)}
                        className="text-[var(--accent)] hover:underline cursor-pointer"
                      >
                        取消回复
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      placeholder="昵称 (如：Alex)"
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                    />
                    <input
                      type="email"
                      value={commentMail}
                      onChange={(e) => setCommentMail(e.target.value)}
                      placeholder="邮箱 (选填)"
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                    />
                  </div>

                  <textarea
                    ref={commentInputRef}
                    rows={3}
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="写下你的技术见解或疑问..."
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                      UA 设备标识将自动解析展示
                    </span>
                    <div className="flex items-center gap-2 relative" ref={emojiPickerRef}>
                      <button
                        type="button"
                        onClick={() => setEmojiPickerOpen((prev) => !prev)}
                        aria-expanded={emojiPickerOpen}
                        aria-label="选择评论表情"
                        className={`aether-control inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                          emojiPickerOpen
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Smile className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>表情</span>
                      </button>

                      {emojiPickerOpen && (
                        <div
                          role="dialog"
                          aria-label="输入法风格表情面板"
                          className="absolute bottom-full right-0 mb-2 z-30 w-[336px] max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] backdrop-blur-xl p-2.5 shadow-2xl"
                        >
                          <div className="mb-2 flex items-center justify-between px-1 font-mono-tabular text-[11px] text-[var(--text-muted)]">
                            <span>全部表情 ({EMOJI_CATEGORIES.reduce((s, c) => s + c.emojis.length, 0)})</span>
                            <button
                              type="button"
                              onClick={() => setEmojiPickerOpen(false)}
                              className="hover:text-[var(--text-primary)] cursor-pointer"
                            >
                              ESC 关闭
                            </button>
                          </div>

                          {/* IME Category Tabs */}
                          <div
                            role="tablist"
                            aria-label="表情分类"
                            className="mb-2 grid grid-cols-5 gap-1 rounded-lg bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)]"
                          >
                            {EMOJI_CATEGORIES.map((cat) => {
                              const active = cat.id === activeEmojiCatId;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  role="tab"
                                  aria-selected={active}
                                  onClick={() => setActiveEmojiCatId(cat.id)}
                                  className={`inline-flex items-center justify-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                                    active
                                      ? 'bg-[var(--bg-surface)] text-[var(--accent)] font-semibold shadow-sm'
                                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                  }`}
                                >
                                  <span>{cat.icon}</span>
                                  <span>{cat.label}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="grid grid-cols-8 gap-1 max-h-[196px] overflow-y-auto pr-0.5">
                            {(
                              EMOJI_CATEGORIES.find((c) => c.id === activeEmojiCatId) ||
                              EMOJI_CATEGORIES[0]
                            ).emojis.map((emoji) => (
                              <button
                                key={`${activeEmojiCatId}-${emoji}`}
                                type="button"
                                onClick={() => {
                                  insertEmojiIntoComment(emoji);
                                  setEmojiPickerOpen(false);
                                }}
                                title={`插入 ${emoji}`}
                                className="h-8 w-full rounded-lg text-[17px] flex items-center justify-center hover:bg-[var(--accent-soft)] hover:scale-110 transition-transform cursor-pointer"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="aether-cta-primary rounded-lg bg-[var(--text-primary)] px-4 py-2 text-xs font-semibold text-[var(--bg-base)] cursor-pointer"
                      >
                        发送评论 →
                      </button>
                    </div>
                  </div>
                </form>

                {/* Threaded Comments */}
                <div className="space-y-4">
                  {rootComments.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] font-mono-tabular">
                      暂无评论，欢迎留下第一条技术反馈。
                    </p>
                  ) : (
                    rootComments.map((c) => {
                      const children = articleComments.filter((ch) => ch.parentId === c.id);
                      return (
                        <div key={c.id} className="space-y-3">
                          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]/60 p-4 flex gap-3.5">
                            <div className="h-9 w-9 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center font-mono-tabular text-xs font-bold text-[var(--accent)] shrink-0">
                              {c.author.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="font-semibold text-[var(--text-primary)]">
                                    {c.author}
                                  </span>
                                  {c.isBlogger && (
                                    <span className="font-mono-tabular text-[10px] font-semibold text-[var(--accent)] border border-[var(--accent)]/30 rounded px-1.5 py-0.5">
                                      BLOGGER
                                    </span>
                                  )}
                                  <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                                    {c.osIcon} {c.os} · {c.browser}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 font-mono-tabular text-[11px] text-[var(--text-muted)]">
                                  <span>{c.date}</span>
                                  <button
                                    type="button"
                                    onClick={() => setReplyTarget(c)}
                                    className="text-[var(--accent)] hover:underline cursor-pointer"
                                  >
                                    回复
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)]">{c.content}</p>
                            </div>
                          </div>

                          {children.length > 0 && (
                            <div className="ml-6 sm:ml-8 pl-4 border-l border-dashed border-[var(--border-subtle)] space-y-3">
                              {children.map((child) => (
                                <div
                                  key={child.id}
                                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]/60 p-4 flex gap-3.5"
                                >
                                  <div className="h-8 w-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center font-mono-tabular text-xs font-bold text-[var(--accent)] shrink-0">
                                    {child.author.slice(0, 1).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                      <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="font-semibold text-[var(--text-primary)]">
                                          {child.author}
                                        </span>
                                        {child.isBlogger && (
                                          <span className="font-mono-tabular text-[10px] font-semibold text-[var(--accent)] border border-[var(--accent)]/30 rounded px-1.5 py-0.5">
                                            BLOGGER
                                          </span>
                                        )}
                                        <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                                          {child.osIcon} {child.os} · {child.browser}
                                        </span>
                                      </div>
                                      <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                                        {child.date}
                                      </span>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                      {child.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </article>

            {/* Right Sticky TOC */}
            <aside className="hidden lg:block sticky top-24">
              <div className="aether-card rounded-2xl p-4">
                <div className="flex items-center justify-between font-mono-tabular text-xs text-[var(--text-muted)] pb-2.5 mb-3 border-b border-[var(--border-subtle)]">
                  <span>ON THIS PAGE</span>
                  <span>{scrollPct}%</span>
                </div>
                {tocHeadings.length === 0 ? (
                  <p className="font-mono-tabular text-xs text-[var(--text-muted)]">暂无目录节点</p>
                ) : (
                  <nav aria-label="文章目录" className="space-y-1.5 text-xs">
                    {tocHeadings.map((h) => {
                      const active = activeHeadingId === h.id;
                      return (
                        <a
                          key={h.id}
                          href={`#preview-${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(`preview-${h.id}`)
                              ?.scrollIntoView({ behavior: 'smooth' });
                            setActiveHeadingId(h.id);
                          }}
                          className={`block py-1 transition-colors border-l-2 ${
                            h.level === 3 ? 'pl-5' : 'pl-3'
                          } ${
                            active
                              ? 'border-[var(--accent)] text-[var(--accent)] font-medium'
                              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {h.text}
                        </a>
                      );
                    })}
                  </nav>
                )}
              </div>
              </aside>
            </div>
          </div>
          );
        })()}

        {/* ================= 3. MOMENTS VIEW (朋友圈多图体验) ================= */}
        {route === 'moments' && (
          <div className="mx-auto max-w-[840px] 2xl:max-w-[960px] space-y-8">
            <header>
              <p className="font-mono-tabular text-xs text-[var(--accent)] mb-1">
                MOMENTS &amp; PHOTO STREAM
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                碎碎念
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                工程日常灵感、桌面掠影与即兴随笔。支持上传本地多图 / 粘贴图片链接（最多 9 图宫格）与地理标签，像朋友圈一样记录技术生活。
              </p>
            </header>

            <form
              onSubmit={handlePublishMoment}
              className="aether-card rounded-2xl p-5 space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono-tabular text-xs text-[var(--text-muted)]">
                <span>○ 朋友圈式发布台 · 本地实时持久化 (最多 9 图)</span>
                <span className="text-[var(--accent)]">{momentImages.length} / 9 张配图</span>
              </div>

              <textarea
                rows={3}
                value={momentDraft}
                onChange={(e) => setMomentDraft(e.target.value)}
                placeholder="这一刻的代码灵感或生活掠影... (支持 #标签 高亮)"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
              />

              {/* Image Toolbar + Location */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={momentFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMomentFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => momentFileInputRef.current?.click()}
                  disabled={momentImages.length >= 9}
                  className="aether-control inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50 cursor-pointer"
                >
                  <ImagePlus className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>选择本地图片</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMomentImages((prev) =>
                      prev.length < 9 ? [...prev, MOMENT_DESK_SETUP] : prev
                    )
                  }
                  disabled={momentImages.length >= 9}
                  className="aether-control inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>插入示例摄影图</span>
                </button>

                <div className="flex flex-1 min-w-[200px] items-center gap-1.5">
                  <input
                    type="url"
                    value={momentUrlInput}
                    onChange={(e) => setMomentUrlInput(e.target.value)}
                    placeholder="或粘贴图片 URL..."
                    className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddMomentUrl}
                    disabled={!momentUrlInput.trim() || momentImages.length >= 9}
                    className="aether-control inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] disabled:opacity-50 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>添加</span>
                  </button>
                </div>
              </div>

              {/* Selected Thumbnail Previews */}
              {momentImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-1">
                  {momentImages.map((src, idx) => (
                    <div
                      key={`${idx}-${src.slice(0, 24)}`}
                      className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-elevated)] group"
                    >
                      <img
                        src={src}
                        alt={`待发布配图 ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMomentImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        aria-label="移除配图"
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                  </span>
                  <input
                    type="text"
                    value={momentLocation}
                    onChange={(e) => setMomentLocation(e.target.value)}
                    placeholder="所在地点 (如：Singapore · Studio)"
                    className="w-52 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="aether-cta-primary rounded-lg bg-[var(--text-primary)] px-4 py-2 text-xs font-semibold text-[var(--bg-base)] cursor-pointer"
                >
                  发布朋友圈动态 ✦
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {moments.map((m) => {
                const imgs = m.images || [];
                const isLiked = !!likedMomentIds[m.id];
                const likeNum = (m.likes || 0) + (isLiked ? 1 : 0);
                const gridCols =
                  imgs.length === 1
                    ? 'grid-cols-1 max-w-[440px]'
                    : imgs.length === 2 || imgs.length === 4
                    ? 'grid-cols-2 max-w-[540px]'
                    : 'grid-cols-3 max-w-[600px]';

                return (
                  <article
                    key={m.id}
                    className="aether-card aether-card-interactive rounded-2xl p-5 sm:p-6 space-y-3.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-full overflow-hidden bg-[var(--bg-elevated)] shrink-0">
                          {renderSafeAvatar(config.avatar, m.author, 'h-full w-full object-cover')}
                          <div className="hidden h-full w-full items-center justify-center text-xs font-bold">
                            {m.author.slice(0, 1)}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                            <span>{m.author}</span>
                            <span className="font-mono-tabular text-[10px] font-medium text-[var(--accent)] border border-[var(--accent)]/30 rounded px-1.5 py-0.5">
                              {m.isHost ? 'HOST' : '预览'}
                            </span>
                          </div>
                          <div className="font-mono-tabular text-xs text-[var(--text-muted)]">
                            {m.date} · 来自 {m.os}
                            {m.location ? ` · 📍 ${m.location}` : ''}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setLikedMomentIds((prev) => ({
                            ...prev,
                            [m.id]: !prev[m.id]
                          }))
                        }
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 font-mono-tabular text-xs transition-colors cursor-pointer ${
                          isLiked
                            ? 'border-pink-500/50 bg-pink-500/10 text-pink-500'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-pink-500'
                        }`}
                      >
                        <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{likeNum}</span>
                      </button>
                    </div>

                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {m.content.split(/(#\S+)/g).map((part, idx) =>
                        part.startsWith('#') ? (
                          <span key={idx} className="text-[var(--accent)] font-mono-tabular">
                            {part}
                          </span>
                        ) : (
                          <React.Fragment key={idx}>{part}</React.Fragment>
                        )
                      )}
                    </p>

                    {imgs.length > 0 && (
                      <div className={`grid gap-2 ${gridCols}`}>
                        {imgs.map((imgSrc, iIdx) => (
                          <button
                            key={iIdx}
                            type="button"
                            onClick={() =>
                              setLightboxImg({
                                src: imgSrc,
                                alt: `${m.author} · ${m.date} (#${iIdx + 1})`
                              })
                            }
                            className={`group/img relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] cursor-zoom-in ${
                              imgs.length === 1 ? 'aspect-[16/10]' : 'aspect-square'
                            }`}
                          >
                            <img
                              src={imgSrc}
                              alt={`动态配图 ${iIdx + 1}`}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-[1.04]"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4. ARCHIVE VIEW ================= */}
        {route === 'archive' && (
          <div className="space-y-10">
            <header>
              <p className="font-mono-tabular text-xs text-[var(--accent)] mb-1">
                TIMELINE &amp; TELEMETRY
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                时光归档
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                累计产出{' '}
                <strong className="font-mono-tabular text-[var(--text-primary)]">
                  {DEMO_ARTICLES.length}
                </strong>{' '}
                篇技术文章，共计{' '}
                <strong className="font-mono-tabular text-[var(--text-primary)]">
                  {totalWords.toLocaleString()}
                </strong>{' '}
                字。
              </p>
            </header>

            {/* Full-Width Multi-Year Contribution Heatmap with Year Switcher & Month/Weekday Axis */}
            <section className="aether-card rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-mono-tabular text-sm font-bold text-[var(--text-primary)]">
                    年度写作热力图 (Contribution Graph)
                  </h2>
                  <p className="mt-0.5 font-mono-tabular text-xs text-[var(--text-secondary)]">
                    {heatmapView.rangeLabel} · 共 {heatmapView.totalPostsInRange} 篇 /{' '}
                    {heatmapView.totalWordsInRange.toLocaleString()} 字
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    role="tablist"
                    aria-label="热力图年份切换"
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--bg-elevated)] p-0.5 border border-[var(--border-subtle)] font-mono-tabular text-xs"
                  >
                    {(
                      [
                        { id: 'rolling', label: '近一年' },
                        { id: '2026', label: '2026 年' },
                        { id: '2025', label: '2025 年' },
                        { id: '2024', label: '2024 年' }
                      ] as const
                    ).map((yr) => (
                      <button
                        key={yr.id}
                        type="button"
                        role="tab"
                        aria-selected={heatmapYear === yr.id}
                        onClick={() => setHeatmapYear(yr.id)}
                        className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
                          heatmapYear === yr.id
                            ? 'bg-[var(--bg-surface)] text-[var(--accent)] font-semibold shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {yr.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 font-mono-tabular text-xs text-[var(--text-muted)]">
                    <span>Less</span>
                    <span className="h-3 w-3 rounded-[3px] bg-[var(--border-subtle)]" />
                    <span className="h-3 w-3 rounded-[3px] bg-[#9be9a8] dark:bg-[#0e4429]" />
                    <span className="h-3 w-3 rounded-[3px] bg-[#40c463] dark:bg-[#006d32]" />
                    <span className="h-3 w-3 rounded-[3px] bg-[#30a14e] dark:bg-[#26a641]" />
                    <span className="h-3 w-3 rounded-[3px] bg-[#216e39] dark:bg-[#39d353]" />
                    <span>More</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto pb-1">
                <div
                  className="w-max mx-auto"
                  style={
                    {
                      '--hm-cell': 'clamp(13px, 1.12vw, 22px)',
                      '--hm-gap': 'clamp(3px, 0.3vw, 6px)'
                    } as React.CSSProperties
                  }
                >
                  <div className="space-y-1.5">
                    {/* Month Labels Aligned Across Fluid Week Columns */}
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 shrink-0" />
                      <div
                        className="grid font-mono-tabular text-[11px] text-[var(--text-muted)]"
                        style={{
                          gridTemplateColumns: `repeat(${heatmapView.weeks.length}, var(--hm-cell))`,
                          gap: 'var(--hm-gap)'
                        }}
                      >
                        {heatmapView.weeks.map((_, colIdx) => {
                          const found = heatmapView.monthLabels.find((m) => m.colIndex === colIdx);
                          return (
                            <span key={colIdx} className="whitespace-nowrap leading-none">
                              {found ? found.label : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Weekday Labels + Responsive Square Matrix */}
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-5 shrink-0 grid grid-rows-7 font-mono-tabular text-[10px] text-[var(--text-muted)] items-center leading-none"
                        style={{
                          gridTemplateRows: 'repeat(7, var(--hm-cell))',
                          gap: 'var(--hm-gap)'
                        }}
                      >
                        <span />
                        <span className="flex items-center">一</span>
                        <span />
                        <span className="flex items-center">三</span>
                        <span />
                        <span className="flex items-center">五</span>
                        <span />
                      </div>

                      <div
                        className="grid"
                        style={{
                          gridTemplateColumns: `repeat(${heatmapView.weeks.length}, var(--hm-cell))`,
                          gap: 'var(--hm-gap)'
                        }}
                      >
                        {heatmapView.weeks.map((wk, wIdx) => (
                          <div
                            key={wIdx}
                            className="grid grid-rows-7"
                            style={{
                              gridTemplateRows: 'repeat(7, var(--hm-cell))',
                              gap: 'var(--hm-gap)'
                            }}
                          >
                            {wk.cells.map((cell) => {
                              const levelClasses = [
                                'bg-[var(--border-subtle)]',
                                isDark ? 'bg-[#0e4429]' : 'bg-[#9be9a8]',
                                isDark ? 'bg-[#006d32]' : 'bg-[#40c463]',
                                isDark ? 'bg-[#26a641]' : 'bg-[#30a14e]',
                                isDark ? 'bg-[#39d353]' : 'bg-[#216e39]'
                              ];
                              return (
                                <span
                                  key={cell.dateStr}
                                  onMouseEnter={() =>
                                    setHeatmapTooltip(
                                      !cell.inRange
                                        ? `${cell.dateStr}`
                                        : cell.count > 0
                                        ? `${cell.dateStr}：发布了 ${cell.count} 篇文章，共 ${cell.words.toLocaleString()} 字`
                                        : `${cell.dateStr}：暂无文章发布`
                                    )
                                  }
                                  style={{
                                    width: 'var(--hm-cell)',
                                    height: 'var(--hm-cell)'
                                  }}
                                  className={`block rounded-[3px] transition-transform ${
                                    cell.inRange
                                      ? `${levelClasses[cell.level]} hover:scale-125`
                                      : 'opacity-15 bg-[var(--border-subtle)]'
                                  }`}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="font-mono-tabular text-xs text-[var(--text-muted)]">{heatmapTooltip}</p>
            </section>

            {/* Category Bento Matrix */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                <span className="font-mono-tabular text-[var(--accent)] mr-2">01.</span>
                知识分类矩阵
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories
                  .filter((c) => c !== '全部')
                  .map((cat) => {
                    const count = DEMO_ARTICLES.filter((a) => a.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setRoute('home');
                        }}
                        className="aether-card aether-card-interactive rounded-xl p-5 text-left cursor-pointer"
                      >
                        <div className="flex items-center justify-between font-bold mb-1.5">
                          <span className="text-[var(--text-primary)]">{cat}</span>
                          <span className="font-mono-tabular text-sm text-[var(--accent)]">
                            {count}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          探索该领域的工程实践与源码分析。
                        </p>
                      </button>
                    );
                  })}
              </div>
            </section>

            {/* Year Timeline */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                <span className="font-mono-tabular text-[var(--accent)] mr-2">02.</span>
                年份时间轴
              </h2>
              <div className="aether-card rounded-2xl p-6">
                <h3 className="font-mono-tabular text-xl font-bold text-[var(--accent)] mb-3">
                  2026
                </h3>
                <ul className="border-l border-[var(--border-subtle)] pl-5 space-y-3">
                  {DEMO_ARTICLES.map((article) => (
                    <li key={article.cid} className="flex flex-wrap items-center gap-4 text-sm">
                      <time className="font-mono-tabular text-xs text-[var(--text-muted)]">
                        {article.date.slice(5)}
                      </time>
                      <button
                        type="button"
                        onClick={() => openArticle(article.cid)}
                        className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)] text-left flex-1 cursor-pointer"
                      >
                        {article.title}
                      </button>
                      <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                        {article.category}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}

        {/* ================= 4.5 BOOKMARKS VIEW ================= */}
        {route === 'bookmarks' && (
          <div className="space-y-8">
            <header>
              <p className="font-mono-tabular text-xs text-[var(--accent)] mb-1">
                BOOKMARKS &amp; RADAR
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                书签库
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                常读常新的工程文档、效率工具箱与设计灵感库。Typecho 独立页正文按「标题 | URL | 分类 | 短评」自动解析渲染。
              </p>
            </header>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="书签分类筛选"
                className="flex flex-wrap items-center gap-1 rounded-xl bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)]"
              >
                {['全部', ...Array.from(new Set(DEMO_BOOKMARKS.map((b) => b.cat)))].map((cat) => {
                  const active = bookmarkCat === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setBookmarkCat(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? 'aether-control bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={bookmarkSearch}
                  onChange={(e) => setBookmarkSearch(e.target.value)}
                  placeholder="搜索书签标题或推荐短评..."
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 pl-8 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
              {DEMO_BOOKMARKS.filter((b) => {
                const matchCat = bookmarkCat === '全部' || b.cat === bookmarkCat;
                const q = bookmarkSearch.trim().toLowerCase();
                const matchQuery =
                  !q ||
                  b.title.toLowerCase().includes(q) ||
                  b.note.toLowerCase().includes(q) ||
                  b.cat.toLowerCase().includes(q);
                return matchCat && matchQuery;
              }).map((bm) => {
                let host = '';
                try {
                  host = new URL(bm.url).hostname;
                } catch {}
                return (
                  <a
                    key={bm.title}
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aether-card aether-card-interactive rounded-2xl p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between font-mono-tabular text-xs">
                      <span className="text-[var(--accent)] font-semibold">{bm.cat}</span>
                      <span className="text-[var(--text-muted)] truncate max-w-[140px]">{host}</span>
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)]">{bm.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">
                      {bm.note}
                    </p>
                    <div className="pt-2 border-t border-[var(--border-subtle)] font-mono-tabular text-xs text-[var(--text-muted)] flex justify-between items-center">
                      <span>↗ 打开资源</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4.6 PROJECTS LAB VIEW ================= */}
        {route === 'projects' && (
          <div className="space-y-8">
            <header>
              <p className="font-mono-tabular text-xs text-[var(--accent)] mb-1">
                ENGINEERING LAB &amp; PROJECTS
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                实验室
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                个人开源作品、实验性基础设施原型与开发效率工具矩阵。
              </p>
            </header>

            <div
              role="tablist"
              aria-label="项目状态筛选"
              className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)]"
            >
              {(
                [
                  { id: 'all', label: `全部项目 (${DEMO_PROJECTS.length})` },
                  { id: 'Active', label: 'Active' },
                  { id: 'Beta', label: 'Beta' },
                  { id: 'Archived', label: 'Archived' }
                ] as const
              ).map((tab) => {
                const active = projectStatus === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setProjectStatus(tab.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? 'aether-control bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
              {DEMO_PROJECTS.filter(
                (p) => projectStatus === 'all' || p.status === projectStatus
              ).map((proj) => {
                const statusColor =
                  proj.status === 'Active'
                    ? 'text-emerald-500'
                    : proj.status === 'Beta'
                    ? 'text-amber-500'
                    : 'text-[var(--text-muted)]';
                return (
                  <a
                    key={proj.name}
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aether-card aether-card-interactive rounded-2xl p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between font-mono-tabular text-xs">
                      <span className={`font-semibold ${statusColor}`}>● {proj.status}</span>
                      <span className="text-[var(--text-muted)]">{proj.metric}</span>
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)]">{proj.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">
                      {proj.desc}
                    </p>
                    <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono-tabular text-xs">
                      <span className="text-[var(--accent)]">{proj.stack}</span>
                      <span className="text-[var(--text-muted)]">↗ Source</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 5. LINKS VIEW ================= */}
        {route === 'links' && (
          <div className="space-y-10">
            <header>
              <p className="font-mono-tabular text-xs text-[var(--accent)] mb-1">
                ENGINEERING NEIGHBORS
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                友邻
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                志同道合的独立开发者、架构师与技术写作者。
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
              {DEMO_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aether-card aether-card-interactive rounded-2xl p-5 flex flex-col gap-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-[var(--bg-elevated)]">
                      {renderSafeAvatar(link.avatar, link.name, 'h-full w-full object-cover')}
                      <div className="hidden h-full w-full items-center justify-center text-sm font-bold">
                        {link.name[0]}
                      </div>
                    </div>
                    <span className="font-mono-tabular text-xs text-emerald-500">
                      {link.latencyMs}ms · Online
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">{link.name}</h3>
                    <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                      {link.bio}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between font-mono-tabular text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-[var(--accent)]">#{link.tag}</span>
                    <span>↗ Visit</span>
                  </div>
                </a>
              ))}
            </div>

            <section className="aether-card rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                📡 交换友链 / 申请规范
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/[0.06] p-4 text-xs text-[var(--text-secondary)] space-y-2">
                  <div className="font-bold text-[var(--text-primary)]">ℹ️ 基本要求</div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>优先技术类、计算机科学、独立开发或深度思考型独立博客；</li>
                    <li>全站启用 HTTPS，无恶意弹窗广告，保持半年内有内容更新；</li>
                    <li>在独立页正文按「名称 | URL | 头像URL | 简介 | 标签」每行一个填写即可自动渲染。</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                      本站友链信息（可直接复制）
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(siteInfoSnippet);
                          setCopiedSiteInfo(true);
                          setTimeout(() => setCopiedSiteInfo(false), 1800);
                        } catch {}
                      }}
                      className="font-mono-tabular text-xs text-[var(--accent)] hover:underline cursor-pointer"
                    >
                      {copiedSiteInfo ? '已复制' : '复制信息'}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3.5 font-mono-tabular text-xs text-[var(--text-primary)]">
                    <code>{siteInfoSnippet}</code>
                  </pre>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= 6. ABOUT VIEW (ENRICHED) ================= */}
        {route === 'about' && (
          <div className="space-y-10">
            <header>
              <p className="font-mono-tabular text-xs text-[var(--accent)] mb-1">
                WHOAMI · 溯光而行，以码载道
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                关于
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                系统工程师、全栈架构师与技术写作者的个人数字空间档案。
              </p>
            </header>

            {/* Profile Bento + Tech Radar + NOW */}
            <section className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-5">
              <div className="aether-card rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-elevated)] shrink-0">
                    {renderSafeAvatar(config.avatar, config.siteTitle, 'h-full w-full object-cover')}
                    <div className="hidden h-full w-full items-center justify-center text-lg font-bold">
                      T
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                      {config.siteTitle}
                    </h2>
                    <p className="font-mono-tabular text-xs text-[var(--accent)]">
                      {config.heroTag}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {config.heroBio}
                </p>

                <div className="flex flex-wrap items-center gap-3 font-mono-tabular text-xs text-[var(--text-muted)]">
                  <span>📍 Singapore / Remote</span>
                  <span>·</span>
                  <span>⏳ 7+ Years Systems &amp; Cloud</span>
                  <span>·</span>
                  <span>✍️ {DEMO_ARTICLES.length} 篇深度归档</span>
                </div>

                {/* Tech Proficiency Radar */}
                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                  {DEMO_TECH_RADAR.map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex justify-between font-mono-tabular text-xs text-[var(--text-secondary)]">
                        <span>{item.label}</span>
                        <span className="text-[var(--text-muted)]">{item.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="aether-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <h3 className="font-mono-tabular text-sm font-bold text-[var(--text-primary)]">
                    NOW · 近期状态
                  </h3>
                  <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                    Updated 2026-11
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                  <li>
                    <span className="font-mono-tabular text-xs text-[var(--text-muted)] mr-2">
                      Building:
                    </span>
                    高性能分布式日志采集器 &amp; 溯光 (TraceLight) 主题
                  </li>
                  <li>
                    <span className="font-mono-tabular text-xs text-[var(--text-muted)] mr-2">
                      Reading:
                    </span>
                    《Designing Data-Intensive Applications》二刷
                  </li>
                  <li>
                    <span className="font-mono-tabular text-xs text-[var(--text-muted)] mr-2">
                      Focus:
                    </span>
                    Rust 异步运行时与 eBPF 零侵入可观测性
                  </li>
                  <li>
                    <span className="font-mono-tabular text-xs text-[var(--text-muted)] mr-2">
                      Listening:
                    </span>
                    Synthwave &amp; Nils Frahm《Spaces》
                  </li>
                  <li>
                    <span className="font-mono-tabular text-xs text-[var(--text-muted)] mr-2">
                      Exploring:
                    </span>
                    AI Agent 工作流编排与边缘计算网关
                  </li>
                  <li>
                    <span className="font-mono-tabular text-xs text-[var(--text-muted)] mr-2">
                      Location:
                    </span>
                    Singapore / Remote
                  </li>
                </ul>
              </div>
            </section>

            {/* 01. Engineering Experience Timeline */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                <span className="font-mono-tabular text-[var(--accent)] mr-2">01.</span>
                工程履历与里程碑
              </h2>
              <div className="aether-card rounded-2xl p-6 divide-y divide-dashed divide-[var(--border-subtle)]">
                {DEMO_CAREER_TIMELINE.map((item) => (
                  <div
                    key={item.period}
                    className="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-2 sm:gap-5 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="font-mono-tabular text-xs font-semibold text-[var(--accent)] pt-0.5">
                      {item.period}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        {item.role} <span className="text-[var(--text-muted)] font-normal">· {item.org}</span>
                      </h3>
                      <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 02. Uses & Gear Matrix */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                <span className="font-mono-tabular text-[var(--accent)] mr-2">02.</span>
                常用装备与工作流 (Uses)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {DEMO_GEAR_ITEMS.map((gear) => (
                  <div
                    key={gear.name}
                    className="aether-card aether-card-interactive rounded-2xl p-5 space-y-2"
                  >
                    <span className="font-mono-tabular text-[11px] font-semibold text-[var(--accent)]">
                      {gear.category}
                    </span>
                    <h3 className="font-bold text-[var(--text-primary)]">{gear.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {gear.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 03. Featured Open Source Projects */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  <span className="font-mono-tabular text-[var(--accent)] mr-2">03.</span>
                  精选开源作品与项目
                </h2>
                <button
                  type="button"
                  onClick={() => setRoute('projects')}
                  className="font-mono-tabular text-xs text-[var(--accent)] hover:underline cursor-pointer"
                >
                  进入实验室查看全部 →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {DEMO_PROJECTS.slice(0, 3).map((proj) => (
                  <a
                    key={proj.name}
                    href={config.githubUrl || proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aether-card aether-card-interactive rounded-2xl p-5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between font-mono-tabular text-xs text-[var(--text-muted)]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${proj.langDot || 'bg-sky-400'}`} />
                        <span>{proj.stack.split('·')[0].trim()}</span>
                      </span>
                      <span>{proj.metric}</span>
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)]">{proj.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {proj.desc}
                    </p>
                  </a>
                ))}
              </div>
            </section>

            {/* 04. Connect CTA */}
            <section className="aether-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-mono-tabular text-[11px] font-semibold text-[var(--accent)] mb-1">
                  LET&apos;S CONNECT
                </p>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  交流、技术咨询或交换友链
                </h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  欢迎通过 GitHub Issue、友邻页面或评论区与我探讨分布式系统与独立开发。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a
                  href={config.githubUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aether-cta-primary inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 dark:from-sky-400 dark:to-sky-500 px-4 py-2 text-xs font-semibold text-white dark:text-slate-950"
                >
                  <span>访问 GitHub</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => setRoute('links')}
                  className="aether-control rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] cursor-pointer"
                >
                  申请友链
                </button>
              </div>
            </section>
          </div>
        )}
        {/* ================= 7. SITEMAP VIEW (站点地图) ================= */}
        {route === 'sitemap' && (
          <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="font-mono-tabular text-xs text-[var(--accent)] mb-1">
                  SITEMAP &amp; INDEX TREE
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  站点地图
                </h1>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  面向访客的清晰全站导航树与面向搜索引擎的标准 XML Sitemap（Typecho 内置{' '}
                  <code className="font-mono-tabular text-[var(--accent)]">?do=sitemap</code>）。
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowXmlPreview((prev) => !prev)}
                  className="aether-control inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 font-mono-tabular text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent)] cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>{showXmlPreview ? '收起 XML 预览' : '预览 sitemap.xml'}</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(xmlSitemapContent);
                      setCopiedXml(true);
                      setTimeout(() => setCopiedXml(false), 1800);
                    } catch {}
                  }}
                  className="aether-cta-primary inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 dark:from-sky-400 dark:to-sky-500 px-3.5 py-2 font-mono-tabular text-xs font-semibold text-white dark:text-slate-950 cursor-pointer"
                >
                  {copiedXml ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedXml ? '已复制 XML' : '复制 XML'}</span>
                </button>
              </div>
            </header>

            {showXmlPreview && (
              <div className="aether-card rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3 font-mono-tabular text-xs">
                  <span className="text-[var(--accent)] font-semibold">
                    GET /?do=sitemap · application/xml; charset=UTF-8
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {PREVIEW_ROUTES.length + DEMO_ARTICLES.length} URLs Indexed
                  </span>
                </div>
                <pre className="max-h-72 overflow-auto bg-[var(--bg-base)] p-4 font-mono-tabular text-xs text-[var(--text-primary)] leading-relaxed">
                  <code>{xmlSitemapContent}</code>
                </pre>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Independent Pages */}
              <section className="aether-card rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <h2 className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                    Pages · 独立页面
                  </h2>
                  <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                    {PREVIEW_ROUTES.length}
                  </span>
                </div>
                <ul className="space-y-2 text-sm">
                  {PREVIEW_ROUTES.map(({ id, label, Icon }) => (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => {
                          setRoute(id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[var(--text-primary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.85} />
                          <span>{label}</span>
                        </span>
                        <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                          /{id === 'home' ? '' : `${id}.html`}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Categories */}
              <section className="aether-card rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <h2 className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                    Categories · 分类专栏
                  </h2>
                  <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                    {categories.length - 1}
                  </span>
                </div>
                <ul className="space-y-2 text-sm">
                  {categories
                    .filter((c) => c !== '全部')
                    .map((cat) => {
                      const count = DEMO_ARTICLES.filter((a) => a.category === cat).length;
                      return (
                        <li key={cat}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setRoute('home');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[var(--text-primary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                          >
                            <span>{cat}</span>
                            <span className="font-mono-tabular text-xs text-[var(--accent)] font-semibold">
                              {count} 篇
                            </span>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </section>

              {/* Tags */}
              <section className="aether-card rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <h2 className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                    Tags · 技术标签索引
                  </h2>
                  <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                    {Array.from(new Set(DEMO_ARTICLES.flatMap((a) => a.tags))).length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(DEMO_ARTICLES.flatMap((a) => a.tags))).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchQuery(tag);
                        setSearchOpen(true);
                      }}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)]/75 px-2.5 py-1 font-mono-tabular text-xs text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* All Articles Directory */}
            <section className="aether-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <h2 className="font-mono-tabular text-sm font-bold text-[var(--text-primary)]">
                  Posts · 全部归档文章目录 ({DEMO_ARTICLES.length})
                </h2>
                <span className="font-mono-tabular text-xs text-[var(--text-muted)]">2026</span>
              </div>
              <ul className="divide-y divide-dashed divide-[var(--border-subtle)]">
                {DEMO_ARTICLES.map((art) => (
                  <li
                    key={art.cid}
                    className="py-3 first:pt-1 last:pb-1 flex flex-wrap items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <time className="font-mono-tabular text-xs text-[var(--text-muted)] shrink-0">
                        {art.date}
                      </time>
                      <button
                        type="button"
                        onClick={() => openArticle(art.cid)}
                        className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] text-left truncate cursor-pointer"
                      >
                        {art.title}
                      </button>
                    </div>
                    <div className="flex items-center gap-3 font-mono-tabular text-xs text-[var(--text-muted)] shrink-0">
                      <span className="text-[var(--accent)]">{art.category}</span>
                      <span>{art.words.toLocaleString()} 字</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>

      {/* Preview Theme Footer (mt-auto keeps footer pinned at viewport bottom even on short filtered pages) */}
      <footer className="relative z-10 mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/75 backdrop-blur-xl py-7">
        <div className="aether-container flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono-tabular text-sm font-bold text-[var(--text-primary)]">
              &gt;_ {config.siteTitle}
            </span>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              © 2026 · Powered by Typecho &amp; TraceLight (溯光){config.icp ? ` · ${config.icp}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono-tabular text-xs">
            <button
              type="button"
              onClick={() => {
                setRoute('sitemap');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="aether-control inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] cursor-pointer"
            >
              <MapIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sitemap</span>
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="aether-control rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              ↑ 返回顶部
            </button>
          </div>
        </div>
      </footer>

      {/* Global Search Modal (Cmd + K) */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="全站搜索"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <div className="aether-card w-full max-w-lg rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-3">
              <Search className="h-4 w-4 text-[var(--text-muted)]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="输入关键词搜索技术文章、标签..."
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono-tabular text-[11px] text-[var(--text-muted)] cursor-pointer"
              >
                ESC
              </button>
            </div>

            <div className="mt-3 max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]">
              {searchResults.length === 0 ? (
                <p className="py-6 text-center font-mono-tabular text-xs text-[var(--text-muted)]">
                  未找到匹配文章
                </p>
              ) : (
                searchResults.map((a) => (
                  <button
                    key={a.cid}
                    type="button"
                    onClick={() => {
                      openArticle(a.cid);
                      setSearchOpen(false);
                    }}
                    className="w-full py-2.5 px-2 text-left hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="text-sm font-medium text-[var(--text-primary)]">{a.title}</div>
                    <div className="mt-0.5 font-mono-tabular text-[11px] text-[var(--text-muted)]">
                      {a.category} · {a.date} · {a.minutes} min read
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {rewardOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="打赏支持"
          onClick={(e) => {
            if (e.target === e.currentTarget) setRewardOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <div className="aether-card w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[var(--text-primary)]">☕ Buy me a coffee</h3>
              <button
                type="button"
                onClick={() => setRewardOpen(false)}
                aria-label="关闭弹窗"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="inline-flex rounded-lg bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)] mb-4">
              <button
                type="button"
                onClick={() => setRewardTab('wechat')}
                className={`rounded-md px-4 py-1.5 text-xs font-medium cursor-pointer ${
                  rewardTab === 'wechat'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                微信支付
              </button>
              <button
                type="button"
                onClick={() => setRewardTab('alipay')}
                className={`rounded-md px-4 py-1.5 text-xs font-medium cursor-pointer ${
                  rewardTab === 'alipay'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                支付宝
              </button>
            </div>

            {rewardTab === 'wechat' ? (
              config.wechatQr ? (
                <img
                  src={config.wechatQr}
                  alt="微信赞赏码"
                  referrerPolicy="no-referrer"
                  className="mx-auto h-52 w-52 rounded-xl object-cover"
                />
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--border-subtle)] px-4 py-10 font-mono-tabular text-xs text-[var(--text-muted)]">
                  可在「参数配置」中填入微信收款码 URL
                </div>
              )
            ) : config.alipayQr ? (
              <img
                src={config.alipayQr}
                alt="支付宝收款码"
                referrerPolicy="no-referrer"
                className="mx-auto h-52 w-52 rounded-xl object-cover"
              />
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--border-subtle)] px-4 py-10 font-mono-tabular text-xs text-[var(--text-muted)]">
                可在「参数配置」中填入支付宝收款码 URL
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Overlay */}
      {lightboxImg && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="图片预览"
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 cursor-zoom-out"
        >
          <img
            src={lightboxImg.src}
            alt={lightboxImg.alt}
            referrerPolicy="no-referrer"
            className="max-h-[82vh] max-w-[92vw] rounded-xl object-contain"
          />
          {lightboxImg.alt && (
            <p className="mt-3 font-mono-tabular text-xs text-zinc-300">{lightboxImg.alt}</p>
          )}
        </div>
      )}
    </div>
  );
};
