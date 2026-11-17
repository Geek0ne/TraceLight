<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>

<?php function threadedComments($comments, $options) {
    $commentClass = 'comment-item';
    if ($comments->authorId) {
        if ($comments->authorId == $comments->ownerId) {
            $commentClass .= ' comment-by-author';
        } else {
            $commentClass .= ' comment-by-user';
        }
    }
    $ua = parseUserAgent($comments->agent);
?>
<li id="li-<?php $comments->theId(); ?>" class="<?php echo $commentClass; ?>">
    <div id="<?php $comments->theId(); ?>" class="comment-body bento-card">
        <div class="comment-avatar">
            <?php $comments->gravatar('40', ''); ?>
        </div>
        <div class="comment-main">
            <div class="comment-header">
                <div class="comment-author-info">
                    <span class="comment-author"><?php $comments->author(); ?></span>
                    <?php if ($comments->authorId && $comments->authorId == $comments->ownerId): ?>
                        <span class="badge-admin mono">BLOGGER</span>
                    <?php endif; ?>
                    <span class="badge-ua mono" title="<?php echo htmlspecialchars((string)$comments->agent, ENT_QUOTES, 'UTF-8'); ?>">
                        <?php echo $ua['osIcon'] . ' ' . $ua['os'] . ' · ' . $ua['browser']; ?>
                    </span>
                </div>
                <div class="comment-meta mono">
                    <time><?php $comments->date('Y-m-d H:i'); ?></time>
                    <span class="comment-reply-btn"><?php $comments->reply('回复'); ?></span>
                </div>
            </div>
            <div class="comment-content">
                <?php $comments->content(); ?>
            </div>
        </div>
    </div>
    <?php if ($comments->children): ?>
    <div class="comment-children">
        <?php $comments->threadedComments($options); ?>
    </div>
    <?php endif; ?>
</li>
<?php } ?>

<section id="comments" class="comments-section">
    <?php $this->comments()->to($comments); ?>
    <h3 class="section-title"><span class="mono accent">#</span> 讨论与交流 (<?php $this->commentsNum(_t('0'), _t('1'), _t('%d')); ?>)</h3>

    <?php if ($this->allow('comment')): ?>
    <div id="<?php $this->respondId(); ?>" class="bento-card respond-box">
        <div class="respond-header">
            <span class="mono muted">发表评论 · 支持基础 Markdown</span>
            <div class="cancel-comment-reply"><?php $comments->cancelReply('取消回复'); ?></div>
        </div>
        <form method="post" action="<?php $this->commentUrl(); ?>" id="comment-form" role="form" class="comment-form">
            <?php if ($this->user->hasLogin()): ?>
                <p class="logged-in-tip mono">
                    当前身份：<a href="<?php $this->options->profileUrl(); ?>"><?php $this->user->screenName(); ?></a> · <a href="<?php $this->options->logoutUrl(); ?>">退出</a>
                </p>
            <?php else: ?>
                <div class="comment-inputs-grid">
                    <input type="text" name="author" id="author" placeholder="昵称 *" value="<?php $this->remember('author'); ?>" required>
                    <input type="email" name="mail" id="mail" placeholder="邮箱 * (用于 Gravatar 头像)" value="<?php $this->remember('mail'); ?>" <?php if ($this->options->commentsRequireMail): ?>required<?php endif; ?>>
                    <input type="url" name="url" id="url" placeholder="个人站点 https:// (选填)" value="<?php $this->remember('url'); ?>">
                </div>
            <?php endif; ?>
            <textarea name="text" id="textarea" rows="4" placeholder="写下你的技术意见或疑问..." required><?php $this->remember('text'); ?></textarea>
            <div class="comment-submit-row">
                <div class="comment-submit-meta">
                    <span class="mono text-xs muted">文明交流，UA 设备标识将自动脱敏展示</span>
                    <span class="comment-feedback mono text-xs" id="commentStatusFeedback" aria-live="polite"></span>
                </div>
                <div class="comment-submit-actions">
                    <div class="emoji-picker-wrap" id="emojiPickerWrap">
                        <button type="button" id="emojiPickerToggle" class="emoji-toggle-btn" aria-expanded="false" aria-controls="commentEmojiPopover" title="选择评论表情">
                            <span aria-hidden="true">😊</span>
                            <span>表情</span>
                        </button>
                        <div class="emoji-popover" id="commentEmojiPopover" role="dialog" aria-label="输入法风格表情面板">
                            <?php
                                $emojiCategories = [
                                    'smileys' => [
                                        'icon' => '😄',
                                        'label' => '表情',
                                        'items' => ['😄','😁','😂','🤣','😊','😍','🥰','😘','🤔','🤨','😎','🤩','🥳','🥹','😅','😭','😤','😮','😱','😴','🤯','🫠','🫡','😏']
                                    ],
                                    'gestures' => [
                                        'icon' => '👍',
                                        'label' => '手势',
                                        'items' => ['👍','👎','👏','🙌','🤝','🙏','💪','👌','✌️','🤞','🫰','🫶','👋','🤚','👉','👆','👀','🧠','💯','🔥','❤️','🧡','💙','✨']
                                    ],
                                    'tech' => [
                                        'icon' => '🚀',
                                        'label' => '极客',
                                        'items' => ['🚀','💻','⌨️','🖥️','⚡','🛠️','⚙️','🔧','🐛','🔒','🔑','📦','🐳','🦀','🐍','📡','🧪','📊','🎯','📌','💡','✅','⚠️','🎉']
                                    ],
                                    'nature' => [
                                        'icon' => '🌿',
                                        'label' => '自然',
                                        'items' => ['🌟','🌙','☀️','🌈','❄️','🌊','🌸','🌿','🍀','🌵','🌲','🏔️','🌌','🪐','🐱','🐶','🦊','🐼','🦉','🦋','🐝','🐢','🐬','🐳']
                                    ],
                                    'life' => [
                                        'icon' => '☕',
                                        'label' => '日常',
                                        'items' => ['☕','🍵','🧋','🍺','🍕','🍔','🍜','🍰','🎵','🎧','🎮','📚','📝','📷','✈️','🚗','🏠','⏰','🎁','🎈','🏆','🥇','💎','🛸']
                                    ]
                                ];
                            ?>
                            <div class="emoji-popover-head mono text-xs muted">
                                <span>全部表情 (120)</span>
                                <span>ESC 关闭</span>
                            </div>
                            <div class="emoji-tabs" role="tablist" aria-label="表情分类">
                                <?php $firstTab = true; foreach ($emojiCategories as $catId => $cat): ?>
                                    <button type="button" class="emoji-tab<?php if ($firstTab) echo ' active'; ?>" role="tab" aria-selected="<?php echo $firstTab ? 'true' : 'false'; ?>" data-emoji-cat="<?php echo $catId; ?>">
                                        <span aria-hidden="true"><?php echo $cat['icon']; ?></span>
                                        <span><?php echo $cat['label']; ?></span>
                                    </button>
                                <?php $firstTab = false; endforeach; ?>
                            </div>
                            <?php $firstPanel = true; foreach ($emojiCategories as $catId => $cat): ?>
                                <div class="emoji-panel<?php if ($firstPanel) echo ' active'; ?>" data-emoji-panel="<?php echo $catId; ?>">
                                    <div class="emoji-grid">
                                        <?php foreach ($cat['items'] as $em): ?>
                                            <button type="button" class="emoji-btn" data-emoji="<?php echo $em; ?>" aria-label="插入表情 <?php echo $em; ?>" title="插入 <?php echo $em; ?>"><?php echo $em; ?></button>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php $firstPanel = false; endforeach; ?>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary" id="commentSubmitBtn">发送评论 →</button>
                </div>
            </div>
        </form>
    </div>
    <?php else: ?>
        <p class="muted mono">当前文章已关闭评论。</p>
    <?php endif; ?>

    <?php if ($comments->have()): ?>
        <ol class="comment-list">
            <?php $comments->listComments(); ?>
        </ol>
        <div class="pagination-wrap">
            <?php $comments->pageNav('←', '→'); ?>
        </div>
    <?php endif; ?>
</section>
