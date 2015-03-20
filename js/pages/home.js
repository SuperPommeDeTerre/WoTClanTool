var onLoad = function() {
	// Get the clan data
	var myURI = URI(window.location.href),
		myURIParams = myURI.search(true);
	$('#playerNickName').text(myURIParams['nickname']);
	advanceProgress(15, i18n.t('loading.claninfos'));
	$.post(gConfig.WG_API_URL + 'clan/info/', {
		application_id: gConfig.WG_APP_ID,
		language: gConfig.LANG,
		clan_id: gConfig.CLAN_IDS.join(',')
	}, function(dataClanResponse) {
		var dataClan = dataClanResponse.data[gConfig.CLAN_IDS[0]];
		$('#clansInfosTitle').html('<img src="' + dataClan.emblems.large + '" alt="Embl&egrave;me du clan" /> <span style="color:' + dataClan.color + '">[' + dataClan.abbreviation + ']</span> ' + dataClan.name + ' <small>' + dataClan.motto + '</small>');
		$('#clanTotalPlayers').text(i18n.t('clan.nbplayers', { count: dataClan.members_count }));
		$('#clanTotalEvents').text(i18n.t('clan.nbevents', { count: 0 }));
		$('#clanTotalStrats').text(i18n.t('clan.nbstrats', { count: 0 }));
		var membersList = '',
			isFirst = true;
		for (var memberId in dataClan.members) {
			if (isFirst) {
				isFirst = false;
			} else {
				membersList += ',';
			}
			membersList += memberId;
		}
		advanceProgress(30, i18n.t('loading.membersinfos'));
		$.post(gConfig.WG_API_URL + 'account/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.G_API_LANG,
			account_id: membersList
		}, function(dataPlayersResponse) {
			advanceProgress(45, i18n.t('loading.generating'));
			var dataPlayers = dataPlayersResponse.data,
				tableClanPlayers = $('#tableClanPlayers'),
				tableContent = '',
				clanMemberInfo = null,
				additionalClass = '',
				playerInfos = null,
				actualDate = Math.floor((new Date()).getTime() / 1000),
				lastBattleThreshold = actualDate - (gConfig.THRESHOLDS_MAX_BATTLES * 86400);
			for (var memberId in dataPlayers) {
				clanMemberInfo = dataClan.members[memberId];
				playerInfos = dataPlayers[memberId];
				if (playerInfos.last_battle_time < lastBattleThreshold) {
					additionalClass = ' class="oldBattle"';
				} else {
					additionalClass = '';
				}
				tableContent += '<tr' + additionalClass + '>';
				tableContent += '<td data-id="' + memberId + '"><a class="playerDetailsLink" href="./player.php?id=' + memberId + '" data-id="' + memberId + '" data-target="#my-dialog" data-toggle="modal">';
				tableContent += playerInfos.nickname + '</a></td>';
				tableContent += '<td>' + clanMemberInfo.role_i18n + '</td>';
				tableContent += '<td data-value="' + clanMemberInfo.created_at + '"><abbr title="' + moment(new Date(clanMemberInfo.created_at * 1000)).format('LLLL') + '">' + Math.floor((actualDate - clanMemberInfo.created_at) / 86400) + '</abbr></td>';
				tableContent += '<td>' + playerInfos.statistics.all.battles + '</td>';
				tableContent += '<td>' + playerInfos.global_rating + '</td>';
				tableContent += '</tr>';
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
			advanceProgress(60, i18n.t('loading.tanksinfos'));
			$.post(gConfig.WG_API_URL + 'encyclopedia/tanks/', {
				application_id: gConfig.WG_APP_ID,
				language: gConfig.LANG
			}, function(dataTankopediaResponse) {
				var dataTankopedia = dataTankopediaResponse.data;
				advanceProgress(75, i18n.t('loading.membertanksinfos'));
				$.post(gConfig.WG_API_URL + 'account/tanks/', {
					application_id: gConfig.WG_APP_ID,
					language: gConfig.LANG,
					account_id: membersList
				}, function(dataPlayersVehiclesResponse) {
					advanceProgress(90, i18n.t('loading.generating'));
					var dataPlayersVehicles = dataPlayersVehiclesResponse.data,
						nbClanVehiculesByTiers = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
						nbClanVehiculesByType = [ 0, 0, 0, 0, 0 ],
						nbTotalVehicules = 0;
					for (var playerId in dataClan.members) {
						var playerVehicles = dataPlayersVehicles[playerId];
						nbTotalVehicules += playerVehicles.length;
						for (var i = 0; i<playerVehicles.length; i++) {
							var vehiculeDetails = dataTankopedia[playerVehicles[i].tank_id];
							nbClanVehiculesByTiers[vehiculeDetails.level - 1]++;
							if (vehiculeDetails.type == 'lightTank') {
								nbClanVehiculesByType[0]++;
							} else if (vehiculeDetails.type == 'mediumTank') {
								nbClanVehiculesByType[1]++;
							} else if (vehiculeDetails.type == 'heavyTank') {
								nbClanVehiculesByType[2]++;
							} else if (vehiculeDetails.type == 'AT-SPG') {
								nbClanVehiculesByType[3]++;
							} else if (vehiculeDetails.type == 'SPG') {
								nbClanVehiculesByType[4]++;
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
							{ label: 'Light', value: nbClanVehiculesByType[0] },
							{ label: 'Medium', value: nbClanVehiculesByType[1] },
							{ label: 'Heavy', value: nbClanVehiculesByType[2] },
							{ label: 'TD', value: nbClanVehiculesByType[3] },
							{ label: 'SPG', value: nbClanVehiculesByType[4] }
						]
					});
					/*
					var tableTanks = $('#tableTanks'),
						tableContent = '',
						isTankInGarage = false,
						isFirstPlayer = true;
					for (var tankId in dataTankopedia) {
						isTankInGarage = false;
						isFirstPlayer = true;
						for (var playerId in dataPlayersVehicles) {
							for (var i=0; i<dataPlayersVehicles[playerId].length; i++) {
								if (dataPlayersVehicles[playerId][i].tank_id == tankId) {
									if (!isTankInGarage) {
										isTankInGarage = true;
										tableContent += '<tr><td>' + dataTankopedia[tankId].short_name_i18n + '</td>',
										tableContent += '<td>' + dataTankopedia[tankId].nation_i18n + '</td>';
										tableContent += '<td data-value="' + dataTankopedia[tankId].level + '">' + gTANKS_LEVEL[dataTankopedia[tankId].level - 1]+ '</td>';
										tableContent += '<td>' + dataTankopedia[tankId].type_i18n + '</td>';
										tableContent += '<td>';
									}
									if (isFirstPlayer) {
										isFirstPlayer = false;
									} else {
										tableContent += ', ';
									}
									tableContent += dataPlayers[playerId].nickname;
									break;
								}
							}
						}
						if (isTankInGarage) {
							tableContent += '</td></tr>';
						}
					}
					tableTanks.attr("data-sortable", "true");
					tableTanks.find('tbody').html(tableContent);
					Sortable.initTable(tableTanks[0]);
					*/
					advanceProgress(100, i18n.t('loading.complete'));
					afterLoad();
				}, 'json');
			}, 'json');
		}, 'json');
	}, 'json');
	// Get the clan province's infos
	$.post(gConfig.WG_API_URL + 'clan/provinces/', {
		application_id: gConfig.WG_APP_ID,
		language: gConfig.LANG,
		clan_id: gConfig.CLAN_IDS[0]
	}, function(dataClanProvincesResponse) {
		$('#clanTotalProvinces').text(i18n.t("clan.nbprovinces", { count: dataClanProvincesResponse.count }));
	}, 'json');
	new Morris.Donut({
		element: 'chartBattlesOverall',
		data: [
			{ label: 'Victoires', value: 54 },
			{ label: 'Défaites', value: 45 },
			{ label: 'Egalités', value: 1 }
		],
		colors: [ "#4caf50", "#f44336", "#2196f3" ]
	});
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