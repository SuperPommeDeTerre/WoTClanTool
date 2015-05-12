<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageID = "strats";

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
<div class="container-fluid">
	<div class="row">
		<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
			<h1 class="page-header" data-i18n="page.strats.title"></h1>
			<div id="stratRecap">
				<div class="btn-group" role="group">
					<button type="button" id="btnNewStrat" class="btn btn-default btn-material-green-300" data-target="#my-dialog" data-toggle="modal"><span data-i18n="strat.new"></span></button>
				</div>
				<div class="table-responsive" id="myStratsContainerTable">
					<table class="table table-hover header-fixed tableTanks" id="tableMyStrats">
						<thead>
							<tr>
								<th class="stratmap" data-i18n="strat.map.select">&nbsp;</th>
								<th class="stratname" data-i18n="strat.name"></th>
								<th class="stratdesc" data-i18n="strat.description"></th>
								<th class="stratstate" data-i18n="strat.state.title"></th>
								<th class="stratdatemod" data-i18n="strat.dateadd"></th>
								<th class="stratdatemod" data-i18n="strat.datemod"></th>
								<th class="stratcreator" data-i18n="strat.creator"></th>
								<th class="stratstatus" data-i18n="strat.state.title"></th>
								<th class="stratactions" data-i18n="strat.actions" data-sortable="false"></th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
			<div id="listMaps" class="container-fluid">
				<div class="row" id="mapsListFilter">
					<form class="form-inline">
						<div class="input-group">
							<span class="input-group-addon glyphicon glyphicon-flag"></span>
							<div class="btn-group">
								<button type="button" id="mapFilterModes" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="all" aria-expanded="false"><span class="btnVal" data-i18n="strat.modes.all"></span> <span class="caret"></span></button>
								<ul class="dropdown-menu" role="menu">
									<li data-value="all"><a href="#" data-i18n="strat.modes.all"></a></li>
									<li class="divider"></li>
									<li data-value="standard"><a href="#" data-i18n="strat.modes.standard"></a></li>
									<li data-value="encounter"><a href="#" data-i18n="strat.modes.encounter"></a></li>
									<li data-value="assault"><a href="#" data-i18n="strat.modes.assault"></a></li>
									<li data-value="confrontation"><a href="#" data-i18n="strat.modes.confrontation"></a></li>
								</ul>
							</div>
						</div>
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
					</form>
				</div>
				<div class="row" id="mapsListContainer">
				</div>
			</div>
		</div>
	</div>
</div>
<div id="stratEditor">
	<form name="frmStrat" id="frmStrat" method="POST" action="/save">
		<header>
			<nav id="menu">
				<ul>
					<li id="menuHome"><a href="home" data-i18n="[title]strat.home;"><span class="glyphicon glyphicon-home"></span></a></li>
					<li id="menuMap"><a href="map" data-i18n="[title]strat.map.selecttitle;"><span class="glyphicon glyphicon-picture"></span></a><div>
							<p data-i18n="strat.options.title"></p>
							<div class="togglebutton"><label><input type="checkbox" id="inverseTeams" name="inverseTeams" /> <span data-i18n="strat.options.inverseteams"></span></label></div>
							<div class="togglebutton"><label><input type="checkbox" name="chkGrid" id="chkGrid" checked="checked" /> <span data-i18n="strat.options.grid"></span></label></div>
							<div class="togglebutton"><label><input type="checkbox" name="chkDirections" id="chkDirections" /> <span data-i18n="strat.options.windrose"></span></label></div>
							<div class="togglebutton"><label><input type="checkbox" name="chkBases" id="chkBases" checked="checked" /> <span data-i18n="strat.options.bases"></span></label></div>
							<div class="togglebutton"><label><input type="checkbox" name="chkScale" id="chkScale" /> <span data-i18n="strat.options.scale"></span></label></div>
							<div class="togglebutton"><label><input type="checkbox" name="chkElements" id="chkElements" checked="checked" /> <span data-i18n="strat.options.elements"></span></label></div>
							<div class="togglebutton"><label><input type="checkbox" name="chkElementsTexts" id="chkElementsTexts" checked="checked" /> <span data-i18n="strat.options.elementstext"></span></label></div>
							<div class="togglebutton"><label><input type="checkbox" name="chkLines" id="chkLines" checked="checked" /> <span data-i18n="strat.options.lines"></span></label></div>
							<div class="togglebutton"><label><input type="checkbox" name="chkTexts" id="chkTexts" checked="checked" /> <span data-i18n="strat.options.texts"></span></label></div>
							<div class="togglebutton"><label><input type="checkbox" name="chkShapes" id="chkShapes" checked="checked" /> <span data-i18n="strat.options.shapes"></span></label></div>
						</div></li>
					<li id="menuEditElements"><a href="./edit" data-i18n="[title]strat.menu.elements"><span class="glyphicon glyphicon-pencil"></span></a><div></div></li>
					<li id="menuEditLines"><a href="edit/add/line" data-i18n="[title]strat.menu.lines;"><span class="glyphicon glyphicon-arrow-right"></span></a><div>
							<p><label for="thicknessSelectorLine"><span data-i18n="strat.line.thickness.title"></span>:</label> <select id="thicknessSelectorLine" class="form-control">
									<option value="1" data-i18n="strat.line.thickness.1"></option>
									<option value="2" data-i18n="strat.line.thickness.2"></option>
									<option value="3" data-i18n="strat.line.thickness.3"></option>
									<option value="5" data-i18n="strat.line.thickness.5"></option>
								</select></p>
							<p><label for="typeSelectorLine"><span data-i18n="strat.line.type.title">: </label><select id="typeSelectorLine" class="form-control">
									<option value="solid" data-i18n="strat.line.type.solid"></option>
									<option value="dotted" data-i18n="strat.line.type.dotted"></option>
									<option value="dashed" data-i18n="strat.line.type.dashed"></option>
								</select></p>
						</div></li>
					<li id="menuEditShapes"><a href="edit/add/shape" data-i18n="[title]strat.menu.shapes;"><span class="glyphicon glyphicon-record"></span></a><div>
							<ul>
								<li><a href="edit/add/shape/ellipse" data-i18n="[title]strat.shape.ellipse;" class="shape ellipse" rel="ellipse"><span data-i18n="strat.shape.ellipse"></span></a></li>
								<li><a href="edit/add/shape/rect" data-i18n="[title]strat.shape.rectangle;" class="shape rect" rel="rect"><span data-i18n="strat.shape.rectangle"></span></a></li>
								<li><a href="edit/add/shape/polygon" data-i18n="[title]strat.shape.polygon;" class="shape polygon" rel="polygon"><span data-i18n="strat.shape.polygon"></span></a></li>
							</ul>
						</div></li>
					<li id="menuEditTexts"><a href="edit/add/text" data-i18n="[title]strat.menu.texts;"><span class="glyphicon glyphicon-text-size"></span></a></li>
					<li id="menuPingMap"><a href="edit/add/ping" data-i18n="[title]strat.menu.ping;"><span class="glyphicon glyphicon-map-marker"></span></a></li>
					<!-- <li id="menuComments"><a href="edit/show/comments" data-i18n="[title]strat.menu.comments;"><span class="glyphicon glyphicon-comment"></span></a></li> -->
					<li id="menuSave"><a href="#" data-i18n="[title]strat.save;" data-toggle="modal" data-target="#saveOptions"><span class="glyphicon glyphicon-floppy-disk"></span></a></li>
				</ul>
			</nav>
		</header>
		<main>
			<div id="mapContainer">
			</div>
		</main>
	</form>
	<div id="contextMenuElement" class="contextMenu">
		<ul>
			<li><a href="/edit/move/element" class="move" data-i18n="[title]strat.action.move;"><span data-i18n="strat.action.move"></span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#textEdit" class="modifytext" data-i18n="[title]strat.action.textmodify;"><span data-i18n="strat.action.textmodify"></span></a></li>
			<li><a href="/edit/positiontext/top" class="textPosition top" data-i18n="[title]strat.action.textup;"><span data-i18n="strat.action.textup"></span></a></li>
			<li><a href="/edit/positiontext/right" class="textPosition right selected" data-i18n="[title]strat.action.textright;"><span data-i18n="strat.action.textright"></span></a></li>
			<li><a href="/edit/positiontext/bottom" class="textPosition bottom" data-i18n="[title]strat.action.textdown;"><span data-i18n="strat.action.textdown"></span></a></li>
			<li><a href="/edit/positiontext/left" class="textPosition left" data-i18n="[title]strat.action.textleft;"><span data-i18n="strat.action.textleft"></span></a></li>
			<li><a href="#" class="delete" data-toggle="modal" data-target="#dialog-confirm" data-i18n="[title]strat.action.delete;"><span data-i18n="strat.action.delete"></span></a></li>
		</ul>
	</div>
	<div id="contextMenuText" class="contextMenu">
		<ul>
			<li><a href="/edit/move/text" class="move" data-i18n="[title]strat.action.move;"><span data-i18n="strat.action.move"></span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#textEdit" class="modifytext" data-i18n="[title]strat.action.textmodify;"><span data-i18n="strat.action.textmodify"></span></a></li>
			<li><a href="/edit/modifytext/smaller" class="smallertext" data-i18n="[title]strat.action.textsmaller;"><span data-i18n="strat.action.textsmaller"></span></a></li>
			<li><a href="/edit/modifytext/bigger" class="biggertext" data-i18n="[title]strat.action.textbigger;"><span data-i18n="strat.action.textbigger"></span></a></li>
			<li><a href="#t" data-toggle="modal" data-target="#dialog-confirm" class="delete" data-i18n="[title]strat.action.delete;"><span data-i18n="strat.action.delete"></span></a></li>
		</ul>
	</div>
	<div id="contextMenuShape" class="contextMenu">
		<ul>
			<li><a href="/edit/shape/move" class="move" data-i18n="[title]strat.action.move;"><span data-i18n="strat.action.move"></span></a></li>
			<li><a href="/edit/shape/rotate" class="rotate" data-i18n="[title]strat.action.rotate;"><span data-i18n="strat.action.rotate"></span></a></li>
			<li><a href="/edit/shape/resize" class="resize" data-i18n="[title]strat.action.resize;"><span data-i18n="strat.action.resize"></span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#shapeOptions" class="options" data-i18n="[title]strat.action.options;"><span data-i18n="strat.action.options"></span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#dialog-confirm" class="delete" data-i18n="[title]strat.action.delete;"><span data-i18n="strat.action.delete"></span></a></li>
		</ul>
	</div>
	<div id="contextMenuLine" class="contextMenu">
		<ul>
			<li><a href="/edit/line/move" class="move" data-i18n="[title]strat.action.move;"><span data-i18n="strat.action.move"></span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#lineOptions" class="options" data-i18n="[title]strat.action.options;"><span data-i18n="strat.action.options"></span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#dialog-confirm" class="delete" data-i18n="[title]strat.action.delete;"><span data-i18n="strat.action.delete"></span></a></li>
		</ul>
	</div>
	<div id="dialog-confirm" class="modal fade" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-i18n="[aria-label]btn.close;">&times;</button>
					<h4 class="modal-title" data-i18n="strat.dialog.confirm.title"></h4>
				</div>
				<div class="modal-body">
					<div class="alert alert-danger" role="alert">
						<p data-i18n="strat.dialog.confirm.delete"></p>
						<p data-i18n="strat.dialog.confirm.sure"></p>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-material-grey" id="confirmBtnNo" data-dismiss="modal" data-i18n="btn.no"></button>
					<button class="btn btn-success" id="confirmBtnYes" data-dismiss="modal" data-i18n="btn.yes"></button>
				</div>
			</div>
		</div>
	</div>
	<div id="shapeOptions" class="modal fade" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-i18n="[aria-label]btn.close;">&times;</button>
					<h4 class="modal-title" data-i18n="strat.dialog.shapeoptions"></h4>
				</div>
				<div class="modal-body">
					<fieldset>
						<legend data-i18n="strat.shape.contour.title"></legend>
						<p class="rect ellipse polygon"><label><span data-i18n="strat.shape.contour.color"></span>: <input id="colorSelectorShapeContour" class="colorselector form-control" type="text" value="FFFFFF" /></label></p>
						<p class="rect ellipse polygon"><label><span data-i18n="strat.line.thickness.title"></span>: <select id="shapeContourThickness" class="form-control">
								<option value="0" data-i18n="strat.line.thickness.0"></option>
								<option value="1" data-i18n="strat.line.thickness.1" selected="selected"></option>
								<option value="2" data-i18n="strat.line.thickness.2"></option>
								<option value="3" data-i18n="strat.line.thickness.3"></option>
								<option value="5" data-i18n="strat.line.thickness.5"></option>
							</select></label></p>
						<p class="rect ellipse polygon"><label><span data-i18n="strat.shape.contour.linetype.title"></span>: <select id="shapeContourType" class="form-control">
								<option value="solid" data-i18n="strat.shape.contour.linetype.solid" selected="selected"></option>
								<option value="dotted" data-i18n="strat.shape.contour.linetype.dotted"></option>
								<option value="dashed" data-i18n="strat.shape.contour.linetype.dashed"></option>
							</select></label></p>
						<p class="rect"><label><span data-i18n="strat.shape.contour.corner.title"></span>: <select id="shapeContourRadius" class="form-control">
								<option value="0" data-i18n="strat.shape.contour.corner.0" selected="selected"></option>
								<option value="2" data-i18n="strat.shape.contour.corner.2"></option>
								<option value="5" data-i18n="strat.shape.contour.corner.5"></option>
								<option value="10" data-i18n="strat.shape.contour.corner.10"></option>
							</select></label></p>
					</fieldset>
					<fieldset>
						<legend data-i18n="strat.shape.fill.title"></legend>
						<p class="rect ellipse polygon"><label><span data-i18n="strat.shape.fill.color"></span>: <input id="colorSelectorShapeFill" class="colorselector form-control" type="text" value="333333" /></label></p>
						<p class="rect ellipse polygon"><label><span data-i18n="strat.shape.fill.type.title"></span>: <select id="shapeFillType" class="form-control">
								<option value="none" data-i18n="strat.shape.fill.type.none" selected="selected"></option>
								<option value="patternZebra" data-i18n="strat.shape.fill.type.zebra"></option>
								<option value="patternChess" data-i18n="strat.shape.fill.type.chess"></option>
								<option value="patternTriangle" data-i18n="strat.shape.fill.type.triangle"></option>
							</select></label></p>
						<p class="rect ellipse polygon"><label><span data-i18n="strat.shape.fill.opacity.title"></span>: <select id="shapeFillOpacity" class="form-control">
								<option value="1" data-i18n="strat.shape.fill.opacity.100"></option>
								<option value=".75" data-i18n="strat.shape.fill.opacity.75"></option>
								<option value=".5" data-i18n="strat.shape.fill.opacity.50" selected="selected"></option>
								<option value=".25" data-i18n="strat.shape.fill.opacity.25"></option>
								<option value="0" data-i18n="strat.shape.fill.opacity.0"></option>
							</select></label></p>
					</fieldset>
				</div>
				<div class="modal-footer">
					<button class="btn btn-material-grey" id="shapeOptionsBtnCancel" data-dismiss="modal" data-i18n="btn.cancel"></button>
					<button class="btn btn-success" id="shapeOptionsBtnOk" data-dismiss="modal" data-i18n="btn.ok"></button>
				</div>
			</div>
		</div>
	</div>
	<div id="lineOptions" class="modal fade" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-i18n="[aria-label]btn.close;">&times;</button>
					<h4 class="modal-title" data-i18n="strat.dialog.lineoptions"></h4>
				</div>
				<div class="modal-body">
					<fieldset>
						<legend data-i18n="strat.line.options"></legend>
						<p><label><span data-i18n="strat.line.color"></span>: <input id="lineColor" class="colorselector form-control" type="text" value="000000" /></label></p>
						<p><label><span data-i18n="strat.line.thickness.title"></span>: <select id="lineThickness" class="form-control">
													<option value="1" data-i18n="strat.line.thickness.1"></option>
													<option value="2" data-i18n="strat.line.thickness.2"></option>
													<option value="3" data-i18n="strat.line.thickness.3"></option>
													<option value="5" data-i18n="strat.line.thickness.5"></option>
												</select></label></p>
						<p><label><span data-i18n="strat.line.type.title"></span>: <select id="lineType" class="form-control">
								<option value="solid" data-i18n="strat.line.type.solid"></option>
								<option value="dotted" data-i18n="strat.line.type.dotted"></option>
								<option value="dashed" data-i18n="strat.line.type.dashed"></option>
							</select></label></p>
						<p><label><span data-i18n="strat.line.opacity.title"></span>: <select id="lineOpacity" class="form-control">
								<option value="1" data-i18n="strat.line.opacity.100" selected="selected"></option>
								<option value=".75" data-i18n="strat.line.opacity.75"></option>
								<option value=".5" data-i18n="strat.line.opacity.50"></option>
								<option value=".25" data-i18n="strat.line.opacity.25"></option>
							</select></label></p>
					</fieldset>
					<section class="flex flex-h">
						<aside class="flex-start">
							<fieldset>
								<legend data-i18n="strat.line.marquee.start"></legend>
								<p><label><span data-i18n="strat.line.marquee.type.title"></span>: <select id="lineMarkerStartType" class="form-control">
										<option value="none" data-i18n="strat.line.marquee.type.none" selected="selected"></option>
										<option value="markerTriangleStart" data-i18n="strat.line.marquee.type.triangle"></option>
										<option value="markerLineStart" data-i18n="strat.line.marquee.type.line"></option>
										<option value="markerSquareStart" data-i18n="strat.line.marquee.type.square"></option>
									</select></label></p>
								<p><label><span data-i18n="strat.line.marquee.color"></span>: <input id="lineMarkerStartColor" class="colorselector form-control" type="text" value="333333" /></label></p>
							</fieldset>
						</aside>
						<aside class="flex-fluid">
							<fieldset>
								<legend data-i18n="strat.line.marquee.end"></legend>
								<p><label><span data-i18n="strat.line.marquee.type.title"></span>: <select id="lineMarkerEndType"class="form-control">
										<option value="none" data-i18n="strat.line.marquee.type.none" selected="selected"></option>
										<option value="markerTriangleEnd" data-i18n="strat.line.marquee.type.triangle"></option>
										<option value="markerLineEnd" data-i18n="strat.line.marquee.type.line"></option>
										<option value="markerSquareEnd" data-i18n="strat.line.marquee.type.square"></option>
									</select></label></p>
								<p><label><span data-i18n="strat.line.marquee.color"></span>: <input id="lineMarkerEndColor" class="colorselector form-control" type="text" value="333333" /></label></p>
							</fieldset>
						</aside>
					</section>
				</div>
				<div class="modal-footer">
					<button class="btn btn-material-grey" id="lineOptionsBtnCancel" data-dismiss="modal" data-i18n="btn.cancel"></button>
					<button class="btn btn-success" id="lineOptionsBtnOk" data-dismiss="modal" data-i18n="btn.ok"></button>
				</div>
			</div>
		</div>
	</div>
	<div id="textEdit" class="modal fade" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-i18n="[aria-label]btn.close;">&times;</button>
					<h4 class="modal-title" data-i18n="strat.dialog.modifytext"></h4>
				</div>
				<div class="modal-body">
					<p><label><span data-i18n="strat.text.value"></span>: <input type="text" id="textValue" value="" class="form-control" /></label></p>
					<p><label><span data-i18n="strat.text.color"></span>: <input id="textColor" class="colorselector form-control" type="text" value="000000" /></label></p>
				</div>
				<div class="modal-footer">
					<button class="btn btn-material-grey" id="textEditBtnCancel" data-dismiss="modal" data-i18n="btn.cancel"></button>
					<button class="btn btn-success" id="textEditBtnOk" data-dismiss="modal" data-i18n="btn.ok"></button>
				</div>
			</div>
		</div>
	</div>
	<div id="saveOptions" class="modal fade" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-i18n="[aria-label]btn.close;">&times;</button>
					<h4 class="modal-title" data-i18n="strat.dialog.save.title"></h4>
				</div>
				<div class="modal-body">
					<p><input id="lblStratName" class="form-control floating-label" data-i18n="[data-hint]strat.dialog.save.name.hint;[placeholder]strat.dialog.save.name.placeholder;" type="text" /></p>
					<p><textarea id="lblStratDesc" class="form-control floating-label" data-i18n="[data-hint]strat.dialog.save.description.hint;[placeholder]strat.dialog.save.description.placeholder;"></textarea></p>
				</div>
				<div class="modal-footer">
					<button class="btn btn-material-grey" id="saveOptionsBtnCancel" data-dismiss="modal" data-i18n="btn.cancel"></button>
					<button class="btn btn-success" id="saveOptionsBtnOk" data-dismiss="modal" data-i18n="btn.ok"></button>
				</div>
			</div>
		</div>
	</div>
	<div id="shapeHandlers">
		<div class="shape options handler" id="shapeoptionshandler"></div>
	</div>
	<div id="lineHandlers"></div>
</div>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>