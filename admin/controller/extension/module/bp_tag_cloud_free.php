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

    private $error = array();

    public function index() {
        $this->load->language('extension/module/bp_tag_cloud_free');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('extension/module');

        if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validate()) {
            if (!isset($this->request->get['module_id'])) {
                $this->model_extension_module->addModule('bp_tag_cloud_free', $this->request->post);
            } else {
                $this->model_extension_module->editModule($this->request->get['module_id'], $this->request->post);
            }

            $this->cache->delete('product');

            $this->session->data['success'] = $this->language->get('text_success');

			$this->response->redirect($this->url->link('extension/extension', 'token=' . $this->session->data['token'] . '&type=module', true));
        }

        $data['heading_title'] = $this->language->get('heading_title');

        $data['text_edit'] = $this->language->get('text_edit');
        $data['text_enabled'] = $this->language->get('text_enabled');
        $data['text_disabled'] = $this->language->get('text_disabled');

        $data['entry_name'] = $this->language->get('entry_name');
        $data['entry_limit'] = $this->language->get('entry_limit');
        $data['entry_limit_type'] = $this->language->get('entry_limit_type');
        $data['entry_class'] = $this->language->get('entry_class');
        $data['entry_style'] = $this->language->get('entry_style');
        $data['entry_show_count'] = $this->language->get('entry_show_count');
        $data['tt_style'] = $this->language->get('tt_style');
        $data['tt_show_count'] = $this->language->get('tt_show_count');
        $data['entry_type_1'] = $this->language->get('entry_type_1');
        $data['entry_type_2'] = $this->language->get('entry_type_2');

        $data['entry_max_font_size'] = $this->language->get('entry_max_font_size');
        $data['tt_max_font_size'] = $this->language->get('tt_max_font_size');
        $data['entry_status'] = $this->language->get('entry_status');

        $data['button_save'] = $this->language->get('button_save');
        $data['button_cancel'] = $this->language->get('button_cancel');

        if (isset($this->error['warning'])) {
            $data['error_warning'] = $this->error['warning'];
        } else {
            $data['error_warning'] = '';
        }

        if (isset($this->error['name'])) {
            $data['error_name'] = $this->error['name'];
        } else {
            $data['error_name'] = '';
        }
        
        if (isset($this->error['max_font_size'])) {
            $data['error_max_font_size'] = $this->error['max_font_size'];
        } else {
            $data['error_max_font_size'] = '';
        }

        $data['breadcrumbs'] = array();

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/dashboard', 'token=' . $this->session->data['token'], true)
        );

        $data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_extension'),
			'href' => $this->url->link('extension/extension', 'token=' . $this->session->data['token'] . '&type=module', true)
        );

        if (!isset($this->request->get['module_id'])) {
            $data['breadcrumbs'][] = array(
                'text' => $this->language->get('heading_title'),
				'href' => $this->url->link('extension/module/bp_tag_cloud_free', 'token=' . $this->session->data['token'], true)
            );
        } else {
            $data['breadcrumbs'][] = array(
                'text' => $this->language->get('heading_title'),
				'href' => $this->url->link('extension/module/bp_tag_cloud_free', 'token=' . $this->session->data['token'] . '&module_id=' . $this->request->get['module_id'], true)
            );
        }

        if (!isset($this->request->get['module_id'])) {
			$data['action'] = $this->url->link('extension/module/bp_tag_cloud_free', 'token=' . $this->session->data['token'], true);
        } else {
			$data['action'] = $this->url->link('extension/module/bp_tag_cloud_free', 'token=' . $this->session->data['token'] . '&module_id=' . $this->request->get['module_id'], true);
        }

		$data['cancel'] = $this->url->link('extension/extension', 'token=' . $this->session->data['token'] . '&type=module', true);

        if (isset($this->request->get['module_id']) && ($this->request->server['REQUEST_METHOD'] != 'POST')) {
            $module_info = $this->model_extension_module->getModule($this->request->get['module_id']);
        }

        if (isset($this->request->post['name'])) {
            $data['name'] = $this->request->post['name'];
        } elseif (!empty($module_info)) {
            $data['name'] = $module_info['name'];
        } else {
            $data['name'] = '';
        }

        if (isset($this->request->post['limit'])) {
            $data['limit'] = $this->request->post['limit'];
        } elseif (!empty($module_info)) {
            $data['limit'] = $module_info['limit'];
        } else {
            $data['limit'] = 10;
        }

        if (isset($this->request->post['limit_type'])) {
            $data['limit_type'] = $this->request->post['limit_type'];
        } elseif (!empty($module_info)) {
            $data['limit_type'] = $module_info['limit_type'];
        } else {
            $data['limit_type'] = 1;
        }

        if (isset($this->request->post['class'])) {
            $data['class'] = $this->request->post['class'];
        } elseif (!empty($module_info)) {
            $data['class'] = $module_info['class'];
        } else {
            $data['class'] = 'btn btn-primary';
        }

        if (isset($this->request->post['style'])) {
            $data['style'] = $this->request->post['style'];
        } elseif (!empty($module_info)) {
            $data['style'] = $module_info['style'];
        } else {
            $data['style'] = 'margin:2px;';
        }

        if (isset($this->request->post['style'])) {
            $data['style'] = $this->request->post['style'];
        } elseif (!empty($module_info)) {
            $data['style'] = $module_info['style'];
        } else {
            $data['style'] = 'margin:2px;';
        }

        if (isset($this->request->post['show_count'])) {
            $data['show_count'] = $this->request->post['show_count'];
        } elseif (!empty($module_info) && isset($module_info['show_count'])) {
            $data['show_count'] = true;
        } else {
            $data['show_count'] = false;
        }

        if (isset($this->request->post['max_font_size'])) {
            $data['max_font_size'] = $this->request->post['max_font_size'];
        } elseif (!empty($module_info) && isset($module_info['max_font_size'])) {
            $data['max_font_size'] = $module_info['max_font_size'];
        } else {
            $data['max_font_size'] = 2;
        }
        
        if (isset($this->request->post['status'])) {
            $data['status'] = $this->request->post['status'];
        } elseif (!empty($module_info)) {
            $data['status'] = $module_info['status'];
        } else {
			$data['status'] = '';
        }

        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');

        $this->response->setOutput($this->load->view('extension/module/bp_tag_cloud_free.tpl', $data));
    }

    protected function validate() {
        if (!$this->user->hasPermission('modify', 'extension/module/bp_tag_cloud_free')) {
            $this->error['warning'] = $this->language->get('error_permission');
        }

        if ((utf8_strlen($this->request->post['name']) < 3) || (utf8_strlen($this->request->post['name']) > 64)) {
            $this->error['name'] = $this->language->get('error_name');
        }

        if ( !(is_numeric($this->request->post['max_font_size']) && $this->request->post['max_font_size'] > 0)) {
			$this->error['max_font_size'] = $this->language->get('error_max_font_size');
		}
        
        return !$this->error;
    }

}




/* Filename: bp_tag_cloud_free.php */
/* Filepath: ./admin/controller/extension/module/bp_tag_cloud_free.php */