import { Weather, Geocoding } from "./lib/index.js";

const inputField = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const searchHistoryList = document.getElementById("search-history-list");
const currentWeatherDate = document.getElementById("current-weather-date");
const currentWeatherCity = document.getElementById("current-weather-title");

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
	return await weatherAPI.getCurrentWeather(latitude, longitude);
}

async function fetchForecast(latitude, longitude) {
	return await weatherAPI.getCurrentWeather(latitude, longitude);
}

async function fetchCoordinates(location) {
	return await geocodingAPI.findByLocation(location);
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
		forecast = await fetchForecast(latitude, longitude);
	} catch (err) {
		console.error(err);
		return;
	}

	currentWeatherDate.innerText = currentWeather.dateTime.toLocaleString();
	currentWeatherCity.innerText = name;

	console.log(currentWeather);
	console.log(geoLocation);

	addToSearchHistory(0, 0, inputField.value);
});
