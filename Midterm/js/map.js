// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 2;
// path to csv data
let path = "data/usa-world-plastic-20161718.csv";
// global variables
let exportmarkers2016 = L.featureGroup();
let importmarkers2016 = L.featureGroup();

let exportmarkers2017 = L.featureGroup();
let importmarkers2017 = L.featureGroup();

let exportmarkers2018 = L.featureGroup();
let importmarkers2018 = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
});

// create the empty map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);

			// map the data
			mapCSV(data);
		}
	});
}

function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
		
			// map the data
			mapCSV(data);

		}
	});
}

function mapCSV(data){
	//design for circles of points of export
    let circleOptionsExport = {
        radius: 15,
        weight: 0.5,
        color: "green",
        fillColor: "green",
        fillOpacity: 0.1, 
    }

    //design for circles of points of import
	let circleOptionsImport = {
		radius: 15,
		weight: 0.5,
		color: "red",
		fillColor: null,
		fillOpacity: 0.1,
	}

/* Trying to make functions to call in the forEach loop below, but unable to figure out how to call a featureGroup as a parameter in each doExport() and doImport() function 
    function doExport(item){
        circleOptionsExport.radius = item["Netweight (kg)"] * 0.0000002

        let exportmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsExport)
        .on('mouseover',
            function(index){
            this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste to " + item.Partner + " in " + item.Year}`).openPopup();
        })
        featureGroup.addLayer(exportmarker);
    }

    function doImport(item){
        circleOptionsImport.radius = item["Netweight (kg)"] * 0.0000002

        let importmarker = L.circleMarker([item.importLat, item.importLong], circleOptionsImport)
        .on('mouseover', function(index){
            this.bindPopup(`${item.Partner + " imported " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Reporter + " in " + item.Year}`).openPopup()
        })
        featureGroup.addLayer(importmarker);
    }
    */

    data.data.forEach(function(item,index){

		if (item["Trade Flow"] === "Export" || item["Trade Flow"] === "Re-Export"){
            if (item.Year === "2016"){
                
                circleOptionsExport.radius = item["Netweight (kg)"] * 0.0000002
                let exportmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsExport)
                .on('mouseover',
                    function(index){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste to " + item.Partner + " in " + item.Year}`).openPopup();
                })
                exportmarkers2016.addLayer(exportmarker);

                circleOptionsImport.radius = item["Netweight (kg)"] * 0.0000002
                let importmarker = L.circleMarker([item.importLat, item.importLong], circleOptionsImport)
                .on('mouseover', function(index){
                    this.bindPopup(`${item.Partner + " imported " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Reporter + " in " + item.Year}`).openPopup()
                })
                
                importmarkers2016.addLayer(importmarker);
                
            }
            if (item.Year === "2017"){
                
                circleOptionsExport.radius = item["Netweight (kg)"] * 0.0000002
                let exportmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsExport)
                .on('mouseover',
                    function(index){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste to " + item.Partner + " in " + item.Year}`).openPopup();
                })
                exportmarkers2017.addLayer(exportmarker)
                
                circleOptionsImport.radius = item["Netweight (kg)"] * 0.0000002
                let importmarker = L.circleMarker([item.importLat, item.importLong], circleOptionsImport)
                .on('mouseover', function(index){
                    this.bindPopup(`${item.Partner + " imported " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Reporter + " in " + item.Year}`).openPopup()
                })
                importmarkers2017.addLayer(importmarker);
            }

            if (item.Year === "2018"){
    
                circleOptionsExport.radius = item["Netweight (kg)"] * 0.0000002
                let exportmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsExport)
                .on('mouseover',
                    function(index){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste to " + item.Partner + " in " + item.Year}`).openPopup();
                })
                exportmarkers2018.addLayer(exportmarker)
            
                circleOptionsImport.radius = item["Netweight (kg)"] * 0.0000002
                let importmarker = L.circleMarker([item.importLat, item.importLong], circleOptionsImport)
                .on('mouseover', function(index){
                    this.bindPopup(`${item.Partner + " imported " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Reporter + " in " + item.Year}`).openPopup()
                })
                importmarkers2018.addLayer(importmarker);
            }

		}
		else {
            if(item.Year === "2016"){
                circleOptionsImport.radius = item["Netweight (kg)"] * 0.0000002
                circleOptionsImport.fillColor= "red"
                let importmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsImport)
                .on('mouseover',function(){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Partner}`).openPopup()
                })
                importmarkers2016.addLayer(importmarker)
            }

            if (item.Year === "2017"){
                circleOptionsImport.radius = item["Netweight (kg)"] * 0.0000002
                circleOptionsImport.fillColor= "red"
                let importmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsImport)
                .on('mouseover',function(){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Partner}`).openPopup()
                })
                importmarkers2017.addLayer(importmarker)
            }

            if (item.Year === "2018"){
                circleOptionsImport.radius = item["Netweight (kg)"] * 0.0000002
                circleOptionsImport.fillColor= "red"
                let importmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsImport)
                .on('mouseover',function(){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Partner}`).openPopup()
                })
                importmarkers2018.addLayer(importmarker)
            }
		}
		

	// add featuregroup of markers to map
		importmarkers2016.addTo(map)
		exportmarkers2016.addTo(map)

        importmarkers2017.addTo(map)
		exportmarkers2017.addTo(map)

        importmarkers2018.addTo(map)
		exportmarkers2018.addTo(map)

	})

	let addedlayers = {
        "2016 Exports": exportmarkers2016,
        "2016 Imports": importmarkers2016,

        "2017 Exports": exportmarkers2017,
        "2017 Imports": importmarkers2017,

        "2018 Exports": exportmarkers2018,
        "2018 Imports": importmarkers2018,
    }


    // add layer control box. "null" is for basemap. layers, i.e., is defined above
    L.control.layers(null,addedlayers).addTo(map);

	// fit markers to map so that the map goes to the fitted markers
	map.fitBounds(importmarkers2016.getBounds())


//for loop to make sidebar items, but unable to figure out how to reduce duplicates 
    var latlongs = [];
    var countries = [];
    
    data.data.forEach(function(item, index){
        if(i=0, i<= latlongs.length+1){
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
    //console.log(latlongs);
    //console.log(countries);

 
    //for loop to add sidebar buttons
    latlongs.forEach(function(item){
        //console.log(latlongs[i])
        $(".sidebar").append(`
            <div class ="sidebar-item"
            onclick= "map.flyTo([${latlongs[i]}], 5)"> 
            ${countries[i]}
            </div>`)
        i++;
    })

}