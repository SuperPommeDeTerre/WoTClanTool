<?php
require(dirname(__FILE__) . '/server/global.php');

if (!in_array($_SESSION["account_id"], $gAdmins)) {
	header('Location: index.php');
}

$gPageID = "admin";

require(dirname(__FILE__) . '/themes/' . $gThemeName . '/header.php');
?>
<?php
require(dirname(__FILE__) . '/themes/' . $gThemeName . '/footer.php');
?>