/* 
Nathan D. Hernandez
Udacity FullStack NanoDegree

ver 0.1 - June 2017

map.js:
Includes the Google MAP Api Specific load Javasript to implement javascript map 
functionality within our web application. Implementaiton was done by 
using examples and documentation as found on https://developers.google.com.

KnockoutJS ViewModel is also implemented below using KnockoutJS documentation.
*/

"use strict";

/* GOOGLE MAPS Specific */
var geocoder;
var map;

var churchMarkers = [];
var mapListItems = ko.observableArray();
var filterMapListItems = ko.observableArray();

// To track last InfoWindow that was open, so that we can close it on new click
var lastInfoWindow;
// To track last marker animation
var lastMarkerAnimation;

// Our initial map scope in Manhattan
var NYC_ROCKEFELLER = "45 Rockefeller Plaza, New York, NY 10111"

var KEYWORDS = ["church", "cathedral", "baptist", "catholic", 
				"christian", "sacred", "fellowship","protestant"]

function geocode(address, callback){
	geocoder.geocode( {'address': address}, function(results, status) {
		if (status == 'OK'){
			var latlng = results[0].geometry.location;
			console.log('latlng is' + latlng);
			callback(latlng);
		} else {
			console.log("Geocode was not successful because: " + status);
			callback(null);
		}
	});
}

function setAnimation(marker) {
	console.log("In setAnination for marker...");
	google.maps.event.addListener(marker, 'click', function animate() {
		if (typeof(lastMarkerAnimation) !== 'undefined'){
			// Stop the animation on previous marker
			lastMarkerAnimation.setAnimation(null);
			lastMarkerAnimation.setIcon(null);
		}
		// Do some marker animation
		if (this.getAnimation() !== null) {
			this.setAnimation(null);
		} else {
			this.setAnimation(google.maps.Animation.BOUNCE);
			// Set lastMarkerAnimation for tracking
			lastMarkerAnimation = this;
		}
	});

	return marker;
}

function getWikipediaInfo(place, callback){
	var lat = place.geometry.location.lat();
	var lng = place.geometry.location.lng();
	var name = place.name;
	$.ajax({
		type: "GET",
		url: "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=coordinates|pageimages|pageterms&colimit=25&piprop=thumbnail&pithumbsize=150&pilimit=25&wbptterms=description&generator=geosearch&ggscoord="+lat+"|"+lng+"&ggsradius=100&ggslimit=5",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
			var wikiObj;
			var keyMatch = false;
			//console.log(data);
			if (data.hasOwnProperty("query")){
				for (var page in data.query.pages){
					if (!data.query.pages.hasOwnProperty(page)) continue;

					var currPageObj = data.query.pages[page]; 
					for (var k = 0; k < KEYWORDS.length; k++){
						if (currPageObj.title.toLowerCase().includes(KEYWORDS[k])){
							keyMatch = true;
							break;
						}
					}

					if (keyMatch !== false){
						wikiObj = currPageObj;
						break;
					}
				}
			}
			callback(wikiObj);
		}
	});
}

function setInfoWindow(marker, place) {
	console.log("In setInfoWindow for marker...");
	var infoWindow = new google.maps.InfoWindow();
	var wikiData = '<div class="wikidata">No Wiki info available...</div>';
	google.maps.event.addListener(marker, 'click', function info() {
		var latLng = this.getPosition();
		if (typeof(lastInfoWindow) !== 'undefined'){
			// Close our last open infoWindow
			lastInfoWindow.close();
			lastMarkerAnimation.setIcon(null);
		}

		var iwindow = this;
		getWikipediaInfo(place, function(wikiObj){
			console.log(wikiObj);
			if (typeof(wikiObj) !== 'undefined'){
				//console.log(wikiObj["terms"]);
				var description = 'No Wiki description available...';
				var pageid = wikiObj.pageid;
				if (wikiObj.hasOwnProperty("terms")){
					description = wikiObj["terms"].description;
				}
				wikiData = '<div class="wikidata"><img src="'
							+ wikiObj.thumbnail.source + 
							'" height="'
							+ wikiObj.height + 
							'" width="' 
							+ wikiObj.width + 
							'" ><div class="wiki-description">'
							+ description +
							'</div><div class="wiki-link">'
							+ '<a href="http://en.wikipedia.org/?curid='
							+ pageid +
							'" target="_blank">Wikipedia Page</a></div>';
			}
			
			infoWindow.setContent('<div class="marker-info"><h4>'
									+ place.name + 
								   '</h4>'
									+ wikiData + 
									'</div>');

			// Center map on marker
			map.setCenter(latLng);

			// Open our info window
			infoWindow.open(map, iwindow);
			iwindow.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
			// Set infoWindow as last info window opened
			lastInfoWindow = infoWindow;
		});
	});
	return marker;
}

// Set map on all churchMarkers
function setMapOnAll(map) {
	console.log("In setMapOnAll()");
	for (var i = 0; i < filterMapListItems().length; i++){
		var currItem = filterMapListItems()[i]
		var currItemMarker = churchMarkers[currItem.marker]
		console.log(currItem.name);

		if (map === null){
			// Just set null on all markers
			currItemMarker.setMap(map);
		} else {
			var index = -1;
			for (var j = 0; j < mapListItems().length; j++){
				if (mapListItems()[j].name === currItem.name){
					index = j;
					break;
				}
			}
			if (index !== -1){
				churchMarkers[currItem.marker].setMap(map);
			} else {
				// set null on marker not currently in mapListItems
				churchMarkers[currItem.marker].setMap(null);
			}
		}
	} 
}

// Remove all markers from map, maintaining in array
function clearMarkers() {
	setMapOnAll(null);
}

function showMarkers() {
	setMapOnAll(map);
}

function createMarker(place) {
	console.log("In createMarker...for: " + place.name);
	var marker = new google.maps.Marker({
		map: map,
		animation: google.maps.Animation.DROP,
		position: place.geometry.location
	});

	// Set infoWindow information for marker
	var markerWithInfo = setInfoWindow(marker, place);
	var markerWithAnimation = setAnimation(markerWithInfo);

	return markerWithAnimation;
}

function placesCallback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var place = results[i];
			// Only add a Church in given radius if NAME is unique as we don't
			// want multiple "same-name" items in our ListView
			var index = -1;
			for (var j = 0; j < mapListItems().length; j++){
				if (mapListItems()[j].name === place.name){
					index = j;
					break;
				}
			}
			var keyMatch = false;
			if (index === -1){
				// Only add a Place if it matches defined KEYWORDS in name
				for (var k = 0; k < KEYWORDS.length; k++){
					if (place.name.toLowerCase().includes(KEYWORDS[k])){
						keyMatch = true;
						break;
					}
				}

				if (keyMatch != false){
					churchMarkers.push(createMarker(results[i]));
					// console.log("Found nearby Church: " + place);
					// Update NavMenu List
					var currChurchName = place.name;
					if (currChurchName.length > 25){
						currChurchName = currChurchName.slice(0, 22) + '...';
					}
					mapListItems.push({name:currChurchName, marker:churchMarkers.length-1});
				}
			}
		}
		// Set final COPY of MapListItems for filter searching
		filterMapListItems = ko.observableArray(mapListItems.slice(0));
	} else {
		console.log("Finding nearby Churches failed due to: " + status);
		$("#map").prepend("<p>Failed to find any nearby Church places....</p>");
	}

	// console.log("Found: " + results.length + " # of churches.");
	// console.log("Church Markers after placesCallback(): " + churchMarkers);
}

// Google Map Load, callback on Map.html page load
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		scrollwheel: false,
		zoom: 15
	});
	
	geocoder = new google.maps.Geocoder();
	geocode(NYC_ROCKEFELLER, function(latlng) {
		if (latlng !== null) {
			map.setCenter(latlng);
			/* //Commented out since we don't need a marker for Rockefeller//
			var marker = new google.maps.Marker({
				map: map,
				position: latlng
			});
			*/

			// Grab nearby by "church" places
			var churchRequest = {
				location: latlng,
				radius: '1000',
				types: ['church']
			}
			var placesService = new google.maps.places.PlacesService(map);
			placesService.nearbySearch(churchRequest, placesCallback);
			// Refere to placesCallback() function for nearby place handling
		} else {
				$("#map").prepend("<p>Failed to load Google Map! API service may be down...</p>");
		}
	});
}

/* KNOCKOUT JS Specific */

/*
MapViewModel
KnockoutJS ViewModel Implementation. Completed by using examples and 
documentation as found on https://knockoutjs.com/.
*/
var MapViewModel = function() {
	var self = this;
	self.mapListItems = mapListItems;
	self.filter = ko.observable('');
	self.filterSearch = function(value) {
		self.mapListItems.removeAll()
		clearMarkers();
		for (var i = 0; i < filterMapListItems().length; i++) {
			var currItem = filterMapListItems()[i];
			// console.log(filterMapListItems().length);
			// console.log("Curr item is: " + currItem);
			if (currItem.name.toLowerCase().indexOf(value.toLowerCase()) !== -1){
				mapListItems.push(currItem);
				showMarkers();
			}
		}
	}
	self.showChurchInfo = function(church) {
		console.log("In showChurchInfo for church: " + church.name);
		var index = -1;
		for (var i = 0; i < mapListItems().length; i++){
			if (mapListItems()[i].name == church.name){
				index = i;
				break;
			}
		}
		if (index !== -1){
			var currChurch = self.mapListItems()[index];
			console.log("Clicked showChurchInfo for index: " + currChurch.marker);

			new google.maps.event.trigger(churchMarkers[currChurch.marker], 'click');
		}
	}

	self.filter.subscribe(self.filterSearch);
}

$(document).ready(function(){
	ko.applyBindings(new MapViewModel());
});
