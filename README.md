# WeatherGist
### Get the quick gist of your local weather with this app.

This weather app gets straight to the point and shows the user their local temperature, a brief description of the weather conditions in their area, and an icon and color animation that portrays that description. Upon loading, the app immediately requests the user's location and then interfaces with the Dark Sky API to retrieve and display the weather information based on that location.

User can:

* See the weather in their current location
* See a different icon (e.g. rainy clouds, sunny sky) depending on the weather
* Push a button to toggle between Fahrenheit and Celsius

Tech Highlights:

* Setup an **AWS lambda function** with **Node.js** to act as a proxy server with the **Dark Sky API**
* Used SVG `defs` and `symbol` elements to load and switch between different weather icons

#### Visit the site!
#### https://weathergist.surge.sh/
