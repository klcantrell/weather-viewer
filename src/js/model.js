import axios from 'axios';

export default function Model() {

  return {
    data: {
      myLatitude: "",
      myLongitude: "",
      degreesFahrenheit: "",
      degreesCelsius: "",
      unit: 'F',
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
        fahrenheit: this.data.degreesFahrenheit,
        celsius: this.data.degreesCelsius,
        summary: this.data.summary,
        icon: this.data.icon,
        unit: this.data.unit
      }
    }
  }

}
