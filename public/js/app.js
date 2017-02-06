"use strict";

var app = angular.module("weatherApp", ["ngRoute"])

//this just shows I can use routing and ng-view
app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		controller: "mainPageController",
		templateUrl: "views/mainPageForm.html"
	})
})

//Custom Angular filter to convert Kelvin to Farenheit
app.filter("tempConvertFilter", function() {
	return function(degree) {

		if (isNaN(degree)) {
			return console.error("The values provided are not numbers")
		} else {
			return degree * 9/5 - 459.67
		}
	}
})

//filter to capitalize first letter in words
//https://github.com/ng-milk/angular-capitalize-filter
app.filter('capitalize', function() {  
  return function(input){
    if(input.indexOf(' ') !== -1){
      var inputPieces,
          i;

      input = input.toLowerCase();
      inputPieces = input.split(' ');

      for(i = 0; i < inputPieces.length; i++){
        inputPieces[i] = capitalizeString(inputPieces[i]);
      }

      return inputPieces.toString().replace(/,/g, ' ');
    }
    else {
      input = input.toLowerCase();
      return capitalizeString(input);
    }

    function capitalizeString(inputString){
      return inputString.substring(0,1).toUpperCase() + inputString.substring(1);
    }
  };
});



app.controller("mainPageController", function($scope, weatherSvc) {

//some default values to make things look good
$scope.currentForecast = currTempDefault

var fiveDayForecastArray = []
//this array holds the 5 day forecast response from the api call
//the fillForecastArray function grooms the response array 
var responseArray = []

//loops through an array groom it to give the max, min, within the date range
function fillForecastArray(array) {
	//empty the array on call everytime
	fiveDayForecastArray = []
	
	var max = array[0].main.temp_max
	var min = array[0].main.temp_min

	for (var i = 0; i < array.length; i++) {

		var currX = array[i].main.temp_max
		var currN = array[i].main.temp_min
		var currD = array[i].dt
		var currI = array[i].weather[0].icon
		
		if (currX > max) {
			max = currX
		}

		if (currN < min) {
			min = currN
		}

		if (i != 0 && ((i + 1) % 8 == 0)) {
			fiveDayForecastArray.push({
				"dt": currD,
				"main": {
					"temp_max": max,
					"temp_min": min
				},
				"weather":[{
					"icon": currI
				}]

			})
			max = -1000
			min = 1000
		}
	}
}

console.log($scope.fiveDayForecast)
$scope.clear = function() {
	$scope.city = ""
}

$scope.retrieveWeather = function(city) {
	//save city to city to use accross both service calls 
	var city = city

	var onlyCity = city.substring(0, city.indexOf(','))
	var onlyCountry = city.substring((city.length), city.indexOf(',')).replace(/\s+/g, '')
	var combined = onlyCity + onlyCountry

	weatherSvc.getCurrentWeather(combined)
	.then(function(response) {
		$scope.currentForecast = response.data
		})
	.catch(function(error) {
		console.error(error)
	})


	weatherSvc.getFiveDayForecast(combined)
	.then(function(response) {
		responseArray = response.data.list
		fillForecastArray(responseArray)
		$scope.fiveDayForecast = fiveDayForecastArray
	})	
	.catch(function(error) {
		console.error(error)
	})
	
	}
})

//These are the services that I will call on to make the http api calls
app.service("weatherSvc", ["$http", function($http) {

  	var key = "";

	(function () {
	    return $http.get("/api/myKey/")
	    .then(function(response) {
	       key = response.data.key
	    })
	    .catch(function(error) {
	      return error
	    })
	  })();

	//api key is in the get request here for dev reasons
	this.getCurrentWeather = function(city) {
		return $http.get("http://api.openweathermap.org/data/2.5/weather?q="+ city + key)
		.then(function(response) {
			return response
		})
		.catch(function(error) {
			return error
		})
	}

	this.getFiveDayForecast = function(city) {
		//to get the the five day forecast we change weather from the above request to forcast
		return $http.get("http://api.openweathermap.org/data/2.5/forecast?q="+ city + key)
		.then(function(response) {
			return response
		})
		.catch(function(error) {
			return error
		})
	}
	
}])
//this section has default data sets they fix the ui and the capitalize filter
//default deta set to keep things pretty
var currTempDefault = 
{
  "weather": [
    {
      "description": "clear skies",
    }
  ],
  "main": {
    "temp": 255.372,
    "humidity": 0,
  },
  "name": "New York",
}


