<?php
/**
 * 时光归档 (Archive)
 *
 * @package custom
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');
$analytics = getArchiveAnalytics();
?>

<div class="container">
    <header class="page-hero">
        <span class="mono accent">TIMELINE &amp; TELEMETRY</span>
        <h1><?php $this->title(); ?></h1>
        <p class="muted">累计产出 <strong><?php echo $analytics['totalPosts']; ?></strong> 篇技术文章，共计 <strong><?php echo number_format($analytics['totalWords']); ?></strong> 字。</p>
    </header>

    <!-- GitHub 风格年度写作热力图（含年份切换与月份坐标） -->
    <section class="bento-card heatmap-card">
        <div class="heatmap-header">
            <div class="heatmap-title-group">
                <h3 class="mono">写作热力图 (Contribution Graph)</h3>
                <span class="heatmap-year-range mono text-xs accent" id="heatmapYearSummary"></span>
            </div>

            <div class="heatmap-controls">
                <div class="category-filter-bar" id="heatmapYearBar" role="tablist" aria-label="热力图年份切换">
                    <button type="button" class="cat-tab active" data-heatmap-year="rolling">近一年</button>
                    <?php foreach ($analytics['years'] as $yr): ?>
                        <button type="button" class="cat-tab" data-heatmap-year="<?php echo (int)$yr; ?>"><?php echo (int)$yr; ?> 年</button>
                    <?php endforeach; ?>
                </div>
                <div class="heatmap-legend mono text-xs muted">
                    <span>Less</span>
                    <i class="cell l0"></i><i class="cell l1"></i><i class="cell l2"></i><i class="cell l3"></i><i class="cell l4"></i>
                    <span>More</span>
                </div>
            </div>
        </div>

        <div class="heatmap-scroll">
            <div class="heatmap-matrix-wrap">
                <div class="heatmap-months mono text-xs muted" id="heatmapMonths"></div>
                <div class="heatmap-body-row">
                    <div class="heatmap-weekdays mono text-xs muted" aria-hidden="true">
                        <span>一</span><span>三</span><span>五</span>
                    </div>
                    <div class="heatmap-grid" id="writingHeatmap" data-stats='<?php echo htmlspecialchars($analytics['heatmapJson'], ENT_QUOTES, 'UTF-8'); ?>'></div>
                </div>
            </div>
        </div>
        <div class="heatmap-tooltip mono text-xs" id="heatmapTooltip">悬停格子查看当日创作详情</div>
    </section>

    <!-- 分类 Bento 矩阵 -->
    <section class="archive-categories">
        <h2 class="section-title"><span class="mono accent">01.</span> 知识分类矩阵</h2>
        <div class="category-matrix">
            <?php $this->widget('Widget_Metas_Category_List')->to($categories); ?>
            <?php while ($categories->next()): ?>
                <a href="<?php $categories->permalink(); ?>" class="bento-card cat-matrix-card spotlight-card">
                    <div class="cat-matrix-top">
                        <span class="cat-name"><?php $categories->name(); ?></span>
                        <span class="cat-count mono"><?php $categories->count(); ?></span>
                    </div>
                    <p class="muted text-sm"><?php echo $categories->description ?: '探索该领域的工程实践与源码分析。'; ?></p>
                </a>
            <?php endwhile; ?>
        </div>
    </section>

    <!-- 年份时间轴 -->
    <section class="archive-timeline-section">
        <h2 class="section-title"><span class="mono accent">02.</span> 年份时间轴</h2>
        <div class="timeline-wrapper">
            <?php
            $this->widget('Widget_Contents_Post_Recent', 'pageSize=10000')->to($archives);
            $year = 0;
            while ($archives->next()):
                $year_tmp = date('Y', $archives->created);
                if ($year != $year_tmp) {
                    if ($year > 0) echo '</ul></div>';
                    $year = $year_tmp;
                    echo '<div class="timeline-year-group"><h3 class="timeline-year mono">' . $year . '</h3><ul class="timeline-list">';
                }
            ?>
                <li class="timeline-item">
                    <time class="mono muted"><?php $archives->date('m-d'); ?></time>
                    <a href="<?php $archives->permalink(); ?>" class="timeline-title"><?php $archives->title(); ?></a>
                    <span class="timeline-cat mono text-xs"><?php $archives->category(',', false); ?></span>
                </li>
            <?php
            endwhile;
            if ($year > 0) echo '</ul></div>';
            ?>
        </div>
    </section>
</div>

<?php $this->need('footer.php'); ?>
