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

class ControllerExtensionModuleBPTagCloudFree extends Controller {

    public function index($setting) {
        $this->load->language('extension/module/bp_tag_cloud_free');

        $data['heading_title'] = $this->language->get('heading_title');

        if (isset($setting['limit'])) {
            $limit = $setting['limit'];
        } else {
            $limit = 10;
        }

        if (isset($setting['limit_type'])) {
            $limit_mode = $setting['limit_type'];
        } else {
            $limit_mode = 1; // 1 = top, 2 = random
        }

        if (isset($setting['class'])) {
            $class = $setting['class'];
        } else {
            $class = '';
        }

        if (isset($setting['style'])) {
            $style = $setting['style'];
        } else {
            $style = '';
        }
        
        if (isset($setting['max_font_size'])) {
            $max_font_size = $setting['max_font_size'];
        } else {
            $max_font_size = 2;
        }

        if (isset($setting['show_count'])) {
            $show_count = $setting['show_count'];
        } else {
            $show_count = false;
        }


        $sQuery = 'SELECT 
pd.`product_id`,
pd.`tag`,
p.status

FROM `'. DB_PREFIX .'product_description` AS pd

LEFT JOIN `' .DB_PREFIX. 'product` AS p 
ON (p.product_id = pd.`product_id`)
WHERE NOT TRIM(tag) = "" 
AND p.status = 1
AND pd.`language_id` = '. (int)$this->config->get('config_language_id');
        $result = $this->db->query($sQuery);

        if ($result->num_rows) {
            $result_array = $result->rows;

            $raw_tags = array();
            $tags_ = array();
            $tags = array();

            foreach ($result_array as $row) {
                foreach (explode(',', $row['tag']) as $tag) {
                    $raw_tags[] = mb_strtolower(trim($tag));
                }
            }
            $tags_ = array_count_values($raw_tags);

            /* apply limit here */
            if ($limit_mode == 1) {
                arsort($tags_);
                $filtered_tags = array_slice($tags_, 0, $limit, 0);
            } else if ($limit_mode == 2) {
                $this->shuffle_assoc($tags_);
                $filtered_tags = array_slice($tags_, 0, $limit, 0);
                arsort($filtered_tags);
            }

             /* algorithm to change appearance based on tag count (popularity) */
            // we increase font size in em for all tags with count over 1 by 10% for each count
            // //$font_size = 1 + $count / 200;
            // 
            // for larger stores , clamp count to groups of say 50 and apply size change to that value
            //      e.g. tags count [1-50] > font size 1
            //      tags count [50-100] > font size 1.2
            //      etc. ...
            // 
            // make this automatic - calculate neccessary params
            //$max_font_size = 2; // em
            $round_precision = 4; // decimal places for round() function !NOTE! Low values may result in "Devision by 0" error
            $max_count_val = max($filtered_tags);
            $tags_count = count($filtered_tags);
            $group_range = round($max_count_val / $tags_count, $round_precision);
            $ratio = round(($max_font_size - 1) / (max($filtered_tags) / $group_range), $round_precision);
            
            foreach ($filtered_tags as $tag => $count) {
                $font_size = 1;
                if ($count > 1) {
                     $count_index = round($count /  round($max_count_val / $tags_count, $round_precision));
                     $font_size = 1 + $count_index * $ratio;   
                }

                /* algorithm end */

                $tags[] = array(
                    'tag' => $tag,
                    'count' => $count,
                    'href' => $this->url->link('product/search', 'tag=' . $tag),
                    'style' => $style . ' font-size: ' . $font_size . 'em;',
                    'class' => $class
                );
            }

            $data['show_count'] = $show_count;
            $data['tags'] = $tags;

            return $this->load->view('extension/module/bp_tag_cloud_free.tpl', $data);
        }
    }

    private function shuffle_assoc(&$list) {
        if (!is_array($list))
            return $list;

        $keys = array_keys($list);
        shuffle($keys);
        $random = array();
        foreach ($keys as $key)
            $random[$key] = $list[$key];

        $list = $random;
    }

}




/* Filename: bp_tag_cloud_free.php */
/* Filepath: ./catalog/controller/extension/module/bp_tag_cloud_free.php */