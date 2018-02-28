window.addEventListener("DOMContentLoaded", function() {
  getLocation();
  loadSpin();
});

var rootEl = document.getElementById("weather-viewer");
var unit = rootEl.querySelector(".js_weather-viewer__unit");
unit.addEventListener("click", changeUnit);
unit.addEventListener("touchstart", buttonTouchStart);
unit.addEventListener("touchend", buttonTouchEnd);
unit.addEventListener("mouseover", buttonMouseOver);
unit.addEventListener("mousedown", buttonMouseDown);
unit.addEventListener("mouseleave", buttonMouseLeave);
unit.addEventListener("mouseup", buttonMouseUp);
var refreshIcon = rootEl.querySelector(".js_weather-viewer__refresh-icon");
refreshIcon.addEventListener("click", reload);
refreshIcon.addEventListener("click", refreshSpin);
refreshIcon.addEventListener("touchstart", buttonTouchStart);
refreshIcon.addEventListener("touchend", buttonTouchEnd);
refreshIcon.addEventListener("mouseover", buttonMouseOver);
refreshIcon.addEventListener("mousedown", buttonMouseDown);
refreshIcon.addEventListener("mouseleave", buttonMouseLeave);
refreshIcon.addEventListener("mouseup", buttonMouseUp);

var myKey = "d13867253fbc52d1aed6c28e266b43b5";
var myLatitude;
var myLongitude;
var degreesFahrenheit;
var degreesCelsius;
var currentDate = new Date();
var currentHour = currentDate.getHours();
var key = rootEl.querySelector(".js_weather-viewer__key");
var pic = rootEl.querySelector(".js_weather-viewer__pic");
var splash = rootEl.querySelector(".js_weather-viewer__splash");
var temperature = rootEl.querySelector(".weather-viewer__temperature");
var summary = rootEl.querySelector(".weather-viewer__summary");
var number = rootEl.querySelector(".weather-viewer__number");
var locOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}
var model = {
  index: 0,
  value: 0,
  unit: ["p9valk7f2lq0s1x/fahrenheit.png?dl=0","q5nwt7qb5fx0snf/celsius.png?dl=0"],
  summary: "",
  icon: ""
};

function getLocation() {
  navigator.geolocation.getCurrentPosition(setLatLong, timeout, locOptions);
}

function reload() {
  location.reload(true);
}

function loadSpin() {
  refreshIcon.style["animation-name"] = "spin";
  refreshIcon.style["animation-duration"] = "4000ms";
  refreshIcon.style["animation-iteration-count"] = "1";
  refreshIcon.style["animation-timing-function"] = "linear";
}

function refreshSpin(e) {
  e.target.style["animation-name"] = "spin";
  e.target.style["animation-duration"] = "4000ms";
  e.target.style["animation-iteration-count"] = ".5";
  e.target.style["animation-timing-function"] = "linear";
}

function removeSplash() {
  splash.style.opacity = "0";
  splash.style.visibility = "hidden";
  key.style.opacity = .25;
}

function timeout(e) {
  removeSplash();
  console.log(e);
  unit.style.visibility = "hidden";
  setTimeout(addTimeoutView, 1400);
}

function addTimeoutView() {
  var timeoutMessage = document.createElement("P");
  timeoutMessage.innerHTML = "Please enable location services";
  timeoutMessage.setAttribute("class", "weather-viewer__timeout-message");
  temperature.appendChild(timeoutMessage);
  var timeoutButton = document.createElement("I");
  timeoutButton.setAttribute("class", "fa fa-refresh");
  timeoutButton.setAttribute("aria-hidden", "true");
  timeoutButton.addEventListener("click", refreshSpin);
  timeoutButton.addEventListener("click", reload);
  timeoutButton.classList.add("weather-viewer__timeout-btn");
  temperature.appendChild(timeoutButton);
}

function setLatLong(position) {
  myLatitude = position.coords.latitude;
  myLongitude = position.coords.longitude;
  requestDarkSky(myLatitude, myLongitude);
  setTimeout(removeSplash, 2000);
}

function requestDarkSky() {
  var request = document.createElement('script');
  request.setAttribute("src", "https://api.darksky.net/forecast/" + myKey + "/" + myLatitude
                       + ',' + myLongitude + "?callback=updateModel");
  document.head.appendChild(request);
}

function updateModel(res) {
  degreesFahrenheit = Math.floor(res.currently.temperature);
  degreesCelsius = Math.floor(res.currently.temperature) - 32;
  model.summary = res.currently.summary;
  model.icon = res.currently.icon;
  summary.innerHTML = model.summary;
  updateView();
}

function updateView() {
  determineValue();
  number.innerHTML = model.value;
  unit.src = "https://dl.dropboxusercontent.com/s/"
+ model.unit[model.index];
  determinePic();
}

function determineValue() {
  if (model.index === 0) {
    model.value = degreesFahrenheit;
  } else {
    model.value = degreesCelsius;
  }
}

function changeUnit() {
  if (model.index === 0) {
    model.index += 1;
  } else {
    model.index -= 1;
  }
  updateView();
}

function determinePic() {
  switch(model.icon) {
    case ("cloudy"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/myw7l0bedfoklla/cloudy.png?dl=0");
      rootEl.style["border-color"] = "rgb(158, 186, 255)";
      key.style.background = "rgb(158, 186, 255)";
      break;

    case ("partly-cloudy-day"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/8o9oqgepv7msf9j/cloudysun.png?dl=0");
      rootEl.style["border-color"] = "rgb(158, 186, 255)";
      break;

    case ("partly-cloudy-night"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/1rxdf0ibkhm592q/cloudymoon.png?dl=0");
      rootEl.style["border-color"] = "rgb(85, 101, 140)";
      key.style.background = "rgb(85, 101, 140)";
      break;

    case ("rain"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/cc872macp2yuvtq/rain.png?dl=0");
      rootEl.style["border-color"] = "rgb(0, 76, 255)";
      key.style.background = "rgb(0, 76, 255)";
      break;

    case ("clear-day"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/nrr6lcj3ano64ny/sun.png?dl=0");
      rootEl.style["border-color"] = "rgb(249, 255, 76)";
      key.style.background = "rgb(249, 255, 76)";
      break;

    case ("clear-night"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/isde9hqy0dx3ixb/moon.png?dl=0");
      rootEl.style["border-color"] = "rgb(0, 8, 104)";
      key.style.background = "rgb(0, 50, 255)";
      break;

    default: pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/tryrneq8vp0ftrg/default.png?dl=0");
  }
}

function buttonMouseOver(e) {
  e.target.style.cursor = "pointer";
  e.target.style.opacity = ".5";
}

function buttonMouseDown(e) {
  e.target.style.cursor = "pointer";
  e.target.style.opacity = "1";
  e.target.style.background = "rgb(105, 112, 114)";
}

function buttonTouchStart(e) {
  e.target.style.cursor = "pointer";
  e.target.style.opacity = "1";
  e.target.style.background = "rgb(105, 112, 114)";
}

function buttonMouseLeave(e) {
  e.target.style.cursor = "auto";
  e.target.style.opacity = "1";
  e.target.style.background = "rgb(255, 255, 255)";
}

function buttonMouseUp(e) {
  e.target.style.cursor = "pointer";
  e.target.style.background = "rgb(255, 255 ,255)";
}

function buttonTouchEnd(e) {
  e.target.style.cursor = "pointer";
  e.target.style.opacity = "1";
  e.target.style.background = "rgb(255, 255 ,255)";
}
