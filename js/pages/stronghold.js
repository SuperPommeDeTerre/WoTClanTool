var onLoad = function() {
	checkConnected();
	progressNbSteps = 5;
	setNavBrandWithClan();
	$.post(gConfig.WG_API_URL + 'wot/stronghold/info/', {
		application_id: gConfig.WG_APP_ID,
		access_token: gConfig.ACCESS_TOKEN,
		language: gConfig.LANG,
		clan_id: gPersonalInfos.clan_id
	}, function(dataStrongholdResponse) {
		if (isDebugEnabled()) {
			logDebug('dataStrongholdResponse=' + JSON.stringify(dataStrongholdResponse, null, 4));
		}
		advanceProgress($.t('loading.mytanksinfos'));
		var gStronghold = dataStrongholdResponse.data[gPersonalInfos.clan_id];
		$.post(gConfig.WG_API_URL + 'wot/stronghold/buildings/', {
			application_id: gConfig.WG_APP_ID,
			access_token: gConfig.ACCESS_TOKEN,
			language: gConfig.LANG,
			clan_id: gPersonalInfos.clan_id
		}, function(dataStrongholdBuildingsResponse) {
			if (isDebugEnabled()) {
				logDebug('dataStrongholdBuildingsResponse=' + JSON.stringify(dataStrongholdBuildingsResponse, null, 4));
			}
			advanceProgress($.t('loading.complete'));
			var gStrongholdBuildings = dataStrongholdBuildingsResponse.data,
				buildingIndex = 0,
				buildingsHtml = '<div class="row">',
				nbBuildings = 0;
			for (buildingIndex in gStrongholdBuildings) {
				var myBuilding = gStrongholdBuildings[buildingIndex];
				buildingIndex = buildingIndex * 1;
				// Skip command center
				if (buildingIndex == 1 || typeof(gStronghold.buildings[buildingIndex]) == 'undefined') {
					continue;
				}
				if (nbBuildings > 0 && nbBuildings % 4 == 0) {
					buildingsHtml += '</div><div class="row">';
				}
				buildingsHtml += '<div class="col-md-3 col-xs-12">',
				buildingsHtml += '<div class="panel panel-default">';
				buildingsHtml += '<div class="panel-heading">';
				buildingsHtml += '<h3 class="panel-title">' + myBuilding.title + ' <img src="./themes/' + gConfig.THEME + '/style/images/Tier_' + gStronghold.buildings[buildingIndex].level + '_icon.png" alt="' + gStronghold.buildings[buildingIndex].level + '" title="' + gStronghold.buildings[buildingIndex].level + '" />';
				buildingsHtml += '</h3>';
				buildingsHtml += '</div>';
				buildingsHtml += '<div class="panel-body">';
				if (myBuilding.image_url != null) {
					buildingsHtml += '<img src="' + myBuilding.image_url + '" class="img-responsive" />';
				}
				if (myBuilding.description != null) {
					buildingsHtml += '<p>' + myBuilding.description + '</p>';
				}
				if (myBuilding.reserve != null) {
					buildingsHtml += '<h4>' + myBuilding.reserve.title + '</h4>';
					buildingsHtml += '<img src="' + myBuilding.reserve.image_url + '" class="img-responsive pull-left" alt="' + myBuilding.reserve.title + '" title="' + myBuilding.reserve.title + '" />';
					buildingsHtml += '<p>' + myBuilding.reserve.description + '</p>';
				}
				buildingsHtml += '</div>';
				buildingsHtml += '</div>';
				buildingsHtml += '</div>';
				nbBuildings++;
			}
			buildingsHtml += '</div>';
			$('#strongholdBuildings').append(buildingsHtml);
			$.post(gConfig.WG_API_URL + 'wot/stronghold/plannedbattles/', {
				application_id: gConfig.WG_APP_ID,
				access_token: gConfig.ACCESS_TOKEN,
				language: gConfig.LANG,
				clan_id: gPersonalInfos.clan_id
			}, function(dataStrongholdBattlesResponse) {
				if (isDebugEnabled()) {
					logDebug('dataStrongholdBattlesResponse=' + JSON.stringify(dataStrongholdBattlesResponse, null, 4));
				}
				afterLoad();
			}, 'json');
		}, 'json');
	}, 'json');
	// /wot/stronghold/info/
	// /wot/stronghold/buildings/
	// /wot/stronghold/accountstats/
	// /wot/stronghold/plannedbattles/
};