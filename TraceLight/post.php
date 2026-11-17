<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');
$stats = getReadingStats($this->content);
$views = getPostMetaCount($this->cid, 'views');
$likes = getPostMetaCount($this->cid, 'likes');
$dropCapClass = ($this->options->enableDropCap == '1' && $this->fields->dropcap !== '0') ? 'has-dropcap' : '';
$cover = getArticleCoverData($this, $this->options);
$licenseKey = $this->options->copyrightLicense ?: 'CC BY-NC-SA 4.0';
$license = getLicenseInfo($licenseKey);
$authorDisplay = $this->options->copyrightAuthor ?: $this->author->screenName;
$shareUrl = urlencode((string)$this->permalink);
$shareTitle = urlencode((string)$this->title);
$shareDesc = urlencode(trim(preg_replace('/\s+/', ' ', strip_tags((string)$this->excerpt))));
?>

<div class="container post-layout">
    <!-- 主内容列 -->
    <article class="post-main">
        <header class="post-header">
            <div class="post-breadcrumbs mono">
                <a href="<?php $this->options->siteUrl(); ?>">~/home</a> / <span><?php $this->category(',', false); ?></span>
            </div>
            <h1 class="post-title"><?php $this->title(); ?></h1>
            <div class="post-meta-bar mono">
                <div class="meta-author">
                    <img src="<?php $this->options->avatar(); ?>" alt="<?php $this->author(); ?>" class="mini-avatar">
                    <span><?php $this->author(); ?></span>
                </div>
                <span aria-hidden="true">·</span>
                <time datetime="<?php $this->date('c'); ?>"><?php $this->date('Y-m-d'); ?></time>
                <span aria-hidden="true">·</span>
                <span><?php echo $stats['words']; ?> 字 / <?php echo $stats['minutes']; ?> min read</span>
                <span aria-hidden="true">·</span>
                <span><?php echo $views; ?> views</span>
            </div>
        </header>

        <?php if ($cover['mode'] === 'image'): ?>
            <div class="post-hero-cover">
                <img src="<?php echo htmlspecialchars($cover['src'], ENT_QUOTES, 'UTF-8'); ?>" alt="<?php $this->title(); ?>" referrerpolicy="no-referrer"<?php if (!empty($cover['fallback'])): ?> onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='<?php echo htmlspecialchars($cover['fallback'], ENT_QUOTES, 'UTF-8'); ?>';}"<?php endif; ?>>
            </div>
        <?php elseif ($cover['mode'] === 'auto'): $p = $cover['palette']; ?>
            <div class="post-hero-cover post-card-cover-auto" style="background: linear-gradient(135deg, <?php echo $p['bg1']; ?> 0%, <?php echo $p['bg2']; ?> 100%);">
                <svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice" class="auto-cover-svg" aria-hidden="true">
                    <defs>
                        <pattern id="hero-g-<?php $this->cid(); ?>" width="28" height="28" patternUnits="userSpaceOnUse">
                            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(148,163,184,0.14)" stroke-width="1"/>
                        </pattern>
                    </defs>
                    <rect width="640" height="240" fill="url(#hero-g-<?php $this->cid(); ?>)"/>
                    <g transform="translate(490, 120) rotate(<?php echo $cover['angle']; ?>)" opacity="0.65">
                        <circle cx="0" cy="0" r="<?php echo $cover['radius']; ?>" fill="none" stroke="<?php echo $p['a1']; ?>" stroke-width="1.2" stroke-dasharray="5 5"/>
                        <circle cx="0" cy="0" r="<?php echo (int)($cover['radius'] * 0.65); ?>" fill="none" stroke="<?php echo $p['a2']; ?>" stroke-width="1.2"/>
                        <polygon points="0,-42 36,28 -36,28" fill="none" stroke="#e2e8f0" stroke-opacity="0.48" stroke-width="1.2"/>
                    </g>
                </svg>
                <div class="auto-cover-overlay">
                    <div class="auto-cover-top mono">
                        <span style="color:<?php echo $p['a1']; ?>"><?php $this->category(' · ', false); ?></span>
                        <span>AUTO COVER · <?php echo $stats['minutes']; ?> MIN READ</span>
                    </div>
                    <span class="auto-cover-title hero-cover-title"><?php $this->title(); ?></span>
                </div>
            </div>
        <?php endif; ?>

        <!-- Markdown 正文区 -->
        <div class="markdown-body <?php echo $dropCapClass; ?>" id="articleContent">
            <?php echo parseEnhancedContent($this->content); ?>
        </div>

        <!-- 标签 -->
        <?php if ($this->tags): ?>
        <div class="post-tags">
            <?php $this->tags(' ', true, ''); ?>
        </div>
        <?php endif; ?>

        <!-- 内容版权协议卡片 -->
        <section class="bento-card copyright-card" aria-label="文章版权声明">
            <div class="copyright-header">
                <div class="copyright-badge mono">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M14.83 14.83a4 4 0 1 1 0-5.66"/></svg>
                    <span>内容版权协议 · <?php echo htmlspecialchars($license['short'], ENT_QUOTES, 'UTF-8'); ?></span>
                </div>
                <?php if (!empty($license['url'])): ?>
                    <a href="<?php echo htmlspecialchars($license['url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener noreferrer" class="mono text-xs accent">查看许可条款 ↗</a>
                <?php endif; ?>
            </div>
            <div class="copyright-grid text-sm">
                <div><span class="muted">本文作者：</span><strong><?php echo htmlspecialchars((string)$authorDisplay, ENT_QUOTES, 'UTF-8'); ?></strong></div>
                <div><span class="muted">发布时间：</span><time class="mono"><?php $this->date('Y-m-d'); ?></time></div>
                <div class="copyright-link-row">
                    <span class="muted">本文链接：</span>
                    <a href="<?php $this->permalink(); ?>" class="mono text-xs accent"><?php $this->permalink(); ?></a>
                </div>
            </div>
            <p class="copyright-desc text-xs muted">
                采用 <strong><?php echo htmlspecialchars($license['name'], ENT_QUOTES, 'UTF-8'); ?></strong> 进行许可。<?php echo htmlspecialchars($license['summary'], ENT_QUOTES, 'UTF-8'); ?>
            </p>
        </section>

        <!-- 国内外主流社交媒体多平台点击分享 -->
        <section class="bento-card share-card" aria-label="分享文章到社交媒体">
            <div class="share-card-head">
                <span class="share-heading">分享本文至国内外社交平台</span>
                <span class="mono text-xs muted" id="shareFeedback"></span>
            </div>
            <div class="share-grid">
                <button type="button" class="share-btn share-wechat" id="wechatShareBtn" data-url="<?php $this->permalink(); ?>" data-title="<?php $this->title(); ?>">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.69 3C4.44 3 1 5.88 1 9.43c0 2.04 1.15 3.85 2.94 5.03l-.73 2.19 2.57-1.29c.92.25 1.9.39 2.91.39.29 0 .58-.01.86-.04A5.57 5.57 0 0 1 9.2 13.8c0-3.17 3.04-5.74 6.8-5.74.33 0 .66.02.98.06C16.19 5.19 12.78 3 8.69 3zm-2.5 4.4a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76zm5 0a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76zM16 9.3c-3.31 0-6 2.19-6 4.89 0 2.7 2.69 4.89 6 4.89.73 0 1.43-.11 2.08-.31l1.94.98-.55-1.66C20.99 17.16 22 15.77 22 14.19c0-2.7-2.69-4.89-6-4.89z"/></svg>
                    <span>微信</span>
                </button>
                <a class="share-btn" href="https://service.weibo.com/share/share.php?url=<?php echo $shareUrl; ?>&title=<?php echo $shareTitle; ?>" target="_blank" rel="noopener noreferrer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.1 19.6c-4.3 0-7.7-2-7.7-4.8 0-1.8 1.2-3.9 3.3-5.8 2.8-2.5 5.9-3.6 7.1-2.4.5.5.5 1.4.2 2.4-.1.3.1.4.4.3 1.5-.6 3-.6 3.7.3.4.5.4 1.3.1 2.2-.1.3.1.4.4.5 1.3.4 2.1 1.4 2.1 2.6 0 2.7-4.1 4.7-9.6 4.7z"/></svg>
                    <span>微博</span>
                </a>
                <a class="share-btn" href="https://connect.qq.com/widget/shareqq/index.html?url=<?php echo $shareUrl; ?>&title=<?php echo $shareTitle; ?>&summary=<?php echo $shareDesc; ?>" target="_blank" rel="noopener noreferrer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c3.5 0 5.8 2.5 5.8 6.4 0 .6-.1 1.2-.2 1.8.8 1 1.4 2.3 1.4 3.4 0 .9-.4 1.6-.9 1.6-.4 0-.7-.5-1-1.3-.4 1.1-1.1 2-2 2.6.6.4 1 .9 1 1.4 0 .7-.9 1.1-2 1.1-.8 0-1.5-.3-2.1-.7-.6.4-1.3.7-2.1.7-1.1 0-2-.4-2-1.1 0-.5.4-1 1-1.4-.9-.6-1.6-1.5-2-2.6-.3.8-.6 1.3-1 1.3-.5 0-.9-.7-.9-1.6 0-1.1.6-2.4 1.4-3.4-.1-.6-.2-1.2-.2-1.8C6.2 4.5 8.5 2 12 2z"/></svg>
                    <span>QQ</span>
                </a>
                <a class="share-btn" href="https://www.douban.com/share/service?href=<?php echo $shareUrl; ?>&name=<?php echo $shareTitle; ?>&text=<?php echo $shareDesc; ?>" target="_blank" rel="noopener noreferrer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16v2H4V4zm1.5 4h13v6.5h-13V8zm2 2v2.5h9V10h-9zM3 18h4.2l-1-2.5h2.1l1 2.5h5.4l1-2.5h2.1l-1 2.5H21v2H3v-2z"/></svg>
                    <span>豆瓣</span>
                </a>
                <a class="share-btn" href="https://twitter.com/intent/tweet?text=<?php echo $shareTitle; ?>&url=<?php echo $shareUrl; ?>" target="_blank" rel="noopener noreferrer">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/></svg>
                    <span>X</span>
                </a>
                <a class="share-btn" href="https://t.me/share/url?url=<?php echo $shareUrl; ?>&text=<?php echo $shareTitle; ?>" target="_blank" rel="noopener noreferrer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    <span>Telegram</span>
                </a>
                <a class="share-btn" href="https://www.reddit.com/submit?url=<?php echo $shareUrl; ?>&title=<?php echo $shareTitle; ?>" target="_blank" rel="noopener noreferrer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701z"/></svg>
                    <span>Reddit</span>
                </a>
                <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=<?php echo $shareUrl; ?>" target="_blank" rel="noopener noreferrer">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                    <span>LinkedIn</span>
                </a>
                <button type="button" class="share-btn" id="copyPostLinkBtn" data-url="<?php $this->permalink(); ?>" data-title="<?php $this->title(); ?>">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    <span>复制链接</span>
                </button>
            </div>
            <div class="wechat-qr-box" id="wechatQrBox"></div>
        </section>

        <!-- 点赞 / 打赏互动卡片 -->
        <section class="bento-card interaction-card">
            <div class="interaction-text">
                <h4>觉得这篇文章有帮助？</h4>
                <p class="muted">欢迎点赞支持或请我喝杯美式咖啡，持续输出硬核技术内容。</p>
            </div>
            <div class="interaction-actions">
                <button type="button" class="action-btn like-btn" id="likeBtn" data-cid="<?php $this->cid(); ?>">
                    <span class="heart-icon" aria-hidden="true">♥</span>
                    <span>点赞</span>
                    <span class="like-count mono" id="likeCount"><?php echo $likes; ?></span>
                </button>
                <button type="button" class="action-btn reward-btn" id="rewardTrigger">
                    <span aria-hidden="true">☕</span>
                    <span>打赏支持</span>
                </button>
            </div>
        </section>

        <!-- 上一篇 / 下一篇导航 -->
        <nav class="post-siblings" aria-label="文章上下篇导航">
            <div class="bento-card sibling-card prev">
                <span class="mono text-xs muted">← PREVIOUS</span>
                <?php $this->thePrev('%s', '<span class="muted">已经是第一篇了</span>'); ?>
            </div>
            <div class="bento-card sibling-card next">
                <span class="mono text-xs muted">NEXT →</span>
                <?php $this->theNext('%s', '<span class="muted">已经是最后一篇了</span>'); ?>
            </div>
        </nav>

        <!-- 评论区 -->
        <?php $this->need('comments.php'); ?>
    </article>

    <!-- 右侧悬浮目录树 (TOC) -->
    <aside class="post-toc-aside" aria-label="文章目录">
        <div class="toc-sticky bento-card">
            <div class="toc-header mono">
                <span>ON THIS PAGE</span>
                <span id="tocPercent">0%</span>
            </div>
            <nav class="toc-nav" id="tocContainer"></nav>
        </div>
    </aside>
</div>

<!-- 打赏模态框 -->
<div class="modal-backdrop" id="rewardModal" role="dialog" aria-modal="true" aria-label="打赏支持">
    <div class="modal-card reward-modal-card">
        <div class="modal-header">
            <h3>☕ Buy me a coffee</h3>
            <button type="button" class="close-btn" id="closeReward" aria-label="关闭弹窗">×</button>
        </div>
        <div class="reward-tabs">
            <button type="button" class="tab-btn active" data-target="qrWechat">微信支付</button>
            <button type="button" class="tab-btn" data-target="qrAlipay">支付宝</button>
        </div>
        <div class="reward-qr-box">
            <div id="qrWechat" class="qr-panel active">
                <?php if ($this->options->wechatQr): ?>
                    <img src="<?php $this->options->wechatQr(); ?>" alt="微信赞赏码">
                <?php else: ?>
                    <div class="qr-placeholder mono">请在后台主题设置中填入微信收款码 URL</div>
                <?php endif; ?>
            </div>
            <div id="qrAlipay" class="qr-panel">
                <?php if ($this->options->alipayQr): ?>
                    <img src="<?php $this->options->alipayQr(); ?>" alt="支付宝收款码">
                <?php else: ?>
                    <div class="qr-placeholder mono">请在后台主题设置中填入支付宝收款码 URL</div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php $this->need('footer.php'); ?>
