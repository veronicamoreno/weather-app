
// display the current date and time

let now = new Date();
let date = now.getDate();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let day = days[now.getDay()];
let year = now.getFullYear();
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
let month = months[now.getMonth()];

function formatDate() {
  return `${day}, ${date} ${month}, ${year}`;
}

let h3 = document.querySelector("h3");
h3.innerHTML = formatDate(new Date())

let hour = now.getHours();
let minute = now.getMinutes();
let second = now.getSeconds();

function formatTime(){
  return`${hour} : ${minute} :  ${second}`;
}

let h4 = document.querySelector("h4");
h4.innerHTML = formatTime(new Date())


// Add a search engine, when searching for a city, display the city name on the page after the user submits the form.
// Display the name of the city on the result page and the current temperature of the city.

let apiKey = "7b0d44840db905a5258c2af1da0defe7";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&appid=" + apiKey;


function capitaliseString(input){
    let output = input.trim().toLowerCase();
    output = output[0].toUpperCase() + output.slice(1);
    return output;
}

function updateInnerHTML(element, value){
    document.querySelector(element).innerHTML = value;
}

function updateHTMLWeatherCity(weather){
    let temperature = weather.data.main.temp;
    temperature = Math.round(temperature);
    let description = weather.data.weather[0].description;
    let humidity = weather.data.main.humidity;
    let wind = weather.data.wind.speed;
    let city = weather.data.name;
    wind = Math.round(wind)
    let icon = document.querySelector("#icon");

    updateInnerHTML("#currentTemperature",temperature);
    updateInnerHTML("#description", description);
    updateInnerHTML("#humidity","Humidity: " + humidity + "%");
    updateInnerHTML("#wind","Wind: " + wind + " mph");
    updateInnerHTML("h2", city);
    icon.setAttribute("src", `http://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`);
    updateForecast(city);
}

function updateWeatherCity(city){
    axios.get(`${apiUrl}&q=${city}`).then(updateHTMLWeatherCity);
}


function getWeatherCity(event){
    let searchInput = document.querySelector("#search");
    let city = capitaliseString(searchInput.value);
    searchInput.value = "";
    updateWeatherCity(city);
}

let form = document.querySelector("#search-button");
form.addEventListener("click", getWeatherCity);


// Add a Current Location button. 
// When clicking on it, it uses the Geolocation API to get your GPS coordinates and display the city and current temperature using the OpenWeather API.
let latitude;
let longitude;

function getPosition(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

function updateWeatherLocation(latitude, longitude){
    axios.get(`${apiUrl}&lat=${latitude}&lon=${longitude}`).then(updateHTMLWeatherCity);
}

function getWeatherLocation(){
    navigator.geolocation.getCurrentPosition(getPosition);
    updateWeatherLocation(latitude, longitude);
}

let currentLocation = document.querySelector("#geolocation");
currentLocation.addEventListener("click", getWeatherLocation);

  // Display temperature in Celsius and add a link to convert it to Fahrenheit. When clicking on it, it should convert the temperature to Fahrenheit. 
let tempUnit = "c";

function fahrenheit(){

  if(tempUnit != "f"){
let celsius = String(document.querySelector("#currentTemperature").innerHTML);
let fahrenheit = Math.round((celsius * 9) / 5 + 32);

updateInnerHTML("#currentTemperature", fahrenheit);
tempUnit = "f";
  }
}

  let fahrenheitlink = document.querySelector("#fahrenheit");
  fahrenheitlink.addEventListener("click", fahrenheit);

  function Celsius(){

   if(tempUnit != "c"){
    let currentFahrenheit = String(document.querySelector("#currentTemperature").innerHTML) ;
    let currentCelsius =Math.round((currentFahrenheit-32)/1.8);

    updateInnerHTML("#currentTemperature", currentCelsius);
    tempUnit = "c";
   }
  }

  let celsiusLink = document.querySelector("#celsius");
  celsiusLink.addEventListener("click", Celsius);

  // Display forecast

function formatHours(timestamp){
let date = new Date(timestamp);
let hours = date.getHours();
if (hours < 10){
  hours = `${hours}`;
}
let minutes = date.getMinutes();
if (minutes < 10){
  minutes = `0${minutes}`;
}
  return `${hours} : ${minutes}`;
}

function displayForecast(response){
  
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index =0; index < 5; index++){
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
            <div class="col-sm forecast">
              <p> <span class = "forecast-time">
                ${formatHours(forecast.dt * 1000)}</span><br />
                <img
                  class="icon"
                  src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"
                  alt=""
                />
                <br /><span class = "forecast-temp">
                <strong>${Math.round(forecast.main.temp_max)}°</strong>'/${Math.round(forecast.main.temp_min)}°
              </span></p>
            </div>

    `;
  }
}

 let forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&appid="+ apiKey;

function updateForecast(city){
  axios.get(`${forecastApiUrl}&q=${city}`).then(displayForecast);
}

//default initial city
if(document.querySelector("h2").innerHTML == ""){
updateWeatherCity('London');
}
