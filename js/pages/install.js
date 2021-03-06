$(document).ready(function() {
	var gLang = $('html').attr('lang');
	moment.locale(gLang);
	$.get('./locales/' + gLang + '/translation.json', function(dataLng) {
		var myLngRessources = {};
		myLngRessources[gLang] = { 'translation': dataLng };
		i18next.init({ lng: gLang, resources: myLngRessources }, function(t) {
			i18nextJquery.init(i18next, $, {
				tName: 't', // --> appends $.t = i18next.t
				i18nName: 'i18n', // --> appends $.i18n = i18next
				handleName: 'localize', // --> appends $(selector).localize(opts);
				selectorAttr: 'data-i18n', // selector for translating elements
				targetAttr: 'i18n-target', // element attribute to grab target element to translate (if different then itself)
				optionsAttr: 'i18n-options', // element attribute that contains options, will load/set if useOptionsAttr = true
				useOptionsAttr: true, // see optionsAttr
				parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
			});
			$(document).localize();
			$.material.init();
		});
	}, 'json');
	if ($('.alert-danger').length != 0) {
		$('#btnExecuteInstall').attr('disabled', 'disabled');
	}
	$('#btnAddAdmin, #btnAddClan').on('click', function(evt) {
		evt.preventDefault();
	});
	$('#btnClusters [data-cluster]').on('click', function(evt) {
		evt.preventDefault();
		var myClusterButton = $(this),
			myClusterSelect = $('.selCluster'),
			myOption = myClusterSelect.find('option[value=' + myClusterButton.data('cluster') + ']');
		myClusterButton.toggleClass('active');
		if (myClusterButton.parent().find('.active').length == 1) {
			myClusterSelect.hide().find('select').val(myClusterButton.data('cluster'));
		} else {
			myClusterSelect.show();
			if (myClusterButton.hasClass('active')) {
				myOption.removeAttr('hidden').removeProp('disabled');
			} else {
				myOption.attr('hidden', 'hidden').prop('disabled', true);
			}
		}
	});
	// Handle search of clan
	$('#txtSearchClan').on('keyup', function(evt) {
		if ($(this).val().length > 2) {
			$('#btnSearchClan').removeAttr('disabled');
		} else {
			$('#btnSearchClan').attr('disabled', 'disabled');
		}
	}).keyup();
	$('#btnSearchClan').on('click', function(evt) {
		evt.preventDefault();
		var lSelectedCluster = $('#dlgSearchClan .selCluster select').val(),
			lAPIKey = gConfig.clusters[lSelectedCluster].key,
			lAPIUrl = gConfig.clusters[lSelectedCluster].url;
		$.post(lAPIUrl + 'wgn/clans/list/', {
			'application_id': lAPIKey,
			'language': gLang,
			'search': $('#txtSearchClan').val(),
			'order_by': 'tag',
			'limit': 10
		}, function(dataSearchClanResponse) {
			var dataSearchClan = dataSearchClanResponse.data,
				resultHtml = '',
				i = 0,
				myClan = {};
			if (dataSearchClan.length == 0) {
				resultHtml = '';
			} else {
				for (i=0; i<dataSearchClan.length; i++) {
					myClan = dataSearchClan[i];
					resultHtml += '<li data-id=\"' + myClan.clan_id + '\" data-cluster="' + lSelectedCluster + '"><img src=\"' + myClan.emblems.x24.portal + '\" /><span style=\"color:' + myClan.color + '\">[' + myClan.tag + ']</span> <small>' + myClan.name + '</small></li>';
				}
			}
			$('#searchClanResult').html(resultHtml);
		}, 'json');
	});
	$('#searchClanResult').on('click', 'li', function(evt) {
		var myItem = $(this),
			resultHtml = '';
		if ($('#restrictedClans').find('[data-cluster=' + myItem.data('cluster') + '][data-id=' + myItem.data('id') + ']').length == 0) {
			resultHtml += '<div class="alert alert-material-grey alert-dismissible clan cluster' + myItem.data('cluster') + '" role="alert" data-id="' + myItem.data('id') + '" data-cluster="' + myItem.data('cluster') + '">';
			resultHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + $.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
			resultHtml += '<p>' + myItem.html() + '</p>';
			resultHtml += '</div>';
			$('#restrictedClans').append(resultHtml);
		}
	});
	// Handle remove of clan
	$('.clan').on('close.bs.alert', function(evt) {
	});
	// Handle search of player
	$('#txtSearchPlayer').on('keyup', function(evt) {
		if ($(this).val().length > 2) {
			$('#btnSearchPlayer').removeAttr('disabled');
		} else {
			$('#btnSearchPlayer').attr('disabled', 'disabled');
		}
	}).keyup();
	$('#btnSearchPlayer').on('click', function(evt) {
		evt.preventDefault();
		var lSelectedCluster = $('#dlgSearchPlayer .selCluster select').val(),
			lAPIKey = gConfig.clusters[lSelectedCluster].key,
			lAPIUrl = gConfig.clusters[lSelectedCluster].url;
		$.post(lAPIUrl + 'wot/account/list/', {
			'application_id': lAPIKey,
			'language': gLang,
			'type': 'startswith',
			'search': $('#txtSearchPlayer').val(),
			'limit': 10
		}, function(dataSearchPlayerResponse) {
			var dataSearchPlayer = dataSearchPlayerResponse.data,
				resultHtml = '',
				i = 0,
				myPlayer = {};
			if (dataSearchPlayer.length == 0) {
				resultHtml = '';
			} else {
				for (i=0; i<dataSearchPlayer.length; i++) {
					myPlayer = dataSearchPlayer[i];
					resultHtml += '<li data-id=\"' + myPlayer.account_id + '\" data-cluster="' + lSelectedCluster + '">' + myPlayer.nickname + '</li>';
				}
			}
			$('#searchPlayerResult').html(resultHtml);
		}, 'json');
	});
	$('#searchPlayerResult').on('click', 'li', function(evt) {
		var myItem = $(this),
			resultHtml = '';
		if ($('#listAdmins').find('[data-cluster=' + myItem.data('cluster') + '][data-id=' + myItem.data('id') + ']').length == 0) {
			resultHtml += '<div class="alert alert-material-grey alert-dismissible player cluster' + myItem.data('cluster') + '" role="alert" data-id="' + myItem.data('id') + '" data-cluster="' + myItem.data('cluster') + '">';
			resultHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + $.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
			resultHtml += '<p>' + myItem.html() + '</p>';
			resultHtml += '</div>';
			$('#listAdmins').append(resultHtml);
		}
	});
	// Handle remove of admin
	$('.player').on('close.bs.alert', function(evt) {
	});
	var mySliderInactivityThreshold = $('#sliderInactivityThreshold'),
		myBadgeInactivityThreshold = $('#badgeInactivityThreshold');
	mySliderInactivityThreshold.noUiSlider({
		start: 14,
		step: 1,
		range: {
			min: 0,
			max: 60
		}
	});
	// Update inactivity threshold value on slide
	mySliderInactivityThreshold.on({
		'slide': function(evt) {
			myBadgeInactivityThreshold.text($.t('install.inactivitythreshold.value', { count: parseInt(mySliderInactivityThreshold.val()) }));
		}
	});
	$('#btnExecuteInstall').on('click', function(evt) {
		evt.preventDefault();
		$('#frmInstall').submit();
	});
	$('#frmInstall').on('submit', function(evt) {
		var lClustersSelected = [],
			lClustersButtons = $('#btnClusters [data-cluster].active'),
			lPostParams = {},
			lClans = [],
			lPlayers = [];
		if (lClustersButtons.length != 0) {
			lClustersButtons.each(function(index, el) {
				lClustersSelected.push($(el).data('cluster'));
			});
		} else {
			$('#btnClusters [data-cluster]').each(function(index, el) {
				lClustersSelected.push($(el).data('cluster'));
			});
		}
		lPostParams['clusters'] = lClustersSelected;
		lPostParams['showads'] = $('#showads').is(':checked');
		// Handle clans and players by cluster
		for (clusterIndex in lClustersSelected) {
			var clusterId = lClustersSelected[clusterIndex];
			lClans = [];
			lPlayers = [];
			$('#listAdmins').find('[data-cluster=' + clusterId + ']').each(function(index, element) {
				lPlayers.push($(this).data('id'));
			});
			$('#restrictedClans').find('[data-cluster=' + clusterId + ']').each(function(index, element) {
				lClans.push($(this).data('id'));
			});
			lPostParams['clans' + clusterId] = lClans;
			lPostParams['admins' + clusterId] = lPlayers;
		}
		lPostParams['inactivitythreshold'] = parseInt(mySliderInactivityThreshold.val());
		$.post('./install.php', lPostParams, function(saveConfigResponse) {
			if (saveConfigResponse.status == 'ok') {
				document.location = './';
			}
		}, 'json');
		evt.preventDefault();
	});
});