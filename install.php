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
						<div class="col-md-9">
							<h2 data-i18n="install.config"></h2>
							<div class="form-group">
								<input type="text" class="form-control floating-label" placeholder="Clan" data-hint="Entrez les restrictions de clan"/>
							</div>
							<div class="form-group">
								<input type="text" class="form-control floating-label" placeholder="Administrateurs" data-hint="Entrez les administrateurs de l'outil"/>
							</div>
							<div class="form-group">
								<input type="text" class="form-control floating-label" placeholder="Seuil d'inactivité" data-hint="Entrez le seuil d'inactivité des membres avant qu'ils apparaissent en rouge dans la liste"/>
							</div>
						</div>
						<div class="col-md-3">
							<h2 data-i18n="install.tests"></h2>
							<?php testWrite(WCT_CONFIG_DIR); ?>
							<?php testWrite(WCT_DATA_DIR); ?>
							<?php testModReWrite(); ?>
						</div>
					</div>
					<p style="text-align:center"><a href="#" class="btn btn-lg btn-primary btn-material-grey-500" id="btnExecuteInstall" data-i18n="install.proceed"></a></p>
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
		<script type="text/javascript" src="./js/URI.js"></script>
		<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
		<script type="text/javascript" src="./js/ie10-viewport-bug-workaround.js"></script>
		<script type="text/javascript" src="./js/pages/install.js"></script>
		</form>
	</body>
</html>
