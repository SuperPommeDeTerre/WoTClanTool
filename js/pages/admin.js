var onLoad = function() {
	checkConnected();
	advanceProgress(i18n.t('loading.claninfos'));
	setNavBrandWithClan();
	// Fill infos from WG.
	var listClans = { 'EU': [], 'NA': [], 'RU': [], 'ASIA': [], 'KR': [] },
		listAdmins = { 'EU': [], 'NA': [], 'RU': [], 'ASIA': [], 'KR': [] };
		listFSfilesContainer = $('#listFSfiles'),
		fsBreadcrumb = $('#fsBreadcrumb'),
		fileContentsContainer = $('#fileContents').hide(),
		gShowedFile = '';
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
			maxMapsByRow = 0,
			myDlgModifyMap = $('#dlgModifyMap');
		myMapsHtml += '<div class="row">';
		// Sort maps by name
		var mapsKeysSorted = Object.keys(stratsConfig.maps).sort(function(a, b) {
			return i18n.t('strat.maps.' + a).localeCompare(i18n.t('strat.maps.' + b));
		});
		for (var mapIndex in mapsKeysSorted) {
			var mapName = mapsKeysSorted[mapIndex];
				myMapThumb = '';
			myMapOptions = stratsConfig.maps[mapName];
			myMapThumb = myMapOptions.file.substring(0, myMapOptions.file.lastIndexOf('.')) + '_thumb' + myMapOptions.file.substring(myMapOptions.file.lastIndexOf('.'));
			// Handle row breaks
			if (nbMapsOnRow > 0) {
				if (nbMapsOnRow % 2 == 0) {
					myMapsHtml += '<div class="clearfix visible-xs-block"></div>';
				}
				if (nbMapsOnRow % 3 == 0) {
					myMapsHtml += '<div class="clearfix visible-md-block"></div>';
				}
				if (nbMapsOnRow % 4 == 0) {
					myMapsHtml += '<div class="clearfix visible-lg-block"></div>';
				}
			}
			myMapsHtml += '<div class="col-xs-6 col-md-4 col-lg-3 mapstate' + myMapOptions.state + ' mapcamo' + myMapOptions.camo + '"><div class="thumbnail">';
			myMapsHtml += '<img src="./res/wot/maps/' + myMapThumb + '" alt="' + i18n.t('strat.maps.' + mapName) + '" />';
			myMapsHtml += '<div class="caption"><h3>' + i18n.t('strat.maps.' + mapName) + '</h3>';
			myMapsHtml += '<p>' + i18n.t('install.strategies.maps.size') + ': ' + i18n.t('install.strategies.maps.metrics', { sizex: myMapOptions.size.x, sizey: myMapOptions.size.y }) + '</p>';
			myMapsHtml += '<p>' + i18n.t('strat.camos.title') + ': ' + i18n.t('strat.camos.' + myMapOptions.camo) + '</p>';
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
			myMapsHtml += '<p><a href="#" class="btn btn-primary" role="button" data-map-name="' + mapName + '" data-target="#dlgModifyMap" data-toggle="modal">' + i18n.t('btn.modify') + '</a></p>';
			myMapsHtml += '</div></div></div>';
			nbMapsOnRow++;
		}
		myMapsHtml += '</div>';
		myMapsContainer.html(myMapsHtml);
		// Bind maps event
		myDlgModifyMap.on('click', '.nav-pills li.disabled', function(evt) {
			evt.preventDefault();
			evt.stopImmediatePropagation();
		});
		myDlgModifyMap.on('click', '.btnAddSpawnPoint', function(evt) {
			evt.preventDefault();
			var myTeamHtml = '<div class="spawnPointContainer"><div class="input-group"><span class="input-group-addon glyphicon glyphicon-option-vertical"></span>';
			myTeamHtml += '<select class="form-control">';
			myTeamHtml += '<option value="base">Base</option>';
			myTeamHtml += '<option value="drop" selected="selected">Drop</option>';
			myTeamHtml += '</select></div>';
			myTeamHtml += '<label class="sr-only" for="mapSizeX">' + i18n.t('install.strategies.maps.props.sizex.title') + '</label>';
			myTeamHtml += '<div class="input-group">';
			myTeamHtml += '<div class="input-group-addon"><span class="glyphicon glyphicon-resize-horizontal"></span></div>';
			myTeamHtml += '<input class="form-control floating-label" data-hint="' + i18n.t('install.strategies.maps.props.sizex.hint') + '" placeholder="' + i18n.t('install.strategies.maps.props.sizex.title') + '" type="number" />';
			myTeamHtml += '</div>';
			myTeamHtml += '<label class="sr-only" for="mapSizeY">' + i18n.t('install.strategies.maps.props.sizey.title') + '</label>';
			myTeamHtml += '<div class="input-group">';
			myTeamHtml += '<div class="input-group-addon"><span class="glyphicon glyphicon-resize-vertical"></span></div>';
			myTeamHtml += '<input class="form-control floating-label" data-hint="' + i18n.t('install.strategies.maps.props.sizey.hint') + '" placeholder="' + i18n.t('install.strategies.maps.props.sizey.title') + '" type="number" />';
			myTeamHtml += '</div>';
			myTeamHtml += '<button class="btn btn-default btnRemoveSpawnPoint"><span class="glyphicon glyphicon-minus"></span></button>';
			myTeamHtml += '<div class="clearfix"></div></div>';
			$(this).prev().append(myTeamHtml);
			$.material.init($(this).prev());
		});
		myDlgModifyMap.on('click', '.btnRemoveSpawnPoint', function(evt) {
			evt.preventDefault();
			$(this).closest('.spawnPointContainer').remove();
		});
		myDlgModifyMap.find('#gameModeStandard').on('change', function(evt) {
			myDlgModifyMap.find('[aria-controls="mapModeStandard"]').closest('li').toggleClass('disabled', !$(this).prop('checked'));
		});
		myDlgModifyMap.find('#gameModeEncounter').on('change', function(evt) {
			myDlgModifyMap.find('[aria-controls="mapModeEncounter"]').closest('li').toggleClass('disabled', !$(this).prop('checked'));
		});
		myDlgModifyMap.find('#gameModeAssault').on('change', function(evt) {
			myDlgModifyMap.find('[aria-controls="mapModeAssault"]').closest('li').toggleClass('disabled', !$(this).prop('checked'));
		});
		myDlgModifyMap.find('#gameModeConfrontation').on('change', function(evt) {
			myDlgModifyMap.find('[aria-controls="mapModeConfrontation"]').closest('li').toggleClass('disabled', !$(this).prop('checked'));
		});
		myMapsContainer.find('.btn').on('click', function(evt) {
			evt.preventDefault();
			var myBtn = $(this),
				mapName = myBtn.data('map-name');
			$('#dlgModifyMap .nav-pills a:first').tab('show');
			myMapOptions = stratsConfig.maps[mapName];
			myDlgModifyMap.find('.modal-title').text(i18n.t('strat.maps.' + mapName));
			myDlgModifyMap.find('#mapSizeX').val(myMapOptions.size.x).removeClass('empty');
			myDlgModifyMap.find('#mapSizeY').val(myMapOptions.size.y).removeClass('empty');
			myDlgModifyMap.find('#gameModeStandard').prop('checked', typeof(myMapOptions.modes['standard']) !== 'undefined');
			myDlgModifyMap.find('#gameModeEncounter').prop('checked', typeof(myMapOptions.modes['encounter']) !== 'undefined');
			myDlgModifyMap.find('#gameModeAssault').prop('checked', typeof(myMapOptions.modes['assault']) !== 'undefined');
			myDlgModifyMap.find('#gameModeConfrontation').prop('checked', typeof(myMapOptions.modes['confrontation']) !== 'undefined');
			myDlgModifyMap.find('[aria-controls="mapModeStandard"]').closest('li').toggleClass('disabled', typeof(myMapOptions.modes['standard']) === 'undefined');
			myDlgModifyMap.find('[aria-controls="mapModeEncounter"]').closest('li').toggleClass('disabled', typeof(myMapOptions.modes['encounter']) === 'undefined');
			myDlgModifyMap.find('[aria-controls="mapModeAssault"]').closest('li').toggleClass('disabled', typeof(myMapOptions.modes['assault']) === 'undefined');
			myDlgModifyMap.find('[aria-controls="mapModeConfrontation"]').closest('li').toggleClass('disabled', typeof(myMapOptions.modes['confrontation']) === 'undefined');
			for (var modeName in myMapOptions.modes) {
				var myModeOptions = myMapOptions.modes[modeName],
					myModePanel = null,
					myTeamPanel = null,
					myTeamSpawnPoints = [],
					myTeamSpawnPointOptions = {},
					myTeamHtml = '';
				switch (modeName) {
					case 'standard':
						myModePanel = $('#mapModeStandard');
						break;
					case 'encounter':
						myModePanel = $('#mapModeEncounter');
						break;
					case 'assault':
						myModePanel = $('#mapModeAssault');
						break;
					case 'confrontation':
						myModePanel = $('#mapModeConfrontation');
						break;
				}
				for (var teamName in myModeOptions) {
					myTeamSpawnPoints = myModeOptions[teamName];
					myTeamHtml = '';
					switch (teamName) {
						case 'team0':
							myTeamPanel = myModePanel.find('.neutral');
							break;
						case 'team1':
							myTeamPanel = myModePanel.find('.allies');
							break;
						case 'team2':
							myTeamPanel = myModePanel.find('.enemies');
							break;
					}
					for (var spawnPointIndex in myTeamSpawnPoints) {
						myTeamSpawnPointOptions = myTeamSpawnPoints[spawnPointIndex];
						myTeamHtml += '<div class="spawnPointContainer"><div class="input-group"><span class="input-group-addon glyphicon glyphicon-option-vertical"></span>';
						myTeamHtml += '<select class="form-control">';
						myTeamHtml += '<option value="base"' + (myTeamSpawnPointOptions.type == 'base'?' selected="selected"':'') + '>Base</option>';
						myTeamHtml += '<option value="drop"' + (myTeamSpawnPointOptions.type == 'drop'?' selected="selected"':'') + '>Drop</option>';
						myTeamHtml += '</select></div>';
						myTeamHtml += '<label class="sr-only" for="mapSizeX">' + i18n.t('install.strategies.maps.props.sizex.title') + '</label>';
						myTeamHtml += '<div class="input-group">';
						myTeamHtml += '<div class="input-group-addon"><span class="glyphicon glyphicon-resize-horizontal"></span></div>';
						myTeamHtml += '<input class="form-control floating-label" data-hint="' + i18n.t('install.strategies.maps.props.sizex.hint') + '" placeholder="' + i18n.t('install.strategies.maps.props.sizex.title') + '" type="number" value="' + myTeamSpawnPointOptions.x + '" />';
						myTeamHtml += '</div>';
						myTeamHtml += '<label class="sr-only" for="mapSizeY">' + i18n.t('install.strategies.maps.props.sizey.title') + '</label>';
						myTeamHtml += '<div class="input-group">';
						myTeamHtml += '<div class="input-group-addon"><span class="glyphicon glyphicon-resize-vertical"></span></div>';
						myTeamHtml += '<input class="form-control floating-label" data-hint="' + i18n.t('install.strategies.maps.props.sizey.hint') + '" placeholder="' + i18n.t('install.strategies.maps.props.sizey.title') + '" type="number" value="' + myTeamSpawnPointOptions.y + '" />';
						myTeamHtml += '</div>';
						myTeamHtml += '<button class="btn btn-default btnRemoveSpawnPoint"><span class="glyphicon glyphicon-minus"></span></button>';
						myTeamHtml += '<div class="clearfix"></div></div>';
					}
					myTeamPanel.html(myTeamHtml);
					$.material.init(myTeamPanel);
				}
			}
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
	// Set base files
	$.post('./server/fs.php', {
		a: 'ls',
		f: '/'
	}, function(listFilesResponse) {
		var myFileName = '',
			myListFilesHtml = '';
		myListFilesHtml += '<ul class="list-unstyled">';
		for (var fileIndex in listFilesResponse.data) {
			myFileName = listFilesResponse.data[fileIndex];
			myListFilesHtml += '<li><a href="' + myFileName + '">' + myFileName.replace('/', '') + '</a></li>';
		}
		myListFilesHtml += '</ul>';
		listFSfilesContainer.html(myListFilesHtml);
	}, 'json');
	function processDir(pDir) {
		$.post('./server/fs.php', {
			a: 'ls',
			f: pDir
		}, function(listFilesResponse) {
			var myFileName = '',
				fileIndex = 0,
				myListFilesHtml = '',
				breadcrumbHtml = '',
				destFileParts = pDir.split('/'),
				curLink = '';
			gShowedFile = '';
			for (var fileIndex in listFilesResponse.data) {
				myFileName = listFilesResponse.data[fileIndex];
				myListFilesHtml += '<li><a href="' + myFileName + '">' + myFileName.replace(pDir, '') + '</a></li>';
			}
			listFSfilesContainer.find('ul').html(myListFilesHtml);
			breadcrumbHtml += '<li><a href="/">/</a></li>';
			for (var i=0; i<destFileParts.length - 1; i++) {
				if (destFileParts[i] != '') {
					curLink += '/' + destFileParts[i];
					if (i<destFileParts.length - 2) {
						breadcrumbHtml += '<li><a href="' + curLink + '/">' + destFileParts[i] + '</a></li>';
					} else {
						breadcrumbHtml += '<li class="active">' + destFileParts[i] + '</li>';
					}
				}
			}
			fileContentsContainer.hide();
			fsBreadcrumb.html(breadcrumbHtml);
		}, 'json');
	};
	function processFile(pFile) {
		$.post('./server/fs.php', {
			a: 'cat',
			f: pFile
		}, function(fileContentResponse) {
			fileContentsContainer.find('textarea').val(JSON.stringify($.parseJSON(fileContentResponse.data), null, 4));
			fileContentsContainer.show();
			gShowedFile = pFile;
		}, 'json');
		$.post('./server/fs.php', {
			a: 'fileinfo',
			f: pFile
		}, function(fileInfosResponse) {
		}, 'json');
	};
	fsBreadcrumb.on('click', 'a', function(evt) {
		evt.preventDefault();
		processDir($(this).attr('href'));
	});
	listFSfilesContainer.on('click', 'a', function(evt) {
		evt.preventDefault();
		var myLink = $(this),
			destFile = myLink.attr('href'),
			isFile = true;
		if (destFile.endsWith('/')) {
			isFile = false;
		} else if (destFile == '..') {
			// Navigate one level up
			isFile = false;
			destFile = '';
			// Calculate destination directory
			destFile = fsBreadcrumb.find('li.active').prev().find('a').attr('href');
		}
		if (!isFile) {
			// It's a directory. Navigate into...
			processDir(destFile);
		} else {
			// It's a file. Display it.
			processFile(destFile);
		}
	});
	// File actions
	$('#btnSaveFile').on('click', function(evt) {
		evt.preventDefault();
		if (gShowedFile != '') {
			$.post('./server/fs.php', {
				a: 'save',
				f: gShowedFile,
				content: JSON.stringify($.parseJSON(fileContentsContainer.find('textarea').val()))
			}, function(saveFileResponse) {
				if (saveFileResponse.status == 'ok') {
					fileContentsContainer.prepend('<div class="alert alert-success alert-dismissibl" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="' + i18n.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>...</div>');
				}
			}, 'json');
		}
	});
	$('#btnMoveFile').on('click', function(evt) {
		evt.preventDefault();
		if (gShowedFile != '') {
		}
	});
	$('#btnDeleteFile').on('click', function(evt) {
		evt.preventDefault();
		if (gShowedFile != '') {
			$.post('./server/fs.php', {
				a: 'rm',
				f: gShowedFile
			}, function(deleteFileResponse) {
				if (deleteFileResponse.status == 'ok') {
					fileContentsContainer.prepend('<div class="alert alert-success alert-dismissibl" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="' + i18n.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>...</div>');
				}
			}, 'json');
		}
	});
};