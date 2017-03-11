angular.module("ForecastApp", [])
	.controller("WeatherServiceController", ["$scope", "$http", 
				"GoogleGeolocationService", "DarkSkyWeatherService",
		function($scope, $http, GoogleGeolocationService, DarkSkyWeatherService){
		   
		   var wsc = this;
		   
		   //holds the cities the user can choose from
		   $http.get("locations.txt")
				.then(function(response){
					wsc.temporary = response.data;
					wsc.cities = wsc.temporary.cities;
					wsc.displayName = wsc.cities[0].name;
					wsc.selected_city = wsc.cities[0];
					wsc.getLatLonForSelected();
				});
		   
		   //key: AIzaSyDMVzdoeTlizNyusgSNmnBKiXJFJbBDsyY
		   
		   //name of the app
		   wsc.app_name = "Weather App";
		   
		   //holds the latitude and longitude of selected city
		   wsc.selected_lat = 0;
		   wsc.selected_lon = 0;
		   
		   //holds the website we are using the gifs from 
		   wsc.imageSource = "";
		   
		   
				
		   
		   //given the selected_city determines the lat and lon
		   wsc.getLatLonForSelected = function(){
		   		GoogleGeolocationService.geoLocate(wsc.selected_city)
		   			.then(function(res){
		   				wsc.selected_lat = res.data.results[0].geometry.location.lat;
		   				wsc.selected_lon = res.data.results[0].geometry.location.lng;
		   				
		   				wsc.selected_city.lat = wsc.selected_lat;
		   				wsc.selected_city.lon = wsc.selected_lon;
		   				
		   				
		   				var google_static_maps_key = "AIzaSyDMVzdoeTlizNyusgSNmnBKiXJFJbBDsyY";
		   				wsc.google_static_maps_url = "https://maps.googleapis.com/maps/api/staticmap?center=" +
                                                 wsc.selected_lat + "," +
                                                 wsc.selected_lon + 
                                                 "&zoom=10&size=600x300&key=" +
                                                 google_static_maps_key;
		   				
		   				wsc.getCurrentConditions();

		   			})
		   			.catch(function(err){
		   				console.log(err);
		   			});
		   };
		   
		   //find the conditions using the latitude and longitude given
		   wsc.getCurrentConditions = function(){
		   		DarkSkyWeatherService.getCurrentConditions(wsc.selected_city)
		   			.then(function(res){
		   				//tada! weather stuff!
		   				
		   				wsc.observation_time = res.data.currently.time * 1000;
		   				wsc.temperature = res.data.currently.temperature;
		   				wsc.dewpoint = res.data.currently.dewPoint;
		   				wsc.windBearing = res.data.currently.windBearing;
		   				wsc.windSpeed = res.data.currently.windSpeed;
		   				wsc.icon = res.data.currently.icon;
		   				wsc.summary = res.data.currently.summary;
		   				wsc.determinePicture();
		   				console.log(res);
		   			})
		   			.catch(function(err){
		   				console.log(err);
		   			});
		   };
		   
		   //gets the latitude and longitude when selected city changes
		   wsc.selectTheCity = function(){
		   		wsc.getLatLonForSelected();
		   		
		   };
		   
		   //finds the url for the picture
		   wsc.determinePicture = function(){
		   	
		   	//https://www.iconfinder.com/iconsets/sketchy-weather-icons-by-azuresol
		   	
		   	switch(wsc.icon){
		   		case "clear-day":
		   			wsc.imageSource = "https://cdn0.iconfinder.com/data/icons/sketchy-weather-icons-by-azuresol/128/32_cloud_weather.png";
		   			break;
		   		case "clear-night":
		   			wsc.imageSource = "https://cdn0.iconfinder.com/data/icons/sketchy-weather-icons-by-azuresol/128/31_cloud_weather.png";
		   			break;
		   		case "rain":
		   			wsc.imageSource = "https://cdn0.iconfinder.com/data/icons/sketchy-weather-icons-by-azuresol/128/40_cloud_weather.png";
		   			break;
		   		case "snow":
		   			wsc.imageSource = "https://cdn0.iconfinder.com/data/icons/sketchy-weather-icons-by-azuresol/128/42_cloud_weather.png";
		   			break;
		   		case "sleet":
		   			wsc.imageSource = "https://cdn0.iconfinder.com/data/icons/sketchy-weather-icons-by-azuresol/128/07_cloud_weather.png";
		   			break;
		   		case "wind":
		   			wsc.imageSource = "https://cdn0.iconfinder.com/data/icons/sketchy-weather-icons-by-azuresol/128/24_cloud_weather.png";
		   			break;
		   		case "fog":
		   			wsc.imageSource = "https://cdn0.iconfinder.com/data/icons/sketchy-weather-icons-by-azuresol/128/20_cloud_weather.png";
		   			break;
		   		case "cloudy":
		   			wsc.imageSource = "https://cdn0.iconfinder.com/data/icons/sketchy-weather-icons-by-azuresol/128/26_cloud_weather.png";
		   			break;
		   		case "partly-cloudy-day":
		   			wsc.imageSource = "https://cdn0.iconfinder.com/data/icons/sketchy-weather-icons-by-azuresol/128/44_cloud_weather.png";
		   			break;
		   		case "partly-cloudy-night":
		   			wsc.imageSource = "https://cdn0.iconfinder.com/data/icons/sketchy-weather-icons-by-azuresol/128/29_cloud_weather.png";
		   			break;
		   	}	
		   };
		   
		   
		  
		   
		   
			
		}])

	.directive('myConditions', ['$sce', function($sce){
		
		/*
		The restrict option is typically set to:
		'A' - only matches attribute name
		'E' - only matches element name
		'C' - only matches class name
		'M' - only matches comment
		*/
		return{
			restriction: 'E',
			scope: true,
			templateUrl: $sce.trustAsResourceUrl('currentConditions.html')	
		}
	}])
	

	.factory('GoogleGeolocationService', ['$sce', '$http', 
		function($sce, $http){
			
			
			//https://docs.angularjs.org/api/ng/service/$sce
			
		
			var geolocationService = {};
			
			
			//Google Maps Geocoding API Key
			var key = "AIzaSyDMVzdoeTlizNyusgSNmnBKiXJFJbBDsyY";
			
			geolocationService.geoLocate = function(location){
			
				//a javascript promise "geolocationService" is returned
				var address = "+"+location.name+",+"+location.state;
				var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
							+address+"&key="+key;
						
				var trustedurl = $sce.trustAsResourceUrl(url);
				
				return $http.get(trustedurl);
				
				};
				return geolocationService;
	}])
	
	//finds the actual weather
	.factory('DarkSkyWeatherService', ['$sce', '$http',
		function($sce, $http){
				
				var darkSkyWeatherService = {};
				
				//DarkSky API key
				var key = "ae6dc566564f8d4a598c06437f0831fd";
				
				darkSkyWeatherService.getCurrentConditions = function(location){
					
					var url = "https://api.darksky.net/forecast/" + key + 
								"/" + location.lat + "," + location.lon;
								
					var trustedUrl = $sce.trustAsResourceUrl(url);
					return $http.jsonp(trustedUrl, {jsonpCallbackParam: 'callback'});
					
					console.log("Darksky Api Url: ");		
					console.log(url);
				};
				
				return darkSkyWeatherService;
		}])
		

	.filter('temp', function(){
		
		return function(fa){
			var celc = (fa - 32) * (5/9);
			var realCelsius = celc.toFixed(2);
			
			return fa + "  (" + realCelsius + ") C";
		};
	})
	
	.filter("windDirection", function(){
		return function(bearing){
			var direction;
			bearing.toFixed(2);
			if(bearing == 348.75 || bearing <= 11.25){
				direction = "N";
			}else if(bearing >= 11.25 && bearing <= 33.75){
				direction = "NNE";
			}else if(bearing >= 33.76 && bearing <= 56.25){
				direction = "NE";
			}else if(bearing >= 56.26 && bearing <= 78.75){
				direction = "ENE";
			}else if(bearing >= 78.76 && bearing <= 101.25){
				direction = "E";
			}else if(bearing >= 101.26 && bearing <= 123.75){
				direction = "ESE";
			}else if(bearing >= 123.76 && bearing <= 146.25){
				direction = "SE";
			}else if(bearing >= 146.26 && bearing <= 168.75){
				direction = "SSE";
			}else if(bearing >= 168.76 && bearing <= 191.25){
				direction = "S";
			}else if(bearing >= 191.26 && bearing <= 213.75){
				direction = "SSW";
			}else if(bearing >= 213.76 && bearing <= 236.25){
				direction = "SW";
			}else if(bearing >= 236.26 && bearing <= 258.75){
				direction = "WSW";
			}else if(bearing >= 258.76 && bearing <= 281.25){
				direction = "W";
			}else if(bearing >= 281.26 && bearing <= 303.75){
				direction = "WNW";
			}else if(bearing >= 303.76 && bearing <= 326.25){
				direction = "NW";
			}else if(bearing >= 26.26 && bearing <= 348.74){
				direction = "NE";
			}
			
			return direction + " ";
		}
	})
	
	.filter("addMph", function(){
		return function(speed){
			return speed + " MPH"
		}
	})
	
	.filter("addFhrt", function(){
		return function(temp){
			return temp + " F";
		};
})