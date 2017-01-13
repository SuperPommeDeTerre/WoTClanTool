var onLoad = function() {
	checkConnected();
	setNavBrandWithClan();
	afterLoad();
	$('#btnSaveSettings').on('click', function(evt) {
		var myBtnSave = $(this);
		evt.preventDefault();
		// Disabling the button whil performing async action
		myBtnSave.prop('disabled', 'disabled');
		// Remove eventual prrvious result
		$("#saveResult").remove();
		// Perform save
		$.post('./server/player.php', {
				'action': 'savesettings',
				'twitchurl': $('#myTwitchURL').val(),
				'youtubeurl': $('#myYoutubeURL').val()
			}, function(saveResult) {
				var lResultHtml = '';
				if (saveResult.result == 'ok') {
					lResultHtml += '<div class="alert alert-success alert-dismissible" role="alert" id="saveResult" style="display:none">';
					lResultHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="' + $.t('btn.close') + '"><span aria-hidden="true">&times;</span></button>';
					lResultHtml += '<strong>' + $.t('success.title') + '</strong> ' + $.t('success.playersettingssave');
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
				logErr('Error while saving personal settings: ' + textStatus + '.');
			})
			.always(function() {
				// Always enable save button.
				myBtnSave.prop('disabled', '');
			});
	});
};