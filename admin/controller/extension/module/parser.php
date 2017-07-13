<?php
class ControllerExtensionModuleParser extends Controller {
	private $error = array();

	public function index() {
		error_reporting(E_ALL);
		ini_set('display_errors', TRUE);
		ini_set('display_startup_errors', TRUE);


		$this->document->setTitle("Парсер продуктов");

		$this->load->model('extension/module');
		$this->load->model('catalog/category');
		$this->load->model('catalog/attribute_group');

		$data['error_warning'] = false;
		if (($this->request->server['REQUEST_METHOD'] == 'POST')) {
			switch($this->request->post['type']){
				case "alenka": 
					$count = $this->parseFileAlenka();
				break;
			}
			

			$data['error_warning'] = "Обработано " . $count . " строк";
			//$this->response->redirect($this->url->link('extension/module/parser', 'token=' . $this->session->data['token'], true));
		}
		$data['heading_title'] = "Парсер продуктов";

		$data['breadcrumbs'] = array();

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/dashboard', 'token=' . $this->session->data['token'], true)
		);

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_extension'),
			'href' => $this->url->link('extension/module', 'token=' . $this->session->data['token'] . '&type=module', true)
		);

		$data['breadcrumbs'][] = array(
			'text' => "Парсер продуктов",
			'href' => $this->url->link('extension/module/parser', 'token=' . $this->session->data['token'], true)
		);
		
		$data['attribute_groups'] = array();
		$results = $this->model_catalog_attribute_group->getAttributeGroups();
		foreach ($results as $result) {
			$data['attribute_groups'][] = array(
				'attribute_group_id' => $result['attribute_group_id'],
				'name' => $result['name']
			);
		}
		
		$data['categories'] = array();
		$results = $this->model_catalog_category->getCategories();
		foreach ($results as $result) {
			$data['categories'][] = array(
				'category_id' => $result['category_id'],
				'name'        => $result['name'],
			);
		}
		

		$data['action'] = $this->url->link('extension/module/parser', 'token=' . $this->session->data['token'], true);
		$data['cancel'] = $this->url->link('extension/module', 'token=' . $this->session->data['token'] . '&type=module', true);


		$data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');
		
		$this->response->setOutput($this->load->view('extension/module/parser', $data));
	}

	private function parseFileAlenka() {
		
		require_once DIR_SYSTEM . 'phpexcel/PHPExcel/IOFactory.php';
        
   		$objPHPExcel = PHPExcel_IOFactory::load($_FILES['parse_file']['tmp_name']);


		foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
		    $data = $worksheet->toArray();
		}
		unset($data[0]);
		unset($data[1]);
		$dd = 0;

		$this->db->query("UPDATE oc_product SET status=0");

		$category_id = $this->request->post['category_id'];
		$attribute_group = $this->request->post['attribute_group'];
		foreach ($data as $row) {
			// PRODUCT
			
			$url = $row[0];
			$model = md5($url);
			$name = $row[1];
			$from = $this->request->post['type'];
			$price = (float)((float)$row[2] * 2);
			$size_text = $row[3];
			$main_image = $row[4];
			$manufacturer = $row[5];
			$description = $row[6];
			
			$in_db = $this->db->query("SELECT product_id FROM oc_product WHERE url LIKE '" . $this->db->escape($url) . "'");
			
			if($in_db->num_rows > 0){
				$product_id = $in_db->row['product_id'];
				
				$this->db->query("UPDATE oc_product SET price=" . (int)$price . ", status=1, mainsize='default', `from`='" . $this->db->escape($from) . "', `url`='"  . $this->db->escape($url) . "', stock_status_id=7 WHERE product_id='" . (int)$product_id . "'");
			}else{
				$in_db_manifacturer = $this->db->query("SELECT * FROM oc_manufacturer WHERE name LIKE '" . $this->db->escape($manufacturer) . "'");
				if($in_db_manifacturer->num_rows > 0){
					$manufacturer_id = $in_db_manifacturer->row['manufacturer_id'];
				}else{
					$manufacturer_id = $this->createManufacturer($manufacturer);
				}
				
				$db_image_name = $this->loadImage($model, $main_image);
				
				$this->db->query("INSERT INTO oc_product SET model='" . $model . "', mainsize='default', quantity='100', `from`='" . $this->db->escape($from) . "', `url`='"  . $this->db->escape($url) . "', price='" . $price . "', stock_status_id=7, manufacturer_id=" . (int)$manufacturer_id . ", image='" . $db_image_name . "', status=1, sort_order=100");

				$product_id = $this->db->getLastId();
			
				$this->db->query("DELETE FROM oc_product_description WHERE product_id = '" . (int)$product_id . "'");
				$this->db->query("INSERT INTO oc_product_description SET product_id='" . $product_id . "', language_id=1, name='" . $this->db->escape($name) . "', description='', meta_title='" . $this->db->escape($name) . "'");
				$this->db->query("INSERT INTO oc_product_description SET product_id='" . $product_id . "', language_id=2, name='" . $this->db->escape($name) . "', description='', meta_title='" . $this->db->escape($name) . "'");
				
				$this->db->query("DELETE FROM oc_product_to_layout WHERE product_id = '" . (int)$product_id . "'");
				$this->db->query("INSERT INTO oc_product_to_layout SET product_id='" . $product_id . "', store_id='0', layout_id='0'");

				$this->db->query("DELETE FROM oc_product_to_store WHERE product_id = '" . (int)$product_id . "'");
				$this->db->query("INSERT INTO oc_product_to_store SET product_id='" . $product_id . "', store_id='0'");
				
				$this->db->query("DELETE FROM " . DB_PREFIX . "url_alias WHERE query = 'product_id=" . (int)$product_id . "'");
				$this->db->query("INSERT INTO " . DB_PREFIX . "url_alias SET query = 'product_id=" . (int)$product_id . "', keyword = '" . $this->db->escape(strtolower($this->translit($name))) . "'");

				$this->db->query("DELETE FROM oc_product_to_category WHERE product_id = '" . (int)$product_id . "'");							
				$this->db->query("INSERT INTO oc_product_to_category SET product_id='" . $product_id . "', category_id='" . $category_id . "'");
				
			}
			$this->parseSize($product_id, $size_text);
			$this->parseAttributes($product_id, $description, $attribute_group);
			
			$dd++;
		}
		return count($data);	
	}
	
	private function parseAttributes($product_id, $attribute_text, $attribute_group){
		
		$this->db->query("DELETE FROM oc_product_attribute WHERE product_id = '" . (int)$product_id . "'");
		$rows = explode("\n", $attribute_text);
		foreach($rows as $row){
			$pair = explode(":", $row);
			
			$in_db_attribute = $this->db->query("SELECT * FROM oc_attribute_description WHERE name LIKE '" . $this->db->escape($pair[0]) . "'");
			if($in_db_attribute->num_rows > 0){
				$attribute_id = $in_db_attribute->row['attribute_id'];
			}else{
				$this->db->query("INSERT INTO oc_attribute SET attribute_group_id = '" . (int)$attribute_group . "', sort_order = '0'");
		
				$attribute_id = $this->db->getLastId();
	
				$this->db->query("INSERT INTO oc_attribute_description SET attribute_id = '" . (int)$attribute_id . "', language_id = 1, name = '" . $this->db->escape($pair[0]) . "'");
				$this->db->query("INSERT INTO oc_attribute_description SET attribute_id = '" . (int)$attribute_id . "', language_id = 2, name = '" . $this->db->escape($pair[0]) . "'");
			}
			
			$this->db->query("DELETE FROM " . DB_PREFIX . "product_attribute WHERE product_id = '" . (int)$product_id . "' AND attribute_id = '" . (int)$attribute_id . "'");
			
			$this->db->query("INSERT INTO " . DB_PREFIX . "product_attribute SET product_id = '" . (int)$product_id . "', attribute_id = '" . (int)$attribute_id . "', language_id = 1, text = '" .  $this->db->escape($pair[1]) . "'");
			$this->db->query("INSERT INTO " . DB_PREFIX . "product_attribute SET product_id = '" . (int)$product_id . "', attribute_id = '" . (int)$attribute_id . "', language_id = 2, text = '" .  $this->db->escape($pair[1]) . "'");
		}
	}
	private function parseSize($product_id, $size_text){
		$size_array = explode(",", $size_text);
			
		$in_db_option = $this->db->query("SELECT * FROM oc_option_description WHERE name LIKE 'Размер'");
		if($in_db_option->num_rows > 0){
			$option_id = $in_db_option->row['option_id'];
		}else{
			$this->db->query("INSERT INTO `oc_option` SET type = 'select', sort_order = '0'");
			$option_id = $this->db->getLastId();
			$this->db->query("INSERT INTO oc_option_description SET option_id = '" . (int)$option_id . "', language_id = 1, name = 'Размер'");
			$this->db->query("INSERT INTO oc_option_description SET option_id = '" . (int)$option_id . "', language_id = 2, name = 'Размер'");
			
		}
		
		$this->db->query("DELETE FROM oc_product_option WHERE product_id = '" . (int)$product_id . "'");
		$this->db->query("DELETE FROM oc_product_option_value WHERE product_id = '" . (int)$product_id . "'");
		
		$this->db->query("INSERT INTO oc_product_option SET product_id = '" . (int)$product_id . "', option_id = '" . (int)$option_id . "', required = '1'");
		$product_option_id = $this->db->getLastId();
		
		foreach($size_array as $size){
			$in_db_option_value = $this->db->query("SELECT * FROM oc_option_value_description WHERE name LIKE '" . trim($size) . "'");
			
			if($in_db_option_value->num_rows > 0){
				$option_value_id = $in_db_option_value->row['option_value_id'];
			}else{
				$this->db->query("INSERT INTO oc_option_value SET option_id = '" . (int)$option_id . "', image = '', sort_order = '0'");
				$option_value_id = $this->db->getLastId();

				$this->db->query("INSERT INTO oc_option_value_description SET option_value_id = '" . (int)$option_value_id . "', language_id = 1, option_id = '" . (int)$option_id . "', name = '" . $this->db->escape(trim($size)) . "'");
				$this->db->query("INSERT INTO oc_option_value_description SET option_value_id = '" . (int)$option_value_id . "', language_id = 2, option_id = '" . (int)$option_id . "', name = '" . $this->db->escape(trim($size)) . "'");
			}
			$this->db->query("INSERT INTO oc_product_option_value SET product_option_id = '" . (int)$product_option_id . "', product_id = '" . (int)$product_id . "', option_id = '" . (int)$option_id . "', option_value_id = '" . (int)$option_value_id . "', quantity = '1000', subtract = '1', price = '0', price_prefix = '+', points = '0', points_prefix = '+', weight = '0', weight_prefix = '+'");
		}
	}
	private function createManufacturer($manufacturer){
		$this->db->query("INSERT INTO oc_manufacturer SET name = '" . $this->db->escape($manufacturer) . "', sort_order = '100'");

		$manufacturer_id = $this->db->getLastId();

		$this->db->query("INSERT INTO oc_manufacturer_to_store SET manufacturer_id = '" . (int)$manufacturer_id . "', store_id = '0'");

		$this->db->query("INSERT INTO " . DB_PREFIX . "url_alias SET query = 'manufacturer_id=" . (int)$manufacturer_id . "', keyword = '" . $this->db->escape($this->translit($manufacturer)) . "'");

		$this->cache->delete('manufacturer');
		
		return $manufacturer_id;
	}
	private function loadImage($path, $main_image){
		$ext_arr = explode('.', $main_image);
		$ext = end($ext_arr);
		$db_image_name = "catalog/products/" . strtolower($path) . "/" . md5($main_image) . "." . $ext;
		$model_folder = DIR_IMAGE . "catalog/products/" . strtolower($path) . "/";
		$new_image_name = DIR_IMAGE . $db_image_name;
	
		if (!file_exists($model_folder)) {
		    mkdir($model_folder, 0777, true);
		}
		copy($main_image, $new_image_name);
		
		return $db_image_name;
	}
	private function translit($text){
		$ru = explode('-', "А-а-Б-б-В-в-Ґ-ґ-Г-г-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-І-і-Ї-ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я"); 
		$en = explode('-', "A-a-B-b-V-v-G-g-G-g-D-d-E-e-E-e-E-e-ZH-zh-Z-z-I-i-I-i-I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H-h-TS-ts-CH-ch-SH-sh-SCH-sch---Y-y---E-e-YU-yu-YA-ya");

	 	$res = str_replace($ru, $en, $text);
		$res = preg_replace("/[\s]+/ui", '-', $res);
		$res = strtolower(preg_replace("/[^0-9a-zа-я\-]+/ui", '', $res));
	    return $res;  
	}
	
}