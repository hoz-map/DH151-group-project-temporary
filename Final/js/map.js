// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = '';


let geojsonPath = 'data/all_data.json'; 
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
	map = L.map('map').setView([lat,lon],zl);

	var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'

	}).addTo(map);
}

// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON('Mismanaged_plastic_waste_2010_tonnes','annual_deaths_rate_per100,000','Coverage')
	})
}

function mapGeoJSON(field){

	if (geojson_layer){
		geojson_layer.clearLayers()
	}
	
	fieldtomap = field;

	let values = [];

	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function(item,index){
		if(item.properties[field] != undefined){
			values.push(parseFloat(item.properties[field]))
		}
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(9); 
	brew.setColorCode('YlGn');
	brew.classify('quantile'); 

    // create the geojson layer
	geojson_layer = L.geoJson(geojson_data,{
        style: getStyle,
        onEachFeature: onEachFeature // actions on each feature
    }).addTo(map);

	map.fitBounds(geojson_layer.getBounds())

	createLegend();

	createInfoPanel(); 
} 

/*function sidebarItem(field){
    var plastic = document.getElementById("Mismanaged_plastic_waste_2010_tonnes");
    var water = document.getElementById("Coverage");
	var cvd = document.getElementById("annual_deaths_rate_per100,000");
}*/

function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
		fillOpacity: 0.8
	}
}

function createLegend(){
	legend.onAdd = function (map) {
        //creates the html div that holds the info for legend
		var div = L.DomUtil.create('div', 'info legend'),
        //brew info that gets put into legend
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
                    //the numbers that are actually put into the legend
					'<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
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
    //updates the infopanel
    info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);
    info_panel.update(); // resets infopanel when not highlighted, to default
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

	// method that we will use to update the control based on feature properties fed to it. 
    //whatever is highlighted, put that in the info panel.
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted:
        //but if nothing is highlighted, then panel will tell user to do something
		else
		{
			this._div.innerHTML = 'Hover over a country';
		}
	};

	info_panel.addTo(map);
}