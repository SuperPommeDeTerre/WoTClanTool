		</div><?php
if ($gPageProps["blocks"]["footer"]) { ?>
		<div id="footer">
			<h3><span data-i18n="app.name"></span> <span class="badge">v<?php echo(WCT_VERSION); ?></span></h3>
			<div class="container-fluid">
				<div class="row">
					<div class="col-xs-12 col-md-6 col-lg-6">
						<ul class="list-unstyled"><?php
	if (array_key_exists("account_id", $_SESSION)) { ?>
							<li><a href="reports" data-i18n="page.reports.title"></a></li><?php
	} ?>
							<li><a href="documentation" data-i18n="page.documentation.title"></a></li>
						</ul>
					</div>
					<div class="col-xs-12 col-md-6 col-lg-6">
						<ul class="list-unstyled">
							<li><a href="about" data-i18n="page.about.title"></a></li>
							<li><a href="http://superpommedeterre.github.io/WoTClanTool/" data-i18n="app.projectpage"></a></li>
							<li><a href="https://github.com/SuperPommeDeTerre/WoTClanTool/issues" data-i18n="app.bugreports"></a></li><?php
	// Show the administration only if the user is in the admins group
	if (array_key_exists("account_id", $_SESSION) && in_array($_SESSION["account_id"], $gAdmins)) { ?>
							<li><a href="admin" data-i18n="page.admin.title"></a></li><?php
	} ?>
						</ul>
					</div>
				</div>
			</div>
		</div><?php
}
?>
		<!-- Bootstrap core JavaScript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<script type="text/javascript" src="server/config.js.php"></script>
		<script type="text/javascript" src="js/jquery-2.1.4.min.js"></script>
		<script type="text/javascript" src="js/i18next-1.10.1.min.js"></script>
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/material.min.js"></script>
		<script type="text/javascript" src="js/ripples.min.js"></script>
		<script type="text/javascript" src="js/bootstrap-toolkit.min.js"></script>
		<script type="text/javascript" src="js/raphael-min.js"></script>
		<script type="text/javascript" src="js/morris.min.js"></script>
		<script type="text/javascript" src="js/moment-with-locales.min.js"></script>
		<script type="text/javascript" src="js/underscore-min.js"></script>
		<script type="text/javascript" src="locales/<?php echo($gLang); ?>/calendar.js"></script>
		<script type="text/javascript" src="js/calendar.min.js"></script>
		<script type="text/javascript" src="js/sortable.min.js"></script>
		<script type="text/javascript" src="js/jquery.stickytableheaders.min.js"></script>
		<script type="text/javascript" src="js/bootstrap-datetimepicker.min.js"></script>
		<script type="text/javascript" src="js/URI.js"></script>
		<script type="text/javascript" src="js/jcanvas.min.js"></script>
		<script type="text/javascript" src="js/bootstrap-colorpicker.min.js"></script>
		<script type="text/javascript" src="js/ZeroClipboard.min.js"></script>
		<script type="text/javascript" src="js/jquery.nouislider.all.min.js"></script>
		<script type="text/javascript" src="js/jquery.svg.min.js"></script>
		<script type="text/javascript" src="js/jquery.svgdom.min.js"></script>
		<script type="text/javascript" src="js/jquery.svgfilter.min.js"></script>
		<script type="text/javascript" src="js/jquery.svggraph.min.js"></script>
		<script type="text/javascript" src="js/jquery.svgplot.min.js"></script>
		<script type="text/javascript" src="js/jquery.svganim.min.js"></script>
		<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
		<script type="text/javascript" src="js/ie10-viewport-bug-workaround.js"></script>
		<!-- Local scripts -->
		<script type="text/javascript" src="js/pages/<?php echo($gPageProps["id"]); ?>.js"></script>
		<script type="text/javascript" src="js/common.js"></script>
		<script type="text/javascript" src="js/app.js"></script>
	</body>
</html>