var cityForm = document.querySelector("#city-form");
var cityInput = document.querySelector("#city-input");
var weatherSect = document.querySelector("#weather-section");
var weatherCurr = document.querySelector("#current-weather");
var citySearched;
var formatDay = { day: "numeric", month: "numeric", year: "numeric" };

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
    //clear the weather section
    weatherSect.innerHTML = "";
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
          displayCityandCountry(location);
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

var displayCityandCountry = function (weatherData) {
  //create h2 element that will holde city and country
  citySearched = document.createElement("h2");
  citySearched.innerHTML = `${weatherData.name}, ${weatherData.country}`;
  //append the city and country to the section
  weatherSect.appendChild(citySearched);
  //cal function to get object with weather details and pass longitude and latitude
  getWeatherDetails(weatherData.lat, weatherData.lon);
};

//get weather details and call functions to display current weather
var getWeatherDetails = function (lat, lon) {
  var apiURL = `${WEATHER_BASE_API_URL}data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${WEATHER_API_KEY}&units=metric`;
  console.log(apiURL);
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
    });
};

var displayCurrentWeather = function (currWeather) {
  //if the object retuned is empty, display message
  if (currWeather === 0) {
    weatherSect.textContent = "No city found";
    return;
  }
  //formata the hour
  var fomatHour = { hour: "numeric", minute: "numeric" };
  //convert UNIX time to human readble time
  var tempUNIX = new Date(currWeather.current.dt * 1000);
  var sunrise = new Date(currWeather.current.sunrise * 1000);
  var sunset = new Date(currWeather.current.sunset * 1000);
  //format the time returned
  var tempTime = tempUNIX.toLocaleDateString("en-GB", formatDay);
  var tempSunrise = sunrise.toLocaleTimeString("en-GB", fomatHour);
  var tempSunset = sunset.toLocaleTimeString("en-GB", fomatHour);
  //create a div element that will display the current date
  var currDateEl = document.createElement("span");
  currDateEl.textContent = " " + "(" + tempTime + ")";
  //append the current date to city and country
  citySearched.appendChild(currDateEl);
  //create a div element that will display the current day temperature and details
  weatherCurr.innerHTML = `
       <div id="temperature" class="col-4">
        <img id="icon" src="https://openweathermap.org/img/w/${currWeather.current.weather[0].icon}.png"></img>
          <h2 id="temperature_value">${currWeather.current.temp}°C</h2>
          <p id="feels-like">Feels like: ${currWeather.current.feels_like}°C</p>
          <span id="description_value">${currWeather.current.weather[0].description}</span>
          
      </div>
      <div id="temperature-details" class="col-8"">
          <div>Sunrise: ${tempSunrise}</div>
          <div>Sunset: ${tempSunset}</div>
          <div>Wind: ${currWeather.current.wind_speed} MPS</div>
          <div>Clouds: ${currWeather.current.clouds}%</div>
          <div>Visibility: ${currWeather.current.visibility} m</div>
          <div>Humidity: ${currWeather.current.humidity}%</div>
          <div>Dew Point: ${currWeather.current.dew_point} C</div>
          <div>UV Index: ${currWeather.current.uvi} nm</div>
        </div>
  `;
  weatherSect.appendChild(weatherCurr);
};

cityForm.addEventListener("submit", formSubmitHandler);
