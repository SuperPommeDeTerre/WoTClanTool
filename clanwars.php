<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "clanwars",
	"authenticated" => true,
	"rights" => array(),
	"blocks" => array (
		"ads" => false,
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
			<h1 class="page-header" data-i18n="page.clanwars.title"></h1>
			<div class="center-block container-fluid" id="ctnBtnReload">
				<button type="button" class="btn btn-info" id="btnReloadCWInfos"><span class="glyphicon glyphicon-refresh"></span> <span data-i18n="btn.reloadcwinfos"></span></button>
				<div class="progress hidden">
					<div id="refreshCWprogress" class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"><span class="sr-only">0 %</span></div>
				</div>
				<p id="progressRefreshInfoMessage">&nbsp;</p>
			</div>
			<div class="container-fluid" id="ctnCWMap">
				<div class="row">
					<form class="form-inline">
						<div class="input-group">
							<span class="input-group-addon glyphicon glyphicon-flag"></span>
							<div class="btn-group">
								<button type="button" id="mapFilterFront" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="all" aria-expanded="false"><span class="btnVal" data-i18n="clanwars.fronts.all"></span> <span class="caret"></span></button>
								<ul class="dropdown-menu" role="menu">
									<li data-value="all"><a href="#" data-i18n="clanwars.fronts.all"></a></li>
									<li class="divider"></li>
								</ul>
							</div>
						</div>
						<!--
						<div class="input-group">
							<span class="input-group-addon glyphicon glyphicon-fullscreen"></span>
							<div class="btn-group">
								<button type="button" id="mapFilterSize" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="all" aria-expanded="false"><span class="btnVal" data-i18n="strat.map.allsizes"></span> <span class="caret"></span></button>
								<ul class="dropdown-menu" role="menu">
									<li data-value="all"><a href="#" data-i18n="strat.map.allsizes"></a></li>
									<li class="divider"></li>
								</ul>
							</div>
						</div>
						<div class="input-group">
							<span class="input-group-addon glyphicon glyphicon-cloud"></span>
							<div class="btn-group">
								<button type="button" id="mapFilterCamo" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="all" aria-expanded="false"><span class="btnVal" data-i18n="strat.camos.all"></span> <span class="caret"></span></button>
								<ul class="dropdown-menu" role="menu">
									<li data-value="all"><a href="#" data-i18n="strat.camos.all"></a></li>
									<li class="divider"></li>
									<li data-value="summer"><a href="#" data-i18n="strat.camos.summer"></a></li>
									<li data-value="winter"><a href="#" data-i18n="strat.camos.winter"></a></li>
									<li data-value="desert"><a href="#" data-i18n="strat.camos.desert"></a></li>
								</ul>
							</div>
						</div>
						<div class="input-group">
							<span class="input-group-addon glyphicon glyphicon-tasks"></span>
							<div class="btn-group">
								<button type="button" id="mapFilterLevel" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="all" aria-expanded="false"><span class="btnVal" data-i18n="tank.alllevels"></span> <span class="caret"></span></button>
								<ul class="dropdown-menu" role="menu">
									<li data-value="all"><a href="#" data-i18n="tank.alllevels"></a></li>
									<li class="divider"></li>
									<li data-value="1"><a href="#" data-i18n="tank.level.0"></a></li>
									<li data-value="2"><a href="#" data-i18n="tank.level.1"></a></li>
									<li data-value="3"><a href="#" data-i18n="tank.level.2"></a></li>
									<li data-value="4"><a href="#" data-i18n="tank.level.3"></a></li>
									<li data-value="5"><a href="#" data-i18n="tank.level.4"></a></li>
									<li data-value="6"><a href="#" data-i18n="tank.level.5"></a></li>
									<li data-value="7"><a href="#" data-i18n="tank.level.6"></a></li>
									<li data-value="8"><a href="#" data-i18n="tank.level.7"></a></li>
									<li data-value="9"><a href="#" data-i18n="tank.level.8"></a></li>
									<li data-value="10"><a href="#" data-i18n="tank.level.9"></a></li>
								</ul>
							</div>
						</div>
						-->
					</form>
				</div>
					<div class="row">
						<div id="cwMap"></div>
					</div>
			</div>
		</div>
	</div>
</div>
<div id="modalProvinceDetails" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title"></h4>
			</div>
			<div class="modal-body">
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal" data-i18n="btn.close"></button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<script type="text/javascript" src="js/ol.js"></script>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>