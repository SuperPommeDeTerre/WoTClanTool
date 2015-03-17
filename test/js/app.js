var gWG_API_URL = "https://api.worldoftanks.eu/wot/",
	gWG_APP_ID = '65d48624959befe37494ffa27e085450',
	gUserLang = navigator.language || navigator.userLanguage,
	gWG_API_LANG = gUserLang.split('-')[0];

// Wait for the DOM to finish its initialization before appending data to it.
$(document).ready(function() {
	i18n.init(function(t) {
		// translate nav
		$("html").i18n();
	});
	// Get the clan data
	$.post(gWG_API_URL + 'clan/info/', {
		application_id: gWG_APP_ID,
		language: gWG_API_LANG,
		clan_id: gCLAN_ID
	}, function(dataClanResponse) {
		var dataClan = dataClanResponse.data['' + gCLAN_ID];
		$('#clansInfosTitle').html('<img src="' + dataClan.emblems.large + '" alt="Embl&egrave;me du clan" /> [' + dataClan.abbreviation + '] ' + dataClan.name + ' <small>' + dataClan.motto + '</small>');
		$('#clanTotalPlayers').text(dataClan.members_count + ' joueur' + (dataClan.members_count > 1?'s':''));
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
				tableContent = '';
			for (var memberId in dataPlayers) {
				tableContent += '<tr>';
				tableContent += '<td>' + dataPlayers[memberId].nickname + '</td>';
				tableContent += '<td>' + dataClan.members[memberId].role_i18n + '</td>';
				tableContent += '</tr>';
			}
			tableClanPlayers.find('tbody').append(tableContent);
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
							if (vehiculeDetails.type == "lightTank") {
								nbClanVehiculesByType[0]++;
							} else if (vehiculeDetails.type == "mediumTank") {
								nbClanVehiculesByType[1]++;
							} else if (vehiculeDetails.type == "heavyTank") {
								nbClanVehiculesByType[2]++;
							} else if (vehiculeDetails.type == "AT-SPG") {
								nbClanVehiculesByType[3]++;
							} else if (vehiculeDetails.type == "SPG") {
								nbClanVehiculesByType[4]++;
							}
						}
					}
					$('#clanTotalVehicles').text(nbTotalVehicules + ' char' + (nbTotalVehicules > 1?'s':''));
					new Morris.Donut({
						element: 'chartTanksTiers',
						data: [
							{ label: 'I', value: nbClanVehiculesByTiers[0] },
							{ label: 'II', value: nbClanVehiculesByTiers[1] },
							{ label: 'III', value: nbClanVehiculesByTiers[2] },
							{ label: 'IV', value: nbClanVehiculesByTiers[3] },
							{ label: 'V', value: nbClanVehiculesByTiers[4] },
							{ label: 'VI', value: nbClanVehiculesByTiers[5] },
							{ label: 'VII', value: nbClanVehiculesByTiers[6] },
							{ label: 'VIII', value: nbClanVehiculesByTiers[7] },
							{ label: 'IX', value: nbClanVehiculesByTiers[8] },
							{ label: 'X', value: nbClanVehiculesByTiers[9] }
						],
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
										tableContent += '<td>' + dataTankopedia[tankId].level + '</td>';
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
					tableTanks.find('tbody').html(tableContent);
				}, 'json');
			}, 'json');
		}, 'json');
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
		theme: true
	});
});
