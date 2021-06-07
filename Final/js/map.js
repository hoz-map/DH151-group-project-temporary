// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 2;

let path = "data/usa-world-plastic-20161718.csv";

let importmarkers2016 = L.featureGroup();
let importmarkers2017 = L.featureGroup();
let importmarkers2018 = L.featureGroup();

var latlongs2016 = [];
var latlongs2017 = [];
var latlongs2018 = [];

var layersarray = ["importmarkers2016", "importmarkers2017", "importmarkers2018"];

let geojsonPath = 'data/world.json'; //where the geojson file is located
let geojson_data; //placeholder for data
let geojson_layer; //placeholder for layer of geojson


// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
    getGeoJSON();
});

// create an empty map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

    var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);
}

// read data w PapaParse
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			//console.log(data);
			// map the data
			mapCSV(data);
            // make a table with the data
            createTable(data);
		}
	});
}


console.log("🌿 Hello, thanks for taking a look at our project! We hope you learned something today! 🌿");


/*–––––––––TABLE–––––––––*/
function createTable(data){
	// empty array for data
	let datafortable = [];
	// loop through the data and add the properties object to the array
	data.data.forEach(function(item,index){
        if (item["Trade Flow"] === "Export" || item ["Trade Flow"] === "Re-Export"){
		    datafortable.push(item)
        }
	})
	//console.log(datafortable);

	// array to define the fields: each object is a column
	let fields = [
		{ name: "Year", type: "number"},
		{ name: 'Partner', type: "text"},
		{ name: 'Netweight (kg)', type: 'number'},
	]

    let w = $(window).width()-100;

	// create the table in our footer
	$(".tablefooter").jsGrid({
		width: w,
		height: "400px",

        editing: true,
		sorting: true,
		paging: true,
		autoload: true,
 
		pageSize: 10,
		pageButtonCount: 5,
 
		data: datafortable,
		fields: fields,
		rowClick: function(args) { 
			//console.log(args.item.importLat);
            zoomTo(args.item.importLat, args.item.importLong);
		},
	});
}

//makes rows clickable
function zoomTo(argsLat, argsLong){
    map.setView([argsLat, argsLong], 3.5);
}


/*–––––––––CIRCLES–––––––––*/
//design for circles of points of import
let circleOptionsImport = {
    radius: 15,
    weight: 0.5,
    color: "",
    fillColor: null,
    fillOpacity: 0.1,
}

//function to map all countries that US exported plastic to for a given year
function mapImportingCountries(setcolor, datayear, year, dataweight, latitude, longitude, reporter, flow, partner, latlongsyear, arrayyear){
    if (datayear === year){
        circleOptionsImport.color = setcolor
        circleOptionsImport.radius = dataweight * 0.0000001
        let importedMarker = L.circleMarker([latitude, longitude], circleOptionsImport)
        .on('mouseover',
            function(index){
                this.bindPopup(`${reporter + " " + flow + "ed " + dataweight + " kg of plastic waste to " + partner + " in " + datayear}`).openPopup();
        })
        let templatlong = [latitude, longitude];
        latlongsyear.push(templatlong);
        //adds all markers of countries that US exported plastic to in 2016
        arrayyear.addLayer(importedMarker);
    }
};


/*–––––––––ANTLINES–––––––––*/
//design for AntLines
let antlineoptions={
    color : '', 
    weight: 2,
    opacity:0.5,
    delay: 700,
};

//function to make AntLines to all countries that US exported plastic to for a given year and add to layer
function makeAntLines(latlongsyear,arrayyear, setcolor){
    for(i=0; i<latlongsyear.length; i++){
        antlineoptions.color = setcolor;
        antPolyline = L.polyline.antPath([[37.09024, -95.712891], [latlongsyear[i][0], latlongsyear[i][1]]], antlineoptions);
        arrayyear.addLayer(antPolyline);
    }
}

function mapCSV(data){
    //mapping each layer by year and adding to map
    data.data.forEach(function(item,index){
        if (item["Trade Flow"] === "Export" || item ["Trade Flow"] === "Re-Export"){
            mapImportingCountries("green", item.Year, "2016", item["Netweight (kg)"], item.importLat, item.importLong, item.Reporter, item["Trade Flow"], item.Partner, latlongs2016, importmarkers2016);

            mapImportingCountries("red", item.Year, "2017", item["Netweight (kg)"], item.importLat, item.importLong, item.Reporter, item["Trade Flow"], item.Partner, latlongs2017, importmarkers2017);

            mapImportingCountries("blue", item.Year, "2018", item["Netweight (kg)"], item.importLat, item.importLong, item.Reporter, item["Trade Flow"], item.Partner, latlongs2018, importmarkers2018);
        }
	    // add featuregroup of markers to map
		importmarkers2016
        importmarkers2017
        importmarkers2018
	})

    //adding toggle layers by year
	let addedlayers = {
        "2016 Imports": importmarkers2016,
        "2017 Imports": importmarkers2017,
        "2018 Imports": importmarkers2018,
    }

    //making AntLines by year
    makeAntLines(latlongs2016,importmarkers2016,"green");
    makeAntLines(latlongs2017,importmarkers2017, "red");
    makeAntLines(latlongs2018,importmarkers2018, "blue");

	// fit markers to map
	map.fitBounds(importmarkers2016.getBounds());

    //for-loop to make sidebar items, but unable to figure out how to reduce duplicates 
    var latlongs = []; //which includes ALL COORD of every PARTNER COUNTRY 
    var countries = [];

    data.data.forEach(function(item, index){ 
        if(i=0, i<= countries.length){
            if(item.Partner !== countries[i]){
                i++;
            }
            else{
                return;
            }
            eachpoint = [item.importLat, item.importLong];
            latlongs.push(eachpoint);
            countries.push(item.Partner);
        }
    });

    layersarray.forEach(function(){
        $(".mapsidebar").append(`
            <div class ="sidebar-item"
            onclick="toggle(${layersarray[i-1]})">
            <p class = "font2">
            ${2015+i} </p>
            </div>`)
        i++;
    })
}

function toggle(layer) {
	if (map.hasLayer(layer)) {
		map.removeLayer(layer);
	} else {
		map.addLayer(layer);
	}
}


/*–––––––––GEOJSON–––––––––*/
function getGeoJSON(){
	$.getJSON(geojsonPath,function(data){
		//console.log(data)
		// put the data in a global variable
		geojson_data = data;
		// call the map function
		mapGeoJSON() // add a field to be used
	})
}

function mapGeoJSON(field){
	// clear layers in case it has been mapped already
	if (geojson_layer){
		geojson_layer.clearLayers()
	}
	// globalize the field to map
	fieldtomap = field;
	// create an empty array
	let values = [];
	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function(item,index){
		values.push(item.properties[field])
	})
    // create the geojson layer
    geojson_layer = L.geoJson(geojson_data,{
        style: getStyle,
        onEachFeature: onEachFeature // actions on each feature
    }).addTo(map);
}

//outline of countries
function getStyle(feature){
	return {
		stroke: true,
		color: '#7ccfcd',
		weight: 1,
		fill: true,
		fillOpacity: 0
	}
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	layer.on({
		click: zoomToFeature
	});
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}