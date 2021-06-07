// Global variables
let landfillsmap;
let landfillslat = 0;
let landfillslon = 0;
let landfillszl = 3;
// path to csv data
let landfillspath = "data/landfills.csv";

let landfillsmarkers = L.featureGroup();


// initialize
$( document ).ready(function() {
	createlandfillsMap(landfillslat,landfillslon,landfillszl);
	readlandfillsCSV(landfillspath);
});

// create the map
function createlandfillsMap(lat,lon,zl){
	landfillsmap = L.map('landfillsmap').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(landfillsmap);
}

// function to read csv data. from PapaParse
function readlandfillsCSV(landfillspath){
	Papa.parse(landfillspath, {
		header: true,
		download: true,
		complete: function(data) {
			//console.log(data);
			// map the data
			maplandfillsCSV(data);
		}
	});
}

function maplandfillsCSV(data){
    let landfillscircleOptions = {
        radius: 5,
        weight: 1,
        color: "white",
        fillColor: "dodgerblue",
        fillOpacity: 1,
    }
	// loop through each entry
	data.data.forEach(function(item,index){
		// create marker
		let landfillsmarker = L.circleMarker([item.sitelat,item.sitelong], landfillscircleOptions)
        //chains a mouseover function that shows the location and image in popup when HOVERED
        .on('mouseover',function(){
			this.bindPopup(`<b>${item.name}</b><br>${item.size}<br>${item.about}<br><img width="250" src="${item.imageurl}">`).openPopup()
		})
        .on('click', function(){
            panToImage(index);
        })
		// add marker to featuregroup
		landfillsmarkers.addLayer(landfillsmarker)
	})
	// add featuregroup of markers to map
	landfillsmarkers.addTo(landfillsmap)
	// fit markers to map so that the map goes to the fitted markers
	landfillsmap.fitBounds(landfillsmarkers.getBounds())
}

function panToImage(index){
	landfillsmap.setZoom(9);
	landfillsmap.panTo(landfillsmarkers.getLayers()[index]._latlng);
}