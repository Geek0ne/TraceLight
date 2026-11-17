<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');
?>

<div class="container narrow-container">
    <article class="post-main">
        <header class="page-hero">
            <h1><?php $this->title(); ?></h1>
        </header>
        <div class="bento-card markdown-body">
            <?php echo parseEnhancedContent($this->content); ?>
        </div>
        <?php $this->need('comments.php'); ?>
    </article>
</div>

<?php $this->need('footer.php'); ?>
