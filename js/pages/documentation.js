var onLoad = function() {
	afterLoad();
	var listFAQ = $.t("FAQ", { returnObjectTrees: true }),
		faqHTML = '';
	for (var indexFaq in listFAQ) {
		faqHTML += '<div class="panel panel-default">';
		faqHTML += '<div class="panel-heading" role="tab" id="headingFAQ' + indexFaq + '">';
		faqHTML += '<h4 class="panel-title">';
		faqHTML += '<a role="button" data-toggle="collapse" data-parent="#accordionFAQ" href="#collapseFAQ' + indexFaq + '" aria-expanded="false" aria-controls="collapseFAQ' + indexFaq + '">';
		faqHTML += listFAQ[indexFaq].question;
		faqHTML += '</a>';
		faqHTML += '</h4>';
		faqHTML += '</div>';
		faqHTML += '<div id="collapseFAQ' + indexFaq + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFAQ' + indexFaq + '">';
		faqHTML += '<div class="panel-body">';
		faqHTML += listFAQ[indexFaq].answer;
		faqHTML += '</div>';
		faqHTML += '</div>';
		faqHTML += '</div>';
	}
	$('#accordionFAQ').html(faqHTML).collapse();
};