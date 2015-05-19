<?php
require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "calendarview",
	"authenticated" => false,
	"role" => array(),
	"blocks" => array (
		"ads" => false,
		"nav" => false,
		"footer" => false
	)
);

// Get cluster
$selCluster = "EU";
if (!array_key_exists("cluster", $_REQUEST)) {
	if (array_key_exists("cluster", $_SESSION)) {
		$selCluster = $_SESSION["cluster"];
	}
} else {
	$selCluster = $_REQUEST["cluster"];
}
// Get clan ID
if (!array_key_exists("clanid", $_REQUEST)) {
	if (array_key_exists("clan_id", $_SESSION)) {
		$selClanID = $_SESSION["clan_id"];
	}
} else {
	$selClanID = $_REQUEST["clanid"];
}

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
		<script type="text/javascript">
		/* <![CDATA[ */
			var gCalendarParams = {
				cluster: <?php echo(json_encode($selCluster)); ?>,
				clanid: <?php echo(json_encode($selClanID)); ?>
			};
		/* ]]> */
		</script>
		<div class="container-fluid">
			<div class="row">
				<div class="main">
					<h3 id="agendaTitle"></h3>
					<div id="clanCalendar"></div>
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
		</div><?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>