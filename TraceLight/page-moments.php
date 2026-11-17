<?php
/**
 * 碎碎念 (Moments)
 *
 * @package custom
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');
$this->comments()->to($moments);
?>

<div class="container narrow-container">
    <header class="page-hero">
        <span class="mono accent">MOMENTS &amp; THOUGHTS</span>
        <h1><?php $this->title(); ?></h1>
        <p class="muted">日常开发灵感、多图生活瞬间与碎片化思考（支持最多 9 张配图，像朋友圈一样记录）。</p>
    </header>

    <!-- 现场发动态编辑器（支持图片 URL / 本地选择图片预览 + 地点标签） -->
    <div class="bento-card moment-composer">
        <div class="composer-header mono">
            <span><?php echo $this->user->hasLogin() ? '● 博主在线：发布图文动态将同步至 Typecho 数据库' : '○ 交互体验模式：支持图文动态现场预览发布'; ?></span>
        </div>
        <form id="momentForm" <?php if ($this->user->hasLogin()): ?>method="post" action="<?php $this->commentUrl(); ?>"<?php endif; ?>>
            <textarea id="momentInput" name="text" rows="3" placeholder="此刻在重构什么代码？或分享一张桌面/随拍瞬间... (支持 #标签 与 ![pic](url) 配图)" required></textarea>

            <!-- 待发布图片预览条（最多 9 张） -->
            <div class="composer-previews" id="momentImagePreviews"></div>

            <div class="composer-media-row">
                <label class="composer-media-btn mono text-xs" for="momentFilePicker">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <span>添加本地图片</span>
                    <input type="file" id="momentFilePicker" accept="image/*" multiple hidden>
                </label>

                <div class="composer-url-group">
                    <input type="url" id="momentImageUrlInput" class="composer-url-input mono text-xs" placeholder="或粘贴图片 URL 后点添加...">
                    <button type="button" id="momentAddUrlBtn" class="cat-tab">＋加图</button>
                </div>

                <input type="text" id="momentLocationInput" class="composer-loc-input mono text-xs" placeholder="📍 地点 (选填)">
            </div>

            <div class="composer-footer">
                <div class="composer-tools mono text-xs muted">
                    <span>#DevLog</span> · <span>#Rust</span> · <span>#Workspace</span>
                </div>
                <button type="submit" class="btn-primary btn-sm">发布动态 ✦</button>
            </div>
        </form>
    </div>

    <!-- 朋友圈式图文动态信息流 -->
    <div class="moments-feed" id="momentsFeed">
        <?php if ($moments->have()): ?>
            <?php while ($moments->next()):
                $ua = parseUserAgent($moments->agent);
                $parsed = parseMomentBodyAndImages($moments->content);
                $imgs = $parsed['images'];
                $gridClass = count($imgs) === 1 ? 'moment-gallery-1' : ((count($imgs) === 2 || count($imgs) === 4) ? 'moment-gallery-2' : 'moment-gallery-3');
            ?>
            <article class="bento-card moment-card spotlight-card">
                <div class="moment-card-header">
                    <img src="<?php $this->options->avatar(); ?>" alt="Avatar" class="mini-avatar">
                    <div class="moment-author-meta">
                        <span class="author-name"><?php $moments->author(); ?> <span class="badge-admin mono">HOST</span></span>
                        <span class="mono text-xs muted"><?php $moments->date('Y-m-d H:i'); ?> · 来自 <?php echo $ua['os']; ?></span>
                    </div>
                </div>
                <div class="moment-content markdown-body">
                    <?php echo $parsed['body']; ?>
                </div>
                <?php if (!empty($imgs)): ?>
                <div class="moment-gallery <?php echo $gridClass; ?>">
                    <?php foreach ($imgs as $src): ?>
                        <img src="<?php echo htmlspecialchars($src, ENT_QUOTES, 'UTF-8'); ?>" alt="碎碎念配图" loading="lazy" class="moment-photo">
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </article>
            <?php endwhile; ?>
        <?php else: ?>
            <article class="bento-card moment-card">
                <div class="moment-card-header">
                    <img src="<?php $this->options->avatar(); ?>" alt="Avatar" class="mini-avatar">
                    <div class="moment-author-meta">
                        <span class="author-name"><?php $this->author(); ?> <span class="badge-admin mono">HOST</span></span>
                        <span class="mono text-xs muted">刚刚 · macOS · 📍 Studio Desk</span>
                    </div>
                </div>
                <div class="moment-content">
                    <p>欢迎来到 <strong>溯光 · TraceLight</strong> 碎碎念空间！现已支持上传或粘贴多张图片，像朋友圈一样记录开发日常与桌面光影。</p>
                </div>
                <div class="moment-gallery moment-gallery-1">
                    <img src="<?php $this->options->themeUrl('assets/covers/cover-1.jpg'); ?>" alt="桌面随拍示例" class="moment-photo">
                </div>
            </article>
        <?php endif; ?>
    </div>
</div>

<?php $this->need('footer.php'); ?>
