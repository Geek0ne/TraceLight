<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
</main>

<footer class="site-footer">
    <div class="container footer-inner">
        <div class="footer-left">
            <span class="footer-brand">&gt;_ <?php $this->options->title(); ?></span>
            <p class="footer-desc">
                © <?php echo date('Y'); ?> · Powered by <a href="https://typecho.org" target="_blank" rel="noopener noreferrer">Typecho</a> &amp; <strong>TraceLight (溯光)</strong>.
                <?php if ($this->options->icp): ?> · <?php $this->options->icp(); ?><?php endif; ?>
            </p>
        </div>
        <div class="footer-right">
            <a href="<?php $this->options->siteUrl(); ?>?do=sitemap" target="_blank" rel="noopener noreferrer" class="footer-badge">Sitemap</a>
            <a href="<?php $this->options->feedUrl(); ?>" target="_blank" rel="noopener noreferrer" class="footer-badge">RSS Feed</a>
            <?php if ($this->options->githubUrl): ?>
                <a href="<?php $this->options->githubUrl(); ?>" target="_blank" rel="noopener noreferrer" class="footer-badge">GitHub</a>
            <?php endif; ?>
            <button type="button" id="backToTop" class="footer-badge">↑ 返回顶部</button>
        </div>
    </div>
</footer>

<!-- Command + K 全局搜索模态框 -->
<div class="modal-backdrop" id="searchModal" role="dialog" aria-modal="true" aria-label="全站搜索">
    <div class="modal-card search-modal-card">
        <form method="post" action="<?php $this->options->siteUrl(); ?>" role="search" class="search-form">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" id="searchInput" name="s" placeholder="输入关键词搜索技术文章、笔记..." autocomplete="off">
            <button type="button" class="modal-close-hint" id="closeSearch">ESC</button>
        </form>
        <div class="search-tips">
            <span>按 <kbd>Enter</kbd> 执行全站检索</span>
            <span>支持标题、标签与正文代码片段检索</span>
        </div>
    </div>
</div>

<!-- 图片灯箱预览 -->
<div class="lightbox-overlay" id="lightboxOverlay" role="dialog" aria-modal="true" aria-label="图片预览">
    <img src="" alt="Preview" id="lightboxImg">
    <p id="lightboxCaption"></p>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="<?php $this->options->themeUrl('assets/js/main.js'); ?>"></script>
<?php $this->footer(); ?>
</body>
</html>
