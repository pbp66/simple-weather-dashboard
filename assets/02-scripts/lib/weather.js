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
			pressure: (response.main.pressure / 33.863886666667).toFixed(0), // measured in hPa (100x Pa). Converted from hPa to inHg
			humidity: response.main.humidity, // Measured in percent
			visibility: math.round(response.visibility / 1609, 1), // max is 10,000 meters (result converted to miles)
			windSpeed: Math.round(response.wind.speed, 0), // miles/hr
			windDirection: getWindDirection(response.wind.deg),
			cloudiness: response.clouds.all, // Measured in percent
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

		// Convert weather data to presentable data
		const weather = {};
		let pressureSum = 0,
			humiditySum = 0,
			counter = 1,
			highTemp = -212,
			lowTemp = 212,
			date,
			time,
			meridiem,
			icon = "";
		let prevDate = luxon.DateTime.fromSeconds(response.list[0].dt).toFormat(
			"LL/dd/yyyy"
		);
		const now = luxon.DateTime.now().toFormat("LL/dd/yyyy");
		let lastItem = response.list.slice(-1);
		for (const item of response.list) {
			[date, time, meridiem] = luxon.DateTime.fromSeconds(item.dt)
				.toFormat("LL/dd/yyyy hh:mm a")
				.split(" ");

			if (now === prevDate) {
				prevDate = date;
				continue;
			}

			let hour = time.split(":")[0];
			if (hour < 4 && meridiem.toLowerCase() === "pm") {
				icon = item.weather[0].icon;
			}

			// Only update the current values if the date hasn't changed
			if (date === prevDate) {
				if (Number(item.main.temp) < Number(lowTemp)) {
					lowTemp = item.main.temp;
				}
				if (Number(item.main.temp) > Number(highTemp)) {
					highTemp = item.main.temp;
				}
				pressureSum += Number(item.main.pressure);
				humiditySum += Number(item.main.humidity);
			}

			// Check if this is the last entry to handle the addition of the last object
			if (item.dt == lastItem[0].dt) {
				weather[date] = {
					icon: icon,
					lowTemp: Math.round(lowTemp, 0),
					highTemp: Math.round(highTemp, 0),
					pressure: Math.round(
						pressureSum / ++counter / 33.863886666667,
						0
					),
					humidity: Math.round(humiditySum / ++counter, 0),
				};

				break;

				// Detect a change in date, store current values, then reset them
			} else if (date !== prevDate) {
				weather[prevDate] = {
					icon: item.weather[0].icon,
					lowTemp: Math.round(lowTemp, 0),
					highTemp: Math.round(highTemp, 0),
					pressure: Math.round(
						pressureSum / counter / 33.863886666667,
						0
					),
					humidity: Math.round(humiditySum / counter, 0),
				};

				lowTemp = Number(item.main.temp);
				highTemp = Number(item.main.temp);
				pressureSum = Number(item.main.pressure);
				humiditySum = Number(item.main.humidity);
				counter = 0;
			}

			counter++;
			prevDate = date;
		}
		return weather;
	}

	async getWeather() {
		return (await fetch(this.url)).json();
	}
}

function getWindDirection(degrees) {
	/**
	 * Source: http://snowfence.umn.edu/Components/winddirectionanddegrees.htm
	 */
	let direction = "";
	if (degrees > 11.25 && degrees <= 33.75) {
		direction = "NNE";
	} else if (degrees > 33.75 && degrees <= 56.25) {
		direction = "NE";
	} else if (degrees > 56.25 && degrees <= 78.75) {
		direction = "ENE";
	} else if (degrees > 78.75 && degrees <= 101.25) {
		direction = "E";
	} else if (degrees > 101.25 && degrees <= 123.75) {
		direction = "ESE";
	} else if (degrees > 123.75 && degrees <= 146.25) {
		direction = "SE";
	} else if (degrees > 146.25 && degrees <= 168.75) {
		direction = "SSE";
	} else if (degrees > 168.75 && degrees <= 191.25) {
		direction = "S";
	} else if (degrees > 191.25 && degrees <= 213.75) {
		direction = "SSW";
	} else if (degrees > 213.75 && degrees <= 236.25) {
		direction = "SW";
	} else if (degrees > 236.25 && degrees <= 258.75) {
		direction = "WSW";
	} else if (degrees > 258.75 && degrees <= 281.25) {
		direction = "W";
	} else if (degrees > 281.25 && degrees <= 303.75) {
		direction = "WNW";
	} else if (degrees > 303.75 && degrees <= 326.25) {
		direction = "NW";
	} else if (degrees > 326.25 && degrees <= 348.75) {
		direction = "NNW";
	} else {
		direction = "N";
	}
	return direction;
}

export default Weather;
