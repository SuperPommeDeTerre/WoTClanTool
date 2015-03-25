var applyTableTanksFilters = function(filter) {
	var myElems = $('.tank'),
		myFilteredElems = myElems;
	// Reduce elements by filter
	if (filter.isfull) {
		myFilteredElems = myFilteredElems.filter('.isfull');
	}
	if (filter.ingarage) {
		myFilteredElems = myFilteredElems.filter('.ingarage');
	}
	// Hide all elements
	myElems.addClass('hidden');
	// And show filtered elements
	myFilteredElems.removeClass('hidden')
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
		var dataTankopedia = dataTankopediaResponse.data,
			myTanksTable = $('#tableMyTanks'),
			myTanksSmallContainer = $('#myTanksContainerSmall'),
			myTanksBigContainer = $('#myTanksContainerBig'),
			tableContent = '',
			listContent = '',
			listLargeContent = '',
			myTank = null,
			tankInfos = null,
			winRatio = 0,
			chkInGarage = $('#chkInGarage'),
			chkIsFull = $('#chkIsFull');
		advanceProgress(i18n.t('loading.mytanksinfos'));
		$.post('./server/player.php', {
			'action': 'gettanksstats'
		}, function(dataMyTanksResponse) {
			var dataMyTanks = dataMyTanksResponse.data[gConfig.PLAYER_ID];
			advanceProgress(i18n.t('loading.generating'));
			// Sort tanks by tiers
			dataMyTanks.sort(function(a, b) {
				var tankInfosA = dataTankopedia[a.tank_id],
					tankInfosB = dataTankopedia[b.tank_id];
				// First, sort by level
				if (tankInfosA.level > tankInfosB.level) {
					return -1;
				}
				if (tankInfosA.level < tankInfosB.level) {
					return 1;
				}
				// Then by type
				if (gTANKS_TYPES[tankInfosA.type] > gTANKS_TYPES[tankInfosB.type]) {
					return -1;
				}
				if (gTANKS_TYPES[tankInfosA.type] < gTANKS_TYPES[tankInfosB.type]) {
					return -1;
				}
				return 0;
			});
			var myCanvas = $('#canvasRecapPlayer'),
				nbTanksInGarage = 0,
				curTankInGarage = 0,
				basePosX = 0,
				basePosY = 0,
				textColor = '#000',
				curTankLevel = -1,
				curTankType = '',
				nbMaxTanksInLevel = 0;
			for (var i=0; i<dataMyTanks.length; i++) {
				if (dataMyTanks[i].in_garage) {
					nbTanksInGarage++;
				}
			}
			myCanvas.attr('height', nbTanksInGarage * 25);
			for (var i=0; i<dataMyTanks.length; i++) {
				myTank = dataMyTanks[i];
				tankInfos = dataTankopedia[myTank.tank_id];
				winRatio = -1;
				if (myTank.all.battles > 0) {
					winRatio = myTank.all.wins * 100 / myTank.all.battles;
				}
				if (myTank.in_garage) {
					if (curTankLevel != myTank.level) {
						// Change level
						if (curTankLevel == -1) {
						}
						curTankLevel = myTank.level;
						myCanvas.drawImage({
							source: './themes/default/style/images/Tier_' + tankInfos.level + '_icon.png',
							x: 10, y: basePosY + 5
						});
					}
					if (curTankType != gTANKS_TYPES[myTank.type]) {
						curTankType = gTANKS_TYPES[myTank.type];
					}
					myCanvas.drawImage({
						source: tankInfos.contour_image,
						x: 30, y: (curTankInGarage * 25) + 10
					});
					myCanvas.drawImage({
						source: './themes/default/style/images/type-' + tankInfos.type + '.png',
						x: 70, y: (curTankInGarage * 25) + 10
					});
					if (myTank['is_full'] || myTank.is_premium) {
						textColor = '#000';
					} else {
						textColor = '#666';
					}
					myCanvas.drawText({
						fillStyle: textColor,
						strokeStyle: textColor,
						strokeWidth: 0,
						x: 90, y: (curTankInGarage * 25) + 5,
						fromCenter: false,
						fontSize: 12,
						fontFamily: 'RobotoDraft, Roboto, Verdana, sans-serif',
						text: tankInfos.short_name_i18n
					});
					/*
					$('canvas').drawLine({
						strokeStyle: '#000',
						strokeWidth: 10,
						rounded: true,
						x1: 80, y1: 50,
						x2: 100, y2: 150,
						x3: 200, y3: 100,
						x4: 150, y4: 200
					});
					*/
					curTankInGarage++;
				}
				tableContent += '<tr class="tank ' + (myTank.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||myTank['is_full']?' isfull':'') +'">';
				tableContent += '<td><img src="' + tankInfos.contour_image + '" /></td>';
				tableContent += '<td data-value="' + myTank.mark_of_mastery + '" class="tankmastery' + myTank.mark_of_mastery + '">&nbsp;</td>';
				tableContent += '<td class="tankname">' + tankInfos.short_name_i18n + '</td>';
				tableContent += '<td data-value="' + tankInfos.level  + '">' + gTANKS_LEVEL[tankInfos.level - 1] + '</td>';
				tableContent += '<td>' + tankInfos.type_i18n + '</td>';
				tableContent += '<td>' + myTank.all.battles + '</td>';
				tableContent += '<td><span class="label label-' + getWN8Class(myTank.wn8) + '">' + (Math.round(myTank.wn8 * 100) / 100) + '</span></td>';
				tableContent += '<td data-value="' + winRatio + '">' + (winRatio > -1?(Math.round(winRatio * 100) / 100) + ' %':'-') + '</td>';
				tableContent += '<td data-value="' + (tankInfos.is_premium?'1':'0') + '"><div class="togglebutton' + (tankInfos.is_premium?' togglebutton-material-amber':'') + '"><label>&nbsp;<input type="checkbox" class="chkTanksIsFull" id="chkTanksIsFull' + myTank.tank_id + '" value="' + myTank.tank_id + '"' + (tankInfos.is_premium||myTank['is_full']?' checked="checked"':'') + (tankInfos.is_premium?' disabled="disabled"':'') + ' /></label></div></td>';
				tableContent += '</tr>';
				listContent += '<div class="small tank tankcontainer tankmastery' + myTank.mark_of_mastery +  (myTank.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||myTank['is_full']?' isfull':'') +'">';
				listContent += '<div class="tanklevel' + tankInfos.level + '"><img src="' + tankInfos.image_small + '" /></div>';
				listContent += '<p class="tankname">' + tankInfos.short_name_i18n + '</p>';
				listContent += '</div>';
				listLargeContent += '<div class="big tank tankcontainer tankmastery' + myTank.mark_of_mastery + (myTank.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||myTank['is_full']?' isfull':'') +'">';
				listLargeContent += '<div class="tanklevel' + tankInfos.level + '"><img src="' + tankInfos.image + '" /></div>';
				listLargeContent += '<p class="tankname">' + tankInfos.short_name_i18n + '</p>';
				listLargeContent += '</div>';
			}
			myTanksTable.attr('data-sortable', 'true');
			myTanksTable.find('tbody').append(tableContent);
			myTanksSmallContainer.html(listContent);
			myTanksBigContainer.html(listLargeContent);
			Sortable.initTable(myTanksTable[0]);
			myTanksTable.find('.chkTanksIsFull').on('change', function(evt) {
				$.post('./server/player.php', {
					'action': 'settankisfull',
					'tank_id': $(this).val(),
					'is_full': $(this).is(':checked')
				}, function(dataSaveTanksResponse) {
				}, 'json');
				$(this).closest('tr').toggleClass('isfull');
			});
			chkInGarage.on('change', function(evt) {
				applyTableTanksFilters({
					isfull: chkIsFull.is(':checked'),
					ingarage: chkInGarage.is(':checked')
				});
			});
			chkIsFull.on('change', function(evt) {
				applyTableTanksFilters({
					isfull: chkIsFull.is(':checked'),
					ingarage: chkInGarage.is(':checked')
				});
			});
			advanceProgress(i18n.t('loading.complete'));
			afterLoad();
		}, 'json');
	}, 'json');
};