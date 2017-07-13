<?php echo $header; ?><?php echo $column_left; ?>
<div id="content">
  <div class="page-header">
    <div class="container-fluid">
      <div class="pull-right">
        <button type="submit" form="form-banner" data-toggle="tooltip"  class="btn btn-primary"><i class="fa fa-save"></i></button>
        <a href="<?php echo $cancel; ?>" data-toggle="tooltip"  class="btn btn-default"><i class="fa fa-reply"></i></a></div>
      <h1><?php echo $heading_title; ?></h1>
      <ul class="breadcrumb">
        <?php foreach ($breadcrumbs as $breadcrumb) { ?>
        <li><a href="<?php echo $breadcrumb['href']; ?>"><?php echo $breadcrumb['text']; ?></a></li>
        <?php } ?>
      </ul>
    </div>
  </div>
  <div class="container-fluid">
    <?php if ($error_warning) { ?>
      <div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> <?php echo $error_warning; ?>
        <button type="button" class="close" data-dismiss="alert">&times;</button>
      </div>
    <?php } ?>
    <div class="panel panel-default">
      <div class="panel-body">
        <form action="<?php echo $action; ?>" method="post" enctype="multipart/form-data" id="form-banner" class="form-horizontal">
          <div>Выберите файл  <input type="file" name="parse_file"></div>
          <div>
            <select name='type'>
              <option value='alenka'>AlenkaPlus</option>
            </select>
          </div>
          <div>
            <select name='attribute_group'>
               <?php foreach($attribute_groups as $attribute_groups) { ?>
              <option value='<?php echo $attribute_groups["attribute_group_id"]; ?>'><?php echo $attribute_groups["name"]; ?></option>
              <?php } ?>
            </select>
          </div>
          <div><select name='category_id'>
              <?php foreach($categories as $category) { ?>
              <option value='<?php echo $category["category_id"]; ?>'><?php echo $category["name"]; ?></option>
              <?php } ?>
          </select></div>
          <button type="submit" class="btn btn-primary">Загрузить</button>
        </form>
      </div>
    </div>
  </div>
</div>
<?php echo $footer; ?>