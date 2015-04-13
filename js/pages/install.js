$(document).ready(function() {
	var gLang = $('html').attr('lang');
	moment.locale(gLang);
	i18n.init({ lng: gLang, fallbackLng: 'en', useDataAttrOptions: true }, function(t) {
		$(document).i18n();
	});
	if ($('.alert-danger').length != 0) {
		$('#btnExecuteInstall').attr('disabled', 'disabled');
	}
	$.material.init();
});