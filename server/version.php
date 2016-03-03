<?php
// Define application version
define('WCT_VERSION', '1.2');

// Define default cluster
define('WCT_DEFAULT_CLUSTER', 'EU');

// Define root directory of the application
define('WCT_ROOT_DIR', dirname(__FILE__) . DIRECTORY_SEPARATOR . '..');

// Define server dir
define('WCT_SERVER_DIR', dirname(__FILE__) . DIRECTORY_SEPARATOR);

// Define themes dir
define('WCT_THEMES_DIR', WCT_ROOT_DIR . DIRECTORY_SEPARATOR . 'themes');

// Define base data directory
define('WCT_BASE_DATA_DIR', WCT_ROOT_DIR . DIRECTORY_SEPARATOR . 'data');

// Define base config directory
define('WCT_CONFIG_DIR', WCT_ROOT_DIR . DIRECTORY_SEPARATOR . 'config');

// Define includes directory
define('WCT_INC_DIR', WCT_ROOT_DIR . DIRECTORY_SEPARATOR . 'res' . DIRECTORY_SEPARATOR . 'inc' . DIRECTORY_SEPARATOR);

// Define base URL
$protocol = (strstr('https',$_SERVER['SERVER_PROTOCOL']) === false)?'http':'https';
define('WCT_BASE_PATH', $protocol . '://'.$_SERVER['HTTP_HOST'].(dirname($_SERVER['SCRIPT_NAME']) != '/' ? dirname($_SERVER["SCRIPT_NAME"]).'/' : '/'));
unset($protocol);
?>