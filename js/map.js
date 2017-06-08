var geocoder;
var map;

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
		}
	});
}

