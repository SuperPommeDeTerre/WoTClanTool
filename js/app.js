// Define some global variables
var gTANKS_LEVEL = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X' ],
	gTANKS_TYPES =  { 'lightTank': 1, 'mediumTank': 2, 'heavyTank': 3, 'AT-SPG': 4, 'SPG': 5 },
	gROLE_POSITION = { 'commander': 1, 'executive_officer': 2, 'personnel_officer': 3, 'combat_officer': 4, 'intelligence_officer': 5, 'quartermaster': 6, 'recruitment_officer': 7, 'junior_officer': 8, 'private': 9, 'recruit': 10, 'reservist': 11 },
	gLangMapping = {
		'cs': 'cs-CZ',
		'de': 'de-DE',
		'en': 'en-US',
		'es': 'es-ES',
		'fr': 'fr-FR',
		'ko': 'ko-KR',
		'pl': 'pl-PL',
		'ru': 'ru-RU',
		'tr': 'tr-TR',
		'zh': 'zh-CN'
	},
	gWN8_SCALE = {
		'very-bad':			{ min: 0,		max: 300,	color: '#000000',	cssclass: 'material-black' },
		'bad': 				{ min: 300,		max: 600,	color: '#cd3333',	cssclass: 'material-red-900' },
		'below-average':	{ min: 600,		max: 900,	color: '#d77900',	cssclass: 'material-orange-900' },
		'average':			{ min: 900,		max: 1250,	color: '#d7b600',	cssclass: 'material-yellow-500' },
		'good':				{ min: 1250,	max: 1600,	color: '#6d9521',	cssclass: 'material-green-500' },
		'very-good':		{ min: 1600,	max: 1900,	color: '#4c762e',	cssclass: 'material-green-900' },
		'great':			{ min: 1900,	max: 2350,	color: '#4a92b7',	cssclass: 'material-blue-500' },
		'unicum':			{ min: 2350,	max: 2900,	color: '#83579d',	cssclass: 'material-purple-300' },
		'super-unicum':		{ min: 2900,	max: -1,	color: '#5a3175',	cssclass: 'material-purple-800' }
	},
	gPersonalInfos = null,
	gClanInfos = null,
	gProgressBar,
	gProgressMessage,
	gDataPlayers = null,
	gCalendar = null,
	gDataClan = null,
	gTankopedia = null,
	progressNbSteps = 0,
	progressCurStep = 0,
	gHashDest = '';

var advanceProgress = function(pMessage) {
	var progressToSet = (++progressCurStep * (100 / progressNbSteps));
	gProgressMessage.text(pMessage);
	gProgressBar.attr('aria-valuenow', progressToSet)
		.css('width', progressToSet + '%')
		.text(progressToSet + ' %');
};

var getWN8Class = function(pWN8Rating) {
	var returnVal = '',
		lRatingLevel = '';
	for (lRatingLevel in gWN8_SCALE) {
		var lClassObj = gWN8_SCALE[lRatingLevel];
		// Handle last case
		if (lClassObj.max < 0 && pWN8Rating >= lClassObj.min) {
			returnVal = lClassObj.cssclass;
			break;
		} else if (pWN8Rating >= lClassObj.min && pWN8Rating < lClassObj.max) {
			returnVal = lClassObj.cssclass;
			break;
		}
	}
	return returnVal;
};

var getWN8Color = function(pWN8Rating) {
	var returnVal = '#666',
		lRatingLevel = '';
	for (lRatingLevel in gWN8_SCALE) {
		var lClassObj = gWN8_SCALE[lRatingLevel];
		// Handle last case
		if (lClassObj.max < 0 && pWN8Rating >= lClassObj.min) {
			returnVal = lClassObj.color;
			break;
		} else if (pWN8Rating >= lClassObj.min && pWN8Rating < lClassObj.max) {
			returnVal = lClassObj.color;
			break;
		}
	}
	return returnVal;
};

var checkConnected = function() {
	var isUserValid = false;
	if (typeof(gConfig.PLAYER_ID) == 'undefined') {
		// User is not connected, redirect to home
		document.location = './?returnUrl=' + encodeURI(document.location.href);
	} else {
		isUserValid = false;
		// If no restrictions set, then user is valid
		if (gConfig.CLAN_IDS.length == 0) {
			isUserValid = true;
		} else {
			for (var i=0; i<gConfig.CLAN_IDS.length; i++) {
				if (gPersonalInfos.clan_id == gConfig.CLAN_IDS[i]) {
					isUserValid = true;
					break;
				}
			}
		}
		if (!isUserValid) {
			document.location = './unauthorized';
		}
	}
};

var setUserRole = function() {
	if (gConfig.USER_ROLE == '') {
		for (var i=0; i<gClanInfos.members.length; i++) {
			if (gClanInfos.members[i].account_id == gConfig.PLAYER_ID) {
				gConfig.USER_ROLE = gClanInfos.members[i].role;
				$.post('./server/player.php', {
					'action': 'setrole',
					'role': gClanInfos.members[i].role
				}, function(dataSetUserInfos) {
				}, 'json');
				break;
			}
		}
	}
};

var setNavBrandWithClan = function(pCallbackFunction) {
	if (gClanInfos != null) {
		$('#mainNavBar .navbar-brand').html('<span style="color:' + gClanInfos.color + '">[' + gClanInfos.tag + ']</span> ' + gClanInfos.name + ' <small>' + gClanInfos.motto + '</small>')
			// Set clan emblem with CSS because it causes problems with inline HTML.
			.css('background', 'url(\'' + gClanInfos.emblems.x32.portal + '\') no-repeat 15px center')
			// Add padding to avoid overlap of emblem and text
			.css('padding-left', '51px');
		setUserRole();
		if (pCallbackFunction && (typeof(pCallbackFunction) == "function")) {
			pCallbackFunction();
		}
	} else {
		$.post(gConfig.WG_API_URL + 'wgn/clans/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.LANG,
			access_token: gConfig.ACCESS_TOKEN,
			clan_id: gPersonalInfos.clan_id
		}, function(dataClanResponse) {
			var dataClan = dataClanResponse.data[gPersonalInfos.clan_id],
				clanEmblem = dataClan.emblems.x32.portal;
			gClanInfos = dataClan;
			$('#mainNavBar .navbar-brand').html('<span style="color:' + gClanInfos.color + '">[' + gClanInfos.tag + ']</span> ' + gClanInfos.name + ' <small>' + gClanInfos.motto + '</small>')
				// Set clan emblem with CSS because it causes problems with inline HTML.
				.css('background', 'url(\'' + gClanInfos.emblems.x32.portal + '\') no-repeat 15px center')
				// Add padding to avoid overlap of emblem and text
				.css('padding-left', '51px');
			setUserRole();
			if (pCallbackFunction && (typeof(pCallbackFunction) == "function")) {
				pCallbackFunction();
			}
		}, 'json');
	}
};

// Wait for the DOM to finish its initialization before appending data to it.
$(document).ready(function() {
	gHashDest = location.hash;
	if (gHashDest != '') {
		window.scrollTo(0, 0);
	}
	gProgressBar = $('#progressBar');
	gProgressMessage = $('#progressInfoMessage');
	moment.locale(gConfig.LANG);
	$.get('./locales/' + gConfig.LANG + '/translation.json', function(dataLng) {
		var myLngRessources = {};
		myLngRessources[gConfig.LANG] = { 'translation': dataLng };
		i18next.init({
				lng: gConfig.LANG,
				resources: myLngRessources }, function(err, t) {
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
			if (gConfig.SHOW_ADS) {
				$.ajax({
					url: './js/advertisement.js', // this is just an empty js file
					dataType: "script"
				})
				.fail(function () {
					$('#myContainerForAds').prepend('<div class="alert alert-info" role="alert">' + $.t('share.adblock') + '</div>');
				});
			}
			$(document).localize();
			if (typeof(window.update_cookieconsent_options) == 'function') {
				window.update_cookieconsent_options({
					"message": $.t('cookieconsent.message'),
					"dismiss": $.t('cookieconsent.dismiss'),
					"learnMore": $.t('cookieconsent.learnmore'),
					"link": null,
					"theme": "dark-bottom"
				});
			}
			$('li.paypal a').on('click', function(evt) {
				evt.preventDefault();
				$(this).siblings('form').submit();
			});
			if (typeof(gConfig.PLAYER_ID) != 'undefined') {
				// Verify that user is member of one of the handled clans...
				$.post(gConfig.WG_API_URL + 'wot/account/info/', {
					application_id: gConfig.WG_APP_ID,
					language: gConfig.LANG,
					access_token: gConfig.ACCESS_TOKEN,
					extra: 'private.personal_missions',
					account_id: gConfig.PLAYER_ID
				}, function(dataPlayersResponse) {
					if (dataPlayersResponse.status == 'error') {
						document.location = 'logout';
						return;
					}
					var me = dataPlayersResponse.data[gConfig.PLAYER_ID],
						isClanFound = (gConfig.USER_CLAN_ID != '');
					if (!isClanFound) {
						$.post('./server/player.php', {
							'action': 'setclanid',
							'clan_id': me.clan_id
						}, function(dataSetUserInfos) {
						}, 'json');
					}
					if (me.clan_id != null) {
						if (gConfig.CLAN_IDS.length == 0) {
							isClanFound = true;
							gPersonalInfos = me;
							onLoad();
						} else {
							for (var i=0; i<gConfig.CLAN_IDS.length; i++) {
								if (me.clan_id == gConfig.CLAN_IDS[i]) {
									isClanFound = true;
									gPersonalInfos = me;
									onLoad();
									break;
								}
							}
						}
					}
					if (!isClanFound) {
						// Clan is not found. Redirect to unauthorized
						window.location = 'unauthorized';
					}
				}, 'json');
			} else {
				onLoad();
			}
			$('#linkLogout').on('click', function(evt) {
				evt.preventDefault();
				$.post(gConfig.WG_API_URL + 'wot/auth/logout/', {
					application_id: gConfig.WG_APP_ID,
					access_token: gConfig.ACCESS_TOKEN
				}, function(data) {
					document.location = './logout';
				}, 'json');
			});
		});
	}, 'json');
	$('#btnShowLogs').on('click', function(e) {
		e.preventDefault();
	});
});

// Log handling
var gLogLevels = {
	'ERR': 0,
	'WARN': 1,
	'INFO': 2,
	'VERB': 3,
	'DBG': 4
};
var gSelectedLogLevel = gLogLevels.DBG;

var log = function(pMsg, pLevel) {
	if (gSelectedLogLevel >= pLevel) {
		var myContainer = $('#logsContent'),
			lLevel = gLogLevels.INFO,
			lLogMsgContent = $('<li><samp></samp></li>');
		if (typeof(pLevel) != 'undefined' && pLevel != null) {
			lLevel = pLevel;
		}
		switch (lLevel) {
			case gLogLevels.ERR:
				lLogMsgContent.addClass('text-danger');
				break;
			case gLogLevels.WARN:
				lLogMsgContent.addClass('text-warning');
				break;
			case gLogLevels.INFO:
				lLogMsgContent.addClass('text-info');
				break;
			case gLogLevels.VERB:
				lLogMsgContent.addClass('text-primary');
				break;
			case gLogLevels.DBG:
				lLogMsgContent.addClass('text-muted');
				break;
		}
		lLogMsgContent.children().text(moment().format() + ': ' + pMsg);
		myContainer.append(lLogMsgContent);
	}
};
var logDebug = function(pMsg) { log(pMsg, gLogLevels.DBG); };
var logVerb = function(pMsg) { log(pMsg, gLogLevels.VERB); };
var logInfo = function(pMsg) { log(pMsg, gLogLevels.INFO); };
var logWarn = function(pMsg) { log(pMsg, gLogLevels.WARN); };
var logErr = function(pMsg) { log(pMsg, gLogLevels.ERR); };
var isDebugEnabled = function() { return gSelectedLogLevel >= gLogLevels.DBG; };
var isVerbEnabled = function() { return gSelectedLogLevel >= gLogLevels.VERB; };
var isInfoEnabled = function() { return gSelectedLogLevel >= gLogLevels.INFO; };
var isWarnEnabled = function() { return gSelectedLogLevel >= gLogLevels.WARN; };
var gLogClipBoard = null;

var afterLoad = function() {
	$('#progressDialog').fadeOut('fast');
	$('#btnShowLogs').detach().removeAttr('id').insertAfter('#footer h3 .badge');
	$('.header-fixed').stickyTableHeaders({fixedOffset: $('#mainNavBar')});
	$('[data-toggle="tooltip"]').tooltip();
	$.material.init();
	if (gHashDest != '') {
		location.hash = gHashDest;
	}
	if (isInfoEnabled) {
		logInfo('Finish !');
	}
	gLogClipBoard = new ZeroClipboard($('#copyLogButton'));
	/*
	gLogClipBoard.on('copy', function(copyEvent) {
		var clipboard = copyEvent.clipboardData,
			logMsgs = '';
		$('#logsContent li').each(function(i) {
			logMsgs += $(this).text() + '\n';
		});
		clipboard.setText(logMsgs);
		clipboard.setHtml($('#logsContent').html());
	});
	*/
};
