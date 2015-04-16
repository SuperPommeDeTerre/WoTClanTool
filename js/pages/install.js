$(document).ready(function() {
	var gLang = $('html').attr('lang');
	moment.locale(gLang);
	i18n.init({ lng: gLang, fallbackLng: 'en', useDataAttrOptions: true }, function(t) {
		$(document).i18n();
	});
	if ($('.alert-danger').length != 0) {
		$('#btnExecuteInstall').attr('disabled', 'disabled');
	}
	$('#btnAddAdmin, #btnAddClan').on('click', function(evt) {
		evt.preventDefault();
	});
	$('[data-cluster]').on('click', function(evt) {
		$(this).toggleClass('active');
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
	mySliderInactivityThreshold.on({
		'slide': function(evt) {
			myBadgeInactivityThreshold.text(parseInt(mySliderInactivityThreshold.val()) + ' jours');
		}
	});
	$.material.init();
});