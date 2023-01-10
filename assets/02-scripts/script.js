// TODO: Change background based on weather type.
// TODO: Final stylistic changes.

import {
	Weather,
	Geocoding,
	stateNameToAbbreviation,
	addForecastWeatherContent,
	addCurrentWeatherContent,
} from "./lib/index.js";

const inputField = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");

const geocodingAPI = new Geocoding();
const weatherAPI = new Weather();

const searchHistory = [];
const searchHistoryList = document.getElementById("search-history-list");
function addToSearchHistory(latitude, longitude, location) {
	if (!searchHistory.includes(location)) {
		// Create previous search button entry
		const buttonElement = document.createElement("button");
		buttonElement.classList.add("previous-entry", "btn", "btn-secondary");
		buttonElement.value = JSON.stringify({ lat: latitude, lon: longitude });
		buttonElement.innerText = location;
		buttonElement.addEventListener("click", search);

		// Add search button to the list
		const listItem = document.createElement("li");
		listItem.classList.add("city", "text-center");
		listItem.appendChild(buttonElement);

		// Add list item to the list
		searchHistoryList.append(listItem);

		// Set the max history limit to 10 entries. If more than 10 entires, remove the oldest entry
		if (searchHistory.length >= 10) {
			searchHistory.shift();
		}
		searchHistory.push(location);
	}
}

async function fetchCurrentWeather(latitude, longitude) {
	return await weatherAPI.getCurrentWeather(latitude, longitude);
}

async function fetchForecast(latitude, longitude) {
	return await weatherAPI.getExtendedForecast(5, latitude, longitude);
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

async function search(event) {
	event.preventDefault();

	let geoLocation;
	let currentWeather;
	let forecast;

	// Handle behavior for when the search button is clicked vs a previous entry
	if (event.target.id === "search-button") {
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
	} else if (event.target.classList.contains("previous-entry")) {
		const coordinates = JSON.parse(event.target.value);
		geoLocation = await geocodingAPI.getLocationInformation(
			coordinates.lat,
			coordinates.lon
		);
	} else {
		console.error(
			"The clicked element does not have a proper class or id associated with it to handle click events"
		);
	}

	const { lat: latitude, lon: longitude, name, state } = geoLocation;

	try {
		currentWeather = await fetchCurrentWeather(latitude, longitude);
		forecast = await fetchForecast(latitude, longitude);
	} catch (err) {
		console.error(err);
		return;
	}

	addCurrentWeatherContent(currentWeather, geoLocation);
	addForecastWeatherContent(forecast, geoLocation);
	addToSearchHistory(
		latitude,
		longitude,
		`${name}, ${stateNameToAbbreviation(state)}`
	);
}

searchButton.addEventListener("click", search);
