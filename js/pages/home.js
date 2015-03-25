var onLoad = function() {
	checkConnected();
	// Get the clan data
	progressNbSteps = 7;
	advanceProgress(i18n.t('loading.claninfos'));
	$.post(gConfig.WG_API_URL + 'wgn/clans/info/', {
		application_id: gConfig.WG_APP_ID,
		language: gConfig.LANG,
		access_token: gConfig.ACCESS_TOKEN,
		clan_id: gConfig.CLAN_IDS.join(',')
	}, function(dataClanResponse) {
		var dataClan = dataClanResponse.data[gConfig.CLAN_IDS[0]],
			clanEmblem = dataClan.emblems.x64.portal;
		$('#clansInfosTitle').html('<img src="' + clanEmblem + '" alt="Embl&egrave;me du clan" /> <span style="color:' + dataClan.color + '">[' + dataClan.tag + ']</span> ' + dataClan.name + ' <small>' + dataClan.motto + '</small>');
		$('#clanTotalPlayers').text(i18n.t('clan.nbplayers', { count: dataClan.members_count }));
		$('#clanTotalEvents').text(i18n.t('clan.nbevents', { count: 0 }));
		$('#clanTotalStrats').text(i18n.t('clan.nbstrats', { count: 0 }));
		var membersList = '',
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
			advanceProgress(i18n.t('loading.generating'));
			var dataPlayers = dataPlayersResponse.data,
				tableClanPlayers = $('#tableClanPlayers'),
				tableContent = '',
				clanMemberInfo = null,
				additionalClass = '',
				playerInfos = null,
				actualDate = Math.floor((new Date()).getTime() / 1000),
				lastBattleThreshold = actualDate - (gConfig.THRESHOLDS_MAX_BATTLES * 86400),
				nbTotalWins = 0,
				nbTotalLosses = 0,
				nbTotalDraws = 0,
				memberId = 0,
				clanMembers = dataClan.members;
			// Sort member by rank
			clanMembers.sort(function(a, b) {
				if (gROLE_POSITION[a.role] < gROLE_POSITION[b.role]) {
					return -1;
				}
				if (gROLE_POSITION[a.role] > gROLE_POSITION[b.role]) {
					return 1;
				}
				return 0;
			});
			for (var i=0; i<clanMembers.length; i++) {
				clanMemberInfo = clanMembers[i];
				memberId = clanMemberInfo.account_id;
				playerInfos = dataPlayers[memberId];
				if (playerInfos.last_battle_time < lastBattleThreshold) {
					additionalClass = ' class="oldBattle"';
				} else {
					additionalClass = '';
				}
				tableContent += '<tr' + additionalClass + '>';
				tableContent += '<td data-id="' + memberId + '"><a class="playerDetailsLink" href="./player.php?id=' + memberId + '" data-id="' + memberId + '" data-target="#my-dialog" data-toggle="modal">';
				tableContent += playerInfos.nickname + '</a></td>';
				tableContent += '<td data-value="' + gROLE_POSITION[clanMemberInfo.role] + '">' + i18n.t('player.role.' + clanMemberInfo.role) + '</td>';
				tableContent += '<td data-value="' + clanMemberInfo.joined_at + '"><abbr title="' + moment(new Date(clanMemberInfo.joined_at * 1000)).format('LLLL') + '">' + Math.floor((actualDate - clanMemberInfo.joined_at) / 86400) + '</abbr></td>';
				tableContent += '<td>' + playerInfos.statistics.all.battles + '</td>';
				tableContent += '<td>' + playerInfos.global_rating + '</td>';
				tableContent += '</tr>';
				nbTotalWins += playerInfos.statistics.all.wins;
				nbTotalLosses += playerInfos.statistics.all.losses;
				nbTotalDraws += playerInfos.statistics.all.draws;
			}
			tableClanPlayers.attr('data-sortable', 'true');
			tableClanPlayers.find('tbody').append(tableContent);
			tableClanPlayers.find('.playerDetailsLink').on('click', function(evt) {
				var myLink = $(this),
					myPlayerId = myLink.data('id'),
					myRow = myLink.closest('tr'),
					myPlayerInfos = dataPlayers[myPlayerId],
					myPlayerDetails = '',
					myDialog = $('#my-dialog'),
					myDialogTitle = myDialog.find('.modal-header h4'),
					myContainer = myDialog.find('.modal-body');
				// Populate dialog
				myDialogTitle.text(myPlayerInfos.nickname);
				myPlayerDetails = '<div class="row"><div class="col-md-8"><h4>Informations</h4>';
				myPlayerDetails += '<p>Dernière bataille : <abbr title="' + moment(myPlayerInfos.last_battle_time * 1000).format('LLLL') + '">' + moment(myPlayerInfos.last_battle_time * 1000).fromNow() + "</abbr><br />";
				myPlayerDetails += 'Côte personnelle : ' + myPlayerInfos.global_rating + '<br />';
				myPlayerDetails += 'Nombre de batailles : ' + myPlayerInfos.statistics.all.battles + '<br />';
				myPlayerDetails += 'XP max : ' + myPlayerInfos.statistics.max_xp + '<br />';
				myPlayerDetails += 'Nb frags max : ' + myPlayerInfos.statistics.max_frags + '<br />';
				myPlayerDetails += 'Nb dommages max : ' + myPlayerInfos.statistics.max_damage + '<br />';
				myPlayerDetails += 'Nombre d\'arbres abattus : ' + myPlayerInfos.statistics.trees_cut + '</p>';
				myPlayerDetails += '</div><div class="col-md-4"><h4>Liens</h4><p>';
				myPlayerDetails += '<a href="http://worldoftanks.eu/community/accounts/' + myPlayerId + '-' + myPlayerInfos.nickname + '/">Profil officiel</a><br />';
				myPlayerDetails += '<a href="http://wotlabs.net/eu/player/' + myPlayerInfos.nickname + '/">Wot Labs</a><br />';
				myPlayerDetails += '<a href="http://www.wotstats.org/stats/eu/' + myPlayerInfos.nickname + '/">WoT Stats</a><br />';
				myPlayerDetails += '<a href="http://wot-life.com/eu/player/' + myPlayerInfos.nickname + '/">WoT Life</a><br />';
				myPlayerDetails += '<a href="http://www.noobmeter.com/player/eu/' + myPlayerInfos.nickname + '/' + myPlayerId + '">Noobmeter</a>';
				myPlayerDetails += '</p></div></div>';
				myContainer.html(myPlayerDetails);
			});
			Sortable.initTable(tableClanPlayers[0]);
			new Morris.Donut({
				element: 'chartBattlesOverall',
				data: [
					{ label: 'Victoires', value: nbTotalWins },
					{ label: 'Défaites', value: nbTotalLosses },
					{ label: 'Egalités', value: nbTotalDraws }
				],
				colors: [ "#4caf50", "#f44336", "#2196f3" ]
			});
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
						nbClanVehiculesByTiers = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
						nbClanVehiculesByType = { 'lightTank': 0, 'mediumTank': 0, 'heavyTank': 0, 'AT-SPG': 0, 'SPG': 0},
						nbTotalVehicules = 0,
						playerId = 0;
					$.post('./server/player.php', {
						action: 'gettanksstats',
						account_id: membersList
					}, function(dataStoredPlayersTanksResponse) {
						var dataStoredPlayersTanks = dataStoredPlayersTanksResponse.data;
						for (var i=0; i<dataClan.members_count; i++) {
							var playerId = dataClan.members[i].account_id,
								playerVehicles = dataPlayersVehicles[playerId],
								playerStoredVehicules = dataStoredPlayersTanks[playerId],
								vehiculeDetails = null;
							if (playerStoredVehicules.length == 0) {
								nbTotalVehicules += playerVehicles.length;
								for (var j = 0; j<playerVehicles.length; j++) {
									vehiculeDetails = dataTankopedia[playerVehicles[j].tank_id];
									nbClanVehiculesByTiers[vehiculeDetails.level - 1]++;
									nbClanVehiculesByType[vehiculeDetails.type]++;
								}
							} else {
								for (var j=0; j<playerStoredVehicules.length; j++) {
									if (playerStoredVehicules[j].is_full) {
										vehiculeDetails = dataTankopedia[playerStoredVehicules[j].tank_id];
										nbTotalVehicules++;
										nbClanVehiculesByTiers[vehiculeDetails.level - 1]++;
										nbClanVehiculesByType[vehiculeDetails.type]++;
									}
								}
							}
						}
						$('#clanTotalVehicles').text(i18n.t('clan.nbtanks', { count: nbTotalVehicules }));
						var myData = [];
						for (var i=0; i<gTANKS_LEVEL.length; i++) {
							myData.push({ label: gTANKS_LEVEL[i], value: nbClanVehiculesByTiers[i] });
						}
						new Morris.Donut({
							element: 'chartTanksTiers',
							data: myData,
							colors: [ "#ffebee", "#ffcdd2", "#ef9a9a", "#e57373", "#ef5350", "#f44336", "#e53935", "#d32f2f", "#c62828", "#b71c1c" ]
						});
						new Morris.Donut({
							element: 'chartTanksType',
							data: [
								{ label: i18n.t('tank.type.lightTank'), value: nbClanVehiculesByType['lightTank'] },
								{ label: i18n.t('tank.type.mediumTank'), value: nbClanVehiculesByType['mediumTank'] },
								{ label: i18n.t('tank.type.heavyTank'), value: nbClanVehiculesByType['heavyTank'] },
								{ label: i18n.t('tank.type.AT-SPG'), value: nbClanVehiculesByType['AT-SPG'] },
								{ label: i18n.t('tank.type.SPG'), value: nbClanVehiculesByType['SPG'] }
							]
						});
						advanceProgress(i18n.t('loading.complete'));
						afterLoad();
					}, 'json');
				}, 'json');
			}, 'json');
		}, 'json');
	}, 'json');
	// Get the clan province's infos
	$.post(gConfig.WG_API_URL + 'wot/clan/provinces/', {
		application_id: gConfig.WG_APP_ID,
		language: gConfig.LANG,
		access_token: gConfig.ACCESS_TOKEN,
		clan_id: gConfig.CLAN_IDS[0]
	}, function(dataClanProvincesResponse) {
		$('#clanTotalProvinces').text(i18n.t("clan.nbprovinces", { count: dataClanProvincesResponse.count }));
	}, 'json');
	new Morris.Line({
		element: 'chartBattles',
		data: [
			{ date: '2015-01', victories: 425, defeats: 324, draws: 12 },
			{ date: '2015-02', victories: 516, defeats: 229, draws: 31 },
			{ date: '2015-03', victories: 456, defeats: 503, draws: 25 }
		],
		xkey: 'date',
		ykeys: [ 'victories', 'defeats', 'draws' ],
		labels: [ 'Victoires', 'Defaites', 'Egalites' ],
		lineColors: [ "#4caf50", "#f44336", "#2196f3" ]
	});
	var myCalendar = $('#clanCalendar').calendar({
		tmpl_path: './js/calendar-tmpls/',
		language: gLangMapping[gConfig.LANG],
		view: 'month',
		onAfterViewLoad: function(view) {
			$('#agendaTitle').text(this.getTitle());
		},
		//events_source: './server/calendar.php?a=list'
		events_source: './server/calendar.php?a=list'
	});
	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			myCalendar.navigate($this.data('calendar-nav'));
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			$this.siblings('.active').removeClass('active');
			$this.addClass('active');
			myCalendar.view($this.data('calendar-view'));
		});
	});
};