<?php
require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'version.php');

// If the config file exists, redirect to login page
// this is to prevent multiple call to install.php
if (file_exists(WCT_CONFIG_DIR . DIRECTORY_SEPARATOR . 'config.json')) {
	header('Location: ./index.php');
	exit;
}

// Start session
session_start();

// Include clusters configuration
require_once(WCT_SERVER_DIR . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'clusters.php');

// Langs definition
require_once(WCT_SERVER_DIR . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'langs.php');

// Utility functions
require_once(WCT_SERVER_DIR . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'wct.utils.inc');

// Initialize some variables
// Use default theme
$gThemeName = 'default';

/**
 * Perform the real installation of the application (writes the configuration file)
 */
function install($pClusters, $pDefaultCluster) {
	header('Content-Type: application/json');
	$DEFAULT_WG_API_KEY = $pClusters[$pDefaultCluster]["key"];
	$DEFAULT_WG_API_URL = $pClusters[$pDefaultCluster]["url"];
	$configFile = WCT_CONFIG_DIR . DIRECTORY_SEPARATOR . 'config.json';
	// Init config
	$configToWrite = array(
		"WG" => array(
			"clusters" => array()
		),
		"app" => array(
			"theme" => "default",
			"admins" => array(),
			"showads" => true
		),
		"clans" => array(
			"restric_to" => array()
		),
		"player" => array(
			"max_battle_time" => $_POST['inactivitythreshold']
		)
	);
	// Parse POST data
	$clusterArray = array();
	if (!isset($_POST['clusters'])) {
		foreach ($pClusters as $lClusterId => $lClusterProps) {
			array_push($clusterArray, $lClusterId);
		}
	} else {
		$clusterArray = $_POST['clusters'];
	}
	$configToWrite["WG"]["clusters"] = $clusterArray;
	$configToWrite["app"]["admins"] = array();
	$configToWrite["app"]["showads"] = (isset($_POST['showads'])?($_POST['showads']=='true'?true:false):true);
	$configToWrite["clans"]["restric_to"] = array();
	foreach ($clusterArray as $lClusterId) {
		$configToWrite["app"]["admins"][$lClusterId] = array();
		if (isset($_POST['admins' . $lClusterId])) {
			foreach($_POST['admins' . $lClusterId] as $playerId) {
				array_push($configToWrite["app"]["admins"][$lClusterId], $playerId);
			}
		}
		$configToWrite["clans"]["restric_to"][$lClusterId] = array();
		if (isset($_POST['clans' . $lClusterId])) {
			foreach($_POST['clans' . $lClusterId] as $clanId) {
				array_push($configToWrite["clans"]["restric_to"][$lClusterId], $clanId);
			}
		}
	}

	$result = array(
		"status" => "ok",
		"data" => $configToWrite
	);
	if (!file_put_contents($configFile, json_encode($configToWrite, true), LOCK_EX)) {
		// Error while writing config file
		$result["status"] = "error";
		$result["message"] = "Error while writing configuration file [" . $configFile . "].";
	}
	// Everything has running fine. Proceed...
	echo(json_encode($result, true));
}
if (isset($_POST['inactivitythreshold'])) {
	install($gClusters, $gDefaultCluster);
} else {
?><!DOCTYPE html>
<html lang="<?php echo($gLang); ?>">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" data-i18n="[content]app.description;" />
		<meta name="author" content="J&eacute;r&eacute;mie Langlade &lt;jlanglade@pixbuf.net&gt;" />
		<link rel="icon" href="./themes/<?php echo($gThemeName); ?>/style/favicon.ico" />
		<link href="./themes/<?php echo($gThemeName); ?>/style/favicon.png" type="image/x-icon" rel="icon" />
		<title data-i18n="app.title" data-i18n-options="{&quot;page&quot;:&quot;install&quot;}"></title>
		<!-- CSS -->
		<link href="./themes/<?php echo($gThemeName); ?>/style/style.css" rel="stylesheet" />
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
		<script type="text/javascript">
			var gConfig = {
				'clusters': <?php echo(json_encode($gClusters)); ?>
			}
		</script>
	</head>
	<body id="install"><?php
include_once(WCT_INC_DIR . 'analyticstracking.php');
?>
		<form id="frmInstall" method="POST" action="./install.php">
		<nav class="navbar navbar-default navbar-fixed-top navbar-material-grey-700 shadow-z-2">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						<span class="sr-only" data-i18n="nav.toggle"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="./" data-i18n="app.name"></a>
				</div>
				<div id="navbar" class="navbar-collapse collapse">
				</div>
			</div>
		</nav>
		<div class="container-fluid">
			<div class="row">
				<div class="main">
					<h1 class="page-header" data-i18n="install.title"></h1>
					<div class="row">
						<div class="col-md-8">
							<h2 data-i18n="install.config"></h2>
							<div class="form-group">
								<div class="togglebutton togglebutton-info">
									<label><span data-i18n="install.showads"></span>
										<input type="checkbox" id="showads" checked="checked" />
									</label>
								</div>
							</div>
							<label data-i18n="install.clusters"></label>
							<div class="form-group">
								<div class="btn-group" data-i18n="[aria-label]install.clusters;" id="btnClusters"><?php
foreach ($gClusters as $clusterId => $clusterProps) {
?>
									<a href="#" class="btn btn-material-grey" data-cluster="<?php echo($clusterId); ?>" data-i18n="clusters.<?php echo($clusterId); ?>"></a><?php
}
?>
								</div>
							</div>
							<div>
								<label data-i18n="install.clan.restrictions"></label>
								<div id="restrictedClans">
								</div>
								<button class="btn btn-default" data-i18n="" data-target="#dlgSearchClan" data-toggle="modal" id="btnAddClan"><span class="glyphicon glyphicon-plus"></span></button>
							</div>
							<div>
								<label data-i18n="install.admins"></label>
								<div id="listAdmins">
								</div>
								<button class="btn btn-default" data-target="#dlgSearchPlayer" data-toggle="modal" id="btnAddAdmin"><span class="glyphicon glyphicon-plus"></span></button>
							</div>
							<div>
								<label><span data-i18n="install.inactivitythreshold.title"></span> <span class="badge" id="badgeInactivityThreshold" data-i18n="install.inactivitythreshold.value" data-i18n-options="{&quot;count&quot;:14}"></span></label>
								<div id="sliderInactivityThreshold" style="background-color:#4caf50" class="slider shor slider-material-green"></div>
							</div>
						</div>
						<div class="col-md-4">
							<h2 data-i18n="install.tests"></h2>
							<?php wctUtils::testWrite('.' . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR); ?>
							<?php wctUtils::testWrite('.' . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR); ?>
							<?php //wctUtils::testModReWrite(); ?>
						</div>
					</div>
					<p style="text-align:center"><a href="#" class="btn btn-lg btn-primary btn-material-grey-500" id="btnExecuteInstall" data-i18n="install.proceed"></a></p>
				</div>
			</div>
		</div>
		<div id="dlgSearchClan" class="modal fade" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button class="close" aria-hidden="true" data-dismiss="modal" type="button">&times;</button>
						<h4 class="modal-title" data-i18n="install.searchclan.title"></h4>
					</div>
					<div class="modal-body" style="padding-top:1em">
						<div class="form-group selCluster">
							<select class="form-control floating-label" data-i18n="[placeholder]install.cluster.title;[data-hint]install.cluster.hint;"><?php
foreach ($gClusters as $clusterId => $clusterProps) {
?>
								<option value="<?php echo($clusterId); ?>" data-i18n="clusters.<?php echo($clusterId); ?>"></option><?php
}
?>
							</select>
						</div>
						<div class="form-group">
							<input type="text" id="txtSearchClan" class="form-control floating-label" data-i18n="[placeholder]install.clan.title;[data-hint]install.clan.hint;" />
						</div>
						<ul id="searchClanResult" class="searchresult">
						</ul>
					</div>
					<div class="modal-footer">
						<button class="btn btn-primary" data-i18n="btn.search" id="btnSearchClan"></button>
					</div>
				</div>
			</div>
		</div>
		<div id="dlgSearchPlayer" class="modal fade" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button class="close" aria-hidden="true" data-dismiss="modal" type="button">&times;</button>
						<h4 class="modal-title" data-i18n="install.searchplayer.title"></h4>
					</div>
					<div class="modal-body" style="padding-top:1em">
						<div class="form-group selCluster">
							<select class="form-control floating-label" data-i18n="[placeholder]install.cluster.title;[data-hint]install.cluster.hint;"><?php
foreach ($gClusters as $clusterId => $clusterProps) {
?>
								<option value="<?php echo($clusterId); ?>" data-i18n="clusters.<?php echo($clusterId); ?>"></option><?php
}
?>
							</select>
						</div>
						<div class="form-group">
							<input type="text" id="txtSearchPlayer" class="form-control floating-label" data-i18n="[placeholder]install.player.title;[data-hint]install.player.hint;" />
						</div>
						<ul id="searchPlayerResult" class="searchresult">
						</ul>
					</div>
					<div class="modal-footer">
						<button class="btn btn-primary" data-i18n="btn.search" id="btnSearchPlayer"></button>
					</div>
				</div>
			</div>
		</div>
		<div id="footer">
			<div id="footerPayPalDonate">
				<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
					<input type="hidden" name="cmd" value="_s-xclick" />
					<input type="hidden" name="hosted_button_id" value="CD4LXS5KJGNWC" />
					<input type="image" src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online." />
					<img alt="" border="0" src="https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif" width="1" height="1" />
				</form>
			</div>
		</div>
		<script type="text/javascript" src="./js/jquery-2.1.4.min.js"></script>
		<script type="text/javascript" src="./js/i18next-1.10.1.min.js"></script>
		<script type="text/javascript" src="./js/bootstrap.min.js"></script>
		<script type="text/javascript" src="./js/material.min.js"></script>
		<script type="text/javascript" src="./js/ripples.min.js"></script>
		<script type="text/javascript" src="./js/moment-with-locales.min.js"></script>
		<script type="text/javascript" src="./js/jquery.nouislider.all.min.js"></script>
		<script type="text/javascript" src="./js/URI.js"></script>
		<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
		<script type="text/javascript" src="./js/ie10-viewport-bug-workaround.js"></script>
		<script type="text/javascript" src="./js/pages/install.js"></script>
		</form>
	</body>
</html><?php
}
?>