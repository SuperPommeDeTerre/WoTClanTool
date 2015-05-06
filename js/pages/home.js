var gNbDaysHistory = 6;

var onLoad = function() {
	checkConnected();
	// Get the clan data
	progressNbSteps = 9;
	advanceProgress(i18n.t('loading.claninfos'));
	$.post(gConfig.WG_API_URL + 'wgn/clans/info/', {
		application_id: gConfig.WG_APP_ID,
		language: gConfig.LANG,
		access_token: gConfig.ACCESS_TOKEN,
		clan_id: gPersonalInfos.clan_id
	}, function(dataClanResponse) {
		var dataClan = dataClanResponse.data[gPersonalInfos.clan_id],
			clanEmblem = dataClan.emblems.x64.portal;
		gClanInfos = dataClan;
		$('#clansInfosTitle').html('<img src="' + clanEmblem + '" alt="' + i18n.t('clan.emblem') + '" /> <span style="color:' + gClanInfos.color + '">[' + gClanInfos.tag + ']</span> ' + gClanInfos.name + ' <small>' + gClanInfos.motto + '</small>');
		$('#clanTotalPlayers').text(i18n.t('clan.nbplayers', { count: gClanInfos.members_count }));
		$.post('./server/strat.php', {
			'action': 'list'
		}, function(dataListStratResponse) {
			$('#clanTotalStrats').text(i18n.t('clan.nbstrats', { count: dataListStratResponse.data.length }));
		}, 'json');
		var membersList = '',
			isFirst = true;
		for (var i=0; i<gClanInfos.members_count; i++) {
			if (isFirst) {
				isFirst = false;
			} else {
				membersList += ',';
			}
			membersList += gClanInfos.members[i].account_id;
		}
		advanceProgress(i18n.t('loading.membersinfos'));
		$.post(gConfig.WG_API_URL + 'wot/account/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.G_API_LANG,
			access_token: gConfig.ACCESS_TOKEN,
			account_id: membersList
		}, function(dataPlayersResponse) {
			advanceProgress(i18n.t('loading.generating'));
			gDataPlayers = dataPlayersResponse.data;
			var tableClanPlayers = $('#tableClanPlayers'),
				tableContent = '',
				clanMemberInfo = null,
				additionalClass = '',
				playerInfos = null,
				actualDate = Math.floor((new Date()).getTime() / 1000),
				lastBattleThreshold = actualDate - (gConfig.THRESHOLDS_MAX_BATTLES * 86400),
				nbTotalBattles = 0,
				nbTotalWins = 0,
				nbTotalLosses = 0,
				nbTotalDraws = 0,
				memberId = 0,
				clanMembers = gClanInfos.members;
			// Sort member by rank
			clanMembers.sort(function(a, b) {
				if (gROLE_POSITION[a.role] < gROLE_POSITION[b.role]) {
					return -1;
				}
				if (gROLE_POSITION[a.role] > gROLE_POSITION[b.role]) {
					return 1;
				}
				if (a.nickname < b.nickname) {
					return -1;
				}
				if (a.nickname > b.nickname) {
					return 1;
				}
				return 0;
			});
			for (var i=0; i<clanMembers.length; i++) {
				clanMemberInfo = clanMembers[i];
				memberId = clanMemberInfo.account_id;
				playerInfos = gDataPlayers[memberId];
				if (playerInfos.last_battle_time < lastBattleThreshold) {
					additionalClass = ' class="oldBattle"';
				} else {
					additionalClass = '';
				}
				tableContent += '<tr' + additionalClass + '>';
				tableContent += '<td data-id="' + memberId + '"><a class="playerDetailsLink" href="./player.php?id=' + memberId + '" data-id="' + memberId + '" data-target="#my-dialog" data-toggle="modal">';
				tableContent += playerInfos.nickname + '</a></td>';
				tableContent += '<td data-value="' + gROLE_POSITION[clanMemberInfo.role] + '" class="role role_' + clanMemberInfo.role + '">' + i18n.t('player.role.' + clanMemberInfo.role) + '</td>';
				tableContent += '<td data-value="' + clanMemberInfo.joined_at + '"><abbr title="' + moment(new Date(clanMemberInfo.joined_at * 1000)).format('LLLL') + '">' + Math.floor((actualDate - clanMemberInfo.joined_at) / 86400) + '</abbr></td>';
				tableContent += '<td>' + playerInfos.statistics.all.battles + '</td>';
				tableContent += '<td>' + playerInfos.global_rating + '</td>';
				tableContent += '</tr>';
				nbTotalBattles += playerInfos.statistics.all.battles;
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
					myPlayerInfos = gDataPlayers[myPlayerId],
					myPlayerDetails = '',
					myDialog = $('#my-dialog'),
					myDialogTitle = myDialog.find('.modal-header h4'),
					myContainer = myDialog.find('.modal-body');
				// Populate dialog
				myDialogTitle.text(myPlayerInfos.nickname);
				myPlayerDetails = '<div class="row"><div class="col-md-8"><h4>' + i18n.t('player.resume.title') + '</h4>';
				myPlayerDetails += '<p>' + i18n.t('player.resume.lastbattletime') + ': <abbr title="' + moment(myPlayerInfos.last_battle_time * 1000).format('LLLL') + '">' + moment(myPlayerInfos.last_battle_time * 1000).fromNow() + "</abbr><br />";
				myPlayerDetails += i18n.t('player.resume.personalrating') + ': ' + myPlayerInfos.global_rating + '<br />';
				myPlayerDetails += i18n.t('player.resume.battlescount') + ': ' + myPlayerInfos.statistics.all.battles + '<br />';
				myPlayerDetails += i18n.t('player.resume.maxxp') + ': ' + myPlayerInfos.statistics.max_xp + '<br />';
				myPlayerDetails += i18n.t('player.resume.maxfrags') + ': ' + myPlayerInfos.statistics.max_frags + '<br />';
				myPlayerDetails += i18n.t('player.resume.maxdamage') + ': ' + myPlayerInfos.statistics.max_damage + '<br />';
				myPlayerDetails += i18n.t('player.resume.treescut') + ': ' + myPlayerInfos.statistics.trees_cut + '</p>';
				myPlayerDetails += '</div><div class="col-md-4"><h4>' + i18n.t('player.resume.links.title') + '</h4><p>';
				myPlayerDetails += '<a href="' + i18n.t('player.resume.links.wargaming.url.' + gConfig.CLUSTER.toUpperCase(), { account_id: myPlayerId, nickname: myPlayerInfos.nickname }) + '">' + i18n.t('player.resume.links.wargaming.title') + '</a><br />';
				myPlayerDetails += '<a href="' + i18n.t('player.resume.links.wotlabs.url.' + gConfig.CLUSTER.toUpperCase(), { account_id: myPlayerId, nickname: myPlayerInfos.nickname }) + '">' + i18n.t('player.resume.links.wotlabs.title') + '</a><br />';
				myPlayerDetails += '<a href="' + i18n.t('player.resume.links.wotstats.url.' + gConfig.CLUSTER.toUpperCase(), { account_id: myPlayerId, nickname: myPlayerInfos.nickname }) + '">' + i18n.t('player.resume.links.wotstats.title') + '</a><br />';
				myPlayerDetails += '<a href="' + i18n.t('player.resume.links.wotlife.url.' + gConfig.CLUSTER.toUpperCase(), { account_id: myPlayerId, nickname: myPlayerInfos.nickname }) + '">' + i18n.t('player.resume.links.wotlife.title') + '</a><br />';
				myPlayerDetails += '<a href="' + i18n.t('player.resume.links.noobmeter.url.' + gConfig.CLUSTER.toUpperCase(), { account_id: myPlayerId, nickname: myPlayerInfos.nickname }) + '">' + i18n.t('player.resume.links.noobmeter.title') + '</a><br />';
				myPlayerDetails += '<a href="' + i18n.t('player.resume.links.wotreplays.url.' + gConfig.CLUSTER.toUpperCase(), { account_id: myPlayerId, nickname: myPlayerInfos.nickname }) + '">' + i18n.t('player.resume.links.wotreplays.title') + '</a>';
				myPlayerDetails += '</p></div></div>';
				myContainer.html(myPlayerDetails);
			});
			Sortable.initTable(tableClanPlayers[0]);
			new Morris.Donut({
				element: 'chartBattlesOverall',
				data: [
					{ label: i18n.t('stats.global.victories'), value: nbTotalWins },
					{ label: i18n.t('stats.global.defeats'), value: nbTotalLosses },
					{ label: i18n.t('stats.global.draws'), value: nbTotalDraws }
				],
				colors: [ "#4caf50", "#f44336", "#2196f3" ]
			});
			advanceProgress(i18n.t('loading.playersratings'));
			var nbCompletedRequests = 0,
				dataToDraw = [],
				datesToGetStats = [];
			for (var i=1; i<=gNbDaysHistory; i++) {
				datesToGetStats.push(moment().subtract(i, 'days').hours(0).minutes(0).seconds(0).unix());
				$.post(gConfig.WG_API_URL + 'wot/ratings/accounts/', {
					application_id: gConfig.WG_APP_ID,
					language: gConfig.LANG,
					access_token: gConfig.ACCESS_TOKEN,
					type: '1',
					date: datesToGetStats[i - 1],
					account_id: membersList
				}, function(dataRatingYesterdayResponse) {
					// Handle response and add it to data
					var dataPlayersYesterdayRatings = dataRatingYesterdayResponse.data,
						dayTotalBattles = 0,
						queryParams = new URI('?' + this.data).search(true);
					for (playerId in dataPlayersYesterdayRatings) {
						var curPlayerRatings = dataPlayersYesterdayRatings[playerId];
						if (curPlayerRatings != null) {
							dayTotalBattles += curPlayerRatings.battles_count.value;
						}
					}
					dataToDraw.push({
						date: queryParams.date * 1000,
						battles: dayTotalBattles
					});
					nbCompletedRequests++;
					if (nbCompletedRequests >= gNbDaysHistory) {
						dataToDraw.sort(function(a, b) {
							if (a.date < b.date) {
								return -1;
							}
							if (a.date > b.date) {
								return 1;
							}
							return 0;
						});
						// We have completed all. Draw the chart.
						new Morris.Line({
							element: 'chartBattles',
							data: dataToDraw,
							xLabels: 'day',
							xkey: 'date',
							ykeys: [ 'battles' ],
							dateFormat: function(x) { return moment(x).format('LL'); },
							labels: [ i18n.t('stats.global.battles') ],
							lineColors: [ '#4caf50' ]
						});
					}
				}, 'json');
			}
			advanceProgress(i18n.t('loading.tanksinfos'));
			$.post(gConfig.WG_API_URL + 'wot/encyclopedia/tanks/', {
				application_id: gConfig.WG_APP_ID,
				access_token: gConfig.ACCESS_TOKEN,
				language: gConfig.LANG
			}, function(dataTankopediaResponse) {
				gTankopedia = dataTankopediaResponse.data;
				advanceProgress(i18n.t('loading.membertanksinfos'));
				$.post(gConfig.WG_API_URL + 'wot/account/tanks/', {
					application_id: gConfig.WG_APP_ID,
					language: gConfig.LANG,
					access_token: gConfig.ACCESS_TOKEN,
					account_id: membersList
				}, function(dataPlayersVehiclesResponse) {
					advanceProgress(i18n.t('loading.tanksadditionalinfos'));
					var dataPlayersVehicles = dataPlayersVehiclesResponse.data,
						nbClanVehiculesByTiers = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
						nbClanVehiculesByType = { 'lightTank': 0, 'mediumTank': 0, 'heavyTank': 0, 'AT-SPG': 0, 'SPG': 0 },
						nbTotalVehicules = 0,
						playerId = 0;
					$.post('./server/player.php', {
						action: 'gettanksstats',
						account_id: membersList
					}, function(dataStoredPlayersTanksResponse) {
						advanceProgress(i18n.t('loading.generating'));
						var dataStoredPlayersTanks = dataStoredPlayersTanksResponse.data;
						for (var i=0; i<dataClan.members_count; i++) {
							var playerId = dataClan.members[i].account_id,
								playerVehicles = dataPlayersVehicles[playerId],
								playerStoredVehicules = dataStoredPlayersTanks[playerId],
								vehiculeDetails = null;
							if (playerStoredVehicules.length > 0) {
								for (var j=0; j<playerStoredVehicules.length; j++) {
									if (playerStoredVehicules[j].in_garage) {
										vehiculeDetails = gTankopedia[playerStoredVehicules[j].tank_id];
										nbTotalVehicules++;
										nbClanVehiculesByTiers[vehiculeDetails.level - 1]++;
										nbClanVehiculesByType[vehiculeDetails.type]++;
									}
								}
							}
						}
						$('#clanTotalVehicles').text(i18n.t('clan.nbtanks', { count: nbTotalVehicules }));
						var myData = [];
						for (var i=gTANKS_LEVEL.length - 1; i>=0; i--) {
							if (nbClanVehiculesByTiers[i] > 0) {
								myData.push({ label: gTANKS_LEVEL[i], value: nbClanVehiculesByTiers[i] });
							}
						}
						new Morris.Donut({
							element: 'chartTanksTiers',
							data: myData,
							colors: [ "#b71c1c", "#c62828", "#e53935", "#d32f2f", "#f44336", "#ef5350", "#e57373", "#ef9a9a", "#ffcdd2", "#ffebee" ]
						});
						new Morris.Donut({
							element: 'chartTanksType',
							data: [
								{ label: i18n.t('tank.type.SPG', { count: nbClanVehiculesByType['SPG'] }), value: nbClanVehiculesByType['SPG'] },
								{ label: i18n.t('tank.type.AT-SPG', { count: nbClanVehiculesByType['AT-SPG'] }), value: nbClanVehiculesByType['AT-SPG'] },
								{ label: i18n.t('tank.type.heavyTank', { count: nbClanVehiculesByType['heavyTank'] }), value: nbClanVehiculesByType['heavyTank'] },
								{ label: i18n.t('tank.type.mediumTank', { count: nbClanVehiculesByType['mediumTank'] }), value: nbClanVehiculesByType['mediumTank'] },
								{ label: i18n.t('tank.type.lightTank', { count: nbClanVehiculesByType['lightTank'] }), value: nbClanVehiculesByType['lightTank'] }
							]
						});
						gCalendar = $('#clanCalendar').calendar({
							tmpl_path: './js/calendar-tmpls/',
							language: gLangMapping[gConfig.LANG],
							view: 'month',
							time_start: '00:00',
							time_end: '23:59',
							modal: '#events-modal',
							modal_type: 'ajax',
							modal_title : function (e) { return e.title },
							onAfterViewLoad: function(view) {
								$('#agendaTitle').text(this.getTitle());
							},
							onAfterEventsLoad: function(events) {
								$('#agendaTitleTody').nextAll().remove();
								var myTodayEventsHtml = '',
									startOfDay = moment().startOf('day'),
									endOfDay = moment(startOfDay).add(1, 'days'),
									startOfPeriod = startOfDay,
									endOfPeriod = moment(startOfDay).add(7, 'days'),
									nbEventsOnPeriod = 0;
								for (var i=0; i<events.length; i++) {
									var myEvent = events[i],
										myEventStartDate = moment(myEvent.start * 1),
										myEventEndDate = moment(myEvent.end * 1);
									if (myEventStartDate.isBetween(startOfDay, endOfDay)) {
										myTodayEventsHtml += '<h3><span class="label label-default">' + myEventStartDate.format('LT') + '</span> ' + myEvent.title + '</h3>';
										myTodayEventsHtml += '<p>' + myEvent.description + '</p>';
										myTodayEventsHtml += '<h4><span data-i18n="action.calendar.prop.participants"></span></h4>';
										if (myEvent.participants.length == 0) {
											myTodayEventsHtml += '<p data-i18n="event.noparticipant"></p>';
										} else {
											myTodayEventsHtml += '<ul class="list-unstyled participants">';
											for (var myParticipantId in myEvent.participants) {
												myParticipantAttendance = myEvent.participants[myParticipantId];
												for (var j=0; j<clanMembers.length; j++) {
													clanMemberInfo = clanMembers[j];
													if (clanMemberInfo.account_id == myParticipantId) {
														myTodayEventsHtml += '<li data-id="' + myParticipantId + '" class="attendance-' + myParticipantAttendance + '"><span class="role role_' + clanMemberInfo.role + '">' + gDataPlayers[myParticipantId].nickname + '</span></li>';
														break;
													}
												}
											}
											myTodayEventsHtml += '</ul>';
										}
									}
									if (myEventStartDate.isBetween(startOfPeriod, endOfPeriod) || myEventEndDate.isBetween(startOfPeriod, endOfPeriod)) {
										nbEventsOnPeriod++;
									}
								}
								if (myTodayEventsHtml == '') {
									// No events for this day.
									myTodayEventsHtml = '<p data-i18n="event.noevent"></p>';
								}
								$('#clanTotalEvents').text(i18n.t('clan.nbevents', { count: nbEventsOnPeriod }));
								$('#agendaTitleTody').after(myTodayEventsHtml).parent().i18n();
							},
							onAfterModalShown: function(events) {
								fillEventDialog($("#events-modal"), events);
							},
							//events_source: './server/calendar.php?a=list'
							events_source: './server/calendar.php?a=list'
						});
						$('.btn-group button[data-calendar-nav]').each(function() {
							var $this = $(this);
							$this.click(function() {
								gCalendar.navigate($this.data('calendar-nav'));
							});
						});

						$('.btn-group button[data-calendar-view]').each(function() {
							var $this = $(this);
							$this.click(function() {
								$this.siblings('.active').removeClass('active');
								$this.addClass('active');
								gCalendar.view($this.data('calendar-view'));
							});
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
		clan_id: gPersonalInfos.clan_id
	}, function(dataClanProvincesResponse) {
		$('#clanTotalProvinces').text(i18n.t('clan.nbprovinces', { count: dataClanProvincesResponse.count }));
	}, 'json');
};