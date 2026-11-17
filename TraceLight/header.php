<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
    <meta charset="<?php $this->options->charset(); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php $this->archiveTitle([
        'category' => _t('分类 %s 下的文章'),
        'search'   => _t('包含关键字 %s 的文章'),
        'tag'      => _t('标签 %s 下的文章'),
        'author'   => _t('%s 发布的文章')
    ], '', ' - '); ?><?php $this->options->title(); ?></title>
    <?php
        $siteTitleStr = (string)($this->options->title ?? 'TraceLight');
        $seoTitle = $this->is('single') ? ((string)$this->title . ' - ' . $siteTitleStr) : $siteTitleStr;
        $seoDesc = $this->is('single')
            ? trim((string)preg_replace('/\s+/', ' ', strip_tags((string)$this->excerpt)))
            : (string)($this->options->seoAuthorBio ?: $this->options->description);
        $seoKeywords = (string)($this->options->seoKeywords ?: 'Typecho, 溯光, TraceLight, Engineering Blog');
        $seoAuthor = $this->is('single') ? (string)$this->author->screenName : $siteTitleStr;
        $ogImage = (string)($this->options->ogImageUrl ?: $this->options->themeUrl('screenshot.jpg', true));
        $canonicalUrl = (string)($this->is('single') ? $this->permalink : $this->options->siteUrl);

        $globalBgUrl = getGlobalBgImageUrl($this->options);
        $isTranslucent = ($this->options->globalBgTranslucent ?? '1') !== '0';
        $defaultCodeTheme = (string)($this->options->codeHighlightTheme ?: 'tokyo-night');
        $hljsCssMap = [
            'tokyo-night'     => 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css',
            'github-dark'     => 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css',
            'one-dark'        => 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css',
            'dracula'         => 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/base16/dracula.min.css',
            'nord'            => 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/nord.min.css',
            'monokai-sublime' => 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/monokai-sublime.min.css',
            'night-owl'       => 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/night-owl.min.css',
            'solarized-dark'  => 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/base16/solarized-dark.min.css',
            'vs2015'          => 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css',
            'github-light'    => 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css'
        ];
        $activeHljsCss = $hljsCssMap[$defaultCodeTheme] ?? $hljsCssMap['tokyo-night'];

        $bodyClasses = [];
        if ($this->is('post')) $bodyClasses[] = 'is-post';
        if ($globalBgUrl !== '') $bodyClasses[] = 'has-global-bg';
        if ($isTranslucent) $bodyClasses[] = 'is-translucent';
    ?>
    <meta name="keywords" content="<?php echo htmlspecialchars($seoKeywords, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="author" content="<?php echo htmlspecialchars($seoAuthor, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="description" content="<?php echo htmlspecialchars($seoDesc, ENT_QUOTES, 'UTF-8'); ?>">
    <link rel="canonical" href="<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:type" content="<?php echo $this->is('single') ? 'article' : 'website'; ?>">
    <meta property="og:site_name" content="<?php $this->options->title(); ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($seoTitle, ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($seoDesc, ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:url" content="<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:image" content="<?php echo htmlspecialchars($ogImage, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($seoTitle, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($seoDesc, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="twitter:image" content="<?php echo htmlspecialchars($ogImage, ENT_QUOTES, 'UTF-8'); ?>">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="<?php $this->options->siteUrl(); ?>?do=sitemap">
    <?php $this->header('description=&keywords='); ?>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" id="hljsThemeStylesheet" href="<?php echo htmlspecialchars($activeHljsCss, ENT_QUOTES, 'UTF-8'); ?>">
    <link rel="stylesheet" href="<?php $this->options->themeUrl('assets/css/style.css'); ?>">
    <script>
        (function () {
            try {
                var saved = localStorage.getItem('tracelight_theme') || localStorage.getItem('aether_theme') || 'dark';
                document.documentElement.setAttribute('data-theme', saved);
                document.documentElement.setAttribute('data-code-theme', '<?php echo htmlspecialchars($defaultCodeTheme, ENT_QUOTES, 'UTF-8'); ?>');
            } catch (e) {}
        })();
    </script>
</head>
<body class="<?php echo implode(' ', $bodyClasses); ?>" data-default-code-theme="<?php echo htmlspecialchars($defaultCodeTheme, ENT_QUOTES, 'UTF-8'); ?>">

<?php if ($globalBgUrl !== ''): ?>
<!-- 全局默认背景图层（内置银河星空 / 用户自定义） -->
<div class="global-bg-layer" aria-hidden="true">
    <div class="global-bg-photo" style="background-image: url('<?php echo htmlspecialchars($globalBgUrl, ENT_QUOTES, 'UTF-8'); ?>');"></div>
    <div class="global-bg-scrim"></div>
</div>
<?php endif; ?>

<!-- 全局极客视觉背景：流光网格 + 粒子画布 + 氛围光晕 -->
<div class="bg-ambient" aria-hidden="true">
    <div class="bg-grid"></div>
    <div class="bg-spotlight" id="mouseSpotlight"></div>
    <div class="bg-glow-orb orb-1"></div>
    <div class="bg-glow-orb orb-2"></div>
    <canvas id="particleCanvas"></canvas>
</div>

<!-- 顶部阅读进度条（文章页激活） -->
<?php if ($this->is('post')): ?>
<div class="reading-progress-wrap" aria-hidden="true">
    <div class="reading-progress-bar" id="readingProgress"></div>
</div>
<?php endif; ?>

<!-- 玻璃态固定导航栏 -->
<header class="site-header">
    <div class="container header-inner">
        <a href="<?php $this->options->siteUrl(); ?>" class="brand-logo">
            <span class="brand-prompt" aria-hidden="true">&gt;_</span>
            <span class="brand-name"><?php $this->options->title(); ?></span>
        </a>

        <nav class="main-nav" id="mainNav" aria-label="主导航">
            <a href="<?php $this->options->siteUrl(); ?>" class="nav-link <?php if ($this->is('index')) echo 'active'; ?>">
                <?php echo getNavIconSvg('home', '首页'); ?>
                <span>首页</span>
            </a>
            <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
            <?php while ($pages->next()): ?>
                <?php if ($pages->slug === 'sitemap') continue; ?>
                <a href="<?php $pages->permalink(); ?>" class="nav-link <?php if ($this->is('page', $pages->slug)) echo 'active'; ?>">
                    <?php echo getNavIconSvg($pages->slug, $pages->title); ?>
                    <span><?php $pages->title(); ?></span>
                </a>
            <?php endwhile; ?>
        </nav>

        <div class="header-actions">
            <button type="button" class="icon-btn" id="searchTrigger" title="搜索 (Ctrl/Cmd + K)" aria-label="打开搜索">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span class="kbd-hint">⌘K</span>
            </button>

            <button type="button" class="icon-btn" id="themeToggle" title="切换亮/暗色主题" aria-label="切换主题">
                <svg class="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </button>

            <button type="button" class="icon-btn mobile-menu-btn" id="mobileMenuBtn" aria-label="展开菜单" aria-expanded="false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
        </div>
    </div>
</header>

<main class="site-main">
