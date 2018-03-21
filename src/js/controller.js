export default function Controller() {

  return {
    init(model, view) {
      this.model = model;
      this.view = view;
      this.locationOptions = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 50000
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
        .catch(() => {
          this.view.changeColorScheme(this.view.colors.timeout)
          this.view.destroySplash();
          this.view.renderError('darksky');
        });
    },

    ifGeolocationFails(err) {
      this.view.destroySplash();
      this.view.changeColorScheme(this.view.colors.timeout);
      setTimeout(() => {
        this.view.renderError('timeout');
      }, 1400);
    },

    determineUnit() {
      if (this.model.data.unit === 'F') {
        this.model.data.value = this.model.data.degreesFahrenheit;
      } else {
        this.model.data.value = this.model.data.degreesCelsius;
      }
    },

    toggleUnit() {
      if (this.model.data.unit === 'F') {
        this.model.data.unit = 'C';
      } else {
        this.model.data.unit = 'F';
      }
      this.view.toggleUnit(this.model.getWeatherData());
    }
  }

}
