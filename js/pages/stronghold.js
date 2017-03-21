var onLoad = function() {
	checkConnected();
	progressNbSteps = 5;
	setNavBrandWithClan();
	$.post(gConfig.WG_API_URL + 'wot/stronghold/claninfo/', {
		application_id: gConfig.WG_APP_ID,
		access_token: gConfig.ACCESS_TOKEN,
		language: gConfig.LANG,
		clan_id: gPersonalInfos.clan_id
	}, function(dataStrongholdResponse) {
		if (isDebugEnabled()) {
			logDebug('dataStrongholdResponse=' + JSON.stringify(dataStrongholdResponse, null, 4));
		}
		advanceProgress($.t('loading.complete'));
		var gStronghold = dataStrongholdResponse.data[gPersonalInfos.clan_id],
			buildingIndex = 0,
			buildingsHtml = '<div class="row">',
			nbBuildings = 0;
		for (buildingIndex in gStronghold.building_slots) {
			var myBuilding = gStronghold.building_slots[buildingIndex];
			buildingIndex = buildingIndex * 1;
			// Skip command center
			if (buildingIndex == 1 || typeof(gStronghold.building_slots[buildingIndex]) == 'undefined') {
				continue;
			}
			if (nbBuildings > 0 && nbBuildings % 4 == 0) {
				buildingsHtml += '</div><div class="row">';
			}
			buildingsHtml += '<div class="col-md-3 col-xs-12">',
			buildingsHtml += '<div class="panel panel-default">';
			buildingsHtml += '<div class="panel-heading">';
			buildingsHtml += '<h3 class="panel-title">' + myBuilding.building_title + ' <img src="./themes/' + gConfig.THEME + '/style/images/Tier_' + myBuilding.building_level + '_icon.png" alt="' + myBuilding.building_level + '" title="' + myBuilding.building_level + '" />';
			buildingsHtml += '</h3>';
			buildingsHtml += '</div>';
			buildingsHtml += '<div class="panel-body">';
			/*if (myBuilding.image_url != null) {
				buildingsHtml += '<img src="' + myBuilding.image_url + '" class="img-responsive" />';
			}
			if (myBuilding.description != null) {
				buildingsHtml += '<p>' + myBuilding.description + '</p>';
			}
			*/
			if (myBuilding.reserve != null) {
				buildingsHtml += '<h4>' + myBuilding.reserve_title + '</h4>';
				/*
				buildingsHtml += '<img src="' + myBuilding.reserve.image_url + '" class="img-responsive pull-left" alt="' + myBuilding.reserve.title + '" title="' + myBuilding.reserve.title + '" />';
				buildingsHtml += '<p>' + myBuilding.reserve.description + '</p>';
				*/
			}
			buildingsHtml += '</div>';
			buildingsHtml += '</div>';
			buildingsHtml += '</div>';
			nbBuildings++;
		}
		buildingsHtml += '</div>';
		$('#strongholdBuildings').append(buildingsHtml);
		afterLoad();
	}, 'json');
};