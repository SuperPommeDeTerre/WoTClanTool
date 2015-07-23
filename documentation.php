<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "documentation",
	"authenticated" => false,
	"role" => array(),
	"blocks" => array (
		"ads" => true,
		"nav" => true,
		"footer" => true
	)
);

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
<div class="container-fluid">
	<div class="row">
		<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
			<h1 class="page-header" data-i18n="page.documentation.title"></h1>
			<div class="navbar navbar-material-grey">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
				</div>
				<div class="navbar-collapse collapse navbar-responsive-collapse">
					<ul class="nav navbar-nav">
						<li role="presentation" class="active"><a href="#presentation" role="tab" aria-controls="presentation" data-toggle="tab">Présentation</a></li>
						<li role="presentation"><a href="#features" role="tab" aria-controls="features" data-toggle="tab">Fonctionnalités</a></li>
						<li role="presentation"><a href="#howto" role="tab" aria-controls="howto" data-toggle="tab">Comment faire pour...</a></li>
						<li role="presentation"><a href="#faq" role="tab" aria-controls="faq" data-toggle="tab">FAQ</a></li>
					</ul>
				</div>
			</div>
			<div class="tab-content">
				<div role="tabpanel" class="tab-pane active" id="presentation">
					<h2>Présentation</h2>
				</div>
				<div role="tabpanel" class="tab-pane" id="features">
					<h2>Fonctionnalités</h2>
				</div>
				<div role="tabpanel" class="tab-pane" id="howto">
					<h2>Comment faire pour...</h2>
				</div>
				<div role="tabpanel" class="tab-pane" id="faq">
					<h2>FAQ</h2>
					<div class="panel-group" id="accordionFAQ" role="tablist" aria-multiselectable="true">
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>