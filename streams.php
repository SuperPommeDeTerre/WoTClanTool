<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "streams",
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
			<h1 class="page-header"><span class="glyphicon glyphicon-film"></span> <span data-i18n="page.<?php echo($gPageProps['id']); ?>.title"></span></h1>
			<h2 class="twitch">Twitch</h2>
			<div class="hidden panel panel-default">
				<div id="twitchPlayerContainer" class="panel-body embed-responsive embed-responsive-16by9"></div>
			</div>
			<script src="http://www.gmodules.com/ig/ifr?url=http://www.google.com/ig/modules/youtube.xml&amp;up_channel=QuickyBabyTV&amp;synd=open&amp;w=320&amp;h=390&amp;title=&amp;border=%23ffffff%7C3px%2C1px+solid+%23999999&amp;output=js"></script>
			<!-- <h2>Youtube</h2> -->
			<div id="youtubeContainer"></div>
		</div>
	</div>
</div><?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>