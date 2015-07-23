var onLoad = function() {
	var getConditionsHtml = function(pConditions) {
		var lResult = '<ul>',
			lConditionsArray = pConditions.split(/\u2022/g);
		for (var lConditionIndex in lConditionsArray) {
			if (lConditionIndex == 0) {
				continue;
			}
			lResult += '<li>' + lConditionsArray[lConditionIndex].replace(/\u2022/gi, '').trim() + '</li>';
		}
		lResult += '</ul>';
		return lResult;
	};
	checkConnected();
	setNavBrandWithClan();
	progressNbSteps = 3;
	advanceProgress(i18n.t('loading.generating'));
	// Handle personal missions
	$.post(gConfig.WG_API_URL + 'wot/encyclopedia/personalmissions/', {
		application_id: gConfig.WG_APP_ID,
		access_token: gConfig.ACCESS_TOKEN,
		language: gConfig.LANG
	}, function(dataEncyclopediaPersonalMissionsResponse) {
		var lPMData = dataEncyclopediaPersonalMissionsResponse.data,
			lPersonalMissionsHeader = $('.main h1'),
			lPersonalMissionHTMLHeader = '',
			lPersonalMissionHTML = '';
		advanceProgress(i18n.t('loading.complete'));
		for (var lCampaingId in lPMData) {
			var lPMCampaign = lPMData[lCampaingId];
			lPersonalMissionHTMLHeader += '<div class="panel panel-default" id="PMCampaign' + lPMCampaign.campaign_id + '">';
			lPersonalMissionHTMLHeader += '<div class="panel-heading">';
			lPersonalMissionHTMLHeader += '<h2>' + lPMCampaign.name + '</h2>';
			lPersonalMissionHTMLHeader += '<p>' + lPMCampaign.description + '</p>';
			lPersonalMissionHTMLHeader += '</div>';
			lPersonalMissionHTMLHeader += '<div class="panel-body">';
			lPersonalMissionHTMLHeader += '<div class="container-fluid">';
			lPersonalMissionHTMLHeader += '<div class="row">';
			for (var lPMCampaignOperationId in lPMCampaign.operations) {
				var lPMCampaignOperation = lPMCampaign.operations[lPMCampaignOperationId];
				lPersonalMissionHTMLHeader += '<div class="col-xs-12 col-sm-6 col-md-3">';
				lPersonalMissionHTMLHeader += '<a href="#collapsePMCampaign' + lPMCampaign.campaign_id + 'Operation' + lPMCampaignOperation.operation_id + '" class="thumbnail" data-toggle="collapse" data-parent="#accordion" href="#collapsePMCampaign' + lPMCampaign.campaign_id + 'Operation' + lPMCampaignOperation.operation_id + '" aria-expanded="false" aria-controls="collapsePMCampaign' + lPMCampaign.campaign_id + 'Operation' + lPMCampaignOperation.operation_id + '">';
				lPersonalMissionHTMLHeader += '<img src="' + lPMCampaignOperation.image + '" alt="'+ lPMCampaignOperation.name + '" class="img-rounded" />';
				lPersonalMissionHTMLHeader += '<div class="caption"><h3 id="PMCampaign' + lPMCampaign.campaign_id + 'Operation' + lPMCampaignOperation.operation_id + '">' + lPMCampaignOperation.name + '</h3>';
				lPersonalMissionHTMLHeader += '<p>' + lPMCampaignOperation.description + '</p></div></a></div>';
				lPersonalMissionHTML += '<div id="collapsePMCampaign' + lPMCampaign.campaign_id + 'Operation' + lPMCampaignOperation.operation_id + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
				lPersonalMissionHTML += '<div class="panel-body">';
				for (var lPMMissionId in lPMCampaignOperation.missions) {
					var lMission = lPMCampaignOperation.missions[lPMMissionId],
						lPlayerPMStatus = gPersonalInfos.private.personal_missions[lPMMissionId];
					if (typeof(lPlayerPMStatus) != 'undefined' &&  lPlayerPMStatus != null) {
						switch (lPlayerPMStatus) {
							case 'NONE':
								break;
							case 'UNLOCKED':
								break;
							case 'NEED_GET_MAIN_REWARD':
								break;
							case 'MAIN_REWARD_GOTTEN':
								break;
							case 'NEED_GET_ADD_REWARD':
								break;
							case 'NEED_GET_ALL_REWARDS':
								break;
							case 'ALL_REWARDS_GOTTEN':
								break;
							default:
								break;
						}
					}
					lPersonalMissionHTML += '<h3 id="PMCampaign' + lPMCampaign.campaign_id + 'Operation' + lPMCampaignOperation.operation_id + 'Mission' + lMission.mission_id + '">' + lMission.name + ' <span class="label label-default">' + lPlayerPMStatus + '</span></h3>';
					lPersonalMissionHTML += '<p>' + lMission.description + '</p>';
					lPersonalMissionHTML += '<p>' + lMission.hint + '</p>';
					lPersonalMissionHTML += '<p>Objectifs principaux:</p>';
					lPersonalMissionHTML += getConditionsHtml(lMission.rewards.primary.conditions);
					lPersonalMissionHTML += '<p>Objectifs secondaires:</p>';
					lPersonalMissionHTML += getConditionsHtml(lMission.rewards.secondary.conditions);
				}
				lPersonalMissionHTML += '</div></div>';
			}
			lPersonalMissionHTMLHeader += '</div></div></div></div>';
			lPersonalMissionHTML = lPersonalMissionHTMLHeader + lPersonalMissionHTML;
		}
		lPersonalMissionsHeader.after(lPersonalMissionHTML);
		afterLoad();
	});
};