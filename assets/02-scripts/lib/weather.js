import API from "./api.js";

class Weather extends API {
	constructor() {
		super(
			"http://api.openweathermap.org/data/2.5",
			"1b3bacfd2da20311ada4894fff0d35e8"
		);
	}

	async getCurrentWeather(latitude, longitude) {
		this.setSearchParameters({
			lat: latitude,
			lon: longitude,
			units: "imperial",
			appid: this.getApiKey(),
		});

		this.url.pathname += "/weather";
		const response = await this.getWeather();
		this.resetURL();
		const weather = {
			dateTime: luxon.DateTime.fromSeconds(response.dt),
			icon: response.weather[0].icon,
			weatherId: response.weather[0].id,
			temperature: response.main.temp,
			feelsLikeTemp: response.main.feels_like,
			lowTemp: response.main.temp_min,
			highTemp: response.main.temp_max,
			pressure: response.main.pressure / 33.863886666667, // measured in hPa (100x Pa). Converted from hPa to inHg
			humidity: response.main.humidity, // Measured in percent
			visibility: response.visibility, // max is 10,000 meters
			windSpeed: response.wind.speed, // miles/hr
			windDirection: response.wind.deg,
			windGust: response.wind.gust, // miles/hr
			cloudiness: response.clouds.all, // Measured in percent
			rainVolume: response.rain,
			snowVolume: response.snow,
			sunrise: luxon.DateTime.fromSeconds(response.sys.sunrise),
			sunset: luxon.DateTime.fromSeconds(response.sys.sunset),
			weather: response.weather, // Full weather output if needed
		};
		return weather;
	}

	async getExtendedForecast(days, latitude, longitude) {
		this.setSearchParameters({
			lat: latitude,
			lon: longitude,
			units: "imperial",
			cnt: days * 8, // data every 3 hours, 8 periods in 24 hours
			appid: this.getApiKey(),
		});

		this.url.pathname += "/forecast";
		const response = await this.getWeather();
		this.resetURL();
		// const weather {} = response;
		return response;
	}

	async getWeather() {
		return (await fetch(this.url)).json();
	}
}

export default Weather;
