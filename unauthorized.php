<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "unauthorized",
	"authenticated" => false,
	"role" => array(),
	"blocks" => array (
		"ads" => true,
		"nav" => true,
		"footer" => true
	)
);

// End session
session_unset();

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
		<div class="container-fluid">
			<div class="row">
				<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
					<h1 data-i18n="page.unauthorized.title"></h1>
					<p data-i18n="page.unauthorized.lines.0"></p>
					<p data-i18n="page.unauthorized.lines.1"></p>
					<p style="text-align:center"><a href="#" class="btn btn-lg btn-primary btn-material-grey-500" id="linkLogout" data-i18n="action.logout"></a></p>
				</div>
			</div>
		</div><?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>