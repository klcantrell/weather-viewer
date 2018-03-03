(function() {

  window.addEventListener('DOMContentLoaded', function() {
    controller.init(model, view);
  });

  const model = {
    data: {
      myLatitude: "",
      myLongitude: "",
      degreesFahrenheit: "",
      degreesCelsius: "",
      index: 0,
      value: 0,
      unit: ["p9valk7f2lq0s1x/fahrenheit.png?dl=0","q5nwt7qb5fx0snf/celsius.png?dl=0"],
      summary: "",
      icon: ""
    },

    requestCurrentWeather() {
      const url = `https://i34eo8f73h.execute-api.us-east-2.amazonaws.com/darksky/your-current-weather/${this.myLatitude},${this.myLongitude}`;

      return axios.get(url)
        .then((res) => {
          this.updateWeatherData(res.data);
        });
    },

    setCoordinates(lat, long) {
      this.myLatitude = lat;
      this.myLongitude = long;
    },

    updateWeatherData(data) {
      this.data.degreesFahrenheit = Math.floor(data.currently.temperature);
      this.data.degreesCelsius = Math.floor(data.currently.temperature) - 32;
      this.data.summary = data.currently.summary;
      this.data.icon = data.currently.icon;
    },

    getWeatherData() {
      return {
        value: this.data.value,
        summary: this.data.summary,
        index: this.data.index,
        icon: this.data.icon,
        unit: this.data.unit
      }
    }

  }

  const view = {
    init() {
      this.cacheDom();
      this.bindEvents();
      this.fullSpinAnimation(this.reloadBtn);
    },

    cacheDom() {
      this.rootEl = document.getElementById("weather-viewer");
      this.unit = this.rootEl.querySelector(".js_weather-viewer__unit"),
      this.reloadBtn = this.rootEl.querySelector(".js_weather-viewer__reload-btn"),
      this.key = this.rootEl.querySelector(".js_weather-viewer__key"),
      this.pic = this.rootEl.querySelector(".js_weather-viewer__pic"),
      this.splash = this.rootEl.querySelector(".js_weather-viewer__splash"),
      this.temperature = this.rootEl.querySelector(".weather-viewer__temperature"),
      this.summary = this.rootEl.querySelector(".weather-viewer__summary"),
      this.number = this.rootEl.querySelector(".weather-viewer__number");
    },

    bindEvents() {
      this.unit.addEventListener("click", controller.toggleUnit.bind(controller));
      this.reloadBtn.addEventListener("click", function(e) {
        this.reload();
      });
    },

    pageReload() {
      location.reload(true);
    },

    fullSpinAnimation(el) {
      el.classList.add('full-spin');
    },

    destroySplash() {
      this.splash.classList.add("weather-viewer__splash--hidden");
      this.key.classList.add("weather-viewer__key--fade-in");
    },

    renderTimeout() {
      const temperatureContent = html`
          <p class="weather-viewer__timeout-message">
            Please enable location services
          </p>
          <svg class="weather-viewer__reload-btn" viewBox="0 0 489.711 489.711">
          	<path
              d="M112.156,97.111c72.3-65.4,180.5-66.4,253.8-6.7l-58.1,2.2c-7.5,0.3-13.3,6.5-13,14c0.3,7.3,6.3,13,13.5,13
          		c0.2,0,0.3,0,0.5,0l89.2-3.3c7.3-0.3,13-6.2,13-13.5v-1c0-0.2,0-0.3,0-0.5v-0.1l0,0l-3.3-88.2c-0.3-7.5-6.6-13.3-14-13
          		c-7.5,0.3-13.3,6.5-13,14l2.1,55.3c-36.3-29.7-81-46.9-128.8-49.3c-59.2-3-116.1,17.3-160,57.1c-60.4,54.7-86,137.9-66.8,217.1
          		c1.5,6.2,7,10.3,13.1,10.3c1.1,0,2.1-0.1,3.2-0.4c7.2-1.8,11.7-9.1,9.9-16.3C36.656,218.211,59.056,145.111,112.156,97.111z"/>
          	<path
              d="M462.456,195.511c-1.8-7.2-9.1-11.7-16.3-9.9c-7.2,1.8-11.7,9.1-9.9,16.3c16.9,69.6-5.6,142.7-58.7,190.7
          		c-37.3,33.7-84.1,50.3-130.7,50.3c-44.5,0-88.9-15.1-124.7-44.9l58.8-5.3c7.4-0.7,12.9-7.2,12.2-14.7s-7.2-12.9-14.7-12.2l-88.9,8
          		c-7.4,0.7-12.9,7.2-12.2,14.7l8,88.9c0.6,7,6.5,12.3,13.4,12.3c0.4,0,0.8,0,1.2-0.1c7.4-0.7,12.9-7.2,12.2-14.7l-4.8-54.1
          		c36.3,29.4,80.8,46.5,128.3,48.9c3.8,0.2,7.6,0.3,11.3,0.3c55.1,0,107.5-20.2,148.7-57.4
          		C456.056,357.911,481.656,274.811,462.456,195.511z"/>
          </svg>
      `;
      this.temperature.innerHTML = temperatureContent;
      this.temperature
        .querySelector('.weather-viewer__reload-btn')
        .addEventListener('click', this.pageReload);
    },

    renderWeatherView(data) {
      this.unit.classList.remove("weather-viewer__unit--hidden");
      this.summary.innerHTML = data.summary;
      this.number.innerHTML = data.value;
      this.unit.src = "https://dl.dropboxusercontent.com/s/"
    + data.unit[data.index];
      switch(data.icon) {
        case ("cloudy"):
          this.pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/myw7l0bedfoklla/cloudy.png?dl=0");
          this.rootEl.style["border-color"] = "rgb(158, 186, 255)";
          this.key.style.background = "rgb(158, 186, 255)";
          break;

        case ("partly-cloudy-day"):
          this.pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/8o9oqgepv7msf9j/cloudysun.png?dl=0");
          this.rootEl.style["border-color"] = "rgb(158, 186, 255)";
          this.key.style.background = "rgb(158, 186, 255)";
          break;

        case ("partly-cloudy-night"):
          this.pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/1rxdf0ibkhm592q/cloudymoon.png?dl=0");
          this.rootEl.style["border-color"] = "rgb(85, 101, 140)";
          this.key.style.background = "rgb(85, 101, 140)";
          break;

        case ("rain"):
          this.pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/cc872macp2yuvtq/rain.png?dl=0");
          this.rootEl.style["border-color"] = "rgb(0, 76, 255)";
          this.key.style.background = "rgb(0, 76, 255)";
          break;

        case ("clear-day"):
          this.pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/nrr6lcj3ano64ny/sun.png?dl=0");
          this.rootEl.style["border-color"] = "rgb(249, 255, 76)";
          this.key.style.background = "rgb(249, 255, 76)";
          break;

        case ("clear-night"):
          this.pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/isde9hqy0dx3ixb/moon.png?dl=0");
          this.rootEl.style["border-color"] = "rgb(0, 8, 104)";
          this.key.style.background = "rgb(0, 50, 255)";
          break;

        default: this.pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/tryrneq8vp0ftrg/default.png?dl=0");
      }
    },

    toggleUnit(data) {
      this.number.innerHTML = data.value;
      this.unit.src = "https://dl.dropboxusercontent.com/s/"
    + data.unit[data.index];
    }
  }

  const controller = {
    init(model, view) {
      this.model = model;
      this.view = view;
      this.locationOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      this.view.init();
      this.getCurrentLocation();
    },

    getCurrentLocation() {
      navigator.geolocation.getCurrentPosition(
        this.ifLocationReceived.bind(this),
        this.ifGeolocationFails.bind(this),
        this.locationOptions
      );
    },

    ifLocationReceived(e) {
      this.model.setCoordinates(e.coords.latitude, e.coords.longitude);
      this.model.requestCurrentWeather()
        .then(() => {
          this.determineUnit();
          this.view.destroySplash();
          this.view.renderWeatherView(this.model.getWeatherData());
        })
    },

    ifGeolocationFails() {
      this.view.destroySplash();
      setTimeout(() => {
        this.view.renderTimeout();
      }, 1400);
    },

    determineUnit() {
      if (this.model.data.index === 0) {
        this.model.data.value = this.model.data.degreesFahrenheit;
      } else {
        this.model.data.value = this.model.data.degreesCelsius;
      }
    },

    toggleUnit() {
      if (this.model.data.index === 0) {
        this.model.data.index += 1;
      } else {
        this.model.data.index -= 1;
      }
      this.view.toggleUnit(this.model.getWeatherData());
    }
  }

  function html(literals, ...customs) {
    let result = '';
    customs.forEach((custom, i) => {
      let lit = literals[i];
      if (Array.isArray(custom)) {
        custom = custom.join('');
      }
      result += lit;
      result += custom;
    });
    result += literals[literals.length - 1];
    return result;
  }
})();
