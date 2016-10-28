var gMapInfos = {},
	gMaps = {};

var advanceRefreshProgress = function(pMessage) {
	var myRefreshProgress = $('#refreshCWprogress'),
		curProgress = myRefreshProgress.attr('aria-valuenow') * 1,
		progressToSet = curProgress < 100 ? curProgress + 2 : 0;
	$('#progressRefreshInfoMessage').text(pMessage);
	myRefreshProgress.attr('aria-valuenow', progressToSet)
		.css('width', progressToSet + '%')
		.text(progressToSet + ' %');
};

var onLoad = function() {
	styleHidden = new ol.style.Style({
		fill: new ol.style.Fill({
			color: [0, 0, 0, 0],
		}),
		stroke: new ol.style.Stroke({
			color: [0, 0, 0, 0],
		})
	});
	styleprovince = new ol.style.Style({
		fill: new ol.style.Fill({
			color: [0, 0, 0, 0.4],
		}),
		stroke: new ol.style.Stroke({
			color: '#FFFFFF',
			width: 1
		})
	}),
	// PROVINCES ATTAQUEE = vert
	styleattaque = new ol.style.Style({
		fill: new ol.style.Fill({
			color: [0, 255,0, 0.5],
		}),
		stroke: new ol.style.Stroke({
			color: '#FFFFFF',
			width: 2
		})
	}),
	// PROVINCES DEFENDUE = rouge
	styledefense = new ol.style.Style({
		fill: new ol.style.Fill({
			color: [255, 0,0, 0.5],
		}),
		stroke: new ol.style.Stroke({
			color: '#FFFFFF',
			width: 2
		})
	});

	var applyCWFilter = function() {
		var myFrontFilter = $('#mapFilterFront').data('value'),
			myFeaturesList = varlayersource.getFeatures();
		// Start by showing all
		for (var myFeatureIndex in myFeaturesList) {
			myFeaturesList[myFeatureIndex].setStyle(styleprovince);
		}
		if (myFrontFilter != 'all') {
			for (var myFeatureIndex in myFeaturesList) {
				if (myFeaturesList[myFeatureIndex].get('front_id') != myFrontFilter) {
					myFeaturesList[myFeatureIndex].setStyle(styleHidden);
				}
			}
		}
	};

	checkConnected();
	setNavBrandWithClan();
	progressNbSteps = 4;
	$('#mapFilterFront').parent().on('hide.bs.dropdown', function(evt) {
		applyCWFilter();
	}).on('click', 'a', function(evt) {
		evt.preventDefault();
		var myLink = $(this);
		myLink.parent().parent().prev().data('value', myLink.parent().data('value')).find('.btnVal').text(myLink.text());
	});
	var gCWMap = new ol.Map({
			controls: ol.control.defaults().extend([
				new ol.control.FullScreen(),
				new ol.control.OverviewMap()
			]),
			layers: [
				new ol.layer.Tile({
					title: 'OpenTopoMap',
					type: 'base',
					visible: true,
					source: new ol.source.XYZ({
						// OpenTopoMap source
						url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
					})
				}),
				new ol.layer.Image({
					source: new ol.source.ImageVector({
						source: new ol.source.Vector({
							opacity : 0.2,
							format: new ol.format.GeoJSON()
						}),
						style: new ol.style.Style({
							fill: new ol.style.Fill({
								color: [255, 255, 255, 0.5],
							}),
							stroke: new ol.style.Stroke({
								color: '#319FD3',
								width: 1
							})
						})
					})
				})
			],
			target: 'cwMap',
			view: new ol.View({
				center: ol.proj.transform([0, 0], 'EPSG:4326', 'EPSG:3857'),
				zoom: 5,
				minZoom: 3,
				maxZoom: 7
			}),
			logo: null
		}),
		gProvinceGeomUrl = gConfig.CLUSTERS[gConfig.CLUSTER].cwgeojsonbaseurl;
	gCWMap.getView().setCenter(ol.proj.transform([2.349014, 48.864716], 'EPSG:4326', 'EPSG:3857'));
	var vector = gCWMap.getLayers(),
		vectorSource = gCWMap.getLayers().a[1],
		varlayersource = vectorSource.getSource().getSource();
	if (varlayersource.getState() == 'ready') {
		//PROVINCES POSSEDEES = noir
		var features = varlayersource.getFeatures();

		$.getJSON("./res/wot/game.json", {}, function(data) {
			gMaps = data.maps;
		}, 'json');
		advanceProgress($.t('loading.clanwars.map'));
		$.post('./server/clanwars.php', { 'a': 'getcwmap' }, function(dataCWMapResponse) {
			if (isDebugEnabled()) {
				logDebug('dataCWMapResponse=' + JSON.stringify(dataCWMapResponse, null, 4));
			}
			var dataCWMap = (typeof(dataCWMapResponse.data) != 'undefined'?dataCWMapResponse.data:null),
				tranformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857'),
				frontSelectHtml = '';
			gMapInfos = dataCWMap;
			advanceProgress($.t('loading.clanwars.fronts'));
			$.post(gConfig.WG_API_URL + 'wot/globalmap/fronts/', {
				application_id: gConfig.WG_APP_ID,
				access_token: gConfig.ACCESS_TOKEN,
				language: gConfig.LANG
			}, function(dataFrontsResponse) {
				if (isDebugEnabled()) {
					logDebug('dataFrontsResponse=' + JSON.stringify(dataFrontsResponse, null, 4));
				}
				var globalMapFronts = dataFrontsResponse.data,
					frontIndexCache = 0,
					frontIndex = 0,
					isFrontFound = false,
					isAllFrontFound = true;
				advanceProgress($.t('loading.generating'));
				if (dataCWMap == null) {
					isAllFrontFound = false;
				} else {
					for (frontIndexCache in dataCWMap.fronts) {
						isFrontFound = false;
						var myFrontInfos = dataCWMap.fronts[frontIndexCache];
						for (frontIndex in globalMapFronts) {
							if (globalMapFronts[frontIndex].front_id == myFrontInfos.front_id) {
								isFrontFound = true;
								break;
							}
						}
						if (!isFrontFound) {
							isAllFrontFound = false;
							break;
						}
					}
				}
				if (!isAllFrontFound) {
					// Front IDs have changed. Need refresh...
					$('#ctnBtnReload').show();
					$('#ctnCWMap').hide();
				} else {
					$('#ctnBtnReload').hide();
					if (gConfig.IS_ADMIN) {
						// The administrator can force refresh.
						// And for design purpose, redesign the button
						var myRefreshButton = $('#btnReloadCWInfos');
						$('#frmCWFilter').append('<div class="input-group"><div class="btn-group" id="ctnBtnReloadAdmin"></div></div>');
						myRefreshButton.find('.btnLabel').remove();
						myRefreshButton.removeClass('btn-info').addClass('btn-default btn-sm').detach().appendTo($('#ctnBtnReloadAdmin'));
					}
					for (frontIndex in dataCWMap.fronts) {
						var myFrontInfos = dataCWMap.fronts[frontIndex];
						frontSelectHtml += '<li data-value="' + myFrontInfos.front_id + '"><a href="#' + myFrontInfos.front_id + '">' + myFrontInfos.front_name + ' <img src="./themes/' + gConfig.THEME + '/style/images/Tier_' + myFrontInfos.max_vehicle_level + '_icon.png" alt="' + gTANKS_LEVEL[myFrontInfos.max_vehicle_level - 1] + '" title="' + myFrontInfos.max_vehicle_level + '" /></a></li>';
					}
					$("#mapFilterFront").next().append(frontSelectHtml);
					for (provinceIndex in dataCWMap.provinces) {
						var myProvince = dataCWMap.provinces[provinceIndex];
						thing = new ol.geom.Polygon(myProvince.geom.coordinates),
						featureGeometryTf = thing.applyTransform(tranformFn),
						featurething = new ol.Feature({
							province_id: myProvince.province_id,
							front_id: myProvince.front_id,
							geometry: thing
						}),
						featurething.setStyle(styleprovince);
						monfeature = varlayersource.addFeature(featurething);
					}
				}
				var lModalDetailProvince = $("#modalProvinceDetails");
				gCWMap.on('click', function(evt) {
					var feature = gCWMap.forEachFeatureAtPixel(evt.pixel,
							function(feature, layer) {
								return feature;
							});
					if (feature) {
						// Fill up the window
						$.post(gConfig.WG_API_URL + 'wot/globalmap/provinces/', {
							application_id: gConfig.WG_APP_ID,
							access_token: gConfig.ACCESS_TOKEN,
							front_id: feature.get('front_id'),
							province_id: feature.get('province_id'),
							language: gConfig.LANG
						}, function(dataProvincesResponse) {
							if (isDebugEnabled()) {
								logDebug('dataProvincesResponse=' + JSON.stringify(dataProvincesResponse, null, 4));
							}
							var myProvince = dataProvincesResponse.data[0],
								myProvinceDetailsHtml = '',
								mapIndex = null,
								myMap = null,
								myMapName = '';
							for (mapIndex in gMaps) {
								if (gMaps[mapIndex].arena_id == myProvince.arena_id) {
									myMap = gMaps[mapIndex];
									myMapName = mapIndex;
									break;
								}
							}
							var myMapThumb = myMap.file.substring(0, myMap.file.lastIndexOf('.')) + '_thumb' + myMap.file.substring(myMap.file.lastIndexOf('.'));
							myProvinceDetailsHtml += '<div class="container-responsive"><div class="row"><div class="col-md-4">';
							myProvinceDetailsHtml += '<img src="./res/wot/maps/' + myMapThumb + '" alt="' + $.t('strat.maps.' + myMapName) + '" title="' + $.t('strat.maps.' + myMapName) + '" class="img-responsive" />';
							myProvinceDetailsHtml += '</div><div class="col-md-8">';
							myProvinceDetailsHtml += '<dl>';
							myProvinceDetailsHtml += '<dt>Carte</dt>';
							myProvinceDetailsHtml += '<dd>' + $.t('strat.maps.' + myMapName) + '</dd>';
							myProvinceDetailsHtml += '<dt>Revenu journalier</dt>';
							myProvinceDetailsHtml += '<dd>' + myProvince.daily_revenue + '</dd>';
							myProvinceDetailsHtml += '<dt>Heure de bataille</dt>';
							myProvinceDetailsHtml += '<dd>' + myProvince.prime_time + '</dd>';
							myProvinceDetailsHtml += '';
							myProvinceDetailsHtml += '</dl>';
							myProvinceDetailsHtml += '</div></div></div>';
							lModalDetailProvince.find('.modal-body').html(myProvinceDetailsHtml);
							lModalDetailProvince.find('.modal-title').text(myProvince.province_name);
							lModalDetailProvince.modal('show');
						}, 'json')
						.fail(function(jqXHR, textStatus) {
							logErr('Error while loading [/wot/globalmap/provinces/]: ' + textStatus + '.');
						});
					} else {
						lModalDetailProvince.modal('hide');
					}
				});
				afterLoad();
			}, 'json')
			.fail(function(jqXHR, textStatus) {
				logErr('Error while loading [/wot/globalmap/fronts/]: ' + textStatus + '.');
			});
		}, 'json')
		.fail(function(jqXHR, textStatus) {
			logErr('Error while loading [./server/clanwars.php]: ' + textStatus + '.');
		});
	}
	$('#btnReloadCWInfos').on('click', function(evt) {
		evt.preventDefault();
		$(this).hide();
		$('#refreshCWprogress').parent().removeClass('hidden');
		var gProvinceGeomUrl = gConfig.CLUSTERS[gConfig.CLUSTER].cwgeojsonbaseurl;
		advanceRefreshProgress($.t('loading.clanwars.fronts'));
		$.post(gConfig.WG_API_URL + 'wot/globalmap/fronts/', {
			application_id: gConfig.WG_APP_ID,
			access_token: gConfig.ACCESS_TOKEN,
			language: gConfig.LANG
		}, function(dataFrontsResponse) {
			if (isDebugEnabled()) {
				logDebug('dataFrontsResponse=' + JSON.stringify(dataFrontsResponse, null, 4));
			}
//			$.post(gConfig.CLUSTERS[gConfig.CLUSTER].cwapibase + 'globalmap/game_api/wot/game_info/', {}, function(dataFrontsGeomResponse) {
//				if (isDebugEnabled()) {
//					logDebug('dataFrontsGeomResponse=' + JSON.stringify(dataFrontsGeomResponse, null, 4));
//				}
				advanceRefreshProgress($.t('loading.clanwars.frontsloaded', { nbfronts: dataFrontsResponse.meta.count }));
				var globalMapFronts = dataFrontsResponse.data,
					frontIndex = 0,
					nbTotalProvinces = 0,
					nbProvincesLoaded = 0,
					gCWMapData = {
						'provinces': [],
						'fronts': []
					};
				for (frontIndex in globalMapFronts) {
					// Get provinces of front
					var myFrontInfos = globalMapFronts[frontIndex],
						nbPages = Math.ceil(myFrontInfos.provinces_count / 100),
						numPage = 1;
//					for (var myFrontGeomIndex in dataFrontsGeomResponse.Fronts) {
//						if (dataFrontsGeomResponse.Fronts[myFrontGeomIndex].id == myFrontInfos.front_id) {
//							myFrontInfos['geom'] = dataFrontsGeomResponse.Fronts[myFrontGeomIndex].bounds;
//							break;
//						}
//					}
					nbTotalProvinces += myFrontInfos.provinces_count;
					gCWMapData.fronts.push(myFrontInfos);
					advanceRefreshProgress($.t('loading.clanwars.frontprovinces', { nbprovinces: myFrontInfos.provinces_count, frontname: myFrontInfos.front_name }));
					for (numPage = 1; numPage <= nbPages; numPage++) {
						$.post(gConfig.WG_API_URL + 'wot/globalmap/provinces/', {
							application_id: gConfig.WG_APP_ID,
							access_token: gConfig.ACCESS_TOKEN,
							front_id: myFrontInfos.front_id,
							page_no: numPage,
							language: gConfig.LANG
						}, function(dataProvincesResponse) {
							if (isDebugEnabled()) {
								logDebug('dataProvincesResponse=' + JSON.stringify(dataProvincesResponse, null, 4));
							}
							var globalMapFrontProvinces = dataProvincesResponse.data,
								provinceIndex = 0;
							for (provinceIndex in globalMapFrontProvinces) {
								var myProvince = globalMapFrontProvinces[provinceIndex];
								if (gCWMapData.provinces.indexOf(myProvince.province_id) == -1) {
									// Get province geometry
									advanceRefreshProgress($.t('loading.clanwars.province', { provincename: myProvince.province_name, frontname: myFrontInfos.front_name }));
									$.get(gProvinceGeomUrl + myProvince.province_id + '.json', {}, function(dataProvinceGeoInfoResponse) {
										if (isDebugEnabled()) {
											logDebug('dataProvinceGeoInfoResponse=' + JSON.stringify(dataProvinceGeoInfoResponse, null, 4));
										}
										var myProvinceGeoInfos = dataProvinceGeoInfoResponse;
										gCWMapData.provinces.push({
											'front_id': myProvince.front_id,
											'province_id' : myProvince.province_id,
											'geom': dataProvinceGeoInfoResponse.geom,
											'center': dataProvinceGeoInfoResponse.center
										});
										nbProvincesLoaded++;
										if (nbProvincesLoaded == nbTotalProvinces) {
											// We have finished loading all provinces.
											// Pushing data to server.
											advanceRefreshProgress($.t('loading.clanwars.savedata'));
											$.post('./server/clanwars.php', {
												'a': 'updatecwmap',
												'data': JSON.stringify(gCWMapData)
											}, function(saveConfigResponse) {
												advanceRefreshProgress($.t('loading.clanwars.refresh'));
												location.reload();
											}, 'json')
											.fail(function(jqXHR, textStatus) {
												logErr('Error while refreshing CW map: ' + textStatus + '.');
											});
										}
									}, 'json')
									.fail(function(jqXHR, textStatus) {
										logErr('Error while loading [' + gProvinceGeomUrl + myProvince.province_id + '.json]: ' + textStatus + '.');
									});
								}
							}
						}, 'json')
						.fail(function(jqXHR, textStatus) {
							logErr('Error while loading [/wot/globalmap/provinces/]: ' + textStatus + '.');
						});
					}
				}
//			}, 'json')
//			.fail(function(jqXHR, textStatus) {
//				logErr('Error while loading [/globalmap/game_api/wot/game_info/]: ' + textStatus + '.');
//			});
		}, 'json')
		.fail(function(jqXHR, textStatus) {
			logErr('Error while loading [/wot/globalmap/fronts/]: ' + textStatus + '.');
		});
	});
};