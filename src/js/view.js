import { html } from './utils';

export default function View(controller) {
  return {
    colors: {
      cloudy: {
        mainColor: "rgb(158, 186, 255)",
        backgroundColor: "rgb(207, 221, 255)"
      },
      partlyCloudDay: {
        mainColor: "rgb(158, 186, 255)",
        backgroundColor: "rgb(207, 221, 255)"
      },
      partlyCloudNight: {
        mainColor: "rgb(85, 101, 140)",
        backgroundColor: "rgb(174, 182, 202)"
      },
      rain: {
        mainColor: "rgb(0, 76, 255)",
        backgroundColor: "rgb(64, 121, 252)"
      },
      clearDay: {
        mainColor: "rgb(249, 255, 76)",
        backgroundColor: "rgb(252, 255, 173)"
      },
      clearNight: {
        mainColor: "rgb(0, 50, 255)",
        backgroundColor: "rgb(0, 8, 105)"
      },
      timeout: {
        mainColor: "rgb(215, 207, 204)",
        backgroundColor: "rgb(167, 158, 156)"
      },
      default: {
        mainColor: "rgb(78,205,196)",
        backgroundColor: "rgb(162, 222, 208)"
      }
    },

    init() {
      this.cacheDom();
      this.bindEvents();
      this.fullSpinAnimation(this.reloadBtn);
    },

    cacheDom() {
      this.rootEl = document.getElementById("weather-viewer");
      this.unit = this.rootEl.querySelector(".js_weather-viewer__unit");
      this.reloadBtn = this.rootEl.querySelector(".js_weather-viewer__reload-btn");
      this.key = this.rootEl.querySelector(".js_weather-viewer__key");
      this.pic = this.rootEl.querySelector(".js_weather-viewer__pic");
      this.splash = this.rootEl.querySelector(".js_weather-viewer__splash");
      this.temperature = this.rootEl.querySelector(".js_weather-viewer__temperature");
      this.summary = this.rootEl.querySelector(".js_weather-viewer__summary");
      this.number = this.rootEl.querySelector(".js_weather-viewer__number");
      this.display = this.rootEl.querySelector(".js_weather-viewer__main-display")
      this.body = document.querySelector('body');
    },

    bindEvents() {
      this.unit.addEventListener("click", controller.toggleUnit.bind(controller));
      this.reloadBtn.addEventListener("click", () => {
        this.pageReload();
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
      const iconUseEl = this.pic.querySelector('use'),
            unitUseEl = this.unit.querySelector('use');
      this.unit.classList.remove("weather-viewer__unit--hidden");
      this.summary.innerHTML = data.summary;
      this.number.innerHTML = data.value;
      if (data.unit === 'F') {
        unitUseEl.setAttribute('href', '#svg_fahrenheit');
      } else {
        unitUseEl.setAttribute('href', '#svg_celsius');
      }
      switch(data.icon) {
        case ("cloudy"):
          iconUseEl.setAttribute("href", "#svg_cloudy");
          this.changeColorScheme(this.colors.cloudy);
          break;

        case ("partly-cloudy-day"):
          iconUseEl.setAttribute("href", "#svg_partly-cloudy-day");
          this.changeColorScheme(this.colors.partlyCloudDay);
          break;

        case ("partly-cloudy-night"):
          iconUseEl.setAttribute("href", "#svg_partly-cloudy-night");
          this.changeColorScheme(this.colors.partlyCloudNight);
          break;

        case ("rain"):
          iconUseEl.setAttribute("href", "#svg_rain");
          this.changeColorScheme(this.colors.rain);
          break;

        case ("clear-day"):
          iconUseEl.setAttribute("href", "#svg_clear-day");
          this.changeColorScheme(this.colors.clearDay);
          break;

        case ("clear-night"):
          iconUseEl.setAttribute("href", "#svg_clear-night");
          this.changeColorScheme(this.colors.clearNight);
          break;

        default:
          iconUseEl.setAttribute("href", "#svg_default");
          this.changeColorScheme(this.colors.default);
          break;
      }
    },

    toggleUnit(data) {
      if (data.unit === 'F') {
        this.unit.querySelector('use').setAttribute('href', '#svg_fahrenheit');
      } else {
        this.unit.querySelector('use').setAttribute('href', '#svg_celsius');
      }
    },

    changeColorScheme(scheme) {
      this.rootEl.style.borderColor = scheme.mainColor;
      this.key.style.background = scheme.mainColor;
      this.body.style.background = scheme.backgroundColor;
      this.display.style.background = scheme.backgroundColor;
    }
  }
}
