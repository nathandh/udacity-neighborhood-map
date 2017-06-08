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

// Our initial map scope in Manhattan
var NYC_ROCKEFELLER = "45 Rockefeller Plaza, New York, NY 10111"

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

function placesCallback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var place = results[i];
			createMarker(results[i]);
			console.log("Found nearby Church: " + place);
		}
	} else {
		console.log("Finding nearby Churches failed due to: " + status);
		$('#map').prepend("<p>Failed to find any nearby Church places....</p>");
	}
}

function createMarker(place) {
	console.log("In createMarker...for: " + place.name);
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
}

// Google Map Load, callback on Map.html page load
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		scrollwheel: false,
		zoom: 14
	});
	
	geocoder = new google.maps.Geocoder();
	geocode(NYC_ROCKEFELLER, function(latlng) {
		if (latlng !== null) {
			map.setCenter(latlng);
			var marker = new google.maps.Marker({
				map: map,
				position: latlng
			});

			// Grab nearby by "church" places
			var churchRequest = {
				location: latlng,
				radius: '1000',
				types: ['church']
			}
			var placesService = new google.maps.places.PlacesService(map);
			placesService.nearbySearch(churchRequest, placesCallback);
		} else {
				$('#map').prepend("<p>Failed to load Google Map! API service may be down...</p>");
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
	this.updateMarkers = function() {
		return null;
	}
}

$(document).ready(function(){
	ko.applyBindings(new MapViewModel());
});
