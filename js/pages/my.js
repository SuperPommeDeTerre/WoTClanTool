var gIMAGE_PARAMS = {
		offsetElem: 180,
		offsetLine: 25,
		nbTanksByLine: 3
	},
	gTankTiersAllowedForResume = [4, 6, 7, 8, 10];

var applyTableTanksFilters = function(filter) {
	var myElems = $('.tank'),
		myFilteredElems = myElems;
	// Reduce elements by filter
	if (filter.isfull) {
		myFilteredElems = myFilteredElems.filter('.isfull');
	}
	if (filter.isready) {
		myFilteredElems = myFilteredElems.filter('.isready');
	}
	if (filter.ingarage) {
		myFilteredElems = myFilteredElems.filter('.ingarage');
	}
	// Hide all elements
	myElems.addClass('hidden');
	// And show filtered elements
	myFilteredElems.removeClass('hidden')
};

var getTankAdditionalInfos = function(pTankID, pTanksAdditionalInfos) {
	var i = 0;
	for (i=0; i<pTanksAdditionalInfos.length; i++) {
		if (pTanksAdditionalInfos[i].tank_id == pTankID) {
			return pTanksAdditionalInfos[i];
		}
	}
};

var onLoad = function() {
	checkConnected();
	progressNbSteps = 5;
	advanceProgress(i18n.t('loading.claninfos'));
	setNavBrandWithClan();
	advanceProgress(i18n.t('loading.tanksinfos'));
	var myTanksTable = $('#tableMyTanks'),
		myTanksSmallContainer = $('#myTanksContainerSmall'),
		myTanksBigContainer = $('#myTanksContainerBig');
	$('#btnShowTanksTable').on('click', function(evt) {
		var myButton = $(this);
		myButton.siblings().removeClass('active');
		myButton.addClass('active');
		myTanksTable.removeClass('hidden');
		myTanksSmallContainer.addClass('hidden');
		myTanksBigContainer.addClass('hidden');
	});
	$('#btnShowTanksListSmall').on('click', function(evt) {
		var myButton = $(this);
		myButton.siblings().removeClass('active');
		myButton.addClass('active');
		myTanksTable.addClass('hidden');
		myTanksSmallContainer.removeClass('hidden');
		myTanksBigContainer.addClass('hidden');
	});
	$('#btnShowTanksListLarge').on('click', function(evt) {
		var myButton = $(this);
		myButton.siblings().removeClass('active');
		myButton.addClass('active');
		myTanksTable.addClass('hidden');
		myTanksSmallContainer.addClass('hidden');
		myTanksBigContainer.removeClass('hidden');
	});
	$.post(gConfig.WG_API_URL + 'wot/encyclopedia/tanks/', {
		application_id: gConfig.WG_APP_ID,
		access_token: gConfig.ACCESS_TOKEN,
		language: gConfig.LANG
	}, function(dataTankopediaResponse) {
		var dataTankopedia = dataTankopediaResponse.data;
		advanceProgress(i18n.t('loading.mytanksinfos'));
		$.post(gConfig.WG_API_URL + 'wot/tanks/stats/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.LANG,
			access_token: gConfig.ACCESS_TOKEN,
			account_id: gConfig.PLAYER_ID
		}, function(dataMyTanksResponse) {
			var dataMyTanks = dataMyTanksResponse.data,
				myTanksTable = $('#tableMyTanks'),
				myTanksSmallContainer = $('#myTanksContainerSmall'),
				myTanksBigContainer = $('#myTanksContainerBig'),
				tableContent = '',
				listContent = '',
				listLargeContent = '',
				myTank = null,
				tankInfos = null,
				tankAdditionalInfos = null,
				winRatio = 0,
				chkInGarage = $('#chkInGarage'),
				chkIsFull = $('#chkIsFull');
				slideTankStatus = $('#slideTankStatus');
			// Save tanks infos
			$.post('./server/player.php', {
				'action': 'gettanksstats',
				'data': JSON.stringify(dataMyTanks)
			}, function(dataMyTanksResponse) {
				var dataMyTanksAdditionalInfos = dataMyTanksResponse.data[gConfig.PLAYER_ID];
				dataMyTanks = dataMyTanks[gConfig.PLAYER_ID];
				advanceProgress(i18n.t('loading.generating'));
				// Sort tanks by tiers
				dataMyTanks.sort(function(a, b) {
					var tankInfosA = dataTankopedia[a.tank_id],
						tankInfosB = dataTankopedia[b.tank_id];
					// Sort by tiers
					if (tankInfosA.level > tankInfosB.level) {
						return -1;
					}
					if (tankInfosA.level < tankInfosB.level) {
						return 1;
					}
					// Then by type
					if (gTANKS_TYPES[tankInfosA.type] < gTANKS_TYPES[tankInfosB.type]) {
						return -1;
					}
					if (gTANKS_TYPES[tankInfosA.type] > gTANKS_TYPES[tankInfosB.type]) {
						return 1;
					}
					return 0;
				});
				for (var i=0; i<dataMyTanks.length; i++) {
					myTank = dataMyTanks[i];
					tankInfos = dataTankopedia[myTank.tank_id];
					tankAdditionalInfos = getTankAdditionalInfos(myTank.tank_id, dataMyTanksAdditionalInfos);
					winRatio = -1;
					if (myTank.all.battles > 0) {
						winRatio = myTank.all.wins * 100 / myTank.all.battles;
					}
					tableContent += '<tr data-tankid="' + myTank.tank_id + '" class="tank '
						+ (tankAdditionalInfos.in_garage?'ingarage':'hidden')
						+ (tankInfos.is_premium?' ispremium':'')
						+ (tankInfos.is_premium||tankAdditionalInfos.is_full?' isfull':'')
						+ (tankAdditionalInfos.is_ready?' isready':'') + '">';
					tableContent += '<td><img src="' + tankInfos.contour_image + '" /></td>';
					tableContent += '<td data-value="' + myTank.mark_of_mastery + '" class="tankmastery' + myTank.mark_of_mastery + '">&nbsp;</td>';
					tableContent += '<td data-value="' + tankInfos.nation_i18n + '"><img src="./themes/' + gConfig.THEME + '/style/images/nation_' + tankInfos.nation + '.png" alt="' + tankInfos.nation_i18n + '" title="' + tankInfos.nation_i18n + '" width="24" height="24" /></td>';
					tableContent += '<td class="tankname">' + tankInfos.short_name_i18n + '</td>';
					tableContent += '<td data-value="' + tankInfos.level  + '"><img src="./themes/' + gConfig.THEME + '/style/images/Tier_' + tankInfos.level + '_icon.png" alt="' + gTANKS_LEVEL[tankInfos.level - 1] + '" title="' + tankInfos.level + '" /></td>';
					tableContent += '<td data-value="' + gTANKS_TYPES[tankInfos.type] + '"><img src="./themes/' + gConfig.THEME + '/style/images/type-' + tankInfos.type + '.png" alt="' + tankInfos.type_i18n + '" title="' + tankInfos.type_i18n + '" /></td>';
					tableContent += '<td>' + myTank.all.battles + '</td>';
					tableContent += '<td><span class="label label-' + getWN8Class(tankAdditionalInfos.wn8) + '">' + (Math.round(tankAdditionalInfos.wn8 * 100) / 100) + '</span></td>';
					tableContent += '<td data-value="' + winRatio + '">' + (winRatio > -1?(Math.round(winRatio * 100) / 100) + ' %':'-') + '</td>';
					tableContent += '<td><div data-toggle="tooltip" data-placement="top" class="slider shor slider-info" title="' + (tankAdditionalInfos.is_ready?i18n.t('tank.status.2'):tankAdditionalInfos.is_full||tankInfos.is_premium?i18n.t('tank.status.1'):i18n.t('tank.status.0')) + '"></div></td>';
					tableContent += '<td>&nbsp;</td>';
					tableContent += '</tr>';
					listContent += '<div class="small tank tankcontainer tankmastery' + myTank.mark_of_mastery +  (tankAdditionalInfos.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||tankAdditionalInfos.is_full?' isfull':'') +'">';
					listContent += '<div class="tanklevel' + tankInfos.level + '"><img src="' + tankInfos.image_small + '" /></div>';
					listContent += '<p class="tankname">' + tankInfos.short_name_i18n + '</p>';
					listContent += '</div>';
					listLargeContent += '<div class="big tank tankcontainer tankmastery' + myTank.mark_of_mastery + (tankAdditionalInfos.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||tankAdditionalInfos.is_full?' isfull':'') +'">';
					listLargeContent += '<div class="tanklevel' + tankInfos.level + '"><img src="' + tankInfos.image + '" /></div>';
					listLargeContent += '<p class="tankname">' + tankInfos.short_name_i18n + '</p>';
					listLargeContent += '</div>';
				}
				myTanksTable.attr('data-sortable', 'true');
				myTanksTable.find('tbody').append(tableContent);
				myTanksSmallContainer.html(listContent);
				myTanksBigContainer.html(listLargeContent);
				Sortable.initTable(myTanksTable[0]);
				myTanksTable.find(".shor").each(function(index, el) {
					var myElem = $(this),
						myElemSilderOptions = {
							start: 0,
							step: 1,
							range: {
								min: 0,
								max: 2
							}
						},
						myTankId = myElem.closest('tr').data('tankid'),
						myTankAdditionalInfos = getTankAdditionalInfos(myTankId, dataMyTanksAdditionalInfos),
						myTankInfos = dataTankopedia[myTankId];
					if (myTankInfos.is_premium) {
						myElem.removeClass('slider-info').addClass('slider-material-yellow');
					}
					if (myTankAdditionalInfos.is_ready) {
						myElemSilderOptions.start = 2;
					} else if (myTankAdditionalInfos.is_full || myTankInfos.is_premium) {
						myElemSilderOptions.start = 1;
					} 
					myElem.noUiSlider(myElemSilderOptions);
					myElem.on({
						set: function(evt) {
							var isFull = false,
								isReady = false,
								myLine = myElem.closest('tr');
							switch (parseInt(myElem.val())) {
								case 0:
									// Prevent change or premium tanks
									if (myLine.hasClass('ispremium')) {
										isFull = true;
										isReady = false;
										myElem.val(1);
									} else {
										isFull = false;
										isReady = false;
										myLine.removeClass('isfull').removeClass('isready');
									}
									break;
								case 1:
									isFull = true;
									isReady = false;
									myLine.addClass('isfull').removeClass('isready');
									break;
								case 2:
									isFull = true;
									isReady = true;
									myLine.addClass('isfull').addClass('isready');
									break;
							}
							myElem.tooltip('hide')
								.attr('data-original-title', i18n.t('tank.status.' + parseInt(myElem.val())))
								.tooltip('fixTitle')
								.tooltip('show');
							$.post('./server/player.php', {
								'action': 'settankprops',
								'tank_id': myTankId,
								'is_full': isFull,
								'is_ready': isReady
							}, function(dataSaveTanksResponse) {
								tankAdditionalInfos = getTankAdditionalInfos(myTankId, dataMyTanksAdditionalInfos);
								tankAdditionalInfos.is_full = isFull;
								tankAdditionalInfos.is_ready = isReady;
							}, 'json');
						}
					});
				});
				$('#btnShowTanksResume').on('click', function(evt) {
					var myCanvas = $('#canvasRecapPlayer'),
						canvasRealHeight = 0,
						basePosX = 0,
						basePosY = 0,
						textColor = '#000';
						curTankLevel = 0,
						curTankType = '',
						nbTanksOnLine = 0,
						commentText = '',
						generationDate = moment().format('LLL'),
						i = 0,
						j = 0;
					// Prepare data
					var dataToDisplay = {},
						listTankTypes = {};
						// Prepare tank types
					for (i = gTankTiersAllowedForResume.length - 1; i >= 0; i--) {
						listTankTypes = {};
						for (tankTypeName in gTANKS_TYPES) {
							listTankTypes[tankTypeName] = [];
						}
						dataToDisplay[gTANKS_LEVEL[gTankTiersAllowedForResume[i] - 1]] = listTankTypes;
					}
					for (i=0; i<dataMyTanks.length; i++) {
						myTank = dataMyTanks[i];
						tankInfos = dataTankopedia[myTank.tank_id];
						tankAdditionalInfos = getTankAdditionalInfos(myTank.tank_id, dataMyTanksAdditionalInfos);
						if (tankAdditionalInfos.in_garage
								&& ($.inArray(tankInfos.level, gTankTiersAllowedForResume) >= 0)
								&& tankAdditionalInfos.is_ready) {
							dataToDisplay[gTANKS_LEVEL[tankInfos.level - 1]][tankInfos.type].push({
								name: tankInfos.short_name_i18n,
								wn8: tankAdditionalInfos.wn8,
								contour: tankInfos.contour_image,
								is_premium: tankInfos.is_premium,
								is_full: tankAdditionalInfos.is_full
							});
						}
					}
					// Compute canvas real height
					for (tankTiersName in dataToDisplay) {
						var tankTiersDetails = dataToDisplay[tankTiersName],
							nbTanksInTIers = 0;
						for (tankTypeName in tankTiersDetails) {
							var tankTypeDetails = tankTiersDetails[tankTypeName];
							nbTanksInTIers += tankTypeDetails.length;
							canvasRealHeight += Math.ceil(tankTypeDetails.length / gIMAGE_PARAMS.nbTanksByLine) * gIMAGE_PARAMS.offsetLine;
						}
						if (nbTanksInTIers > 0) {
							canvasRealHeight += gIMAGE_PARAMS.offsetLine;
						}
					}
					// Draw canvas and compute resume text
					commentText = '<p style="color:#666;font-size:0.75em;text-align:center">' + generationDate + '</p>';
					if (canvasRealHeight == 0) {
						// We have no tanks ta display
						myCanvas.clearCanvas();
						myCanvas.attr('height', gIMAGE_PARAMS.offsetLine);
						myCanvas.attr('width', gIMAGE_PARAMS.nbTanksByLine * gIMAGE_PARAMS.offsetElem);
						myCanvas.drawText({
							fillStyle: '#666',
							fontStyle: 'normal',
							fontSize: 10,
							fontFamily: 'RobotoDraft, Roboto, Verdana, sans-serif',
							text: generationDate,
							//fromCenter: false,
							x: myCanvas.attr('width'), y: 15,
							respectAlign: true,
							align: 'right'
						});
					} else {
						// We have some tanks to display
						commentText += '<table border="1"><thead><tr><th>&nbsp;</th><th>' + i18n.t('tank.type.lightTank')
							+ '</th><th>' + i18n.t('tank.type.mediumTank')
							+ '</th><th>'+ i18n.t('tank.type.heavyTank')
							+ '</th><th>' + i18n.t('tank.type.AT-SPG')
							+ '</th><th>' + i18n.t('tank.type.SPG')
							+ '</th></tr></thead><tbody>\n';
						myCanvas.clearCanvas();
						myCanvas.attr('height', canvasRealHeight);
						myCanvas.attr('width', gIMAGE_PARAMS.nbTanksByLine * gIMAGE_PARAMS.offsetElem);
						myCanvas.drawText({
							fillStyle: '#666',
							fontStyle: 'normal',
							fontSize: 10,
							fontFamily: 'RobotoDraft, Roboto, Verdana, sans-serif',
							text: generationDate,
							//fromCenter: false,
							x: myCanvas.attr('width'), y: 15,
							respectAlign: true,
							align: 'right'
						});
						for (tankTiersName in dataToDisplay) {
							var tankTiersDetails = dataToDisplay[tankTiersName],
								nbTanksInTIers = 0;
							// Draw tiers header
							commentText += '<tr><th>' + tankTiersName + '</th>';
							// Draw image for tiers only if we have tanks in this tiers
							for (tankTypeName in tankTiersDetails) {
								nbTanksInTIers += tankTiersDetails[tankTypeName].length;
							}
							if (nbTanksInTIers == 0) {
								commentText += '<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>';
							} else {
								myCanvas.drawImage({
									source: './themes/' + gConfig.THEME + '/style/images/Tier_' + ($.inArray(tankTiersName, gTANKS_LEVEL) + 1) + '_icon.png',
									fromCenter: false,
									x: 10, y: basePosY + 5
								});
								myCanvas.drawLine({
									strokeStyle: '#333',
									strokeWidth: 1,
									x1: 0, y1: basePosY + gIMAGE_PARAMS.offsetLine - 3,
									x2: myCanvas.attr('width'), y2: basePosY + gIMAGE_PARAMS.offsetLine - 3
								});
								basePosY += gIMAGE_PARAMS.offsetLine;
								// Draw tanks details
								for (tankTypeName in tankTiersDetails) {
									var tankTypeDetails = tankTiersDetails[tankTypeName];
									commentText += '<td>';
									if (tankTypeDetails.length == 0) {
										// No tanks for this type
										commentText += '&nbsp;';
									} else {
										var countTanksInType = 0;
										nbTanksOnLine = 0;
										basePosX = 0;
										for (var i=0; i<tankTypeDetails.length; i++) {
											var aTank = tankTypeDetails[i];
											if (aTank.is_premium) {
												textColor = '#ffc107';
											} else if (aTank.is_full) {
												textColor = '#000';
											} else {
												textColor = '#666';
											}
											if (countTanksInType > 0) {
												commentText += ', ';
											}
											commentText += '<span style="color:' + getWN8Color(aTank.wn8) + '">&#9646;</span><span style="color:' + textColor + '">' + aTank.name + '</span>';
											nbTanksOnLine++;
											if (nbTanksOnLine >= gIMAGE_PARAMS.nbTanksByLine) {
												nbTanksOnLine = 0;
												basePosX = 0;
												basePosY += gIMAGE_PARAMS.offsetLine;
											}
											// Draw tank contour
											myCanvas.drawImage({
												source: aTank.contour,
												fromCenter: false,
												x: basePosX, y: basePosY
											});
											// Draw tank type
											myCanvas.drawImage({
												source: './themes/' + gConfig.THEME + '/style/images/type-' + tankTypeName + '.png',
												x: basePosX + 10, y: basePosY + 5
											});
											// Draw tank user skill (WN8)
											myCanvas.drawRect({
												fillStyle: getWN8Color(aTank.wn8),
												x: basePosX + 70, y: basePosY + 10,
												width: 10, height: 10,
												shadowColor: '#999',
												shadowBlur: 3,
												shadowX: 1,
												shadowY: 1
											});
											// Draw tank name
											myCanvas.drawText({
												fillStyle: textColor,
												x: basePosX + 79, y: basePosY + 5,
												fromCenter: false,
												fontSize: 12,
												fontFamily: 'RobotoDraft, Roboto, Verdana, sans-serif',
												text: aTank.name
											});
											basePosX += gIMAGE_PARAMS.offsetElem;
											countTanksInType++;
										}
										basePosY += gIMAGE_PARAMS.offsetLine;
									}
									commentText += '</td>';
								}
							}
							commentText += '</tr>\n';
						}
						commentText += '</tbody></table>';
					}
					$('#textResumePlayer').text(commentText);
				});
				chkInGarage.on('change', function(evt) {
					applyTableTanksFilters({
						isfull: parseInt(slideTankStatus.val()) > 0,
						isready: parseInt(slideTankStatus.val()) > 1,
						ingarage: chkInGarage.is(':checked')
					});
				});
				slideTankStatus.noUiSlider({
					start: 0,
					step: 1,
					range: {
						min: 0,
						max: 2
					}
				});
				slideTankStatus.on({
					'set': function(evt) {
						slideTankStatus.tooltip('hide')
							.attr('data-original-title', i18n.t('tank.status.' + parseInt(slideTankStatus.val())))
							.tooltip('fixTitle')
							.tooltip('show');
						applyTableTanksFilters({
							isfull: parseInt(slideTankStatus.val()) > 0,
							isready: parseInt(slideTankStatus.val()) > 1,
							ingarage: chkInGarage.is(':checked')
						});
					}
				});
				advanceProgress(i18n.t('loading.complete'));
				new ZeroClipboard($('#copy-button'));
				afterLoad();
			}, 'json');
		}, 'json');
	}, 'json');
};