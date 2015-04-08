<?php
require(dirname(__FILE__) . '/server/global.php');

$gPageID = "strats";

include(dirname(__FILE__) . '/themes/' . $gThemeName . '/header.php');
?>
<div id="stratRecap">
	<div class="container-fluid">
		<div class="row">
			<div class="main">
				<h1 class="page-header" data-i18n="page.strat.title"></h1>
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
								<th class="stratactions" data-i18n="strat.actions" data-sortable="false"></th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
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
							<p><label for="selMap" data-i18n="strat.map.select" class="fortext" for="selMap"></label> <select id="selMap" name="selMap" class="form-control"></select></p>
							<p><label for="selMode" data-i18n="strat.map.mode" class="fortext" for="selMode"></label> <select id="selMode" name="selMode" class="form-control"></select></p>
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
					<li id="menuEditElements"><a href="./edit" data-i18n="[title]strat.menu.elements"><span class="glyphicon glyphicon-pencil"></span></a><div>
						</div></li>
					<li id="menuEditLines"><a href="edit/add/line" data-i18n="[title]strat.menu.lines;"><span class="glyphicon glyphicon-arrow-right"></span></a><div>
							<p><label for="thicknessSelectorLine">Epaisseur&nbsp;:</label> <select id="thicknessSelectorLine" class="form-control">
									<option value="1">1 pixel</option>
									<option value="2">2 pixels</option>
									<option value="3">3 pixels</option>
									<option value="5">5 pixels</option>
								</select></p>
							<p><label for="typeSelectorLine">Type&nbsp;: </label><select id="typeSelectorLine" class="form-control">
									<option value="solid">Pleine</option>
									<option value="dotted">Pointill&eacute;</option>
									<option value="dashed">Tirets</option>
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
			<li><a href="/edit/move/element" class="move" title="D&eacute;placer l'&eacute;l&eacute;ment"><span>D&eacute;placer</span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#textEdit" class="modifytext" title="Modifier le texte de l'&eacute;l&eacute;ment"><span>Modifier le texte</span></a></li>
			<li><a href="/edit/positiontext/top" class="textPosition top" title="Placer le texte en haut de l'&eacute;l&eacute;ment"><span>Texte en haut</span></a></li>
			<li><a href="/edit/positiontext/right" class="textPosition right selected" title="Placer le texte &agrave; droite de l'&eacute;l&eacute;ment"><span>Texte &agrave; droite</span></a></li>
			<li><a href="/edit/positiontext/bottom" class="textPosition bottom" title="Placer le texte en bas de l'&eacute;l&eacute;ment"><span>Texte en bas</span></a></li>
			<li><a href="/edit/positiontext/left" class="textPosition left" title="Placer le texte &agrave; gauche de l'&eacute;l&eacute;ment"><span>Texte &agrave; gauche</span></a></li>
			<li><a href="#" class="delete" data-toggle="modal" data-target="#dialog-confirm" title="Supprimer l'&eacute;l&eacute;ment"><span>Supprimer</span></a></li>
		</ul>
	</div>
	<div id="contextMenuText" class="contextMenu">
		<ul>
			<li><a href="/edit/move/text" class="move" title="D&eacute;placer le texte"><span>D&eacute;placer</span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#textEdit" class="modifytext" title="Modifier le texte"><span>Modifier le texte</span></a></li>
			<li><a href="/edit/modifytext/smaller" class="smallertext" title="Texte plus petit"><span>Texte plus petit</span></a></li>
			<li><a href="/edit/modifytext/bigger" class="biggertext" title="Texte plus grand"><span>Texte plus grand</span></a></li>
			<li><a href="#t" data-toggle="modal" data-target="#dialog-confirm" class="delete" title="Supprimer le texte"><span>Supprimer</span></a></li>
		</ul>
	</div>
	<div id="contextMenuShape" class="contextMenu">
		<ul>
			<li><a href="/edit/shape/move" class="move" title="D&eacute;placer la forme"><span>D&eacute;placer</span></a></li>
			<li><a href="/edit/shape/rotate" class="rotate" title="Tourner"><span>Tourner</span></a></li>
			<li><a href="/edit/shape/resize" class="resize" title="Redimensionner"><span>Redimensionner</span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#shapeOptions" class="options" title="Options de la forme"><span>Options</span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#dialog-confirm" class="delete" title="Supprimer la forme"><span>Supprimer</span></a></li>
		</ul>
	</div>
	<div id="contextMenuLine" class="contextMenu">
		<ul>
			<li><a href="/edit/line/move" class="move" title="D&eacute;placer le point"><span>D&eacute;placer</span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#lineOptions" class="options" title="Options de la ligne"><span>Options</span></a></li>
			<li><a href="#" data-toggle="modal" data-target="#dialog-confirm" class="delete" title="Supprimer la ligne"><span>Supprimer</span></a></li>
		</ul>
	</div>
	<div id="dialog-confirm" class="modal fade" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
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
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					<h4 class="modal-title" data-i18n="strat.dialog.shapeoptions"></h4>
				</div>
				<div class="modal-body">
					<fieldset>
						<legend>Contour</legend>
						<p class="rect ellipse polygon"><label>Couleur&nbsp;: <input id="colorSelectorShapeContour" class="colorselector form-control" type="text" value="FFFFFF" /></label></p>
						<p class="rect ellipse polygon"><label>Epaisseur&nbsp;: <select id="shapeContourThickness" class="form-control">
								<option value="0">0 (Aucun trait)</option>
								<option value="1" selected="selected">1 pixel</option>
								<option value="2">2 pixels</option>
								<option value="3">3 pixels</option>
								<option value="5">5 pixels</option>
							</select></label></p>
						<p class="rect ellipse polygon"><label>Type de trait&nbsp;: <select id="shapeContourType" class="form-control">
								<option value="solid" selected="selected">Plein</option>
								<option value="dotted">Pointill&eacute;s</option>
								<option value="dashed">Tirets</option>
							</select></label></p>
						<p class="rect"><label>Rayon&nbsp;: <select id="shapeContourRadius" class="form-control">
								<option value="0" selected="selected">Aucun</option>
								<option value="2">2 pixels</option>
								<option value="5">5 pixels</option>
								<option value="10">10 pixels</option>
							</select></label></p>
					</fieldset>
					<fieldset>
						<legend>Remplissage</legend>
						<p class="rect ellipse polygon"><label>Couleur&nbsp;: <input id="colorSelectorShapeFill" class="colorselector form-control" type="text" value="333333" /></label></p>
						<p class="rect ellipse polygon"><label>Type&nbsp;: <select id="shapeFillType" class="form-control">
								<option value="none" selected="selected">Aucun</option>
								<option value="patternZebra">Zebra</option>
								<option value="patternChess">Damier</option>
								<option value="patternTriangle">Triangle</option>
							</select></label></p>
						<p class="rect ellipse polygon"><label>Opacit&eacute;&nbsp;: <select id="shapeFillOpacity" class="form-control">
								<option value="1">100 %</option>
								<option value=".75">75 %</option>
								<option value=".5" selected="selected">50 %</option>
								<option value=".25">25 %</option>
								<option value="0">0 % (Invisible)</option>
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
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					<h4 class="modal-title" data-i18n="strat.dialog.lineoptions"></h4>
				</div>
				<div class="modal-body">
					<fieldset>
						<legend>Options g&eacute;n&eacute;rales</legend>
						<p><label>Couleur&nbsp;: <input id="lineColor" class="colorselector form-control" type="text" value="000000" /></label></p>
						<p><label>Epaisseur&nbsp;: <select id="lineThickness" class="form-control">
													<option value="1">1 pixel</option>
													<option value="2">2 pixels</option>
													<option value="3">3 pixels</option>
													<option value="5">5 pixels</option>
												</select></label></p>
						<p><label>Type&nbsp;: <select id="lineType" class="form-control">
								<option value="solid">Pleine</option>
								<option value="dotted">Pointill&eacute;</option>
								<option value="dashed">Tirets</option>
							</select></label></p>
						<p><label>Opacit&eacute;&nbsp;: <select id="lineOpacity" class="form-control">
								<option value="1" selected="selected">100 %</option>
								<option value=".75">75 %</option>
								<option value=".5">50 %</option>
								<option value=".25">25 %</option>
							</select></label></p>
					</fieldset>
					<section class="flex flex-h">
						<aside class="flex-start">
							<fieldset>
								<legend>Marqueur de d&eacute;but</legend>
								<p><label>Type&nbsp;: <select id="lineMarkerStartType" class="form-control">
										<option value="none" selected="selected">Aucun</option>
										<option value="markerTriangleStart">Triangle</option>
										<option value="markerLineStart">Ligne</option>
										<option value="markerSquareStart">Carr&eacute;</option>
									</select></label></p>
								<p><label>Couleur&nbsp;: <input id="lineMarkerStartColor" class="colorselector form-control" type="text" value="333333" /></label></p>
							</fieldset>
						</aside>
						<aside class="flex-fluid">
							<fieldset>
								<legend>Marqueur de fin</legend>
								<p><label>Type&nbsp;: <select id="lineMarkerEndType"class="form-control">
										<option value="none" selected="selected">Aucun</option>
										<option value="markerTriangleEnd">Triangle</option>
										<option value="markerLineEnd">Ligne</option>
										<option value="markerSquareEnd">Carr&eacute;</option>
									</select></label></p>
								<p><label>Couleur&nbsp;: <input id="lineMarkerEndColor" class="colorselector form-control" type="text" value="333333" /></label></p>
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
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					<h4 class="modal-title" data-i18n="strat.dialog.modifytext"></h4>
				</div>
				<div class="modal-body">
					<p><label>Texte&nbsp;: <input type="text" id="textValue" value="" class="form-control" /></label></p>
					<p><label>Couleur&nbsp;: <input id="textColor" class="colorselector form-control" type="text" value="000000" /></label></p>
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
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
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
include(dirname(__FILE__) . '/themes/' . $gThemeName . '/footer.php');
?>