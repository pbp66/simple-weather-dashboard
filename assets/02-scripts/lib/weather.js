import API from "./api";
import Geocoding from "./geocoding";

// API Key: 1b3bacfd2da20311ada4894fff0d35e8

//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

class Weather extends API {
	constructor() {
		super(
			"http://api.openweathermap.org/data/2.5/forecast",
			"1b3bacfd2da20311ada4894fff0d35e8"
		);
	}
}

export default Weather;
