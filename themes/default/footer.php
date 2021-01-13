		</div>
		<div class="modal fade" id="logsDlg" tabindex="-1" role="dialog" aria-labelledby="logsLabel">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" data-i18n="[aria-label]btn.close;"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="logsLabel" data-i18n="admin.logstitle"></h4>
					</div>
					<div class="modal-body">
						<ul id="logsContent" class="list-unstyled">
						</ul>
					</div>
					<div class="modal-footer">
						<button id="copyLogButton" class="btn btn-default btn-material-grey-500" data-clipboard-target="#logsContent" data-i18n="[title]action.copy;"><span class="glyphicon glyphicon-copy" aria-hidden="true"></span></button>
						<button type="button" class="btn btn-default" data-dismiss="modal" data-i18n="btn.close"></button>
					</div>
				</div>
			</div>
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
							<li><a href="https://superpommedeterre.github.io/WoTClanTool/" data-i18n="app.projectpage"></a></li>
							<li><a href="https://github.com/SuperPommeDeTerre/WoTClanTool/issues" data-i18n="app.bugreports"></a></li>
						</ul>
					</div>
				</div>
			</div>
		</div><?php
}
?>
		<script type="text/javascript" src="server/config.js.php"></script>
		<script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
		<script type="text/javascript" src="js/jquery-migrate-3.0.0.min.js"></script>
		<script type="text/javascript" src="js/i18next.min.js"></script>
		<script type="text/javascript" src="js/i18next-jquery.min.js"></script>
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
		<script type="text/javascript" src="js/clipboard.min.js"></script>
		<script type="text/javascript" src="js/jquery.nouislider.all.min.js"></script>
		<script type="text/javascript" src="js/jquery.svg.min.js"></script>
		<script type="text/javascript" src="js/jquery.svgdom.min.js"></script>
		<script type="text/javascript" src="js/jquery.svgfilter.min.js"></script>
		<script type="text/javascript" src="js/jquery.svggraph.min.js"></script>
		<script type="text/javascript" src="js/jquery.svgplot.min.js"></script>
		<script type="text/javascript" src="js/jquery.svganim.min.js"></script>
		<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
		<script type="text/javascript" src="js/ie10-viewport-bug-workaround.js"></script>
		<script src= "https://player.twitch.tv/js/embed/v1.js"></script>
		<!-- Local scripts -->
		<script type="text/javascript" src="js/pages/<?php echo($gPageProps["id"]); ?>.js"></script>
		<script type="text/javascript" src="js/common.js"></script>
		<script type="text/javascript" src="js/app.js"></script>
	</body>
</html>