function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

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
	styleFreeProvince = new ol.style.Style({
		fill: new ol.style.Fill({
			color: [0, 0, 0, 0.4],
		}),
		stroke: new ol.style.Stroke({
			color: '#FFFFFF',
			width: 1
		})
	});

	var applyCWFilter = function() {
		var myFrontFilter = $('#mapFilterFront').data('value'),
			myTimeFilter = $('#mapFilterTime').data('value'),
			myServerFilter = $('#mapFilterServer').data('value'),
			myFeaturesList = varlayersource.getFeatures(),
			myFeatureIndex = 0;
			myFeature = null;
		// Start by showing all
		for (var myFeatureIndex in myFeaturesList) {
			myFeature = myFeaturesList[myFeatureIndex];
			myFeature.setStyle(myFeature.get('olstyle'));
			myFeature.set('isvisible', true);
		}
		if (myFrontFilter != 'all') {
			for (myFeatureIndex in myFeaturesList) {
				myFeature = myFeaturesList[myFeatureIndex];
				if (myFeature.get('front_id') != myFrontFilter) {
					myFeature.setStyle(styleHidden);
					myFeature.set('isvisible', false);
				}
			}
		}
		if (myTimeFilter != 'all') {
			for (myFeatureIndex in myFeaturesList) {
				myFeature = myFeaturesList[myFeatureIndex];
				if (myFeature.get('prime_time') != myTimeFilter) {
					myFeature.setStyle(styleHidden);
					myFeature.set('isvisible', false);
				}
			}
		}
		if (myServerFilter != 'all') {
			for (myFeatureIndex in myFeaturesList) {
				myFeature = myFeaturesList[myFeatureIndex];
				if (myFeature.get('server') != myServerFilter) {
					myFeature.setStyle(styleHidden);
					myFeature.set('isvisible', false);
				}
			}
		}
	};

	checkConnected();
	setNavBrandWithClan();
	progressNbSteps = 7;
	$('#mapFilterFront, #mapFilterTime, #mapFilterServer').parent().on('hide.bs.dropdown', function(evt) {
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
			var loadFrontProvinces = function(pFrontInfos, pNumPage) {
				$.post(gConfig.WG_API_URL + 'wot/globalmap/provinces/', {
					application_id: gConfig.WG_APP_ID,
					access_token: gConfig.ACCESS_TOKEN,
					front_id: pFrontInfos.front_id,
					page_no: pNumPage,
					fields: [ 'owner_clan_id', 'province_id', 'province_name', 'front_id', 'server', 'prime_time' ].toString(),
					language: gConfig.LANG
				}, function(dataProvincesResponse) {
					if (isDebugEnabled()) {
						logDebug('dataProvincesResponse=' + JSON.stringify(dataProvincesResponse, null, 4));
					}
					var globalMapFrontProvinces = dataProvincesResponse.data,
						provinceIndex = 0;
					nbProvincesLoaded += globalMapFrontProvinces.length;
					for (provinceIndex in globalMapFrontProvinces) {
						var myProvince = globalMapFrontProvinces[provinceIndex];
						provincesInfos.push(myProvince);
						// Add owner to clan's list
						if (myProvince.owner_clan_id && clansList.indexOf(myProvince.owner_clan_id) < 0) {
							clansList.push(myProvince.owner_clan_id);
						}
					}
					if (nbProvincesLoaded >= nbTotalProvinces) {
						var nbTotalClansPages = Math.ceil(clansList.length / 100),
							numPageClans = 0;
						advanceProgress($.t('loading.clansinfos'));
						for (numPageClans = 0; numPageClans<nbTotalClansPages; numPageClans++) {
							// Load owners clans infos
							var startIndexClans = numPageClans * 100,
								endIndexClans = (numPageClans + 1) * 100;
							if (endIndexClans > clansList.length) {
								endIndexClans = clansList.length - 1;
							}
							$.post(gConfig.WG_API_URL + 'wgn/clans/info/', {
								application_id: gConfig.WG_APP_ID,
								access_token: gConfig.ACCESS_TOKEN,
								clan_id: clansList.slice(startIndexClans, endIndexClans).toString(),
								fields: [ 'color', 'tag', 'emblems.x24' ].toString(),
								language: gConfig.LANG
							}, function(dataClansInfoResponse) {
								if (isDebugEnabled()) {
									logDebug('dataClansInfoResponse=' + JSON.stringify(dataClansInfoResponse, null, 4));
								}
								var clansInfo = dataClansInfoResponse.data;
								for (var provinceIndex in provincesInfos) {
									var myProvinceInfos = provincesInfos[provinceIndex];
									for (var provinceGeomIndex in dataCWMap.provinces) {
										var myProvince = dataCWMap.provinces[provinceGeomIndex];
										if (myProvince.province_id == myProvinceInfos.province_id) {
											var isClanFound = false,
												myClanInfos = null;
											for (var clanId in clansInfo) {
												myClanInfos = clansInfo[clanId];
												if (myProvinceInfos.owner_clan_id == clanId) {
													isClanFound = true;
													break;
												}
											}
											var thing = new ol.geom.Polygon(myProvince.geom.coordinates),
											featureGeometryTf = thing.applyTransform(tranformFn),
											featurething = new ol.Feature({
												province_id: myProvinceInfos.province_id,
												front_id: myProvinceInfos.front_id,
												server: myProvinceInfos.server,
												prime_time: myProvinceInfos.prime_time,
												geometry: thing,
												isvisible: true
											});
											var myFeatureStyle = styleFreeProvince;
											if (isClanFound) {
												myFeatureStyle = new ol.style.Style({
													fill: new ol.style.Fill({
														color: [ hexToR(myClanInfos.color), hexToG(myClanInfos.color), hexToB(myClanInfos.color), 0.4 ]
													}),
													stroke: new ol.style.Stroke({
														color: '#FFFFFF',
														width: 1
													})/*,
													image: new ol.style.Icon({
														src: myClanInfos.emblems.x24.portal,
														imgSize: [24, 24],
														size: [24, 24],
														scale: 1
													})*/});
											}
											featurething.setStyle(myFeatureStyle);
											featurething.set('olstyle', myFeatureStyle);
											monfeature = varlayersource.addFeature(featurething);
											// Stop processing provinces geometry
											break;
										}
									}
								}
							}, 'json')
							.fail(function(jqXHR, textStatus) {
								logErr('Error while loading [/wgn/clans/info/]: ' + textStatus + '.');
							});
						}
					}
				}, 'json')
				.fail(function(jqXHR, textStatus) {
					logErr('Error while loading [/wot/globalmap/provinces/]: ' + textStatus + '.');
				});
			};
			var dataCWMap = (typeof(dataCWMapResponse.data) != 'undefined'?dataCWMapResponse.data:null),
				tranformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857'),
				frontSelectHtml = '',
				timeSelectHtml = '',
				serverSelectHtml = '',
				nbFronts = 0,
				nbTimes = 0,
				nbServers = 0,
				nbProvincesLoaded = 0,
				nbTotalProvinces = 0,
				clansList = [],
				provincesInfos = [];
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
								nbTotalProvinces += myFrontInfos.provinces_count;
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
						var myFrontInfos = dataCWMap.fronts[frontIndex],
							nbPages = Math.ceil(myFrontInfos.provinces_count / 100),
							numPage = 1;
						frontSelectHtml += '<li data-value="' + myFrontInfos.front_id + '"><a href="#' + myFrontInfos.front_id + '">' + myFrontInfos.front_name + ' <img src="./themes/' + gConfig.THEME + '/style/images/Tier_' + myFrontInfos.max_vehicle_level + '_icon.png" alt="' + gTANKS_LEVEL[myFrontInfos.max_vehicle_level - 1] + '" title="' + myFrontInfos.max_vehicle_level + '" /></a></li>';
						advanceRefreshProgress($.t('loading.clanwars.frontprovinces', { nbprovinces: myFrontInfos.provinces_count, frontname: myFrontInfos.front_name }));
						for (numPage = 1; numPage <= nbPages; numPage++) {
							loadFrontProvinces(myFrontInfos, numPage);
						}
						nbFronts++;
					}
					$("#mapFilterFront").next().append(frontSelectHtml);
					var listPrimeTimes = [],
						listServers = [];
					for (provinceIndex in dataCWMap.provinces) {
						var myProvince = dataCWMap.provinces[provinceIndex];
						if (listPrimeTimes.indexOf(myProvince.prime_time) == -1) {
							listPrimeTimes.push(myProvince.prime_time);
							nbTimes++;
						}
						if (listServers.indexOf(myProvince.server) == -1) {
							listServers.push(myProvince.server);
							serverSelectHtml += '<li data-value="' + myProvince.server + '"><a href="#' + myProvince.server + '">' + myProvince.server + '</a></li>';
							nbServers++;
						}
					}
					listPrimeTimes.sort();
					for (var primeTimeIndex in listPrimeTimes) {
						var myLocalizedPrimeTime = moment.utc(listPrimeTimes[primeTimeIndex], 'HH:mm');
						myLocalizedPrimeTime = myLocalizedPrimeTime.local();
						myLocalizedPrimeTime = myLocalizedPrimeTime.format('LT');
						timeSelectHtml += '<li data-value="' + listPrimeTimes[primeTimeIndex] + '"><a href="#' + listPrimeTimes[primeTimeIndex] + '">' + myLocalizedPrimeTime + '</a></li>';
					}
					$("#mapFilterTime").next().append(timeSelectHtml);
					if (nbTimes < 2) {
						$("#mapFilterTime").parent().parent().hide();
					}
					$("#mapFilterServer").next().append(serverSelectHtml);
					if (nbServers < 2) {
						$("#mapFilterServer").parent().parent().hide();
					}
				}
				var lModalDetailProvince = $("#modalProvinceDetails");
				// Handle click on map
				gCWMap.on('click', function(evt) {
					var feature = gCWMap.forEachFeatureAtPixel(evt.pixel,
							function(feature, layer) {
								return feature;
							});
					if (feature && feature.get('isvisible')) {
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
							var fillProvinceDetails = function(pProvinceInfos, pClanDetails) {
								for (mapIndex in gMaps) {
									if (gMaps[mapIndex].arena_id == pProvinceInfos.arena_id) {
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
								myProvinceDetailsHtml += '<dt>' + $.t('clanwars.map.name') + '</dt>';
								myProvinceDetailsHtml += '<dd>' + $.t('strat.maps.' + myMapName) + '</dd>';
								myProvinceDetailsHtml += '<dt>' + $.t('clanwars.revenue.title') + '</dt>';
								myProvinceDetailsHtml += '<dd>' + pProvinceInfos.daily_revenue + '</dd>';
								myProvinceDetailsHtml += '<dt>' + $.t('clanwars.primetime.title') + '</dt>';
								var myLocalizedPrimeTime = moment.utc(pProvinceInfos.prime_time, 'HH:mm');
								myLocalizedPrimeTime = myLocalizedPrimeTime.local();
								myLocalizedPrimeTime = myLocalizedPrimeTime.format('LT');
								myProvinceDetailsHtml += '<dd>' + myLocalizedPrimeTime + '</dd>';
								if (pClanDetails != null) {
									myProvinceDetailsHtml += '<dt>' + $.t('install.clan.title') + '</dt>';
									myProvinceDetailsHtml += '<dd><img src="' + pClanDetails.emblems.x24.portal + '" /> <span style="color: ' + pClanDetails.color + '">[' + pClanDetails.tag + ']</span></dd>';
								}
								myProvinceDetailsHtml += '';
								myProvinceDetailsHtml += '</dl>';
								myProvinceDetailsHtml += '</div></div></div>';
								lModalDetailProvince.find('.modal-body').html(myProvinceDetailsHtml);
								lModalDetailProvince.find('.modal-title').text(pProvinceInfos.province_name);
								lModalDetailProvince.modal('show');
							};
							if (myProvince.owner_clan_id != null) {
								$.post(gConfig.WG_API_URL + 'wgn/clans/info/', {
									application_id: gConfig.WG_APP_ID,
									access_token: gConfig.ACCESS_TOKEN,
									language: gConfig.LANG,
									clan_id: myProvince.owner_clan_id
								}, function(dataClanDetailsResponse) {
									if (isDebugEnabled()) {
										logDebug('dataClanDetailsResponse=' + JSON.stringify(dataClanDetailsResponse, null, 4));
									}
									fillProvinceDetails(myProvince, dataClanDetailsResponse.data[myProvince.owner_clan_id]);
								}, 'json')
								.fail(function(jqXHR, textStatus) {
									logErr('Error while loading [/wgn/clans/info/]: ' + textStatus + '.');
								});
							} else {
								fillProvinceDetails(myProvince, null);
							}
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
		if (gConfig.IS_ADMIN) {
			// This can be triggered by admin.
			// We nees to do some extra work...
			$('#cwMap').hide().parent().append($('#refreshCWprogress').parent().detach());
			$('#cwMap').parent().append($('#progressRefreshInfoMessage'));
			$('#frmCWFilter').hide();
		}
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
				gCWMapData = {
					'provinces': [],
					'fronts': []
				};
			var loadProvinces = function(pFrontInfos, pNumPage) {
				$.post(gConfig.WG_API_URL + 'wot/globalmap/provinces/', {
					application_id: gConfig.WG_APP_ID,
					access_token: gConfig.ACCESS_TOKEN,
					front_id: pFrontInfos.front_id,
					page_no: pNumPage,
					language: gConfig.LANG
				}, function(dataProvincesResponse) {
					if (isDebugEnabled()) {
						logDebug('dataProvincesResponse=' + JSON.stringify(dataProvincesResponse, null, 4));
					}
					var loadProvinceGeom = function(pProvince) {
						$.get(gProvinceGeomUrl + pProvince.province_id + '.json', {}, function(dataProvinceGeoInfoResponse) {
							if (isDebugEnabled()) {
								logDebug('dataProvinceGeoInfoResponse=' + JSON.stringify(dataProvinceGeoInfoResponse, null, 4));
							}
							var myProvinceGeoInfos = dataProvinceGeoInfoResponse;
							gCWMapData.provinces.push({
								'front_id': pProvince.front_id,
								'province_id': pProvince.province_id,
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
									if (!gConfig.IS_ADMIN) {
										location.reload();
									}
								}, 'json')
								.fail(function(jqXHR, textStatus) {
									logErr('Error while refreshing CW map: ' + textStatus + '.');
								});
							}
						}, 'json')
						.fail(function(jqXHR, textStatus) {
							logErr('Error while loading [' + gProvinceGeomUrl + myProvince.province_id + '.json]: ' + textStatus + '.');
						});
					};
					var globalMapFrontProvinces = dataProvincesResponse.data,
						provinceIndex = 0;
					for (provinceIndex in globalMapFrontProvinces) {
						var myProvince = globalMapFrontProvinces[provinceIndex];
						if (gCWMapData.provinces.indexOf(myProvince.province_id) == -1) {
							// Get province geometry
							advanceRefreshProgress($.t('loading.clanwars.province', { provincename: myProvince.province_name, frontname: pFrontInfos.front_name }));
							loadProvinceGeom(myProvince);
						}
					}
				}, 'json')
				.fail(function(jqXHR, textStatus) {
					logErr('Error while loading [/wot/globalmap/provinces/]: ' + textStatus + '.');
				});
			};
			for (frontIndex in globalMapFronts) {
				// Get provinces of front
				var myFrontInfos = globalMapFronts[frontIndex],
					nbPages = Math.ceil(myFrontInfos.provinces_count / 100),
					numPage = 1;
				nbTotalProvinces += myFrontInfos.provinces_count;
				gCWMapData.fronts.push(myFrontInfos);
				advanceRefreshProgress($.t('loading.clanwars.frontprovinces', { nbprovinces: myFrontInfos.provinces_count, frontname: myFrontInfos.front_name }));
				for (numPage = 1; numPage <= nbPages; numPage++) {
					loadProvinces(myFrontInfos, numPage);
				}
			}
		}, 'json')
		.fail(function(jqXHR, textStatus) {
			logErr('Error while loading [/wot/globalmap/fronts/]: ' + textStatus + '.');
		});
	});
};