<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "personalmissions",
	"authenticated" => true,
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
			<h1 class="page-header" data-i18n="page.personalmissions.title"></h1>
			<!--
			<div class="panel panel-default">
				<div class="panel-heading">
					<h2 class="panel-title">Les renforts tant attendus</h2>
					<p>Chaque campagne comprend plusieurs opérations pouvant contenir de nombreuses missions pour tout type de véhicule. Vous recevrez un véhicule unique pour l'accomplissement de chaque opération.</p>
				</div>
				<div class="panel-body">
					<div class="container-fluid">
						<div class="row">
							<div class="col-xs-12 col-sm-6 col-md-3">
								<a href="#" class="thumbnail">
									<img src="http://api.worldoftanks.eu/static/2.26.0/wot/encyclopedia/quests/tiles/tile_1_1_color_over.png" alt="StuG IV" class="img-responsive img-rounded" />
									<div class="caption">
										<h3>StuG IV <span class="label label-default">15</span> <span class="label label-success">10</span> <span class="label label-primary">3</span> <span class="label label-warning">2</span></h3>
										<p>Un ensemble de missions pour tous les types de véhicules pour recevoir le chasseur de chars américain T28 Heavy Tank Concept.</p>
									</div>
								</a>
							</div>
							<div class="col-xs-12 col-sm-6 col-md-3">
								<img src="http://api.worldoftanks.eu/static/2.26.0/wot/encyclopedia/quests/tiles/tile_1_2_color_over.png" alt="..." />
								<div class="carousel-caption">
									<h3>T28 heavy tank concept</h3>
								</div>
							</div>
							<div class="col-xs-12 col-sm-6 col-md-3">
								<img src="http://api.worldoftanks.eu/static/2.26.0/wot/encyclopedia/quests/tiles/tile_1_3_color_over.png" alt="..." />
								<div class="carousel-caption">
									<h3>T-55A</h3>
								</div>
							</div>
							<div class="col-xs-12 col-sm-6 col-md-3">
								<img src="http://api.worldoftanks.eu/static/2.26.0/wot/encyclopedia/quests/tiles/tile_1_4_color_over.png" alt="..." />
								<div class="carousel-caption">
									<h3>Object 260</h3>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			-->
		</div>
	</div>
</div>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>