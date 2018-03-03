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
      console.log('update firing');
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
      this.fullSpinAnimation(this.refreshIcon);
    },

    cacheDom() {
      this.rootEl = document.getElementById("weather-viewer");
      this.unit = this.rootEl.querySelector(".js_weather-viewer__unit"),
      this.refreshIcon = this.rootEl.querySelector(".js_weather-viewer__refresh-btn"),
      this.key = this.rootEl.querySelector(".js_weather-viewer__key"),
      this.pic = this.rootEl.querySelector(".js_weather-viewer__pic"),
      this.splash = this.rootEl.querySelector(".js_weather-viewer__splash"),
      this.temperature = this.rootEl.querySelector(".weather-viewer__temperature"),
      this.summary = this.rootEl.querySelector(".weather-viewer__summary"),
      this.number = this.rootEl.querySelector(".weather-viewer__number");
    },

    bindEvents() {
      this.unit.addEventListener("click", controller.toggleUnit.bind(controller));
      this.refreshIcon.addEventListener("click", function(e) {
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
          <i class="fa fa-refresh weather-viewer__timeout-btn"
              aria-hidden=true>
          </i>
      `;
      this.temperature.innerHTML = temperatureContent;
      this.temperature
        .querySelector('.weather-viewer__timeout-btn')
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
