// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = '';

// put this in your global variables
let geojsonPath = 'data/waste1.json';
let geojson_data;
let geojson_layer;

let brew = new classyBrew();
let fieldtomap;

let legend = L.control({position: 'bottomright'});
let info_panel = L.control();


// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	getGeoJSON();
});


// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}



// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON('Mismanaged_plastic_waste_2010_tonnes')
	})
}


function mapGeoJSON(field){

	if (geojson_layer){
			geojson_layer.clearLayers()
	}

	fieldtomap = field;

	let values = [];

	geojson_data.features.forEach(function(item,index){
			values.push(item.properties[field])
	})

	brew.setSeries(values);
	brew.setNumClasses(5);
	brew.setColorCode('YlOrRd');
	brew.classify('equal_interval'); /// 'quantiles' didn't work.
	

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data, {
		style: getStyle, //call a function to style each feature
		onEachFeature: onEachFeature
	}).addTo(map);

	// fit to bounds
	map.fitBounds(geojson_layer.getBounds())

	createLegend();
    createInfoPanel();
}

// style each feature
function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: getColor(feature.properties['Mismanaged_plastic_waste_2010_tonnes']),
		///fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
		/// map disappears: fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
		fillOpacity: 0.8
	}
}

// return the color for each feature
function getColor(d) {

	return d > 1000000 ? '#800026' :
		   d > 5000000 ? '#BD0026' :
		   d > 100000  ? '#E31A1C' :
		   d > 500000  ? '#FC4E2A' :
		   d > 10000   ? '#FD8D3C' :
		   d > 50000   ? '#FEB24C' :
		   d > 1000    ? '#FED976' :
							  '#FFEDA0';
}

function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
					'<i style="background:' + getColor(feature.properties['Mismanaged_plastic_waste_2010_tonnes'])(to) + '"></i> ' + /// use brew.getColor instead of  brew.getColorInRange(feature.properties[fieldtomap]) *line 93
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 2,
		color: '#666',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);

	info_panel.update() 
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function createInfoPanel(){

	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a country';
		}
	};

	info_panel.addTo(map);
}
