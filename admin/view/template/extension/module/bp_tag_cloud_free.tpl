<?php
/**
 * BP Tag Cloud Free
 * Opencart 2 extension
 * @version 1.0.2
 * @compat  Opencart v2.3.0.2
 * @date 2016-08-16
 * @author Andrei Roslovtsev <opencart-mods@bytes-and-pixels.com>
 * @license GPLv2
 */
echo $header; ?><?php echo $column_left; ?>
<div id="content">
    <div class="page-header">
        <div class="container-fluid">
            <div class="pull-right">
                <button type="submit" form="form-latest" data-toggle="tooltip" title="<?php echo $button_save; ?>" class="btn btn-primary"><i class="fa fa-save"></i></button>
                <a href="<?php echo $cancel; ?>" data-toggle="tooltip" title="<?php echo $button_cancel; ?>" class="btn btn-default"><i class="fa fa-reply"></i></a></div>
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
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fa fa-pencil"></i> <?php echo $text_edit; ?></h3>
            </div>
            <div class="panel-body">
                <form action="<?php echo $action; ?>" method="post" enctype="multipart/form-data" id="form-latest" class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-name"><?php echo $entry_name; ?></label>
                        <div class="col-sm-10">
                            <input type="text" name="name" value="<?php echo $name; ?>" placeholder="<?php echo $entry_name; ?>" id="input-name" class="form-control" />
                            <?php if ($error_name) { ?>
                                <div class="text-danger"><?php echo $error_name; ?></div>
                            <?php } ?>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-limit"><?php echo $entry_limit; ?></label>
                        <div class="col-sm-10">
                            <input type="text" name="limit" value="<?php echo $limit; ?>" placeholder="<?php echo $entry_limit; ?>" id="input-limit" class="form-control" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-limit"><?php echo $entry_limit_type; ?></label>
                        <div class="col-sm-10">
                            <select  name="limit_type" id="input-limit-type" class="form-control" >
                                <?php if ($limit_type == 1) { ?>
                                    <option value="1" selected="selected"><?php echo $entry_type_1; ?></option>
                                    <option value="2" ><?php echo $entry_type_2; ?></option>
                                <?php } else { ?>
                                    <option value="1" ><?php echo $entry_type_1; ?></option>
                                    <option value="2" selected="selected"><?php echo $entry_type_2; ?></option>
                                <?php } ?>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-class"><?php echo $entry_class; ?></label>
                        <div class="col-sm-10">
                            <input type="text" name="class" value="<?php echo $class; ?>" placeholder="<?php echo $entry_class; ?>" id="input-class" class="form-control" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-style"><?php echo $entry_style; ?>
                        <span data-toggle="tooltip" title="<?php echo $tt_style; ?>"></span>
                        </label>
                        <div class="col-sm-10">
                            <input type="text" name="style" value="<?php echo $style; ?>" placeholder="<?php echo $entry_style; ?>" id="input-style" class="form-control" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-show-count"><?php echo $entry_show_count; ?>
                         <span data-toggle="tooltip" title="<?php echo $tt_show_count; ?>"></span>
                        </label>
                        <div class="col-sm-10">
                            <?php $checked = $show_count ? 'checked' : ''; ?>
                            <input type="checkbox" <?php echo $checked; ?> name="show_count" value="<?php echo $entry_show_count; ?>"  id="input-show-count" class="form-control" style="top:10px;"/>
                        </div>
                    </div>
                    
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-max-font-size"><?php echo $entry_max_font_size; ?>
                         <span data-toggle="tooltip" title="<?php echo $tt_max_font_size; ?>"></span>
                        </label>
                        <div class="col-sm-10">
                            <input type="number" min="1" max="9" name="max_font_size" value="<?php echo $max_font_size; ?>"  id="input-max-font-size" class="form-control" style="top:10px;"/>
                            <?php if ($error_max_font_size) { ?>
                                <div class="text-danger"><?php echo $error_max_font_size; ?></div>
                            <?php } ?>
                        </div>
                    </div>


                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-status"><?php echo $entry_status; ?></label>
                        <div class="col-sm-10">
                            <select name="status" id="input-status" class="form-control">
                                <?php if ($status) { ?>
                                    <option value="1" selected="selected"><?php echo $text_enabled; ?></option>
                                    <option value="0"><?php echo $text_disabled; ?></option>
                                <?php } else { ?>
                                    <option value="1"><?php echo $text_enabled; ?></option>
                                    <option value="0" selected="selected"><?php echo $text_disabled; ?></option>
                                <?php } ?>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<?php echo $footer;





/* Filename: bp_tag_cloud_free.tpl */
/* Filepath: ./admin/view/template/extension/module/bp_tag_cloud_free.tpl */