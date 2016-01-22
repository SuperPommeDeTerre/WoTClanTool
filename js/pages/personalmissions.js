var onLoad = function() {
	var gProvisionspedia = null;
	var getConditionsHtml = function(pConditions) {
		var lResult = '<ul>',
			lConditionsArray = getConditionsArray(pConditions);
		for (var lConditionIndex in lConditionsArray) {
			if (lConditionIndex == 0) {
				continue;
			}
			lResult += '<li>' + lConditionsArray[lConditionIndex].replace(/\u2022/gi, '').trim() + '</li>';
		}
		return lResult + '</ul>';
	};
	var getConditionsArray = function(pConditions) {
		return pConditions.split(/\u2022/g);
	};
	var getRewardsCount = function(pRewards) {
		var lResult = 0;
		if (pRewards.berths > 0) {
			lResult++;
		}
		if (pRewards.credits > 0) {
			lResult++;
		}
		if (pRewards.free_xp > 0) {
			lResult++;
		}
		if (pRewards.slots > 0) {
			lResult++;
		}
		if (pRewards.tokens > 0) {
			lResult++;
		}
		if (pRewards.premium > 0) {
			lResult++;
		}
		lResult += Object.keys(pRewards.items).length;
		return lResult;
	};
	var getRewardsHtml = function(pRewards) {
		var lResult = '<ul>';
		lResult += '<dl class="dl-horizontal">';
		if (pRewards.berths > 0) {
			lResult += '<dt><span class="glyphicon glyphicon-user" aria-hidden="true" /></dt>';
			lResult += '<dd>' + pRewards.berths + '</dd>';
		}
		if (pRewards.credits > 0) {
			lResult += '<dt><span class="glyphicon glyphicon-usd" aria-hidden="true" /</dt>';
			lResult += '<dd>' + pRewards.credits + '</dd>';
		}
		if (pRewards.free_xp > 0) {
			lResult += '<dt><span class="glyphicon glyphicon-star" aria-hidden="true" /></dt>';
			lResult += '<dd>' + pRewards.free_xp + '</dd>';
		}
		if (pRewards.slots > 0) {
			lResult += '<dt><span class="glyphicon glyphicon-oil" aria-hidden="true" title="' + i18n.t('personalmissions.reward.slots', { count: pRewards.slots }) + '" /></dt>';
			lResult += '<dd>' + pRewards.slots + '</dd>';
		}
		if (pRewards.tokens > 0) {
			lResult += '<dt><span class="glyphicon glyphicon-lock" aria-hidden="true" /></dt>';
			lResult += '<dd>' + pRewards.tokens + '</dd>';
		}
		if (pRewards.premium > 0) {
			lResult += '<dt><span class="glyphicon glyphicon-calendar" aria-hidden="true" /></dt>';
			lResult += '<dd>' + pRewards.premium + '</dd>';
		}
		if (Object.keys(pRewards.items).length > 0) {
			for (var itemId in pRewards.items) {
				lResult += '<dt><img src="' + gProvisionspedia[itemId].image + '" alt="' + gProvisionspedia[itemId].name + '" title="' + gProvisionspedia[itemId].name + '" /></dt>';
				lResult += '<dd>' + pRewards.items[itemId] + '</dd>';
			}
			
		}
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
	advanceProgress(i18n.t('loading.tanksinfos'));
	$.post(gConfig.WG_API_URL + 'wot/encyclopedia/vehicles/', {
		application_id: gConfig.WG_APP_ID,
		access_token: gConfig.ACCESS_TOKEN,
		language: gConfig.LANG
	}, function(dataTankopediaResponse) {
		gTankopedia = dataTankopediaResponse.data;
		// Get equipment and consumables reference
		$.post(gConfig.WG_API_URL + 'wot/encyclopedia/provisions/', {
			application_id: gConfig.WG_APP_ID,
			access_token: gConfig.ACCESS_TOKEN,
			language: gConfig.LANG
		}, function(equipmentopediaResponse) {
			gProvisionspedia = equipmentopediaResponse.data;
			// Handle personal missions
			advanceProgress(i18n.t('loading.personalmissions.reference'));
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
				advanceProgress(i18n.t('loading.generating'));
				for (var lCampaingId in lPMData) {
					var lPMCampaign = lPMData[lCampaingId];
					lPersonalMissionHTMLNav += '<li class="dropdown' + (isFirstCampaign === true?' active':'') + '"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" data-campaign="' + lPMCampaign.campaign_id + '">' + lPMCampaign.name + ' <span class="caret"></span></a>';
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
				// Show operation details on click (prevent hiding/showing mecanism)
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
					lOperationHTML += '<p>' + lPMCampaignOperation.description + '</p>';
					lOperationHTML += '<h3>' + i18n.t('personalmissions.reward.label', { count: (lPMCampaignOperation.reward.slots > 0?1:0) + (lPMCampaignOperation.reward.tanks.length > 0?1:0) }) + '</h3>';
					lOperationHTML += '<dl class="dl-horizontal">';
					if (lPMCampaignOperation.reward.slots > 0) {
						lOperationHTML += '<dt>' + i18n.t('personalmissions.reward.slots', { count: lPMCampaignOperation.reward.slots }) + '</dt>';
						lOperationHTML += '<dd>' + lPMCampaignOperation.reward.slots + '</dd>';
					}
					if (lPMCampaignOperation.reward.tanks.length > 0) {
						lOperationHTML += '<dt>' + i18n.t('personalmissions.reward.tanks', { count: lPMCampaignOperation.reward.tanks.length }) + '</dt>';
						for (var rewarTankIdIndex in lPMCampaignOperation.reward.tanks) {
							var myTankId = lPMCampaignOperation.reward.tanks[rewarTankIdIndex];
							lOperationHTML += '<dd>' + gTankopedia[myTankId].name + '</dd>';
						}
					}
					lOperationHTML += '</dl>';
					lOperationHTML += '</div></div>';
					lOperationHTML += '<div class="row">';
					var colBtnsSizeClass = '',
						colDescSizeClass = '';
					switch (lPMCampaignOperation.sets_count) {
						case 1:
						case 2:
							colBtnsSizeClass = 'col-md-2';
							colDescSizeClass = 'col-md-10';
							break;
						case 3:
						case 4:
							colBtnsSizeClass = 'col-md-3';
							colDescSizeClass = 'col-md-9';
							break;
						case 5:
						case 6:
							colBtnsSizeClass = 'col-md-4';
							colDescSizeClass = 'col-md-8';
							break;
						case 7:
						case 8:
							colBtnsSizeClass = 'col-md-5';
							colDescSizeClass = 'col-md-7';
							break;
					}
					lOperationHTML += '<div class="' + colBtnsSizeClass + '">';
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
					lOperationHTML += '<div class="' + colDescSizeClass + '" id="missionDetails">';
					lOperationHTML += '</div>';
					lOperationHTML += '</div>';
					// Show mission details on click (prevent hiding/showing mecanism)
					$('#OperationDetails').html(lOperationHTML).find('.btnMission').on('click', function(evt) {
						evt.preventDefault();
						var myMissionLink = $(this),
							lMission = lPMCampaignOperation.missions[myMissionLink.data('mission')],
							lMissionHtml = '<h3>' + lMission.name + '</h3>';
						lMissionHtml += '<p>' + lMission.description + '</p>';
						lMissionHtml += '<p>' + lMission.hint + '</p>';
						lMissionHtml += '<h4>' + i18n.t('personalmissions.goal', { count: (getConditionsArray(lMission.rewards.primary.conditions).length - 1) + (getConditionsArray(lMission.rewards.secondary.conditions).length - 1) }) + '</h4>';
						lMissionHtml += '<div class="container-fluid">';
						lMissionHtml += '<div class="row">';
						lMissionHtml += '<div class="col-md-6">';
						lMissionHtml += '<h5>' + i18n.t('personalmissions.primary', { count: getConditionsArray(lMission.rewards.primary.conditions).length - 1 }) + '</h5>';
						lMissionHtml += getConditionsHtml(lMission.rewards.primary.conditions);
						lMissionHtml += '</div>';
						lMissionHtml += '<div class="col-md-6">';
						lMissionHtml += '<h5>' + i18n.t('personalmissions.secondary', { count: getConditionsArray(lMission.rewards.secondary.conditions).length - 1 }) + '</h5>';
						lMissionHtml += getConditionsHtml(lMission.rewards.secondary.conditions);
						lMissionHtml += '</div>';
						lMissionHtml += '</div>';
						lMissionHtml += '<div class="row">';
						lMissionHtml += '<div class="col-md-6">';
						lMissionHtml += '<h5>' + i18n.t('personalmissions.reward.label', { count: getRewardsCount(lMission.rewards.primary) }) + '</h5>';
						lMissionHtml += getRewardsHtml(lMission.rewards.primary);
						lMissionHtml += '</div>';
						lMissionHtml += '<div class="col-md-6">';
						lMissionHtml += '<h5>' + i18n.t('personalmissions.reward.label', { count: getRewardsCount(lMission.rewards.secondary) }) + '</h5>';
						lMissionHtml += getRewardsHtml(lMission.rewards.secondary);
						lMissionHtml += '</div>';
						lMissionHtml += '</div>';
						lMissionHtml += '</div>';
						$('#missionDetails').html(lMissionHtml);
						$('#OperationDetails').find('.active').removeClass('active');
						myMissionLink.addClass('active');
					}).first().click();
					$('#navCampaignContainer').find('.active').removeClass('active');
					$('#navCampaignContainer').find('.dropdown-toggle[data-campaign=' + myCampaignId + ']').parent().addClass('active').find('[data-operation=' + myOperationId + ']').parent().addClass('active');
				}).first().click();
				advanceProgress(i18n.t('loading.complete'));
				afterLoad();
			});
		});
	});
};