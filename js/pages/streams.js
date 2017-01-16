var onLoad = function() {
	checkConnected();
	progressNbSteps = 2;
	$(document).on('click', 'a.twitchstream', function(evt) {
		evt.preventDefault();
		if ($(this).hasClass('online')) {
			var player = new Twitch.Player('twitchPlayerContainer', {
				channel: $(this).data('channelname')
			});
			player.play();
		}
		$('#twitchPlayerContainer').parent().removeClass('hidden');
	});
	advanceProgress($.t('loading.claninfos'));
	$.post(gConfig.WG_API_URL + 'wgn/clans/info/', {
		application_id: gConfig.WG_APP_ID,
		language: gConfig.LANG,
		access_token: gConfig.ACCESS_TOKEN,
		clan_id: gPersonalInfos.clan_id
	}, function(dataClanResponse) {
		if (isDebugEnabled()) {
			logDebug('dataClanResponse=' + JSON.stringify(dataClanResponse, null, 4));
		}
		gClanInfos = dataClanResponse.data[gPersonalInfos.clan_id];
		setNavBrandWithClan();
		var membersList = '',
			isFirst = true,
			i = 0,
			tempContentHtml = '';
		for (i in gClanInfos.members) {
			if (isFirst) {
				isFirst = false;
			} else {
				membersList += ',';
			}
			membersList += gClanInfos.members[i].account_id;
		}
		// Get configured channels
		$.post('./server/player.php', {
			'action': 'getstreams',
			'account_id': membersList
		}, function(configuredChannelInfos) {
			advanceProgress($.t('loading.complete'));
			// Extract channel ids from response
			var twitchChannelIds = [],
				i = 0;
			for (i in configuredChannelInfos.streams.twitch) {
				var myTwitchChannelInfos = configuredChannelInfos.streams.twitch[i],
					myTwitchURLParts = myTwitchChannelInfos.url.split('/'),
					myTwitchChannelName = myTwitchURLParts[myTwitchURLParts.length - 1];
				if (myTwitchChannelName != '') {
					twitchChannelIds.push(myTwitchChannelName);
					myTwitchChannelInfos.channelname = myTwitchChannelName;
				}
			}
			// Retrieve status of channels
			$.ajax({
				type: 'GET',
				beforeSend: function(request) {
					request.setRequestHeader('Client-ID', gConfig.TWITCH_API_KEY);
				},
				url: 'https://api.twitch.tv/kraken/streams/',
				data: {
					'channel': twitchChannelIds.join(','),
					'limit': 100
				},
				success: function(streamsInfo) {
					var i = 0,
						j = 0,
						onlineStreamInfos = null,
						myTwitchHtml = '<div class="row">';
					myTwitchHtml += '<div class="col-xs-4 col-md-2">';
					for (i in configuredChannelInfos.streams.twitch) {
						myTwitchHtml += '<div class="thumbnail">';
						onlineStreamInfos = null;
						for (j in streamsInfo.streams) {
							if (streamsInfo.streams[j].channel.name == configuredChannelInfos.streams.twitch[i].channelname) {
								onlineStreamInfos = streamsInfo.streams[j];
								break;
							}
						}
						if (onlineStreamInfos != null) {
							myTwitchHtml += '<a href="' + configuredChannelInfos.streams.twitch[i].url + '" class="thumbnail twitchstream online" data-channelname="' + configuredChannelInfos.streams.twitch[i].channelname + '"><img src="' + onlineStreamInfos.preview.medium + '" alt="Online" /></a>';
						} else {
							myTwitchHtml += '<a href="' + configuredChannelInfos.streams.twitch[i].url + '" class="thumbnail twitchstream offline" data-channelname="' + configuredChannelInfos.streams.twitch[i].channelname + '"><img src="" alt="Offline" style="height:180px;width:180px" /></a>';
						}
						myTwitchHtml += '<div class="caption">';
						myTwitchHtml += '<p>' + getClanMember(configuredChannelInfos.streams.twitch[i].user).account_name + '</p>';
						myTwitchHtml += '</div></div>';
					}
					myTwitchHtml += '</div></div>';
					$('.main h2.twitch').after(myTwitchHtml);
					afterLoad();
				}
			});
		}, 'json')
		.fail(function(jqXHR, textStatus) {
			logErr('Error while loading [./server/player.php]: ' + textStatus + '.');
		});
	}, 'json')
	.fail(function(jqXHR, textStatus) {
		logErr('Error while loading [' + gConfig.WG_API_URL + 'wgn/clans/info/]: ' + textStatus + '.');
	});
};