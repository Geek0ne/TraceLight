<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;

/**
 * 溯光 (TraceLight) 主题后台配置项
 */
function themeConfig($form) {
    $avatar = new Typecho_Widget_Helper_Form_Element_Text(
        'avatar',
        NULL,
        'https://avatars.githubusercontent.com/u/9919?v=4',
        _t('博主头像 URL'),
        _t('用于首页 Hero、评论博主徽章与关于页面')
    );
    $form->addInput($avatar);

    $heroTag = new Typecho_Widget_Helper_Form_Element_Text(
        'heroTag',
        NULL,
        'Systems Engineer & Full-Stack Architect',
        _t('Hero 状态标签'),
        _t('显示在首页顶部身份标识旁')
    );
    $form->addInput($heroTag);

    $heroBio = new Typecho_Widget_Helper_Form_Element_Textarea(
        'heroBio',
        NULL,
        '溯光而行，以码载道。构建高可用分布式系统、优雅的开发者工具与有温度的技术文字。Exploring Rust, Cloud Native & AI Engineering.',
        _t('首页个人简介'),
        _t('支持简短纯文本')
    );
    $form->addInput($heroBio);

    $githubUrl = new Typecho_Widget_Helper_Form_Element_Text(
        'githubUrl',
        NULL,
        'https://github.com',
        _t('GitHub 主页链接'),
        _t('留空则不显示')
    );
    $form->addInput($githubUrl);

    $wechatQr = new Typecho_Widget_Helper_Form_Element_Text(
        'wechatQr',
        NULL,
        '',
        _t('微信打赏码 URL'),
        _t('文章底部打赏弹窗使用')
    );
    $form->addInput($wechatQr);

    $alipayQr = new Typecho_Widget_Helper_Form_Element_Text(
        'alipayQr',
        NULL,
        '',
        _t('支付宝打赏码 URL'),
        _t('文章底部打赏弹窗使用')
    );
    $form->addInput($alipayQr);

    $globalBgImage = new Typecho_Widget_Helper_Form_Element_Text(
        'globalBgImage',
        NULL,
        '__DEFAULT_GALAXY__',
        _t('全局默认背景图片 URL'),
        _t('填写 "__DEFAULT_GALAXY__" 使用主题内置银河星空摄影图，填写自定义图片 URL 覆盖全站背景，或填写 "none" 关闭背景图')
    );
    $form->addInput($globalBgImage);

    $globalBgTranslucent = new Typecho_Widget_Helper_Form_Element_Radio(
        'globalBgTranslucent',
        array('1' => _t('开启毛玻璃透明 (推荐)'), '0' => _t('关闭 (实色卡片)')),
        '1',
        _t('全局卡片透明磨砂效果'),
        _t('配合全局背景图片开启时，导航栏与 Bento 卡片将呈现高对比度毛玻璃通透质感')
    );
    $form->addInput($globalBgTranslucent);

    $codeHighlightTheme = new Typecho_Widget_Helper_Form_Element_Select(
        'codeHighlightTheme',
        array(
            'tokyo-night'     => _t('Tokyo Night (深空极客夜色)'),
            'github-dark'     => _t('GitHub Dark (经典暗色)'),
            'one-dark'        => _t('One Dark Pro (Atom 经典)'),
            'dracula'         => _t('Dracula (德古拉紫韵)'),
            'nord'            => _t('Nord (北欧极光冷灰)'),
            'monokai-sublime' => _t('Monokai Sublime (经典暖调)'),
            'night-owl'       => _t('Night Owl (猫头鹰深夜蓝)'),
            'solarized-dark'  => _t('Solarized Dark (护眼青灰)'),
            'vs2015'          => _t('VS Code Dark+ (微软极简深色)'),
            'github-light'    => _t('GitHub Light (明亮工程白)')
        ),
        'tokyo-night',
        _t('文章代码高亮主题'),
        _t('仅在后台统一设置并全站生效（不在文章正文内暴露切换控件）')
    );
    $form->addInput($codeHighlightTheme);

    $enableDropCap = new Typecho_Widget_Helper_Form_Element_Radio(
        'enableDropCap',
        array('1' => _t('开启'), '0' => _t('关闭')),
        '1',
        _t('全局文章首字下沉 (Drop Cap)'),
        _t('文章正文首段自动启用报刊级首字下沉排版；单篇文章可通过自定义字段 dropcap=0 单独关闭')
    );
    $form->addInput($enableDropCap);

    $defaultCoverMode = new Typecho_Widget_Helper_Form_Element_Radio(
        'defaultCoverMode',
        array(
            'auto'   => _t('自动生成 SVG 几何封面'),
            'random' => _t('随机接口配图 (自动换图)'),
            'none'   => _t('仅纯文字卡片')
        ),
        'auto',
        _t('全局文章默认封面模式'),
        _t('单篇文章可通过自定义字段 coverMode (auto / random / none) 或 cover (自定义图片 URL) 单独覆盖')
    );
    $form->addInput($defaultCoverMode);

    $randomCoverApi = new Typecho_Widget_Helper_Form_Element_Text(
        'randomCoverApi',
        NULL,
        'https://picsum.photos/1200/630?random=',
        _t('文章随机主图 API 接口'),
        _t('开启随机配图时自动拉取并轮换图片（如 https://picsum.photos/1200/630?random= 或 https://t.alcy.cc/fj，支持 {cid}/{seed} 占位符；填写 "__LOCAL__" 仅使用主题本地封面，外网超时自动回退本地图库）')
    );
    $form->addInput($randomCoverApi);

    $copyrightLicense = new Typecho_Widget_Helper_Form_Element_Select(
        'copyrightLicense',
        array(
            'CC BY-NC-SA 4.0'     => _t('CC BY-NC-SA 4.0 (署名-非商业性使用-相同方式共享)'),
            'CC BY 4.0'           => _t('CC BY 4.0 (署名 4.0 国际许可协议)'),
            'CC BY-NC 4.0'        => _t('CC BY-NC 4.0 (署名-非商业性使用)'),
            'CC BY-ND 4.0'        => _t('CC BY-ND 4.0 (署名-禁止演绎)'),
            'ALL_RIGHTS_RESERVED' => _t('© All Rights Reserved (保留所有权利)')
        ),
        'CC BY-NC-SA 4.0',
        _t('文章内容版权协议'),
        _t('将显示在每篇文章正文的版权声明卡片中')
    );
    $form->addInput($copyrightLicense);

    $copyrightAuthor = new Typecho_Widget_Helper_Form_Element_Text(
        'copyrightAuthor',
        NULL,
        '溯光 · TraceLight',
        _t('版权声明默认作者署名'),
        _t('留空则使用文章作者昵称')
    );
    $form->addInput($copyrightAuthor);

    $icp = new Typecho_Widget_Helper_Form_Element_Text(
        'icp',
        NULL,
        '',
        _t('备案号 / 底部版权补充'),
        _t('显示在页脚')
    );
    $form->addInput($icp);

    $seoKeywords = new Typecho_Widget_Helper_Form_Element_Text(
        'seoKeywords',
        NULL,
        'Typecho, 溯光, TraceLight, Rust, Go, Cloud Native, 技术博客',
        _t('SEO 站点关键词 (Keywords)'),
        _t('输出至 header.php 的 <meta name="keywords"> 标签，使用英文逗号分隔')
    );
    $form->addInput($seoKeywords);

    $seoAuthorBio = new Typecho_Widget_Helper_Form_Element_Textarea(
        'seoAuthorBio',
        NULL,
        '溯光 · TraceLight — 专注于分布式系统架构、Rust/Go 工程实践与云原生可观测性的技术日志。',
        _t('搜索引擎简介与作者说明 (Meta Description / Author)'),
        _t('用于首页及非单页的 <meta name="description"> 与 Open Graph 描述，建议 120–160 字符')
    );
    $form->addInput($seoAuthorBio);

    $ogImageUrl = new Typecho_Widget_Helper_Form_Element_Text(
        'ogImageUrl',
        NULL,
        '',
        _t('Open Graph 社交分享封面图 URL (og:image)'),
        _t('用于微信、X/Twitter、Slack、Discord 等平台链接卡片预览（建议 1200×630）')
    );
    $form->addInput($ogImageUrl);
}

/**
 * 兼容 Typecho 1.2 / 1.3 版本号获取
 */
function getTypechoVersion() {
    if (defined('\\Typecho\\Common::VERSION')) {
        return constant('\\Typecho\\Common::VERSION');
    }
    if (defined('Typecho_Common::VERSION')) {
        return constant('Typecho_Common::VERSION');
    }
    return '1.2';
}

/**
 * URL 安全过滤：防止 javascript:/data:text/html 等 XSS 协议注入
 */
function escSafeUrl($url) {
    $url = trim((string)$url);
    if ($url === '') return '';
    if (preg_match('/^(https?:\/\/|\/)/i', $url)) {
        return $url;
    }
    if (preg_match('/^data:image\/(png|jpe?g|webp|gif);base64,[a-zA-Z0-9+\/=]+$/i', $url)) {
        return $url;
    }
    return '';
}

/**
 * 解析全局背景图片实际生效 URL
 */
function getGlobalBgImageUrl($options) {
    $raw = trim((string)($options->globalBgImage ?? '__DEFAULT_GALAXY__'));
    if ($raw === '' || strtolower($raw) === 'none' || strtolower($raw) === 'off') {
        return '';
    }
    if ($raw === '__DEFAULT_GALAXY__') {
        return (string)$options->themeUrl('assets/bg/galaxy.jpg', true);
    }
    return escSafeUrl($raw);
}

/**
 * 校验同源请求头（防护跨站伪造点赞）
 */
function isSameOriginPostRequest() {
    $host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    if ($host === '') return true;
    $origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
    $referer = (string)($_SERVER['HTTP_REFERER'] ?? '');
    $check = $origin !== '' ? $origin : $referer;
    if ($check === '') return true;
    $parsedHost = strtolower((string)(parse_url($check, PHP_URL_HOST) ?? ''));
    $parsedPort = parse_url($check, PHP_URL_PORT);
    $targetHost = $parsedPort ? ($parsedHost . ':' . $parsedPort) : $parsedHost;
    return $parsedHost === $host || $targetHost === $host;
}

/**
 * 主题初始化 Hook：处理 XML Sitemap、AJAX 点赞与文章阅读量自增
 */
function themeInit($archive) {
    // 1. 内置标准 XML Sitemap (?do=sitemap 或 /sitemap.xml)
    $reqPath = (string)(parse_url((string)$archive->request->getRequestUri(), PHP_URL_PATH) ?? '');
    if ($archive->request->get('do') === 'sitemap' || substr(strtolower($reqPath), -12) === '/sitemap.xml') {
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        renderXmlSitemap($archive->options);
        exit;
    }

    // 2. 安全处理 AJAX 点赞请求
    if ($archive->request->isPost() && $archive->request->get('do') === 'like') {
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        header('Content-Type: application/json; charset=UTF-8');

        if (!isSameOriginPostRequest()) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Forbidden']);
            exit;
        }

        $cid = intval($archive->request->get('cid'));
        if ($cid > 0 && isPublishedContentExists($cid)) {
            $likes = incrementPostMetaField($cid, 'likes');
            echo json_encode(['status' => 'success', 'likes' => $likes]);
            exit;
        }

        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid content id']);
        exit;
    }

    // 3. 单页浏览量自增（仅针对已发布文章/页面）
    if ($archive->is('single') && intval($archive->cid) > 0) {
        incrementPostMetaField(intval($archive->cid), 'views');
    }
}

/**
 * 校验内容 ID 是否存在于 table.contents 中（避免无效 cid 写入 table.fields）
 */
function isPublishedContentExists($cid) {
    try {
        $db = Typecho_Db::get();
        $row = $db->fetchRow(
            $db->select('cid')
                ->from('table.contents')
                ->where('cid = ? AND status = ?', intval($cid), 'publish')
                ->limit(1)
        );
        return !empty($row);
    } catch (Exception $e) {
        return false;
    }
}

/**
 * 输出符合 Sitemaps.org 0.9 规范的 XML 站点地图
 */
function renderXmlSitemap($options) {
    header('Content-Type: application/xml; charset=UTF-8');
    header('X-Robots-Tag: noindex, follow');

    $db = Typecho_Db::get();
    $siteUrl = rtrim((string)$options->siteUrl, '/') . '/';
    $indexBase = (string)$options->index;

    $posts = $db->fetchAll(
        $db->select('cid', 'slug', 'created', 'modified', 'type')
            ->from('table.contents')
            ->where('status = ? AND (type = ? OR type = ?)', 'publish', 'post', 'page')
            ->order('modified', Typecho_Db::SORT_DESC)
    );

    $categories = $db->fetchAll(
        $db->select('mid', 'slug')
            ->from('table.metas')
            ->where('type = ?', 'category')
    );

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    // 首页
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($siteUrl, ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</loc>\n";
    echo "    <changefreq>daily</changefreq>\n";
    echo "    <priority>1.0</priority>\n";
    echo "  </url>\n";

    // 文章与独立页面
    foreach ($posts as $item) {
        $routeName = $item['type'] === 'page' ? 'page' : 'post';
        $params = [
            'cid' => $item['cid'],
            'slug' => $item['slug'],
            'year' => date('Y', $item['created']),
            'month' => date('m', $item['created']),
            'day' => date('d', $item['created'])
        ];
        $loc = Typecho_Router::url($routeName, $params, $indexBase);
        $lastmod = date('c', $item['modified'] ?: $item['created']);
        $priority = $item['type'] === 'page' ? '0.7' : '0.8';
        $freq = $item['type'] === 'page' ? 'monthly' : 'weekly';

        echo "  <url>\n";
        echo "    <loc>" . htmlspecialchars((string)$loc, ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</loc>\n";
        echo "    <lastmod>" . htmlspecialchars($lastmod, ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</lastmod>\n";
        echo "    <changefreq>{$freq}</changefreq>\n";
        echo "    <priority>{$priority}</priority>\n";
        echo "  </url>\n";
    }

    // 分类
    foreach ($categories as $cat) {
        $loc = Typecho_Router::url('category', ['slug' => $cat['slug']], $indexBase);
        echo "  <url>\n";
        echo "    <loc>" . htmlspecialchars((string)$loc, ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</loc>\n";
        echo "    <changefreq>weekly</changefreq>\n";
        echo "    <priority>0.6</priority>\n";
        echo "  </url>\n";
    }

    echo '</urlset>';
}

/**
 * 获取统一风格的导航菜单 SVG 图标
 */
function getNavIconSvg($slug, $title = '') {
    $key = strtolower(trim((string)$slug . ' ' . (string)$title));
    $attrs = 'width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

    if (strpos($key, 'home') !== false || strpos($key, '首页') !== false) {
        return "<svg {$attrs}><path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/></svg>";
    }
    if (strpos($key, 'moment') !== false || strpos($key, '碎碎念') !== false) {
        return "<svg {$attrs}><path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/></svg>";
    }
    if (strpos($key, 'archive') !== false || strpos($key, '归档') !== false) {
        return "<svg {$attrs}><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" ry=\"2\"/><line x1=\"16\" x2=\"16\" y1=\"2\" y2=\"6\"/><line x1=\"8\" x2=\"8\" y1=\"2\" y2=\"6\"/><line x1=\"3\" x2=\"21\" y1=\"10\" y2=\"10\"/></svg>";
    }
    if (strpos($key, 'bookmark') !== false || strpos($key, '书签') !== false) {
        return "<svg {$attrs}><path d=\"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z\"/></svg>";
    }
    if (strpos($key, 'project') !== false || strpos($key, '实验') !== false || strpos($key, 'lab') !== false) {
        return "<svg {$attrs}><path d=\"M10 2v7.31\"/><path d=\"M14 9.3V1.99\"/><path d=\"M8.5 2h7\"/><path d=\"M14 9.3a6.5 6.5 0 1 1-4 0\"/><path d=\"M5.52 16h12.96\"/></svg>";
    }
    if (strpos($key, 'link') !== false || strpos($key, '友邻') !== false || strpos($key, '友链') !== false) {
        return "<svg {$attrs}><circle cx=\"12\" cy=\"12\" r=\"10\"/><polygon points=\"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76\"/></svg>";
    }
    if (strpos($key, 'sitemap') !== false || strpos($key, '地图') !== false || strpos($key, '目录') !== false) {
        return "<svg {$attrs}><polygon points=\"3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21\"/><line x1=\"9\" x2=\"9\" y1=\"3\" y2=\"18\"/><line x1=\"15\" x2=\"15\" y1=\"6\" y2=\"21\"/></svg>";
    }
    if (strpos($key, 'about') !== false || strpos($key, '关于') !== false) {
        return "<svg {$attrs}><path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/></svg>";
    }
    return "<svg {$attrs}><path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/></svg>";
}

/**
 * 解析文章封面（支持 custom URL / auto 自动生成 SVG 艺术封面 / random 内置随机图库 / none）
 */
function getArticleCoverData($post, $options) {
    $customCover = isset($post->fields->cover) ? escSafeUrl((string)$post->fields->cover) : '';
    $fieldMode = isset($post->fields->coverMode) ? trim((string)$post->fields->coverMode) : '';
    $globalMode = $options->defaultCoverMode ?: 'auto';
    $mode = $fieldMode ?: $globalMode;

    if ($customCover !== '') {
        return ['mode' => 'image', 'src' => $customCover, 'fallback' => ''];
    }
    if ($mode === 'none') {
        return ['mode' => 'none', 'src' => '', 'fallback' => ''];
    }
    if ($mode === 'random') {
        $covers = [
            (string)$options->themeUrl('assets/covers/cover-1.jpg', true),
            (string)$options->themeUrl('assets/covers/cover-2.jpg', true),
            (string)$options->themeUrl('assets/covers/cover-3.jpg', true)
        ];
        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', (string)$post->content, $m)) {
            $safeInline = escSafeUrl($m[1]);
            if ($safeInline !== '') {
                array_unshift($covers, $safeInline);
            }
        }
        $idx = abs(intval($post->cid)) % count($covers);
        $localFallback = $covers[$idx];

        $apiRaw = trim((string)($options->randomCoverApi ?? 'https://picsum.photos/1200/630?random='));
        if ($apiRaw !== '' && $apiRaw !== '__LOCAL__' && strtolower($apiRaw) !== 'local') {
            $safeApi = escSafeUrl($apiRaw);
            if ($safeApi !== '') {
                $cidStr = (string)intval($post->cid);
                $seedStr = (string)mt_rand(1000, 99999);
                $token = $cidStr . '_' . $seedStr;
                if (strpos($safeApi, '{seed}') !== false || strpos($safeApi, '{cid}') !== false) {
                    $apiUrl = str_replace(['{seed}', '{cid}'], [$seedStr, $cidStr], $safeApi);
                } elseif (preg_match('/[=?&]$/', $safeApi)) {
                    $apiUrl = $safeApi . $token;
                } else {
                    $sep = strpos($safeApi, '?') !== false ? '&' : '?';
                    $apiUrl = $safeApi . $sep . '_r=' . $token;
                }
                return ['mode' => 'image', 'src' => $apiUrl, 'fallback' => $localFallback];
            }
        }
        return ['mode' => 'image', 'src' => $localFallback, 'fallback' => ''];
    }

    $hash = crc32((string)$post->cid . '-' . (string)$post->title);
    $palettes = [
        ['bg1' => '#07111e', 'bg2' => '#0f172a', 'a1' => '#38bdf8', 'a2' => '#818cf8'],
        ['bg1' => '#091418', 'bg2' => '#0f1f26', 'a1' => '#2dd4bf', 'a2' => '#38bdf8'],
        ['bg1' => '#100d21', 'bg2' => '#171532', 'a1' => '#a78bfa', 'a2' => '#60a5fa'],
        ['bg1' => '#14110b', 'bg2' => '#1d1810', 'a1' => '#f59e0b', 'a2' => '#38bdf8']
    ];
    $p = $palettes[abs($hash) % count($palettes)];
    $angle = (abs($hash) % 55) - 25;
    $r = 64 + (abs($hash >> 3) % 38);

    return [
        'mode' => 'auto',
        'palette' => $p,
        'angle' => $angle,
        'radius' => $r
    ];
}

/**
 * 获取内容版权协议详情
 */
function getLicenseInfo($key) {
    $map = [
        'CC BY-NC-SA 4.0' => [
            'short' => 'CC BY-NC-SA 4.0',
            'name' => '知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议',
            'url' => 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
            'summary' => '自由转载与演绎需保留原作者署名及原文链接，禁止用于商业用途，衍生作品须采用相同许可协议。'
        ],
        'CC BY 4.0' => [
            'short' => 'CC BY 4.0',
            'name' => '知识共享署名 4.0 国际许可协议',
            'url' => 'https://creativecommons.org/licenses/by/4.0/deed.zh-hans',
            'summary' => '允许在任何媒介以任何形式复制、传播及改编本文，只需清晰注明原作者与原始出处。'
        ],
        'CC BY-NC 4.0' => [
            'short' => 'CC BY-NC 4.0',
            'name' => '知识共享署名-非商业性使用 4.0 国际许可协议',
            'url' => 'https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans',
            'summary' => '允许非商业性复制、传播与修改，须保留原始作者署名和出处链接。'
        ],
        'CC BY-ND 4.0' => [
            'short' => 'CC BY-ND 4.0',
            'name' => '知识共享署名-禁止演绎 4.0 国际许可协议',
            'url' => 'https://creativecommons.org/licenses/by-nd/4.0/deed.zh-hans',
            'summary' => '可完整全文转发并注明作者与原文链接，不得对原文内容进行删改或二次演绎分发。'
        ],
        'ALL_RIGHTS_RESERVED' => [
            'short' => '© All Rights Reserved',
            'name' => '保留所有权利 (All Rights Reserved)',
            'url' => '',
            'summary' => '本文版权归作者所有，未经书面明确授权许可，禁止任何形式的全文转载、镜像抓取或商业引用。'
        ]
    ];
    return $map[$key] ?? $map['CC BY-NC-SA 4.0'];
}

/**
 * 提取碎碎念动态中的安全图片 URL，实现朋友圈多图墙排版
 */
function parseMomentBodyAndImages($content) {
    $raw = (string)$content;
    $images = [];

    if (preg_match_all('/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $raw, $htmlImgs)) {
        foreach ($htmlImgs[1] as $src) {
            $safe = escSafeUrl($src);
            if ($safe !== '') $images[] = $safe;
        }
        $raw = (string)preg_replace('/<img[^>]+>/i', '', $raw);
    }

    if (preg_match_all('/!\[[^\]]*\]\(([^)\s]+)\)/', $raw, $mdImgs)) {
        foreach ($mdImgs[1] as $src) {
            $safe = escSafeUrl($src);
            if ($safe !== '') $images[] = $safe;
        }
        $raw = (string)preg_replace('/!\[[^\]]*\]\([^)]+\)/', '', $raw);
    }

    $images = array_values(array_unique(array_slice($images, 0, 9)));
    return [
        'body' => trim($raw),
        'images' => $images
    ];
}

/**
 * 读取自定义字段数值 (views / likes) - 兼容 MySQL 8 / PostgreSQL / SQLite
 */
function getPostMetaCount($cid, $fieldName) {
    $cid = intval($cid);
    if ($cid <= 0) return 0;
    try {
        $db = Typecho_Db::get();
        $row = $db->fetchRow(
            $db->select('int_value', 'str_value')
                ->from('table.fields')
                ->where('cid = ? AND name = ?', $cid, (string)$fieldName)
                ->limit(1)
        );
        if (!$row) return 0;
        return intval($row['int_value'] ?: $row['str_value']);
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * 并发安全的自定义字段自增（兼容 MySQL / PostgreSQL / SQLite 主键约束）
 */
function incrementPostMetaField($cid, $fieldName) {
    $cid = intval($cid);
    $fieldName = (string)$fieldName;
    if ($cid <= 0) return 0;

    try {
        $db = Typecho_Db::get();
        $row = $db->fetchRow(
            $db->select('int_value', 'str_value')
                ->from('table.fields')
                ->where('cid = ? AND name = ?', $cid, $fieldName)
                ->limit(1)
        );
        if ($row) {
            $count = intval($row['int_value'] ?: $row['str_value']) + 1;
            $db->query(
                $db->update('table.fields')
                    ->rows(['int_value' => $count, 'str_value' => (string)$count])
                    ->where('cid = ? AND name = ?', $cid, $fieldName)
            );
            return $count;
        }

        try {
            $db->query(
                $db->insert('table.fields')->rows([
                    'cid' => $cid,
                    'name' => $fieldName,
                    'type' => 'str',
                    'str_value' => '1',
                    'int_value' => 1,
                    'float_value' => 0
                ])
            );
            return 1;
        } catch (Exception $insertErr) {
            // 并发插入冲突回退更新
            $retryRow = $db->fetchRow(
                $db->select('int_value', 'str_value')
                    ->from('table.fields')
                    ->where('cid = ? AND name = ?', $cid, $fieldName)
                    ->limit(1)
            );
            $count = $retryRow ? (intval($retryRow['int_value'] ?: $retryRow['str_value']) + 1) : 1;
            $db->query(
                $db->update('table.fields')
                    ->rows(['int_value' => $count, 'str_value' => (string)$count])
                    ->where('cid = ? AND name = ?', $cid, $fieldName)
            );
            return $count;
        }
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * 计算预计阅读时长与字数
 */
function getReadingStats($content) {
    $text = strip_tags((string)$content);
    preg_match_all('/[\x{4e00}-\x{9fa5}]/u', $text, $zh);
    preg_match_all('/[a-zA-Z0-9_]+/', $text, $en);
    $words = count($zh[0]) + count($en[0]);
    $minutes = max(1, (int)ceil($words / 350));
    return ['words' => $words, 'minutes' => $minutes];
}

/**
 * 解析 Markdown 增强组件：Callout 提示框、双图画廊、单图图注、图片懒加载与外链安全属性
 */
function parseEnhancedContent($content) {
    $content = (string)$content;

    $content = (string)preg_replace_callback(
        '/<blockquote>\s*<p>\s*\[!(NOTE|TIP|WARNING|DANGER|INFO)\]\s*(?:<br\s*\/?>|\r?\n|\s*)(.*?)<\/p>(.*?)<\/blockquote>/is',
        function ($matches) {
            $type = strtolower($matches[1]);
            $titles = [
                'note' => ['label' => 'Note', 'icon' => 'ℹ️'],
                'info' => ['label' => 'Info', 'icon' => '💡'],
                'tip' => ['label' => 'Pro Tip', 'icon' => '✨'],
                'warning' => ['label' => 'Warning', 'icon' => '⚠️'],
                'danger' => ['label' => 'Critical', 'icon' => '🔥']
            ];
            $meta = $titles[$type] ?? $titles['note'];
            $firstBody = trim($matches[2]);
            $restBody = trim($matches[3]);
            $bodyHtml = ($firstBody !== '' ? "<p>{$firstBody}</p>" : '') . $restBody;

            return "<div class=\"callout callout-{$type}\">"
                . "<div class=\"callout-title\"><span>{$meta['icon']}</span><span>{$meta['label']}</span></div>"
                . "<div class=\"callout-content\">{$bodyHtml}</div>"
                . "</div>";
        },
        $content
    );

    $content = (string)preg_replace_callback(
        '/<p>\s*(<img[^>]+>)\s*(?:<br\s*\/?>|\s*)*(<img[^>]+>)\s*<\/p>/i',
        function ($matches) {
            $imgs = [$matches[1], $matches[2]];
            $html = '<div class="gallery-2">';
            foreach ($imgs as $img) {
                if (stripos($img, 'loading=') === false) {
                    $img = (string)preg_replace('/<img\s+/i', '<img loading="lazy" decoding="async" ', $img, 1);
                }
                preg_match('/alt=["\']([^"\']*)["\']/i', $img, $altMatch);
                $caption = !empty($altMatch[1])
                    ? '<figcaption>' . htmlspecialchars($altMatch[1], ENT_QUOTES, 'UTF-8') . '</figcaption>'
                    : '';
                $html .= '<figure class="gallery-item">' . $img . $caption . '</figure>';
            }
            $html .= '</div>';
            return $html;
        },
        $content
    );

    $content = (string)preg_replace_callback(
        '/<p>\s*(<img[^>]+>)\s*<\/p>/i',
        function ($matches) {
            $img = $matches[1];
            if (stripos($img, 'loading=') === false) {
                $img = (string)preg_replace('/<img\s+/i', '<img loading="lazy" decoding="async" ', $img, 1);
            }
            preg_match('/alt=["\']([^"\']*)["\']/i', $img, $altMatch);
            $caption = !empty($altMatch[1])
                ? '<figcaption>' . htmlspecialchars($altMatch[1], ENT_QUOTES, 'UTF-8') . '</figcaption>'
                : '';
            return '<figure class="article-figure">' . $img . $caption . '</figure>';
        },
        $content
    );

    $content = (string)preg_replace_callback(
        '/<a\s+([^>]*href=["\']https?:\/\/[^"\']+["\'][^>]*)>/i',
        function ($matches) {
            $attrs = $matches[1];
            if (stripos($attrs, 'target=') === false) {
                $attrs .= ' target="_blank"';
            }
            if (stripos($attrs, 'rel=') === false) {
                $attrs .= ' rel="noopener noreferrer"';
            }
            return "<a {$attrs}>";
        },
        $content
    );

    return $content;
}

/**
 * 解析评论者 User-Agent（操作系统 + 浏览器）
 */
function parseUserAgent($agent) {
    $agent = (string)$agent;
    $os = 'Unknown OS';
    $osIcon = '💻';

    if (preg_match('/macintosh|mac os x/i', $agent)) {
        $os = 'macOS';
        $osIcon = '🍎';
    } elseif (preg_match('/iphone|ipad|ipod/i', $agent)) {
        $os = 'iOS';
        $osIcon = '📱';
    } elseif (preg_match('/android/i', $agent)) {
        $os = 'Android';
        $osIcon = '🤖';
    } elseif (preg_match('/windows nt 10|windows nt 11/i', $agent)) {
        $os = 'Windows 11/10';
        $osIcon = '🪟';
    } elseif (preg_match('/linux/i', $agent)) {
        $os = 'Linux';
        $osIcon = '🐧';
    }

    $browser = 'Browser';
    if (preg_match('/Edg/i', $agent)) {
        $browser = 'Edge';
    } elseif (preg_match('/OPR|Opera/i', $agent)) {
        $browser = 'Opera';
    } elseif (preg_match('/Chrome/i', $agent)) {
        $browser = 'Chrome';
    } elseif (preg_match('/Firefox/i', $agent)) {
        $browser = 'Firefox';
    } elseif (preg_match('/Safari/i', $agent) && !preg_match('/Chrome/i', $agent)) {
        $browser = 'Safari';
    }

    return ['os' => $os, 'osIcon' => $osIcon, 'browser' => $browser];
}

/**
 * 获取全站文章统计及热力图 JSON 数据（单请求静态缓存提升响应性能）
 */
function getArchiveAnalytics() {
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }

    try {
        $db = Typecho_Db::get();
        $posts = $db->fetchAll(
            $db->select('cid', 'title', 'created', 'text')
                ->from('table.contents')
                ->where('type = ? AND status = ?', 'post', 'publish')
                ->order('created', Typecho_Db::SORT_DESC)
        );
    } catch (Exception $e) {
        $posts = [];
    }

    $heatmap = [];
    $yearsMap = [(int)date('Y') => true];
    $totalWords = 0;

    foreach ($posts as $p) {
        $created = intval($p['created']);
        $date = date('Y-m-d', $created);
        $yr = (int)date('Y', $created);
        $yearsMap[$yr] = true;
        $stats = getReadingStats($p['text']);
        $totalWords += $stats['words'];

        if (!isset($heatmap[$date])) {
            $heatmap[$date] = ['count' => 0, 'words' => 0];
        }
        $heatmap[$date]['count'] += 1;
        $heatmap[$date]['words'] += $stats['words'];
    }

    $years = array_keys($yearsMap);
    rsort($years);

    $cached = [
        'totalPosts' => count($posts),
        'totalWords' => $totalWords,
        'years' => $years,
        'heatmapJson' => json_encode($heatmap, JSON_UNESCAPED_UNICODE) ?: '{}'
    ];

    return $cached;
}
