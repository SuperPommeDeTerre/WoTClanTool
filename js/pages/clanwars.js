var onLoad = function() {
	checkConnected();
	setNavBrandWithClan();
	var map = new ol.Map({
		controls: ol.control.defaults().extend([
			new ol.control.FullScreen({
				source: 'fullscreen'
			}),
			new ol.control.OverviewMap()
		]),
		layers: [
			new ol.layer.Tile({
				title: 'Global Imagery',
				source: new ol.source.TileWMS({
					url: 'http://demo.opengeo.org/geoserver/wms',
					params: {LAYERS: 'ne:NE1_HR_LC_SR_W_DR', VERSION: '1.1.1'}
				})
			}), 
			new ol.layer.Image({
				source: new ol.source.ImageVector({
					source: new ol.source.Vector({
						opacity : 0.2,
						format: new ol.format.GeoJSON()
					}),
					style: new ol.style.Style({
						fill: new ol.style.Fill({
							color: [255, 255, 255, 0.5],
						}),
						stroke: new ol.style.Stroke({
							color: '#319FD3',
							width: 1
						})
					})
				})
			})
		],
		target: 'cwMap',
		view: new ol.View({
			center: [0, 0],
			zoom: 3,
			minZoom: 3,
			maxZoom: 9
		})
	});
	map.getView().setCenter(ol.proj.transform([2.349014, 48.864716], 'EPSG:4326', 'EPSG:3857'));
	var vector = map.getLayers(),
		vectorSource = map.getLayers().a[1],
		varlayersource = vectorSource.getSource().getSource();
	if (varlayersource.getState() == 'ready') {
		//PROVINCES POSSEDEES = noir
		var features = varlayersource.getFeatures(),
			styleprovince = new ol.style.Style({
				fill: new ol.style.Fill({
					color: [0, 0,0, 0.5],
				}),
				stroke: new ol.style.Stroke({
					color: '#FFFFFF',
					width: 2
				})
			});
		// PROVINCES ATTAQUEE = vert
		var styleattaque = new ol.style.Style({
			fill: new ol.style.Fill({
				color: [0, 255,0, 0.5],
			}),
			stroke: new ol.style.Stroke({
				color: '#FFFFFF',
				width: 2
			})
		});
		// PROVINCES DEFENDUE = rouge
		var styledefense = new ol.style.Style({
			fill: new ol.style.Fill({
				color: [255, 0,0, 0.5],
			}),
			stroke: new ol.style.Stroke({
				color: '#FFFFFF',
				width: 2
			})
		});

		// IDENTIFIANT DU CLAN A METTRE ICI
		var clanid = gConfig.USER_CLAN_ID;

		// provinces possedees
		var listeprov = affichageclanproperty("clanproperty", clanid);
		var resultatajaxdecode = (listeprov);
		listeresult = JSON.parse(resultatajaxdecode);
		tranformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');

		for (index = 0; index < listeresult.length; ++index) {
			var result = listeresult[index];
			var thing = new ol.geom.Polygon( result.geom.coordinates);
			featureGeometryTf = thing.applyTransform(tranformFn);
			var featurething = new ol.Feature({
				name: result.province_id,
				geometry: thing
			});
			var monfeature = varlayersource.addFeature(featurething);
			featurething.setStyle(styleprovince);
		};
		// batailles
		var listeprov = affichageclanproperty("clanbattles", clanid);
		var resultatajaxdecode = (listeprov);
		listeresult = JSON.parse(resultatajaxdecode);
		tranformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');

		for (index = 0; index < listeresult.length; ++index) {
			var result = listeresult[index];
			var thing = new ol.geom.Polygon( result.geom.coordinates);
			featureGeometryTf = thing.applyTransform(tranformFn);

			if (result.province_owner_id == clanid) {
				var monfeature = $.grep(varlayersource.getFeatures(), function(e){ return e.getProperties().name == result.province_id; });
				monfeature[0].setStyle(styledefense);
			} 
			if (result.province_owner_id != clanid ) {
				var featurething = new ol.Feature({
					name: result.province_id,
					geometry: thing
				});

				featurething.setStyle(styleattaque);
				var monfeature = varlayersource.addFeature(featurething);
			} 
		};
		// fin
	};

	function affichageclanproperty(entree, clanid)  {
		var resultatajax = "";
		$.ajax({
			type: 'POST',
			url: './server/clanwars.php',
			data: {
				typeselection: entree,
				clanid : clanid
			},
			success: function(result) {
				resultatajax = result;
			},
			dataType: 'text',
			async:false
		});
		return resultatajax;
	};
	advanceProgress($.t('loading.complete'));
	afterLoad();
};