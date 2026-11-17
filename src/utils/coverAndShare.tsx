import React, { useMemo, useState } from 'react';
import { Check, Copy, Link2, QrCode, Share2, X } from 'lucide-react';
import { CopyrightLicenseId, CoverMode } from '../types/aether';
import { RANDOM_COVER_POOL } from '../data/demoContent';

export const COPYRIGHT_LICENSES: Record<
  CopyrightLicenseId,
  {
    name: string;
    short: string;
    url: string;
    summary: string;
  }
> = {
  'CC BY-NC-SA 4.0': {
    name: '知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议',
    short: 'CC BY-NC-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
    summary: '自由转载与演绎需保留原作者署名及原文链接，禁止用于商业用途，且衍生作品须采用相同许可协议。'
  },
  'CC BY 4.0': {
    name: '知识共享署名 4.0 国际许可协议',
    short: 'CC BY 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/deed.zh-hans',
    summary: '允许在任何媒介以任何形式复制、传播及改编本文，只需清晰注明原作者与原始出处。'
  },
  'CC BY-NC 4.0': {
    name: '知识共享署名-非商业性使用 4.0 国际许可协议',
    short: 'CC BY-NC 4.0',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans',
    summary: '允许非商业性复制、传播与修改，须保留原始作者署名和出处链接。'
  },
  'CC BY-ND 4.0': {
    name: '知识共享署名-禁止演绎 4.0 国际许可协议',
    short: 'CC BY-ND 4.0',
    url: 'https://creativecommons.org/licenses/by-nd/4.0/deed.zh-hans',
    summary: '可完整全文转发并注明作者与原文链接，不得对原文内容进行删改或二次演绎分发。'
  },
  ALL_RIGHTS_RESERVED: {
    name: '保留所有权利 (All Rights Reserved)',
    short: '© All Rights Reserved',
    url: '',
    summary: '本文版权归作者所有，未经书面明确授权许可，禁止任何形式的全文转载、镜像抓取或商业引用。'
  }
};

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const GENERATIVE_PALETTES = [
  { bg1: '#07111e', bg2: '#0f172a', a1: '#38bdf8', a2: '#818cf8', grid: 'rgba(56,189,248,0.12)' },
  { bg1: '#091418', bg2: '#0f1f26', a1: '#2dd4bf', a2: '#38bdf8', grid: 'rgba(45,212,191,0.12)' },
  { bg1: '#100d21', bg2: '#171532', a1: '#a78bfa', a2: '#60a5fa', grid: 'rgba(167,139,250,0.12)' },
  { bg1: '#14110b', bg2: '#1d1810', a1: '#f59e0b', a2: '#38bdf8', grid: 'rgba(245,158,11,0.11)' }
];

export function getLocalCoverUrl(seed: number): string {
  const idx = Math.abs(seed) % RANDOM_COVER_POOL.length;
  return RANDOM_COVER_POOL[idx];
}

export function getRandomCoverUrl(cid: number, seed: number, apiUrl?: string): {
  src: string;
  isApi: boolean;
} {
  const raw = (apiUrl || '').trim();
  if (!raw || raw === '__LOCAL__' || raw.toLowerCase() === 'local') {
    return { src: getLocalCoverUrl(cid + seed), isApi: false };
  }

  const token = `${cid}-${seed}`;
  if (raw.includes('{seed}') || raw.includes('{cid}')) {
    return {
      src: raw.replace(/\{seed\}/g, String(seed)).replace(/\{cid\}/g, String(cid)),
      isApi: true
    };
  }
  if (raw.endsWith('=') || raw.endsWith('?') || raw.endsWith('&')) {
    return { src: `${raw}${token}`, isApi: true };
  }
  const sep = raw.includes('?') ? '&' : '?';
  return { src: `${raw}${sep}_r=${token}`, isApi: true };
}

interface ArticleCoverProps {
  cid: number;
  title: string;
  category: string;
  minutes: number;
  mode: CoverMode;
  seed?: number;
  randomCoverApi?: string;
  variant?: 'card' | 'hero';
}

export const ArticleCover: React.FC<ArticleCoverProps> = ({
  cid,
  title,
  category,
  minutes,
  mode,
  seed = 0,
  randomCoverApi,
  variant = 'card'
}) => {
  const hash = useMemo(() => hashString(`${cid}-${title}-${seed}`), [cid, title, seed]);
  const palette = GENERATIVE_PALETTES[hash % GENERATIVE_PALETTES.length];
  const resolved = useMemo(
    () => getRandomCoverUrl(cid, seed, randomCoverApi),
    [cid, seed, randomCoverApi]
  );
  const [fallbackUsed, setFallbackUsed] = useState<string | null>(null);
  const activeSrc = fallbackUsed === resolved.src ? getLocalCoverUrl(cid + seed) : resolved.src;

  if (mode === 'none') return null;

  const heightClass =
    variant === 'hero'
      ? 'h-48 sm:h-64 md:h-72 rounded-2xl mb-7'
      : 'h-40 sm:h-44 rounded-xl mb-4';

  if (mode === 'random') {
    return (
      <div
        className={`relative overflow-hidden border border-[var(--border-subtle)] bg-[#090d16] group/cover ${heightClass}`}
      >
        <img
          src={activeSrc}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setFallbackUsed(resolved.src)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover/cover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
        />
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 font-mono-tabular text-[11px] text-slate-200">
          <span className="font-semibold text-sky-300">{category}</span>
          <span className="text-slate-300/90">
            {resolved.isApi && fallbackUsed !== resolved.src
              ? `API RANDOM COVER · #${seed}`
              : `LOCAL COVER · #${((cid + seed) % RANDOM_COVER_POOL.length) + 1}`}
          </span>
        </div>
      </div>
    );
  }

  // Auto-generated deterministic geometric SVG cover
  const cx1 = 220 + (hash % 180);
  const cy1 = 45 + ((hash >> 3) % 70);
  const r1 = 68 + ((hash >> 5) % 45);
  const angle = (hash % 55) - 25;

  return (
    <div
      className={`relative overflow-hidden border border-[var(--border-subtle)] select-none ${heightClass}`}
      style={{
        background: `linear-gradient(135deg, ${palette.bg1} 0%, ${palette.bg2} 100%)`
      }}
    >
      <svg
        viewBox="0 0 640 240"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`glow-${cid}-${seed}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={palette.a1} stopOpacity="0.45" />
            <stop offset="60%" stopColor={palette.a2} stopOpacity="0.16" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <pattern
            id={`grid-${cid}-${seed}`}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke={palette.grid} strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="640" height="240" fill={`url(#grid-${cid}-${seed})`} />
        <circle cx={cx1 + 140} cy={cy1 + 35} r="180" fill={`url(#glow-${cid}-${seed})`} />

        <g transform={`translate(${cx1 + 210}, ${cy1 + 50}) rotate(${angle})`} opacity="0.68">
          <circle cx="0" cy="0" r={r1} fill="none" stroke={palette.a1} strokeWidth="1.2" strokeDasharray="5 5" />
          <circle cx="0" cy="0" r={r1 * 0.68} fill="none" stroke={palette.a2} strokeWidth="1.1" />
          <polygon
            points={`0,${-r1 * 0.48} ${r1 * 0.42},${r1 * 0.34} ${-r1 * 0.42},${r1 * 0.34}`}
            fill="none"
            stroke="#e2e8f0"
            strokeOpacity="0.48"
            strokeWidth="1.2"
          />
          <line x1={-r1 * 1.1} y1="0" x2={r1 * 1.1} y2="0" stroke={palette.a1} strokeOpacity="0.35" strokeWidth="1" />
          <line x1="0" y1={-r1 * 1.1} x2="0" y2={r1 * 1.1} stroke={palette.a2} strokeOpacity="0.35" strokeWidth="1" />
        </g>
      </svg>

      <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5 text-slate-100">
        <div className="flex items-center justify-between font-mono-tabular text-[11px]">
          <span className="font-semibold tracking-wide" style={{ color: palette.a1 }}>
            {category}
          </span>
          <span className="text-slate-300/80">AUTO COVER · {minutes} MIN</span>
        </div>

        <div className="max-w-[92%]">
          <p
            className={`font-bold leading-snug tracking-tight text-white line-clamp-2 ${
              variant === 'hero' ? 'text-lg sm:text-2xl' : 'text-sm sm:text-base'
            }`}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Deterministic visual QR matrix SVG for WeChat quick sharing preview
 */
const SimpleQrSvg: React.FC<{ value: string }> = ({ value }) => {
  const size = 21;
  const seed = hashString(value);

  const isFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);

  const finderCell = (r: number, c: number, lr: number, lc: number) => {
    const dr = r - lr;
    const dc = c - lc;
    if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true;
    if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true;
    return false;
  };

  const rects: React.ReactNode[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let filled = false;
      if (r < 7 && c < 7) filled = finderCell(r, c, 0, 0);
      else if (r < 7 && c >= size - 7) filled = finderCell(r, c, 0, size - 7);
      else if (r >= size - 7 && c < 7) filled = finderCell(r, c, size - 7, 0);
      else if (!isFinder(r, c)) {
        const bit = ((seed ^ (r * 31 + c * 17)) * 2654435761) >>> 28;
        filled = bit % 2 === 0;
      }
      if (filled) {
        rects.push(<rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" />);
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-32 w-32 rounded-lg bg-white p-2 border border-slate-200 mx-auto"
      aria-label="微信扫码分享二维码"
    >
      {rects}
    </svg>
  );
};

interface SocialShareStripProps {
  title: string;
  excerpt: string;
  url: string;
}

export const SocialShareStrip: React.FC<SocialShareStripProps> = ({ title, excerpt, url }) => {
  const [wechatOpen, setWechatOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<'link' | 'card' | null>(null);

  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  const encDesc = encodeURIComponent(excerpt);

  const copyText = async (text: string, type: 'link' | 'card') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {}
  };

  const platforms = [
    {
      id: 'wechat',
      label: '微信',
      color: 'hover:border-[#07c160]/60 hover:text-[#07c160]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M8.69 3C4.44 3 1 5.88 1 9.43c0 2.04 1.15 3.85 2.94 5.03l-.73 2.19 2.57-1.29c.92.25 1.9.39 2.91.39.29 0 .58-.01.86-.04A5.57 5.57 0 0 1 9.2 13.8c0-3.17 3.04-5.74 6.8-5.74.33 0 .66.02.98.06C16.19 5.19 12.78 3 8.69 3zm-2.5 4.4a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76zm5 0a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76zM16 9.3c-3.31 0-6 2.19-6 4.89 0 2.7 2.69 4.89 6 4.89.73 0 1.43-.11 2.08-.31l1.94.98-.55-1.66C20.99 17.16 22 15.77 22 14.19c0-2.7-2.69-4.89-6-4.89zm-2.06 3.55a.73.73 0 1 1 0 1.46.73.73 0 0 1 0-1.46zm4.12 0a.73.73 0 1 1 0 1.46.73.73 0 0 1 0-1.46z" />
        </svg>
      ),
      onClick: () => setWechatOpen((prev) => !prev)
    },
    {
      id: 'weibo',
      label: '微博',
      href: `https://service.weibo.com/share/share.php?url=${encUrl}&title=${encTitle}`,
      color: 'hover:border-[#e6162d]/60 hover:text-[#e6162d]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M10.1 19.6c-4.3 0-7.7-2-7.7-4.8 0-1.8 1.2-3.9 3.3-5.8 2.8-2.5 5.9-3.6 7.1-2.4.5.5.5 1.4.2 2.4-.1.3.1.4.4.3 1.5-.6 3-.6 3.7.3.4.5.4 1.3.1 2.2-.1.3.1.4.4.5 1.3.4 2.1 1.4 2.1 2.6 0 2.7-4.1 4.7-9.6 4.7zm-1.7-7.1c-2.2.5-3.8 2.1-3.4 3.7.3 1.5 2.3 2.4 4.5 1.9 2.2-.5 3.7-2.1 3.4-3.7-.4-1.5-2.3-2.4-4.5-1.9zm8.8-5.1c.6.6.8 1.4.6 2.2a.75.75 0 1 0 1.45.4c.4-1.3.1-2.8-.9-3.7-1-.9-2.4-1.2-3.8-.7a.75.75 0 0 0 .5 1.42c.9-.3 1.6-.1 2.15.38zm2.3-2.5c1.1 1.1 1.6 2.7 1.2 4.3a.75.75 0 1 0 1.45.36c.55-2.1-.08-4.3-1.6-5.76-1.5-1.45-3.75-1.9-5.8-1.15a.75.75 0 0 0 .52 1.4c1.5-.55 3.15-.23 4.23.85z" />
        </svg>
      )
    },
    {
      id: 'qq',
      label: 'QQ',
      href: `https://connect.qq.com/widget/shareqq/index.html?url=${encUrl}&title=${encTitle}&summary=${encDesc}`,
      color: 'hover:border-[#12b7f5]/60 hover:text-[#12b7f5]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M12 2c3.5 0 5.8 2.5 5.8 6.4 0 .6-.1 1.2-.2 1.8.8 1 1.4 2.3 1.4 3.4 0 .9-.4 1.6-.9 1.6-.4 0-.7-.5-1-1.3-.4 1.1-1.1 2-2 2.6.6.4 1 .9 1 1.4 0 .7-.9 1.1-2 1.1-.8 0-1.5-.3-2.1-.7-.6.4-1.3.7-2.1.7-1.1 0-2-.4-2-1.1 0-.5.4-1 1-1.4-.9-.6-1.6-1.5-2-2.6-.3.8-.6 1.3-1 1.3-.5 0-.9-.7-.9-1.6 0-1.1.6-2.4 1.4-3.4-.1-.6-.2-1.2-.2-1.8C6.2 4.5 8.5 2 12 2z" />
        </svg>
      )
    },
    {
      id: 'douban',
      label: '豆瓣',
      href: `https://www.douban.com/share/service?href=${encUrl}&name=${encTitle}&text=${encDesc}`,
      color: 'hover:border-[#007722]/60 hover:text-[#2ca84f]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M4 4h16v2H4V4zm1.5 4h13v6.5h-13V8zm2 2v2.5h9V10h-9zM3 18h4.2l-1-2.5h2.1l1 2.5h5.4l1-2.5h2.1l-1 2.5H21v2H3v-2z" />
        </svg>
      )
    },
    {
      id: 'zhihu',
      label: '知乎/即刻卡片',
      color: 'hover:border-[#0066ff]/60 hover:text-[#0066ff]',
      icon: <Share2 className="h-3.5 w-3.5" aria-hidden="true" />,
      onClick: () => copyText(`《${title}》\n${excerpt}\n原文链接：${url}`, 'card')
    },
    {
      id: 'x',
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}`,
      color: 'hover:border-sky-400/60 hover:text-sky-400',
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      id: 'telegram',
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encUrl}&text=${encTitle}`,
      color: 'hover:border-[#229ed9]/60 hover:text-[#229ed9]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      )
    },
    {
      id: 'reddit',
      label: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encUrl}&title=${encTitle}`,
      color: 'hover:border-[#ff4500]/60 hover:text-[#ff4500]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701z" />
        </svg>
      )
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
      color: 'hover:border-[#0a66c2]/60 hover:text-[#0a66c2]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
          <Share2 className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
          <span>分享本文至国内外社交平台</span>
        </div>
        {copiedType && (
          <span className="font-mono-tabular text-xs text-emerald-500">
            {copiedType === 'link' ? '✓ 原文链接已复制到剪贴板' : '✓ 知乎/即刻推荐文案已复制'}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {platforms.map((p) =>
          p.href ? (
            <a
              key={p.id}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`分享到 ${p.label}`}
              className={`aether-control inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors ${p.color}`}
            >
              {p.icon}
              <span>{p.label}</span>
            </a>
          ) : (
            <button
              key={p.id}
              type="button"
              onClick={p.onClick}
              title={`分享到 ${p.label}`}
              className={`aether-control inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors cursor-pointer ${p.color}`}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => copyText(url, 'link')}
          className="aether-control inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
        >
          {copiedType === 'link' ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
          <span>复制链接</span>
        </button>
      </div>

      {wechatOpen && (
        <div className="rounded-xl border border-[#07c160]/30 bg-[var(--bg-base)] p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="shrink-0">
            <SimpleQrSvg value={url} />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex items-center justify-center sm:justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#07c160]">
                <QrCode className="h-3.5 w-3.5" /> 微信扫一扫 · 分享给好友或朋友圈
              </span>
              <button
                type="button"
                onClick={() => setWechatOpen(false)}
                aria-label="关闭微信二维码"
                className="hidden sm:inline-flex text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              打开微信「发现 → 扫一扫」即可打开本文移动阅读页，也可点击下方直接复制图文推荐文案粘贴发送。
            </p>
            <button
              type="button"
              onClick={() => copyText(`${title} — ${url}`, 'card')}
              className="aether-control inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono-tabular text-[11px] text-[var(--text-primary)] cursor-pointer"
            >
              <Copy className="h-3 w-3" /> 复制标题与链接
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
