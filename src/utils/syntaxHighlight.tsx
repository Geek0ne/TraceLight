import React from 'react';
import { CodeHighlightTheme } from '../types/aether';

interface TokenSegment {
  text: string;
  color: string;
}

export interface CodeThemeSpec {
  id: CodeHighlightTheme;
  label: string;
  bg: string;
  headerBg: string;
  border: string;
  plain: string;
  lineNum: string;
  langBadge: string;
  hoverBg: string;
  comment: string;
  attr: string;
  string: string;
  variable: string;
  keyword: string;
  type: string;
  constant: string;
  number: string;
  fn: string;
}

export const CODE_THEMES: Record<CodeHighlightTheme, CodeThemeSpec> = {
  'tokyo-night': {
    id: 'tokyo-night',
    label: 'Tokyo Night',
    bg: '#1a1b26',
    headerBg: '#16161e',
    border: '#292e42',
    plain: '#c0caf5',
    lineNum: '#565f89',
    langBadge: '#7aa2f7',
    hoverBg: 'rgba(122, 162, 247, 0.06)',
    comment: '#565f89',
    attr: '#bb9af7',
    string: '#9ece6a',
    variable: '#ff9e64',
    keyword: '#bb9af7',
    type: '#2ac3de',
    constant: '#7dcfff',
    number: '#ff9e64',
    fn: '#7aa2f7'
  },
  'github-dark': {
    id: 'github-dark',
    label: 'GitHub Dark',
    bg: '#0b101b',
    headerBg: '#101726',
    border: '#1e293b',
    plain: '#e2e8f0',
    lineNum: '#64748b',
    langBadge: '#38bdf8',
    hoverBg: 'rgba(255, 255, 255, 0.03)',
    comment: '#8b949e',
    attr: '#d2a8ff',
    string: '#a5d6ff',
    variable: '#ffa657',
    keyword: '#ff7b72',
    type: '#79c0ff',
    constant: '#79c0ff',
    number: '#ffa657',
    fn: '#d2a8ff'
  },
  'one-dark': {
    id: 'one-dark',
    label: 'One Dark Pro',
    bg: '#282c34',
    headerBg: '#21252b',
    border: '#353b45',
    plain: '#abb2bf',
    lineNum: '#5c6370',
    langBadge: '#61afef',
    hoverBg: 'rgba(255, 255, 255, 0.04)',
    comment: '#7f848e',
    attr: '#e5c07b',
    string: '#98c379',
    variable: '#e06c75',
    keyword: '#c678dd',
    type: '#e5c07b',
    constant: '#d19a66',
    number: '#d19a66',
    fn: '#61afef'
  },
  dracula: {
    id: 'dracula',
    label: 'Dracula (德古拉紫韵)',
    bg: '#282a36',
    headerBg: '#21222c',
    border: '#44475a',
    plain: '#f8f8f2',
    lineNum: '#6272a4',
    langBadge: '#bd93f9',
    hoverBg: 'rgba(189, 147, 249, 0.06)',
    comment: '#6272a4',
    attr: '#50fa7b',
    string: '#f1fa8c',
    variable: '#ffb86c',
    keyword: '#ff79c6',
    type: '#8be9fd',
    constant: '#bd93f9',
    number: '#bd93f9',
    fn: '#50fa7b'
  },
  nord: {
    id: 'nord',
    label: 'Nord (北欧极光冷灰)',
    bg: '#2e3440',
    headerBg: '#272c36',
    border: '#3b4252',
    plain: '#eceff4',
    lineNum: '#616e88',
    langBadge: '#88c0d0',
    hoverBg: 'rgba(136, 192, 208, 0.07)',
    comment: '#616e88',
    attr: '#8fbcbb',
    string: '#a3be8c',
    variable: '#d08770',
    keyword: '#81a1c1',
    type: '#8fbcbb',
    constant: '#b48ead',
    number: '#b48ead',
    fn: '#88c0d0'
  },
  'monokai-sublime': {
    id: 'monokai-sublime',
    label: 'Monokai Sublime (经典暖调)',
    bg: '#23241f',
    headerBg: '#1c1d18',
    border: '#383a31',
    plain: '#f8f8f2',
    lineNum: '#75715e',
    langBadge: '#a6e22e',
    hoverBg: 'rgba(166, 226, 46, 0.06)',
    comment: '#75715e',
    attr: '#a6e22e',
    string: '#e6db74',
    variable: '#fd971f',
    keyword: '#f92672',
    type: '#66d9ef',
    constant: '#ae81ff',
    number: '#ae81ff',
    fn: '#a6e22e'
  },
  'night-owl': {
    id: 'night-owl',
    label: 'Night Owl (猫头鹰深夜蓝)',
    bg: '#011627',
    headerBg: '#01111e',
    border: '#1d3b53',
    plain: '#d6deeb',
    lineNum: '#4b6479',
    langBadge: '#82aaff',
    hoverBg: 'rgba(130, 170, 255, 0.07)',
    comment: '#637777',
    attr: '#addb67',
    string: '#ecc48d',
    variable: '#f78c6c',
    keyword: '#c792ea',
    type: '#ffcb8b',
    constant: '#82aaff',
    number: '#f78c6c',
    fn: '#82aaff'
  },
  'solarized-dark': {
    id: 'solarized-dark',
    label: 'Solarized Dark (护眼青灰)',
    bg: '#002b36',
    headerBg: '#00222b',
    border: '#094352',
    plain: '#93a1a1',
    lineNum: '#586e75',
    langBadge: '#2aa198',
    hoverBg: 'rgba(42, 161, 152, 0.08)',
    comment: '#586e75',
    attr: '#b58900',
    string: '#2aa198',
    variable: '#cb4b16',
    keyword: '#859900',
    type: '#b58900',
    constant: '#268bd2',
    number: '#d33682',
    fn: '#268bd2'
  },
  vs2015: {
    id: 'vs2015',
    label: 'VS Code Dark+ (微软极简深色)',
    bg: '#1e1e1e',
    headerBg: '#181818',
    border: '#333333',
    plain: '#d4d4d4',
    lineNum: '#6e7681',
    langBadge: '#4ec9b0',
    hoverBg: 'rgba(86, 156, 214, 0.08)',
    comment: '#6a9955',
    attr: '#9cdcfe',
    string: '#ce9178',
    variable: '#9cdcfe',
    keyword: '#569cd6',
    type: '#4ec9b0',
    constant: '#4fc1ff',
    number: '#b5cea8',
    fn: '#dcdcaa'
  },
  'github-light': {
    id: 'github-light',
    label: 'GitHub Light (明亮工程白)',
    bg: '#f8fafc',
    headerBg: '#eff4fa',
    border: '#cbd5e1',
    plain: '#1e293b',
    lineNum: '#94a3b8',
    langBadge: '#0284c7',
    hoverBg: 'rgba(2, 132, 199, 0.05)',
    comment: '#6e7781',
    attr: '#8250df',
    string: '#0a3069',
    variable: '#953800',
    keyword: '#cf222e',
    type: '#0550ae',
    constant: '#0550ae',
    number: '#0550ae',
    fn: '#8250df'
  }
};

function buildTokenRules(spec: CodeThemeSpec): { regex: RegExp; color: string }[] {
  return [
    { regex: /(\/\/[^\n]*|--[^\n]*|\/\*[\s\S]*?\*\/)/g, color: spec.comment },
    { regex: /(#\[[^\]]+\])/g, color: spec.attr },
    { regex: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, color: spec.string },
    { regex: /(\$[a-zA-Z_][a-zA-Z0-9_]*)/g, color: spec.variable },
    {
      regex:
        /\b(pub|fn|match|unsafe|let|mut|use|mod|struct|enum|impl|trait|for|in|while|loop|if|else|return|function|func|local|then|end|or|and|not|nil|null|true|false|const|var|async|await|export|import|from|type|interface|class|extends|new|echo|require|include)\b/g,
      color: spec.keyword
    },
    {
      regex:
        /\b(u8|u16|u32|u64|i8|i16|i32|i64|usize|isize|bool|str|String|Result|Option|Ok|Err|Some|None|ProbeContext|Typecho_Db|KEYS|ARGV|tonumber|redis|intval|string|array)\b/g,
      color: spec.type
    },
    { regex: /\b([A-Z][A-Z0-9_]{2,})\b/g, color: spec.constant },
    { regex: /\b(\d+(?:\.\d+)?)\b/g, color: spec.number },
    { regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, color: spec.fn }
  ];
}

function tokenizeLine(line: string, spec: CodeThemeSpec): TokenSegment[] {
  if (!line) return [{ text: ' ', color: spec.plain }];

  const rules = buildTokenRules(spec);
  const matches: { start: number; end: number; color: string }[] = [];

  for (const rule of rules) {
    rule.regex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rule.regex.exec(line)) !== null) {
      if (m[0].length === 0) {
        rule.regex.lastIndex++;
        continue;
      }
      matches.push({ start: m.index, end: m.index + m[0].length, color: rule.color });
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: TokenSegment[] = [];
  let cursor = 0;

  for (const m of matches) {
    if (m.start < cursor) continue;
    if (m.start > cursor) {
      segments.push({ text: line.slice(cursor, m.start), color: spec.plain });
    }
    segments.push({ text: line.slice(m.start, m.end), color: m.color });
    cursor = m.end;
  }

  if (cursor < line.length) {
    segments.push({ text: line.slice(cursor), color: spec.plain });
  }

  return segments;
}

export function HighlightedCodeBlock({
  code,
  theme = 'tokyo-night'
}: {
  code: string;
  theme?: CodeHighlightTheme;
}) {
  const spec = CODE_THEMES[theme] || CODE_THEMES['tokyo-night'];
  const lines = code.split('\n');

  return (
    <div
      className="overflow-x-auto p-4 font-mono-tabular text-[13px] leading-relaxed transition-colors duration-200"
      style={{ backgroundColor: spec.bg }}
    >
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, idx) => {
            const segments = tokenizeLine(line, spec);
            return (
              <tr
                key={idx}
                style={{ transition: 'background-color 120ms ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = spec.hoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td
                  className="w-9 select-none pr-4 text-right align-top"
                  style={{ color: spec.lineNum }}
                >
                  {idx + 1}
                </td>
                <td className="whitespace-pre" style={{ color: spec.plain }}>
                  {segments.map((seg, sIdx) => (
                    <span key={sIdx} style={{ color: seg.color }}>
                      {seg.text}
                    </span>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
