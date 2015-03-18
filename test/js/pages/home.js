var onLoad = function() {
	// Get the clan data
	var myURI = URI(window.location.href),
		myURIParams = myURI.search(true);
	$('#playerNickName').text(myURIParams['nickname']);
	$.post(gWG_API_URL + 'clan/info/', {
		application_id: gWG_APP_ID,
		language: gWG_API_LANG,
		clan_id: gCLAN_ID
	}, function(dataClanResponse) {
		var dataClan = dataClanResponse.data[gCLAN_ID];
		$('#clansInfosTitle').html('<img src="' + dataClan.emblems.large + '" alt="Embl&egrave;me du clan" /> <span style="color:' + dataClan.color + '">[' + dataClan.abbreviation + ']</span> ' + dataClan.name + ' <small>' + dataClan.motto + '</small>');
		$('#clanTotalPlayers').text(i18n.t('clan.nbplayers', { count: dataClan.members_count }));
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
		$.post(gWG_API_URL + 'account/info/', {
			application_id: gWG_APP_ID,
			language: gWG_API_LANG,
			account_id: membersList
		}, function(dataPlayersResponse) {
			var dataPlayers = dataPlayersResponse.data,
				tableClanPlayers = $('#tableClanPlayers'),
				tableContent = '',
				clanMemberInfo = null,
				playerInfos = null,
				additionalClass = '',
				actualDate = Math.floor((new Date()).getTime() / 1000),
				lastBattleThreshold = actualDate - (gMAX_BATTLE_TIME * 86400);
			for (var memberId in dataPlayers) {
				if (dataPlayers[memberId].last_battle_time < lastBattleThreshold) {
					additionalClass = ' class="oldBattle"';
				} else {
					additionalClass = '';
				}
				clanMemberInfo = dataClan.members[memberId];
				playerInfos = dataPlayers[memberId];
				tableContent += '<tr' + additionalClass + '>';
				tableContent += '<td data-id="' + memberId + '"><a class="playerDetailsLink" href="./player.html?id=' + memberId + '" data-id="' + memberId + '" data-target="#my-dialog" data-toggle="modal">' + playerInfos.nickname + '</a></td>';
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
			$.post(gWG_API_URL + 'encyclopedia/tanks/', {
				application_id: gWG_APP_ID,
				language: gWG_API_LANG
			}, function(dataTankopediaResponse) {
				var dataTankopedia = dataTankopediaResponse.data;
				$.post(gWG_API_URL + 'account/tanks/', {
					application_id: gWG_APP_ID,
					language: gWG_API_LANG,
					account_id: membersList
				}, function(dataPlayersVehiclesResponse) {
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
				}, 'json');
			}, 'json');
		}, 'json');
	}, 'json');
	// Get the clan province's infos
	$.post(gWG_API_URL + 'clan/provinces/', {
		application_id: gWG_APP_ID,
		language: gWG_API_LANG,
		clan_id: gCLAN_ID
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
	$('#clanCalendar').fullCalendar({
		// put your options and callbacks here
		weekends: true,
		lang: 'fr',
		theme: true,
		googleCalendarApiKey: gGOOGLE_API_KEY,
		events: {
			googleCalendarId: gCalendars[0]
		}
	});
};