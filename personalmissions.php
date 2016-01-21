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
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>