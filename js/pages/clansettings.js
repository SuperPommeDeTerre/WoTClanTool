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
	// Performs checks on right change
	$('.rightselect').on('change', function(pEvt) {
	});
	$("#btnSaveClanClanSettings").on("click", function(e) {
		e.preventDefault();
		$("#saveResult").remove();
		// Build rights matrix
		var selectedRights = {};
		$(".rightselect").each(function(pIndex, pElement) {
			var myCheckbox = $(this),
				rCategory = myCheckbox.data("category"),
				rRightName = myCheckbox.data("rightname"),
				rRole = myCheckbox.data("role");
			if (this.checked) {
				if (typeof(selectedRights[rCategory]) == 'undefined') {
					selectedRights[rCategory] = {};
				}
				if (typeof(selectedRights[rCategory][rRightName]) == 'undefined') {
					selectedRights[rCategory][rRightName] = [];
				}
				selectedRights[rCategory][rRightName].push(rRole);
			}
		});
		// Perform save
		$.post('./server/clan.php', {
				'a': 'savesettings',
				'forumurl': $('#clanForumURL').val(),
				'youtubeurl': $('#clanYoutubeURL').val(),
				'rights': JSON.stringify(selectedRights),
				'inactivitythreshold': parseInt(mySliderInactivityThreshold.val())
			}, function(saveResult) {
				var lResultHtml = '';
				if (saveResult.status == 'ok') {
					lResultHtml += '<div class="alert alert-success alert-dismissible" role="alert" id="saveResult" style="display:none">';
					lResultHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + $.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
					lResultHtml += '<strong>' + $.t('success.title') + '</strong> ' + $.t('success.clansettingssave');
					lResultHtml += '</div>';
				} else {
					lResultHtml += '<div class="alert alert-danger alert-dismissible" role="alert" id="saveResult" style="display:none">';
					lResultHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + $.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
					lResultHtml += '<strong>' + $.t('error.title') + '</strong> ' + $.t(saveResult.message);
					lResultHtml += '</div>';
				}
				$('.main h1').after(lResultHtml);
				$('#saveResult').fadeIn('fast');
			}, 'json')
			.fail(function(jqXHR, textStatus) {
				logErr('Error while saving clan settings: ' + textStatus + '.');
			});
	});
	afterLoad();
};