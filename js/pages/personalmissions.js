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
	var getMissionShortName = function(pMission, pIndex) {
		var lResult = '';
		for (var tag in pMission.tags) {
			tag = pMission.tags[tag];
			switch (tag) {
				case 'lightTank':
					lResult = 'LT';
					break;
				case 'mediumTank':
					lResult = 'MT';
					break;
				case 'heavyTank':
					lResult = 'HT';
					break;
				case 'AT-SPG':
					lResult = 'TD';
					break;
				case 'SPG':
					lResult = 'SPG';
					break;
				case 'multiteam':
					lResult = 'D';
					break;
				case 'classic':
					lResult = 'SH';
					break;
			}
			if (lResult !== '') {
				break;
			}
		}
		return lResult + '-' + (pIndex + 1);
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
			lPersonalMissionHTMLNav = '',
			isFirstCampaign = true,
			isFirstOperation = true;
		advanceProgress(i18n.t('loading.complete'));
		for (var lCampaingId in lPMData) {
			var lPMCampaign = lPMData[lCampaingId];
			lPersonalMissionHTMLNav += '<li class="dropdown' + (isFirstCampaign === true?' active':'') + '"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + lPMCampaign.name + ' <span class="caret"></span></a>';
			if (isFirstCampaign === true) {
				isFirstCampaign = false;
			}
			lPersonalMissionHTMLNav += '<ul class="dropdown-menu">';
			for (var lPMCampaignOperationId in lPMCampaign.operations) {
				var lPMCampaignOperation = lPMCampaign.operations[lPMCampaignOperationId];
				lPersonalMissionHTMLNav += '<li' + (isFirstOperation === true?' class="active"':'') + '><a href="#" class="pmNavOperation" data-campaign="' + lPMCampaign.campaign_id + '" data-operation="' + lPMCampaignOperation.operation_id + '">'+ lPMCampaignOperation.name + '</a></li>';
				if (isFirstOperation === true) {
					isFirstOperation = false;
				}
			}
			lPersonalMissionHTMLNav += '</ul></li>';
		}
		$('#navCampaigns').html(lPersonalMissionHTMLNav).find('.pmNavOperation').on('click', function(evt) {
			evt.preventDefault();
			var myLink = $(this),
				myCampaignId = myLink.data('campaign') * 1,
				myOperationId = myLink.data('operation') * 1,
				lPMCampaignOperation = lPMData[myCampaignId].operations[myOperationId],
				lOperationHTML = '',
				lCountMissionsInSet = 0,
				lCurrentSetId = -1,
				lAdditionalClass = '',
				lMissionsNavHTML = '';
			lOperationHTML += '<div class="container-fluid">';
			lOperationHTML += '<div class="row">';
			lOperationHTML += '<div class="col-md-3"><img src="' + lPMCampaignOperation.image + '" alt="'+ lPMCampaignOperation.name + '" class="img-responsive img-rounded" /></div>';
			lOperationHTML += '<div class="col-md-9"><h2>' + lPMCampaignOperation.name + '</h2>';
			lOperationHTML += '<p>' + lPMCampaignOperation.description + '</p></div>';
			lOperationHTML += '</div>';
			lOperationHTML += '<div class="row">';
			lOperationHTML += '<div class="col-md-4">';
			for (var lPMMissionId in lPMCampaignOperation.missions) {
				var lMission = lPMCampaignOperation.missions[lPMMissionId],
					lPlayerPMStatus = gPersonalInfos.private.personal_missions[lPMMissionId];
				if (lCurrentSetId == -1) {
					lCurrentSetId = lMission.set_id;
				}
				if (lCurrentSetId != lMission.set_id) {
					continue;
				}
				lAdditionalClass = 'btn-material-grey-300';
				if (typeof(lPlayerPMStatus) != 'undefined' && lPlayerPMStatus != null) {
					switch (lPlayerPMStatus) {
						case 'NONE':
							break;
						case 'UNLOCKED':
							break;
						case 'NEED_GET_MAIN_REWARD':
							break;
						case 'MAIN_REWARD_GOTTEN':
							lAdditionalClass = 'btn-primary';
							break;
						case 'NEED_GET_ADD_REWARD':
							break;
						case 'NEED_GET_ALL_REWARDS':
							break;
						case 'ALL_REWARDS_GOTTEN':
							lAdditionalClass = 'btn-success';
							break;
						default:
							break;
					}
				} else {
					lPlayerPMStatus = '';
				}
				lMissionsNavHTML += '<button type="button" class="btnMission btn btn-sm ' + lAdditionalClass + '" data-mission="' + lPMMissionId + '">' + getMissionShortName(lMission, lCountMissionsInSet) + '</button>';
				lCountMissionsInSet++;
				if (lCountMissionsInSet >= lPMCampaignOperation.missions_in_set) {
					lMissionsNavHTML = '<div class="btn-group-vertical" role="group" aria-label="...">' + lMissionsNavHTML + '</div>';
					lOperationHTML += lMissionsNavHTML;
					lMissionsNavHTML = '';
					lCountMissionsInSet = 0;
					lCurrentSetId = -1;
				}
			}
			lOperationHTML += '</div>';
			lOperationHTML += '<div class="col-md-8" id="missionDetails">';
			lOperationHTML += '</div>';
			lOperationHTML += '</div>';
			$('#OperationDetails').html(lOperationHTML).find('.btnMission').on('click', function(evt) {
				evt.preventDefault();
				var lMission = lPMCampaignOperation.missions[$(this).data('mission')],
					lMissionHtml = '<h3>' + lMission.name + '</h3>';
				lMissionHtml += '<p>' + lMission.description + '</p>';
				lMissionHtml += '<p>' + lMission.hint + '</p>';
				lMissionHtml += '<h4>Objectifs principaux&nbsp;:</h4>';
				lMissionHtml += getConditionsHtml(lMission.rewards.primary.conditions);
				lMissionHtml += '<h4>Objectifs secondaires&nbsp;:</h4>';
				lMissionHtml += getConditionsHtml(lMission.rewards.secondary.conditions);
				$('#missionDetails').html(lMissionHtml);
			}).first().click();
		}).first().click();
		afterLoad();
	});
};