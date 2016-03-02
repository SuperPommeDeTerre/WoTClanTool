<?php
require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "weekview",
	"authenticated" => true,
	"role" => array(),
	"blocks" => array (
		"ads" => false,
		"nav" => false,
		"footer" => false
	)
);

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
<div class="container-fluid">
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
				<button class="btn btn-default" data-dismiss="modal" data-i18n="btn.close"></button>
				<button class="btn btn-primary hidden" id="btnModifyEventOk" data-i18n="btn.ok"></button>
			</div>
		</div>
	</div>
</div><?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>