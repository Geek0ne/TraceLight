<?php
/**
 * 友邻 (Links)
 *
 * @package custom
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');

// 从页面正文中解析友链（每行格式: 名称 | URL | 头像URL | 简介 | 标签）
$rawLines = preg_split('/\r\n|\r|\n/', strip_tags((string)$this->content)) ?: [];
$links = [];
foreach ($rawLines as $line) {
    $line = trim($line);
    if (strpos($line, '|') !== false) {
        $parts = array_map('trim', explode('|', $line));
        $safeUrl = isset($parts[1]) ? escSafeUrl($parts[1]) : '';
        $safeAvatar = !empty($parts[2]) ? escSafeUrl($parts[2]) : '';
        if (count($parts) >= 2 && $safeUrl !== '' && filter_var($safeUrl, FILTER_VALIDATE_URL)) {
            $links[] = [
                'name'   => $parts[0],
                'url'    => $safeUrl,
                'avatar' => $safeAvatar !== '' ? $safeAvatar : 'https://avatars.githubusercontent.com/u/9919?v=4',
                'bio'    => !empty($parts[3]) ? $parts[3] : '技术探索与独立博客',
                'tag'    => !empty($parts[4]) ? $parts[4] : 'Tech'
            ];
        }
    }
}

// 默认演示数据（当页面正文未填写友链列表时展示）
if (empty($links)) {
    $links = [
        ['name' => 'Typecho Official',   'url' => 'https://typecho.org',          'avatar' => 'https://avatars.githubusercontent.com/u/1700368?v=4',  'bio' => '内核精简、强健的开源博客引擎',           'tag' => 'Engine'],
        ['name' => 'Vercel Engineering', 'url' => 'https://vercel.com/blog',      'avatar' => 'https://avatars.githubusercontent.com/u/14985020?v=4', 'bio' => 'Frontend Cloud & Next.js 架构前线',     'tag' => 'Cloud'],
        ['name' => 'Rust Lang Blog',     'url' => 'https://blog.rust-lang.org',   'avatar' => 'https://avatars.githubusercontent.com/u/5430905?v=4',  'bio' => '内存安全与零成本抽象的系统编程',         'tag' => 'Systems']
    ];
}
?>

<div class="container">
    <header class="page-hero">
        <span class="mono accent">ENGINEERING NEIGHBORS</span>
        <h1><?php $this->title(); ?></h1>
        <p class="muted">志同道合的独立开发者、架构师与技术写作者。</p>
    </header>

    <div class="links-bento-grid">
        <?php foreach ($links as $link): ?>
        <a href="<?php echo htmlspecialchars($link['url'], ENT_QUOTES, 'UTF-8'); ?>"
           target="_blank"
           rel="noopener noreferrer"
           class="bento-card link-card spotlight-card"
           data-ping-url="<?php echo htmlspecialchars($link['url'], ENT_QUOTES, 'UTF-8'); ?>">
            <div class="link-card-top">
                <img src="<?php echo htmlspecialchars($link['avatar'], ENT_QUOTES, 'UTF-8'); ?>"
                     alt="<?php echo htmlspecialchars($link['name'], ENT_QUOTES, 'UTF-8'); ?>"
                     class="link-avatar"
                     loading="lazy">
                <div class="link-status mono text-xs">
                    <span class="status-dot online" aria-hidden="true"></span>
                    <span class="latency-text">Online</span>
                </div>
            </div>
            <div class="link-info">
                <h3><?php echo htmlspecialchars($link['name'], ENT_QUOTES, 'UTF-8'); ?></h3>
                <p class="muted text-sm"><?php echo htmlspecialchars($link['bio'], ENT_QUOTES, 'UTF-8'); ?></p>
            </div>
            <div class="link-footer mono text-xs">
                <span class="link-tag">#<?php echo htmlspecialchars($link['tag'], ENT_QUOTES, 'UTF-8'); ?></span>
                <span class="muted">↗ Visit</span>
            </div>
        </a>
        <?php endforeach; ?>
    </div>

    <!-- 友链申请规范 -->
    <section class="bento-card link-apply-guide">
        <h3>📡 交换友链 / 申请规范</h3>
        <div class="guide-grid">
            <div class="callout callout-note">
                <div class="callout-title"><span>ℹ️</span><span>基本要求</span></div>
                <div class="callout-content">
                    <ul>
                        <li>优先技术类、计算机科学、独立开发或深度思考型独立博客；</li>
                        <li>全站启用 HTTPS，无恶意弹窗广告，保持半年内有内容更新；</li>
                        <li>请先在贵站添加本站链接后，在下方评论区按格式留言。</li>
                    </ul>
                </div>
            </div>
            <div class="site-info-card">
                <div class="mono text-xs muted">本站友链信息（可直接复制）</div>
                <pre><code>名称: <?php $this->options->title(); ?>
链接: <?php $this->options->siteUrl(); ?>
头像: <?php $this->options->avatar(); ?>
描述: <?php $this->options->description(); ?></code></pre>
            </div>
        </div>
    </section>

    <?php $this->need('comments.php'); ?>
</div>

<?php $this->need('footer.php'); ?>
