import API from "./api.js";
import Geocoding from "./geocoding.js";

class Weather extends API {
	constructor() {
		super(
			"http://api.openweathermap.org/data/2.5/forecast",
			"1b3bacfd2da20311ada4894fff0d35e8"
		);
	}

	async getCurrentWeather(latitude, longitude) {
		this.setSearchParameters({
			lat: latitude,
			lon: longitude,
			units: imperial,
		});
		const response = await this.getWeather();
		// const weather {} = response;
		return response;
	}

	async getExtendedForecast(days, latitude, longitude) {
		this.setSearchParameters({
			lat: latitude,
			lon: longitude,
			units: imperial,
			cnt: days,
		});
		const response = await this.getWeather();
		// const weather {} = response;
		return response;
	}

	async getWeather() {
		return (await fetch(this.url)).json();
	}
}

export default Weather;
