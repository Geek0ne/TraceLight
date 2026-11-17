<?php
/**
 * 站点地图 (Sitemap)
 *
 * @package custom
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');
$analytics = getArchiveAnalytics();

$db = Typecho_Db::get();
$allTags = $db->fetchAll(
    $db->select('mid', 'name', 'slug', 'count')
        ->from('table.metas')
        ->where('type = ?', 'tag')
        ->order('count', Typecho_Db::SORT_DESC)
        ->limit(40)
);
?>

<div class="container">
    <header class="page-hero">
        <span class="mono accent">SITE DIRECTORY &amp; XML INDEX</span>
        <h1><?php $this->title(); ?></h1>
        <p class="muted">全站技术文章、知识分类、标签云与独立页面导航索引，兼供搜索引擎抓取的 XML Sitemap。</p>
    </header>

    <!-- XML Sitemap & RSS 快捷入口卡片 -->
    <section class="bento-card sitemap-xml-card">
        <div class="sitemap-xml-info">
            <span class="mono text-xs accent">SEARCH ENGINE PROTOCOL · SITEMAP 0.9</span>
            <h3>标准 XML Sitemap 与订阅源</h3>
            <p class="muted text-sm">已内置零插件 XML 站点地图生成器，自动收录全站已发布文章、独立页面与分类归档链接。</p>
        </div>
        <div class="sitemap-xml-actions mono text-xs">
            <a href="<?php $this->options->siteUrl(); ?>?do=sitemap" target="_blank" rel="noopener noreferrer" class="btn-primary btn-sm">查看 sitemap.xml ↗</a>
            <a href="<?php $this->options->feedUrl(); ?>" target="_blank" rel="noopener noreferrer" class="btn-ghost btn-sm">RSS 2.0 Feed</a>
        </div>
    </section>

    <!-- 独立页面 + 分类索引 Bento -->
    <section class="sitemap-bento-grid">
        <div class="bento-card sitemap-panel">
            <div class="sitemap-panel-head">
                <h2 class="section-title"><span class="mono accent">01.</span> 独立页面导航</h2>
                <span class="mono text-xs muted">PAGES</span>
            </div>
            <ul class="sitemap-link-list">
                <li>
                    <a href="<?php $this->options->siteUrl(); ?>">
                        <span>首页 · Home</span>
                        <span class="mono text-xs muted">/</span>
                    </a>
                </li>
                <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
                <?php while ($pages->next()): ?>
                <li>
                    <a href="<?php $pages->permalink(); ?>">
                        <span><?php $pages->title(); ?></span>
                        <span class="mono text-xs muted">/<?php echo htmlspecialchars((string)$pages->slug, ENT_QUOTES, 'UTF-8'); ?></span>
                    </a>
                </li>
                <?php endwhile; ?>
            </ul>
        </div>

        <div class="bento-card sitemap-panel">
            <div class="sitemap-panel-head">
                <h2 class="section-title"><span class="mono accent">02.</span> 知识分类专栏</h2>
                <span class="mono text-xs muted">CATEGORIES</span>
            </div>
            <ul class="sitemap-link-list">
                <?php $this->widget('Widget_Metas_Category_List')->to($categories); ?>
                <?php while ($categories->next()): ?>
                <li>
                    <a href="<?php $categories->permalink(); ?>">
                        <span><?php $categories->name(); ?></span>
                        <span class="mono text-xs accent"><?php $categories->count(); ?> 篇</span>
                    </a>
                </li>
                <?php endwhile; ?>
            </ul>
        </div>
    </section>

    <!-- 标签索引 -->
    <?php if (!empty($allTags)): ?>
    <section class="bento-card sitemap-tags-card">
        <div class="sitemap-panel-head">
            <h2 class="section-title"><span class="mono accent">03.</span> 热门技术标签 (Tags)</h2>
            <span class="mono text-xs muted"><?php echo count($allTags); ?> TAGS</span>
        </div>
        <div class="sitemap-tags-wrap mono text-xs">
            <?php foreach ($allTags as $t):
                $tagUrl = Typecho_Router::url('tag', ['slug' => $t['slug']], $this->options->index);
            ?>
                <a href="<?php echo htmlspecialchars((string)$tagUrl, ENT_QUOTES, 'UTF-8'); ?>" class="sitemap-tag-link">
                    #<?php echo htmlspecialchars((string)$t['name'], ENT_QUOTES, 'UTF-8'); ?>
                    <span class="muted">(<?php echo (int)$t['count']; ?>)</span>
                </a>
            <?php endforeach; ?>
        </div>
    </section>
    <?php endif; ?>

    <!-- 全量文章索引 -->
    <section class="bento-card sitemap-posts-card">
        <div class="sitemap-panel-head">
            <h2 class="section-title"><span class="mono accent">04.</span> 全部文章目录</h2>
            <span class="mono text-xs muted"><?php echo (int)$analytics['totalPosts']; ?> POSTS · <?php echo number_format((int)$analytics['totalWords']); ?> WORDS</span>
        </div>
        <div class="sitemap-timeline">
            <?php
            $this->widget('Widget_Contents_Post_Recent', 'pageSize=10000')->to($allPosts);
            $curYear = 0;
            while ($allPosts->next()):
                $yr = (int)date('Y', $allPosts->created);
                if ($yr !== $curYear) {
                    if ($curYear > 0) echo '</ul></div>';
                    $curYear = $yr;
                    echo '<div class="sitemap-year-block"><h3 class="timeline-year mono">' . $curYear . '</h3><ul class="timeline-list">';
                }
            ?>
                <li class="timeline-item">
                    <time class="mono muted"><?php $allPosts->date('m-d'); ?></time>
                    <a href="<?php $allPosts->permalink(); ?>" class="timeline-title"><?php $allPosts->title(); ?></a>
                    <span class="timeline-cat mono text-xs"><?php $allPosts->category(',', false); ?></span>
                </li>
            <?php
            endwhile;
            if ($curYear > 0) echo '</ul></div>';
            ?>
        </div>
    </section>
</div>

<?php $this->need('footer.php'); ?>
