var pickup_location_lat;
var pickup_location_lng;
var drop_off_lat;
var drop_off_lng;
var pick_up_time;
var drop_off_time;
var journey_duration_in_minutes;
var journey_distance;
var map;
var Polylineroute;
var source_city;
var destination_city;


function initMap() {
 map = new google.maps.Map(document.getElementById('map'), {
center: {lat: -33.8688, lng: 151.2195},
zoom: 13
});

var pickUpelement = document.getElementById('pac-input');
var dropOffElement = document.getElementById('pac-output');

var autocompletePickUp = new google.maps.places.Autocomplete(pickUpelement);
autocompletePickUp.bindTo('bounds', map);
autocompletePickUp.set('sourcetype' , 'pickup');

var autocompleteDropoff = new google.maps.places.Autocomplete(dropOffElement);
autocompleteDropoff.bindTo('bounds', map);
autocompleteDropoff.set('sourcetype' , 'dropoff');


var infowindow = new google.maps.InfoWindow();
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);
  });
}

 var directionsService = new google.maps.DirectionsService;
 var directionsDisplay = new google.maps.DirectionsRenderer({
map: map,
draggable: true
});

directionsDisplay.setPanel(document.getElementById('right-panel'));

addListenerToSearch(autocompletePickUp, map,directionsService,directionsDisplay);
addListenerToSearch(autocompleteDropoff, map,directionsService,directionsDisplay);
 }

function addListenerToSearch(autocomplete, map,directionsService,directionsDisplay) {
    autocomplete.addListener('place_changed', function() {
      var marker = new google.maps.Marker({
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5
    },
    draggable: true,
    map: map
    });
    // infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();

    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(14);
    }

    if (autocomplete.get('sourcetype') === 'pickup') {
        pickup_location_lat = place.geometry.location.lat();
        pickup_location_lng = place.geometry.location.lng();

        for (var i = 0; i < place.address_components.length; i++) {
            component = place.address_components[i];
            if (component["types"].indexOf("locality") > -1) {
                source_city =component.long_name;
                alert(source_city);
            }
        }
    }
    else if(autocomplete.get('sourcetype') === 'dropoff') {
        drop_off_lat = place.geometry.location.lat();
        drop_off_lng = place.geometry.location.lng();
        for (var i = 0; i < place.address_components.length; i++) {
            component = place.address_components[i];
            if (component["types"].indexOf("locality") > -1) {
                destination_city =component.long_name;
                alert(destination_city);
            }
        }
    }

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);


    if (document.getElementById('pac-input').value && document.getElementById('pac-output').value) {
        calculateAndDisplayRoute(map,directionsService,directionsDisplay);
    }
    });
    }

function calculateAndDisplayRoute(map,directionsService,directionsDisplay) {
if (Polylineroute != null) {
    Polylineroute.setMap(null);
    Polylineroute.setPath(null);
}


console.log(document.getElementById('pac-input').value);
console.log(document.getElementById('pac-output').value);

directionsService.route({
origin:  document.getElementById('pac-input').value,
destination:  document.getElementById('pac-output').value,
travelMode: google.maps.TravelMode.DRIVING
}, function(response, status) {
if (status === google.maps.DirectionsStatus.OK) {
directionsDisplay.setDirections(response);
 autoRefresh(map, response.routes[0].overview_path);
console.log(response.routes);

var route = response.routes[0];
var leg = route.legs[0];
var distance = leg.distance.text;
var duration = leg.duration.value;
var duration_in_minute = (leg.duration.value)/60;


journey_distance = distance;
journey_duration_in_minutes = duration_in_minute;

} else {
  window.alert('Directions request failed due to ' + status);
}
});
}

function autoRefresh(map, pathCoords) {
    var i, marker;
    Polylineroute = new google.maps.Polyline({
        path: [],
        geodesic : true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        editable: false,
        map:map
    });
    marker=new google.maps.Marker({map:map, icon:"http://s18.postimg.org/r24kyjy9h/Screen_Shot_2015_11_21_at_7_57_18_PM.png"});

    for (i = 0; i < pathCoords.length; i++) {
        setTimeout(function(coords) {
            Polylineroute.getPath().push(coords);
            moveMarker(map, marker, coords);
        }, 200 * i, pathCoords[i]);
    }
}

function moveMarker(map, marker, latlng) {
    marker.setPosition(latlng);
    map.panTo(latlng);
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function getTimeString( date) {
    var tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
	var localISOTime = (new Date(date - tzoffset)).toISOString().substring(0, 19).replace('T', ' ');
    return localISOTime;
}

var app = angular.module("UberApp", [ ]);
app.controller('RideRequestController', function($scope, $http) {

$scope.startRide = function () {

    pick_up_time = new Date();
    drop_off_time = addMinutes(pick_up_time, journey_duration_in_minutes);

    var pickUpTimeString = getTimeString(pick_up_time);
    var dropOffTimeString = getTimeString(drop_off_time);

    $http({
      method: 'Post',
          url: '/createRide',
          data:{
              "pickup_location_lat":pickup_location_lat,
      "pickup_location_long":pickup_location_lng,
      "drop_location_lat":drop_off_lat,
      "drop_location_long":drop_off_lng,
      "pick_up_date": pickUpTimeString,
      "temp_drop_off_date":dropOffTimeString ,
     // "customer_id": "1234" ,
      "driver_id": "4321" ,
      "ride_duration": String(journey_duration_in_minutes),
      "ride_distance" : journey_distance,
      "driver_first_name": "Ankit",
      "driver_last_name": "Rajput",
      "source_city": source_city,
      "destination_city": destination_city}
       }).success(function(response){
           alert("Request Sent Successfully");
         console.log("connResult:>>"+$scope.workInfoResults);
          }).error(function(error){
          alert("error in friends");
      });
}

$scope.showDrivers = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position);
         var currentlocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         map.setCenter(currentlocation);
         var objectsWithinRange =[];
         for (var i = 0; i < 10; i++) {
                 lat = currentlocation.lat() + i*0.2 ;
                 lng = currentlocation.lng() + i*0.14;
             var locationToPut = new google.maps.LatLng(lat,lng);
             objectsWithinRange.push(locationToPut);
         }
         var radius = new google.maps.Circle({
                center : currentlocation,
                   radius : 60000,
                      fillOpacity : 0,
                    strokeOpacity : 0,
                       map : map
                   } );

                  for (var i = 0; i < objectsWithinRange.length; i++) {
                      var isPresent = radius.getBounds().contains(objectsWithinRange[i]);
                      var position = objectsWithinRange[i];
                      console.log("Inside Marker"+position);
                      if (isPresent) {
                          var marker = new google.maps.Marker({
                            map: map,
                            position: position
                          });
                          marker.setVisible(true);
                          marker.setMap(map);
                      }
                   } 
    });
}
}

$scope.endRide = function () {
	
	/*pick_up_time = new Date();
    drop_off_time = addMinutes(pick_up_time, journey_duration_in_minutes);
        
    var pickUpTimeString = getTimeString(pick_up_time);
    var dropOffTimeString = getTimeString(drop_off_time);*/
    
    $http({
      method: 'Post',
          url: '/endRide',
          data:{
        	  	"ride_id" : "5",
        	  	"customer_id" : "123-45-6789",
        	  	"driver_id" : "4321",
        	  	"temp_drop_off_date" : "2016-02-11 01:16:38"
        	  	}
       }).success(function(response){
           alert("Request Sent Successfully");
        // console.log("connResult:>>"+$scope.workInfoResults);
          }).error(function(error){
          alert("error in friends");
      });
	
    console.log("ride ended");
}

	


$scope.customer = {};

$http({method: 'GET', url: '/getcustomerdetails'}).then(function successCallback(response) {
		    
		alert("received customers details : " + JSON.stringify(response));
		$scope.customer = response.data[0];
			    	
}, function errorCallback(response) {});




$scope.customer_deleteself = function(){
	
	alert("deleting customer self");
	$http({method: 'GET', url: '/customer_deleteself'}).then(function successCallback(response) {
	    
		alert("customer self deleted..");    
		window.location.assign("/customerhome");
			    	
	}, function errorCallback(response) {});           	
	
}


















    
    // Added by Prajwal Kondawar
    $scope.deleteRideBill = function(){
    	
    	alert("deleting Ride / Bill");
    	$http({method: 'POST', url: '/deleteRideBill', data: {"ride_id": "5"}}).then(function successCallback(response) {
		    
    		alert("Ride / Bill deleted..");    
    		//window.location.assign("/customerhome");
    			    	
    	}, function errorCallback(response) {});           	
    	
    }

    
    // Added by Prajwal Kondawar
    $scope.searchBillByAttributes = function(){
    	
    	alert("Searching Bill By Attributes");
    	$http({method: 'POST', url: '/searchBillByAttributes', data: {"attributeType": $scope.attributeType, "attributeValue": $scope.attributeValue}}).then(function successCallback(response) {
		    
    		alert("Bill searched successfully");
    		console.log(response);
    		alert(response.data.result[0].ride_id);
    		alert(response.data.result[1].ride_id);
    		alert(response.data.result[2].ride_id);
    		alert(response.data.result[3].ride_id);
    		//window.location.assign("/customerhome");
    			    	
    	}, function errorCallback(response) {});           	
    	
    }
    
    console.log("Hey there");
});