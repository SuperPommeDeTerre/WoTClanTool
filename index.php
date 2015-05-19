<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

// Get the URI params
if (isset($_REQUEST["access_token"])) {
	$_SESSION["access_token"] = $_REQUEST["access_token"];
	$_SESSION["nickname"] = $_REQUEST["nickname"];
	$_SESSION["account_id"] = $_REQUEST["account_id"];
	$_SESSION["expires_at"] = $_REQUEST["expires_at"];
	$_SESSION["cluster"] = "EU";
}
// Handle WG session expiration
$curTime = time();
if (isset($_SESSION["expires_at"]) && $_SESSION["expires_at"] < $curTime) {
	session_unset();
	session_destroy();
	setcookie('PHPSESSID', '', time()-1);
	session_start();
}
// Redirect to home if WG session is active
if (isset($_SESSION["access_token"])) {
	if (isset($_REQUEST["returnUrl"])) {
		header('Location: ' . $_REQUEST["returnUrl"]);
	} else {
		header('Location: home.php');
	}
	exit;
}

// Fill page properties
$gPageProps = array(
	"id" => "index",
	"authenticated" => false,
	"role" => array(),
	"blocks" => array (
		"ads" => true,
		"nav" => true,
		"footer" => true
	)
);

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
		<!-- Main component for a primary marketing message or call to action -->
		<div class="container-fluid">
			<div class="row">
				<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
					<h1 data-i18n="app.name"></h1>
					<p data-i18n="[html]page.index.lines.0"></p>
					<p data-i18n="[html]page.index.lines.1"></p>
					<ul>
						<li data-i18n="page.index.features.0"></li>
						<li data-i18n="page.index.features.1"></li>
						<li data-i18n="page.index.features.2"></li>
						<li data-i18n="page.index.features.3"></li>
						<li data-i18n="page.index.features.4"></li>
					</ul>
					<p data-i18n="[html]page.index.lines.2"></p>
					<p style="text-align:center"><?php
if (count($gConfig["WG"]["clusters"]) > 1) {
	?><a href="#" class="btn btn-lg btn-primary btn-material-grey-500" id="btnLogin" data-target="#dlgChooseCluster" data-toggle="modal" data-i18n="action.identification"></a><?php
} else {
	?><a href="#" class="btn btn-lg btn-primary btn-material-grey-500" id="btnLogin" data-i18n="action.identification"></a><?php
} ?></p>
				</div>
			</div>
		</div><?php
if (count($gConfig["WG"]["clusters"]) > 1) {
?>
		<div id="dlgChooseCluster" class="modal fade" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button class="close" aria-hidden="true" data-dismiss="modal" type="button">&times;</button>
						<h4 class="modal-title" data-i18n="clusters.title"></h4>
					</div>
					<div class="modal-body">
						<div class="container-fluid">
							<div class="row"><?php
	foreach ($gConfig["WG"]["clusters"] as $clusterId) {
?>
								<div class="cluster <?php echo($clusterId); ?>" data-region="<?php echo($clusterId); ?>">
									<p data-i18n="clusters.<?php echo($clusterId); ?>"></p>
								</div><?php
	}
?>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div><?php
}

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>