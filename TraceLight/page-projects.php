<?php
/**
 * 实验室 (Projects)
 *
 * @package custom
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');

// 从正文每行解析项目：项目名 | URL | 状态(Active/Beta/Archived) | 技术栈 | 指标 | 简介
$rawLines = preg_split('/\r\n|\r|\n/', strip_tags((string)$this->content)) ?: [];
$projects = [];
foreach ($rawLines as $line) {
    $line = trim($line);
    if (strpos($line, '|') !== false) {
        $parts = array_map('trim', explode('|', $line));
        $safeUrl = isset($parts[1]) ? escSafeUrl($parts[1]) : '';
        if (count($parts) >= 2 && $safeUrl !== '' && filter_var($safeUrl, FILTER_VALIDATE_URL)) {
            $projects[] = [
                'name'   => $parts[0],
                'url'    => $safeUrl,
                'status' => !empty($parts[2]) ? $parts[2] : 'Active',
                'stack'  => !empty($parts[3]) ? $parts[3] : 'Rust · CLI',
                'metric' => !empty($parts[4]) ? $parts[4] : 'Open Source',
                'desc'   => !empty($parts[5]) ? $parts[5] : '个人实验室开源工程项目'
            ];
        }
    }
}

if (empty($projects)) {
    $projects = [
        ['name' => 'HyperTrace-CLI', 'url' => 'https://github.com', 'status' => 'Active', 'stack' => 'Rust · eBPF · Tokio', 'metric' => '★ 1.4k · P99 < 1.8ms', 'desc' => '基于 Linux eBPF 与 Per-CPU RingBuffer 的零侵入微服务网络延迟追踪探针。'],
        ['name' => 'TraceLight (溯光)', 'url' => 'https://github.com', 'status' => 'Active', 'stack' => 'PHP 8 · ES6 · CSS Grid', 'metric' => '0 Extra SQL Tables', 'desc' => '融合诗意排版与现代极客工程美学的 Typecho 主题，内置 6 大特色独立模板。'],
        ['name' => 'KubePulse Gateway', 'url' => 'https://github.com', 'status' => 'Active', 'stack' => 'Go · Redis · Lua', 'metric' => '★ 620 · 100k RPS', 'desc' => '云原生轻量级 API 网关与 Little Law 自适应过载保护限流中间件。'],
        ['name' => 'VectorLog Agent', 'url' => 'https://github.com', 'status' => 'Beta', 'stack' => 'Rust · Arrow · Kafka', 'metric' => '14MB RSS Footprint', 'desc' => '极低内存占用的高性能日志结构化采集与批处理转发器。'],
        ['name' => 'Dotfiles & Neovim Matrix', 'url' => 'https://github.com', 'status' => 'Active', 'stack' => 'Lua · Zsh · Nix', 'metric' => 'Cold Start 38ms', 'desc' => '跨 macOS 与 Linux 服务器的零负担开发环境配置与键位映射仓库。'],
        ['name' => 'TinyRaft KV', 'url' => 'https://github.com', 'status' => 'Archived', 'stack' => 'Go · gRPC · BoltDB', 'metric' => 'Teaching Toy', 'desc' => '完整实现 Leader 选举、日志复制与快照压缩的极简 Raft 共识教学引擎。']
    ];
}
?>

<div class="container">
    <header class="page-hero">
        <span class="mono accent">ENGINEERING LAB &amp; PROJECTS</span>
        <h1><?php $this->title(); ?></h1>
        <p class="muted">个人开源作品、实验性基础设施原型与开发效率工具矩阵。</p>
    </header>

    <div class="filter-toolbar">
        <div class="category-filter-bar" id="projectFilterBar" role="tablist" aria-label="项目状态筛选">
            <button type="button" class="cat-tab active" data-proj-status="all">全部项目 (<?php echo count($projects); ?>)</button>
            <button type="button" class="cat-tab" data-proj-status="Active">Active</button>
            <button type="button" class="cat-tab" data-proj-status="Beta">Beta</button>
            <button type="button" class="cat-tab" data-proj-status="Archived">Archived</button>
        </div>
    </div>

    <div class="projects-lab-grid" id="projectsLabGrid">
        <?php foreach ($projects as $proj):
            $statusKey = strtolower($proj['status']);
        ?>
        <a href="<?php echo htmlspecialchars($proj['url'], ENT_QUOTES, 'UTF-8'); ?>"
           target="_blank"
           rel="noopener noreferrer"
           class="bento-card lab-card spotlight-card"
           data-status="<?php echo htmlspecialchars($proj['status'], ENT_QUOTES, 'UTF-8'); ?>">
            <div class="lab-card-top mono text-xs">
                <span class="lab-status status-<?php echo htmlspecialchars($statusKey, ENT_QUOTES, 'UTF-8'); ?>">
                    ● <?php echo htmlspecialchars($proj['status'], ENT_QUOTES, 'UTF-8'); ?>
                </span>
                <span class="muted"><?php echo htmlspecialchars($proj['metric'], ENT_QUOTES, 'UTF-8'); ?></span>
            </div>
            <h3><?php echo htmlspecialchars($proj['name'], ENT_QUOTES, 'UTF-8'); ?></h3>
            <p class="muted text-sm"><?php echo htmlspecialchars($proj['desc'], ENT_QUOTES, 'UTF-8'); ?></p>
            <div class="lab-card-footer mono text-xs">
                <span class="accent"><?php echo htmlspecialchars($proj['stack'], ENT_QUOTES, 'UTF-8'); ?></span>
                <span class="muted">↗ Source</span>
            </div>
        </a>
        <?php endforeach; ?>
    </div>
</div>

<?php $this->need('footer.php'); ?>
