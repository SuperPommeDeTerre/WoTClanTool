<?php
require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = [
	"id" => "clansettings",
	"authenticated" => true,
	"rights" => [ "clansettings.view" ],
	"blocks" => [
		"ads" => true,
		"nav" => true,
		"footer" => true
	]
];

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');


// Disable inputs is the user doesn't have view permission
$isReadOnly = !WctRights::isUserHasRight("clansettings.modify");
?>
<div class="container-fluid">
	<div class="row">
		<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
			<h1 class="page-header" data-i18n="page.clansettings.title"></h1>
			<nav class="navbar navbar-material-grey-800 navbar-static-top">
				<div class="container">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-admin-navbar-collapse">
							<span class="sr-only" data-i18n="nav.toggle"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
					</div>
					<div class="collapse navbar-collapse" id="bs-admin-navbar-collapse">
						<button type="button" class="btn btn-info navbar-btn pull-right" id="btnSaveClanClanSettings"<?php echo($isReadOnly?' disabled="disabled"':''); ?>><span class="glyphicon glyphicon-floppy-disk"></span> <span data-i18n="btn.save"></span></button>
						<ul class="nav navbar-nav" role="tablist">
							<li role="presentation" class="active"><a href="#configGeneral" role="tab" aria-controls="configGeneral" data-toggle="tab" data-i18n="clansettings.general"></a></li>
							<li role="presentation"><a href="#configRights" role="tab" aria-controls="configRights" data-toggle="tab" data-i18n="rights.title"></a></li>
						</ul>
					</div>
				</div>
			</nav>
			<div class="tab-content">
				<div role="tabpanel" class="tab-pane active" id="configGeneral">
					<h2 class="sub-header" data-i18n="clansettings.general"></h2>
					<h3 data-i18n="clansettings.forumurl"></h3>
					<div class="form-group label-placeholder">
						<label for="clanForumURL" id="lblClanForumURL" class="control-label" data-i18n="clansettings.forumurl"></label>
						<input id="clanForumURL" type="text" class="form-control" aria-describedby="lblClanForumURL" value="<?php echo($gClanConfig['forumurl']); ?>"<?php echo($isReadOnly?' disabled="disabled"':''); ?> />
					</div>
					<div>
						<h3><span data-i18n="install.inactivitythreshold.title"></span> <span class="badge" id="badgeInactivityThreshold" data-i18n="install.inactivitythreshold.value" data-i18n-options="{&quot;count&quot;:<?php echo($gClanConfig['inactivitythreshold']); ?>}"></span></h3>
						<div id="sliderInactivityThreshold" style="background-color:#009688" class="slider shor slider-default"<?php echo($isReadOnly?' disabled="disabled"':''); ?>></div>
					</div>
					<h3 data-i18n="clansettings.youtube.url"></h3>
					<div class="form-group label-placeholder">
						<label for="clanYoutubeURL" id="lblYoutubeURL" class="control-label" data-i18n="clansettings.youtube.url"></label>
						<input id="clanYoutubeURL" type="text" class="form-control" aria-describedby="lblYoutubeURL" value="<?php echo($gClanConfig['youtubeurl']); ?>"<?php echo($isReadOnly?' disabled="disabled"':''); ?> />
						<span class="help-block" data-i18n="clansettings.youtube.hint"></span>
					</div>
					<h3 data-i18n="clansettings.discord.url"></h3>
					<div class="form-group label-placeholder">
						<label for="clanDiscordURL" id="lblDiscordURL" class="control-label" data-i18n="clansettings.discord.url"></label>
						<input id="clanDiscordURL" type="text" class="form-control" aria-describedby="lblDiscordURL" value="<?php echo($gClanConfig['discordurl']); ?>"<?php echo($isReadOnly?' disabled="disabled"':''); ?> />
						<span class="help-block" data-i18n="clansettings.discord.hint"></span>
					</div>
				</div>
				<div role="tabpanel" class="tab-pane" id="configRights">
					<h2 class="sub-header" data-i18n="rights.title"></h2>
					<div class="table-responsive">
						<table class="table table-hover header-fixed">
							<thead>
								<tr>
									<th data-i18n="rights.permission"></th>
									<th data-i18n="player.role.self" class="rightrole"></th>
									<th data-i18n="player.role.owner" class="rightrole"></th><?php
foreach (WctRights::$ROLES as $roleName) { ?>
									<th data-i18n="player.role.<?php echo($roleName); ?>" class="rightrole"></th><?php
} ?>
								</tr>
							</thead>
							<tbody><?php
$lClanRights = WctRights::getClanRights();
// Loop on rights categories
foreach (WctRights::$RIGHTS_MATRIX as $rightCategory => $rightsArray) { ?>
								<tr>
									<td colspan="<?php echo(count(WctRights::$ROLES) + 3); ?>"><h3 data-i18n="rights.<?php echo($rightCategory); ?>.title"></h3></td>
								</tr><?php
	// Then on individual rights
	$lClanRightsCategory = $lClanRights[$rightCategory];
	foreach ($rightsArray as $rightName => $rightProperties) { ?>
								<tr data-right="<?php echo($rightCategory); ?>.<?php echo($rightName); ?>">
									<td data-i18n="rights.<?php echo($rightCategory); ?>.<?php echo($rightName); ?>"></td><?php
		if (array_key_exists("special", $rightProperties) && in_array(WctRights::SPECIAL_ROLE_SELF, $rightProperties["special"])) {
			$isDisabled = false;
			$isChecked = false;
			// If the role is required for the right, then make it disabled and checked by default.
			if (array_key_exists("requiredroles", $rightProperties) && in_array($roleName, $rightProperties["requiredroles"])) {
				$isDisabled = true;
				$isChecked = true;
			}
			if (in_array(WctRights::SPECIAL_ROLE_SELF, $lClanRightsCategory[$rightName])) {
				$isChecked = true;
			}
			if ($isReadOnly) {
				$isDisabled = true;
			} ?>
									<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" class="rightselect" id="<?php echo($rightCategory . '.' . $rightName . '.' . WctRights::SPECIAL_ROLE_SELF); ?>" data-role="<?php echo(WctRights::SPECIAL_ROLE_SELF); ?>" data-category="<?php echo($rightCategory); ?>" data-rightname="<?php echo($rightName); ?>" value="true"<?php echo($isDisabled?'  disabled="disabled"':''); echo($isChecked?' checked="checked"':''); ?> /></label></div></td><?php
		} else { ?>
									<td>-</td><?php
		}
		if (array_key_exists("special", $rightProperties) && in_array(WctRights::SPECIAL_ROLE_OWNER, $rightProperties["special"])) {
			$isDisabled = false;
			$isChecked = false;
			// If the role is required for the right, then make it disabled and checked by default.
			if (array_key_exists("requiredroles", $rightProperties) && in_array($roleName, $rightProperties["requiredroles"])) {
				$isDisabled = true;
				$isChecked = true;
			}
			if (in_array(WctRights::SPECIAL_ROLE_OWNER, $lClanRightsCategory[$rightName])) {
				$isChecked = true;
			}
			if ($isReadOnly) {
				$isDisabled = true;
			} ?>
									<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" class="rightselect" id="<?php echo($rightCategory . '.' . $rightName . '.' . WctRights::SPECIAL_ROLE_OWNER); ?>" data-role="<?php echo(WctRights::SPECIAL_ROLE_OWNER); ?>" data-category="<?php echo($rightCategory); ?>" data-rightname="<?php echo($rightName); ?>" value="true"<?php echo($isDisabled?'  disabled="disabled"':''); echo($isChecked?' checked="checked"':''); ?> /></label></div></td><?php
			} else { ?>
									<td>-</td><?php
		}

		// And finally on roles
		foreach (WctRights::$ROLES as $roleName) {
			$isDisabled = false;
			$isChecked = false;
			// If the role is required for the right, then make it disabled and checked by default.
			if (array_key_exists("requiredroles", $rightProperties) && in_array($roleName, $rightProperties["requiredroles"])) {
				$isDisabled = true;
				$isChecked = true;
			}
			if (in_array($roleName, $lClanRightsCategory[$rightName])) {
				$isChecked = true;
			}
			if ($isReadOnly) {
				$isDisabled = true;
			} ?>
									<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" class="rightselect" id="<?php echo($rightCategory . '.' . $rightName . '.' . $roleName); ?>" data-role="<?php echo($roleName); ?>" data-category="<?php echo($rightCategory); ?>" data-rightname="<?php echo($rightName); ?>" value="true"<?php echo($isDisabled?'  disabled="disabled"':''); echo($isChecked?' checked="checked"':''); ?> /></label></div></td><?php
		}
	} ?>
								</tr><?php
}
?>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>