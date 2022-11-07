var cityForm = document.querySelector("#city-form");
var cityInput = document.querySelector("#city-input");
var weatherSect = document.querySelector("#weather-section");
var weatherCurr = document.querySelector("#current-weather");
var forecastCont = document.querySelector("#forecast");
var search = document.querySelector("#recent-section");
var citySearched;
var formatDay = { day: "numeric", month: "numeric", year: "numeric" };
//get local storage previous searches
var userSearch = JSON.parse(localStorage.getItem("search")) || [];

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
  weatherSect.innerHTML = "";
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
  citySearched.style.color = "#e2dfd2";
  citySearched.innerHTML = `${weatherData.name}, ${weatherData.country}`;
  //append the city and country to the section
  weatherSect.appendChild(citySearched);
  //cal function to get object with weather details and pass longitude and latitude
  getWeatherDetails(weatherData.lat, weatherData.lon);
  saveEntry(weatherData.name);
};

//get weather details and call functions to display current weather
var getWeatherDetails = function (lat, lon) {
  var apiURL = `${WEATHER_BASE_API_URL}data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${WEATHER_API_KEY}&units=metric`;
  console.log(apiURL);
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);

      displayForecast(data);
    });
};

var displayCurrentWeather = function (currWeather) {
  var today = currWeather.current;
  //format the hour
  var fomatHour = { hour: "numeric", minute: "numeric" };
  //convert UNIX time to human readable time
  var tempUNIX = new Date(today.dt * 1000);
  var sunrise = new Date(today.sunrise * 1000);
  var sunset = new Date(today.sunset * 1000);
  //format the time returned
  var tempTime = tempUNIX.toLocaleDateString("en-GB", formatDay);
  var tempSunrise = sunrise.toLocaleTimeString("en-GB", fomatHour);
  var tempSunset = sunset.toLocaleTimeString("en-GB", fomatHour);
  //create a div element that will display the current date
  var currDateEl = document.createElement("span");
  currDateEl.textContent = " " + "(" + tempTime + ")";
  //append the current date to city and country
  citySearched.appendChild(currDateEl);
  weatherSect.style.backgroundColor = "#005a9c";
  //create a div element that will display the current day temperature and details
  weatherCurr.innerHTML = `
       <div id="temperature" class="col-4">
        <img id="icon" src="https://openweathermap.org/img/w/${today.weather[0].icon}.png"></img>
          <h3 id="temperature_value">${today.temp}°C</h3>
          <p id="feels-like">Feels like: ${today.feels_like}°C</p>
          <span id="description_value">${today.weather[0].description}</span>
          
      </div>
      <div id="temperature-details" class="col-8"">
          <div>Sunrise: ${tempSunrise}</div>
          <div>Sunset: ${tempSunset}</div>
          <div>Wind: ${today.wind_speed} MPS</div>
          <div>Clouds: ${today.clouds}%</div>
          <div>Visibility: ${today.visibility} m</div>
          <div>Humidity: ${today.humidity}%</div>
          <div>Dew Point: ${today.dew_point} C</div>
          <div>UV Index: ${today.uvi} nm</div>
        </div>
  `;
  /*Append the current day weather to the weather section contaienr */
  weatherSect.appendChild(weatherCurr);
};

var displayForecast = function (forecast) {
  //pass the object retrieved and concatenate desired path to variable
  var dayWeather = forecast.daily;
  forecastCont.innerHTML = "";
  //create header element
  var forecastHeader = document.createElement("h4");
  forecastHeader.textContent = "5 Day Forecast";
  forecastHeader.style.cssText =
    "font-weight: 900;border-top: 3px solid #e2dfd2; padding-top: 20px";
  //append elements
  weatherSect.appendChild(forecastHeader);
  weatherSect.appendChild(forecastCont);
  //First element of the retrieved object is already displayed so start at index 1 and return the next 5
  for (var i = 1; i < 6; i++) {
    var daily = dayWeather[i];
    var day = new Date(daily.dt * 1000).toLocaleDateString("en-GB", formatDay);
    var newDay = document.createElement("div");
    /*Populate the newDay Div*/
    newDay.innerHTML = `
      <div class="weather-card">
        <div class="date">
          <span>${day}</span>
        </div>
        <div id="icon">
        <img class="align-center" src="https://openweathermap.org/img/w/${daily.weather[0].icon}.png">
        </div>
        <div class="temperature">
          <span>Temp: ${daily.temp.day}°C</span>
        </div>
        <div class="tem-max">
        <span>Max: ${daily.temp.max}°C</span>
        </div>
        <div class="temp-min">
        <span>Min: ${daily.temp.min}°C</span>
        </div>
        <div class="wind">
        <span>Wind: ${daily.wind_speed} KPS</span>
        </div>
        <div class="humidity">
          <span>Hum: ${daily.humidity}%
          </span>
        </div>
    `;
    /*Append the newDay to the forecast Container */
    forecastCont.appendChild(newDay);
  }
};

var loadSearch = function () {
  //check if userSearch array exists and display it
  if (userSearch) {
    displaySearch();
  }
};

var saveEntry = function (item) {
  //check if the item search already exists
  var searchExists = userSearch.find((search) => search == item);

  //if the item exists
  if (searchExists) {
    //return empty
    return;
  } else {
    //if item doesnt exist push it into userSearch array
    userSearch.unshift(item);
    //save it in local storage
    localStorage.setItem("search", JSON.stringify(userSearch));
    //call displaySearch functiom to create new item div
    displaySearch();
  }
};

var displaySearch = function () {
  //clear recent=section and avoid duplicates
  search.innerHTML = "";
  userSearch.splice(5);
  //iterate through each userSearch item and create div and append it to recent-item container
  for (var i = 0; i < userSearch.length; i++) {
    var city = document.createElement("div");
    city.classList.add("recent-item");
    city.addEventListener("click", recentEntry);
    city.textContent = userSearch[i];
    search.appendChild(city);
  }
};

//function to display weather if user clicks past search input
var recentEntry = function (e) {
  findCoords(e.target.textContent);
};
loadSearch();
cityForm.addEventListener("submit", formSubmitHandler);
