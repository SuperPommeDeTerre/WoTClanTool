<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

// Fill page properties
$gPageProps = array(
	"id" => "reports",
	"authenticated" => true,
	"rights" => array(),
	"blocks" => array (
		"ads" => true,
		"nav" => true,
		"footer" => true
	)
);

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
<div class="container-fluid">
	<div class="row">
		<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
			<h1 class="page-header" data-i18n="page.reports.title"></h1>
			<h2 class="sub-header" data-i18n="event.participations"></h2>
			<!--
			<div id="participationsFilter" class="form-inline">
				<select id="particpationsPeriod">
					<option value="1">1 mois</option>
					<option value="3">3 mois</option>
				</select>
			</div>
			-->
			<div class="table-responsive">
				<table class="table table-hover header-fixed" id="tableParticipations">
					<thead>
						<tr>
							<th data-i18n="player.headers.nickname"></th>
							<th data-i18n="event.enrol.state.yes"></th>
							<th data-i18n="elems.event"></th>
							<th data-i18n="action.calendar.prop.type"></th>
							<th data-i18n="event.startdate" data-sorted="true" data-sorted-direction="descending"></th>
							<th data-i18n="event.enddate"></th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<p><a class="export csv" href="#" data-rel="#tableParticipations"><span class="glyphicon glyphicon-file"></span> <span data-i18n="action.exportcsv"></span></a></p>
		</div>
	</div>
</div>
<form name="frmExport" id="frmExport" action="./server/export.php" method="POST">
	<input type="hidden" name="filename" id="filename" />
	<input type="hidden" name="data" id="data" />
</form>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>