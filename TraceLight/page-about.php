<?php
/**
 * 关于 (About)
 *
 * @package custom
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');
$analytics = getArchiveAnalytics();
?>

<div class="container">
    <header class="page-hero">
        <span class="mono accent">WHOAMI · 溯光而行，以码载道</span>
        <h1><?php $this->title(); ?></h1>
        <p class="muted">系统工程师、全栈架构师与技术写作者的个人数字空间档案。</p>
    </header>

    <!-- 1. Bento 个人名片 + NOW 近况面板 -->
    <section class="about-bento-grid">
        <div class="bento-card profile-card spotlight-card">
            <div class="profile-top">
                <img src="<?php $this->options->avatar(); ?>" alt="Avatar" class="profile-avatar">
                <div>
                    <h2><?php $this->author(); ?></h2>
                    <p class="mono accent text-sm"><?php $this->options->heroTag(); ?></p>
                </div>
            </div>
            <p class="profile-bio"><?php $this->options->heroBio(); ?></p>

            <div class="about-meta-row mono text-xs">
                <span>📍 Singapore / Remote</span>
                <span>·</span>
                <span>⏳ 7+ Years Systems &amp; Cloud</span>
                <span>·</span>
                <span>✍️ <?php echo $analytics['totalPosts']; ?> 篇归档</span>
            </div>

            <!-- 技术雷达能力条 -->
            <div class="tech-radar-list">
                <div class="radar-item">
                    <div class="radar-head mono text-xs"><span>Rust / eBPF Kernel</span><span>92%</span></div>
                    <div class="radar-bar"><span style="width:92%"></span></div>
                </div>
                <div class="radar-item">
                    <div class="radar-head mono text-xs"><span>Go / Distributed Microservices</span><span>95%</span></div>
                    <div class="radar-bar"><span style="width:95%"></span></div>
                </div>
                <div class="radar-item">
                    <div class="radar-head mono text-xs"><span>TypeScript / Modern Web</span><span>88%</span></div>
                    <div class="radar-bar"><span style="width:88%"></span></div>
                </div>
                <div class="radar-item">
                    <div class="radar-head mono text-xs"><span>Kubernetes / PostgreSQL</span><span>90%</span></div>
                    <div class="radar-bar"><span style="width:90%"></span></div>
                </div>
            </div>
        </div>

        <!-- Now 近况面板 -->
        <div class="bento-card now-card spotlight-card">
            <div class="now-header">
                <h3 class="mono">NOW · 近期状态</h3>
                <span class="mono text-xs muted">Updated 2026-11</span>
            </div>
            <ul class="now-list">
                <li><span class="mono muted">Building:</span> 高性能分布式日志采集器 &amp; TraceLight 主题引擎</li>
                <li><span class="mono muted">Reading:</span> 《Designing Data-Intensive Applications》二刷</li>
                <li><span class="mono muted">Focus:</span> Rust 异步运行时与 eBPF 零侵入可观测性</li>
                <li><span class="mono muted">Listening:</span> Synthwave &amp; Nils Frahm《Spaces》</li>
                <li><span class="mono muted">Exploring:</span> AI Agent 工作流编排与边缘计算网关</li>
                <li><span class="mono muted">Location:</span> Singapore / Remote</li>
            </ul>
        </div>
    </section>

    <!-- 2. 工程履历时间线 -->
    <section class="about-section-block">
        <h2 class="section-title"><span class="mono accent">01.</span> 工程履历与里程碑</h2>
        <div class="bento-card timeline-career">
            <div class="career-item">
                <span class="career-period mono">2024 — Present</span>
                <div class="career-content">
                    <h3>Principal Systems Architect · Cloud Observability</h3>
                    <p class="muted text-sm">主导大规模 Kubernetes 集群 eBPF 零侵入网络探针架构设计与多租户时序存储引擎优化，P99 采集延迟压降 68%。</p>
                </div>
            </div>
            <div class="career-item">
                <span class="career-period mono">2021 — 2024</span>
                <div class="career-content">
                    <h3>Senior Backend Engineer · Core Infrastructure</h3>
                    <p class="muted text-sm">负责高并发 API 网关（100k+ RPS）、自适应限流中间件与分布式链路追踪平台演进。</p>
                </div>
            </div>
            <div class="career-item">
                <span class="career-period mono">2019 — 2021</span>
                <div class="career-content">
                    <h3>Full-Stack Developer · Developer Tooling</h3>
                    <p class="muted text-sm">构建现代 Web IDE 插件体系与自动化 CI/CD 流水线工具，业余时间维护多个 Typecho 与 CLI 开源项目。</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 3. 常用装备与开发工作流 (Uses & Gear) -->
    <section class="about-section-block">
        <h2 class="section-title"><span class="mono accent">02.</span> 常用装备与工作流 (Uses)</h2>
        <div class="uses-grid">
            <div class="bento-card uses-card spotlight-card">
                <span class="mono text-xs accent">WORKSTATION</span>
                <h3>MacBook Pro 14" M3 Max</h3>
                <p class="muted text-sm">64GB Unified Memory · 主力编译与多容器集群调试终端，搭配 4K HiDPI 双屏工作台。</p>
            </div>
            <div class="bento-card uses-card spotlight-card">
                <span class="mono text-xs accent">TERMINAL &amp; SHELL</span>
                <h3>Ghostty + Zsh + Starship</h3>
                <p class="muted text-sm">GPU 加速渲染终端，配合 fzf、ripgrep、zoxide 与 fastfetch 实现毫秒级命令响应。</p>
            </div>
            <div class="bento-card uses-card spotlight-card">
                <span class="mono text-xs accent">EDITOR &amp; TYPEFACE</span>
                <h3>Neovim + Zed · JetBrains Mono</h3>
                <p class="muted text-sm">Rust / Go 核心研发使用 Neovim LSP，前端与文档排版使用 Zed，连字字体提升代码阅读韵律。</p>
            </div>
            <div class="bento-card uses-card spotlight-card">
                <span class="mono text-xs accent">HARDWARE INPUT</span>
                <h3>HHKB Professional Hybrid</h3>
                <p class="muted text-sm">静电容无刻键盘与人体工学分体键位布局，全键盘流减少腕部疲劳与模式切换开销。</p>
            </div>
        </div>
    </section>

    <!-- 4. 精选开源作品集 -->
    <section class="about-section-block">
        <h2 class="section-title"><span class="mono accent">03.</span> 精选开源作品与项目</h2>
        <div class="portfolio-grid">
            <a href="<?php echo $this->options->githubUrl ?: '#'; ?>" target="_blank" rel="noopener noreferrer" class="bento-card project-card spotlight-card">
                <div class="project-top mono text-xs">
                    <span class="project-lang"><i class="lang-dot rust"></i> Rust</span>
                    <span>★ 1.4k</span>
                </div>
                <h3>HyperTrace-CLI</h3>
                <p class="muted text-sm">基于 eBPF 的轻量级命令行网络延迟与系统调用追踪工具，零侵入监控微服务。</p>
            </a>
            <a href="<?php echo $this->options->githubUrl ?: '#'; ?>" target="_blank" rel="noopener noreferrer" class="bento-card project-card spotlight-card">
                <div class="project-top mono text-xs">
                    <span class="project-lang"><i class="lang-dot ts"></i> TypeScript</span>
                    <span>★ 860</span>
                </div>
                <h3>TraceLight Theme (溯光)</h3>
                <p class="muted text-sm">专为工程师与写作者打造的现代化 Typecho 主题，融合 Bento 布局与完备 Markdown 体系。</p>
            </a>
            <a href="<?php echo $this->options->githubUrl ?: '#'; ?>" target="_blank" rel="noopener noreferrer" class="bento-card project-card spotlight-card">
                <div class="project-top mono text-xs">
                    <span class="project-lang"><i class="lang-dot go"></i> Go</span>
                    <span>★ 620</span>
                </div>
                <h3>KubePulse Gateway</h3>
                <p class="muted text-sm">云原生环境下的轻量级 API 网关与动态限流中间件，支持热加载配置。</p>
            </a>
        </div>
    </section>

    <!-- 5. 联系与交流方式 -->
    <section class="about-section-block">
        <div class="bento-card connect-bento">
            <div>
                <span class="mono text-xs accent">LET'S CONNECT</span>
                <h3>交流、技术咨询或交换友链</h3>
                <p class="muted text-sm">欢迎通过 GitHub Issue、RSS 订阅或在评论区留言与我探讨分布式系统与独立开发。</p>
            </div>
            <div class="connect-actions">
                <?php if ($this->options->githubUrl): ?>
                    <a href="<?php $this->options->githubUrl(); ?>" target="_blank" rel="noopener noreferrer" class="btn-primary btn-sm">访问 GitHub →</a>
                <?php endif; ?>
                <a href="<?php $this->options->feedUrl(); ?>" target="_blank" rel="noopener noreferrer" class="btn-ghost btn-sm">订阅 RSS</a>
            </div>
        </div>
    </section>

    <!-- 若后台关于页面写了自定义正文内容，渲染于此 -->
    <?php if (trim((string)$this->content)): ?>
    <section class="bento-card about-extra-content markdown-body">
        <?php echo parseEnhancedContent($this->content); ?>
    </section>
    <?php endif; ?>
</div>

<?php $this->need('footer.php'); ?>
