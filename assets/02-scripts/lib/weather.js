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
			windGust: response.wind.gust ? response.wind.gust : 0, // miles/hr
			cloudiness: response.clouds.all, // Measured in percent
			rainVolume: response.rain ? response.rain : 0,
			snowVolume: response.snow ? response.snow : 0,
			sunrise: response.sys.sunrise
				? luxon.DateTime.fromSeconds(response.sys.sunrise)
				: null,
			sunset: response.sys.sunset
				? luxon.DateTime.fromSeconds(response.sys.sunset)
				: null,
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

		let weather = [
			response.list[7],
			response.list[15],
			response.list[23],
			response.list[31],
			response.list[39],
		];

		weather = weather.map((element) => {
			return {
				dateTime: luxon.DateTime.fromSeconds(element.dt),
				icon: element.weather[0].icon,
				weatherId: element.weather[0].id,
				temperature: element.main.temp,
				feelsLikeTemp: element.main.feels_like,
				lowTemp: element.main.temp_min,
				highTemp: element.main.temp_max,
				pressure: element.main.pressure / 33.863886666667, // measured in hPa (100x Pa). Converted from hPa to inHg
				humidity: element.main.humidity, // Measured in percent
				visibility: element.visibility, // max is 10,000 meters
				windSpeed: element.wind.speed, // miles/hr
				windDirection: element.wind.deg,
				windGust: element.wind.gust ? element.wind.gust : 0, // miles/hr
				cloudiness: element.clouds.all, // Measured in percent
				rainVolume: element.rain ? element.rain : 0,
				snowVolume: element.snow ? element.snow : 0,
				sunrise: element.sys.sunrise
					? luxon.DateTime.fromSeconds(element.sys.sunrise)
					: null,
				sunset: element.sys.sunset
					? luxon.DateTime.fromSeconds(element.sys.sunset)
					: null,
				weather: element.weather, // Full weather output if needed
			};
		});

		return weather;
	}

	async getWeather() {
		return (await fetch(this.url)).json();
	}
}

export default Weather;
