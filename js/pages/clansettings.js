var onLoad = function() {
	checkConnected();
	setNavBrandWithClan();
	advanceProgress($.t('loading.complete'));
	var mySliderInactivityThreshold = $('#sliderInactivityThreshold'),
		myBadgeInactivityThreshold = $('#badgeInactivityThreshold');
	mySliderInactivityThreshold.noUiSlider({
		start: parseInt(gConfig.CLAN_CONFIG.inactivitythreshold),
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
		},
		'set': function(evt) {
			// Sets the inactivity threshold on server
		}
	});
	$("#btnSaveClanClanSettings").on("click", function(e) {
		e.preventDefault();
		$.post('./server/clan.php', {
				'a': 'savesettings',
				'forumurl': $('#clanForumURL').val(),
				'inactivitythreshold': parseInt(mySliderInactivityThreshold.val())
			}, function(saveResult) {
				var lResultHtml = '';
				if (saveResult.status == 'ok') {
					lResultHtml += '<div class="alert alert-success alert-dismissible" role="alert">';
					lResultHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + $.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
					lResultHtml += '<strong>' + $.t('success.title') + '</strong> ' + $.t('success.clansettingssave');
					lResultHtml += '</div>';
				} else {
					lResultHtml += '<div class="alert alert-danger alert-dismissible" role="alert">';
					lResultHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + $.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
					lResultHtml += '<strong>' + $.t('error.title') + '</strong> ' + $.t(saveResult.message);
					lResultHtml += '</div>';
				}
				$('.main h1').after(lResultHtml);
			}, 'json')
			.fail(function(jqXHR, textStatus) {
				logErr('Error while saving clan settings: ' + textStatus + '.');
			});
	});
	afterLoad();
};