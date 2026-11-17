import {
  DemoArticle,
  DemoBookmark,
  DemoCareerItem,
  DemoComment,
  DemoGearItem,
  DemoLink,
  DemoMoment,
  DemoProject,
  DemoRadarItem,
  ThemeConfig
} from '../types/aether';

export const DEFAULT_AVATAR = '/src/assets/images/avatar_engineer_1794940732427.jpg';
export const ARCH_DIAGRAM_IMG = '/src/assets/images/article_arch_diagram_1794940733189.jpg';
export const BENCH_METRICS_IMG = '/src/assets/images/article_bench_metrics_1794940733470.jpg';
export const THEME_SCREENSHOT_IMG = '/src/assets/images/theme_screenshot_1794940733956.jpg';

export const COVER_SYSTEMS_OBSIDIAN = '/src/assets/images/cover_systems_obsidian_1794944667036.jpg';
export const COVER_CLOUD_TOPOLOGY = '/src/assets/images/cover_cloud_topology_1794944667978.jpg';
export const COVER_CRAFT_MINIMAL = '/src/assets/images/cover_craft_minimal_1794944668349.jpg';
export const MOMENT_DESK_SETUP = '/src/assets/images/moment_desk_setup_1794944669989.jpg';

export const DEFAULT_GALAXY_BG = '/src/assets/images/bg_milkyway_galaxy_1794946272654.jpg';

export interface EmojiCategory {
  id: string;
  label: string;
  icon: string;
  emojis: string[];
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    label: '表情',
    icon: '😄',
    emojis: [
      '😄', '😁', '😂', '🤣', '😊', '😍', '🥰', '😘',
      '🤔', '🤨', '😎', '🤩', '🥳', '🥹', '😅', '😭',
      '😤', '😮', '😱', '😴', '🤯', '🫠', '🫡', '😏'
    ]
  },
  {
    id: 'gestures',
    label: '手势',
    icon: '👍',
    emojis: [
      '👍', '👎', '👏', '🙌', '🤝', '🙏', '💪', '👌',
      '✌️', '🤞', '🫰', '🫶', '👋', '🤚', '👉', '👆',
      '👀', '🧠', '💯', '🔥', '❤️', '🧡', '💙', '✨'
    ]
  },
  {
    id: 'tech',
    label: '极客',
    icon: '🚀',
    emojis: [
      '🚀', '💻', '⌨️', '🖥️', '⚡', '🛠️', '⚙️', '🔧',
      '🐛', '🔒', '🔑', '📦', '🐳', '🦀', '🐍', '📡',
      '🧪', '📊', '🎯', '📌', '💡', '✅', '⚠️', '🎉'
    ]
  },
  {
    id: 'nature',
    label: '自然',
    icon: '🌿',
    emojis: [
      '🌟', '🌙', '☀️', '🌈', '❄️', '🌊', '🌸', '🌿',
      '🍀', '🌵', '🌲', '🏔️', '🌌', '🪐', '🐱', '🐶',
      '🦊', '🐼', '🦉', '🦋', '🐝', '🐢', '🐬', '🐳'
    ]
  },
  {
    id: 'life',
    label: '日常',
    icon: '☕',
    emojis: [
      '☕', '🍵', '🧋', '🍺', '🍕', '🍔', '🍜', '🍰',
      '🎵', '🎧', '🎮', '📚', '📝', '📷', '✈️', '🚗',
      '🏠', '⏰', '🎁', '🎈', '🏆', '🥇', '💎', '🛸'
    ]
  }
];

export const COMMENT_EMOJIS: string[] = EMOJI_CATEGORIES.flatMap((c) => c.emojis);

export const RANDOM_COVER_API_PRESETS: {
  id: string;
  label: string;
  url: string;
  desc: string;
}[] = [
  {
    id: 'picsum',
    label: 'Picsum 高清摄影 (推荐)',
    url: 'https://picsum.photos/1200/630?random=',
    desc: '每次加载/换图自动拉取不同真实高清摄影'
  },
  {
    id: 'alcy',
    label: 'ALCY 二次元/风景',
    url: 'https://t.alcy.cc/fj',
    desc: '国内 CDN 加速，自然风景与动漫壁纸随机返回'
  },
  {
    id: 'bing',
    label: 'Bing 随机壁纸接口',
    url: 'https://api.dujin.org/bing/1366.php?rand=',
    desc: '经典高清壁纸接口，每次随机分配不重样'
  },
  {
    id: 'local',
    label: '主题内置离线图库',
    url: '__LOCAL__',
    desc: '零外部请求，轮换主题本地打包的精选科技封面'
  }
];

export const RANDOM_COVER_POOL: string[] = [
  COVER_SYSTEMS_OBSIDIAN,
  COVER_CLOUD_TOPOLOGY,
  COVER_CRAFT_MINIMAL,
  ARCH_DIAGRAM_IMG,
  BENCH_METRICS_IMG
];

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  siteTitle: '溯光 · TraceLight',
  siteDescription: '溯光而行，以码载道。构建高可用分布式系统、优雅的开发者工具与有温度的技术文字。',
  avatar: DEFAULT_AVATAR,
  heroTag: 'Systems Engineer & Full-Stack Architect',
  heroBio:
    '溯光而行，以码载道。构建高可用分布式系统、优雅的开发者工具与有温度的技术文字。Exploring Rust, Cloud Native & AI Engineering.',
  githubUrl: 'https://github.com',
  wechatQr: '',
  alipayQr: '',
  enableDropCap: true,
  defaultCoverMode: 'auto',
  randomCoverApi: 'https://picsum.photos/1200/630?random=',
  globalBgImage: DEFAULT_GALAXY_BG,
  globalBgTranslucent: true,
  codeHighlightTheme: 'tokyo-night',
  copyrightLicense: 'CC BY-NC-SA 4.0',
  copyrightAuthor: '溯光 · TraceLight',
  icp: 'MIT Open Source',
  seoKeywords: 'Typecho, 溯光, TraceLight, Rust, Go, Cloud Native, 技术博客',
  seoAuthorBio: '溯光 · TraceLight — 专注于分布式系统架构、Rust/Go 工程实践与云原生可观测性的技术日志。',
  ogImageUrl: 'https://your-domain.com/usr/themes/TraceLight/screenshot.jpg'
};

export const DEMO_ARTICLES: DemoArticle[] = [
  {
    cid: 101,
    slug: 'rust-async-ebpf-observability',
    title: '基于 Rust 与 eBPF 构建零侵入微服务可观测性探针',
    category: 'Systems',
    tags: ['Rust', 'eBPF', 'Observability'],
    date: '2026-11-12',
    excerpt: '探讨如何利用 Aya 框架与 Linux Kernel Tracepoint，在微秒级开销下实现分布式 RPC 延迟与系统调用全景追踪。',
    views: 1842,
    likes: 126,
    words: 2840,
    minutes: 9,
    coverMode: 'random',
    coverSeed: 0,
    blocks: [
      {
        type: 'paragraph',
        text: '在云原生微服务规模突破数千节点后，传统的侵入式 SDK 埋点往往带来高昂的维护成本与跨语言兼容性难题。通过在内核态直接挂载 eBPF 探针，我们能够在不修改任何业务代码的前提下捕获全链路 TCP 与 HTTP/2 帧延迟。'
      },
      { type: 'heading', level: 2, id: 'arch-overview', text: '01. 内核态与用户态环形缓冲区架构' },
      {
        type: 'paragraph',
        text: '为了避免高频事件触发用户态上下文切换风暴，HyperTrace 采用 Per-CPU RingBuffer 批量聚合指标，再通过异步 Tokio 运行时消费并序列化为 OpenTelemetry Span。'
      },
      {
        type: 'gallery',
        images: [
          { src: ARCH_DIAGRAM_IMG, alt: '图 1：分布式网格探针内核态采集拓扑' },
          { src: BENCH_METRICS_IMG, alt: '图 2：100k RPS 压测下 P99 延迟稳定在 1.8ms 以内' }
        ]
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Pro Tip',
        body: '生产环境建议将 RingBuffer 大小设置为页尺寸的 2 的幂次（例如 4MB），并在内核侧完成 5xx 状态码预过滤，可降低 85% 的用户态拷贝带宽。'
      },
      { type: 'heading', level: 2, id: 'aya-probe-code', text: '02. 使用 Aya 编写 kprobe 挂载逻辑' },
      {
        type: 'paragraph',
        text: '借助纯 Rust 生态的 Aya 库，我们可以彻底摆脱对宿主机 LLVM/Clang 的运行时依赖，直接生成单一静态二进制文件：'
      },
      {
        type: 'code',
        lang: 'rust',
        code: `#[kprobe]
pub fn tcp_sendmsg_entry(ctx: ProbeContext) -> u32 {
    match unsafe { try_trace_tcp(&ctx) } {
        Ok(ret) => ret,
        Err(_) => 0,
    }
}

unsafe fn try_trace_tcp(ctx: &ProbeContext) -> Result<u32, i64> {
    let pid_tgid = bpf_get_current_pid_tgid();
    let ts = bpf_ktime_get_ns();
    START_TS.insert(&pid_tgid, &ts, 0)?;
    Ok(0)
}`
      },
      { type: 'heading', level: 3, id: 'perf-benchmark', text: '压测性能对比' },
      {
        type: 'table',
        headers: ['采集方案', 'CPU 额外开销', 'P99 延迟增量', '语言无关性'],
        rows: [
          ['侵入式 OpenTelemetry SDK', '4.2%', '+1.9 ms', '需按语言接入'],
          ['Sidecar 代理劫持 (Envoy)', '7.8%', '+3.4 ms', '支持'],
          ['Aya eBPF 内核探针', '0.6%', '+0.12 ms', '完全无侵入']
        ]
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warning',
        body: 'Linux 内核版本低于 5.8 的节点不支持 BPF_MAP_TYPE_RINGBUF，需回退至 PerfEventArray。'
      },
      {
        type: 'footnotes',
        items: [
          { id: '1', text: 'Aya Project: https://aya-rs.dev — Pure Rust eBPF library with CO-RE support.' },
          { id: '2', text: '基准测试环境：Linux 6.6 LTS, AMD EPYC 7763, 10Gbps NIC。' }
        ]
      }
    ]
  },
  {
    cid: 102,
    slug: 'typecho-tracelight-engineering-design',
    title: '溯光 (TraceLight) 架构解析：零表入侵持久化与 Bento 工程美学',
    category: 'Engineering',
    tags: ['Typecho', 'Architecture', 'Design System'],
    date: '2026-11-05',
    excerpt: '不修改 Typecho 原生数据库表结构，如何优雅实现阅读量统计、AJAX 点赞、52 周热力图与 Markdown 增强渲染？',
    views: 1290,
    likes: 94,
    words: 2150,
    minutes: 7,
    coverMode: 'auto',
    coverSeed: 1,
    blocks: [
      {
        type: 'paragraph',
        text: '许多博客主题在功能扩展时习惯自行创建额外的 SQL 数据表，这往往导致跨数据库驱动（如 SQLite 与 PostgreSQL）迁移失败。溯光 (TraceLight) 选择完全基于 Typecho 原生的 table.fields 键值表，实现真正的零侵入安装。'
      },
      { type: 'heading', level: 2, id: 'fields-persistence', text: '01. 基于 table.fields 的无痛持久化' },
      {
        type: 'paragraph',
        text: '在 themeInit 生命周期中捕获 single 页面访问事件与 POST 点赞请求，通过 Typecho_Db 查询构造器原子更新 int_value 与 str_value 字段。'
      },
      {
        type: 'code',
        lang: 'php',
        code: `function incrementPostMetaField($cid, $fieldName) {
    $db = Typecho_Db::get();
    $row = $db->fetchRow(
        $db->select('int_value', 'str_value')
           ->from('table.fields')
           ->where('cid = ? AND name = ?', $cid, $fieldName)
    );
    if ($row) {
        $count = intval($row['int_value'] ?: $row['str_value']) + 1;
        $db->query($db->update('table.fields')
            ->rows(['int_value' => $count, 'str_value' => (string)$count])
            ->where('cid = ? AND name = ?', $cid, $fieldName));
        return $count;
    }
    return 1;
}`
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Info',
        body: '得益于原生字段复用，即使日后更换其他 Typecho 主题，历史累积的 views 与 likes 数据依然完整保留在数据库中。'
      },
      { type: 'heading', level: 2, id: 'markdown-pipeline', text: '02. Callout 与双图画廊解析管线' },
      {
        type: 'paragraph',
        text: '在 post.php 输出正文前，parseEnhancedContent() 会自动匹配 Obsidian 风格引用块以及同段落连续图片，将其转换为标准语义化组件。'
      }
    ]
  },
  {
    cid: 103,
    slug: 'go-scheduler-work-stealing-deep-dive',
    title: '深入 Go 调度器 GMP 模型：Work-Stealing 与网络轮询器协同机制',
    category: 'Backend',
    tags: ['Go', 'Concurrency', 'Runtime'],
    date: '2026-10-21',
    excerpt: '从 runtime/proc.go 源码视角拆解本地队列无锁化设计、sysmon 抢占式调度以及 netpoller 如何消除线程阻塞。',
    views: 965,
    likes: 73,
    words: 3420,
    minutes: 10,
    coverMode: 'random',
    coverSeed: 2,
    blocks: [
      {
        type: 'paragraph',
        text: 'Go 语言之所以能够以极低的内存占用轻松支撑百万级并发协程，核心在于其用户态 M:N 调度器对 CPU 缓存局部性与系统调用阻塞的精妙平衡。'
      },
      { type: 'heading', level: 2, id: 'gmp-queues', text: '01. 本地运行队列与全局队列调度优先级' },
      {
        type: 'paragraph',
        text: '每个逻辑处理器 P 维护着容量为 256 的无锁环形本地队列 runq。调度循环每执行 61 次本地调度便强制检查一次全局队列，防止长尾协程饥饿。'
      },
      {
        type: 'code',
        lang: 'go',
        code: `func schedule() {
    gp := globrunqget(pp, 0)
    if gp == nil {
        gp, inheritTime = runqget(pp)
    }
    if gp == nil {
        gp, inheritTime = findRunnable() // blocks until work is available
    }
    execute(gp, inheritTime)
}`
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Note',
        body: '当所有本地与全局队列均为空时，P 会尝试从其他随机选中的 P 偷取一半（runq/2）的 Goroutine，保证多核负载均衡。'
      }
    ]
  },
  {
    cid: 104,
    slug: 'kubernetes-gateway-rate-limiting',
    title: '云原生 API 网关限流实践：令牌桶与自适应并发控制',
    category: 'Cloud Native',
    tags: ['Kubernetes', 'Gateway', 'Redis'],
    date: '2026-09-14',
    excerpt: '对比固定阈值限流与 Little’s Law 自适应过载保护在突发流量场景下的表现，附带 Lua + Redis 原子脚本实现。',
    views: 814,
    likes: 58,
    words: 1980,
    minutes: 6,
    coverMode: 'auto',
    coverSeed: 3,
    blocks: [
      {
        type: 'paragraph',
        text: '静态 QPS 阈值在面对上游依赖抖动或慢 SQL 拖垮线程池时往往形同虚设。结合服务响应时间 RT 与当前并发数 Inflight 的自适应限流才是高可用网关的终极防线。'
      },
      { type: 'heading', level: 2, id: 'redis-lua-bucket', text: '01. 分布式令牌桶原子实现' },
      {
        type: 'code',
        lang: 'lua',
        code: `local tokens = tonumber(redis.call("GET", KEYS[1]) or ARGV[1])
local now = tonumber(ARGV[2])
if tokens >= 1 then
    redis.call("DECR", KEYS[1])
    return 1
end
return 0`
      }
    ]
  }
];

export const DEMO_COMMENTS: DemoComment[] = [
  {
    id: 'c-1',
    articleCid: 101,
    author: 'Linus_K',
    os: 'Linux',
    osIcon: '🐧',
    browser: 'Firefox',
    date: '2026-11-13 14:22',
    content: 'Aya 摆脱 LLVM 运行时依赖的设计非常实用，我们在 Debian 12 生产集群实测 CPU 消耗确实不到 1%。'
  },
  {
    id: 'c-2',
    articleCid: 101,
    author: 'TraceLight',
    isBlogger: true,
    os: 'macOS',
    osIcon: '🍎',
    browser: 'Chrome',
    date: '2026-11-13 15:08',
    content: '感谢反馈！如果内核支持 BTF CO-RE，跨发行版部署几乎可以做到一次编译到处运行。',
    parentId: 'c-1'
  },
  {
    id: 'c-3',
    articleCid: 102,
    author: 'Mina.dev',
    os: 'Windows 11/10',
    osIcon: '🪟',
    browser: 'Edge',
    date: '2026-11-06 09:41',
    content: '复用 Typecho 原生 fields 表太赞了，终于不用担心换主题或者用 SQLite 备份时丢数据。'
  }
];

export const DEMO_MOMENTS: DemoMoment[] = [
  {
    id: 'm-1',
    author: 'TraceLight',
    isHost: true,
    date: '2026-11-17 09:30',
    os: 'macOS',
    location: 'Singapore · Studio Desk',
    content:
      '晨间手冲咖啡配重构代码：为「溯光 · TraceLight」补全了多图朋友圈动态、文章自动封面与 4K 超宽屏流体适配。 #TraceLight #Workspace #Typecho',
    images: [MOMENT_DESK_SETUP],
    likes: 28
  },
  {
    id: 'm-2',
    author: 'TraceLight',
    isHost: true,
    date: '2026-11-10 21:15',
    os: 'Linux',
    location: 'Cloud Lab',
    content:
      '用 Rust 重写完日志采集器的 RingBuffer 消费者，内存占用从 180MB 直接降到了 14MB，贴两张内核拓扑与压测截图留念。 #Rust #eBPF #Systems',
    images: [ARCH_DIAGRAM_IMG, BENCH_METRICS_IMG, COVER_CLOUD_TOPOLOGY],
    likes: 41
  },
  {
    id: 'm-3',
    author: 'TraceLight',
    isHost: true,
    date: '2026-10-28 17:40',
    os: 'macOS',
    content:
      '好的工程工具应当像清晨穿过混凝土廊柱的光线一样克制、清晰而笃定。 #Architecture #Minimalism',
    images: [COVER_CRAFT_MINIMAL, COVER_SYSTEMS_OBSIDIAN],
    likes: 19
  }
];

export const DEMO_LINKS: DemoLink[] = [
  {
    name: 'Typecho Official',
    url: 'https://typecho.org',
    avatar: DEFAULT_AVATAR,
    bio: '内核精简、强健的开源博客引擎',
    tag: 'Engine',
    latencyMs: 28
  },
  {
    name: 'Vercel Engineering',
    url: 'https://vercel.com/blog',
    avatar: ARCH_DIAGRAM_IMG,
    bio: 'Frontend Cloud & Next.js 架构前线',
    tag: 'Cloud',
    latencyMs: 42
  },
  {
    name: 'Rust Lang Blog',
    url: 'https://blog.rust-lang.org',
    avatar: BENCH_METRICS_IMG,
    bio: '内存安全与零成本抽象的系统编程',
    tag: 'Systems',
    latencyMs: 35
  }
];

export const DEMO_BOOKMARKS: DemoBookmark[] = [
  {
    title: 'Aya: Pure Rust eBPF Library',
    url: 'https://aya-rs.dev',
    cat: '技术文档',
    note: '摆脱宿主机 LLVM 运行时依赖的纯 Rust eBPF 生态框架，支持 CO-RE 跨内核发行版运行。'
  },
  {
    title: 'Rustonomicon (死灵书)',
    url: 'https://doc.rust-lang.org/nomicon/',
    cat: '技术文档',
    note: '深入理解 Unsafe Rust、内存布局、生命周期协变与裸指针不变量的必读权威指南。'
  },
  {
    title: 'Tokio Asynchronous Runtime',
    url: 'https://tokio.rs',
    cat: '技术文档',
    note: 'Rust 异步网络编程事实标准运行时，涵盖 Reactor、Task 调度与背压控制最佳实践。'
  },
  {
    title: 'Linux Kernel eBPF Documentation',
    url: 'https://docs.kernel.org/bpf/',
    cat: '系统内核',
    note: 'Linux 官方内核 eBPF 校验器规则、Map 类型及 kprobe/tracepoint 挂载接口手册。'
  },
  {
    title: 'Go 101 & Runtime Internals',
    url: 'https://go101.org',
    cat: '系统内核',
    note: '深度剖析 Go 内存逃逸、Channel 底层锁结构、GMP 调度器与三色标记垃圾回收机制。'
  },
  {
    title: 'The Internals of PostgreSQL',
    url: 'https://www.interdb.jp/pg/',
    cat: '系统内核',
    note: '系统讲解 MVCC 多版本并发控制、WAL 预写日志、VACUUM 清理与 B-Tree 索引物理页。'
  },
  {
    title: 'Ghostty Terminal Emulator',
    url: 'https://ghostty.org',
    cat: '效率工具',
    note: '基于 Zig 与 GPU 加速的现代跨平台原生极速终端，支持真彩色与连字渲染。'
  },
  {
    title: 'Raycast Productivity Suite',
    url: 'https://www.raycast.com',
    cat: '效率工具',
    note: '全键盘驱动的 macOS 效率启动器，搭配自定义脚本与剪贴板历史极大减少鼠标切换。'
  },
  {
    title: 'OrbStack Container Engine',
    url: 'https://orbstack.dev',
    cat: '效率工具',
    note: '比 Docker Desktop 更轻盈的 macOS 容器与 Linux 虚拟机引擎，冷启动仅需 2 秒。'
  },
  {
    title: 'Linear Design & Craft',
    url: 'https://linear.app',
    cat: '设计灵感',
    note: '深空微光网格、克制字体层级与毫秒级键盘交互的现代软件工程美学标杆。'
  },
  {
    title: 'Vercel Geist Design System',
    url: 'https://vercel.com/geist/introduction',
    cat: '设计灵感',
    note: '极具秩序感的开发者产品排版体系、等宽数字规范与可访问性色彩对比标准。'
  },
  {
    title: 'High Scalability Archive',
    url: 'https://highscalability.com',
    cat: '深度好文',
    note: '海量高并发后端架构演进复盘、分片策略与分布式存储实战案例库。'
  },
  {
    title: 'ByteByteGo System Design',
    url: 'https://blog.bytebytego.com',
    cat: '深度好文',
    note: '通过精密架构图拆解 Kafka、分布式锁、一致性哈希与全球支付网关底层设计。'
  },
  {
    title: 'Lobste.rs Computing Community',
    url: 'https://lobste.rs',
    cat: '开源社区',
    note: '高信噪比计算机科学与系统工程技术社区，聚焦底层原理与硬核工程博客。'
  }
];

export const DEMO_PROJECTS: DemoProject[] = [
  {
    name: 'HyperTrace-CLI',
    url: 'https://github.com',
    status: 'Active',
    stack: 'Rust · eBPF · Tokio',
    metric: '★ 1.4k · P99 < 1.8ms',
    desc: '基于 Linux eBPF 与 Per-CPU RingBuffer 的零侵入微服务网络延迟追踪探针。',
    langDot: 'bg-[#dea584]'
  },
  {
    name: 'TraceLight Theme (溯光)',
    url: 'https://github.com',
    status: 'Active',
    stack: 'PHP 8 · ES6 · CSS Grid',
    metric: '0 Extra SQL Tables',
    desc: '融合诗意排版与现代极客工程美学的 Typecho 主题，内置 6 大特色独立模板。',
    langDot: 'bg-[#3178c6]'
  },
  {
    name: 'KubePulse Gateway',
    url: 'https://github.com',
    status: 'Active',
    stack: 'Go · Redis · Lua',
    metric: '★ 620 · 100k RPS',
    desc: '云原生轻量级 API 网关与 Little Law 自适应过载保护限流中间件。',
    langDot: 'bg-[#00add8]'
  },
  {
    name: 'VectorLog Agent',
    url: 'https://github.com',
    status: 'Beta',
    stack: 'Rust · Arrow · Kafka',
    metric: '14MB RSS Footprint',
    desc: '极低内存占用的高性能日志结构化采集与批处理转发器。',
    langDot: 'bg-[#dea584]'
  },
  {
    name: 'Dotfiles & Neovim Matrix',
    url: 'https://github.com',
    status: 'Active',
    stack: 'Lua · Zsh · Nix',
    metric: 'Cold Start 38ms',
    desc: '跨 macOS 与 Linux 服务器的零负担开发环境配置与键位映射仓库。',
    langDot: 'bg-[#3178c6]'
  },
  {
    name: 'TinyRaft KV',
    url: 'https://github.com',
    status: 'Archived',
    stack: 'Go · gRPC · BoltDB',
    metric: 'Teaching Toy',
    desc: '完整实现 Leader 选举、日志复制与快照压缩的极简 Raft 共识教学引擎。',
    langDot: 'bg-[#00add8]'
  }
];

export const DEMO_CAREER_TIMELINE: DemoCareerItem[] = [
  {
    period: '2024 — Present',
    role: 'Principal Systems Architect',
    org: 'Cloud Observability Lab',
    summary: '主导大规模 Kubernetes 集群 eBPF 零侵入网络探针架构设计与多租户时序存储引擎优化，P99 采集延迟压降 68%。'
  },
  {
    period: '2021 — 2024',
    role: 'Senior Backend Engineer',
    org: 'Core Infrastructure',
    summary: '负责高并发 API 网关（100k+ RPS）、自适应限流中间件与分布式链路追踪平台核心演进。'
  },
  {
    period: '2019 — 2021',
    role: 'Full-Stack Developer',
    org: 'Developer Tooling',
    summary: '构建现代 Web IDE 插件体系与自动化 CI/CD 流水线工具，业余时间维护多个 Typecho 与 CLI 开源项目。'
  }
];

export const DEMO_GEAR_ITEMS: DemoGearItem[] = [
  {
    category: 'WORKSTATION',
    name: 'MacBook Pro 14" M3 Max',
    detail: '64GB Unified Memory · 主力编译与多容器集群调试终端，搭配 4K HiDPI 双屏工作台。'
  },
  {
    category: 'TERMINAL & SHELL',
    name: 'Ghostty + Zsh + Starship',
    detail: 'GPU 加速渲染终端，配合 fzf、ripgrep、zoxide 与 fastfetch 实现毫秒级命令响应。'
  },
  {
    category: 'EDITOR & TYPEFACE',
    name: 'Neovim + Zed · JetBrains Mono',
    detail: 'Rust / Go 核心研发使用 Neovim LSP，前端与文档排版使用 Zed，连字字体提升代码阅读韵律。'
  },
  {
    category: 'HARDWARE INPUT',
    name: 'HHKB Professional Hybrid',
    detail: '静电容无刻键盘与人体工学分体键位布局，全键盘流减少腕部疲劳与模式切换开销。'
  }
];

export const DEMO_TECH_RADAR: DemoRadarItem[] = [
  { label: 'Rust / eBPF Kernel', pct: 92 },
  { label: 'Go / Distributed Microservices', pct: 95 },
  { label: 'TypeScript / Modern Web', pct: 88 },
  { label: 'Kubernetes / PostgreSQL', pct: 90 }
];

export function buildDemoHeatmap(): Record<string, { count: number; words: number }> {
  const map: Record<string, { count: number; words: number }> = {};
  const today = new Date();
  const formatLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Populate multi-year realistic contribution history across recent ~3 years (1095 days)
  for (let i = 0; i < 1095; i++) {
    if ((i * 17 + 5) % 9 === 0 || (i * 13) % 23 === 0) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = formatLocal(d);
      const count = (i % 3) + 1;
      const words = count * 850 + ((i * 137) % 1600);
      map[key] = { count, words };
    }
  }

  DEMO_ARTICLES.forEach((a) => {
    map[a.date] = { count: 1, words: a.words };
  });

  return map;
}
