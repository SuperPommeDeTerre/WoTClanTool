<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "about",
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
					<h1><span data-i18n="app.name"></span> <span class="label label-default">v<?php echo(WCT_VERSION); ?></span></h1>
					<div class="list-group">
						<a class="list-group-item" href="http://eu.wargaming.net/developers/">WG API</a>
						<a class="list-group-item" href="http://jquery.com/">jQuery</a>
						<a class="list-group-item" href="http://getbootstrap.com/">Bootstrap</a>
						<a class="list-group-item" href="http://fezvrasta.github.io/bootstrap-material-design/">Material design for bootstrap</a>
						<a class="list-group-item" href="http://i18next.com/">i18next</a>
						<a class="list-group-item" href="http://momentjs.com/">Moment.js</a>
						<a class="list-group-item" href="http://eonasdan.github.io/bootstrap-datetimepicker/">Bootstrap 3 Datepicker</a>
						<a class="list-group-item" href="https://github.com/Serhioromano/bootstrap-calendar">Bootstrap Calendar</a>
						<a class="list-group-item" href="http://mjolnic.com/bootstrap-colorpicker/">Bootstrap Colorpicker</a>
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
		</div><?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>