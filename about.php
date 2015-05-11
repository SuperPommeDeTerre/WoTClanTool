<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');
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
		<title data-i18n="app.title" data-i18n-options="{&quot;page&quot;:&quot;about&quot;}"></title>
		<!-- CSS -->
		<link href="./themes/<?php echo($gThemeName); ?>/style/style.css" rel="stylesheet" />
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body id="about"><?php
include_once(WCT_INC_DIR . 'analyticstracking.php');
?>
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
					<nav class="social pull-right">
						<ul class="list-unstyled">
							<li class="facebook"><a href="http://www.facebook.com/share.php?u=[URL]&title=[TITLE]" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]share.facebook;"><span>Facebook</span></a></li>
							<li class="twitter"><a href="https://twitter.com/share" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]share.tweeter;"><span>Tweet</span></a></li>
						</ul>
					</nav>
				</div>
			</div>
		</nav>

		<!-- Main component for a primary marketing message or call to action -->
		<div class="container-fluid">
			<div class="row">
				<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
					<h1><span data-i18n="app.name"></span> <span>v<?php echo(WCT_VERSION); ?></span></h1>
					<div class="list-group">
						<a class="list-group-item" href="http://eu.wargaming.net/developers/">WG API</a>
						<a class="list-group-item" href="http://jquery.com/">jQuery</a>
						<a class="list-group-item" href="http://getbootstrap.com/">Bootstrap</a>
						<a class="list-group-item" href="http://fezvrasta.github.io/bootstrap-material-design/">Material design for bootstrap</a>
						<a class="list-group-item" href="http://i18next.com/">i18next</a>
						<a class="list-group-item" href="http://momentjs.com/">Moment.js</a>
						<a class="list-group-item" href="http://eonasdan.github.io/bootstrap-datetimepicker/">Bootstrap 3 Datepicker</a>
						<a class="list-group-item" href="https://github.com/Serhioromano/bootstrap-calendar">Bootstrap Calendar</a>
						<a class="list-group-item" href="http://www.eyecon.ro/bootstrap-colorpicker/">Colorpicker for Bootstrap</a>
						<a class="list-group-item" href="http://calebevans.me/projects/jcanvas/">jCanvas</a>
						<a class="list-group-item" href="http://keith-wood.name/svg.html">jQuery SVG</a>
						<a class="list-group-item" href="http://morrisjs.github.io/morris.js/">Morris</a>
						<a class="list-group-item" href="http://raphaeljs.com/">Rapha&euml;l</a>
						<a class="list-group-item" href="http://github.hubspot.com/sortable/">Sortable</a>
						<a class="list-group-item" href="http://ripplejs.github.io/">ripples.js</a>
						<a class="list-group-item" href="http://medialize.github.io/URI.js/jquery-uri-plugin.html">URI.js</a>
						<a class="list-group-item" href="https://github.com/zeroclipboard/zeroclipboard">ZeroClipboard</a>
						<a class="list-group-item" href="http://underscorejs.org">Underscore.js</a>
						<a class="list-group-item" href="https://github.com/jmosbech/StickyTableHeaders">Sticky Table Headers</a>
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
		<!-- Bootstrap core JavaScript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<script type="text/javascript" src="./server/config.js.php"></script>
		<script type="text/javascript" src="./js/jquery-2.1.4.min.js"></script>
		<script type="text/javascript" src="./js/i18next-1.8.0.min.js"></script>
		<script type="text/javascript" src="./js/bootstrap.min.js"></script>
		<script type="text/javascript" src="./js/material.min.js"></script>
		<script type="text/javascript" src="./js/ripples.min.js"></script>
		<script type="text/javascript" src="./js/moment-with-locales.min.js"></script>
		<script type="text/javascript" src="./js/URI.js"></script>
		<script type="text/javascript" src="./js/jquery.stickytableheaders.min.js"></script>
		<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
		<script type="text/javascript" src="./js/ie10-viewport-bug-workaround.js"></script>
		<script type="text/javascript" src="./js/pages/index.js"></script>
		<script type="text/javascript" src="./js/app.js"></script>
	</body>
</html>