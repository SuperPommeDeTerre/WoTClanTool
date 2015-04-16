<?php
define('WCT_ROOT', './');
define('WCT_DATA_DIR', WCT_ROOT . 'data/');
define('WCT_CONFIG_DIR', WCT_ROOT . 'config/');

// Start session
session_start();

// Initialize some variables
$gAuthorizedLang = array("en", "ru", "pl", "de", "fr", "es", "zh", "tr", "cs", "ko");
$gLang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
if (!array_search($gLang, $gAuthorizedLang)) {
	$gLang = $gAuthorizedLang[0];
}
$gThemeName = 'default';

function testModRewrite($io=true) {
	if(function_exists('apache_get_modules')) {
		$test = in_array("mod_rewrite", apache_get_modules());
		if($io==true) {
			if($test) {
				echo('<div class="alert alert-success" role="alert"><span class="glyphicon glyphicon-check"></span> <span data-i18n="install.modrewrite.ok"></span></div>');
			} else {
				echo('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-unchecked"></span> <span data-i18n="install.modrewrite.ko"></span></div>');
			}
		}
		return $test;
	}
	else return true;
}

function testWrite($file) {
	if(is_writable($file)) {
		echo('<div class="alert alert-success" role="alert"><span class="glyphicon glyphicon-check"></span> <span data-i18n="install.write.ok" data-i18n-options="{&quot;file&quot;:&quot;' . $file . '&quot;}"></span></div>');
	} else {
		echo('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-unchecked"></span> <span data-i18n="install.write.ko" data-i18n-options="{&quot;file&quot;:&quot;' . $file . '&quot;}"></span></div>');
	}
}

function install($content, $config) {
	$DEFAULT_WG_API_KEY = "e6ecba5f5af3a16603e38f3b40b1a84e";
	$DEFAULT_WG_API_URL = "https://api.worldoftanks.eu/";
}
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
		<title data-i18n="app.name"></title>
		<!-- CSS -->
		<link href="./themes/<?php echo($gThemeName); ?>/style/style.css" rel="stylesheet" />
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body id="install">
		<form id="frmInstall" method="POST" action="./">
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
							<label>Clusters</label>
							<div class="form-group">
								<div class="btn-group" aria-label="Clusters">
									<a href="#" class="btn btn-material-grey" data-cluster="RU">RU</a>
									<a href="#" class="btn btn-material-grey" data-cluster="NA">NA</a>
									<a href="#" class="btn btn-material-grey" data-cluster="EU">EU</a>
									<a href="#" class="btn btn-material-grey" data-cluster="ASIA">ASIA</a>
								</div>
							</div>
							<div>
								<label>Restrictions de clan</label>
								<div class="alert alert-info alert-dismissible" role="alert">
									<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
									<p>VAE-V <small>Malheur aux vaincus</small></p>
								</div>
								<div class="alert alert-info alert-dismissible" role="alert">
									<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
									<p>BIMA <small>Bellator In MAchina</small></p>
								</div>
								<button class="btn btn-default" data-i18n="" data-target="#dlgSearchClan" data-toggle="modal" id="btnAddClan"><span class="glyphicon glyphicon-plus"></span></button>
							</div>
							<div>
								<label>Administrateurs</label>
								<div class="alert alert-info alert-dismissible" role="alert">
									<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
									<p>SuperPommeDeTerre</p>
								</div>
								<button class="btn btn-default" data-target="#dlgSearchPlayer" data-toggle="modal" id="btnAddAdmin"><span class="glyphicon glyphicon-plus"></span></button>
							</div>
							<div>
								<label>Seuil d'inactivité <span class="badge" id="badgeInactivityThreshold">14 jours</span></label>
								<div id="sliderInactivityThreshold" style="background-color:#4caf50" class="slider shor slider-material-green"></div>
							</div>
						</div>
						<div class="col-md-4">
							<h2 data-i18n="install.tests"></h2>
							<?php testWrite(WCT_CONFIG_DIR); ?>
							<?php testWrite(WCT_DATA_DIR); ?>
							<?php //testModReWrite(); ?>
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
						<button class="close" aria-hidden="true" data-dismiss="modal" type="button">×</button>
						<h4 class="modal-title" data-i18n="install.searchclan.title"></h4>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<select class="form-control floating-label" placeholder="Cluster" data-hint="Entrez le cluster sur lequel rechercher le clan" style="margin-top:1em">
								<option value="RU" data-i18n="clusters.RU"></option>
								<option value="EU" data-i18n="clusters.EU"></option>
								<option value="NA" data-i18n="clusters.NA"></option>
								<option value="ASIA" data-i18n="clusters.ASIA"></option>
							</select>
						</div>
						<div class="form-group">
							<input type="text" class="form-control floating-label" placeholder="Clan" data-hint="Entrez le nom du clan recherché" />
						</div>
						<div id="searchClanResult">
						</div>
					</div>
					<div class="modal-footer">
						<button class="btn btn-primary" data-i18n="btn.search" disabled="disabled" id="btnSearchClan"></button>
					</div>
				</div>
			</div>
		</div>
		<div id="dlgSearchPlayer" class="modal fade" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button class="close" aria-hidden="true" data-dismiss="modal" type="button">×</button>
						<h4 class="modal-title" data-i18n="install.searchplayer.title"></h4>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<input type="text" class="form-control floating-label" placeholder="Joueur" data-hint="Entrez le nom du joueur recherché" />
						</div>
						<div id="searchPlayerResult">
						</div>
					</div>
					<div class="modal-footer">
						<button class="btn btn-primary" data-i18n="btn.search" disabled="disabled" id="btnSearchPlayer"></button>
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
		<script type="text/javascript" src="./js/jquery-2.1.3.min.js"></script>
		<script type="text/javascript" src="./js/i18next-1.8.0.min.js"></script>
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
</html>
