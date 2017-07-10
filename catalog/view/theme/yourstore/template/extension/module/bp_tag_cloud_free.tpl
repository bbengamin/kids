<?php if ($tags): ?>
<div class="collapse-block open">
    <h4 class="collapse-block__title"><?php echo $heading_title; ?></h4>
    <div class="collapse-block__content">
        <ul class="tags-list">
            <?php
                foreach ($tags as $tag) :
                    echo '<li><a href="'.$tag['href'].'" class="'.$tag['class'].'" style="'.$tag['style'].'">'.$tag['tag'].($show_count ? '('.$tag['count'].')' : '').'</a></li>';
                endforeach;
            ?>
        </ul>
    </div>
</div>
<?php endif; ?>