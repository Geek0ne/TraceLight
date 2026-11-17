<?php
/**
 * 书签库 (Bookmarks)
 *
 * @package custom
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');

// 从正文每行解析书签：标题 | URL | 分类 | 推荐短评
$rawLines = preg_split('/\r\n|\r|\n/', strip_tags((string)$this->content)) ?: [];
$bookmarks = [];
foreach ($rawLines as $line) {
    $line = trim($line);
    if (strpos($line, '|') !== false) {
        $parts = array_map('trim', explode('|', $line));
        $safeUrl = isset($parts[1]) ? escSafeUrl($parts[1]) : '';
        if (count($parts) >= 2 && $safeUrl !== '' && filter_var($safeUrl, FILTER_VALIDATE_URL)) {
            $bookmarks[] = [
                'title' => $parts[0],
                'url'   => $safeUrl,
                'cat'   => !empty($parts[2]) ? $parts[2] : '技术资源',
                'note'  => !empty($parts[3]) ? $parts[3] : '值得反复阅读的高质量工程资料'
            ];
        }
    }
}

if (empty($bookmarks)) {
    $bookmarks = [
        ['title' => 'Aya: Pure Rust eBPF Library', 'url' => 'https://aya-rs.dev', 'cat' => '技术文档', 'note' => '摆脱宿主机 LLVM 运行时依赖的纯 Rust eBPF 生态框架，支持 CO-RE 跨发行版运行'],
        ['title' => 'Rustonomicon (死灵书)', 'url' => 'https://doc.rust-lang.org/nomicon/', 'cat' => '技术文档', 'note' => '深入理解 Unsafe Rust、内存布局、生命周期协变与裸指针不变量的必读指南'],
        ['title' => 'Tokio Asynchronous Runtime', 'url' => 'https://tokio.rs', 'cat' => '技术文档', 'note' => 'Rust 异步网络编程事实标准运行时，涵盖 Reactor、Task 调度与背压控制'],
        ['title' => 'Linux Kernel eBPF Documentation', 'url' => 'https://docs.kernel.org/bpf/', 'cat' => '系统内核', 'note' => 'Linux 官方内核 eBPF 校验器规则、Map 类型及 kprobe/tracepoint 挂载接口手册'],
        ['title' => 'Go 101 & Runtime Internals', 'url' => 'https://go101.org', 'cat' => '系统内核', 'note' => '深度剖析 Go 内存逃逸、Channel 底层锁结构、GMP 调度器与三色标记垃圾回收机制'],
        ['title' => 'The Internals of PostgreSQL', 'url' => 'https://www.interdb.jp/pg/', 'cat' => '系统内核', 'note' => '系统讲解 MVCC 多版本并发控制、WAL 预写日志、VACUUM 清理与 B-Tree 物理页'],
        ['title' => 'Ghostty Terminal Emulator', 'url' => 'https://ghostty.org', 'cat' => '效率工具', 'note' => '基于 Zig 与 GPU 加速的现代跨平台原生极速终端，支持真彩色与连字渲染'],
        ['title' => 'Raycast Productivity Suite', 'url' => 'https://www.raycast.com', 'cat' => '效率工具', 'note' => '全键盘驱动的 macOS 效率启动器，搭配自定义脚本与剪贴板历史极大减少鼠标切换'],
        ['title' => 'OrbStack Container Engine', 'url' => 'https://orbstack.dev', 'cat' => '效率工具', 'note' => '比 Docker Desktop 更轻盈的 macOS 容器与 Linux 虚拟机引擎，冷启动仅需 2 秒'],
        ['title' => 'Linear Design & Craft', 'url' => 'https://linear.app', 'cat' => '设计灵感', 'note' => '深空微光网格、克制字体层级与毫秒级键盘交互的现代软件工程美学标杆'],
        ['title' => 'Vercel Geist Design System', 'url' => 'https://vercel.com/geist/introduction', 'cat' => '设计灵感', 'note' => '极具秩序感的开发者产品排版体系、等宽数字规范与可访问性色彩对比标准'],
        ['title' => 'High Scalability Archive', 'url' => 'https://highscalability.com', 'cat' => '深度好文', 'note' => '海量高并发后端架构演进复盘、分片策略与分布式存储实战案例库'],
        ['title' => 'ByteByteGo System Design', 'url' => 'https://blog.bytebytego.com', 'cat' => '深度好文', 'note' => '通过精密架构图拆解 Kafka、分布式锁、一致性哈希与全球支付网关底层设计'],
        ['title' => 'Lobste.rs Computing Community', 'url' => 'https://lobste.rs', 'cat' => '开源社区', 'note' => '高信噪比计算机科学与系统工程技术社区，聚焦底层原理与硬核工程博客']
    ];
}

$cats = array_values(array_unique(array_column($bookmarks, 'cat')));
?>

<div class="container">
    <header class="page-hero">
        <span class="mono accent">BOOKMARKS &amp; RADAR</span>
        <h1><?php $this->title(); ?></h1>
        <p class="muted">常读常新的工程文档、效率工具箱与设计灵感库。支持在独立页正文按「标题 | URL | 分类 | 短评」维护。</p>
    </header>

    <div class="filter-toolbar">
        <div class="category-filter-bar" id="bookmarkFilterBar" role="tablist" aria-label="书签分类筛选">
            <button type="button" class="cat-tab active" data-bm-cat="all">全部 (<?php echo count($bookmarks); ?>)</button>
            <?php foreach ($cats as $cat): ?>
                <button type="button" class="cat-tab" data-bm-cat="<?php echo htmlspecialchars($cat, ENT_QUOTES, 'UTF-8'); ?>">
                    <?php echo htmlspecialchars($cat, ENT_QUOTES, 'UTF-8'); ?>
                </button>
            <?php endforeach; ?>
        </div>

        <input type="search" id="bookmarkSearch" class="toolbar-search" placeholder="筛选书签标题或短评...">
    </div>

    <div class="bookmarks-grid" id="bookmarksGrid">
        <?php foreach ($bookmarks as $bm):
            $host = parse_url($bm['url'], PHP_URL_HOST) ?: '';
        ?>
        <a href="<?php echo htmlspecialchars($bm['url'], ENT_QUOTES, 'UTF-8'); ?>"
           target="_blank"
           rel="noopener noreferrer"
           class="bento-card bookmark-card spotlight-card"
           data-cat="<?php echo htmlspecialchars($bm['cat'], ENT_QUOTES, 'UTF-8'); ?>"
           data-search="<?php echo htmlspecialchars(strtolower($bm['title'] . ' ' . $bm['note'] . ' ' . $bm['cat']), ENT_QUOTES, 'UTF-8'); ?>">
            <div class="bookmark-top mono text-xs">
                <span class="accent"><?php echo htmlspecialchars($bm['cat'], ENT_QUOTES, 'UTF-8'); ?></span>
                <span class="muted"><?php echo htmlspecialchars($host, ENT_QUOTES, 'UTF-8'); ?></span>
            </div>
            <h3 class="bookmark-title"><?php echo htmlspecialchars($bm['title'], ENT_QUOTES, 'UTF-8'); ?></h3>
            <p class="muted text-sm"><?php echo htmlspecialchars($bm['note'], ENT_QUOTES, 'UTF-8'); ?></p>
            <div class="bookmark-footer mono text-xs muted">
                <span>↗ 打开资源</span>
            </div>
        </a>
        <?php endforeach; ?>
    </div>
</div>

<?php $this->need('footer.php'); ?>
