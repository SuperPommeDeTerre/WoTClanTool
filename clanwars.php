<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "clanwars",
	"authenticated" => true,
	"role" => array(),
	"blocks" => array (
		"ads" => false,
		"nav" => true,
		"footer" => true
	)
);

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
<div class="container-fluid">
	<div class="row">
		<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
			<h1 class="page-header" data-i18n="page.clanwars.title"></h1>
			<div id="cwMap"></div>
		</div>
	</div>
</div>
<script type="text/javascript" src="js/ol.js"></script>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>