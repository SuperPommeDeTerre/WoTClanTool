var onLoad = function() {
	checkConnected();
	progressNbSteps = 2;
	setNavBrandWithClan();
	$.post('./server/player.php', {
		action: 'getwn8expectedvals'
	}, function(dataExpectedWN8Vals) {
		var wn8ExpectedVals = dataExpectedWN8Vals.data;
		advanceProgress($.t('loading.tanksinfos'));
		$.post(gConfig.WG_API_URL + 'wot/encyclopedia/vehicles/', {
			application_id: gConfig.WG_APP_ID,
			access_token: gConfig.ACCESS_TOKEN,
			language: gConfig.LANG
		}, function(dataTankopediaResponse) {
			advanceProgress($.t('loading.complete'));
			gTankopedia = dataTankopediaResponse.data;
			var tankExpectedValsIndex = null,
				tankExpectedVals = null,
				tankInfos = null,
				tableWN8ExpectedValsHTML = '',
				tableWN8ExpectedVals = $('#wn8ExpectedVals');
			for (tankExpectedValsIndex in wn8ExpectedVals) {
				tankExpectedVals = wn8ExpectedVals[tankExpectedValsIndex];
				tankInfos = gTankopedia[tankExpectedVals.IDNum + ''];
				if (tankInfos != null) {
					tableWN8ExpectedValsHTML += '<tr>';
					tableWN8ExpectedValsHTML += '<td><img src="' + tankInfos.images.contour_icon + '" alt="' + tankInfos.short_name + '" title="' + tankInfos.short_name + '" /></td>';
					tableWN8ExpectedValsHTML += '<td data-value="' + tankInfos.nation + '"><img src="./themes/' + gConfig.THEME + '/style/images/nation_' + tankInfos.nation + '.png" alt="' + $.t('tank.nation.' + tankInfos.nation) + '" title="' + $.t('tank.nation.' + tankInfos.nation) + '" width="24" height="24" /></td>';
					tableWN8ExpectedValsHTML += '<td class="' + (tankInfos.is_premium?'ispremium':'') + '"><span class="tankname">' + tankInfos.short_name + '</span></td>';
					tableWN8ExpectedValsHTML += '<td class="tanklevel" data-value="' + tankInfos.tier + '"><img src="./themes/' + gConfig.THEME + '/style/images/Tier_' + tankInfos.tier + '_icon.png" alt="' + gTANKS_LEVEL[tankInfos.tier - 1] + '" title="' + tankInfos.tier + '" /></td>';
					tableWN8ExpectedValsHTML += '<td class="tanktype" data-value="' + gTANKS_TYPES[tankInfos.type] + '"><img src="./themes/' + gConfig.THEME + '/style/images/type-' + tankInfos.type + '.png" alt="' + tankInfos.type + '" title="' + $.t('tank.type.' + tankInfos.type) + '" /></td>';
					tableWN8ExpectedValsHTML += '<td>' + tankExpectedVals.expFrag + '</td>';
					tableWN8ExpectedValsHTML += '<td>' + tankExpectedVals.expDamage + '</td>';
					tableWN8ExpectedValsHTML += '<td>' + tankExpectedVals.expSpot + '</td>';
					tableWN8ExpectedValsHTML += '<td>' + tankExpectedVals.expDef + '</td>';
					tableWN8ExpectedValsHTML += '<td>' + tankExpectedVals.expWinRate + '</td>';
					tableWN8ExpectedValsHTML += '</tr>';
				}
			}
			tableWN8ExpectedVals.attr('data-sortable', 'true');
			tableWN8ExpectedVals.find('tbody').html(tableWN8ExpectedValsHTML);
			Sortable.initTable(tableWN8ExpectedVals[0]);
			afterLoad();
		}, 'json');
	}, 'json');
};