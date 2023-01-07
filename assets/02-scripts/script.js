import { Weather, Geocoding } from "./lib/index.js";

const inputField = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const searchHistoryList = document.getElementById("search-history-list");

const geocodingAPI = new Geocoding();
const weatherAPI = new Weather();

function addToSearchHistory(latitude, longitude, location) {
	const buttonElement = document.createElement("button");
	buttonElement.classList.add("previous-entry", "btn", "btn-secondary");
	buttonElement.value = `{lat: ${latitude}, lon: ${longitude}}`;
	buttonElement.innerText = location; // TODO: Change to City Name

	const listItem = document.createElement("li");
	listItem.classList.add("city", "text-center");
	listItem.appendChild(buttonElement);
	searchHistoryList.append(listItem);
}

async function fetchCurrentWeather(latitude, longitude) {
	let response;
	response = await weatherAPI.getCurrentWeather(latitude, longitude);
	const weather = {
		dateTime: luxon.DateTime.fromSeconds(response.dt),
		icon: response.weather.icon,
		weatherId: response.weather.id,
		temperature: response.main.temp,
		feelsLikeTemp: response.main.feels_like,
		lowTemp: response.main.temp_min,
		highTemp: response.main.temp_max,
		pressure: response.main.pressure / 33.863886666667, // measured in hPa (100x Pa). Converted from hPa to inHg
		humidity: response.main.humidity / 100, // Transformed to percent
		visibility: response.visibility, // max is 10,000 meters
		windSpeed: response.wind.speed, // miles/hr
		windDirection: response.wind.deg,
		windGust: response.wind.gust, // miles/hr
		cloudiness: response.clouds.all / 100, // Transformed to percent
		rainVolume: response.rain,
		snowVolume: response.snow,
		sunrise: luxon.DateTime.fromSeconds(response.sys.sunrise),
		sunset: luxon.DateTime.fromSeconds(response.sys.sunset),
		weather: response.weather,
	};
	return weather;
}

async function fetchForecast(latitude, longitude) {}

async function fetchCoordinates(location) {
	let response;
	if (location.zipCode == null) {
		if (location.state == null) {
			response = await geocodingAPI.getCoordinatesByLocationName(
				location.city
			);
		} else {
			response = await geocodingAPI.getCoordinatesByLocationName(
				location.city,
				"US",
				location.state
			);
		}
	} else {
		response = await geocodingAPI.getCoordinatesByZipCode(
			location.zipCode,
			"US"
		);
	}
	if (!(await response)) {
		return null;
	} else {
		return response;
	}
}

function parseSearchInput(inputString) {
	const location = {};

	// Separates entries by commas. If no commas are provided, the fetch request will give a 404 response
	const inputValues = inputString.split(",").map((element) => element.trim());

	for (const item of inputValues) {
		// Check if it contains a zipCode. Note, if the user enters multiple zip codes, only the last one will be taken.
		if (parseInt(item, 10)) {
			// All uses zip codes are 5 digits long. This does not work with the extended zip code format
			if (item.length === 5) {
				location.zipCode = parseInt(item, 10);
			}
		} else if (item.length === 2) {
			location.state = item;
			// Check if the element is composed of lower case, upper case, and spaces
		} else if (/^[a-z A-Z]+$/.test(item)) {
			location.city = item;
		}
	}

	return location;
}

searchButton.addEventListener("click", async (event) => {
	event.preventDefault();

	let geoLocation;
	let currentWeather;
	let forecast;

	try {
		const location = parseSearchInput(inputField.value);
		geoLocation = await fetchCoordinates(location);
		if (!geoLocation) {
			throw new Error("Bad Input Error");
		}
	} catch (err) {
		alert("Improper input");
		return;
	}

	const { lat: latitude, lon: longitude, name, country, state } = geoLocation;

	try {
		currentWeather = await fetchCurrentWeather(latitude, longitude);
		console.log(currentWeather);
		forecast = await fetchForecast(latitude, longitude);
		console.log(forecast);
	} catch (err) {
		console.error(err);
		return;
	}

	addToSearchHistory(0, 0, inputField.value);
});
