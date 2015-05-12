var onLoad = function() {
	checkConnected();
	function Comet(pUrl, pCluster, pClanId) {
		this.timestamp = 0;
		this.url = pUrl;
		this.dodisconnect = false;
		this.stratid = -1;
		this.cluster = pCluster;
		this.clanid = pClanId;
	};
	Comet.prototype.initialize = function() {};
	Comet.prototype.connect = function(pStratId) {
		this.stratid = pStratId;
		var myObj = this;
		if (!myObj.dodisconnect) {
			$.get(myObj.url, { 'timestamp': myObj.timestamp, 'cluster': myObj.cluster, 'clanid': myObj.clanid, 'stratid': myObj.stratid }, function(resultData) {
				// handle the server response
				myObj.timestamp = resultData.timestamp;
				myObj.handleResponse(resultData);
			}, 'json')
			.fail(function() {
				setTimeout(function() { myObj.connect(myObj.stratid) }, 5000);
			})
			.done(function() {
				myObj.connect(myObj.stratid);
			});
		} else {
			myObj.dodisconnect = false;
		}
	};
	Comet.prototype.disconnect = function() {
		this.dodisconnect = true;
	};
	Comet.prototype.handleResponse = function(response) {
		if (typeof(response.coords) != 'undefined') {
			var myCanvas = myCanvasContainer.svg().svg('get'),
				myCircle = myCanvas.circle(response.coords.x, response.coords.y, 10, { 'fill': 'red', 'fill-opacity': .75, 'stroke': 'red', 'strokeWidth': 5, 'stroke-opacity': 1 });
			$(myCircle).animate({ svgR: '+=100', svgFillOpacity: 0.1, svgStrokeOpacity: 0.1 }, 1000, function() {
				$(this).remove();
			});
		}
	};
	Comet.prototype.doRequest = function(pCoords) {
		$.get(this.url, { 'coords': pCoords, 'cluster': this.cluster, 'clanid': this.clanid, 'stratid': this.stratid }, function(data) {}, 'json');
	};

	var comet = new Comet('./server/stratping.php', gConfig.CLUSTER, gPersonalInfos.clan_id);

	progressNbSteps = 4;
	advanceProgress(i18n.t('loading.claninfos'));
	setNavBrandWithClan();
	// Global variables to store configuration
	var myGameToken = 'wot',
		gGames = null,
		gModes = null,
		gMaps = null,
		gElements = null,
		gCurrentConf = {},
		myResizedElement = null,
		myRotatedElement = null,
		myDraggedElement = null,
		myDraggedElementWidth = 0,
		myDraggedElementHeight = 0,
		myDraggedPointIndex = -1,
		gCountElems = {},
		gCountTexts = 0,
		gCountLines = 0,
		gCurrentElement = null,
		gIsImporting = false,
		gIsDrawingLine = false,
		gCurrentLine = null,
		gCurrentLineConf = null,
		gIsReadOnly = false,
		gStratId = -1,
		myListStrats = {};

	// Constants
	var gDECAL_GRID = 20,
		gCHAR_CODE_A = "A".charCodeAt(0),
		gCHAR_CODE_1 = "1".charCodeAt(0),
		gWIND_ROSE_SIZE = 100,
		gDROP_ZONE_BORDER = 30,
		gNB_COLS = 10,
		gNB_ROWS = 10,
		gIMPORT_TIMEOUT = 100,
		gRECT_MIN_WIDTH = 10,
		gRECT_MIN_HEIGHT = 10;

	/**
	 * Main function
	 */
	var myMapsContainer = $('#listMaps'),
		myCanvasContainer = $("#mapContainer"),
		myContextMenus = $(".contextMenu"),
		myContextMenuElement = $("#contextMenuElement"),
		myContextMenuText = $("#contextMenuText"),
		myContextMenuShape = $("#contextMenuShape"),
		myContextMenuLine = $("#contextMenuLine"),
		myShapeHandlers = $("#shapeHandlers"),
		myShapeOptions = $("#shapeOptions"),
		myShapeOptionsHandler = $("#shapeoptionshandler"),
		myLineOptions = $("#lineOptions"),
		myLineHandler = $("#shapeoptionshandler"),
		preventClosingContextMenu = false,
		timeoutIdContextMenu = 0;

	// Click on main but not on canvas
	$("main").on("click", function(e) {
		if (gCurrentLine !== null) {
			// Remove the last point
			gCurrentLineConf.points.pop();
			// Add the line only if there is more than 1 point
			if (gCurrentLineConf.points.length > 1) {
				$(gCurrentLine).remove();
				addLine(gCurrentLineConf);
				$(gCurrentLine).removeClass("drawing");
			} else {
				// If there is only one point, then remove the line from the configuration
				var myTmpElement = $(gCurrentLine),
					myElementIndex = myTmpElement.data("index");
				myTmpElement.remove();
				// Remove object from global configuration
				gCurrentConf.lines.splice(myElementIndex, 1);
			}
			gCurrentLine = null;
			gCurrentLineConf = null;
			myDraggedPointIndex = -1;
			gIsDrawingLine = false;
		}
	});

	function applyShorBehavior(pElemShor) {
		var myElem = pElemShor,
			myElemSilderOptions = {
				start: 0,
				step: 1,
				range: {
					min: 0,
					max: 2
				}
			},
			myStratId = pElemShor.closest('tr').data('stratid');
		for (i=0; i<myListStrats.length; i++) {
			myStrat = myListStrats[i];
			if (myStrat.id == myStratId) {
				break;
			}
		}
		switch (myStrat.state) {
			case 'private':
				myElemSilderOptions.start = 0;
				break;
			case 'review':
				myElemSilderOptions.start = 1;
				break;
			case 'public':
				myElemSilderOptions.start = 2;
				break;
		}
		pElemShor.noUiSlider(myElemSilderOptions);
		pElemShor.on({
			set: function(evt) {
				var myLine = pElemShor.closest('tr'),
					myNewState = '';
				switch (parseInt(pElemShor.val())) {
					case 0:
						if (gConfig.PLAYER_ID == myStrat.creator) {
							myNewState = 'private';
						} else {
							myNewState = 'review';
							pElemShor.val(1);
						}
						break;
					case 1:
						myNewState = 'review';
						break;
					case 2:
						myNewState = 'public';
						break;
				}
				pElemShor.tooltip('hide')
					.attr('data-original-title', i18n.t('strat.state.' + myNewState))
					.tooltip('fixTitle')
					.tooltip('show');
				$.post('./server/strat.php', {
					'action': 'setstratprops',
					'id': myStratId,
					'state': myNewState
				}, function(dataSaveStratResponse) {
					myStrat.state = myNewState;
					switch (myStrat.state) {
						case 'private':
							myLine.find('.btnDeleteStrat,.btnEditStrat').show();
							break;
						case 'review':
							myLine.find('.btnDeleteStrat').hide();
							myLine.find('.btnEditStrat').show();
							break;
						case 'public':
							myLine.find('.btnDeleteStrat,.btnEditStrat').hide();
							break;
					}
					pElemShor.closest('tr').find('.stratstatelib').text(i18n.t('strat.state.' + myStrat.state));
				}, 'json');
			}
		});
	}

	/**
	 * Init SVG with a map and a mode.
	 */
	function initMap(pMapToken, pMode) {
		var myMapObj = gMaps[pMapToken];
		gCurrentConf.map = pMapToken;
		gCurrentConf.mode = pMode;
		// Set the map image and resize it to its real size (1px = 1m)
		myCanvasContainer.css("background-image", "url('./res/" + myGameToken + "/maps/" + myMapObj.file + "')")
			.css("background-position", gDECAL_GRID + "px " + gDECAL_GRID + "px")
			.css("background-size", myMapObj.size.x + "px " + myMapObj.size.y + "px")
			.css("background-repeat", "no-repeat")
			.width(myMapObj.size.x + gDECAL_GRID + "px")
			.height(myMapObj.size.y + gDECAL_GRID + "px");
		// Remove groups and trigger events
		$("#gridOverlay").remove();
		$("#chkGrid").change();
		$("#scaleOverlay").remove();
		$("#chkScale").change();
		$("#windRoseOverlay, #elementsOverlay, #linesOverlay, #shapesOverlay, #textsOverlay").remove();
		$("#chkDirections").change();
		$("#mapDesc .mapName").text(i18n.t('strat.maps.' + pMapToken));
		$("#mapDesc .mapMetrics").text(myMapObj.size.x + "m x " + myMapObj.size.y + "m");
		$("#mapDesc .mapSquareLength").text("(1px = 1m)");
		var myCanvas = myCanvasContainer.svg().svg("get");
		// Update size of svg element
		myCanvasContainer.children("svg").attr("width", myMapObj.size.x + gDECAL_GRID);
		myCanvasContainer.children("svg").attr("height", myMapObj.size.y + gDECAL_GRID);
		myCanvas.group(null, "elementsOverlay", {});
		myCanvas.group(null, "linesOverlay", {});
		myCanvas.group(null, "shapesOverlay", {});
		myCanvas.group(null, "textsOverlay", {});
		if (!gIsImporting) {
			gCurrentConf.inverse = false;
			gCurrentConf.elements = [];
			gCurrentConf.texts = [];
			gCurrentConf.shapes = [];
			gCurrentConf.lines = [];
		}
		for (myElementToken in gElements) {
			gCountElems[myElementToken] = 0;
		}
		$("#basesOverlay").remove();
		if (gIsImporting) {
			var i = 0;
			for (i = 0; i<gCurrentConf.elements.length; i++) {
				addElement(gCurrentConf.elements[i], i);
			}
			for (i = 0; i<gCurrentConf.texts.length; i++) {
				addText(gCurrentConf.texts[i], i);
			}
			for (i = 0; i<gCurrentConf.shapes.length; i++) {
				addShape(gCurrentConf.shapes[i], i);
			}
			gIsDrawingLine = true;
			for (i = 0; i<gCurrentConf.lines.length; i++) {
				addLine(gCurrentConf.lines[i], i);
			}
			$("#linesOverlay .drawing").removeClass("drawing");
			gIsDrawingLine = false;
		}
		if (gIsReadOnly) {
			$('#menuMap, #menuEditElements, #menuEditLines, #menuEditShapes, #menuEditTexts, #menuSave').hide();
		} else {
			$('#menuMap, #menuEditElements, #menuEditLines, #menuEditShapes, #menuEditTexts, #menuSave').show();
		}
		if (gStratId != -1) {
			$('#menuPingMap').show();
			comet.connect(gStratId);
		} else {
			$('#menuPingMap').hide();
		}
		$("#chkBases").change();
	}

	/**
	 * Initialization of the SVG Canvas
	 * Here lies the definitions of the patterns, markers, etc.
	 */
	function initSvg() {
		var myCanvas = myCanvasContainer.svg().svg("get"),
			myDefs = myCanvas.defs(),
			myPattern = null,
			myMarker = null;
		// ***************************************************************
		// Patterns
		// ***************************************************************
		// Diagonal stroke pattern
		myPattern = myCanvas.pattern(myDefs, "patternZebra", 0, 0, 20, 20, { "patternUnits": "userSpaceOnUse" });
		myCanvas.polygon(myPattern, [[0, 0], [0, 5], [5, 0]], {});
		myCanvas.polygon(myPattern, [[20, 20], [15, 20], [20, 15]], {});
		myCanvas.polygon(myPattern, [[15, 0], [20, 0], [20, 5], [5, 20], [0, 20], [0, 15]], {});
		// Chess pattern
		myPattern = myCanvas.pattern(myDefs, "patternChess", 0, 0, 20, 20, { "patternUnits": "userSpaceOnUse" });
		myCanvas.polygon(myPattern, [[0, 0], [0, 10], [10, 10], [10, 0]], {});
		myCanvas.polygon(myPattern, [[10, 10], [10, 20], [20, 20], [20, 10]], {});
		// Triangle pattern
		myPattern = myCanvas.pattern(myDefs, "patternTriangle", 0, 0, 10, 10, { "patternUnits": "userSpaceOnUse" });

		myCanvas.polygon(myPattern, [[5, 0], [10, 10], [0, 10]], {});
		// ***************************************************************
		// Markers
		// ***************************************************************
		// Triangle marker
		myMarker = myCanvas.marker(myDefs, "markerTriangleStart", 1.9, 2, 2, 4);
		myCanvas.path(myMarker, "M2,0 V4 L0,2 Z", {"fill": "red"});
		myMarker = myCanvas.marker(myDefs, "markerTriangleEnd", 0.1, 2, 2, 4);
		myCanvas.path(myMarker, "M0,0 V4 L2,2 Z", {"fill": "red"});
		// Line marker
		myMarker = myCanvas.marker(myDefs, "markerLineStart", 1.9, 2, 1, 4);
		myCanvas.path(myMarker, "M2,0 V4 Z", {"fill": "red","stroke": "red","stroke-width": "5px"});
		myMarker = myCanvas.marker(myDefs, "markerLineEnd", 0.1, 2, 1, 4);
		myCanvas.path(myMarker, "M0,0 V4 Z", {"fill": "red","stroke": "red","stroke-width": "5px"});
	};

	/**
	 * Sets the position of a shape
	 *
	 * @param pShape
	 *     The jQuery object of a shape
	 * @param pPos
	 *     The position to set
	 * @return The shape
	 */
	function setShapePos(pShape, pPos) {
		var myTransform = pShape.attr("transform");
		if (myTransform) {
			pShape.attr("transform", "translate(" + pPos.x + " " + pPos.y + ")" + myTransform.substr(myTransform.indexOf(")") + 1));
		} else if (pShape.is("rect")) {
			pShape.attr("x", pPos.x).attr("y", pPos.y);
		} else if (pShape.is("ellipse")) {
			pShape.attr("cx", pPos.x).attr("cy", pPos.y);
		}
		pShape.data("x", pPos.x).data("y", pPos.y);
		return pShape;
	};

	/**
	 * Gets the position of a shape
	 *
	 * @return { x, y }
	 */
	function getShapePos(pShape) {
		var myTransform = pShape.attr("transform");
		if (myTransform) {
			var myIndexTranslate = myTransform.indexOf("translate(");
			if (myIndexTranslate >= 0) {
				myTransform = myTransform.substr(myTransform.indexOf("translate(") + 10);
				myTransform = myTransform.substr(0, myTransform.indexOf(")"));
				var myDims = myTransform.split(/ /g);
				return {
					"x": myDims[0] * 1,
					"y": myDims[1] * 1
				}
			}
		}
		if (pShape.is("rect")) {
			return {
				"x": pShape.attr("x") * 1,
				"y": pShape.attr("y") * 1
			}
		} else if (pShape.is("ellipse")) {
			return {
				"x": pShape.attr("cx") * 1,
				"y": pShape.attr("cy") * 1
			}
		}
	};

	/**
	 * Adds an element to the map
	 *
	 * @param pConfElement
	 *     The element to add
	 * @param pIndex
	 *     The index of the element in the configuration (used during import)
	 */
	function addElement(pConfElement, pIndex) {
		var myElem = gElements[pConfElement.type]["team" + pConfElement.team],
			myCanvas = myCanvasContainer.svg().svg("get"),
			g = myCanvasContainer.find("#elementsOverlay").svg(),
			myElemId = "element_" + pConfElement.type + "_" + pConfElement.team + "_" + gCountElems[pConfElement.type]++,
			myElemTextId = myElemId + "_text",
			myImage = myCanvas.image(g, pConfElement.position.x, pConfElement.position.y, myElem.size.x, myElem.size.y, "./res/" + gCurrentConf.game + "/elements/" + myElem.file, { "id": myElemId, "rel": myElemTextId }),
			myText = myCanvas.text(g, pConfElement.text.position.x, pConfElement.text.position.y, pConfElement.text.value, { "id": myElemTextId, "rel": myElemId });
		myImage = $(myImage);
		myText = $(myText);
		myImage.addClass("movable hasMenuElement");
		myText.addClass("movable hasMenuElement " + pConfElement.text.position.rel);
		myImage.add(myText).on("mouseenter", function(e) {
			if (!gIsReadOnly) {
				if (!$(this).hasClass("moving") && myDraggedElement === null) {
					myContextMenuElement.css("top", ((myImage.attr("y") * 1) + myCanvasContainer[0].offsetTop + 15) + "px")
						.css("left", ((myImage.attr("x") * 1) + myCanvasContainer[0].offsetLeft + 20) + "px")
						.attr("rel", myImage.attr("id"));
					// Udpate context menu with element state
					var myLinksTextPosition = myContextMenuElement.find(".textPosition").removeClass("selected");
					// FIXME: Fix weird bug: myLinksTextPosition.find(".textPosition.top") is not working...
					if (myText.hasClass("top")) {
						$(myLinksTextPosition[0]).addClass("selected");
						pConfElement.text.position.rel = "top";
					} else if (myText.hasClass("right")) {
						$(myLinksTextPosition[1]).addClass("selected");
						pConfElement.text.position.rel = "right";
					} else if (myText.hasClass("bottom")) {
						$(myLinksTextPosition[2]).addClass("selected");
						pConfElement.text.position.rel = "bottom";
					} else {
						$(myLinksTextPosition[3]).addClass("selected");
						pConfElement.text.position.rel = "left";
					}
					gCurrentElement = pConfElement;
					myContextMenuElement.show();
					// Keep menu open for 200ms
					preventClosingContextMenu = true;
					timeoutIdContextMenu = window.setTimeout(function() {
						preventClosingContextMenu = false;
					}, 200);
				}
			}
		}).on("mouseleave", function(e) {
			if (!preventClosingContextMenu) {
				myContextMenuElement.hide();
			}
		});
		// Update serialization
		if (!gIsImporting) {
			gCurrentConf.elements.push(pConfElement);
			myImage.data("index", gCurrentConf.elements.length - 1);
		} else {
			myImage.data("index", pIndex);
		}
	};

	/**
	 * Adds a text to the map
	 *
	 * @param pConfText
	 *     The text to add
	 * @param pIndex
	 *     The index of the text in the configuration (used during import)
	 */
	function addText(pConfText, pIndex) {
		var myCanvas = myCanvasContainer.svg().svg("get"),
			g = myCanvasContainer.find("#textsOverlay").svg(),
			myElemTextId = "text_" + gCountTexts++,
			myText = myCanvas.text(g, pConfText.position.x, pConfText.position.y, pConfText.value, { "id": myElemTextId });
		myText = $(myText);
		myText.on("mouseenter", function(e) {
			if (!gIsReadOnly) {
				if (!$(this).hasClass("moving") && myDraggedElement === null) {
					myContextMenuText.css("top", ((myText.attr("y") * 1) + myCanvasContainer[0].offsetTop) + "px")
						.css("left", ((myText.attr("x") * 1) + myCanvasContainer[0].offsetLeft) + "px")
						.attr("rel", myText.attr("id"));
					gCurrentElement = pConfText;
					myContextMenuText.show();
					// Keep menu open for 200ms
					preventClosingContextMenu = true;
					timeoutIdContextMenu = window.setTimeout(function() {
						preventClosingContextMenu = false;
					}, 200);
				}
			}
		}).on("mouseleave", function(e) {
			if (!preventClosingContextMenu) {
				myContextMenuText.hide();
			}
		});
		// Update serialization
		if (!gIsImporting) {
			gCurrentConf.texts.push(pConfText);
			myText.data("index",  gCurrentConf.texts.length - 1);
		} else {
			myText.data("index", pIndex);
		}
	};

	/**
	 * Adds a shape to the map
	 *
	 * @param pConfShape
	 *     The shape to add
	 * @param pIndex
	 *     The index of the shape in the configuration (used during import)
	 */
	function addShape(pConfShape, pIndex) {
		var myCanvas = myCanvasContainer.svg().svg("get"),
			g = myCanvasContainer.find("#shapesOverlay").svg(),
			myElemId = "shape_" + gCountTexts++,
			myShape = null,
			myShapeHandles = null;
		switch (pConfShape.type) {
			case "ellipse":
				myShape = myCanvas.ellipse(g, pConfShape.position.x, pConfShape.position.y, pConfShape.rx, pConfShape.ry, { "id": myElemId });
				break;
			case "polygon":
				// TODO
				myShape = myCanvas.rect(g, pConfShape.position.x, pConfShape.position.y, 50, 50, $("#cornerRadiusSize").val() * 1, $("#cornerRadiusSize").val() * 1, { "id": myElemId });
				break;
			case "rect":
			default:
				myShape = myCanvas.rect(g, pConfShape.position.x, pConfShape.position.y, pConfShape.width, pConfShape.height, pConfShape.rx, pConfShape.ry, { "id": myElemId });
				break;
		}
		myShape = $(myShape);
		myShape.data("x", pConfShape.position.x);
		myShape.data("y", pConfShape.position.y);
		for (myStyle in pConfShape.style) {
			myShape.css(myStyle, pConfShape.style[myStyle]);
		}
		switch (pConfShape.type) {
			case "polygon":
				// TODO
				break;
			case "ellipse":
				myShape.on("mouseenter", function(e) {
					if (!gIsReadOnly) {
						if (!$(this).hasClass("moving") && myDraggedElement === null && !$(this).hasClass("resizing") && myResizedElement === null && !$(this).hasClass("rotating") && myRotatedElement === null) {
							var myShapePositionX = myShape.data("x"),
								myShapePositionY = myShape.data("y"),
								myShapeRadiusX = myShape.attr("rx") * 1,
								myShapeRadiusY = myShape.attr("ry") * 1;
							myShapeOptionsHandler.css("top", (myShapePositionY + myCanvasContainer[0].offsetTop - 8) + "px")
								.css("left", (myShapePositionX + myCanvasContainer[0].offsetLeft - 8) + "px")
								.on("mouseenter", function(e) {
									myContextMenuShape.css("top", (myShapePositionY + myCanvasContainer[0].offsetTop - 8) + "px")
										.css("left", (myShapePositionX + myCanvasContainer[0].offsetLeft - 8) + "px")
										.attr("rel", myShape.attr("id"));
									$(this).hide();
									myContextMenuShape.show();
									// Keep menu open for 200ms
									preventClosingContextMenu = true;
									timeoutIdContextMenu = window.setTimeout(function() {
										preventClosingContextMenu = false;
									}, 200);
								}).show();
							myShapeOptionsHandler.parent().attr("rel", myShape.attr("id"));
							gCurrentElement = pConfShape;
							myShapeHandlers.show();
						}
					}
				});
				break;
			case "rect":
			default:
				myShape.on("mouseenter", function(e) {
					if (!gIsReadOnly) {
						if (!$(this).hasClass("moving") && myDraggedElement === null && !$(this).hasClass("resizing") && myResizedElement === null && !$(this).hasClass("rotating") && myRotatedElement === null) {
							var myShapePositionX = myShape.data("x"),
								myShapePositionY = myShape.data("y"),
								myShapeWidth = myShape.attr("width") * 1,
								myShapeHeight = myShape.attr("height") * 1;
							myShapeOptionsHandler.css("top", (myShapePositionY + myCanvasContainer[0].offsetTop + (myShapeHeight / 2) - 8) + "px")
								.css("left", (myShapePositionX + myCanvasContainer[0].offsetLeft + (myShapeWidth / 2) - 8) + "px")
								.on("mouseenter", function(e) {
									myContextMenuShape.css("top", (myShapePositionY + myCanvasContainer[0].offsetTop + (myShapeHeight / 2) - 8) + "px")
										.css("left", (myShapePositionX + myCanvasContainer[0].offsetLeft + (myShapeWidth / 2) - 8) + "px")
										.attr("rel", myShape.attr("id"));
									$(this).hide();
									myContextMenuShape.show();
									// Keep menu open for 200ms
									preventClosingContextMenu = true;
									timeoutIdContextMenu = window.setTimeout(function() {
										preventClosingContextMenu = false;
									}, 200);
								}).show();
							myShapeOptionsHandler.parent().attr("rel", myShape.attr("id"));
							gCurrentElement = pConfShape;
							myShapeHandlers.show();
						}
					}
				});
				break;
		}
		myShape.on("mouseleave", function(e) {
			if (!preventClosingContextMenu) {
				myContextMenuShape.hide();
				myShapeOptionsHandler.hide();
			}
		});
		// Update serialization
		if (!gIsImporting) {
			gCurrentConf.shapes.push(pConfShape);
			myShape.data("index",  gCurrentConf.shapes.length - 1);
		} else {
			myShape.data("index", pIndex);
		}
	};

	/**
	 * Adds a line to the map
	 *
	 * @param pConfLine
	 *     The line to add
	 * @param pIndex
	 *     The index of the line in the configuration (used during import)
	 */
	function addLine(pConfLine, pIndex) {
		var myCanvas = myCanvasContainer.svg().svg("get"),
			g = myCanvasContainer.find("#linesOverlay").svg(),
			myElemId = "line_" + gCountLines++,
			myLine = null,
			myLineHandlers = null;
		if (gIsDrawingLine) {
			if (pConfLine.points.length > 1) {
				// We're adding a segment to the line
				myElemId = "line_" + --gCountLines;
				gCurrentConf.lines.pop();
			}
			var myLineProps = {};
			for (var myLinePropName in pConfLine.props) {
				switch (myLinePropName) {
					case "marker-start":
					case "marker-end":
						myLineProps[myLinePropName] = "url(#" + pConfLine.props[myLinePropName] + ")";
						break;
					default:
						myLineProps[myLinePropName] = pConfLine.props[myLinePropName];
						break;
				}
			}
			myLine = myCanvas.polyline(g, pConfLine.points, myLineProps);
			for (var myLinePropName in pConfLine.style) {
				$(myLine).css(myLinePropName, pConfLine.style[myLinePropName]);
			}
			$(myLine).addClass("drawing");
			$(myLine).attr("id", myElemId);
			gCurrentLine = myLine;
		}
		// Update serialization
		myLine = $(myLine);
		var myHandlersHtml = "";
		for (var myPointIndex in pConfLine.points) {
			myHandlersHtml += "<div class=\"handler point" + myPointIndex + "\" rel=\"" + myPointIndex + "\" style=\"left:" + (pConfLine.points[myPointIndex][0] + myCanvasContainer[0].offsetLeft - 8) + "px;top:" + (pConfLine.points[myPointIndex][1] + myCanvasContainer[0].offsetTop - 8) + "px\"></div>";
		}
		myLine.on("mouseenter", function(e) {
			if (!gIsReadOnly) {
				if (!gIsDrawingLine) {
					myLineHandlers = $("#lineHandlers").empty().html(myHandlersHtml).show().find(".handler");
					myLineHandlers.on("mouseenter", function(e) {
						myContextMenuLine.css("top", $(this).css("top")).css("left", $(this).css("left"))
							.attr("rel", myLine.attr("id"));
						myContextMenuLine.data("point-index", $(this).attr("rel") * 1);
						myContextMenuLine.show();
						// Keep menu open for 200ms
						preventClosingContextMenu = true;
						timeoutIdContextMenu = window.setTimeout(function() {
							preventClosingContextMenu = false;
						}, 200);
					});
					gCurrentElement = pConfLine;
				}
			}
		}).on("mouseleave", function(e) {
			if (!preventClosingContextMenu) {
				myContextMenuLine.hide();
				$("#lineHandlers").hide();
			}
		});
		if (!gIsImporting) {
			gCurrentConf.lines.push(pConfLine);
			myLine.data("index",  gCurrentConf.lines.length - 1);
		} else {
			myLine.data("index", pIndex);
		}
	};

	/**
	 * Compute a stroke-dasharray property for a line/border.
	 *
	 * @param pStrokeType
	 *     Stroke type to use
	 * @param pStrokeWidth
	 *     Stroke width in use
	 * @return The stroke-dasharray matching the parameters
	 */
	function getStrokeDashArray(pStrokeType, pStrokeWidth) {
		switch (pStrokeType) {
			case "dashed":
				return (pStrokeWidth * 3) + "," + (pStrokeWidth * 3);
				break;
			case "dotted":
				return pStrokeWidth + "," + pStrokeWidth;
				break;
		}
		return "";
	};

	/**
	 * Remove existing dividers to maps list and apply new dividers.
	 */
	function applyMapsDividers() {
		myMapsContainer.find('#mapsListContainer .clearfix').remove();
		myMapsContainer.find('#mapsListContainer .mappreview').not('.hidden').each(function(index, elem) {
			// Handle row breaks
			var myMapsDividerHtml = '';
			if (index > 0) {
				if (index % 2 == 0) {
					myMapsDividerHtml += '<div class="clearfix visible-xs-block"></div>';
				}
				if (index % 3 == 0) {
					myMapsDividerHtml += '<div class="clearfix visible-md-block"></div>';
				}
				if (index % 4 == 0) {
					myMapsDividerHtml += '<div class="clearfix visible-lg-block"></div>';
				}
				if (myMapsDividerHtml !== '') {
					$(elem).before(myMapsDividerHtml);
				}
			}
		});
	};

	// Initialize the SVG and the events handlers
	initSvg();
	myShapeOptionsHandler.children("div").on("mouseleave", function() {
		myShapeOptionsHandler.hide();
	});

	// Handle resize of shapes
	myContextMenuShape.find(".resize").on("click", function(e) {
		myResizedElement = $("#" + myContextMenuShape.attr("rel")).addClass("resizing");
		myResizedElement.data("originalposx", myResizedElement.data("x"));
		myResizedElement.data("originalposy", myResizedElement.data("y"));
	});
	// Handle rotation of shapes
	myContextMenuShape.find(".rotate").on("click", function(e) {
		myRotatedElement = $("#" + myContextMenuShape.attr("rel")).addClass("rotating");
	});
	$("#menu a").click(function(e) {
		e.preventDefault();
	});
	$("#menuEditElements > a,#menuEditTexts > a,#menuEditLines > a,#menuEditShapes > a,#menuPingMap > a").on("click", function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();
		var myLink = $(this),
			isAlreadySelected = myLink.hasClass("selected"),
			myLinks = $("#menu a.selected").removeClass("selected");
		if (!isAlreadySelected) {
			myLink.addClass("selected");
			if (myLink.attr("rel")) {
				myLink.next().find("[rel=" + myLink.attr("rel") + "]").addClass("selected");
			}
		} else if (gIsDrawingLine) {
			gIsDrawingLine = false;
			if (gCurrentLine != null) {
				$(gCurrentLine).removeClass("drawing");
				gCurrentLine = null;
				gCurrentLineConf = null;
			}
		}
	});
	$("#menuEditElements a").on("click", function(e) {
		var myLink = $(this),
			mySelectedElement = myLink.next().find(".selected").removeClass("selected");
		myLink.removeClass("selected " + mySelectedElement.attr("rel")).removeAttr("rel");
	});
	$("#menuEditShapes").find(".shape").click(function(e) {
		$("#menuEditShapes > a").attr("class", "");
		if (!$(this).hasClass("selected")) {
			$("#menu .selected").removeClass("selected");
			$("#menuEditShapes > a").addClass($(this).attr("rel") + " selected").attr("rel", $(this).attr("rel"));
		} else {
			$("#menuEditShapes > a").removeAttr("rel");
		}
		$(this).toggleClass("selected");
	});
	myContextMenuText.find(".smallertext").on("click", function(e) {
		var myText = $("#" + myContextMenuText.attr("rel")),
			myFontSize = myText.css("font-size");
		if (myFontSize) {
			myFontSize = myFontSize.split(/px/g)[0] * 1;
		} else {
			myFontSize = 16;
		}
		myText.css("font-size", (myFontSize - 2) + "px");
	});
	myContextMenuText.find(".biggertext").on("click", function(e) {
		var myText = $("#" + myContextMenuText.attr("rel")),
			myFontSize = myText.css("font-size");
		if (myFontSize) {
			myFontSize = myFontSize.split(/px/g)[0] * 1;
		} else {
			myFontSize = 16;
		}
		myText.css("font-size", (myFontSize + 2) + "px");
	});
	myContextMenuLine.find(".options").on("click", function(e) {
		var myLine = $("#" + myContextMenuLine.attr("rel"));
		// Handle init of line form with line properties
		if (gCurrentElement.style["stroke"]) {
			$("#lineColor").val(gCurrentElement.style["stroke"].substr(gCurrentElement.style["stroke"].lastIndexOf("#") + 1));
		} else {
			$("#lineColor").val("00FF00");
		}
		if (gCurrentElement.style["stroke-width"]) {
			$("#lineThickness").val(gCurrentElement.style["stroke-width"].substring(0, gCurrentElement.style["stroke-width"].indexOf("px")));
		} else {
			$("#lineThickness").val("1");
		}
		if (gCurrentElement.style["stroke-dasharray"]) {
			$("#lineType").val(gCurrentElement.style["stroke-dasharray"].split(/,/g)[0] * 1 > $("#colorSelectorShapeContour").val() * 1?"dashed":"dotted");
		} else {
			$("#lineType").val("solid");
		}
		if (gCurrentElement.style["stroke-opacity"]) {
			$("#lineOpacity").val(gCurrentElement.style["stroke-opacity"]);
		} else {
			$("#lineOpacity").val("1");
		}
		if (gCurrentElement.props["marker-start"]) {
			$("#lineMarkerStartType").val(gCurrentElement.props["marker-start"]);
		} else {
			$("#lineMarkerStartType").val("none");
		}
		if (gCurrentElement.props["marker-end"]) {
			$("#lineMarkerEndType").val(gCurrentElement.props["marker-end"]);
		} else {
			$("#lineMarkerEndType").val("none");
		}
		// TODO: Handle markers color (need clone of markers)

		// Show dialog
		$('#lineOptionsBtnOk').off('click').on('click', function(evt) {
			var myStrokeWidth = $("#lineThickness").val(),
				myStrokeColor = $("#lineColor").val(),
				myStrokeOpacity = $("#lineOpacity").val(),
				myStrokeType = $("#lineType").val(),
				myMarkerStartType = $("#lineMarkerStartType").val(),
				myMarkerEndType = $("#lineMarkerEndType").val();
			gCurrentElement.style["stroke-width"] = myStrokeWidth + "px";
			gCurrentElement.style["stroke"] = "#" + myStrokeColor;
			gCurrentElement.style["stroke-opacity"] = myStrokeOpacity;
			gCurrentElement.style["stroke-dasharray"] = getStrokeDashArray(myStrokeType, myStrokeWidth);
			myLine.css("stroke-width", gCurrentElement.style["stroke-width"]);
			myLine.css("stroke", gCurrentElement.style["stroke"]);
			myLine.css("stroke-dasharray", gCurrentElement.style["stroke-dasharray"]);
			myLine.css("stroke-opacity", gCurrentElement.style["stroke-opacity"]);
			// Handle properties
			if (myMarkerStartType === "none") {
				delete gCurrentElement.props["marker-start"];
				myLine.removeAttr("marker-start");
			} else {
				gCurrentElement.props["marker-start"] = myMarkerStartType;
				myLine.attr("marker-start", "url(#" + myMarkerStartType + ")");
			}
			if (myMarkerEndType === "none") {
				delete gCurrentElement.props["marker-end"];
				myLine.removeAttr("marker-end");
			} else {
				gCurrentElement.props["marker-end"] = myMarkerEndType;
				myLine.attr("marker-end", "url(#" + myMarkerEndType + ")");
			}
		});
	});
	myContextMenuShape.find(".options").on("click", function(e) {
		var myShape = $("#" + myContextMenuShape.attr("rel"));
		myShapeOptions.find("p").show().filter(function(index) {
			return !$(this).hasClass(myShape.prop("nodeName").toLowerCase());
		}).hide();
		// Handle init of shape form with shape properties
		if (gCurrentElement.style["stroke"]) {
			$("#colorSelectorShapeContour").val(gCurrentElement.style["stroke"].substr(gCurrentElement.style["stroke"].lastIndexOf("#") + 1));
		} else {
			$("#colorSelectorShapeContour").val("FFFFFF");
		}
		if (gCurrentElement.style["stroke-width"]) {
			$("#shapeContourThickness").val(gCurrentElement.style["stroke-width"].substring(0, gCurrentElement.style["stroke-width"].indexOf("px")));
		} else {
			$("#shapeContourThickness").val("1");
		}
		if (gCurrentElement.style["stroke-dasharray"]) {
			$("#shapeContourType").val(gCurrentElement.style["stroke-dasharray"].split(/,/g)[0] * 1 > $("#colorSelectorShapeContour").val() * 1?"dashed":"dotted");
		} else {
			$("#shapeContourType").val("solid");
		}
		if (gCurrentElement["rx"]) {
			$("#shapeContourRadius").val(gCurrentElement["rx"]);
		} else {
			$("#shapeContourRadius").val("0");
		}
		if (gCurrentElement.style["fill"]) {
			$("#colorSelectorShapeFill").val(gCurrentElement.style["fill"].substr(gCurrentElement.style["fill"].lastIndexOf("#") + 1));
			if (gCurrentElement.style["fill"].lastIndexOf("url(") >= 0) {
				var myPatternName = gCurrentElement.style["fill"].substring(gCurrentElement.style["fill"].indexOf("#") + 1);
				myPatternName = myPatternName.substring(0, myPatternName.indexOf(")"));
				$("#shapeFillType").val(myPatternName);
			} else {
				$("#shapeFillType").val("none");
			}
		} else {
			$("#colorSelectorShapeFill").val("333333");
			$("#shapeFillType").val("none");
		}
		if (gCurrentElement.style["fill-opacity"]) {
			$("#shapeFillOpacity").val(gCurrentElement.style["fill-opacity"]);
		} else {
			$("#shapeFillOpacity").val(".5");
		}
		// Show dialog
		$('#shapeOptionsBtnOk').off('click').on('click', function(evt) {
			var myFillPattern = $("#shapeFillType").val(),
				myFillColor = $("#colorSelectorShapeFill").val(),
				myFillOpacity = $("#shapeFillOpacity").val(),
				myStrokeWidth = $("#shapeContourThickness").val(),
				myStrokeColor = $("#colorSelectorShapeContour").val(),
				myStrokeRadius = $("#shapeContourRadius").val(),
				myStrokeType = $("#shapeContourType").val();
			gCurrentElement.style["fill-opacity"] = myFillOpacity;
			// FIXME: Apply a fill color with a pattern
			if (myFillPattern !== "none") {
				gCurrentElement.style["fill"] = "url(#" + myFillPattern + ") #" + myFillColor;
			} else {
				gCurrentElement.style["fill"] = "#" + myFillColor;
			}
			gCurrentElement.style["stroke-width"] = myStrokeWidth + "px";
			gCurrentElement.style["stroke"] = "#" + myStrokeColor;
			if (myShape.is("rect")) {
				gCurrentElement.rx = myStrokeRadius;
				gCurrentElement.ry = myStrokeRadius;
				myShape.attr("rx", gCurrentElement.rx);
				myShape.attr("ry", gCurrentElement.ry);
			}
			gCurrentElement.style["stroke-dasharray"] = getStrokeDashArray(myStrokeType, myStrokeWidth);
			myShape.css("fill", gCurrentElement.style["fill"]);
			myShape.css("fill-opacity", gCurrentElement.style["fill-opacity"]);
			myShape.css("stroke-width", gCurrentElement.style["stroke-width"]);
			myShape.css("stroke", gCurrentElement.style["stroke"]);
			myShape.css("stroke-dasharray", gCurrentElement.style["stroke-dasharray"]);
		});
	});
	$("#inverseTeams").on("change", function(e) {
		var elemsTeam1 = myCanvasContainer.find(".team1"),
			elemsTeam2 = myCanvasContainer.find(".team2");
		elemsTeam1.removeClass("team1").addClass("team2");
		elemsTeam2.removeClass("team2").addClass("team1");
		if (!gIsImporting) {
			gCurrentConf.inverse = !gCurrentConf.inverse;
		}
	});
	$(document).on("submit", "form", function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();
	});
	// Manage context menus
	myContextMenus.on("mouseenter", function(e) {
		preventClosingContextMenu = true;
		window.clearTimeout(timeoutIdContextMenu);
	}).on("mouseleave", function(e) {
		preventClosingContextMenu = false;
		myContextMenus.hide();
	});
	myContextMenus.find("a").not("[data-target]").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
	});
	myContextMenus.find(".move").on("click", function(e) {
		var myContextMenu = $(this).closest(".contextMenu");
		if (myContextMenu.is("#contextMenuLine")) {
			// It's a line point, we must only move the point
			myDraggedPointIndex = myContextMenu.data("point-index");
			gCurrentLine = $("#" + myContextMenu.attr("rel")).addClass("drawing");
			gCurrentLineConf = gCurrentElement;
			gIsDrawingLine = true;
		} else if (myDraggedElement === null) {
			myDraggedElement = $("#" + myContextMenu.attr("rel"));
			myDraggedElementWidth = myDraggedElement.attr("width");
			myDraggedElementHeight = myDraggedElement.attr("height");
			myDraggedElement = myDraggedElement.add($("#" + myDraggedElement.attr("rel")));
			myDraggedElement.addClass("moving");
			myContextMenu.hide();
		}
	});
	myContextMenus.find(".delete").on("click", function(e) {
		var myContextMenu = $(this).closest(".contextMenu");
		$('#confirmBtnYes').off('click').on('click', function(evt) {
			if (myContextMenu.is("#contextMenuElement")) {
				var myTmpElement = $("#" + myContextMenu.attr("rel")),
					myElementIndex = myTmpElement.data("index");
				myTmpElement = myTmpElement.add($("#" + myTmpElement.attr("rel")));
				myTmpElement.remove();
				// Remove object from global configuration
				gCurrentConf.elements.splice(myElementIndex, 1);
				$("#elementsOverlay image").each(function(i, el) {
					if ($(el).data("index") > myElementIndex) {
						$(el).data("index", $(el).data("index") - 1);
					}
				});
			} else if (myContextMenu.is("#contextMenuText")) {
				var myTmpElement = $("#" + myContextMenu.attr("rel")),
					myElementIndex = myTmpElement.data("index");
				myTmpElement.remove();
				// Remove object from global configuration
				gCurrentConf.texts.splice(myElementIndex, 1);
				$("#textsOverlay text:not([rel])").each(function(i, el) {
					if ($(el).data("index") > myElementIndex) {
						$(el).data("index", $(el).data("index") - 1);
					}
				});
			} else if (myContextMenu.is("#contextMenuShape")) {
				var myTmpElement = $("#" + myContextMenu.attr("rel")),
					myElementIndex = myTmpElement.data("index");
				myTmpElement.remove();
				// Remove object from global configuration
				gCurrentConf.shapes.splice(myElementIndex, 1);
				$("#shapesOverlay *:not([rel])").each(function(i, el) {
					if ($(el).data("index") > myElementIndex) {
						$(el).data("index", $(el).data("index") - 1);
					}
				});
			} else if (myContextMenu.is("#contextMenuLine")) {
				var myTmpElement = $("#" + myContextMenu.attr("rel")),
					myElementIndex = myTmpElement.data("index");
				myTmpElement.remove();
				// Remove object from global configuration
				gCurrentConf.lines.splice(myElementIndex, 1);
			}
			myContextMenu.hide();
		});
	});
	myContextMenuText.find(".modifytext").on("click", function(e) {
		// Handle text modify
		var myText = $("#" + myContextMenuText.attr("rel"));
		$("#textValue").val(myText.text());
		if (myText.css("stroke") !== "none") {
			$("#textColor").val(myText.css("stroke").substr(1));
		} else {
			$("#textColor").val("FFFFFF");
		}
		$('#textEditBtnOk').off('click').on('click', function(evt) {
			if ($("#textValue").val().trim().length === 0) {
				// The text is deleted if it's empty
				myText.remove();
				// Remove text from global configuration
				var myElementIndex = myText.data("index");
				gCurrentConf.texts.splice(myElementIndex, 1);
				$("#textsOverlay text:not([rel])").each(function(i, el) {
					if ($(el).data("index") > myElementIndex) {
						$(el).data("index", $(el).data("index") - 1);
					}
				});
			} else {
				myText.text($("#textValue").val());
				gCurrentElement.value = myText.text();
				myText.css("fill", "#" + $("#textColor").val());
			}
		});
	});
	myContextMenuElement.find(".modifytext").on("click", function(e) {
		// Handle text modify
		var myImage = $("#" + myContextMenuElement.attr("rel")),
			myText = $("#" + myImage.attr("rel")),
			myImagePosX = (myImage.attr("x") * 1),
			myImageWidth = (myImage.attr("width") * 1);
		$("#textValue").val(myText.text());
		if (myText.css("fill") !== "none") {
			$("#textColor").val(myText.css("fill").substr(1));
		} else {
			$("#textColor").val("FFFFFF");
		}
		$('#textEditBtnOk').off('click').on('click', function(evt) {
			myText.text($("#textValue").val());
			myText.css("fill", "#" + $("#textColor").val());
			gCurrentElement.text.value = myText.text();
			myTextWidth = myText[0].getComputedTextLength();
			if (myText.hasClass("top")) {
				myText.attr("x", myImagePosX + (myImageWidth / 2) - (myTextWidth / 2));
				gCurrentElement.text.position.x = myText.attr("x") * 1;
			} else if (myText.hasClass("bottom")) {
				myText.attr("x", myImagePosX + (myImageWidth / 2) - (myTextWidth / 2));
				gCurrentElement.text.position.x = myText.attr("x") * 1;
			} else if (myText.hasClass("left")) {
				myText.attr("x", myImagePosX - myTextWidth);
				gCurrentElement.text.position.x = myText.attr("x") * 1;
			}
		});
	});
	myContextMenuElement.find(".textPosition").on("click", function(e) {
		var myLink = $(this);
		if (!myLink.hasClass("selected")) {
			var myImage = $("#" + myContextMenuElement.attr("rel")),
				myText = $("#" + myImage.attr("rel")),
				myImagePosX = (myImage.attr("x") * 1),
				myImagePosY = (myImage.attr("y") * 1),
				myImageWidth = (myImage.attr("width") * 1),
				myImageHeight = (myImage.attr("height") * 1),
				myTextWidth = myText[0].getComputedTextLength();
			myText.removeClass("top bottom left right");
			if (myLink.hasClass("top")) {
				myText.attr("x", myImagePosX + (myImageWidth / 2) - (myTextWidth / 2));
				myText.attr("y", myImagePosY);
				gCurrentElement.text.position.rel = "top";
				gCurrentElement.text.position.x = myText.attr("x") * 1;
				gCurrentElement.text.position.y = myText.attr("y") * 1;
				myText.addClass("top");
			} else if (myLink.hasClass("bottom")) {
				myText.attr("x", myImagePosX + (myImageWidth / 2) - (myTextWidth / 2));
				myText.attr("y", myImagePosY + myImageHeight + 10);
				gCurrentElement.text.position.rel = "bottom";
				gCurrentElement.text.position.x = myText.attr("x") * 1;
				gCurrentElement.text.position.y = myText.attr("y") * 1;
				myText.addClass("bottom");
			} else if (myLink.hasClass("left")) {
				myText.attr("x", myImagePosX - myTextWidth);
				myText.attr("y", myImagePosY + (myImageHeight / 2) + 7);
				gCurrentElement.text.position.rel = "left";
				gCurrentElement.text.position.x = myText.attr("x") * 1;
				gCurrentElement.text.position.y = myText.attr("y") * 1;
				myText.addClass("left");
			} else {
				myText.attr("x", myImagePosX + myImageWidth);
				myText.attr("y", myImagePosY + (myImageHeight / 2) + 7);
				gCurrentElement.text.position.rel = "right";
				gCurrentElement.text.position.x = myText.attr("x") * 1;
				gCurrentElement.text.position.y = myText.attr("y") * 1;
				myText.addClass("right");
			}
			myContextMenuElement.find(".textPosition").removeClass("selected");
			myLink.addClass("selected");
		}
	});
	myCanvasContainer.on("click", function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();
		if (myDraggedElement !== null) {
			myDraggedElement.removeClass("moving");
			myDraggedElement = null;
			myDraggedElementWidth = 0;
			myDraggedElementHeight = 0;
			return;
		} else if (myResizedElement !== null) {
			myResizedElement.removeClass("resizing");
			myResizedElement = null;
			return;
		} else if (myRotatedElement !== null) {
			myRotatedElement.removeClass("rotating");
			myRotatedElement = null;
			return;
		} else if (myDraggedPointIndex !== -1) {
			myDraggedPointIndex = -1;
			$(gCurrentLine).removeClass("drawing");
			gCurrentLine = null;
			gCurrentLineConf = null;
			gIsDrawingLine = false;
			return;
		}
		var selectedItem = $("#menuEditElements div .selected");
		if (selectedItem.length === 0) {
			selectedItem = $("#menuEditShapes div .selected");
			if (selectedItem.length === 0) {
				selectedItem = $("#menu .selected");
			}
		}
		if (selectedItem.is("a")) {
			var myItemProps = selectedItem.attr("href").split(/\//g),
				i = 0;
			switch (myItemProps[2]) {
				case "element":
					var elementType = myItemProps[3],
						elementTeam = myItemProps[4],
						myElem = gElements[elementType]["team" + elementTeam];
					// Update serialization
					addElement({
						"type": elementType,
						"team": elementTeam,
						"position": {
							"x": e.pageX - myCanvasContainer[0].offsetLeft - (myElem.size.x / 2),
							"y": e.pageY - myCanvasContainer[0].offsetTop - (myElem.size.y / 2)
						},
						"text": {
							"value": selectedItem.text() + " " + (gCountElems[elementType] + 1),
							"position": {
								"rel": "right",
								"x": e.pageX - myCanvasContainer[0].offsetLeft + (myElem.size.x / 2),
								"y": e.pageY - myCanvasContainer[0].offsetTop + 7
							}
						}
					});
					break;
				case "line":
					if (!gIsDrawingLine) {
						gIsDrawingLine = true;
						gCurrentLineConf = {
							"points": [
								[ e.pageX - myCanvasContainer[0].offsetLeft, e.pageY - myCanvasContainer[0].offsetTop ]
							],
							"style": {
								"stroke-width": $("#thicknessSelectorLine").val() + "px",
								"stroke-dasharray": getStrokeDashArray($("#typeSelectorLine").val(), $("#thicknessSelectorLine").val())
							},
							"props": {}
						};
						addLine(gCurrentLineConf);
					} else {
						gCurrentLineConf.points.push([ e.pageX - myCanvasContainer[0].offsetLeft, e.pageY - myCanvasContainer[0].offsetTop ]);
						$(gCurrentLine).remove();
						addLine(gCurrentLineConf);
					}
					break;
				case "shape":
					var myShapeConf = {
						"type": myItemProps[3],
						"position": {
							"x": e.pageX - myCanvasContainer[0].offsetLeft,
							"y": e.pageY - myCanvasContainer[0].offsetTop
						},
						"style": {}
					}
					switch (myShapeConf.type) {
						case "ellipse":
							myShapeConf.rx = 25;
							myShapeConf.ry = 25;
							break;
						case "polygon":
							break;
						case "rect":
							myShapeConf.width = 50;
							myShapeConf.height = 50;
							myShapeConf.rx = 0;
							myShapeConf.ry = 0;
							break;
					}
					addShape(myShapeConf);
					break;
				case "text":
					addText({
						"value": "Texte " + gCountTexts,
						"position": {
							"x": e.pageX - myCanvasContainer[0].offsetLeft,
							"y": e.pageY - myCanvasContainer[0].offsetTop
						},
						"style": {}
					});
					break;
				case "ping":
					comet.doRequest(JSON.stringify({
							"x": e.pageX - myCanvasContainer[0].offsetLeft,
							"y": e.pageY - myCanvasContainer[0].offsetTop
						}));
					break;
				default:
					break;
			}
		}
	})
	// Handle movement, rotation and resize of items
	.on("mousemove", function(e) {
		if (myDraggedElement !== null) {
			myDraggedElement.each(function(i, el) {
				var elem = $(el);
				if (elem.is("image")) {
					elem.attr("x", e.pageX - myCanvasContainer[0].offsetLeft - (myDraggedElementWidth / 2));
					elem.attr("y", e.pageY - myCanvasContainer[0].offsetTop - (myDraggedElementHeight / 2));
					gCurrentElement.position.x = elem.attr("x") * 1;
					gCurrentElement.position.y = elem.attr("y") * 1;
					elem.data("x", gCurrentElement.position.x);
					elem.data("y", gCurrentElement.position.y);
				} else if (elem.is("text")) {
					if (gCurrentElement.text) {
						// Attached text
						if (elem.hasClass("top")) {
							elem.attr("x", e.pageX - myCanvasContainer[0].offsetLeft - (myDraggedElementWidth / 2) + 12 - (elem[0].getComputedTextLength() / 2));
							elem.attr("y", e.pageY - myCanvasContainer[0].offsetTop - 12);
						} else if (elem.hasClass("bottom")) {
							elem.attr("x", e.pageX - myCanvasContainer[0].offsetLeft - (myDraggedElementWidth / 2) + 12 - (elem[0].getComputedTextLength() / 2));
							elem.attr("y", e.pageY - myCanvasContainer[0].offsetTop + 21);
						} else if (elem.hasClass("left")) {
							elem.attr("x", e.pageX - myCanvasContainer[0].offsetLeft - (myDraggedElementWidth / 2) - elem[0].getComputedTextLength());
							elem.attr("y", e.pageY - myCanvasContainer[0].offsetTop + 7);
						} else {
							elem.attr("x", e.pageX - myCanvasContainer[0].offsetLeft + (myDraggedElementWidth / 2));
							elem.attr("y", e.pageY - myCanvasContainer[0].offsetTop + 7);
						}
						gCurrentElement.text.position.x = elem.attr("x") * 1;
						gCurrentElement.text.position.y = elem.attr("y") * 1;
						elem.data("x", gCurrentElement.text.position.x);
						elem.data("y", gCurrentElement.text.position.y);
					} else {
						// Plain text
						elem.attr("x", e.pageX - myCanvasContainer[0].offsetLeft);
						elem.attr("y", e.pageY - myCanvasContainer[0].offsetTop);
						gCurrentElement.position.x = elem.attr("x") * 1;
						gCurrentElement.position.y = elem.attr("y") * 1;
						elem.data("x", gCurrentElement.position.x);
						elem.data("y", gCurrentElement.position.y);
					}
				} else if (elem.is("rect")) {
					gCurrentElement.position.x = e.pageX - myCanvasContainer[0].offsetLeft - elem.attr("width") / 2;
					gCurrentElement.position.y = e.pageY - myCanvasContainer[0].offsetTop - elem.attr("height") / 2;
					setShapePos(elem, gCurrentElement.position);
				} else if (elem.is("ellipse")) {
					gCurrentElement.position.x = e.pageX - myCanvasContainer[0].offsetLeft;
					gCurrentElement.position.y = e.pageY - myCanvasContainer[0].offsetTop;
					setShapePos(elem, gCurrentElement.position);
				}
			});
		} else if (myResizedElement !== null) {
			if (myResizedElement.is("rect")) {
				var actualWidth = myResizedElement.attr("width") * 1,
					actualHeight = myResizedElement.attr("height") * 1,
					actualPosX = myResizedElement.data("x"),
					actualPosY = myResizedElement.data("y"),
					newWidth = e.pageX - myCanvasContainer[0].offsetLeft - myResizedElement.data("originalposx"),
					newHeight = e.pageY - myCanvasContainer[0].offsetTop - myResizedElement.data("originalposy"),
					newPosX = actualPosX,
					newPosY = actualPosY;
				if (newWidth < 0) {
					newWidth = Math.abs(newWidth);
					newPosX = myResizedElement.data("originalposx") - newWidth;
				}
				if (newHeight < 0) {
					newHeight = Math.abs(newHeight);
					newPosY = myResizedElement.data("originalposy") - newHeight;
				}
				myResizedElement.attr("width", newWidth).attr("height", newHeight);
				gCurrentElement.width = newWidth;
				gCurrentElement.height = newHeight;
				gCurrentElement.position.x = newPosX;
				gCurrentElement.position.y = newPosY;
				setShapePos(myResizedElement, gCurrentElement.position);
			} else if (myResizedElement.is("ellipse")) {
				myResizedElement.attr("rx", Math.abs(e.pageX - myCanvasContainer[0].offsetLeft - (myResizedElement.attr("cx") * 1)))
					.attr("ry", Math.abs(e.pageY - myCanvasContainer[0].offsetTop - (myResizedElement.attr("cy") * 1)));
				gCurrentElement.rx = myResizedElement.attr("rx") * 1;
				gCurrentElement.ry = myResizedElement.attr("ry") * 1;
			} else if (myResizedElement.is("polygon")) {
				// TODO: Handle resize of polygons
			}
		} else if (myRotatedElement !== null) {
			var elPosX = 0,
				elPosY = 0,
				angleToApply = 0,
				radius = 1;
			elPosX = myRotatedElement.data("x");
			elPosY = myRotatedElement.data("y");
			// Reposition element to 0,0
			if (myRotatedElement.is("rect")) {
				myRotatedElement.attr("x", 0);
				myRotatedElement.attr("y", 0);
			} else if (myRotatedElement.is("ellipse")) {
				myRotatedElement.attr("cx", 0);
				myRotatedElement.attr("cy", 0);
			}
			radius = Math.sqrt(Math.pow(elPosX - e.pageX - myCanvasContainer[0].offsetLeft, 2) + Math.pow(elPosY - e.pageY - myCanvasContainer[0].offsetTop, 2));
			angleToApply = Math.acos((elPosX - e.pageX - myCanvasContainer[0].offsetLeft) / radius);
			if (elPosY > e.pageY - myCanvasContainer[0].offsetTop) {
				angleToApply = -angleToApply;
			}
			angleToApply = angleToApply * 360 / Math.PI;
			myRotatedElement.attr("transform", "translate(" + elPosX + " " + elPosY + ") rotate(" + angleToApply + ")");
		} else if (gCurrentLine !== null && gCurrentLineConf !== null) {
			if (myDraggedPointIndex === -1) {
				// We are drawing a line
				if (gCurrentLineConf.points.length > 1) {
					gCurrentLineConf.points.pop();
				}
				gCurrentLineConf.points.push([ e.pageX - myCanvasContainer[0].offsetLeft, e.pageY - myCanvasContainer[0].offsetTop ]);
				$(gCurrentLine).remove();
				addLine(gCurrentLineConf);
			} else {
				// We are moving a point of the line
				gCurrentLineConf.points[myDraggedPointIndex] = [ e.pageX - myCanvasContainer[0].offsetLeft, e.pageY - myCanvasContainer[0].offsetTop ];
				$(gCurrentLine).remove();
				addLine(gCurrentLineConf);
			}
		}
	});
	$(".colorselector, #colorSelectorLine").ColorPicker({
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).val(hex);
			$(el).ColorPickerHide();
		},
		onBeforeShow: function () {
			$(this).ColorPickerSetColor(this.value);
		}
	}).bind('keyup', function(){
		$(this).ColorPickerSetColor(this.value);
	});
	$("#lblStratName").change(function(e) {
		gCurrentConf.name = $(this).val();
	});
	$("#lblStratDesc").change(function(e) {
		gCurrentConf.desc = $(this).val();
	});
	// Append colorpicker overlay to edit panel in order to prevent hiding of panel
	//$(".colorpicker").detach().appendTo($("#menuEditLines > div"));
	// Load global configuration

	function applyMapFilter() {
		var selectedMode = $('#mapFilterModes').data('value'),
			selectedSize = $('#mapFilterSize').data('value'),
			selectedCamo = $('#mapFilterCamo').data('value'),
			selectedLevel = $('#mapFilterLevel').data('value'),
			isAllSelected = true;
			myMapsFiltered = myMapsContainer.find('.mappreview');
			myMapsUnfiltered = myMapsFiltered;
		if (selectedMode != 'all') {
			myMapsFiltered = myMapsFiltered.filter('.mapmode' + selectedMode);
			isAllSelected = false;
		}
		if (selectedSize != 'all') {
			myMapsFiltered = myMapsFiltered.filter('[data-size="' + selectedSize + '"]');
			isAllSelected = false;
		}
		if (selectedCamo != 'all') {
			myMapsFiltered = myMapsFiltered.filter('.mapcamo' + selectedCamo);
			isAllSelected = false;
		}
		if (selectedLevel != 'all') {
			selectedLevel = selectedLevel * 1;
			myMapsFiltered = myMapsFiltered.filter(function(index, element) {
				var myElement = $(element),
					minLevel = myElement.data('minlevel') * 1,
					maxLevel = myElement.data('maxlevel') * 1;
				return (selectedLevel >= minLevel && selectedLevel <= maxLevel);
			});
			isAllSelected = false;
		}
		if (isAllSelected) {
			myMapsFiltered.removeClass('hidden');
		} else {
			myMapsUnfiltered.addClass('hidden');
			myMapsFiltered.removeClass('hidden');
		}
		applyMapsDividers();
	};

	$('#mapFilterModes, #mapFilterSize, #mapFilterCamo, #mapFilterLevel').parent().on('hide.bs.dropdown', function(evt) {
		applyMapFilter();
	}).on('click', 'a', function(evt) {
		evt.preventDefault();
		var myLink = $(this);
		myLink.parent().parent().prev().data('value', myLink.parent().data('value')).find('.btnVal').text(myLink.text());
	});

	globalLoad();

	function globalLoad() {
		gCurrentConf.game = myGameToken;

		$.getJSON("./res/" + myGameToken + "/game.json", {}, function(data) {
			gMaps = data.maps;
			gElements = data.elements;
			var myMapToken = null,
				myMapObj = null,
				myMaps = "",
				myElementToken = null,
				myElements0 = '',
				myElements1 = '',
				myElements2 = '',
				myElementsHtml = '',
				myMapOptions = {},
				myMapsHtml = '',
				myMapsSize = [],
				myMapsSizeFilterHtml = '';
			// Populate the maps
			var mapsKeysSorted = Object.keys(gMaps).sort(function(a, b) {
				return i18n.t('strat.maps.' + a).localeCompare(i18n.t('strat.maps.' + b));
			});
			for (var mapIndex in mapsKeysSorted) {
				var mapName = mapsKeysSorted[mapIndex],
					myMapThumb = '';
				myMapOptions = gMaps[mapName];
				if (myMapOptions.state == 'live') {
					myMapThumb = myMapOptions.file.substring(0, myMapOptions.file.lastIndexOf('.')) + '_thumb' + myMapOptions.file.substring(myMapOptions.file.lastIndexOf('.'));
					myMapsHtml += '<div class="col-xs-6 col-md-4 col-lg-3 mappreview mapstate' + myMapOptions.state + ' mapcamo' + myMapOptions.camo
					for (var modeName in myMapOptions.modes) {
						myMapsHtml += ' mapmode' + modeName;
					}
					myMapsHtml += '" data-camo="' + myMapOptions.camo
						+ '" data-size="' + myMapOptions.size.x + 'x' + myMapOptions.size.y
						+ '" data-minlevel="' + myMapOptions.levels.min
						+ '" data-maxlevel="' + myMapOptions.levels.max + '"><div class="thumbnail">';
					myMapsHtml += '<img src="./res/wot/maps/' + myMapThumb + '" alt="' + i18n.t('strat.maps.' + mapName) + '" />';
					myMapsHtml += '<div class="caption"><h3>' + i18n.t('strat.maps.' + mapName) + '</h3>';
					myMapsHtml += '<p>' + i18n.t('install.strategies.maps.size') + ': ' + i18n.t('install.strategies.maps.metrics', { sizex: myMapOptions.size.x, sizey: myMapOptions.size.y }) + '</p>';
					myMapsHtml += '<p>' + i18n.t('strat.camos.title') + ': ' + i18n.t('strat.camos.' + myMapOptions.camo) + '</p>';
					myMapsHtml += '<p>';
					for (var modeName in myMapOptions.modes) {
						myMapsHtml += '<a href="#" class="btn btn-primary createstrat" role="button" data-map-name="' + mapName + '" data-mode="' + modeName + '">' + i18n.t('strat.modes.' + modeName) + '</a>';
					}
					myMapsHtml += '</p>';
					myMapsHtml += '</div></div></div>';
					if (myMapsSize.indexOf(myMapOptions.size.x + 'x' + myMapOptions.size.y) < 0) {
						myMapsSize.push(myMapOptions.size.x + 'x' + myMapOptions.size.y);
					}
				}
			}
			myMapsSize.sort(function(a, b) {
				var mapAMetrics = a.split('x'),
					mapBMetrics = b.split('x'),
					mapAArea = mapAMetrics[0] * mapAMetrics[1],
					mapBArea = mapBMetrics[0] * mapBMetrics[1];
				return mapAArea - mapBArea;
			});
			for (var i = 0; i < myMapsSize.length; i++) {
				var mapMetrics = myMapsSize[i].split('x');
				myMapsSizeFilterHtml += '<li data-value="' + myMapsSize[i] + '"><a href="#">' + i18n.t('install.strategies.maps.metrics', { sizex: mapMetrics[0], sizey: mapMetrics[1] }) + '</a></li>';
			}
			$('#mapFilterSize').next().append(myMapsSizeFilterHtml);
			myMapsContainer.find('#mapsListContainer').html(myMapsHtml);
			applyMapsDividers();
			myMapsContainer.find('.createstrat').on('click', function(evt) {
				evt.preventDefault();
				var myButton = $(this),
					mapName = myButton.data('map-name'),
					modeName = myButton.data('mode');
				initMap(mapName, modeName);
				$('#stratRecap').closest('.container-fluid').hide();
				$('#stratEditor').fadeIn('fast');
			});
			// Populate the elements
			if ($("#menuEditElements div").text().trim() == '') {
				for (myElementToken in gElements) {
					gCountElems[myElementToken] = 0;
					if (gElements[myElementToken].team0) {
						myElements0 += "<li><a href=\"edit/add/element/" + myElementToken + "/0\" class=\"element " + myElementToken + "0\" rel=\"" + myElementToken + "0\" title=\"" + i18n.t('strat.elements.' + myElementToken) + "\"><span>" + i18n.t('strat.elements.' + myElementToken) + "</span></a></li>";
					}
					if (gElements[myElementToken].team1) {
						myElements1 += "<li><a href=\"edit/add/element/" + myElementToken + "/1\" class=\"element " + myElementToken + "1\" rel=\"" + myElementToken + "1\" title=\"" + i18n.t('strat.elements.' + myElementToken) + "\"><span>" + i18n.t('strat.elements.' + myElementToken) + "</span></a></li>";
					}
					if (gElements[myElementToken].team2) {
						myElements2 += "<li><a href=\"edit/add/element/" + myElementToken + "/2\" class=\"element " + myElementToken + "2\" rel=\"" + myElementToken + "2\" title=\"" + i18n.t('strat.elements.' + myElementToken) + "\"><span>" + i18n.t('strat.elements.' + myElementToken) + "</span></a></li>";
					}
				}
				// Clear old elements and add the new ones
				myElementsHtml = '<div class="pull-left"><ul class=\"elements\">' + myElements0 + '</ul></div>';
				myElementsHtml += '<div class="pull-left"><ul class=\"elements\">' + myElements1 + '</ul></div>';
				myElementsHtml += '<div class="pull-left"><ul class=\"elements\">' + myElements2 + '</ul></div>';
				$("#menuEditElements div").append(myElementsHtml);
				$("#menuEditElements").find(".element").click(function(e) {
					e.stopImmediatePropagation();
					e.preventDefault();
					$("#menuEditElements > a").attr("class", "");
					if (!$(this).hasClass("selected")) {
						$("#menu .selected").removeClass("selected");
						$("#menuEditElements > a").addClass($(this).attr("rel") + " selected").attr("rel", $(this).attr("rel"));
					} else {
						$("#menuEditElements > a").removeAttr("rel");
					}
					$(this).toggleClass("selected");
				});
			}
			// Handle editor show on load.
			var uri = new URI(document.location.href),
				uriSearchParameters = uri.search(true);
			switch (uriSearchParameters['action']) {
				case 'new':
					// New strategy
					$('#btnNewStrat').click();
					break;
				case 'show':
					// Show a strategy
					gStratId = uriSearchParameters['id'];
					$.post('./server/strat.php', {
						'action': 'get',
						'id': gStratId
					}, function(dateGetStratResponse) {
						gIsImporting = true;
						gCurrentConf = dateGetStratResponse.data;
						gIsReadOnly = (gConfig.PLAYER_ID != dateGetStratResponse.meta.creator);
						$("#lblStratName").val(gCurrentConf.name).removeClass('empty');
						$("#lblStratDesc").val(gCurrentConf.desc).removeClass('empty');
						initMap(gCurrentConf.map, gCurrentConf.mode);
						$('#stratRecap').closest('.container-fluid').hide();
						$('#stratEditor').fadeIn('fast');
					}, 'json');
					break;
				case 'list':
					// Default case. Show stored strategies
					break;
			}
		}).fail(function() {
			console.log("Error while getting ./res/" + myGameToken + "/game.json");
		});
		$("#chkGrid").change(function(e) {
			var i = 0;
				j = 0;
			if ($(this).is(":checked")) {
				if ($("#gridOverlay").length === 0) {
					var myCanvas = myCanvasContainer.svg().svg("get"),
						g = myCanvas.group(null, "gridOverlay", {});
					for (i=0; i<gMaps[gCurrentConf.map].size.x; i+=gMaps[gCurrentConf.map].size.x/gNB_COLS) {
						// Last column is 0
						if (j < gNB_COLS - 1) {
							myCanvas.text(g, i + gDECAL_GRID + gMaps[gCurrentConf.map].size.x/(gNB_COLS * 2), 16, String.fromCharCode(gCHAR_CODE_1 + j));
						} else {
							myCanvas.text(g, i + gDECAL_GRID + gMaps[gCurrentConf.map].size.x/(gNB_COLS * 2), 16, "0");
						}
						// Skip the I row
						if (j < 8) {
							myCanvas.text(g, 8, i + gDECAL_GRID + gMaps[gCurrentConf.map].size.x/(gNB_ROWS * 2), String.fromCharCode(gCHAR_CODE_A + j));
						} else {
							myCanvas.text(g, 8, i + gDECAL_GRID + gMaps[gCurrentConf.map].size.x/(gNB_ROWS * 2), String.fromCharCode(gCHAR_CODE_A + j + 1));
						}
						j++;
						// Don't draw the first lines as they are in the border
						if (i === 0) {
							continue;
						}
						myCanvas.line(g, i + gDECAL_GRID, gDECAL_GRID, i + gDECAL_GRID, gMaps[gCurrentConf.map].size.y + gDECAL_GRID, {"class": "outer"});
						myCanvas.line(g, i + gDECAL_GRID, 0, i + gDECAL_GRID, gDECAL_GRID, {"class": "inner"});
						myCanvas.line(g, gDECAL_GRID, i + gDECAL_GRID, gMaps[gCurrentConf.map].size.y + gDECAL_GRID, i + gDECAL_GRID, {"class": "outer"});
						myCanvas.line(g, 0, i + gDECAL_GRID, gDECAL_GRID, i + gDECAL_GRID, {"class": "inner"});
					}
				} else {
					$("#gridOverlay").show();
				}
			} else {
				$("#gridOverlay").hide();
			}
		});
		$("#chkDirections").change(function(e) {
			if ($(this).is(":checked")) {
				if ($("#windRoseOverlay").length === 0) {
					var myCanvas = myCanvasContainer.svg().svg("get"),
						g = myCanvas.group(null, "windRoseOverlay", {});
					myCanvas.image(g, gMaps[gCurrentConf.map].size.x - gWIND_ROSE_SIZE + gDECAL_GRID, gDECAL_GRID, gWIND_ROSE_SIZE, gWIND_ROSE_SIZE, "./res/images/windrose.png", {});
				} else {
					$("#windRoseOverlay").show();
				}
			} else {
				$("#windRoseOverlay").hide();
			}
		});
		$("#chkBases").change(function(e) {
			if ($(this).is(":checked")) {
				if ($("#basesOverlay").length === 0) {
					var myCanvas = myCanvasContainer.svg().svg("get"),
						g = myCanvas.group(null, "basesOverlay", {}),
						myMapMode = gMaps[gCurrentConf.map].modes[gCurrentConf.mode],
						countDrops = 0,
						countBases = 0,
						totalBases = 0;
					for (var myMapTeam in myMapMode) {
						countDrops = 0;
						countBases = 0;
						totalBases = 0;
						// Count total bases as base numbers are show only if we have multiple bases. 
						for (var i in myMapMode[myMapTeam]) {
							if (myMapMode[myMapTeam][i].type === "base") {
								totalBases++;
							}
						}
						for (var i in myMapMode[myMapTeam]) {
							if (myMapMode[myMapTeam][i].type === "base") {
								// It's the main bases, they are round
								myCanvas.circle(g, myMapMode[myMapTeam][i].x + gDECAL_GRID, myMapMode[myMapTeam][i].y + gDECAL_GRID, 40, { "class": myMapTeam });
								if (totalBases > 1) {
									myCanvas.text(g, myMapMode[myMapTeam][i].x + gDECAL_GRID - 2, myMapMode[myMapTeam][i].y + 5 + gDECAL_GRID, (++countBases) + "", { "fill": '#FFF', 'stroke': '#FFF' });
								}
							} else if (myMapMode[myMapTeam][i].type === "drop") {
								// It's the drop points, they are square
								myCanvas.polygon(g, [[myMapMode[myMapTeam][i].x - gDROP_ZONE_BORDER + gDECAL_GRID, myMapMode[myMapTeam][i].y + gDECAL_GRID],
													 [myMapMode[myMapTeam][i].x + gDECAL_GRID, myMapMode[myMapTeam][i].y - gDROP_ZONE_BORDER + gDECAL_GRID],
													 [myMapMode[myMapTeam][i].x + gDROP_ZONE_BORDER + gDECAL_GRID, myMapMode[myMapTeam][i].y + gDECAL_GRID],
													 [myMapMode[myMapTeam][i].x + gDECAL_GRID, myMapMode[myMapTeam][i].y + gDROP_ZONE_BORDER + gDECAL_GRID]], { "class": myMapTeam });
								myCanvas.text(g, myMapMode[myMapTeam][i].x + gDECAL_GRID - 2, myMapMode[myMapTeam][i].y + 5 + gDECAL_GRID, (++countDrops) + "", { "class": myMapTeam });
							}
						}
					}
				} else {
					$("#basesOverlay").show();
				}
			} else {
				$("#basesOverlay").hide();
			}
			if (gIsImporting) {
				$("#inverseTeams").prop('checked', gCurrentConf.inverse);
				if (gCurrentConf.inverse) {
					$("#inverseTeams").change();
				}
			}
			gIsImporting = false;
		});
		$("#chkElements").click(function(e) {
			if ($(this).is(":checked")) {
				$("#elementsOverlay").show();
			} else {
				$("#elementsOverlay").hide();
			}
		});
		$("#chkElementsTexts").click(function(e) {
			if ($(this).is(":checked")) {
				$("#elementsOverlay text").show();
			} else {
				$("#elementsOverlay text").hide();
			}
		});
		$("#chkTexts").click(function(e) {
			if ($(this).is(":checked")) {
				$("#textsOverlay").show();
			} else {
				$("#textsOverlay").hide();
			}
		});
		$("#chkShapes").click(function(e) {
			if ($(this).is(":checked")) {
				$("#shapesOverlay").show();
			} else {
				$("#shapesOverlay").hide();
			}
		});
		$("#chkScale").change(function(e) {
			if ($(this).is(":checked")) {
				if ($("#scaleOverlay").length === 0) {
					var myCanvas = myCanvasContainer.svg().svg("get"),
						g = myCanvas.group(null, "scaleOverlay", {}),
						myMap = gMaps[gCurrentConf.map];
					// Add the lines
					myCanvas.line(g, myMap.size.x + gDECAL_GRID - 120, myMap.size.y + gDECAL_GRID - 20, myMap.size.x + gDECAL_GRID - 20, myMap.size.y + gDECAL_GRID - 20, {});
					myCanvas.line(g, myMap.size.x + gDECAL_GRID - 120, myMap.size.y + gDECAL_GRID - 20, myMap.size.x + gDECAL_GRID - 120, myMap.size.y + gDECAL_GRID - 25, {});
					myCanvas.line(g, myMap.size.x + gDECAL_GRID - 20, myMap.size.y + gDECAL_GRID - 20, myMap.size.x + gDECAL_GRID - 20, myMap.size.y + gDECAL_GRID - 25, {});
					// Add the text
					myCanvas.text(g, myMap.size.x + gDECAL_GRID - 85, myMap.size.y + gDECAL_GRID - 25, "100m", {});
				} else {
					$("#scaleOverlay").show();
				}
			} else {
				$("#scaleOverlay").hide();
			}
		});
	}

	$('#menuHome a').on('click', function(evt) {
		evt.preventDefault();
		comet.disconnect();
		$('#menu .selected').removeClass('selected');
		$('#stratEditor').hide();
		myMapsContainer.hide();
		$('#stratRecap').show().closest('.container-fluid').fadeIn('fast');
	});
	$('#btnNewStrat').on('click', function(evt) {
		gStratId = -1;
		gIsReadOnly = false;
		$('#menuMap, #menuEditElements, #menuEditLines, #menuEditShapes, #menuEditTexts, #menuSave').show();
		$('#menuPingMap').hide();
		$('#stratRecap').hide();
		$('#stratEditor').hide();
		myMapsContainer.fadeIn('fast');
	});

	$.post(gConfig.WG_API_URL + 'wgn/clans/info/', {
		application_id: gConfig.WG_APP_ID,
		language: gConfig.LANG,
		access_token: gConfig.ACCESS_TOKEN,
		clan_id: gPersonalInfos.clan_id
	}, function(dataClanResponse) {
		var dataClan = dataClanResponse.data[gPersonalInfos.clan_id],
			membersList = '',
			isFirst = true;
		for (var i=0; i<dataClan.members_count; i++) {
			if (isFirst) {
				isFirst = false;
			} else {
				membersList += ',';
			}
			membersList += dataClan.members[i].account_id;
		}
		advanceProgress(i18n.t('loading.membersinfos'));
		$.post(gConfig.WG_API_URL + 'wot/account/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.G_API_LANG,
			access_token: gConfig.ACCESS_TOKEN,
			account_id: membersList
		}, function(dataPlayersResponse) {
			advanceProgress(i18n.t('loading.strats'));
			var dataPlayers = dataPlayersResponse.data;
			$.post('./server/strat.php', {
				'action': 'list'
			}, function(dataListStratResponse) {
				advanceProgress(i18n.t('loading.generating'));
				myListStrats = dataListStratResponse.data;
				var i = 0,
					myStrat = {},
					myStratsTableHtml = '',
					hideModify = true,
					hideDelete = true;
				for (i=0; i<myListStrats.length; i++) {
					myStrat = myListStrats[i];
					hideModify = true;
					hideDelete = true;
					// Only show user or public strategies
					if (gConfig.PLAYER_ID == myStrat.creator || myStrat.state == 'public' || myStrat.state == 'review') {
						myStratsTableHtml += '<tr data-stratid="' + myStrat.id + '">';
						var myMapOptions = gMaps[myStrat.map];
						myMapThumb = myMapOptions.file.substring(0, myMapOptions.file.lastIndexOf('.')) + '_thumb' + myMapOptions.file.substring(myMapOptions.file.lastIndexOf('.'));
						myStratsTableHtml += '<td class="stratmap"><img width="100" src="./res/wot/maps/' + myMapThumb + '" alt="' + i18n.t('strat.maps.' + myStrat.map) + '" title="' + i18n.t('strat.maps.' + myStrat.map) + '" /></td>';
						myStratsTableHtml += '<td class="stratname">' + myStrat.name + '</td>';
						myStratsTableHtml += '<td class="stratdesc"><span style="white-space:pre">' + myStrat.description + '</span></td>';
						myStratsTableHtml += '<td class="stratstatelib">' + i18n.t('strat.state.' + myStrat.state) + '</td>';
						myStratsTableHtml += '<td class="stratdateadd">' + moment(myStrat.dateadd * 1000).format('LLL') + '</td>';
						if (typeof(myStrat.datemod) == 'undefined') {
							myStratsTableHtml += '<td class="stratdatemod">&nbsp;</td>';
						} else {
							myStratsTableHtml += '<td class="stratdatemod">' + moment(myStrat.datemod * 1000).format('LLL') + '</td>';
						}
						myStratsTableHtml += '<td class="stratcreator">' + dataPlayers[myStrat.creator].nickname + '</td>';
						myStratsTableHtml += '<td class="stratstate"><div data-toggle="tooltip" data-placement="top" class="slider shor slider-info" title="' + i18n.t('strat.state.' + myStrat.state) + '"></div></td>';
						myStratsTableHtml += '<td><a href="?action=show&amp;id=' + myStrat.id + '" class="btnShowStrat" data-map-name="' + myStrat.map + '" data-mode="' + myStrat.mode + '"><span class="glyphicon glyphicon-eye-open"></span></a>';
						// Only the creator can modify or delete a strategy
						if (gConfig.PLAYER_ID == myStrat.creator) {
							// Can delete only private strategies
							hideModify = false;
							if (myStrat.state == 'private') {
								hideDelete = false;
							}
						}
						myStratsTableHtml += ' <a href="#" class="btnEditStrat" data-map-name="' + myStrat.map + '"' + (hideModify?' style="display:none"':'') + '><span class="glyphicon glyphicon-edit"></span></a>';
						myStratsTableHtml += ' <a href="#" class="btnDeleteStrat" data-map-name="' + myStrat.map + '"' + (hideDelete?' style="display:none"':'') + '><span class="glyphicon glyphicon-trash"></span></a>';
						myStratsTableHtml += '</td>';
						myStratsTableHtml += '</tr>';
					}
				}
				$('#tableMyStrats > tbody').empty().html(myStratsTableHtml);
				$('#tableMyStrats').attr('data-sortable', 'true')
				.on('click', 'a.btnShowStrat', function(evt) {
					evt.preventDefault();
					gStratId = $(this).closest('tr').data('stratid');
					$.post('./server/strat.php', {
						'action': 'get',
						'id': gStratId
					}, function(dateGetStratResponse) {
						gIsImporting = true;
						gIsReadOnly = true;
						gCurrentConf = dateGetStratResponse.data;
						$("#lblStratName").val(gCurrentConf.name).removeClass('empty');
						$("#lblStratDesc").val(gCurrentConf.desc).removeClass('empty');
						initMap(gCurrentConf.map, gCurrentConf.mode);
						$('#stratRecap').closest('.container-fluid').hide();
						$('#stratEditor').fadeIn('fast');
					}, 'json');
				}).on('click', 'a.btnEditStrat', function(evt) {
					evt.preventDefault();
					gStratId = $(this).closest('tr').data('stratid');
					$.post('./server/strat.php', {
						'action': 'get',
						'id': gStratId
					}, function(dateGetStratResponse) {
						gIsImporting = true;
						gIsReadOnly = false;
						gCurrentConf = dateGetStratResponse.data;
						$("#lblStratName").val(gCurrentConf.name).removeClass('empty');
						$("#lblStratDesc").val(gCurrentConf.desc).removeClass('empty');
						initMap(gCurrentConf.map, gCurrentConf.mode);
						$('#stratRecap').closest('.container-fluid').hide();
						$('#stratEditor').fadeIn('fast');
					}, 'json');
				}).on('click', 'a.btnDeleteStrat', function(evt) {
					evt.preventDefault();
					var myLink = $(this),
						myRow = myLink.closest('tr');
					gStratId = myRow.data('stratid');
					$.post('./server/strat.php', {
						'action': 'delete',
						'id': gStratId
					}, function(dateGetStratResponse) {
						myRow.remove();
						for (var i=0; i<myListStrats.length; i++) {
							if (myListStrats[i].id == dataSaveStratResponse.data.id) {
								myListStrats = myListStrats.slice(i, i+1);
								break;
							}
						}
					}, 'json');
				}).find('.shor').each(function(index, el) {
					applyShorBehavior($(el));
				});
				Sortable.initTable($('#tableMyStrats')[0]);
				// Save strategy
				$('#saveOptionsBtnOk').on('click', function(evt) {
					// Ensure name and desc presence
					gCurrentConf['name'] = $('#lblStratName').val();
					gCurrentConf['desc'] = $('#lblStratDesc').val();
					// Save start to server
					$.post('./server/strat.php', {
						'action': 'save',
						'data': JSON.stringify(gCurrentConf),
						'id': gStratId
					}, function(dataSaveStratResponse) {
						if (dataSaveStratResponse.result == 'ok') {
							var myMapOptions = gMaps[dataSaveStratResponse.data.map],
								myMapThumb = myMapOptions.file.substring(0, myMapOptions.file.lastIndexOf('.')) + '_thumb' + myMapOptions.file.substring(myMapOptions.file.lastIndexOf('.')),
								myRow = null;
							if (gStratId >= 0) {
								// It's a modification of an existent strategy. Update table.
								for (var i=0; i<myListStrats.length; i++) {
									if (myListStrats[i].id == dataSaveStratResponse.data.id) {
										myListStrats[i] = dataSaveStratResponse.data;
										break;
									}
								}
								myRow = $('#tableMyStrats>tbody>tr[data-stratid="' + gStratId + '"]');
								myRow.find('td.stratmap').html('<img width="100" src="./res/wot/maps/' + myMapThumb + '" alt="' + i18n.t('strat.maps.' + dataSaveStratResponse.data.map) + '" title="' + i18n.t('strat.maps.' + dataSaveStratResponse.data.map) + '" />');
								myRow.find('td.stratname').text(dataSaveStratResponse.data.name);
								myRow.find('td.stratdesc span').text(dataSaveStratResponse.data.description);
								myRow.find('td.stratdatemod').text(moment(dataSaveStratResponse.data.datemod * 1000).format('LLL'));
							} else {
								// It's a new strategy. Add to table.
								myListStrats.push(dataSaveStratResponse.data);
								myRow = '<tr data-stratid="' + dataSaveStratResponse.data.id + '">';
								myRow += '<td class="stratmap"><img width="100" src="./res/wot/maps/' + myMapThumb + '" alt="' + i18n.t('strat.maps.' + dataSaveStratResponse.data.map) + '" title="' + i18n.t('strat.maps.' + dataSaveStratResponse.data.map) + '" /></td>';
								myRow += '<td class="stratname">' + dataSaveStratResponse.data.name + '</td>';
								myRow += '<td class="stratdesc"><span style="white-space:pre">' + dataSaveStratResponse.data.description + '</span></td>';
								myRow += '<td class="stratstatelib">' + i18n.t('strat.state.' + dataSaveStratResponse.data.state) + '</td>';
								myRow += '<td class="stratdateadd">' + moment(dataSaveStratResponse.data.dateadd * 1000).format('LLL') + '</td>';
								myRow += '<td class="stratdatemod">&nbsp;</td>';
								myRow += '<td class="stratcreator">' + dataPlayers[dataSaveStratResponse.data.creator].nickname + '</td>';
								myRow += '<td class="stratstate"><div data-toggle="tooltip" data-placement="top" class="slider shor slider-info" title="' + i18n.t('strat.state.private') + '"></div></td>';
								myRow += '<td><a href="?action=show&amp;id=' + dataSaveStratResponse.data.id + '" class="btnShowStrat"><span class="glyphicon glyphicon-eye-open"></span></a> <a href="#" class="btnEditStrat"><span class="glyphicon glyphicon-edit"></span></a> <a href="#" class="btnDeleteStrat"><span class="glyphicon glyphicon-trash"></span></a></td>';
								myRow += '</tr>';
								myRow = $(myRow);
								applyShorBehavior(myRow.find('.shor'));
								$('#tableMyStrats>tbody').append(myRow);
							}
							$('#stratEditor').hide();
							myMapsContainer.hide();
							$('#stratRecap').show().closest('.container-fluid').fadeIn();
						}
					}, 'json');
				});
				afterLoad();
			}, 'json');
		}, 'json');
	}, 'json');
};