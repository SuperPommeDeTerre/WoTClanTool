var onLoad = function() {
	checkConnected();
	advanceProgress(i18n.t('loading.claninfos'));
	setNavBrandWithClan();
	// Fill infos from WG.
	var listClans = { 'EU': [], 'NA': [], 'RU': [], 'ASIA': [], 'KR': [] },
		listAdmins = { 'EU': [], 'NA': [], 'RU': [], 'ASIA': [], 'KR': [] };
	$('#restrictedClans .clan').each(function(idx, elem) {
		var myElem = $(elem);
		listClans[myElem.data('cluster')].push(myElem.data('clan-id'));
	});
	$('#listAdmins .player').each(function(idx, elem) {
		var myElem = $(elem);
		listAdmins[myElem.data('cluster')].push(myElem.data('account-id'));
	});
	for (var lCluster in listClans) {
		if (typeof(gConfig.CLUSTERS[lCluster]) !== 'undefined') {
			var lAPIKey = gConfig.CLUSTERS[lCluster].key,
				lAPIUrl = gConfig.CLUSTERS[lCluster].url;
			if (listClans[lCluster].length > 0) {
				$.post(lAPIUrl + 'wgn/clans/info/', {
					'application_id': lAPIKey,
					'language': gConfig.LANG,
					'fields': 'color,motto,emblems,tag,name',
					'clan_id': listClans[lCluster].join(',')
				}, function(dataClanResponse) {
					var dataClan = dataClanResponse.data;
					for (var clanId in dataClan) {
						var myClanInfos = dataClan[clanId],
							clanHtml = '';
						clanHtml += '<span><img src="' + myClanInfos.emblems.x24.portal + '" /> <span style="color:' + myClanInfos.color + '">[' + myClanInfos.tag + ']</span> <small>' + myClanInfos.name + '</small></span>';
						$('#restrictedClans [data-clan-id="' + clanId + '"]').append(clanHtml);
					}
				}, 'json');
			}
		}
	}
	for (var lCluster in listAdmins) {
		if (typeof(gConfig.CLUSTERS[lCluster]) !== 'undefined') {
			var lAPIKey = gConfig.CLUSTERS[lCluster].key,
				lAPIUrl = gConfig.CLUSTERS[lCluster].url;
			if (listAdmins[lCluster].length > 0) {
				$.post(lAPIUrl + 'wot/account/info/', {
					'application_id': lAPIKey,
					'language': gConfig.LANG,
					'fields': 'nickname',
					'account_id': listAdmins[lCluster].join(',')
				}, function(dataPlayersResponse) {
					var dataPlayers = dataPlayersResponse.data;
					for (var playerId in dataPlayers) {
						var myPlayerInfos = dataPlayers[playerId];
						$('#listAdmins [data-account-id="' + playerId + '"]').append('<span>' + myPlayerInfos.nickname + '</span>');
					}
				}, 'json');
			}
		}
	}
	advanceProgress(i18n.t('loading.maps'));
	$.post('./res/wot/game.json', {}, function(stratsConfig) {
		var myStratsTab = $('#configStrats'),
			myMapsContainer = $('#listMaps'),
			myMapsHtml = '',
			myMapOptions = {},
			myModeOptions = {},
			isFirst = true,
			nbMapsOnRow = 0,
			maxMapsByRow = 0;
		(function($, viewport) {
			if (viewport.is('<md')) {
				maxMapsByRow = 2;
			} else if (viewport.is('md')) {
				maxMapsByRow = 3;
			} else if (viewport.is('>md')) {
				maxMapsByRow = 4;
			}
		})(jQuery, ResponsiveBootstrapToolkit);
		myMapsHtml += '<div class="row">';
		// Sort maps by name
		var mapsKeysSorted = Object.keys(stratsConfig.maps).sort(function(a, b) {
			return i18n.t('strat.maps.' + a).localeCompare(i18n.t('strat.maps.' + b));
		});
		for (var mapIndex in mapsKeysSorted) {
			var mapName = mapsKeysSorted[mapIndex];
			myMapOptions = stratsConfig.maps[mapName];
			// Handle row breaks
			if (nbMapsOnRow >= maxMapsByRow) {
				myMapsHtml += '</div><div class="row">';
				nbMapsOnRow = 0;
			}
			myMapsHtml += '<div class="col-xs-6 col-md-4 col-lg-3">';
			myMapsHtml += '<div class="thumbnail">';
			myMapsHtml += '<img src="./res/wot/maps/' + myMapOptions.file + '" alt="' + i18n.t('strat.maps.' + mapName) + '" />';
			myMapsHtml += '<div class="caption">';
			myMapsHtml += '<h3>' + i18n.t('strat.maps.' + mapName) + '</h3>';
			myMapsHtml += '<p>' + i18n.t('install.strategies.maps.size') + ': ' + i18n.t('install.strategies.maps.metrics', { sizex: myMapOptions.size.x, sizey: myMapOptions.size.y }) + '</p>';
			myMapsHtml += '<p>' + i18n.t('install.strategies.maps.modes') + ': ';
			isFirst = true;
			for (var modeName in myMapOptions.modes) {
				myModeOptions = myMapOptions.modes[modeName];
				if (isFirst) {
					isFirst = false;
				} else {
					myMapsHtml += ', ';
				}
				myMapsHtml += i18n.t('strat.modes.' + modeName);
			}
			myMapsHtml += '</p>';
			myMapsHtml += '<p><a href="#" class="btn btn-primary" role="button" data-map-name="' + mapName + '">' + i18n.t('btn.modify') + '</a></p>';
			myMapsHtml += '</div>';
			myMapsHtml += '</div>';
			myMapsHtml += '</div>';
			nbMapsOnRow++;
		}
		myMapsHtml += '</div>';
		myMapsContainer.html(myMapsHtml);
		// Bind maps event
		myMapsContainer.find('.btn').on('click', function(evt) {
			evt.preventDefault();
		});
		afterLoad();
	}, 'json');
	$('#btnClusters [data-cluster]').each(function(idx, elem) {
		var myClusterButton = $(elem),
			myOption = $('.selCluster option[value=' + myClusterButton.data('cluster') + ']');
		if (myClusterButton.hasClass('active')) {
			myOption.removeAttr('hidden').removeProp('disabled');
		} else {
			myOption.attr('hidden', 'hidden').prop('disabled', true);
		}
	});

	// Bind events

	// Save actual configuration
	$('#btnSave').on('click', function(evt) {
		evt.preventDefault();
		// Remove old alert if exists
		$('#alertResult').remove();
		var lClustersButtons = $('#btnClusters .active'),
			postParameters = {};
		// Made a save by tab to avoid costly global save
		switch ($('.tab-pane.active').prop('id')) {
			case 'configGeneral':
				postParameters['a'] = 'saveGeneral';
				postParameters['showads'] = $('#showads').is(':checked');
				postParameters['inactivitythreshold'] = parseInt(mySliderInactivityThreshold.val());
				postParameters['clusters'] = [];
				if (lClustersButtons.length != 0) {
					lClustersButtons.each(function(idx, elem) {
						var clusterId = $(elem).data('cluster');
						postParameters['clusters'].push(clusterId);
						postParameters['clans' + clusterId] = [];
						postParameters['admins' + clusterId] = [];
					});
				} else {
					// No cluster selected. Assume all.
					$('#btnClusters [data-cluster]').each(function(idx, elem) {
						var clusterId = $(elem).data('cluster');
						postParameters['clusters'].push(clusterId);
						postParameters['clans' + clusterId] = [];
						postParameters['admins' + clusterId] = [];
					});
				}
				for (clusterIndex in postParameters['clusters']) {
					var clusterId = postParameters['clusters'][clusterIndex];
					$('#listAdmins').find('[data-cluster=' + clusterId + ']').each(function(index, element) {
						postParameters['admins' + clusterId].push($(element).data('account-id'));
					});
					$('#restrictedClans').find('[data-cluster=' + clusterId + ']').each(function(index, element) {
						postParameters['clans' + clusterId].push($(element).data('clan-id'));
					});
				}
				break;
		}
		$.post('./server/admin.php', postParameters, function(saveConfigResponse) {
			var alertHtml = '';
			if (saveConfigResponse.status == 'success') {
				alertHtml += '<div class="alert alert-success" role="alert" id="alertResult">';
				alertHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + i18n.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
				alertHtml += '<span><strong>' + i18n.t('success.title') + '</strong> ' + i18n.t('success.configsave') + '</span>';
				alertHtml += '</div>';
			} else {
				alertHtml += '<div class="alert alert-danger" role="alert" id="alertResult">';
				alertHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + i18n.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
				alertHtml += '<span><strong>' + i18n.t('error.title') + '</strong> ' + i18n.t(saveConfigResponse.message) + '</span>';
				alertHtml += '</div>';
			}
			$('h1').before(alertHtml);
		}, 'json');
	});
	$('#btnAddAdmin, #btnAddClan').on('click', function(evt) {
		evt.preventDefault();
	});
	$('#btnClusters [data-cluster]').on('click', function(evt) {
		evt.preventDefault();
		var myClusterButton = $(this),
			myClusterSelect = $('.selCluster'),
			myOption = myClusterSelect.find('option[value=' + myClusterButton.data('cluster') + ']');
		myClusterButton.toggleClass('active');
		if (myClusterButton.parent().find('.active').length == 1) {
			myClusterSelect.hide().find('select').val(myClusterButton.data('cluster'));
		} else {
			myClusterSelect.show();
			if (myClusterButton.hasClass('active')) {
				myOption.removeAttr('hidden').removeProp('disabled');
			} else {
				myOption.attr('hidden', 'hidden').prop('disabled', true);
			}
		}
	});
	// Handle search of clan
	$('#txtSearchClan').on('keyup', function(evt) {
		if ($(this).val().length > 2) {
			$('#btnSearchClan').removeAttr('disabled');
		} else {
			$('#btnSearchClan').attr('disabled', 'disabled');
		}
	}).keyup();
	$('#btnSearchClan').on('click', function(evt) {
		evt.preventDefault();
		var lSelectedCluster = $('#dlgSearchClan .selCluster select').val(),
			lAPIKey = gConfig.CLUSTERS[lSelectedCluster].key,
			lAPIUrl = gConfig.CLUSTERS[lSelectedCluster].url;
		$.post(lAPIUrl + 'wgn/clans/list/', {
			'application_id': lAPIKey,
			'language': gConfig.LANG,
			'search': $('#txtSearchClan').val(),
			'order_by': 'tag',
			'limit': 10
		}, function(dataSearchClanResponse) {
			var dataSearchClan = dataSearchClanResponse.data,
				resultHtml = '',
				i = 0,
				myClan = {};
			if (dataSearchClan.length == 0) {
				resultHtml = '';
			} else {
				for (i=0; i<dataSearchClan.length; i++) {
					myClan = dataSearchClan[i];
					resultHtml += '<li data-clan-id=\"' + myClan.clan_id + '\" data-cluster="' + lSelectedCluster + '"><img src=\"' + myClan.emblems.x24.portal + '\" /><span style=\"color:' + myClan.color + '\">[' + myClan.tag + ']</span> <small>' + myClan.name + '</small></li>';
				}
			}
			$('#searchClanResult').html(resultHtml);
		}, 'json');
	});
	$('#searchClanResult').on('click', 'li', function(evt) {
		var myItem = $(this),
			resultHtml = '';
		if ($('#restrictedClans').find('[data-cluster=' + myItem.data('cluster') + '][data-clan-id=' + myItem.data('id') + ']').length == 0) {
			resultHtml += '<div class="alert alert-material-grey alert-dismissible clan cluster' + myItem.data('cluster') + '" role="alert" data-clan-id="' + myItem.data('clan-id') + '" data-cluster="' + myItem.data('cluster') + '">';
			resultHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + i18n.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
			resultHtml += '<span>' + myItem.html() + '</span>';
			resultHtml += '</div>';
			$('#restrictedClans').append(resultHtml);
		}
	});
	// Handle remove of clan
	$('.clan').on('close.bs.alert', function(evt) {
	});
	// Handle search of player
	$('#txtSearchPlayer').on('keyup', function(evt) {
		if ($(this).val().length > 2) {
			$('#btnSearchPlayer').removeAttr('disabled');
		} else {
			$('#btnSearchPlayer').attr('disabled', 'disabled');
		}
	}).keyup();
	$('#btnSearchPlayer').on('click', function(evt) {
		evt.preventDefault();
		var lSelectedCluster = $('#dlgSearchPlayer .selCluster select').val(),
			lAPIKey = gConfig.CLUSTERS[lSelectedCluster].key,
			lAPIUrl = gConfig.CLUSTERS[lSelectedCluster].url;
		$.post(lAPIUrl + 'wot/account/list/', {
			'application_id': lAPIKey,
			'language': gConfig.LANG,
			'type': 'startswith',
			'search': $('#txtSearchPlayer').val(),
			'limit': 10
		}, function(dataSearchPlayerResponse) {
			var dataSearchPlayer = dataSearchPlayerResponse.data,
				resultHtml = '',
				i = 0,
				myPlayer = {};
			if (dataSearchPlayer.length == 0) {
				resultHtml = '';
			} else {
				for (i=0; i<dataSearchPlayer.length; i++) {
					myPlayer = dataSearchPlayer[i];
					resultHtml += '<li data-account-id=\"' + myPlayer.account_id + '\" data-cluster="' + lSelectedCluster + '">' + myPlayer.nickname + '</li>';
				}
			}
			$('#searchPlayerResult').html(resultHtml);
		}, 'json');
	});
	$('#searchPlayerResult').on('click', 'li', function(evt) {
		var myItem = $(this),
			resultHtml = '';
		if ($('#listAdmins').find('[data-cluster=' + myItem.data('cluster') + '][data-account-id=' + myItem.data('id') + ']').length == 0) {
			resultHtml += '<div class="alert alert-material-grey alert-dismissible player cluster' + myItem.data('cluster') + '" role="alert" data-account-id="' + myItem.data('account-id') + '" data-cluster="' + myItem.data('cluster') + '">';
			resultHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + i18n.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
			resultHtml += '<span>' + myItem.html() + '</span>';
			resultHtml += '</div>';
			$('#listAdmins').append(resultHtml);
		}
	});
	// Handle remove of admin
	$('.player').on('close.bs.alert', function(evt) {
	});
	var mySliderInactivityThreshold = $('#sliderInactivityThreshold'),
		myBadgeInactivityThreshold = $('#badgeInactivityThreshold');
	mySliderInactivityThreshold.noUiSlider({
		start: parseInt(gConfig.THRESHOLDS_MAX_BATTLES),
		step: 1,
		range: {
			min: 0,
			max: 60
		}
	});
	// Update inactivity threshold value on slide
	mySliderInactivityThreshold.on({
		'slide': function(evt) {
			myBadgeInactivityThreshold.text(i18n.t('install.inactivitythreshold.value', { count: parseInt(mySliderInactivityThreshold.val()) }));
		},
		'set': function(evt) {
			// Sets the inactivity threshold on server
		}
	});
};