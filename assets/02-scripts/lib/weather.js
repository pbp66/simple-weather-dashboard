import API from "./api";
import Geocoding from "./geocoding";

class Weather extends API {
	constructor() {
		super(
			"http://api.openweathermap.org/data/2.5/forecast",
			"1b3bacfd2da20311ada4894fff0d35e8"
		);
	}

	async getCurrentWeather() {}

	async getExtendedForecast(days) {}

	async getWeather() {}
}

export default Weather;
