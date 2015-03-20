var onLoad = function() {
	afterLoad();
	$('[placeholder]').each(function() {
		var myElem = $(this);
		myElem.attr('placeholder', i18n.t(myElem.attr('placeholder')));
	});
	var myCalendar = $('#clanCalendar').calendar({
		tmpl_path: './js/calendar-tmpls/',
		language: gLangMapping[gConfig.LANG],
		view: 'month',
		onAfterViewLoad: function(view) {
			$('#agendaTitle').text(this.getTitle());
		},
		//events_source: './server/calendar.php?a=list'
		events_source: './server/calendar.php?a=list'
	});
	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			myCalendar.navigate($this.data('calendar-nav'));
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			$this.siblings('.active').removeClass('active');
			$this.addClass('active');
			myCalendar.view($this.data('calendar-view'));
		});
	});

	$('#addEvent').on('click', function(evt) {
		evt.preventDefault();
	});

	$('.eventDateTimePicker').datetimepicker({
		locale: gConfig.LANG,
		stepping: 5,
		sideBySide: true
	});
};