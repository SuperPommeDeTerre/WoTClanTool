<?php
require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageID = 'weekview';

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
		<title data-i18n="app.title" data-i18n-options="{&quot;page&quot;:&quot;weekview&quot;}"></title>
		<!-- CSS -->
		<link href="./themes/<?php echo($gThemeName); ?>/style/style.css" rel="stylesheet" />
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body id="weekview"><?php
include_once(WCT_INC_DIR . 'analyticstracking.php');
?>		<div class="container-fluid">
			<div class="row">
				<div class="main">
					<div id="myCalendar" class="container-fluid">
						<div class="row">
							<div class="col-xs-6 col-md-4 col-lg-2 placeholder">
								<h3 data-i18n="action.calendar.today"></h3>
							</div>
							<div class="col-xs-6 col-md-4 col-lg-2 placeholder">
								<h3></h3>
							</div>
							<div class="col-xs-6 col-md-4 col-lg-2 placeholder">
								<h3></h3>
							</div>
							<div class="clearfix visible-md-block"></div>
							<div class="col-xs-6 col-md-4 col-lg-2 placeholder">
								<h3></h3>
							</div>
							<div class="col-xs-6 col-md-4 col-lg-2 placeholder">
								<h3></h3>
							</div>
							<div class="col-xs-6 col-md-4 col-lg-2 placeholder">
								<h3></h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="events-modal">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h3></h3>
					</div>
					<div class="modal-body">
					</div>
					<div class="modal-footer">
						<a href="#" data-dismiss="modal" class="btn" data-i18n="btn.close"></a>
					</div>
				</div>
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
		<script type="text/javascript" src="./js/bootstrap-toolkit.min.js"></script>
		<script type="text/javascript" src="./js/raphael-min.js"></script>
		<script type="text/javascript" src="./js/morris.min.js"></script>
		<script type="text/javascript" src="./js/moment-with-locales.min.js"></script>
		<script type="text/javascript" src="./js/underscore-min.js"></script>
		<script type="text/javascript" src="./locales/<?php echo($gLang); ?>/calendar.js"></script>
		<script type="text/javascript" src="./js/calendar.min.js"></script>
		<script type="text/javascript" src="./js/sortable.min.js"></script>
		<script type="text/javascript" src="./js/jquery.stickytableheaders.min.js"></script>
		<script type="text/javascript" src="./js/bootstrap-datetimepicker.min.js"></script>
		<script type="text/javascript" src="./js/URI.js"></script>
		<script type="text/javascript" src="./js/jcanvas.min.js"></script>
		<script type="text/javascript" src="./js/ZeroClipboard.min.js"></script>
		<script type="text/javascript" src="./js/jquery.nouislider.all.min.js"></script>
		<script type="text/javascript" src="./js/jquery.svg.min.js"></script>
		<script type="text/javascript" src="./js/jquery.svgdom.min.js"></script>
		<script type="text/javascript" src="./js/jquery.svgfilter.min.js"></script>
		<script type="text/javascript" src="./js/jquery.svggraph.min.js"></script>
		<script type="text/javascript" src="./js/jquery.svgplot.min.js"></script>
		<script type="text/javascript" src="./js/jquery.svganim.min.js"></script>
		<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
		<script type="text/javascript" src="./js/ie10-viewport-bug-workaround.js"></script>
		<!-- Local scripts -->
		<script type="text/javascript" src="./js/pages/<?php echo($gPageID); ?>.js"></script>
		<script type="text/javascript" src="./js/common.js"></script>
		<script type="text/javascript" src="./js/app.js"></script>
	</body>
</html>