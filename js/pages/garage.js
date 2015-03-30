var onLoad = function() {
	checkConnected();
	progressNbSteps = 7;
	advanceProgress(i18n.t('loading.claninfos'));
	$.post(gConfig.WG_API_URL + 'wgn/clans/info/', {
		application_id: gConfig.WG_APP_ID,
		language: gConfig.LANG,
		access_token: gConfig.ACCESS_TOKEN,
		clan_id: gPersonalInfos.clan_id
	}, function(dataClanResponse) {
		gClanInfos = dataClanResponse.data[gPersonalInfos.clan_id];
		setNavBrandWithClan();
		var membersList = '',
			isFirst = true,
			clanMembers = gClanInfos.members;
		for (var i=0; i<gClanInfos.members_count; i++) {
			if (isFirst) {
				isFirst = false;
			} else {
				membersList += ',';
			}
			membersList += gClanInfos.members[i].account_id;
		}
		clanMembers.sort(function(a, b) {
			return (a.account_name.localeCompare(b.account_name));
		});
		advanceProgress(i18n.t('loading.membersinfos'));
		$.post(gConfig.WG_API_URL + 'wot/account/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.G_API_LANG,
			access_token: gConfig.ACCESS_TOKEN,
			account_id: membersList
		}, function(dataPlayersResponse) {
			var dataPlayers = dataPlayersResponse.data;
			advanceProgress(i18n.t('loading.tanksinfos'));
			$.post(gConfig.WG_API_URL + 'wot/encyclopedia/tanks/', {
				application_id: gConfig.WG_APP_ID,
				access_token: gConfig.ACCESS_TOKEN,
				language: gConfig.LANG
			}, function(dataTankopediaResponse) {
				var dataTankopedia = dataTankopediaResponse.data;
				advanceProgress(i18n.t('loading.membertanksinfos'));
				$.post(gConfig.WG_API_URL + 'wot/account/tanks/', {
					application_id: gConfig.WG_APP_ID,
					language: gConfig.LANG,
					access_token: gConfig.ACCESS_TOKEN,
					account_id: membersList
				}, function(dataPlayersVehiclesResponse) {
					advanceProgress(i18n.t('loading.generating'));
					var dataPlayersVehicles = dataPlayersVehiclesResponse.data,
						curUserGroup = '',
						nextCurUserGroup = '',
						nbMaxPlayersPerGroup = 10,
						curPlayerNbInGroup = 0,
						myPlayersLinksList = '<ul class="nav hidden">',
						myPlayersContainer = $('#perPlayer').parent(),
						myPlayerContent = '';
					advanceProgress(i18n.t('loading.generating'));
					for (var i=0; i<clanMembers.length; i++) {
						clanMemberInfo = clanMembers[i];
						dataPlayer = dataPlayers[clanMemberInfo.account_id];
						myPlayerContent = '';
						if (dataPlayer.nickname.substr(0, 1).toUpperCase() != curUserGroup) {
							if (curUserGroup == '') {
								curUserGroup = dataPlayer.nickname.substr(0, 1).toUpperCase();
							}
							if (curPlayerNbInGroup > nbMaxPlayersPerGroup) {
								myPlayersLinksList += '</ul>';
								nextCurUserGroup = dataPlayer.nickname.substr(0, 1).toUpperCase();
								$('#pageNavbar a[href="#perPlayer"]').parent().append('<ul class="nav"><li><a href="#perPlayer-' + curUserGroup + '-' + nextCurUserGroup + '">' + curUserGroup + '-' + nextCurUserGroup + '</a>' + myPlayersLinksList + '</li></ul>')
								curUserGroup = nextCurUserGroup;
								curPlayerNbInGroup = 0;
								myPlayersLinksList = '<ul class="nav hidden">';
							}
						}
						myPlayersLinksList += '<li><a href="#perPlayer-' + dataPlayer.account_id + '">' + dataPlayer.nickname + '</a></li>';
						/*
						myPlayerContent += '<h2 id="perPlayer-' + dataPlayer.account_id + '">' + dataPlayer.nickname + '</h2>';
						myPlayerContent += '<div class="table-responsive">';
						myPlayerContent += '<table class="table table-hover header-fixed tableTanks">';
						myPlayerContent += '<thead>';
						myPlayerContent += '<tr>';
						myPlayerContent += '<th class="tankcontour" data-sortable="false">&nbsp;</th>';
						myPlayerContent += '<th class="tankmastery">' + i18n.t('tank.stats.mastery') + '</th>';
						myPlayerContent += '<th class="tankname">' + i18n.t('tank.infos.name') + '</th>';
						myPlayerContent += '<th class="tanktiers" data-sorted="true" data-sorted-direction="descending">' + i18n.t('tank.infos.level') + '</th>';
						myPlayerContent += '<th class="tanktype">' + i18n.t('tank.infos.type') + '</th>';
						myPlayerContent += '<th class="tankbattles">' + i18n.t('tank.stats.battles') + '</th>';
						myPlayerContent += '<th class="tankwn8">' + i18n.t('tank.stats.wn8') + '</th>';
						myPlayerContent += '</tr>';
						myPlayerContent += '</thead>';
						myPlayerContent += '<tbody>';
						myPlayerContent += '</tbody>';
						myPlayerContent += '</table>';
						myPlayerContent += '</div>';
						myPlayersContainer.append(myPlayerContent);
						*/
						curPlayerNbInGroup++;
					}
					myPlayersLinksList += '</ul>';
					$('#pageNavbar a[href="#perPlayer"]').parent().append('<ul class="nav"><li><a href="#perPlayer-' + curUserGroup + '-' + dataPlayer.nickname.substr(0, 1).toUpperCase() + '">' + curUserGroup + '-' + dataPlayer.nickname.substr(0, 1).toUpperCase() + '</a>' + myPlayersLinksList + '</li></ul>')
					advanceProgress(i18n.t('loading.complete'));
					afterLoad();
				}, 'json');
			}, 'json');
		}, 'json');
	}, 'json');
};