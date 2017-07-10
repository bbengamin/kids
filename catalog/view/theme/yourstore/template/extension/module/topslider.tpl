<section class="content offset-top-0 <?php echo ($layoutid == 4 ? 'intro tp-banner-button1' : ($layoutid == 5 || $layoutid == 10 ? 'tp-banner-button1 slider-layout-3' : ($layoutid == 6 ? 'tp-banner-button1 slider-layout-5' : ''))); ?>" id="slider">
  <?php if ($heading_title) { ?>
    <h2 class="hidden"><?php echo $heading_title; ?></h2>
  <?php } ?>
    <div class="tp-banner-container <?php echo ($layoutid == 2 ? 'slider-layout-2' : ''); ?>">
        <div class="tp-banner">
            <?php echo $html; ?>
        </div>
    </div>
</section>

<script type="text/javascript" src="catalog/view/theme/<?php echo $theme; ?>/external/rs-plugin/js/jquery.themepunch.tools.min.js"></script>

<?php if ($layoutid != 4) { ?>
<script type="text/javascript" src="catalog/view/theme/<?php echo $theme; ?>/js/revolution_ini.js"></script>
<?php } else { ?>
<script type="text/javascript" src="catalog/view/theme/<?php echo $theme; ?>/js/revolution_ini4.js"></script>

<?php }  ?>
