var cityForm = document.querySelector("#city-form");
var cityInput = document.querySelector("#city-input");

var WEATHER_BASE_API_URL = "https://api.openweathermap.org/";
var WEATHER_API_KEY = "c828ba608f878d909ac2c8a1fd874157";


var formSubmitHandler = function (event) {
  event.preventDefault();
  //trim the user input value and save it in a variable
  var city = cityInput.value.trim();

  //if the user submited an entry
  if (city) {
    //call findCoords functions and pass the input value
    findCoords(city);
    //clear the input value
    cityInput.innerHTML = "";
    //if no submission has been made
  } else {
    //alert the user to enter a city name
    alert("Please enter a city");
  }
};

var findCoords = function (search) {
  var apiURL = `${WEATHER_BASE_API_URL}geo/1.0/direct?q=${search}&limit=5&appid=${WEATHER_API_KEY}`;
  fetch(apiURL)
    .then(function (response) {
      //if the response is 200
      if (response.ok) {
        //parse the response to jason
        response.json().then(function (data) {
          //pass the object returned to a variable
          var location = data[0];
          console.log(location);
        });
      } else {
        //alert the user if nothing is returned
        alert("Error: " + response.statusText);
      }
    })
    //catch the error if no connection was made
    .catch(function (error) {
      alert("Unable to connect");
    });
};

cityForm.addEventListener("submit", formSubmitHandler);
