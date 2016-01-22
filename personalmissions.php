<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "personalmissions",
	"authenticated" => true,
	"role" => array(),
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
			<h1 class="page-header" data-i18n="page.personalmissions.title"></h1>
			<nav class="navbar navbar-default navbar-material-grey">
				<div class="container-fluid">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navCampaignContainer" aria-expanded="false">
							<span class="sr-only" data-i18n="nav.toggle"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
					</div>
					<div class="collapse navbar-collapse" id="navCampaignContainer">
						<ul class="nav navbar-nav" id="navCampaigns"></ul>
					</div>
				</div>
			</nav>
			<div id="OperationDetails">
			</div>
		</div>
	</div>
</div>
<div id="dialogTankDetails" class="modal fade" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" aria-hidden="true" data-dismiss="modal" type="button">&times;</button>
				<h4 class="modal-title" data-i18n="nav.tscomments"></h4>
			</div>
			<div class="modal-body">
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" data-dismiss="modal" data-i18n="btn.ok"></button>
			</div>
		</div>
	</div>
</div>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>