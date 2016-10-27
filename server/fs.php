<?php
// File system service
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

// Initialize result
$result = array();
// Configuration file
$configFile = WCT_CONFIG_DIR . DIRECTORY_SEPARATOR . 'config.json';

// Define root directory for browsing
define('FS_ROOT_DIR', WCT_BASE_DATA_DIR);

if (!WctRights::isUserAdmin()) {
	// If the user is not an administrator, refuse action
	$result['status'] = 'error';
	$result['message'] = 'error.notadmin';
} else {
	$paramFile = $_REQUEST['f'];
	$isRoot = ($paramFile === '/');
	// Remove all '..' then double / to avoid attacks
	$paramFile = str_replace('..', '', $paramFile);
	$paramFile = str_replace('//', '/', $paramFile);
	// Then convert / to DIRECTORY_SEPARATOR
	$paramFile = str_replace('/', DIRECTORY_SEPARATOR, $paramFile);
	$paramFile = FS_ROOT_DIR . DIRECTORY_SEPARATOR . $paramFile;
	switch ($_REQUEST['a']) {
		case 'ls':
			if (substr($paramFile, -strlen(DIRECTORY_SEPARATOR)) === DIRECTORY_SEPARATOR) {
				$paramFile .= '*';
			}
			$listFiles = glob($paramFile, GLOB_MARK);
			foreach ($listFiles as &$fileName) {
				$fileName = str_replace(FS_ROOT_DIR, '', $fileName);
				$fileName = str_replace(DIRECTORY_SEPARATOR, '/', $fileName);
				$fileName = substr($fileName, 1);
			}
			// If it's not the root directory, add '..' on top of files.
			if (!$isRoot) {
				array_splice($listFiles, 0, 0, array('..'));
			}
			$result['status'] = 'ok';
			$result['data'] = $listFiles;
			break;
		case 'cat':
			$result['status'] = 'ok';
			$result['data'] = file_get_contents($paramFile);
			break;
		case 'rm':
			unlink($paramFile);
			$result['status'] = 'ok';
			break;
		case 'mv':
			break;
		case 'cp':
			break;
		case 'fileinfo':
			$result['status'] = 'ok';
			$result['atime'] = fileatime($paramFile);
			$result['ctime'] = filectime($paramFile);
			$result['mtime'] = filemtime($paramFile);
			$result['inode'] = fileinode($paramFile);
			$result['group'] = filegroup($paramFile);
			$result['owner'] = fileowner($paramFile);
			$result['perms'] = fileperms($paramFile);
			$result['size'] = filesize($paramFile);
			$result['type'] = filetype($paramFile);
			break;
		case 'save':
			file_put_contents($paramFile, $_REQUEST['content'], LOCK_EX);
			$result['status'] = 'ok';
			break;
	}
}
header('Content-Type: application/json');
echo json_encode($result);
?>