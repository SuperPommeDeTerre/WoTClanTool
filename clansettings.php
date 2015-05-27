<?php
require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "clansettings",
	"authenticated" => true,
	"role" => array('commander'),
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
			<h1 class="page-header" data-i18n="page.clansettings.title"></h1>
			<h2 class="sub-header" data-i18n="rights.title"></h2>
			<div class="table-responsive">
				<table class="table table-hover header-fixed">
					<thead>
						<tr>
							<th data-i18n="rights.permission"></th>
							<th data-i18n="player.role.self" class="rightrole"></th>
							<th data-i18n="player.role.owner" class="rightrole"></th>
							<th data-i18n="player.role.commander" class="rightrole"></th>
							<th data-i18n="player.role.executive_officer" class="rightrole"></th>
							<th data-i18n="player.role.personnel_officer" class="rightrole"></th>
							<th data-i18n="player.role.intelligence_officer" class="rightrole"></th>
							<th data-i18n="player.role.quartermaster" class="rightrole"></th>
							<th data-i18n="player.role.combat_officer" class="rightrole"></th>
							<th data-i18n="player.role.junior_officer" class="rightrole"></th>
							<th data-i18n="player.role.recruitment_officer" class="rightrole"></th>
							<th data-i18n="player.role.private" class="rightrole"></th>
							<th data-i18n="player.role.reservist" class="rightrole"></th>
							<th data-i18n="player.role.recruit" class="rightrole"></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td colspan="14"><h3 data-i18n="rights.clansettings.title"></h3></td>
						</tr>
						<tr data-right="clansettings.view">
							<td data-i18n="rights.clansettings.view"></td>
							<td>-</td>
							<td>-</td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="commander" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="executive_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="personnel_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="intelligence_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="quartermaster" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="combat_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="junior_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruitment_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="private" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="reservist" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruit" value="true" /></label></div></td>
						</tr>
						<tr data-right="clansettings.modify">
							<td data-i18n="rights.clansettings.modify"></td>
							<td>-</td>
							<td>-</td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="commander" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="executive_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="personnel_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="intelligence_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="quartermaster" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="combat_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="junior_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruitment_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="private" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="reservist" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruit" value="true" /></label></div></td>
						</tr>
						<tr>
							<td colspan="14"><h3 data-i18n="rights.events.title"></h3></td>
						</tr>
						<tr data-right="events.create">
							<td data-i18n="rights.events.create"></td>
							<td>-</td>
							<td>-</td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="commander" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="executive_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="personnel_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="intelligence_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="quartermaster" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="combat_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="junior_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruitment_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="private" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="reservist" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruit" value="true" /></label></div></td>
						</tr>
						<tr data-right="events.modify">
							<td data-i18n="rights.events.modify"></td>
							<td>-</td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="owner" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="commander" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="executive_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="personnel_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="intelligence_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="quartermaster" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="combat_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="junior_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruitment_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="private" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="reservist" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruit" value="true" /></label></div></td>
						</tr>
						<tr data-right="events.assigntanks">
							<td data-i18n="rights.events.assigntanks"></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="self" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="owner" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="commander" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="executive_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="personnel_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="intelligence_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="quartermaster" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="combat_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="junior_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruitment_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="private" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="reservist" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruit" value="true" /></label></div></td>
						</tr>
						<tr data-right="events.assignmap">
							<td data-i18n="rights.events.assignmap"></td>
							<td>-</td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="owner" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="commander" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="executive_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="personnel_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="intelligence_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="quartermaster" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="combat_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="junior_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruitment_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="private" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="reservist" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruit" value="true" /></label></div></td>
						</tr>
						<tr>
							<td colspan="14"><h3 data-i18n="rights.strategy.title"></h3></td>
						</tr>
						<tr data-right="strategy.create">
							<td data-i18n="rights.strategy.create"></td>
							<td>-</td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="owner" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="commander" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="executive_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="personnel_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="intelligence_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="quartermaster" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="combat_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="junior_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruitment_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="private" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="reservist" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruit" value="true" /></label></div></td>
						</tr>
						<tr data-right="strategy.modify">
							<td data-i18n="rights.strategy.modify"></td>
							<td>-</td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="owner" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="commander" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="executive_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="personnel_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="intelligence_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="quartermaster" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="combat_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="junior_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruitment_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="private" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="reservist" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruit" value="true" /></label></div></td>
						</tr>
						<tr data-right="strategy.validate">
							<td data-i18n="rights.strategy.validate"></td>
							<td>-</td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="owner" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="commander" value="true" disabled="disabled" checked="checked" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="executive_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="personnel_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="intelligence_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="quartermaster" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="combat_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="junior_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruitment_officer" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="private" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="reservist" value="true" /></label></div></td>
							<td><div class="togglebutton"><label>&nbsp;<input type="checkbox" data-role="recruit" value="true" /></label></div></td>
						</tr>
					</tbody>
				</table>
			</div>
			<button type="button" class="btn btn-info btnSave"><span class="glyphicon glyphicon-floppy-disk"></span> <span data-i18n="btn.save"></span></button>
		</div>
	</div>
</div>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>