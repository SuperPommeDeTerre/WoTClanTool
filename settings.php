<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "settings",
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
			<h1 class="page-header" data-i18n="page.settings.title"></h1>
			<h3 class="sub-header" data-i18n="settings.twitch.url"></h3>
			<div>
				<input id="myTwitchURL" type="text" class="form-control" data-i18n="[placeholder]settings.twitch.url;" aria-describedby="sizing-addon1" value="" />
			</div>
			<h3 class="sub-header" data-i18n="settings.youtube.url"></h3>
			<div>
				<input id="myYoutubeURL" type="text" class="form-control" data-i18n="[placeholder]settings.youtube.url;" aria-describedby="sizing-addon1" value="" />
			</div>
			<button type="button" class="btn btn-info" id="btnSaveSettings"><span class="glyphicon glyphicon-floppy-disk"></span> <span data-i18n="btn.save"></span></button>
		</div>
	</div>
</div><?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>