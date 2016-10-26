var applyCWFilter = function() {
	
};

var onLoad = function() {
	checkConnected();
	setNavBrandWithClan();
	advanceProgress($.t('loading.complete'));
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

		// Get fronts
		$.post(gConfig.WG_API_URL + 'wot/globalmap/fronts/', {
			application_id: gConfig.WG_APP_ID,
			access_token: gConfig.ACCESS_TOKEN,
			language: gConfig.LANG
		}, function(dataFrontsResponse) {
			if (isDebugEnabled()) {
				logDebug('dataFrontsResponse=' + JSON.stringify(dataFrontsResponse, null, 4));
			}
			var globalMapFronts = dataFrontsResponse.data,
				frontIndex = 0,
				tranformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857'),
				gProvinces = [],
				frontSelectHtml = '';
			for (frontIndex in globalMapFronts) {
				// Get provinces of front
				var myFrontInfos = globalMapFronts[frontIndex],
					nbPages = Math.ceil(myFrontInfos.provinces_count / 100),
					numPage = 1;
				frontSelectHtml += '<li data-value="' + myFrontInfos.front_id + '"><a href="#' + myFrontInfos.front_id + '">' + myFrontInfos.front_name + '</a></li>';
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
							if (gProvinces.indexOf(myProvince.province_id) == -1) {
								// Get province geometry
								gProvinces.push(myProvince.province_id);
								$.get(gProvinceGeomUrl + myProvince.province_id + '.json', {}, function(dataProvinceGeoInfoResponse) {
									if (isDebugEnabled()) {
										logDebug('dataProvinceGeoInfoResponse=' + JSON.stringify(dataProvinceGeoInfoResponse, null, 4));
									}
									var myProvinceGeoInfos = dataProvinceGeoInfoResponse,
										thing = new ol.geom.Polygon(myProvinceGeoInfos.geom.coordinates),
										featureGeometryTf = thing.applyTransform(tranformFn),
										featurething = new ol.Feature({
											name: myProvinceGeoInfos.province_id,
											geometry: thing
										}),
										monfeature = varlayersource.addFeature(featurething);
									featurething.setStyle(styleprovince);
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
			$("#mapFilterFront").next().append(frontSelectHtml);
			$.post(gConfig.WG_API_URL + 'wot/globalmap/clanprovinces/', {
				application_id: gConfig.WG_APP_ID,
				access_token: gConfig.ACCESS_TOKEN,
				clan_id: gConfig.USER_CLAN_ID,
				language: gConfig.LANG
			}, function(dataClanProvincesResponse) {
				if (isDebugEnabled()) {
					logDebug('dataClanProvincesResponse=' + JSON.stringify(dataClanProvincesResponse, null, 4));
				}
				var myClanProvinces = dataClanProvincesResponse.data[gConfig.USER_CLAN_ID];
				$.post(gConfig.WG_API_URL + 'wot/globalmap/clanbattles/', {
					application_id: gConfig.WG_APP_ID,
					access_token: gConfig.ACCESS_TOKEN,
					clan_id: gConfig.USER_CLAN_ID,
					language: gConfig.LANG
				}, function(dataClanBattlesResponse) {
					if (isDebugEnabled()) {
						logDebug('dataClanBattlesResponse=' + JSON.stringify(dataClanBattlesResponse, null, 4));
					}
					var myClanBattles = dataClanBattlesResponse.data;
					afterLoad();
				}, 'json')
				.fail(function(jqXHR, textStatus) {
					logErr('Error while loading [/wot/globalmap/clanbattles/]: ' + textStatus + '.');
				});
			}, 'json')
			.fail(function(jqXHR, textStatus) {
				logErr('Error while loading [/wot/globalmap/clanprovinces/]: ' + textStatus + '.');
			});
		}, 'json')
		.fail(function(jqXHR, textStatus) {
			logErr('Error while loading [/wot/globalmap/fronts/]: ' + textStatus + '.');
		});
		/*
		$.post('./server/clanwars.php', { 'clanid': clanid, 'typeselection': 'clanproperty' }, function(dataGetClanProperty) {
			listeresult = dataGetClanProperty;
			tranformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');

			for (index = 0; index < listeresult.length; ++index) {
				var result = listeresult[index],
					thing = new ol.geom.Polygon(result.geom.coordinates),
					featureGeometryTf = thing.applyTransform(tranformFn),
					featurething = new ol.Feature({
						name: result.province_id,
						geometry: thing
					}),
					monfeature = varlayersource.addFeature(featurething);
				featurething.setStyle(styleprovince);
			};
			// batailles
			$.post('./server/clanwars.php', { 'clanid': clanid, 'typeselection': 'clanbattles' }, function(dataGetClanBattles) {
				advanceProgress($.t('loading.complete'));
				listeresult = dataGetClanBattles;
				tranformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');
				for (index = 0; index < listeresult.length; ++index) {
					var result = listeresult[index],
						thing = new ol.geom.Polygon( result.geom.coordinates);
					featureGeometryTf = thing.applyTransform(tranformFn);

					if (result.province_owner_id == clanid) {
						var monfeature = $.grep(varlayersource.getFeatures(), function(e){ return e.getProperties().name == result.province_id; });
						monfeature[0].setStyle(styledefense);
					} 
					if (result.province_owner_id != clanid ) {
						var featurething = new ol.Feature({
							name: result.province_id,
							geometry: thing
						});

						featurething.setStyle(styleattaque);
						var monfeature = varlayersource.addFeature(featurething);
					} 
				};
				afterLoad();
			}, 'json');
		}, 'json');
		*/
		// fin
	};
};