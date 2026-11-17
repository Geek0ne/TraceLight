<?php
/**
 * TraceLight (溯光) - 现代诗意极客工程风 Typecho 主题
 *
 * @package TraceLight
 * @author TraceLight Studio
 * @version V0.35
 * @link https://github.com/tracelight-studio/typecho-theme-tracelight
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');
$analytics = getArchiveAnalytics();
?>

<div class="container">
    <?php if ($this->is('index') && $this->_currentPage == 1): ?>
    <!-- 特色首页 Hero Bento 区域 -->
    <section class="hero-section">
        <div class="hero-grid">
            <div class="bento-card hero-main spotlight-card">
                <div class="hero-ambient-sheen" aria-hidden="true"></div>
                <div class="hero-author-row">
                    <img src="<?php $this->options->avatar(); ?>" alt="<?php $this->options->title(); ?>" class="hero-mini-avatar">
                    <span class="hero-kicker mono"><?php $this->options->heroTag(); ?></span>
                </div>
                <h1 class="hero-title">
                    Code, Architecture <br>
                    <span class="gradient-text">&amp; Engineering Notes.</span>
                </h1>
                <p class="hero-bio"><?php $this->options->heroBio(); ?></p>
                <div class="hero-cta">
                    <a href="#articles" class="btn-primary">探索技术文章 ↓</a>
                    <?php if ($this->options->githubUrl): ?>
                        <a href="<?php $this->options->githubUrl(); ?>" target="_blank" rel="noopener noreferrer" class="btn-ghost">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                            GitHub
                        </a>
                    <?php endif; ?>
                </div>
            </div>

            <!-- 右侧拟真终端状态面板（fastfetch + zsh 实时状态） -->
            <div class="bento-card hero-terminal spotlight-card">
                <div class="terminal-header">
                    <div class="mac-dots" aria-hidden="true"><span></span><span></span><span></span></div>
                    <span class="mono text-xs terminal-title">zsh — architect@tracelight:~/blog</span>
                    <span class="mono text-xs terminal-status">PID 1024</span>
                </div>
                <div class="terminal-body mono">
                    <div class="t-cmd-line">
                        <span class="t-arrow">➜</span>
                        <span class="t-path">~/blog</span>
                        <span class="t-git">git:(<span class="t-branch">main</span>)</span>
                        <span class="t-cmd">fastfetch --minimal</span>
                    </div>

                    <div class="fastfetch-grid">
                        <pre class="fastfetch-ascii" aria-hidden="true">  ___
 / _ \
| | | |
| |_| |
 \__\_\
 TRACE</pre>
                        <div class="fastfetch-specs">
                            <div class="t-line"><span class="t-key">Host</span><span class="t-sep">:</span><span class="t-val"><?php $this->options->title(); ?></span></div>
                            <div class="t-line"><span class="t-key">Kernel</span><span class="t-sep">:</span><span class="t-val">Typecho <?php echo htmlspecialchars(getTypechoVersion(), ENT_QUOTES, 'UTF-8'); ?> · PHP <?php echo PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION; ?></span></div>
                            <div class="t-line"><span class="t-key">Theme</span><span class="t-sep">:</span><span class="t-val t-stack">TraceLight V0.35 (溯光)</span></div>
                            <div class="t-line"><span class="t-key">Corpus</span><span class="t-sep">:</span><span class="t-val"><?php echo $analytics['totalPosts']; ?> Posts · <?php echo number_format($analytics['totalWords']); ?> Words</span></div>
                            <div class="t-line"><span class="t-key">Stack</span><span class="t-sep">:</span><span class="t-val t-stack">Rust · Go · TypeScript · K8s</span></div>
                            <div class="t-line"><span class="t-key">Fields</span><span class="t-sep">:</span><span class="t-val">Native table.fields (0 Extra)</span></div>
                            <div class="ansi-swatches" aria-hidden="true">
                                <span style="background:#ef4444"></span>
                                <span style="background:#f59e0b"></span>
                                <span style="background:#22c55e"></span>
                                <span style="background:#06b6d4"></span>
                                <span style="background:#38bdf8"></span>
                                <span style="background:#818cf8"></span>
                                <span style="background:#c084fc"></span>
                                <span style="background:#f8fafc"></span>
                            </div>
                        </div>
                    </div>

                    <div class="t-footer-session">
                        <div class="t-log-line">
                            <span class="t-hash">8e71b92</span>
                            <span class="t-msg">feat: highlight syntax &amp; responsive bento</span>
                        </div>
                        <div class="t-prompt">
                            <span class="t-arrow">➜</span>
                            <span class="t-path">~/blog</span>
                            <span class="t-cmd">echo "溯光而行，以码载道。"</span><span class="cursor-blink">▌</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 4 列紧凑型数据概览条（清晰高对比大号标题与数值） -->
        <div class="bento-card hero-metrics-strip">
            <div class="metric-cell">
                <span class="metric-label">技术文章 · ARTICLES</span>
                <span class="metric-value mono"><?php echo str_pad((string)$analytics['totalPosts'], 2, '0', STR_PAD_LEFT); ?> 篇</span>
            </div>
            <div class="metric-cell">
                <span class="metric-label">累计创作 · WORDS</span>
                <span class="metric-value mono"><?php echo number_format($analytics['totalWords']); ?> 字</span>
            </div>
            <div class="metric-cell">
                <span class="metric-label">数据持久化 · ENGINE</span>
                <span class="metric-value mono accent">原生 Fields</span>
            </div>
            <div class="metric-cell">
                <span class="metric-label">表结构侵入 · SCHEMA</span>
                <span class="metric-value mono">0 表新增</span>
            </div>
        </div>
    </section>
    <?php else: ?>
    <section class="archive-banner">
        <span class="mono muted text-xs">筛选视图</span>
        <h1><?php $this->archiveTitle([
            'category' => _t('分类：%s'),
            'search'   => _t('搜索：%s'),
            'tag'      => _t('标签：%s'),
            'author'   => _t('作者：%s')
        ], '', ''); ?></h1>
    </section>
    <?php endif; ?>

    <!-- 文章列表区域 -->
    <section class="posts-section" id="articles">
        <div class="section-header">
            <h2 class="section-title"><span class="mono accent">01.</span> 最新技术日志</h2>
            <div class="category-filter-bar" role="navigation" aria-label="文章分类筛选">
                <?php $this->widget('Widget_Metas_Category_List')->to($categories); ?>
                <?php while ($categories->next()): ?>
                    <a href="<?php $categories->permalink(); ?>" class="cat-tab"><?php $categories->name(); ?></a>
                <?php endwhile; ?>
            </div>
        </div>

        <div class="posts-grid">
            <?php if ($this->have()): ?>
                <?php while ($this->next()):
                    $stats = getReadingStats($this->content);
                    $views = getPostMetaCount($this->cid, 'views');
                    $likes = getPostMetaCount($this->cid, 'likes');
                    $cover = getArticleCoverData($this, $this->options);
                ?>
                <article class="bento-card post-card spotlight-card">
                    <?php if ($cover['mode'] === 'image'): ?>
                        <a href="<?php $this->permalink(); ?>" class="post-card-cover">
                            <img src="<?php echo htmlspecialchars($cover['src'], ENT_QUOTES, 'UTF-8'); ?>" alt="<?php $this->title(); ?>" loading="lazy" referrerpolicy="no-referrer"<?php if (!empty($cover['fallback'])): ?> onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='<?php echo htmlspecialchars($cover['fallback'], ENT_QUOTES, 'UTF-8'); ?>';}"<?php endif; ?>>
                            <span class="cover-corner mono"><?php $this->category(' · ', false); ?></span>
                        </a>
                    <?php elseif ($cover['mode'] === 'auto'): $p = $cover['palette']; ?>
                        <a href="<?php $this->permalink(); ?>" class="post-card-cover post-card-cover-auto" style="background: linear-gradient(135deg, <?php echo $p['bg1']; ?> 0%, <?php echo $p['bg2']; ?> 100%);">
                            <svg viewBox="0 0 640 220" preserveAspectRatio="xMidYMid slice" class="auto-cover-svg" aria-hidden="true">
                                <defs>
                                    <pattern id="g-<?php $this->cid(); ?>" width="28" height="28" patternUnits="userSpaceOnUse">
                                        <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(148,163,184,0.14)" stroke-width="1"/>
                                    </pattern>
                                </defs>
                                <rect width="640" height="220" fill="url(#g-<?php $this->cid(); ?>)"/>
                                <g transform="translate(470, 110) rotate(<?php echo $cover['angle']; ?>)" opacity="0.65">
                                    <circle cx="0" cy="0" r="<?php echo $cover['radius']; ?>" fill="none" stroke="<?php echo $p['a1']; ?>" stroke-width="1.2" stroke-dasharray="5 5"/>
                                    <circle cx="0" cy="0" r="<?php echo (int)($cover['radius'] * 0.65); ?>" fill="none" stroke="<?php echo $p['a2']; ?>" stroke-width="1.2"/>
                                    <polygon points="0,-42 36,28 -36,28" fill="none" stroke="#e2e8f0" stroke-opacity="0.48" stroke-width="1.2"/>
                                </g>
                            </svg>
                            <div class="auto-cover-overlay">
                                <div class="auto-cover-top mono">
                                    <span style="color:<?php echo $p['a1']; ?>"><?php $this->category(' · ', false); ?></span>
                                    <span>AUTO COVER · <?php echo $stats['minutes']; ?> MIN</span>
                                </div>
                                <span class="auto-cover-title"><?php $this->title(); ?></span>
                            </div>
                        </a>
                    <?php endif; ?>

                    <div class="post-card-meta mono">
                        <span class="post-cat"><?php $this->category(' · ', false); ?></span>
                        <span class="muted"><?php $this->date('Y-m-d'); ?></span>
                    </div>
                    <h3 class="post-card-title">
                        <a href="<?php $this->permalink(); ?>"><?php $this->title(); ?></a>
                    </h3>
                    <p class="post-card-excerpt"><?php $this->excerpt(120, '...'); ?></p>
                    <div class="post-card-footer mono">
                        <div class="post-stats">
                            <span><?php echo $stats['minutes']; ?> min read</span>
                            <span aria-hidden="true">·</span>
                            <span><?php echo $views; ?> views</span>
                            <span aria-hidden="true">·</span>
                            <span>♥ <?php echo $likes; ?></span>
                        </div>
                        <a href="<?php $this->permalink(); ?>" class="read-more">阅读全文 →</a>
                    </div>
                </article>
                <?php endwhile; ?>
            <?php else: ?>
                <div class="bento-card empty-state">
                    <p class="mono muted">404 · 未找到匹配的技术文章。</p>
                </div>
            <?php endif; ?>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrap">
            <?php $this->pageNav('← Prev', 'Next →', 2, '...', [
                'wrapTag' => 'div',
                'wrapClass' => 'page-navigator',
                'itemTag' => 'span',
                'currentClass' => 'current'
            ]); ?>
        </div>
    </section>
</div>

<?php $this->need('footer.php'); ?>
