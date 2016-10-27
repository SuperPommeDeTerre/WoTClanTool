var applyCWFilter = function() {
	
};

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
	var map = new ol.Map({
			controls: ol.control.defaults().extend([
				new ol.control.FullScreen({
					source: 'fullscreen'
				}),
				new ol.control.OverviewMap()
			]),
			layers: [
				new ol.layer.Tile({
					title: 'Global Imagery',
					source: new ol.source.TileWMS({
						url: 'http://demo.opengeo.org/geoserver/wms',
						params: {LAYERS: 'ne:NE1_HR_LC_SR_W_DR', VERSION: '1.1.1'}
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
				center: [0, 0],
				zoom: 3,
				minZoom: 3,
				maxZoom: 9
			})
		}),
		gProvinceGeomUrl = gConfig.CLUSTERS[gConfig.CLUSTER].cwgeojsonbaseurl;
	map.getView().setCenter(ol.proj.transform([2.349014, 48.864716], 'EPSG:4326', 'EPSG:3857'));
	var vector = map.getLayers(),
		vectorSource = map.getLayers().a[1],
		varlayersource = vectorSource.getSource().getSource();
	if (varlayersource.getState() == 'ready') {
		//PROVINCES POSSEDEES = noir
		var features = varlayersource.getFeatures(),
			styleprovince = new ol.style.Style({
				fill: new ol.style.Fill({
					color: [0, 0,0, 0.5],
				}),
				stroke: new ol.style.Stroke({
					color: '#FFFFFF',
					width: 1
				})
			});
		// PROVINCES ATTAQUEE = vert
		var styleattaque = new ol.style.Style({
			fill: new ol.style.Fill({
				color: [0, 255,0, 0.5],
			}),
			stroke: new ol.style.Stroke({
				color: '#FFFFFF',
				width: 2
			})
		});
		// PROVINCES DEFENDUE = rouge
		var styledefense = new ol.style.Style({
			fill: new ol.style.Fill({
				color: [255, 0,0, 0.5],
			}),
			stroke: new ol.style.Stroke({
				color: '#FFFFFF',
				width: 2
			})
		});

		advanceProgress($.t('loading.clanwars.map'));
		$.post('./server/clanwars.php', { 'a': 'getcwmap' }, function(dataCWMapResponse) {
			if (isDebugEnabled()) {
				logDebug('dataCWMapResponse=' + JSON.stringify(dataCWMapResponse, null, 4));
			}
			var dataCWMap = (typeof(dataCWMapResponse.data) != 'undefined'?dataCWMapResponse.data:null),
				tranformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857'),
				frontSelectHtml = '';
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
							name: myProvince.province_id,
							geometry: thing
						}),
						monfeature = varlayersource.addFeature(featurething);
					featurething.setStyle(styleprovince);
					}
				}
				afterLoad();
			}, 'json')
			.fail(function(jqXHR, textStatus) {
				logErr('Error while loading [/wot/globalmap/fronts/]: ' + textStatus + '.');
			});
		}, 'json')
		.fail(function(jqXHR, textStatus) {
			logErr('Error while loading [./server/admin.php]: ' + textStatus + '.');
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
			advanceRefreshProgress($.t('loading.clanwars.frontsloaded', { nbfronts: dataFrontsResponse.meta.count }));
			var globalMapFronts = dataFrontsResponse.data,
				frontIndex = 0,
				nbTotalProvinces = 0,
				nbProvincesLoaded = 0,
				gCWMap = {
					'provinces': [],
					'fronts': []
				};
			for (frontIndex in globalMapFronts) {
				// Get provinces of front
				var myFrontInfos = globalMapFronts[frontIndex],
					nbPages = Math.ceil(myFrontInfos.provinces_count / 100),
					numPage = 1;
				nbTotalProvinces += myFrontInfos.provinces_count;
				gCWMap.fronts.push(myFrontInfos);
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
							if (gCWMap.provinces.indexOf(myProvince.province_id) == -1) {
								// Get province geometry
								advanceRefreshProgress($.t('loading.clanwars.province', { provincename: myProvince.province_name, frontname: myFrontInfos.front_name }));
								$.get(gProvinceGeomUrl + myProvince.province_id + '.json', {}, function(dataProvinceGeoInfoResponse) {
									if (isDebugEnabled()) {
										logDebug('dataProvinceGeoInfoResponse=' + JSON.stringify(dataProvinceGeoInfoResponse, null, 4));
									}
									var myProvinceGeoInfos = dataProvinceGeoInfoResponse;
									gCWMap.provinces.push({
										'front_id': myFrontInfos.front_id,
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
											'data': JSON.stringify(gCWMap)
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
		}, 'json')
		.fail(function(jqXHR, textStatus) {
			logErr('Error while loading [/wot/globalmap/fronts/]: ' + textStatus + '.');
		});
	});
};